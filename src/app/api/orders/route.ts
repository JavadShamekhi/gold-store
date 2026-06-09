import {NextRequest, NextResponse} from "next/server";
import jwt from "jsonwebtoken";
import {prisma} from "@/src/lib/prisma";

type CartItem = {
	id: string;
	quantity: number;
};

export async function POST(req: NextRequest) {
	try {
		const token = req.cookies.get('token')?.value;

		if (!token) {
			return NextResponse.json(
					{ message: 'Unauthorized' },
					{ status: 401 }
			);
		}

		const decoded = jwt.verify(
				token,
				process.env.JWT_SECRET!,
		) as {
			userId: string;
		};

		const { items }: { items: CartItem[] } = await req.json();

		if (!items || !items.length) {
			return NextResponse.json(
					{ message: 'Cart is empty' },
					{ status: 400 }
			);
		}

		const productIds = items.map((item: CartItem) => item.id);
		const products = await prisma.product.findMany({
			where: {
				id: {
					in: productIds,
				},
			},
		});

		let totalPrice = 0;

		const orderItems = items.map((cartItem) => {
			const product = products.find(
					(p) => p.id === cartItem.id
			);

			if (!product) {
				throw new Error('Product not found');
			}

			if (product.stock < cartItem.quantity) {
				throw new Error(`${product.title} is out of stock`);
			}

			totalPrice += product.price * cartItem.quantity;

			return {
				productId: product.id,
				quantity: cartItem.quantity,
				price: product.price,
			};
		});

		const order = await prisma.order.create({
			data: {
				totalPrice,
				userId: decoded.userId,
				items: {
					create: orderItems,
				},
			},
			include: {
				items: true,
			},
		});

		for (const item of items) {
			await prisma.product.update({
				where: {
					id: item.id,
				},
				data: {
					stock: {
						decrement: item.quantity,
					},
				},
			});
		}

		return NextResponse.json(order);
	} catch (error) {
		console.error(error);

		return NextResponse.json(
				{
					message: 'Failed to create a order',
				},
				{
					status: 500,
				}
		);
	}
}