import {prisma} from "@/src/lib/prisma";

export async function getProducts() {
	return prisma.product.findMany({
		orderBy: {
			createdAt: 'desc',
		},
	});
}

export async function getProductById(id: string) {
	return prisma.product.findUnique({
		where: {
			id,
		},
	});
}