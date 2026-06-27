'use client';

import {useEffect, useState} from 'react';
import {useLocale} from "@/src/lib/i18n/LocaleProvider";
import {formatNumber, toPersianDigits} from "@/src/lib/i18n/formatters";

type ChangeData = {
	percent: number | null;
	direction: 'up' | 'down' | 'unchanged' | null;
	previousPrice: number | null;
};

export default function GoldTicker() {
	const {dict, locale} = useLocale();
	const [price, setPrice] = useState<number | null>(null);
	const [change, setChange] = useState<ChangeData | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchPrice = async () => {
			try {
				const res = await fetch('/api/gold/price', {
					cache: 'no-store',
				});

				if (!res.ok) {
					throw new Error('Failed to fetch gold price');
				}

				const data = await res.json();

				setPrice(data?.price ?? null);
				setChange(data?.change ?? null);
			} catch (error) {
				console.error('Gold price error:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchPrice();

		// Update every 30 seconds
		const interval = setInterval(fetchPrice, 30000);

		return () => clearInterval(interval);
	}, []);

	const percent = change?.percent ?? null;
	const direction = change?.direction ?? null;

	const directionColor =
			direction === 'up'
					? 'text-green-500'
					: direction === 'down'
							? 'text-red-500'
							: 'text-[var(--foreground)]/60';

	const directionArrow =
			direction === 'up' ? '▲' : direction === 'down' ? '▼' : '';

	const formattedPrice =
			price !== null ? formatNumber(price * 10, locale) : null;

	const formattedPercent =
			percent !== null
					? formatNumber(Math.abs(percent), locale, {
						minimumFractionDigits: 2,
						maximumFractionDigits: 2,
					})
					: null;

	const sign = direction === 'down' ? '-' : '+';
	const percentDisplay =
			direction === 'unchanged'
					? formatNumber(0, locale, {minimumFractionDigits: 2, maximumFractionDigits: 2})
					: `${locale === 'fa' ? toPersianDigits(sign === '-' ? '-' : '+') : sign}${formattedPercent}`;
	// Note: '+' / '-' aren't digits, toPersianDigits only swaps 0-9 — keeping the literal sign is correct either way.

	return (
			<div
					className="
				flex items-center gap-2
				px-3 py-1.5
				rounded-full
				border border-[var(--border)]
				bg-[var(--card)]
				backdrop-blur-md
				shadow-sm
			"
			>
				{/* LIVE DOT */}
				<span className="relative flex h-2 w-2">
				<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"/>
				<span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"/>
			</span>

				{/* LABEL */}
				<span className="text-xs text-[var(--foreground)]/60">
				{dict?.gold.goldTicker.label}
			</span>

				{/* PRICE */}
				<span className="font-semibold text-[#d4af37]">
				{loading
						? dict?.gold.goldTicker.loading
						: formattedPrice !== null
								? `${formattedPrice} ${dict?.gold.goldTicker.currency}`
								: dict?.gold.goldTicker.unavailable}
			</span>

				{/* CHANGE */}
				{formattedPercent !== null && direction !== null && (
						<span className={`flex items-center gap-0.5 text-xs font-medium ${directionColor}`}>
          {directionArrow && <span className="text-[10px]">{directionArrow}</span>}
							{percentDisplay}%
        </span>
				)}
			</div>
	);
}