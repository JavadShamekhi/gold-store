'use client';

import {useState, useEffect} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {ShoppingCart, X} from 'lucide-react';
import {useCartStore} from '@/src/store/cart-store';

const CartDrawer = () => {
	const [isOpen, setIsOpen] = useState(false);
	const items = useCartStore((state) => state.items);

	const totalPrice = items.reduce(
			(acc, item) => acc + item.price * item.quantity,
			0
	);

	// Prevent scrolling when drawer is open
	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = 'unset';
		}
	}, [isOpen]);

	useEffect(() => {
		const handleEsc = (e: KeyboardEvent) => {
			if (e.key === 'Escape') setIsOpen(false);
		};
		window.addEventListener('keydown', handleEsc);
		return () => window.removeEventListener('keydown', handleEsc);
	}, []);

	return (
			<>
				{/* TRIGGER BUTTON */}
				<button
						onClick={() => setIsOpen(true)}
						className="relative hover:text-[var(--primary)] transition cursor-pointer bg-transparent border-none"
				>
					<ShoppingCart size={22}/>
					{items.length > 0 && (
							<span
									className="absolute -top-2 -right-2 bg-[var(--primary)] text-black text-xs w-5 h-5 rounded-full flex items-center justify-center">
						{items.length}
					</span>
					)}
				</button>

				{/* BACKDROP (The dark blur part) */}
				<div
						className={`
					fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm transition-opacity duration-1000 ease-in-out
					${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}
				`}
						onClick={() => setIsOpen(false)}
				/>

				{/* DRAWER PANEL */}
				<div
						className={`
					fixed top-0 right-0 z-[101] h-full w-full sm:max-w-lg bg-[var(--background)] 
					border-l border-[var(--border)] shadow-2xl transform transition-transform duration-1000 ease-in-out
					${isOpen ? 'translate-x-0' : 'translate-x-full'}
				`}
				>
					{/* CLOSE BUTTON */}
					<button
							onClick={() => setIsOpen(false)}
							className="absolute top-5 right-5 p-2 hover:bg-white/10 rounded-full transition cursor-pointer"
					>
						<X size={24} className="text-[var(--foreground)]"/>
					</button>

					<div className="h-full flex flex-col p-8">
						<h2 className="text-2xl font-bold text-[var(--foreground)] mb-10">
							Shopping Cart
						</h2>

						<div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
							{/* EMPTY STATE */}
							{items.length === 0 ? (
									<p className="text-[var(--foreground)]/60">
										Your cart is empty.
									</p>
							) : (
									<div className="flex flex-col gap-6">
										{/* ITEMS */}
										{items.map((item) => (
												<div key={item.id} className="flex gap-4 pb-5 border-b border-[var(--border)]">
													<div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-white/5">
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
														<p className="text-[var(--primary)] mt-2 font-medium">
															${item.price}
														</p>
														<p className="text-sm text-[var(--foreground)]/60 mt-1">
															Qty: {item.quantity}
														</p>
													</div>
												</div>
										))}
									</div>
							)}
						</div>

						{/* FOOTER / TOTAL */}
						{items.length > 0 && (
								<div className="mt-auto pt-6 border-t border-[var(--border)]">
									<div className="flex items-center justify-between mb-6">
								<span className="text-xl font-semibold text-[var(--foreground)]">
									Total
								</span>
										<span className="text-2xl font-bold text-[var(--primary)]">
									${totalPrice}
								</span>
									</div>

									<Link
											href="/cart"
											onClick={() => setIsOpen(false)}
											className="block w-full bg-[var(--primary)] text-black text-center py-4 rounded-full font-semibold hover:opacity-90 transition"
									>
										Go To Cart
									</Link>
								</div>
						)}
					</div>
				</div>
			</>
	);
};

export default CartDrawer;