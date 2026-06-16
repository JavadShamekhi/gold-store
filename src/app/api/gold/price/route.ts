import {prisma} from "@/src/lib/prisma";
import {GoldPriceItem} from "@/src/types/gold-price";

export const runtime = 'nodejs';

export async function GET() {
	try {
		const controller = new AbortController();
		const timeout = setTimeout(() => controller.abort(), 8000);

		const res = await fetch(
				'https://api.brsapi.ir/Market/Gold_Currency.php?key=BQ5cI32ZWyudV73G3A1fTZxKmgV7X4K4',
				{
					cache: 'no-store',
					signal: controller.signal,
				}
		);

		clearTimeout(timeout);

		if (!res.ok) throw new Error('API failed');

		const data = await res.json();

		const gold18k = data?.gold?.find(
				(i: GoldPriceItem) => i.symbol === 'IR_GOLD_18K'
		);

		if (!gold18k) throw new Error('No gold data');

		return Response.json({
			price: gold18k.price,
			change: gold18k.change_percent,
			time: gold18k.time,
			date: gold18k.date,
		});

	} catch (error) {
		console.error("Gold API error:", error);

		// fallback (IMPORTANT)
		const last = await prisma.goldPrice.findFirst({
			orderBy: { updatedAt: "desc" },
		});

		if (last) {
			return Response.json({
				price: last.pricePerGram,
				cached: true,
			});
		}

		return Response.json(
				{ error: "Gold service unavailable" },
				{ status: 500 }
		);
	}
}