'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
	productSchema,
	type ProductFormValues,
} from '@/src/lib/validations/product-schema';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Textarea } from '@/src/components/ui/textarea';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/src/components/ui/form';

export default function ProductForm() {
	const router = useRouter();

	const form = useForm<ProductFormValues>({
		resolver: zodResolver(productSchema),

		defaultValues: {
			title: '',
			description: '',
			category: '',
			image: '',
			price: 0,
			weight: 0,
			stock: 0,
		},
	});

	async function onSubmit(values: ProductFormValues) {
		try {
			const response = await fetch('/api/products', {
				method: 'POST',

				headers: {
					'Content-Type': 'application/json',
				},

				body: JSON.stringify(values),
			});

			if (!response.ok) {
				throw new Error('Failed to create product');
			}

			router.push('/admin');
			router.refresh();
		} catch (error) {
			console.error(error);
			alert('Failed to create product');
		}
	}

	return (
			<div className="max-w-3xl">
				<Form {...form}>
					<form
							onSubmit={form.handleSubmit(onSubmit)}
							className="space-y-6"
					>
						<FormField
								control={form.control}
								name="title"
								render={({ field }) => (
										<FormItem>
											<FormLabel>Title</FormLabel>

											<FormControl>
												<Input
														placeholder="Royal Gold Ring"
														{...field}
												/>
											</FormControl>

											<FormMessage />
										</FormItem>
								)}
						/>

						<FormField
								control={form.control}
								name="description"
								render={({ field }) => (
										<FormItem>
											<FormLabel>Description</FormLabel>

											<FormControl>
												<Textarea
														rows={5}
														placeholder="Luxury 18K gold ring..."
														{...field}
												/>
											</FormControl>

											<FormMessage />
										</FormItem>
								)}
						/>

						<FormField
								control={form.control}
								name="category"
								render={({ field }) => (
										<FormItem>
											<FormLabel>Category</FormLabel>

											<FormControl>
												<Input
														placeholder="Ring"
														{...field}
												/>
											</FormControl>

											<FormMessage />
										</FormItem>
								)}
						/>

						<FormField
								control={form.control}
								name="image"
								render={({ field }) => (
										<FormItem>
											<FormLabel>Image URL</FormLabel>

											<FormControl>
												<Input
														placeholder="https://..."
														{...field}
												/>
											</FormControl>

											<FormMessage />
										</FormItem>
								)}
						/>

						<div className="grid md:grid-cols-3 gap-4">
							<FormField
									control={form.control}
									name="price"
									render={({ field }) => (
											<FormItem>
												<FormLabel>Price</FormLabel>

												<FormControl>
													<Input
															type="number"
															{...field}
													/>
												</FormControl>

												<FormMessage />
											</FormItem>
									)}
							/>

							<FormField
									control={form.control}
									name="weight"
									render={({ field }) => (
											<FormItem>
												<FormLabel>Weight (g)</FormLabel>

												<FormControl>
													<Input
															type="number"
															{...field}
													/>
												</FormControl>

												<FormMessage />
											</FormItem>
									)}
							/>

							<FormField
									control={form.control}
									name="stock"
									render={({ field }) => (
											<FormItem>
												<FormLabel>Stock</FormLabel>

												<FormControl>
													<Input
															type="number"
															{...field}
													/>
												</FormControl>

												<FormMessage />
											</FormItem>
									)}
							/>
						</div>

						<Button
								type="submit"
								className="w-full"
						>
							Create Product
						</Button>
					</form>
				</Form>
			</div>
	);
}