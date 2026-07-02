'use client';

import {useEffect, useState} from 'react';
import {useLocale} from '@/src/lib/i18n/LocaleProvider';
import {formatNumber, formatDate} from '@/src/lib/i18n/formatters';

type Transaction = {
	id: string;
	type: 'BUY' | 'SELL';
	grams: number;
	pricePerGram: number;
	totalUSD: number;
	createdAt: string;
};

export default function GoldHistory() {
	const {dict, locale} = useLocale();
	const [transactions, setTransactions] = useState<Transaction[] | null>(null);
	const [error, setError] = useState(false);

	useEffect(() => {
		const fetchHistory = async () => {
			try {
				const res = await fetch('/api/gold/transactions', {cache: 'no-store'});
				if (!res.ok) throw new Error(`Failed to fetch transactions: ${res.status}`);
				const data = await res.json();
				setTransactions(data);
			} catch (err) {
				console.error('Transaction history error:', err);
				setError(true);
			}
		};

		fetchHistory();
	}, []);

	return (
			<div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6">
				<h3 className="font-bold mb-4">
					🧾 {dict?.gold.history.title}
				</h3>

				<div className="space-y-3 text-sm text-[var(--foreground)]/80">
					{error && (
							<p className="text-[var(--foreground)]/50">{dict?.gold.history.error}</p>
					)}

					{!error && transactions === null && (
							<p className="text-[var(--foreground)]/50">{dict?.gold.history.loading}</p>
					)}

					{!error && transactions?.length === 0 && (
							<p className="text-[var(--foreground)]/50">{dict?.gold.history.empty}</p>
					)}

					{transactions?.map((tx) => {
						const isBuy = tx.type === 'BUY';
						const typeLabel = isBuy ? dict?.gold.history.buy : dict?.gold.history.sell;
						const typeColor = isBuy ? 'text-green-500' : 'text-red-500';

						return (
								<div key={tx.id} className="flex items-center justify-between">
									<div className="flex items-center gap-2">
										<span className={`font-medium ${typeColor}`}>{typeLabel}</span>
										<span className="text-[var(--foreground)]/60">
                  {formatNumber(tx.grams, locale, {
	                  minimumFractionDigits: 2,
	                  maximumFractionDigits: 2,
                  })}{' '}
											{dict?.gold.balanceCard.unit}
                </span>
									</div>

									<div className="flex items-center gap-3">
                <span className="text-[var(--foreground)]/60">
                  {formatNumber(tx.totalUSD*10, locale, {
	                  minimumFractionDigits: 2,
	                  maximumFractionDigits: 2,
                  })}{' '}
	                {dict?.gold.dashboard.currency}
                </span>
										<span className="text-xs text-[var(--foreground)]/40">
                  {formatDate(tx.createdAt, locale)}
                </span>
									</div>
								</div>
						);
					})}
				</div>
			</div>
	);
}