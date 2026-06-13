'use client';

import {useEffect, useState} from 'react';

type Transaction = {
	id: string;
	type: 'BUY' | 'SELL';
	grams: number;
	pricePerGram: number;
	totalUSD: number;
	createdAt: string;
};

export default function TransactionsPage() {
	const [items, setItems] = useState<Transaction[]>([]);
	const [loading, setLoading] = useState(true);

	const userId = 'YOUR_USER_ID';

	useEffect(() => {
		const fetchData = async () => {
			try {
				const res = await fetch(
						`/api/gold/transactions?userId=${userId}`
				);
				const data = await res.json();

				setItems(data);
			} catch (err) {
				console.error(err);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	if (loading) {
		return (
				<div className="min-h-screen flex items-center justify-center">
					Loading transactions...
				</div>
		);
	}

	return (
			<div className="min-h-screen bg-[var(--background)] flex justify-center p-10">
				<div className="w-full max-w-4xl">

					<h1 className="text-3xl font-bold mb-8 text-center">
						📊 Transactions History
					</h1>

					{items.length === 0 ? (
							<p className="text-center text-gray-500">
								No transactions yet.
							</p>
					) : (
							<div className="space-y-4">
								{items.map((tx) => (
										<div
												key={tx.id}
												className="flex justify-between items-center p-5 rounded-xl border border-[var(--border)] bg-[var(--card)]"
										>
											{/* LEFT */}
											<div>
												<div
														className={`font-bold ${
																tx.type === 'BUY'
																		? 'text-green-500'
																		: 'text-red-500'
														}`}
												>
													{tx.type}
												</div>

												<div className="text-sm text-gray-500">
													{tx.grams}g • ${tx.pricePerGram}/g
												</div>
											</div>

											{/* RIGHT */}
											<div className="text-right">
												<div className="font-bold">
													${tx.totalUSD}
												</div>

												<div className="text-xs text-gray-400">
													{new Date(tx.createdAt).toLocaleString()}
												</div>
											</div>
										</div>
								))}
							</div>
					)}
				</div>
			</div>
	);
}