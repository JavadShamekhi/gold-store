import {prisma} from '@/src/lib/prisma';

export async function GET() {
	try {
		// last 7–30 records
		const history = await prisma.goldPrice.findMany({
			orderBy: {
				updatedAt: 'asc',
			},
			take: 50, // adjust later
		});

		return Response.json(
				history.map((item) => ({
					price: item.pricePerGram,
					time: item.updatedAt,
				}))
		);
	} catch (err) {
		return Response.json(
				{error: 'Failed to load history'},
				{status: 500}
		);
	}
}