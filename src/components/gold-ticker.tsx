'use client';

import { useEffect, useState } from 'react';

export default function GoldTicker() {
	const [price, setPrice] = useState<number | null>(null);
	const [change, setChange] = useState<number | null>(null);

	useEffect(() => {
		const fetchPrice = async () => {
			const res = await fetch('/api/gold-price');
			const data = await res.json();

			setPrice(data?.price);
			setChange(data?.change);
		};

		fetchPrice();

		// 🔥 auto update every 10 seconds (trading style)
		const interval = setInterval(fetchPrice, 10000);

		return () => clearInterval(interval);
	}, []);

	const isUp = (change ?? 0) >= 0;

	return (
			<div className="flex items-center gap-2 px-3 py-1 rounded-full
											bg-[var(--card)]
											border border-[var(--border)]
											backdrop-blur-md shadow-sm"
			>
				{/* LIVE DOT */}
				<span className="relative flex h-2 w-2">
					<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
					<span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
				</span>

				{/* LABEL */}
				<span className="text-muted-foreground">18K Gold:</span>
				{/* PRICE */}
				<span className="text-[#d4af37]">
					{price ? (price*10).toLocaleString() : '...'} IRR
				</span>

				{/* CHANGE */}
				<span
						className={
							change > 0 ? 'text-green-500' : 'text-red-500'
						}
				>
					{change ? `${change}%` : ''}
				</span>
			</div>
	);
}