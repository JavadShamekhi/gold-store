'use client';

import {useEffect, useMemo, useState} from 'react';
import {useRouter} from 'next/navigation';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import {toast} from 'sonner';
import Navbar from '@/src/components/layout/navbar';
import Container from '@/src/components/layout/container';
import {useLocale} from '@/src/lib/i18n/LocaleProvider';
import {formatNumber} from '@/src/lib/i18n/formatters';
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from '@/src/components/ui/form';
import {Input} from '@/src/components/ui/input';
import {Button} from '@/src/components/ui/button';

export default function BuyGoldPage() {
	const {dict, locale} = useLocale();
	const router = useRouter();
	const [price, setPrice] = useState<number | null>(null);
	const [submitting, setSubmitting] = useState(false);

	// ── reverse-calc state ──
	const [totalInput, setTotalInput] = useState<string>('');
	const [activeField, setActiveField] = useState<'grams' | 'total'>('grams');

	// ── localized schema ──
	const buySchema = useMemo(
			() =>
					z.object({
						grams: z.coerce
								.number({
									error: (issue) => {
										if (issue.code === 'invalid_type') {
											return dict?.gold.buyPage.errors.invalidType ?? 'Enter a valid number';
										}
										return 'Invalid input';
									},
								})
								.positive(dict?.gold.buyPage.errors.positive ?? 'Must be greater than 0')
								.max(10000, dict?.gold.buyPage.errors.tooLarge ?? 'Amount too large'),
					}),
			[dict]
	);

	type BuyFormValues = z.infer<typeof buySchema>;

	const form = useForm<BuyFormValues>({
		resolver: zodResolver(buySchema) as any,
		defaultValues: {grams: 0},
	});

	const grams = form.watch('grams');

	// ── when grams changes → update total input ──
	useEffect(() => {
		if (activeField !== 'grams') return;

		if (price !== null && grams > 0) {
			setTotalInput((grams * price).toFixed(2));
		} else {
			setTotalInput('');
		}
	}, [grams, price, activeField]);

	// ── user types in total → calculate grams ──
	const handleTotalChange = (value: string) => {
		setActiveField('total');
		setTotalInput(value);

		const num = parseFloat(value);
		if (!isNaN(num) && num > 0 && price !== null && price > 0) {
			form.setValue('grams', parseFloat((num / price).toFixed(4)), {
				shouldValidate: true,
			});
		} else {
			form.setValue('grams', 0, {shouldValidate: true});
		}
	};

	// ── user types in grams ──
	const handleGramsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setActiveField('grams');
		const num = parseFloat(e.target.value);
		form.setValue('grams', isNaN(num) ? 0 : num, {shouldValidate: true});
	};

	useEffect(() => {
		const fetchPrice = async () => {
			try {
				const res = await fetch('/api/gold/price', {cache: 'no-store'});
				if (!res.ok) return;
				const data = await res.json();
				setPrice(data?.price ?? null);
			} catch (err) {
				console.error('Price fetch error:', err);
			}
		};

		fetchPrice();
	}, []);

	const onSubmit = async (values: BuyFormValues) => {
		setSubmitting(true);

		try {
			const res = await fetch('/api/gold/buy', {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({grams: values.grams}),
			});

			const data = await res.json();

			if (!res.ok) {
				toast.error(data?.error ?? dict?.gold.buyPage.genericError);
				return;
			}

			toast.success(dict?.gold.buyPage.success);
			router.push('/dashboard/gold');
		} catch (err) {
			console.error('Buy error:', err);
			toast.error(dict?.gold.buyPage.genericError);
		} finally {
			setSubmitting(false);
		}
	};

	return (
			<>
				<Navbar/>

				<Container>
					<div className="min-h-screen flex items-center justify-center p-6">
						<div
								className="
              w-full max-w-md
              bg-[var(--card)] border border-[#d4af37]/30
              rounded-2xl p-8
              shadow-[0_0_40px_-15px_#d4af37]
            "
						>
							<h1 className="text-2xl font-bold mb-1 text-center">
								{dict?.gold.buyPage.title}
							</h1>
							<p className="text-sm text-[var(--foreground)]/60 text-center mb-6">
								{price !== null
										? `${dict?.gold.buyPage.currentPrice}: ${formatNumber(price * 10, locale, {
											minimumFractionDigits: 0,
											maximumFractionDigits: 0,
										})} ${dict?.gold.dashboard.currency}/${dict?.gold.balanceCard.unit}`
										: dict?.gold.buyPage.loadingPrice}
							</p>

							<Form {...form}>
								<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
									<FormField
											control={form.control}
											name="grams"
											render={({field}) => (
													<FormItem>
														<FormLabel>{dict?.gold.buyPage.gramsLabel}</FormLabel>
														<FormControl>
															<Input
																	type="number"
																	step="0.01"
																	min="0"
																	placeholder="0"
																	value={field.value || ''}
																	onChange={handleGramsChange}
															/>
														</FormControl>
														<FormMessage className="text-red-600"/>
													</FormItem>
											)}
									/>

									<div className="space-y-2">
										<label className="text-sm font-medium">
											{dict?.gold.buyPage.totalLabel} ({dict?.gold.dashboard.currency})
										</label>
										<div className="relative">
											<Input
													type="number"
													step="0.01"
													min="0"
													placeholder="0"
													value={totalInput}
													onChange={(e) =>
															handleTotalChange(e.target.value)
													}
											/>

										</div>
									</div>

									<Button
											type="submit"
											disabled={submitting || price === null}
											className="w-full bg-green-500 text-black font-bold hover:opacity-90 cursor-pointer"
									>
										{submitting ? dict?.gold.buyPage.submitting : dict?.gold.buyPage.submit}
									</Button>
								</form>
							</Form>
						</div>
					</div>
				</Container>
			</>
	);
}