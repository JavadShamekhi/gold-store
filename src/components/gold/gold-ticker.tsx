import { prisma } from '@/src/lib/prisma';
import { GoldPriceItem } from '@/src/types/gold-price';

export const runtime = 'nodejs';

export async function GET() {
	try {
		const controller = new AbortController();
		const timeout = setTimeout(() => controller.abort(), 8000);

		const res = await fetch(
				'https://api.brsapi.ir/Market/Gold_Currency.php?key=BQ5cI32ZWyudV73G3A1fTZxKmgV7X4K4',
				{
					cache: 'no-store',
					signal: controller.signal,
				}
		);

		clearTimeout(timeout);

		if (!res.ok) {
			throw new Error('External API failed');
		}

		const data = await res.json();

		const gold18k = data?.gold?.find(
				(item: GoldPriceItem) =>
						item.symbol === 'IR_GOLD_18K'
		);

		if (!gold18k) {
			throw new Error('Gold data not found');
		}

		// آخرین رکورد
		const lastPrice = await prisma.goldPrice.findFirst({
			orderBy: {
				updatedAt: 'desc',
			},
		});

		// فقط اگر قیمت عوض شده ذخیره کن
		if (
				!lastPrice ||
				lastPrice.pricePerGram !== gold18k.price
		) {
			await prisma.goldPrice.create({
				data: {
					pricePerGram: gold18k.price,
				},
			});
		}

		// حذف داده‌های قدیمی‌تر از 7 روز
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

		return Response.json({
			price: gold18k.price,
			change: gold18k.change_percent,
			time: gold18k.time,
			date: gold18k.date,
			source: 'live',
		});
	} catch (error) {
		console.error('Gold API Error:', error);

		// fallback از DB
		const lastPrice = await prisma.goldPrice.findFirst({
			orderBy: {
				updatedAt: 'desc',
			},
		});

		if (lastPrice) {
			return Response.json({
				price: lastPrice.pricePerGram,
				change: null,
				cached: true,
				source: 'database',
			});
		}

		return Response.json(
				{
					error: 'Gold service unavailable',
				},
				{
					status: 500,
				}
		);
	}
}