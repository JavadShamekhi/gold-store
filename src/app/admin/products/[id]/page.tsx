import {notFound} from 'next/navigation';
import {prisma} from '@/src/lib/prisma';
import ProductForm from "@/src/components/product/product-form";

type Props = {
	params: Promise<{
		id: string;
	}>;
};

export default async function EditProductPage({
	                                              params,
                                              }: Props) {
	const {id} = await params;

	const product = await prisma.product.findUnique({
		where: {
			id: id,
		},
	});

	if (!product) {
		notFound();
	}

	return <ProductForm initialData={{
		id: product.id,
		title: product.title,
		description: product.description,
		category: product.category,
		image: product.image,
		price: product.price,
		weight: product.weight,
		stock: product.stock,
	}}/>
}