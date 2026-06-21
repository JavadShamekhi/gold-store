import {prisma} from '@/src/lib/prisma';
import HomeClient from "@/src/components/layout/home-client";

export default async function Home() {

	const products = await prisma.product.findMany({
		orderBy: {
			createdAt: 'desc'
		}
	});

	return <HomeClient products={products}/>;
}