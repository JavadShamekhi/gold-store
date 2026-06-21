'use client';

import {useMemo, useState} from 'react';

import type {Product} from '@prisma/client';

import Container from '@/src/components/layout/container';
import ProductCard from '@/src/components/product/product-card';
import {useLocale} from "@/src/lib/i18n/LocaleProvider";

type Props = {
	products: Product[];
};

export default function ClientProducts({
	                                       products,
                                       }: Props) {
	const [search, setSearch] = useState('');
	const [category, setCategory] = useState('All');
	const {dict} = useLocale();

	const filteredProducts = useMemo(() => {
		return products.filter((product) => {
			const matchesSearch = product.title
					.toLowerCase()
					.includes(search.toLowerCase());

			const matchesCategory =
					category === 'All'
							? true
							: product.category === category;

			return matchesSearch && matchesCategory;
		});
	}, [products, search, category]);

	if (!dict) return null;

	const t = dict.product.productList;

	const categories = [
		{key: 'All', label: t.categories.all},
		{key: 'Ring', label: t.categories.ring},
		{key: 'Necklace', label: t.categories.necklace},
		{key: 'Bracelet', label: t.categories.bracelet},
		{key: 'Earrings', label: t.categories.earrings},
	];

	return (
			<Container>
				<div className="py-20">
					<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12">
						<div>
							<p className="text-[var(--primary)] uppercase tracking-[4px] text-sm">
								{t.subtitle}
							</p>

							<h1 className="text-5xl font-bold mt-3 text-[var(--foreground)]">
								{t.title}
							</h1>
						</div>

						<div className="flex flex-col sm:flex-row gap-4">
							<input
									type="text"
									value={search}
									onChange={(e) =>
											setSearch(e.target.value)
									}
									placeholder={t.searchPlaceholder}
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
												key={item.key}
												value={item.key}
										>
											{item.label}
										</option>
								))}
							</select>
						</div>
					</div>

					{filteredProducts.length === 0 ? (
							<div className="h-[40vh] flex items-center justify-center">
								<p className="text-[var(--foreground)]/50 text-xl">
									{t.noProducts}
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