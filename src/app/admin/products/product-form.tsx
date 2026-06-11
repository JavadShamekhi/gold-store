'use client';

import {useRouter} from 'next/navigation';
import {useState} from 'react';
import {useT} from '@/src/i18n/use-t';
import {ProductFormValues} from '@/src/lib/validations/product-schema';

type Props = {
	initialData?: ProductFormValues & { id?: string };
};

export default function ProductForm({initialData}: Props) {
	const router = useRouter();
	const t = useT();
	const isEdit = !!initialData?.id;

	const [loading, setLoading] = useState(false);
	const [image, setImage] = useState(initialData?.image || '');
	const [preview, setPreview] = useState(initialData?.image || '');

	const removeImage = () => {
		setImage('');
		setPreview('');
	};

	async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onloadend = () => {
			const base64 = reader.result as string;
			setImage(base64);
			setPreview(base64);
		};
		reader.readAsDataURL(file);
	}

	async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setLoading(true);

		const formData = new FormData(e.currentTarget);

		const payload = {
			title: formData.get('title'),
			description: formData.get('description'),
			category: formData.get('category'),
			price: Number(formData.get('price')),
			weight: Number(formData.get('weight')),
			stock: Number(formData.get('stock')),
			image,
		};

		try {
			const res = await fetch(
					isEdit ? `/api/products/${initialData?.id}` : '/api/products',
					{
						method: isEdit ? 'PUT' : 'POST',
						headers: {'Content-Type': 'application/json'},
						body: JSON.stringify(payload),
					}
			);

			if (!res.ok) throw new Error('Failed');

			router.push('/admin/products');
			router.refresh();
		} catch (err) {
			console.error(err);
		} finally {
			setLoading(false);
		}
	}

	return (
			<div className="min-h-screen flex items-center justify-center px-4 bg-[var(--background)]">

				{/* CARD */}
				<div className="w-full max-w-3xl rounded-3xl border border-[var(--border)] bg-[var(--card)] shadow-2xl p-10">

					{/* HEADER */}
					<div className="text-center mb-10">
						<p className="text-[var(--primary)] mb-2 uppercase tracking-[4px] text-sm">
							{t('admin')}
						</p>
						<h1 className="text-3xl font-bold text-[var(--foreground)]">
							{isEdit ? t('edit') : t('addProduct')}
						</h1>

						<p className="mt-2 text-sm text-[var(--foreground)]/60">
							{isEdit ? t('updateProductDetails') : t('addNewJewellery')}
						</p>

						<div className="mt-4 w-20 h-[2px] bg-[var(--primary)] mx-auto rounded-full"/>
					</div>

					<form onSubmit={onSubmit} className="space-y-6">

						{/* TITLE */}
						<div>
							<label className="text-sm text-[var(--foreground)]/70">{t('title')}</label>
							<input
									name="title"
									defaultValue={initialData?.title}
									className="mt-2 w-full px-4 py-3 rounded-xl bg-[var(--background)] border border-[var(--border)] focus:border-[var(--primary)] outline-none transition"
							/>
						</div>

						{/* DESCRIPTION */}
						<div>
							<label className="text-sm text-[var(--foreground)]/70">{t('description')}</label>
							<textarea
									name="description"
									defaultValue={initialData?.description}
									rows={4}
									className="mt-2 w-full px-4 py-3 rounded-xl bg-[var(--background)] border border-[var(--border)] focus:border-[var(--primary)] outline-none transition resize-none"
							/>
						</div>

						{/* CATEGORY */}
						<div>
							<label className="text-sm text-[var(--foreground)]/70">{t('category')}</label>
							<input
									name="category"
									defaultValue={initialData?.category}
									className="mt-2 w-full px-4 py-3 rounded-xl bg-[var(--background)] border border-[var(--border)] focus:border-[var(--primary)] outline-none transition"
							/>
						</div>

						{/* IMAGE UPLOAD */}
						<div className="space-y-3">
							<label className="text-sm ml-2 mr-2 text-[var(--foreground)]/70">
								{t('image') || 'Image'}
							</label>

							<label
									className="
			inline-flex items-center gap-2
			px-5 py-2.5
			rounded-full
			bg-[var(--secondary)]
			border border-[var(--border)]
			text-sm font-medium
			cursor-pointer
			hover:border-[var(--primary)]
			hover:shadow-md
			transition
			w-fit
		"
							>
								📁 {t('chooseImg')}
								<input
										type="file"
										accept="image/*"
										onChange={handleImageUpload}
										className="hidden"
								/>
							</label>

							{preview && (
									<div
											className="
				group
				relative
				w-full
				h-72
				rounded-3xl
				overflow-hidden
				border border-[var(--border)]
				cursor-pointer
			"
									>
										<img
												src={preview}
												alt="preview"
												className="
					w-full
					h-full
					object-cover
					transition-all
					duration-500
					group-hover:scale-110
				"
										/>

										{/* Dark Overlay */}
										<div
												className="
					absolute inset-0
					bg-black/0
					group-hover:bg-black/20
					transition
				"
										/>

										{/* Delete Button */}
										<button
												type="button"
												onClick={removeImage}
												className="
					absolute
					top-3
					right-3
					w-9
					h-9
					rounded-full
					bg-red-500/90
					text-white
					font-bold
					cursor-pointer
					opacity-0
					group-hover:opacity-100
					transition
					hover:scale-110
				"
										>
											✕
										</button>

										{/* Hover Label */}
										<div
												className="
					absolute
					bottom-4
					left-1/2
					-translate-x-1/2
					bg-black/70
					text-white
					text-xs
					px-3
					py-1
					rounded-full
					opacity-0
					group-hover:opacity-100
					transition
				"
										>
											{t('preview') || 'Preview'}
										</div>
									</div>
							)}
						</div>

						{/* GRID */}
						<div className="grid grid-cols-3 gap-4">
							<input
									name="price"
									type="number"
									defaultValue={initialData?.price}
									placeholder={t('price')}
									className="px-4 py-3 rounded-xl bg-[var(--background)] border border-[var(--border)] focus:border-[var(--primary)] outline-none"
							/>

							<input
									name="weight"
									type="number"
									defaultValue={initialData?.weight}
									placeholder={t('weight')}
									className="px-4 py-3 rounded-xl bg-[var(--background)] border border-[var(--border)] focus:border-[var(--primary)] outline-none"
							/>

							<input
									name="stock"
									type="number"
									defaultValue={initialData?.stock}
									placeholder={t('stock')}
									className="px-4 py-3 rounded-xl bg-[var(--background)] border border-[var(--border)] focus:border-[var(--primary)] outline-none"
							/>
						</div>

						{/* BUTTON */}
						<div className="flex justify-center mt-6">
							<button
									type="submit"
									disabled={loading}
									className="px-8 py-3 rounded-full bg-[var(--primary)] text-black font-semibold hover:opacity-90 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{loading
										? t('authenticating')
										: isEdit
												? t('edit')
												: t('addProduct')}
							</button>
						</div>

					</form>
				</div>
			</div>
	);
}