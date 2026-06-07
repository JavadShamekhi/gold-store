'use client';

import Image from 'next/image';
import Link from 'next/link';
import {Product} from "@/src/types/product";

import { toast} from "sonner";
import { useCartStore} from "@/src/store/cart-store";

type Props = {
	product: Product;
};

const ProductCard = ({ product }: Props) => {
	const addItem = useCartStore((state) => state.addItem);

	return (
			<Link href={`/products/${product.id}`}>
				<div className="group bg-[#111111] rounded-3xl overflow-hidden border border-white/10 hover:border-[#d4af37]/40 transition duration-300">
					<div className="relative h-[320px] overflow-hidden">
						<Image
								src={product.image}
								alt={product.title}
								fill
								sizes="(max-width), (max-height)"
								className="object-cover group-hover:scale-110 transition duration-500"
						/>
					</div>

					<div className="p-5">
						<div className="flex items-center justify-between">
            <span className="text-xs text-[#d4af37] uppercase tracking-widest">
              {product.category}
            </span>

							<span className="text-sm text-white/60">
              {product.weight}
            </span>
						</div>

						<h3 className="mt-3 text-2xl font-semibold">
							{product.title}
						</h3>

						<div className="mt-5 flex items-center justify-between">
            <span className="text-xl font-bold text-[#d4af37]">
              ${product.price}
            </span>

							<button
									onClick={(e) => {
										e.preventDefault();

										addItem({
											id: product.id,
											title: product.title,
											price: product.price,
											image: product.image,
											quantity: 1,
										});

										toast.success('Product added to cart');
									}}
									className="bg-[#d4af37] text-black px-4 py-2 rounded-full text-sm font-medium hover:opacity-90 transition cursor-pointer"
							>
								Add to Cart
							</button>
						</div>
					</div>
				</div>
			</Link>
	);
};

export default ProductCard;