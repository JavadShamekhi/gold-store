'use client';

import {useEffect, useState} from 'react';
import GoldBalanceCard from '@/src/components/gold/gold-balance-card';
import GoldPriceCard from '@/src/components/gold/gold-price-card';
import GoldActions from '@/src/components/gold/gold-actions';
import GoldHistory from '@/src/components/gold/gold-history';
import Navbar from "@/src/components/layout/navbar";
import Container from "@/src/components/layout/container";
import GoldChart from "@/src/components/gold/gold-chart";

export default function GoldDashboard() {
	const [wallet, setWallet] = useState<any>(null);
	const [price, setPrice] = useState<any>(null);

	useEffect(() => {
		const fetchData = async () => {
			const [wRes, pRes] = await Promise.all([
				fetch('/api/wallet/me'),
				fetch('/api/gold/price'),
			]);

			const walletData = await wRes.json();
			const priceData = await pRes.json();

			setWallet(walletData);
			setPrice(priceData);
		};

		fetchData();
	}, []);

	if (!wallet || !price) {
		return (
				<div className="min-h-screen flex items-center justify-center">
					Loading dashboard...
				</div>
		);
	}

	const value = wallet.balanceG * price.price;

	return (
			<>
				<Navbar/>

				<Container>
					<div className="min-h-screen bg-[var(--background)] p-6">

						{/* TOP GRID */}
						<div className="grid md:grid-cols-3 gap-6 mb-6">

							<GoldBalanceCard grams={wallet.balanceG}/>

							<GoldPriceCard
									price={price.price}
									change={price.change}
							/>

							<div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6">
								<p className="text-sm text-gray-400">Total Value</p>
								<h2 className="text-3xl font-bold text-[var(--primary)]">
									${value.toFixed(2)}
								</h2>
							</div>

						</div>

						{/* ACTIONS */}
						<GoldActions/>

						{/* CHART + HISTORY */}
						<div className="grid md:grid-cols-2 gap-6 mt-6">
							{/* chart */}
							<div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6">
								<h3 className="mb-4 font-bold">📈 Price Chart</h3>
								<GoldChart/>
							</div>

							{/* history */}
							<GoldHistory/>
						</div>

					</div>

				</Container>
			</>
	);
}