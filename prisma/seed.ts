import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
	await prisma.product.deleteMany();

	await prisma.product.createMany({
		data: [
			{
				title: 'Royal Gold Ring',
				description: 'Luxury 18K gold ring',
				price: 1250,
				image: '/images/royal-gold-ring.jpg',
				category: 'Ring',
				weight: 18,
				stock: 15,
			},
			{
				title: 'Luxury Necklace',
				description: 'Premium necklace',
				price: 3400,
				image: '/images/necklace.jpg',
				category: 'Necklace',
				weight: 24,
				stock: 8,
			},
			{
				title: 'Diamond Bracelet',
				description: 'Luxury diamond bracelet',
				price: 2100,
				image: '/images/diamond-bracelet.jpg',
				category: 'Bracelet',
				weight: 16,
				stock: 12,
			},
			{
				title: 'Golden Earrings',
				description: 'Beautiful Golden Earrings',
				price: 980,
				image: '/images/golden-earrings.jpg',
				category: 'Earrings',
				weight: 10,
				stock: 8,
			},
		]
	});
}

main()
		.then(async () => {
			await prisma.$disconnect();
		})
		.catch(async (e) => {
			console.error(e);
			await prisma.$disconnect();
			process.exit(1);
		});
