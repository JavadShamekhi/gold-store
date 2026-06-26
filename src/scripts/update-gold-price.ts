import { prisma } from "@/src/lib/prisma";
import type { GoldPriceItem } from "@/src/types/gold-price";

async function main() {
	console.log("Fetching gold price...");

	const res = await fetch(
			`https://api.brsapi.ir/Market/Gold_Currency.php?key=${process.env.BRS_API_KEY}`,
			{
				cache: "no-store",
			}
	);

	if (!res.ok) {
		throw new Error(`API returned ${res.status}`);
	}

	const data = await res.json();

	const gold18k = data.gold.find(
			(item: GoldPriceItem) =>
					item.symbol === "IR_GOLD_18K"
	);

	if (!gold18k) {
		throw new Error("IR_GOLD_18K not found");
	}

	const price = Number(gold18k.price);

	const last = await prisma.goldPrice.findFirst({
		orderBy: {
			updatedAt: "desc",
		},
	});

	if (!last || last.pricePerGram !== price) {
		await prisma.goldPrice.create({
			data: {
				pricePerGram: price,
			},
		});

		console.log("Inserted new price.");
	} else {
		console.log({
			fetchedPrice: price,
			lastPrice: last?.pricePerGram,
			changed: last?.pricePerGram !== price,
		});
	}

	const sevenDaysAgo = new Date();

	sevenDaysAgo.setDate(
			sevenDaysAgo.getDate() - 7
	);

	await prisma.goldPrice.deleteMany({
		where: {
			updatedAt: {
				lt: sevenDaysAgo,
			},
		},
	});

	console.log("Done.");
}

main()
		.catch((err) => {
			console.error(err);
			process.exit(1);
		})
		.finally(async () => {
			await prisma.$disconnect();
		});