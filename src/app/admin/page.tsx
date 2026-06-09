import {prisma} from '@/src/lib/prisma';

export default async function AdminDashboardPage() {
	const [
		productsCount,
		usersCount,
		ordersCount,
	] = await Promise.all([
		prisma.product.count(),
		prisma.user.count(),
		prisma.order.count(),
	]);

	return (
			<div className="p-8">
				<h1 className="text-4xl font-bold mb-8">
					Dashboard
				</h1>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					<div className="rounded-2xl border p-6">
						<h2 className="text-sm text-muted-foreground">
							Products
						</h2>

						<p className="text-4xl font-bold mt-2">
							{productsCount}
						</p>
					</div>

					<div className="rounded-2xl border p-6">
						<h2 className="text-sm text-muted-foreground">
							Users
						</h2>

						<p className="text-4xl font-bold mt-2">
							{usersCount}
						</p>
					</div>

					<div className="rounded-2xl border p-6">
						<h2 className="text-sm text-muted-foreground">
							Orders
						</h2>

						<p className="text-4xl font-bold mt-2">
							{ordersCount}
						</p>
					</div>
				</div>
			</div>
	);
}