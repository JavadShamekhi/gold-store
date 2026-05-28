import Navbar from '@/src/components/layout/navbar';
import Container from '@/src/components/layout/container';
import ProductCard from '@/src/components/product/product-card';

import { products } from '@/src/lib/products';

export default function Home() {
	return (
			<main>
				<Navbar />

				<section className="h-[90vh] flex items-center justify-center">
					<div className="text-center px-4">
						<h1 className="text-6xl md:text-8xl font-bold text-[#d4af37]">
							Luxury Jewelry
						</h1>

						<p className="mt-6 text-white/70 max-w-2xl mx-auto">
							Discover timeless elegance and premium handcrafted
							jewelry designed for modern luxury.
						</p>

						<button className="mt-8 bg-[#d4af37] text-black px-8 py-3 rounded-full font-medium hover:opacity-90 transition cursor-pointer">
							Explore Collection
						</button>
					</div>
				</section>

				<section className="pb-24">
					<Container>
						<div className="flex items-center justify-between mb-10">
							<div>
								<p className="text-[#d4af37] uppercase tracking-[4px] text-sm">
									Collection
								</p>

								<h2 className="text-4xl font-bold mt-2">
									Featured Products
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