import { prisma } from '@/src/lib/prisma';
import { GoldPriceItem } from '@/src/types/gold-price';

export const runtime = 'nodejs';
export const maxDuration = 30;

export async function GET(request: Request) {
	// Protect the cron endpoint
	const authHeader = request.headers.get('Authorization');
	if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
		return Response.json({ error: 'Unauthorized' }, { status: 401 });
	}

	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), 20000);

	try {
		const res = await fetch(
				'https://api.brsapi.ir/Market/Gold_Currency.php?key=BQ5cI32ZWyudV73G3A1fTZxKmgV7X4K4',
				{ cache: 'no-store', signal: controller.signal }
		);
		clearTimeout(timeout);

		if (!res.ok) throw new Error(`API responded with ${res.status}`);

		const data = await res.json();
		const gold18k = data?.gold?.find(
				(item: GoldPriceItem) => item.symbol === 'IR_GOLD_18K'
		);

		if (!gold18k) throw new Error('IR_GOLD_18K not found in response');

		const lastPrice = await prisma.goldPrice.findFirst({
			orderBy: { updatedAt: 'desc' },
		});

		if (!lastPrice || lastPrice.pricePerGram !== gold18k.price) {
			await prisma.goldPrice.create({
				data: { pricePerGram: gold18k.price },
			});
		}

		// Cleanup old records
		const sevenDaysAgo = new Date();
		sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
		await prisma.goldPrice.deleteMany({
			where: { updatedAt: { lt: sevenDaysAgo } },
		});

		return Response.json({ ok: true, price: gold18k.price });

	} catch (error) {
		clearTimeout(timeout);
		console.error('Cron gold fetch failed:', error);
		return Response.json({ error: String(error) }, { status: 500 });
	}
}