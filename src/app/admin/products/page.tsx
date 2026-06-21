import {prisma} from '@/src/lib/prisma';
import ProductListClient from "@/src/components/product/product-list-client";

export default async function AdminProductsPage() {

	const products = await prisma.product.findMany({
		orderBy: {
			createdAt: 'desc',
		},
		select: {
			id: true,
			title: true,
			price: true,
			category: true,
		}
	});

	return <ProductListClient products={products}/>
}