'use client';

import Link from 'next/link';
import {
	Package,
	Users,
	ShoppingCart,
	TrendingUp,
	Plus,
	ArrowRight,
	Boxes,
} from 'lucide-react';
import { useT } from '@/src/i18n/use-t';

interface DashboardProps {
	stats: {
		products: number;
		users: number;
		orders: number;
	};
}

export default function AdminDashboardClient({
	                                             stats,
                                             }: DashboardProps) {
	const t = useT();

	return (
			<div className="space-y-10">

				{/* HERO */}
				<div className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--card)] p-8 md:p-10">

					<div className="absolute top-0 right-0 w-72 h-72 bg-[var(--primary)]/10 blur-3xl rounded-full" />

					<div className="relative z-10">
						<p className="text-sm uppercase tracking-[4px] text-[var(--primary)]">
							ZARRIN ADMIN
						</p>

						<h1 suppressHydrationWarning className="mt-4 text-4xl md:text-5xl font-bold">
							{t('dashboard') || 'Dashboard'}
						</h1>

						<p className="mt-4 max-w-2xl text-[var(--foreground)]/60">
							{t('storeOverview') ||
									'Manage products, orders and customers from one place.'}
						</p>
					</div>
				</div>

				{/* STATS */}
				<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

					<StatCard
							title={t('products') || 'Products'}
							value={stats.products}
							description="Available items"
							icon={<Package size={24} />}
					/>

					<StatCard
							title={t('orders') || 'Orders'}
							value={stats.orders}
							description="Customer purchases"
							icon={<ShoppingCart size={24} />}
					/>

					<StatCard
							title={t('users') || 'Users'}
							value={stats.users}
							description="Registered customers"
							icon={<Users size={24} />}
					/>

					<StatCard
							title={t('growth') || 'Growth'}
							value="+12%"
							description="This month"
							icon={<TrendingUp size={24} />}
					/>

				</div>

				{/* CONTENT */}
				<div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

					{/* QUICK ACTIONS */}
					<div className="xl:col-span-2 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-8">

						<h2 className="text-2xl font-bold mb-6">
							{t('quickActions') || 'Quick Actions'}
						</h2>

						<div className="grid md:grid-cols-3 gap-4">

							<Link
									href="/admin/products/new"
									className="group rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5 hover:border-[var(--primary)] transition"
							>
								<Plus className="text-[var(--primary)] mb-4" />

								<h3 className="font-semibold">
									{t('addProduct') || 'Add Product'}
								</h3>

								<p className="text-sm text-[var(--foreground)]/50 mt-2">
									Create a new product
								</p>
							</Link>

							<Link
									href="/admin/products"
									className="group rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5 hover:border-[var(--primary)] transition"
							>
								<Boxes className="text-[var(--primary)] mb-4" />

								<h3 className="font-semibold">
									{t('manageProducts') || 'Manage Products'}
								</h3>

								<p className="text-sm text-[var(--foreground)]/50 mt-2">
									Edit and remove products
								</p>
							</Link>

							<Link
									href="/admin/orders"
									className="group rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5 hover:border-[var(--primary)] transition"
							>
								<ShoppingCart className="text-[var(--primary)] mb-4" />

								<h3 className="font-semibold">
									{t('viewOrders') || 'View Orders'}
								</h3>

								<p className="text-sm text-[var(--foreground)]/50 mt-2">
									Check customer orders
								</p>
							</Link>

						</div>
					</div>

					{/* STORE STATUS */}
					<div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-8">

						<h2 className="text-2xl font-bold mb-6">
							Store Status
						</h2>

						<div className="space-y-6">

							<div>
								<div className="flex justify-between mb-2 text-sm">
									<span>Products</span>
									<span>{stats.products}</span>
								</div>

								<div className="h-2 rounded-full bg-[var(--background)]">
									<div className="h-2 w-[75%] rounded-full bg-[var(--primary)]" />
								</div>
							</div>

							<div>
								<div className="flex justify-between mb-2 text-sm">
									<span>Orders</span>
									<span>{stats.orders}</span>
								</div>

								<div className="h-2 rounded-full bg-[var(--background)]">
									<div className="h-2 w-[55%] rounded-full bg-[var(--primary)]" />
								</div>
							</div>

							<div>
								<div className="flex justify-between mb-2 text-sm">
									<span>Users</span>
									<span>{stats.users}</span>
								</div>

								<div className="h-2 rounded-full bg-[var(--background)]">
									<div className="h-2 w-[85%] rounded-full bg-[var(--primary)]" />
								</div>
							</div>

						</div>

						<Link
								href="/admin/products"
								className="mt-8 inline-flex items-center gap-2 text-[var(--primary)] font-medium"
						>
							View Details
							<ArrowRight size={16} />
						</Link>
					</div>

				</div>

			</div>
	);
}

function StatCard({
	                  title,
	                  value,
	                  description,
	                  icon,
                  }: {
	title: string;
	value: string | number;
	description: string;
	icon: React.ReactNode;
}) {
	return (
			<div className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 hover:border-[var(--primary)]/40 transition-all duration-300">

				<div className="absolute top-0 right-0 w-24 h-24 bg-[var(--primary)]/5 blur-2xl rounded-full" />

				<div className="relative z-10">

					<div className="w-12 h-12 rounded-2xl bg-[var(--background)] border border-[var(--border)] flex items-center justify-center text-[var(--primary)]">
						{icon}
					</div>

					<p className="mt-5 text-sm uppercase tracking-wider text-[var(--foreground)]/50">
						{title}
					</p>

					<h3 className="text-5xl font-bold mt-2">
						{value}
					</h3>

					<p className="text-sm text-[var(--foreground)]/50 mt-3">
						{description}
					</p>

				</div>
			</div>
	);
}