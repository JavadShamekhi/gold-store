import {prisma} from '@/src/lib/prisma';
import {getCurrentUser} from '@/src/lib/current-user';

export async function GET() {
	try {
		const user = await getCurrentUser();

		if (!user) {
			return Response.json(
					{error: 'Unauthorized'},
					{status: 401}
			);
		}

		// Get wallet
		const wallet = await prisma.wallet.findUnique({
			where: {
				userId: user.userId,
			},
		});

		if (!wallet) {
			return Response.json(
					{error: 'Wallet not found'},
					{status: 404}
			);
		}

		// Get latest gold price
		const latestPrice = await prisma.goldPrice.findFirst({
			orderBy: {
				updatedAt: 'desc',
			},
		});

		const pricePerGram = latestPrice?.pricePerGram ?? 0;

		return Response.json({
			grams: wallet.balanceG,
			pricePerGram,
			usdValue: wallet.balanceG * pricePerGram,
		});
	} catch (error) {
		console.error(error);

		return Response.json(
				{error: 'Server error'},
				{status: 500}
		);
	}
}