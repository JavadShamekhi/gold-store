import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CartItem = {
	id: string;
	title: string;
	price: number;
	image: string;
	quantity: number;
};

type CartStore = {
	items: CartItem[];

	addItem: (item: CartItem) => void;

	removeItem: (id: string) => void;

	increaseQuantity: (id: string) => void;

	decreaseQuantity: (id: string) => void;

	clearCart: () => void;
};

export const useCartStore = create<CartStore>()(
		persist(
				(set) => ({
					items: [],

					addItem: (item) =>
							set((state) => {
								const existingItem = state.items.find(
										(i) => i.id === item.id
								);

								if (existingItem) {
									return {
										items: state.items.map((i) =>
												i.id === item.id
														? {
															...i,
															quantity: i.quantity + 1,
														}
														: i
										),
									};
								}

								return {
									items: [...state.items, item],
								};
							}),

					removeItem: (id) =>
							set((state) => ({
								items: state.items.filter(
										(item) => item.id !== id
								),
							})),

					increaseQuantity: (id) =>
							set((state) => ({
								items: state.items.map((item) =>
										item.id === id
												? {
													...item,
													quantity: item.quantity + 1,
												}
												: item
								),
							})),

					decreaseQuantity: (id) =>
							set((state) => ({
								items: state.items
										.map((item) =>
												item.id === id
														? {
															...item,
															quantity: item.quantity - 1,
														}
														: item
										)
										.filter((item) => item.quantity > 0),
							})),

					clearCart: () => set({ items: [] }),
				}),
				{
					name: 'gold-store-cart',
				}
		)
);