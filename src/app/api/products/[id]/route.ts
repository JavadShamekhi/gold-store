import {NextResponse} from 'next/server';
import {prisma} from '@/src/lib/prisma';

export async function DELETE(
		req: Request,
		{params}: { params: Promise<{ id: string }> }
) {
	const {id} = await params;

	await prisma.product.delete({
		where: {
			id: Number(id),
		},
	});

	return NextResponse.json({
		success: true,
	});
}

export async function PUT(
		req: Request,
		{params}: { params: Promise<{ id: string }> }
) {
	const {id} = await params;
	const body = await req.json();
	const product = await prisma.product.update({
		where: {
			id: Number(id),
		},
		data: {
			title: body.title,
			description: body.description,
			category: body.category,
			image: body.image,
			price: body.price,
			weight: body.weight,
			stock: body.stock,
		},
	});

	return NextResponse.json(product);
}