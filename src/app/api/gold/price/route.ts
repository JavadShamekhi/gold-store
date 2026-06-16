import {prisma} from "@/src/lib/prisma";
import {GoldPriceItem} from "@/src/types/gold-price";

export async function GET() {
	try {
		const res = await fetch(
				'https://api.brsapi.ir/Market/Gold_Currency.php?key=BQ5cI32ZWyudV73G3A1fTZxKmgV7X4K4',
				{cache: 'no-store'}
		);

		const data = await res.json();

		// 👇 extract 18K gold
		const gold18k = data?.gold.find(
				(item: GoldPriceItem) => item.symbol === 'IR_GOLD_18K'
		);

		if (!gold18k) {
			return Response.json(
					{error: 'Gold data not found'},
					{status: 404}
			);
		}

		// 🔥 CHECK LAST SAVED PRICE (prevent duplicates)
		const last = await prisma.goldPrice.findFirst({
			orderBy: {updatedAt: "desc"},
		});

		if (last && last.pricePerGram === gold18k.price) {
			return Response.json({
				cached: true,
				price: last.pricePerGram,
			});
		}

		// 💾 SAVE TO DATABASE
		await prisma.goldPrice.create({
			data: {
				pricePerGram: gold18k.price,
			},
		});

		// 🧹 DELETE OLD DATA (older than 7 days)
		const sevenDaysAgo = new Date();
		sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

		await prisma.goldPrice.deleteMany({
			where: {
				updatedAt: {
					lt: sevenDaysAgo,
				},
			},
		});

		return Response.json({
			price: gold18k.price,
			change: gold18k.change_percent,
			time: gold18k.time,
			date: gold18k.date,
		});
	} catch (error) {
		return Response.json(
				{error: 'Failed to fetch gold price'},
				{status: 500}
		);
	}
}