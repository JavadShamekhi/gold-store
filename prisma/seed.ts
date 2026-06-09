import {PrismaClient, Role} from "@prisma/client";
import bcrypt from "bcryptjs";

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

	const adminEmail = 'admin@goldstore.com';
	const existingAdmin = await prisma.user.findUnique({
		where: { email: adminEmail },
	});
	if (!existingAdmin) {
		const hashedPassword = await bcrypt.hash('123456', 10);

		await prisma.user.create({
			data: {
				email: adminEmail,
				password: hashedPassword,
				role: Role.ADMIN,
			},
		});
		console.log("Admin user created");
	}

	console.log("Seed completed");
}

main()
		.catch((e) => {
			console.error(e);
			process.exit(1);
		})
		.finally(async () => {
			await prisma.$disconnect();
		});
