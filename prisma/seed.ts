import {PrismaClient, Role} from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
	console.log("🌱 Seeding database...");

	// پاک کردن دیتاهای قبلی
	await prisma.goldTransaction.deleteMany();
	await prisma.wallet.deleteMany();
	await prisma.orderItem.deleteMany();
	await prisma.order.deleteMany();
	await prisma.product.deleteMany();
	await prisma.user.deleteMany();

	// =========================
	// 🟡 PRODUCTS
	// =========================
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

	// =========================
	// 👑 ADMINS
	// =========================
	const admin1 = await prisma.user.create({
		data: {
			name: "Admin One",
			email: "admin@goldstore.com",
			password: await bcrypt.hash("123456", 10),
			role: Role.ADMIN,
			wallet: {
				create: {
					balanceG: 0,
				},
			},
		},
	});

	const admin2 = await prisma.user.create({
		data: {
			name: "Admin Two",
			email: "admin2@goldstore.com",
			password: await bcrypt.hash("123456", 10),
			role: Role.ADMIN,
			wallet: {
				create: {
					balanceG: 0,
				},
			},
		},
	});

	// =========================
	// 👤 USERS
	// =========================
	const user1 = await prisma.user.create({
		data: {
			name: "Test User One",
			email: "user1@test.com",
			password: await bcrypt.hash("123456", 10),
			role: Role.CUSTOMER,
			wallet: {
				create: {
					balanceG: 2.5,
				},
			},
		},
	});

	const user2 = await prisma.user.create({
		data: {
			name: "Test User Two",
			email: "user2@test.com",
			password: await bcrypt.hash("123456", 10),
			role: Role.CUSTOMER,
			wallet: {
				create: {
					balanceG: 0.75,
				},
			},
		},
	});

	// =========================
	// 🪙 GOLD TRANSACTIONS (simulate history)
	// =========================
	await prisma.goldTransaction.createMany({
		data: [
			{
				userId: user1.id,
				type: "BUY",
				grams: 2,
				pricePerGram: 70,
				totalUSD: 140,
			},
			{
				userId: user1.id,
				type: "BUY",
				grams: 0.5,
				pricePerGram: 72,
				totalUSD: 36,
			},
			{
				userId: user2.id,
				type: "BUY",
				grams: 1,
				pricePerGram: 70,
				totalUSD: 70,
			},
		]
	});

	console.log("✅ Seed completed successfully");

}

main()
		.catch((e) => {
			console.error(e);
			process.exit(1);
		})
		.finally(async () => {
			await prisma.$disconnect();
		});