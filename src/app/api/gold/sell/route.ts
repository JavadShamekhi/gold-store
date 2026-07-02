import { prisma } from '@/src/lib/prisma';
import { getCurrentUser } from '@/src/lib/current-user';

export async function POST(req: Request) {
	try {
		const user = await getCurrentUser();

		if (!user) {
			return Response.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const { grams } = await req.json();

		if (!grams || grams <= 0) {
			return Response.json({ error: 'Invalid grams' }, { status: 400 });
		}

		const lastPrice = await prisma.goldPrice.findFirst({
			orderBy: { updatedAt: 'desc' },
		});

		if (!lastPrice) {
			return Response.json({ error: 'No gold price' }, { status: 400 });
		}

		const total = grams * lastPrice.pricePerGram;

		await prisma.$transaction(async (tx) => {
			const result = await tx.wallet.updateMany({
				where: {
					userId: user.userId,
					balanceG: { gte: grams }, // guard is atomic with the write now
				},
				data: {
					balanceG: { decrement: grams },
				},
			});

			if (result.count === 0) {
				throw new Error('INSUFFICIENT_BALANCE');
			}

			await tx.goldTransaction.create({
				data: {
					userId: user.userId,
					type: 'SELL',
					grams,
					pricePerGram: lastPrice.pricePerGram,
					totalUSD: total,
				},
			});
		});

		return Response.json({
			success: true,
			message: 'Gold sold successfully',
		});
	} catch (err) {
		if (err instanceof Error && err.message === 'INSUFFICIENT_BALANCE') {
			return Response.json({ error: 'Not enough balance' }, { status: 400 });
		}

		console.error(err);
		return Response.json({ error: 'Server error' }, { status: 500 });
	}
}