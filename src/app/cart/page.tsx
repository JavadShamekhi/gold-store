'use client';

import Image from 'next/image';

import Navbar from '@/src/components/layout/navbar';
import Container from '@/src/components/layout/container';

import { useCartStore } from '@/src/store/cart-store';

export default function CartPage() {
	const {
		items,
		removeItem,
		increaseQuantity,
		decreaseQuantity,
	} = useCartStore();

	const totalPrice = items.reduce(
			(acc, item) => acc + item.price * item.quantity,
			0
	);

	return (
			<main>
				<Navbar />

				<Container>
					<div className="py-20">
						<h1 className="text-5xl font-bold mb-12">
							Shopping Cart
						</h1>

						{items.length === 0 ? (
								<p className="text-white/60">
									Your cart is empty.
								</p>
						) : (
								<div className="space-y-6">
									{items.map((item) => (
											<div
													key={item.id}
													className="flex flex-col md:flex-row gap-6 items-center justify-between bg-[#111111] border border-white/10 rounded-3xl p-5"
											>
												<div className="flex items-center gap-5">
													<div className="relative w-28 h-28 rounded-2xl overflow-hidden">
														<Image
																src={item.image}
																alt={item.title}
																fill
																className="object-cover"
														/>
													</div>

													<div>
														<h2 className="text-2xl font-semibold">
															{item.title}
														</h2>

														<p className="text-[#d4af37] mt-2">
															${item.price}
														</p>
													</div>
												</div>

												<div className="flex items-center gap-4">
													<button
															onClick={() =>
																	decreaseQuantity(item.id)
															}
															className="w-10 h-10 rounded-full border border-white/10 cursor-pointer"
													>
														-
													</button>

													<span className="text-lg">
                      {item.quantity}
                    </span>

													<button
															onClick={() =>
																	increaseQuantity(item.id)
															}
															className="w-10 h-10 rounded-full border border-white/10 cursor-pointer"
													>
														+
													</button>
												</div>

												<button
														onClick={() =>
																removeItem(item.id)
														}
														className="text-red-400 cursor-pointer"
												>
													Remove
												</button>
											</div>
									))}

									<div className="flex justify-between items-center mt-12">
										<h2 className="text-3xl font-bold">
											Total:
										</h2>

										<p className="text-4xl font-bold text-[#d4af37]">
											${totalPrice}
										</p>
									</div>
								</div>
						)}
					</div>
				</Container>
			</main>
	);
}