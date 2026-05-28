'use client';

import Image from 'next/image';
import Link from 'next/link';

import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/src/components/ui/sheet';

import { ShoppingCart } from 'lucide-react';

import { useCartStore } from '@/src/store/cart-store';

const CartDrawer = () => {
	const items = useCartStore((state) => state.items);

	const totalPrice = items.reduce(
			(acc, item) => acc + item.price * item.quantity,
			0
	);

	return (
			<Sheet>
				<SheetTrigger asChild>
					<button className="relative hover:text-[#d4af37] transition cursor-pointer">
						<ShoppingCart size={22} />

						{items.length > 0 && (
								<span className="absolute -top-2 -right-2 bg-[#d4af37] text-black text-xs w-5 h-5 rounded-full flex items-center justify-center">
              {items.length}
            </span>
						)}
					</button>
				</SheetTrigger>

				<SheetContent className="bg-[#0a0a0a] border-l border-white/10 text-white w-full sm:max-w-lg">
					<SheetHeader>
						<SheetTitle className="text-white text-2xl">
							Shopping Cart
						</SheetTitle>
					</SheetHeader>

					<div className="mt-10 ml-5 mr-5 flex flex-col gap-6">
						{items.length === 0 ? (
								<p className="text-white/60">
									Your cart is empty.
								</p>
						) : (
								<>
									{items.map((item) => (
											<div
													key={item.id}
													className="flex gap-4 border-b border-white/10 pb-5"
											>
												<div className="relative w-24 h-24 rounded-2xl overflow-hidden">
													<Image
															src={item.image}
															alt={item.title}
															fill
															className="object-cover"
													/>
												</div>

												<div className="flex-1">
													<h3 className="font-semibold">
														{item.title}
													</h3>

													<p className="text-[#d4af37] mt-2">
														${item.price}
													</p>

													<p className="text-sm text-white/60 mt-1">
														Qty: {item.quantity}
													</p>
												</div>
											</div>
									))}

									<div className="flex items-center justify-between mt-6">
                <span className="text-xl font-semibold">
                  Total
                </span>

										<span className="text-2xl font-bold text-[#d4af37]">
                  ${totalPrice}
                </span>
									</div>

									<Link
											href="/cart"
											className="bg-[#d4af37] text-black text-center py-4 rounded-full font-semibold hover:opacity-90 transition"
									>
										Go To Cart
									</Link>
								</>
						)}
					</div>
				</SheetContent>
			</Sheet>
	);
};

export default CartDrawer;