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

export default function SellGoldPage() {
	const {dict, locale} = useLocale();
	const router = useRouter();
	const [price, setPrice] = useState<number | null>(null);
	const [balance, setBalance] = useState<number | null>(null);
	const [submitting, setSubmitting] = useState(false);

	// ── reverse-calc state ──
	const [totalInput, setTotalInput] = useState<string>('');
	const [activeField, setActiveField] = useState<'grams' | 'total'>('grams');

	// ── localized schema (depends on dict + balance) ──
	const sellSchema = useMemo(
			() =>
					z.object({
						grams: z.coerce
								.number({
									invalid_type_error:
											dict?.gold.sellPage.errors.invalidType ?? 'Enter a valid number',
								})
								.positive(dict?.gold.sellPage.errors.positive ?? 'Must be greater than 0')
								.max(
										balance ?? 0,
										dict?.gold.sellPage.errors.exceedsBalance ?? 'Exceeds your balance'
								),
					}),
			[dict, balance]
	);

	type SellFormValues = z.infer<typeof sellSchema>;

	const form = useForm<SellFormValues>({
		resolver: zodResolver(sellSchema),
		defaultValues: {grams: 0},
	});

	const grams = form.watch('grams');

	// ── grams → total ──
	useEffect(() => {
		if (activeField !== 'grams') return;
		if (price !== null && grams > 0) {
			setTotalInput((grams * price).toFixed(2));
		} else {
			setTotalInput('');
		}
	}, [grams, price, activeField]);

	// ── total → grams ──
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

	// ── grams input ──
	const handleGramsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setActiveField('grams');
		const num = parseFloat(e.target.value);
		form.setValue('grams', isNaN(num) ? 0 : num, {shouldValidate: true});
	};

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [priceRes, walletRes] = await Promise.all([
					fetch('/api/gold/price', {cache: 'no-store'}),
					fetch('/api/wallet/me', {cache: 'no-store'}),
				]);

				if (priceRes.ok) {
					const priceData = await priceRes.json();
					setPrice(priceData?.price ?? null);
				}

				if (walletRes.ok) {
					const walletData = await walletRes.json();
					setBalance(walletData?.balanceG ?? 0);
				}
			} catch (err) {
				console.error('Sell page data error:', err);
			}
		};

		fetchData();
	}, []);

	// re-validate against the up-to-date balance once it loads
	useEffect(() => {
		form.trigger('grams');
	}, [balance]);

	const onSubmit = async (values: SellFormValues) => {
		setSubmitting(true);

		try {
			const res = await fetch('/api/gold/sell', {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({grams: values.grams}),
			});

			const data = await res.json();

			if (!res.ok) {
				toast.error(data?.error ?? dict?.gold.sellPage.genericError);
				return;
			}

			toast.success(dict?.gold.sellPage.success);
			router.push('/dashboard/gold');
		} catch (err) {
			console.error('Sell error:', err);
			toast.error(dict?.gold.sellPage.genericError);
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
								{dict?.gold.sellPage.title}
							</h1>
							<p className="text-sm text-[var(--foreground)]/60 text-center mb-6">
								{balance !== null
										? `${dict?.gold.sellPage.availableBalance}: ${formatNumber(balance, locale, {
											minimumFractionDigits: 2,
											maximumFractionDigits: 2,
										})} ${dict?.gold.balanceCard.unit}`
										: dict?.gold.sellPage.loadingBalance}
							</p>

							<Form {...form}>
								<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
									{/* ── Grams ── */}
									<FormField
											control={form.control}
											name="grams"
											render={({field}) => (
													<FormItem>
														<FormLabel>
															{dict?.gold.sellPage.gramsLabel}
														</FormLabel>
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
														<FormMessage className="text-red-500"/>
													</FormItem>
											)}
									/>

									{/* ── Total (reverse) ── */}
									<div className="space-y-2">
										<label className="text-sm font-medium">
											{dict?.gold.sellPage.totalLabel} ({dict?.gold.goldTicker.currency})
										</label>
										<div className="relative">
											<Input
													type="number"
													step="0.01"
													min="0"
													placeholder="0"
													value={totalInput}
													onChange={(e) => handleTotalChange(e.target.value)}
											/>
										</div>
									</div>

									<Button
											type="submit"
											disabled={submitting || price === null || balance === null || balance === 0}
											className="w-full bg-red-500 text-white font-bold hover:opacity-90"
									>
										{submitting ? dict?.gold.sellPage.submitting : dict?.gold.sellPage.submit}
									</Button>
								</form>
							</Form>
						</div>
					</div>
				</Container>
			</>
	);
}