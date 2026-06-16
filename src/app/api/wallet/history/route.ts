import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { prisma } from '@/src/lib/prisma';

export async function GET() {
	try {
		const token = (await cookies()).get('token')?.value;

		if (!token) {
			return NextResponse.json(
					{ message: 'Unauthorized' },
					{ status: 401 }
			);
		}

		const decoded = jwt.verify(
				token,
				process.env.JWT_SECRET!
		) as {
			userId: string;
		};

		const transactions =
				await prisma.goldTransaction.findMany({
					where: {
						userId: decoded.userId,
					},
					orderBy: {
						createdAt: 'desc',
					},
					take: 50,
				});

		return NextResponse.json(transactions);
	} catch (error) {
		return NextResponse.json(
				{ message: 'Failed to load history' },
				{ status: 500 }
		);
	}
}