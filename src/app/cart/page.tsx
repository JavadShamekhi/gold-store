'use client';

import Image from 'next/image';
import {useRouter} from "next/navigation";
import {toast} from "sonner";
import Navbar from '@/src/components/layout/navbar';
import Container from '@/src/components/layout/container';
import {useCartStore} from '@/src/store/cart-store';

export default function CartPage() {
	const {
		items,
		removeItem,
		increaseQuantity,
		decreaseQuantity,
		clearCart
	} = useCartStore();

	const router = useRouter();

	const totalPrice = items.reduce(
			(acc, item) => acc + item.price * item.quantity,
			0
	);

	const handleCheckout = async () => {
		try {
			const response = await fetch('/api/orders', {
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					items: items.map((item) => ({
						id: item.id,
						quantity: item.quantity,
					})),
				}),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(
						data.message || 'Checkout failed'
				);
			}

			clearCart();

			toast.success('Order created successfully.');

			router.push('/');
		} catch (error) {
			toast.error(
					error instanceof Error
							? error.message
							: 'Checkout failed'
			);
		}
	};

	return (
			<main className="bg-[var(--background)] text-[var(--foreground)]">
				<Navbar/>

				<Container>
					<div className="py-20">
						<h1 className="text-5xl font-bold mb-12">
							Shopping Cart
						</h1>

						{items.length === 0 ? (
								<p className="text-[var(--foreground)]/60">
									Your cart is empty.
								</p>
						) : (
								<div className="space-y-6">
									{items.map((item) => (
											<div
													key={item.id}
													className="flex flex-col md:flex-row gap-6 items-center justify-between bg-[var(--card)] border border-[var(--border)] rounded-3xl p-5 transition hover:border-[var(--primary)]/40"
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

														<p className="text-[var(--primary)] mt-2">
															${item.price}
														</p>
													</div>
												</div>

												<div className="flex items-center gap-4">
													<button
															onClick={() =>
																	decreaseQuantity(item.id)
															}
															className="w-10 h-10 rounded-full border border-[var(--border)] hover:border-[var(--primary)] transition cursor-pointer"
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
															className="w-10 h-10 rounded-full border border-[var(--border)] hover:border-[var(--primary)] transition cursor-pointer"
													>
														+
													</button>
												</div>

												<button
														onClick={() =>
																removeItem(item.id)
														}
														className="text-red-400 hover:text-red-500 transition cursor-pointer"
												>
													Remove
												</button>
											</div>
									))}

									<div className="flex justify-between items-center mt-12">
										<h2 className="text-3xl font-bold">
											Total:
										</h2>

										<p className="text-4xl font-bold text-[var(--primary)]">
											${totalPrice}
										</p>
									</div>

									<button
											onClick={handleCheckout}
											className="w-full mt-8 bg-[var(--primary)] text-[var(--primary-foreground)] py-4 rounded-full font-semibold hover:opacity-90 transition cursor-pointer"
									>
										Checkout
									</button>


								</div>
						)}
					</div>
				</Container>
			</main>
	);
}