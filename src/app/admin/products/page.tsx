import Link from 'next/link';
import {prisma} from '@/src/lib/prisma';
import DeleteButton from "@/src/components/buttons/delete-button";

export default async function AdminProductsPage() {
	const products = await prisma.product.findMany({
		orderBy: {
			createdAt: 'desc',
		},
	});

	return (
			<>
				<div className="py-20">
					<div className="flex items-center justify-between mb-10">
						<h1 className="text-4xl font-bold">
							Products Management
						</h1>

						<Link
								href="/admin/products/new"
								className="
								bg-[var(--primary)]
								text-[var(--primary-foreground)]
								px-6 py-3
								rounded-full
								font-medium
								hover:opacity-90
								transition
							"
						>
							Add Product
						</Link>
					</div>

					<div className="space-y-4">
						{products.map((product) => (
								<div
										key={product.id}
										className="flex items-center justify-between bg-[var(--card)] border border-[var(--border)] p-5 rounded-2xl"
								>
									<div>
										<h2 className="font-semibold text-lg">
											{product.title}
										</h2>

										<p className="text-[var(--foreground)]/60 text-sm mt-1">
											${product.price} • {product.category}
										</p>
									</div>

									<div className="flex gap-3">
										<Link
												href={`/admin/products/${product.id}`}
												className=" px-4 py-2 border border-[var(--border)] bg-[var(--background)] rounded-full hover:border-[var(--primary)] transition"
										>
											Edit
										</Link>

										<DeleteButton id={product.id}/>
									</div>
								</div>
						))}
					</div>
				</div>
			</>
	);
}