'use client';

import {useCartStore} from "@/src/store/cart-store";
import {toast} from "sonner";

type Props = {
	id: string;
	title: string;
	price: number;
	image: string;
};

export default function AddToCartButton({id, title, price, image,}: Props) {
	const addItem = useCartStore((state) => state.addItem);

	const handleClick = () => {
		addItem({
			id,
			title,
			price,
			image,
			quantity: 1,
		});

		toast.success('Product added to cart');
	};

	return (
			<button
				onClick={handleClick}
				className="bg-[#d4af37] text-black px-8 py-4 rounded-full font-semibold hover:opacity-90 transition cursor-pointer"
			>
				Add To Cart
			</button>
	)
}