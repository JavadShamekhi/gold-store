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
				{/* TRIGGER */}
				<SheetTrigger asChild>
					<button className="relative hover:text-[var(--primary)] transition cursor-pointer">
						<ShoppingCart size={22} />

						{items.length > 0 && (
								<span className="
							absolute -top-2 -right-2
							bg-[var(--primary)]
							text-black text-xs
							w-5 h-5 rounded-full
							flex items-center justify-center
						">
							{items.length}
						</span>
						)}
					</button>
				</SheetTrigger>

				{/* DRAWER */}
				<SheetContent className="
				bg-[var(--background)]
				text-[var(--foreground)]
				border-l border-[var(--border)]
				w-full sm:max-w-lg
			">
					<SheetHeader>
						<SheetTitle className="text-2xl text-[var(--foreground)]">
							Shopping Cart
						</SheetTitle>
					</SheetHeader>

					<div className="mt-10 mx-5 flex flex-col gap-6">

						{/* EMPTY */}
						{items.length === 0 ? (
								<p className="text-[var(--foreground)]/60">
									Your cart is empty.
								</p>
						) : (
								<>
									{/* ITEMS */}
									{items.map((item) => (
											<div
													key={item.id}
													className="
										flex gap-4 pb-5
										border-b border-[var(--border)]
									"
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
													<h3 className="font-semibold text-[var(--foreground)]">
														{item.title}
													</h3>

													<p className="text-[var(--primary)] mt-2">
														${item.price}
													</p>

													<p className="text-sm text-[var(--foreground)]/60 mt-1">
														Qty: {item.quantity}
													</p>
												</div>
											</div>
									))}

									{/* TOTAL */}
									<div className="
								flex items-center justify-between mt-6
								text-[var(--foreground)]
							">
								<span className="text-xl font-semibold">
									Total
								</span>

										<span className="text-2xl font-bold text-[var(--primary)]">
									${totalPrice}
								</span>
									</div>

									{/* CTA */}
									<Link
											href="/cart"
											className="
									bg-[var(--primary)]
									text-black text-center
									py-4 rounded-full
									font-semibold
									hover:opacity-90
									transition
								"
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