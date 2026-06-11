import { prisma } from '@/src/lib/prisma';
import AdminDashboardClient from './dashboard-client';

export default async function AdminDashboardPage() {
	// Fetch all stats in parallel for performance
	const [productsCount, usersCount, ordersCount] = await Promise.all([
		prisma.product.count(),
		prisma.user.count(),
		prisma.order.count(),
	]);

	// Pass data to the Client Component
	return (
			<AdminDashboardClient
					stats={{
						products: productsCount,
						users: usersCount,
						orders: ordersCount
					}}
			/>
	);
}