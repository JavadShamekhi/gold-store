import Link from 'next/link';
import Navbar from '@/src/components/layout/navbar';
import Container from '@/src/components/layout/container';
import { prisma } from '@/src/lib/prisma';
import DeleteButton from "@/src/components/admin/delete-button";

export default async function AdminProductsPage() {
	const products = await prisma.product.findMany({
		orderBy: {
			createdAt: 'desc',
		},
	});

	return (
			<>
				<Navbar />

				<Container>
					<div className="py-20">
						<div className="flex items-center justify-between mb-10">
							<h1 className="text-4xl font-bold">
								Products Management
							</h1>

							<Link
									href="/admin/products/new"
									className="bg-[#d4af37] text-black px-6 py-3 rounded-full"
							>
								Add Product
							</Link>
						</div>

						<div className="space-y-4">
							{products.map((product) => (
									<div
											key={product.id}
											className="flex items-center justify-between border border-white/10 p-4 rounded-xl"
									>
										<div>
											<h2 className="font-semibold">
												{product.title}
											</h2>

											<p className="text-white/60 text-sm">
												${product.price} • {product.category}
											</p>
										</div>

										<div className="flex gap-3">
											<Link
													href={`/admin/products/${product.id}/edit`}
													className="px-4 py-2 border border-white/10 rounded-full hover:border-[#d4af37]"
											>
												Edit
											</Link>

											<DeleteButton id={product.id} />
										</div>
									</div>
							))}
						</div>
					</div>
				</Container>
			</>
	);
}