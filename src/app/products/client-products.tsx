'use client';

import {useMemo, useState} from 'react';

import type {Product} from '@prisma/client';

import Container from '@/src/components/layout/container';
import ProductCard from '@/src/components/product/product-card';

type Props = {
	products: Product[];
};

export default function ClientProducts({
	                                       products,
                                       }: Props) {
	const [search, setSearch] = useState('');
	const [category, setCategory] = useState('All');

	const categories = [
		'All',
		'Ring',
		'Necklace',
		'Bracelet',
		'Earrings',
	];

	const filteredProducts = useMemo(() => {
		return products.filter((product) => {
			const matchesSearch = product.title
					.toLowerCase()
					.includes(search.toLowerCase());

			const matchesCategory =
					category === 'All'
							? true
							: product.category === category;

			return (
					matchesSearch &&
					matchesCategory
			);
		});
	}, [products, search, category]);

	return (
			<Container>
				<div className="py-20">
					<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12">
						<div>
							<p className="text-[var(--primary)] uppercase tracking-[4px] text-sm">
								Collection
							</p>

							<h1 className="text-5xl font-bold mt-3 text-[var(--foreground)]">
								All Products
							</h1>
						</div>

						<div className="flex flex-col sm:flex-row gap-4">
							<input
									type="text"
									value={search}
									onChange={(e) =>
											setSearch(e.target.value)
									}
									placeholder="Search jewelery..."
									className="bg-[var(--card)]	text-[var(--card-foreground)]	border border-[var(--border)] rounded-full px-5 py-3 outline-none	transition focus:border-[var(--primary)]"
							/>

							<select
									value={category}
									onChange={(e) =>
											setCategory(e.target.value)
									}
									className="bg-[var(--card)] text-[var(--card-foreground)]	border border-[var(--border)]	rounded-full px-5 py-3 outline-none transition focus:border-[var(--primary)]	cursor-pointer"
							>
								{categories.map((item) => (
										<option
												key={item}
												value={item}
										>
											{item}
										</option>
								))}
							</select>
						</div>
					</div>

					{filteredProducts.length === 0 ? (
							<div className="h-[40vh] flex items-center justify-center">
								<p className="text-[var(--foreground)]/50 text-xl">
									No products found.
								</p>
							</div>
					) : (
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
								{filteredProducts.map(
										(product) => (
												<ProductCard
														key={product.id}
														product={product}
												/>
										)
								)}
							</div>
					)}
				</div>
			</Container>
	);
}