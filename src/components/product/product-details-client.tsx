'use client';

import Image from "next/image";
import AddToCartButton from "@/src/components/product/add-to-cart-button";
import Navbar from "@/src/components/layout/navbar";
import Container from "@/src/components/layout/container";
import {useLocale} from "@/src/lib/i18n/LocaleProvider";
import {Product} from "@/src/types/product";

type Props = {
	product: Product; // Use your Product type here
};

export default function ProductDetailsClient({product}: Props) {
	const {dict} = useLocale();

	if (!dict) return null;

	const t = dict.product.details;

	return (
			<>
				<Navbar/>

				<Container>
					<div className="grid md:grid-cols-2 gap-12 py-20">
						<div className="relative h-[600px] rounded-3xl overflow-hidden">
							<Image
									src={product.image}
									alt={product.title}
									fill
									className="object-cover"
							/>
						</div>

						<div>
							<p className="text-[var--(primary)] uppercase tracking-[4px]">
								{product.category}
							</p>

							<h1 className="text-5xl font-bold mt-4">
								{product.title}
							</h1>

							<p className="text-[var(--foreground)]/60 mt-6 text-lg leading-relaxed">
								{product.description}
							</p>

							<div className="mt-10 space-y-4">
								<p>
									{t.weight}:
									<span className="text-[var(--primary)] ml-2">
                  {product.weight}g
                </span>
								</p>

								<p>
									{t.stock}:
									<span className="text-[var(--primary)] ml-2">
                  {product.stock}
                </span>
								</p>
							</div>

							<div className="text-4xl font-bold text-[var(--primary)] mt-10">
								${product.price}
							</div>

							<div className="flex gap-4 mt-10">
								<AddToCartButton
										id={product.id}
										title={product.title}
										price={product.price}
										image={product.image}
								/>

								<button
										className="
									border border-[var(--border)]
									bg-[var(--card)]
									text-[var(--foreground)]
									px-8 py-4
									rounded-full
									hover:border-[var(--primary)]
									transition
									cursor-pointer
								"
								>
									{t.wishlist}
								</button>
							</div>
						</div>
					</div>
				</Container>
			</>
	);
}