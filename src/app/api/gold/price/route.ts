import { prisma } from '@/src/lib/prisma';

export const runtime = 'nodejs';

export async function GET() {
	try {
		const lastPrice = await prisma.goldPrice.findFirst({
			orderBy: { updatedAt: 'desc' },
		});

		if (!lastPrice) {
			return Response.json(
					{ error: 'No price data available yet' },
					{ status: 503 }
			);
		}

		// If data is older than 30 minutes, warn the client
		const ageMs = Date.now() - lastPrice.updatedAt.getTime();
		const stale = ageMs > 30 * 60 * 1000;

		return Response.json({
			price: lastPrice.pricePerGram,
			updatedAt: lastPrice.updatedAt,
			stale,
			source: 'database',
		});

	} catch (error) {
		console.error('DB read error:', error);
		return Response.json({ error: 'Database error' }, { status: 500 });
	}
}