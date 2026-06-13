import {prisma} from '@/src/lib/prisma';
import {getCurrentUser} from '@/src/lib/current-user';

export async function POST(req: Request) {
	try {
		const user = await getCurrentUser();

		if (!user) {
			return Response.json(
					{error: 'Unauthorized'},
					{status: 401}
			);
		}

		const {grams} = await req.json();

		if (!grams || grams <= 0) {
			return Response.json(
					{error: 'Invalid grams'},
					{status: 400}
			);
		}

		// get latest gold price
		const lastPrice = await prisma.goldPrice.findFirst({
			orderBy: {
				updatedAt: 'desc',
			},
		});

		if (!lastPrice) {
			return Response.json(
					{error: 'No gold price available'},
					{status: 400}
			);
		}

		const total = grams * lastPrice.pricePerGram;

		await prisma.$transaction(async (tx) => {
			// wallet update
			await tx.wallet.upsert({
				where: {
					userId: user.userId,
				},
				create: {
					userId: user.userId,
					balanceG: grams,
				},
				update: {
					balanceG: {
						increment: grams,
					},
				},
			});

			// transaction record
			await tx.goldTransaction.create({
				data: {
					userId: user.userId,
					type: 'BUY',
					grams,
					pricePerGram: lastPrice.pricePerGram,
					totalUSD: total,
				},
			});
		});

		return Response.json({
			success: true,
			message: 'Gold purchased successfully',
		});
	} catch (err) {
		console.error(err);

		return Response.json(
				{error: 'Server error'},
				{status: 500}
		);
	}
}