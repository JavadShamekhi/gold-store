import {prisma} from "@/src/lib/prisma";
import {NextResponse} from "next/server";

export async function POST(req: Request) {
	try {
		const body = await req.json();

		const product = await prisma.product.create({
			data: {
				title: body.title,
				description: body.description,
				price: body.price,
				weight: body.weight,
				stock: body.stock,
				image: body.image,
				category: body.category,
			},
		});

		return NextResponse.json(product);
	} catch {
		return NextResponse.json(
				{error: 'Failed to create product'},
				{status: 500}
		);
	}
}