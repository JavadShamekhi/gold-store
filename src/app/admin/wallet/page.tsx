'use client';

import {useEffect, useState} from 'react';

type WalletData = {
	grams: number;
	pricePerGram: number;
	usdValue: number;
};

export default function WalletPage() {
	const [data, setData] = useState<WalletData | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchWallet = async () => {
			try {
				setLoading(true);

				const res = await fetch('/api/wallet/me', {
					method: 'GET',
					credentials: 'include',
				});

				if (!res.ok) {
					throw new Error('Failed to fetch wallet');
				}

				const json = await res.json();
				setData(json);
			} catch (err) {
				console.error(err);
				setData(null);
			} finally {
				setLoading(false);
			}
		};

		fetchWallet();
	}, []);

	if (loading) {
		return (
				<div className="flex items-center justify-center min-h-screen">
					Loading wallet...
				</div>
		);
	}

	if (!data) {
		return (
				<div className="flex items-center justify-center min-h-screen text-red-500">
					Failed to load wallet
				</div>
		);
	}

	return (
			<div className="min-h-screen flex items-center justify-center bg-[var(--background)] px-4">
				<div className="w-full max-w-2xl bg-[var(--card)] border border-[var(--border)] rounded-3xl p-10 shadow-lg">

					<h1 className="text-3xl font-bold mb-8 text-center">
						💰 My Gold Wallet
					</h1>

					<div className="space-y-4">

						<div className="flex justify-between p-4 border rounded-xl">
							<span>Gold Balance</span>
							<span className="font-bold">{data.grams} g</span>
						</div>

						<div className="flex justify-between p-4 border rounded-xl">
							<span>Price per Gram</span>
							<span className="font-bold text-[var(--primary)]">
							${data.pricePerGram}
						</span>
						</div>

						<div className="flex justify-between p-4 border rounded-xl bg-[var(--secondary)]/10">
							<span>Total Value</span>
							<span className="font-bold text-xl text-[var(--primary)]">
							${data.usdValue.toFixed(2)}
						</span>
						</div>

					</div>
				</div>
			</div>
	);
}