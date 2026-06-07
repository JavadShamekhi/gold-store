'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

type Product = {
	id: number;
	title: string;
	description: string;
	category: string;
	image: string;
	price: number;
	weight: number;
	stock: number;
};

export default function EditProductForm({
	                                        product,
                                        }: {
	product: Product;
}) {
	const router = useRouter();

	const [formData, setFormData] = useState({
		title: product.title,
		description: product.description,
		category: product.category,
		image: product.image,
		price: product.price,
		weight: product.weight,
		stock: product.stock,
	});

	const handleSubmit = async (
			e: React.FormEvent
	) => {
		e.preventDefault();

		await fetch(`/api/products/${product.id}`, {
			method: 'PUT',

			headers: {
				'Content-Type': 'application/json',
			},

			body: JSON.stringify(formData),
		});

		router.push('/admin/products');
		router.refresh();
	};

	return (
			<form
					onSubmit={handleSubmit}
					className="max-w-3xl space-y-6"
			>
				<input
						value={formData.title}
						onChange={(e) =>
								setFormData({
									...formData,
									title: e.target.value,
								})
						}
						className="w-full p-4 rounded-xl bg-[#111]"
				/>

				<textarea
						value={formData.description}
						onChange={(e) =>
								setFormData({
									...formData,
									description: e.target.value,
								})
						}
						className="w-full p-4 rounded-xl bg-[#111]"
				/>

				<input
						value={formData.category}
						onChange={(e) =>
								setFormData({
									...formData,
									category: e.target.value,
								})
						}
						className="w-full p-4 rounded-xl bg-[#111]"
				/>

				<input
						value={formData.image}
						onChange={(e) =>
								setFormData({
									...formData,
									image: e.target.value,
								})
						}
						className="w-full p-4 rounded-xl bg-[#111]"
				/>

				<input
						type="number"
						value={formData.price}
						onChange={(e) =>
								setFormData({
									...formData,
									price: Number(e.target.value),
								})
						}
						className="w-full p-4 rounded-xl bg-[#111]"
				/>

				<input
						type="number"
						value={formData.weight}
						onChange={(e) =>
								setFormData({
									...formData,
									weight: Number(e.target.value),
								})
						}
						className="w-full p-4 rounded-xl bg-[#111]"
				/>

				<input
						type="number"
						value={formData.stock}
						onChange={(e) =>
								setFormData({
									...formData,
									stock: Number(e.target.value),
								})
						}
						className="w-full p-4 rounded-xl bg-[#111]"
				/>

				<button
						type="submit"
						className="bg-[#d4af37] text-black px-8 py-4 rounded-full"
				>
					Save Changes
				</button>
			</form>
	);
}