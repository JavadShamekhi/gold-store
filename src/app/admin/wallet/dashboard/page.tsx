'use client';

import { useEffect, useState } from 'react';

type WalletData = {
	grams: number;
	pricePerGram: number;
	usdValue: number;
};

export default function WalletDashboard() {
	const [data, setData] = useState<WalletData | null>(null);

	const fetchData = async () => {
		const res = await fetch('/api/wallet/me');
		const json = await res.json();
		setData(json);
	};

	useEffect(() => {
		fetchData();

		// 🔥 live update every 5 seconds
		const interval = setInterval(() => {
			fetchData();
		}, 5000);

		return () => clearInterval(interval);
	}, []);

	if (!data) {
		return (
				<div className="min-h-screen flex items-center justify-center">
					Loading dashboard...
				</div>
		);
	}

	return (
			<div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
				<div className="w-full max-w-3xl bg-[var(--card)] border border-[var(--border)] rounded-3xl p-10 shadow-lg">

					<h1 className="text-3xl font-bold text-center mb-10">
						📊 Live Wallet Dashboard
					</h1>

					{/* GRAMS */}
					<div className="flex justify-between p-4 border border-[var(--border)] rounded-xl mb-4">
						<span>Gold Balance</span>
						<span className="font-bold">{data.grams} g</span>
					</div>

					{/* PRICE */}
					<div className="flex justify-between p-4 border border-[var(--border)] rounded-xl mb-4">
						<span>Live Price</span>
						<span className="font-bold text-[var(--primary)]">
						${data.pricePerGram}
					</span>
					</div>

					{/* VALUE */}
					<div className="flex justify-between p-4 border border-[var(--border)] rounded-xl bg-[var(--secondary)]/10">
						<span>Total Value</span>
						<span className="font-bold text-2xl text-[var(--primary)]">
						${data.usdValue.toFixed(2)}
					</span>
					</div>

					{/* STATUS */}
					<div className="mt-6 text-center text-sm text-gray-500">
						Live updates every 5 seconds
					</div>
				</div>
			</div>
	);
}