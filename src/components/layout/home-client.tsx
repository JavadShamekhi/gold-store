'use client';

import Navbar from '@/src/components/layout/navbar';
import Container from '@/src/components/layout/container';
import ProductCard from '@/src/components/product/product-card';
import {useLocale} from "@/src/lib/i18n/LocaleProvider";
import {Product} from "@/src/types/product";
import {useEffect} from "react";

type Props = {
	products: Product[];
};

export default function HomeClient({products}: Props) {
	const {dict} = useLocale();

	if (!dict) return null;

	const t = dict?.home;

	return (
			<main className="bg-[var(--background)] text-[var(--foreground)]">
				<Navbar/>

				<section className="h-[90vh] flex items-center justify-center">
					<div className="text-center px-4">
						<h1 className="text-6xl md:text-8xl font-bold text-[var(--primary)]">
							{t.hero?.title}
						</h1>

						<p className="mt-6 text-[var(--foreground)]/70 max-w-2xl mx-auto">
							{t.hero?.description}
						</p>

						<button
								className="mt-8 bg-[var(--primary)] text-[var(--primary-foreground)] px-8 py-3 rounded-full font-medium hover:opacity-90 transition cursor-pointer">
							{t.hero?.button}
						</button>
					</div>
				</section>

				<section className="pb-24">
					<Container>
						<div className="flex items-center justify-between mb-10">
							<div>
								<p className="text-[var(--primary)] uppercase tracking-[4px] text-sm">
									{t.collection?.subtitle}
								</p>

								<h2 className="text-4xl font-bold mt-2">
									{t.collection?.title}
								</h2>
							</div>
						</div>

						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
							{products.map((product) => (
									<ProductCard
											key={product.id}
											product={product}
									/>
							))}
						</div>
					</Container>
				</section>
			</main>
	);
}