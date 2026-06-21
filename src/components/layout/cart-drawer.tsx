'use client';

import {useState, useEffect} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {ShoppingCart, X} from 'lucide-react';
import {useCartStore} from '@/src/store/cart-store';
import {useLocale} from "@/src/lib/i18n/LocaleProvider";

const CartDrawer = () => {
	const [isOpen, setIsOpen] = useState(false);
	const items = useCartStore((state) => state.items);
	const {locale, dict} = useLocale();
	const isRTL = locale === 'fa';

	const totalPrice = items.reduce(
			(acc, item) => acc + item.price * item.quantity,
			0
	);

	// lock scroll
	useEffect(() => {
		document.body.style.overflow = isOpen ? 'hidden' : 'unset';
	}, [isOpen]);

	// ESC close
	useEffect(() => {
		const handleEsc = (e: KeyboardEvent) => {
			if (e.key === 'Escape') setIsOpen(false);
		};

		window.addEventListener('keydown', handleEsc);
		return () => window.removeEventListener('keydown', handleEsc);
	}, []);

	if (!dict) return null;

	const drawerPosition = isOpen
			? 'translate-x-0'
			: isRTL
					? '-translate-x-full'
					: 'translate-x-full';

	return (
			<>
				{/* TRIGGER */}
				<button
						onClick={() => setIsOpen(true)}
						className="relative cursor-pointer rounded-full border border-[var(--border)] p-2 hover:border-[var(--primary)] hover:scale-105 transition"
				>
					<ShoppingCart size={18}/>

					{items.length > 0 && (
							<span
									className="absolute -top-2 -right-2 bg-[var(--primary)] text-black text-xs w-5 h-5 rounded-full flex items-center justify-center">
						{items.length}
					</span>
					)}
				</button>

				{/* BACKDROP */}
				<div
						className={`
					fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm
					transition-opacity duration-300
					${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}
				`}
						onClick={() => setIsOpen(false)}
				/>

				{/* DRAWER */}
				<div
						className={`
					fixed top-0 ${isRTL ? 'left-0' : 'right-0'}
					z-[101]
					h-full w-full sm:max-w-lg
					bg-[var(--background)]
					border-[var(--border)]
					shadow-2xl
					transform
					${isOpen ? 'transition-transform duration-500 ease-in-out' : ''}
					${drawerPosition}
					${isRTL ? 'border-l' : 'border-r'}
				`}
				>
					{/* CLOSE BUTTON */}
					<button
							onClick={() => setIsOpen(false)}
							className={`
						absolute top-5
						${isRTL ? 'right-5' : 'left-5'}
						p-2 rounded-full hover:bg-white/10 transition cursor-pointer
					`}
					>
						<X size={24} className="text-[var(--foreground)]"/>
					</button>

					{/* CONTENT */}
					<div
							className={`
						h-full flex flex-col p-8
						${isRTL ? 'text-left' : 'text-right'}
					`}
					>
						<h2 className="text-2xl font-bold text-[var(--foreground)] mb-10">
							{dict.cart.shoppingCart}
						</h2>

						{/* ITEMS */}
						<div
								className={`
							flex-1 overflow-y-auto custom-scrollbar
							${isRTL ? 'pr-2' : 'pl-2'}
						`}
						>
							{items.length === 0 ? (
									<p className="text-[var(--foreground)]/60">
										{dict.cart.emptyCart}
									</p>
							) : (
									<div className="flex flex-col gap-6">
										{items.map((item) => (
												<div
														key={item.id}
														className='flex pb-5 border-b border-[var(--border)] items-center'
												>
													{/* IMAGE */}
													<div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-white/5 shrink-0">
														<Image
																src={item.image}
																alt={item.title}
																fill
																className="object-cover"
														/>
													</div>

													{/* TEXT */}
													<div
															className={`flex-1 min-w-0 ${isRTL ? 'pr-4 text-right' : 'pl-4 text-left'}`}
													>
														<h3 className="font-semibold text-[var(--foreground)] truncate">
															{item.title}
														</h3>

														<p className="text-[var(--primary)] mt-2 font-medium">
															${item.price}
														</p>

														<p className="text-sm text-[var(--foreground)]/60 mt-1">
															{dict.cart.quantity}: {item.quantity}
														</p>
													</div>
												</div>
										))}
									</div>
							)}
						</div>

						{/* FOOTER */}
						{items.length > 0 && (
								<div className="mt-auto pt-6 border-t border-[var(--border)]">
									<div
											className={`
									flex items-center justify-between mb-6
									${isRTL ? '' : 'flex-row-reverse'}
								`}
									>
								<span className="text-xl font-semibold">
									{dict.cart.total}
								</span>

										<span className="text-2xl font-bold text-[var(--primary)]">
									${totalPrice}
								</span>
									</div>

									<div className="flex justify-center mt-6">
										<Link
												href="/cart"
												onClick={() => setIsOpen(false)}
												className="block px-8 py-3 rounded-full bg-[var(--primary)] text-black font-semibold hover:opacity-90 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
										>
											{dict.cart.goToCart}
										</Link>
									</div>
								</div>
						)}
					</div>
				</div>
			</>
	);
};

export default CartDrawer;