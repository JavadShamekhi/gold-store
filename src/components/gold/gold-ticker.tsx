'use client';

import {useEffect, useState} from 'react';

export default function GoldTicker() {
	const [price, setPrice] = useState<number | null>(null);
	const [change, setChange] = useState<number | null>(null);
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
				18K Gold
			</span>

				{/* PRICE */}
				<span className="font-semibold text-[#d4af37]">
				{loading
						? 'Loading...'
						: price !== null
								? `${(price * 10).toLocaleString()} IRR`
								: 'Unavailable'}
			</span>

				{/* CHANGE */}
				{change !== null && (
						<span
								className={`text-xs font-medium ${
										change >= 0
												? 'text-green-500'
												: 'text-red-500'
								}`}
						>
					{change >= 0 ? '+' : ''}
							{change.toFixed(2)}%
				</span>
				)}
			</div>
	);
}