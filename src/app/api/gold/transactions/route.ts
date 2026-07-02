import {NextResponse} from 'next/server';
import {prisma} from '@/src/lib/prisma';
import {getCurrentUser} from '@/src/lib/current-user';

export async function GET(req: Request) {
	try {
		const user = await getCurrentUser();

		if (!user) {
			return NextResponse.json({error: 'Unauthorized'}, {status: 401});
		}

		const {searchParams} = new URL(req.url);
		const requestedUserId = searchParams.get('userId');

		let targetUserId = user.userId;

		if (requestedUserId && requestedUserId !== user.userId) {
			const dbUser = await prisma.user.findUnique({
				where: {id: user.userId},
				select: {role: true},
			});

			if (dbUser?.role !== 'ADMIN') {
				return NextResponse.json({error: 'Forbidden'}, {status: 403});
			}

			targetUserId = requestedUserId;
		}

		const transactions = await prisma.goldTransaction.findMany({
			where: {userId: targetUserId},
			orderBy: {createdAt: 'desc'},
			take: 100,
		});

		return NextResponse.json(transactions);
	} catch (error) {
		console.error('Transaction history error:', error);
		return NextResponse.json({error: 'Failed to load history'}, {status: 500});
	}
}