'use client';

import Navbar from '@/src/components/layout/navbar';
import Container from '@/src/components/layout/container';
import ProductCard from '@/src/components/product/product-card';
import {useLocale} from "@/src/lib/i18n/LocaleProvider";
import {Product} from "@/src/types/product";

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

				<section id="about" className="py-24 scroll-mt-24 border-t border-[var(--border)]">
					<Container>
						<div className="grid md:grid-cols-2 gap-12 items-center">
							<div>
								<p className="text-[var(--primary)] uppercase tracking-[4px] text-sm">
									{t.about?.subtitle}
								</p>
								<h2 className="text-4xl font-bold mt-2 mb-6">
									{t.about?.title}
								</h2>
								<p className="text-[var(--foreground)]/70 leading-relaxed">
									{t.about?.description}
								</p>
							</div>

							<div className="grid grid-cols-2 gap-6">
								<div className="bg-[var(--card)] border border-[#d4af37]/30 rounded-2xl p-6 text-center">
									<p className="text-3xl font-bold text-[#d4af37]">{t.about?.stats?.yearsValue}</p>
									<p className="text-sm text-[var(--foreground)]/60 mt-1">{t.about?.stats?.yearsLabel}</p>
								</div>
								<div className="bg-[var(--card)] border border-[#d4af37]/30 rounded-2xl p-6 text-center">
									<p className="text-3xl font-bold text-[#d4af37]">{t.about?.stats?.customersValue}</p>
									<p className="text-sm text-[var(--foreground)]/60 mt-1">{t.about?.stats?.customersLabel}</p>
								</div>
							</div>
						</div>
					</Container>
				</section>

				<section id="contact" className="py-24 scroll-mt-24 border-t border-[var(--border)]">
					<Container>
						<div className="text-center mb-12">
							<p className="text-[var(--primary)] uppercase tracking-[4px] text-sm">
								{t.contact?.subtitle}
							</p>
							<h2 className="text-4xl font-bold mt-2">
								{t.contact?.title}
							</h2>
						</div>

						<div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
							<div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 text-center">
								<p className="text-sm text-[var(--foreground)]/60 mb-1">{t.contact?.phoneLabel}</p>
								<p className="font-bold" dir="ltr">{t.contact?.phoneValue}</p>
							</div>
							<div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 text-center">
								<p className="text-sm text-[var(--foreground)]/60 mb-1">{t.contact?.emailLabel}</p>
								<p className="font-bold" dir="ltr">{t.contact?.emailValue}</p>
							</div>
							<div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 text-center">
								<p className="text-sm text-[var(--foreground)]/60 mb-1">{t.contact?.addressLabel}</p>
								<p className="font-bold">{t.contact?.addressValue}</p>
							</div>
						</div>
					</Container>
				</section>

			</main>
	);
}