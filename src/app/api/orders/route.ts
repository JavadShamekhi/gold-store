import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { getCurrentUser } from '@/src/lib/current-user';

type CartItem = {
	id: string;
	quantity: number;
};

export async function POST(req: NextRequest) {
	try {
		const user = await getCurrentUser();

		if (!user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const { items }: { items: CartItem[] } = await req.json();

		if (!items || !items.length) {
			return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
		}

		const productIds = items.map((item) => item.id);
		const products = await prisma.product.findMany({
			where: { id: { in: productIds } },
		});

		let totalPrice = 0;

		const orderItems = items.map((cartItem) => {
			const product = products.find((p) => p.id === cartItem.id);

			if (!product) {
				throw new Error('PRODUCT_NOT_FOUND');
			}

			if (product.stock < cartItem.quantity) {
				throw new Error(`OUT_OF_STOCK:${product.title}`);
			}

			totalPrice += product.price * cartItem.quantity;

			return {
				productId: product.id,
				quantity: cartItem.quantity,
				price: product.price,
			};
		});

		const order = await prisma.$transaction(async (tx) => {
			for (const item of items) {
				const result = await tx.product.updateMany({
					where: {
						id: item.id,
						stock: { gte: item.quantity },
					},
					data: {
						stock: { decrement: item.quantity },
					},
				});

				if (result.count === 0) {
					throw new Error('STOCK_CHANGED');
				}
			}

			return tx.order.create({
				data: {
					totalPrice,
					userId: user.userId,
					items: {
						create: orderItems,
					},
				},
				include: {
					items: true,
				},
			});
		});

		return NextResponse.json(order);
	} catch (error) {
		if (error instanceof Error) {
			if (error.message === 'PRODUCT_NOT_FOUND') {
				return NextResponse.json({ error: 'One or more products no longer exist' }, { status: 400 });
			}
			if (error.message.startsWith('OUT_OF_STOCK:')) {
				return NextResponse.json(
						{ error: `${error.message.split(':')[1]} is out of stock` },
						{ status: 400 }
				);
			}
			if (error.message === 'STOCK_CHANGED') {
				return NextResponse.json(
						{ error: 'Stock changed before your order could complete, please try again' },
						{ status: 409 }
				);
			}
		}

		console.error(error);
		return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
	}
}