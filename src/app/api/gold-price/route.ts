export async function GET() {
	try {
		const res = await fetch(
				'https://api.brsapi.ir/Market/Gold_Currency.php?key=BQ5cI32ZWyudV73G3A1fTZxKmgV7X4K4',
				{cache: 'no-store'}
		);

		const data = await res.json();

		// 👇 extract 18K gold
		const gold18k = data?.gold.find(
				(item) => item.symbol === 'IR_GOLD_18K'
		);

		if (!gold18k) {
			return Response.json(
					{error: 'Gold data not found'},
					{status: 404}
			);
		}

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