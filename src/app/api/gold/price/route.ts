import {prisma} from '@/src/lib/prisma';
import {number, string} from "zod";

export const runtime = 'nodejs';

export async function GET() {
	try {
		const lastPrice = await prisma.goldPrice.findFirst({
			orderBy: {updatedAt: 'desc'},
		});

		const previousPrice = lastPrice
				? await prisma.goldPrice.findFirst({
					where: {updatedAt: {lt: lastPrice.updatedAt}},
					orderBy: {updatedAt: 'desc'},
				})
				: null;

		if (!lastPrice) {
			return Response.json(
					{error: 'No price data available yet'},
					{status: 503}
			);
		}

		// If data is older than 30 minutes, warn the client
		const ageMs = Date.now() - lastPrice.updatedAt.getTime();
		const stale = ageMs > 30 * 60 * 1000;

		let changePercent: number | null = null;
		let changeDirection: 'up' | 'down' | 'unchanged' | null = null;

		if (previousPrice) {
			const diff = lastPrice.pricePerGram - previousPrice.pricePerGram;
			changePercent = (diff / previousPrice.pricePerGram) * 100;
			changeDirection = diff > 0 ? 'up' : diff < 0 ? 'down' : 'unchanged';
		}

		return Response.json({
			price: lastPrice.pricePerGram,
			updatedAt: lastPrice.updatedAt,
			stale,
			source: 'database',
			change: {
				percent: changePercent,
				direction: changeDirection,
				previousPrice: previousPrice?.pricePerGram ?? null,
			}
		});

	} catch (error) {
		console.error('DB read error:', error);
		return Response.json({error: 'Database error'}, {status: 500});
	}
}