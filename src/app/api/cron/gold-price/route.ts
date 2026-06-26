import {prisma} from '@/src/lib/prisma';
import {GoldPriceItem} from '@/src/types/gold-price';

export const runtime = 'nodejs';
export const maxDuration = 30;

export async function GET(request: Request) {
	// Protect the cron endpoint
	const authHeader = request.headers.get('Authorization');
	if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
		return Response.json({error: 'Unauthorized'}, {status: 401});
	}

	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), 20000);

	try {
		const res = await fetch(
				'https://api.brsapi.ir/Market/Gold_Currency.php?key=BQ5cI32ZWyudV73G3A1fTZxKmgV7X4K4',
				{cache: 'no-store', signal: controller.signal}
		);
		clearTimeout(timeout);

		if (!res.ok) throw new Error(`API responded with ${res.status}`);

		const data = await res.json();
		const gold18k = data?.gold?.find(
				(item: GoldPriceItem) => item.symbol === 'IR_GOLD_18K'
		);

		if (!gold18k) {
			// TEMP: log the actual shape of the response so we can see field names/types
			console.error('IR_GOLD_18K not found. Raw gold array:', JSON.stringify(data?.gold));
			throw new Error('IR_GOLD_18K not found in response');
		}

		// FIX #1: force numeric type — brsapi often returns price as a string
		const priceNum = Number(gold18k.price);
		if (!Number.isFinite(priceNum)) {
			throw new Error(`Invalid numeric price from API: ${JSON.stringify(gold18k.price)}`);
		}

		// TEMP: confirm which DB host this function is actually connected to
		console.log('DB host in use:', process.env.DATABASE_URL?.split('@')[1]?.split('/')[0]);

		const lastPrice = await prisma.goldPrice.findFirst({
			orderBy: {updatedAt: 'desc'},
		});

		console.log('lastPrice from DB:', lastPrice);

		if (!lastPrice || lastPrice.pricePerGram !== priceNum) {
			const created = await prisma.goldPrice.create({
				data: {pricePerGram: priceNum},
			});
			console.log('Inserted new row:', created);
		} else {
			console.log('Price unchanged, skipping insert.');
		}

		// Cleanup old records
		const sevenDaysAgo = new Date();
		sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
		await prisma.goldPrice.deleteMany({
			where: {updatedAt: {lt: sevenDaysAgo}},
		});

		return Response.json({ok: true, price: priceNum});

	} catch (error) {
		clearTimeout(timeout);
		console.error('Cron gold fetch failed:', error);
		// TEMP: return full error message in response so you can see it without digging through logs
		return Response.json(
				{error: error instanceof Error ? error.message : String(error)},
				{status: 500}
		);
	}
}