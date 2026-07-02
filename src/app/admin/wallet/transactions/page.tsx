'use client';

import { useState } from 'react';

type Transaction = {
	id: string;
	type: 'BUY' | 'SELL';
	grams: number;
	pricePerGram: number;
	totalUSD: number;
	createdAt: string;
};

export default function AdminTransactionsPage() {
	const [userId, setUserId] = useState('');
	const [items, setItems] = useState<Transaction[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [searched, setSearched] = useState(false);

	const handleSearch = async () => {
		if (!userId.trim()) return;

		setLoading(true);
		setError(null);
		setSearched(true);

		try {
			const res = await fetch(`/api/gold/transactions?userId=${encodeURIComponent(userId)}`);

			if (res.status === 403) {
				setError('You do not have permission to view this.');
				setItems([]);
				return;
			}

			if (!res.ok) {
				throw new Error(`Request failed: ${res.status}`);
			}

			const data = await res.json();
			setItems(data);
		} catch (err) {
			console.error(err);
			setError('Failed to load transactions.');
			setItems([]);
		} finally {
			setLoading(false);
		}
	};

	return (
			<div className="min-h-screen bg-[var(--background)] flex justify-center p-10">
				<div className="w-full max-w-4xl">
					<h1 className="text-3xl font-bold mb-8 text-center">
						📊 Transactions History
					</h1>

					<div className="flex gap-3 mb-8">
						<input
								value={userId}
								onChange={(e) => setUserId(e.target.value)}
								onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
								placeholder="Enter user ID"
								className="flex-1 px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--card)]"
						/>
						<button
								onClick={handleSearch}
								disabled={loading || !userId.trim()}
								className="px-5 py-2 rounded-lg bg-[var(--primary)] text-white font-medium disabled:opacity-50"
						>
							{loading ? 'Searching...' : 'Search'}
						</button>
					</div>

					{error && (
							<p className="text-center text-red-500 mb-4">{error}</p>
					)}

					{!error && !loading && searched && items.length === 0 && (
							<p className="text-center text-gray-500">No transactions found for this user.</p>
					)}

					{items.length > 0 && (
							<div className="space-y-4">
								{items.map((tx) => (
										<div
												key={tx.id}
												className="flex justify-between items-center p-5 rounded-xl border border-[var(--border)] bg-[var(--card)]"
										>
											<div>
												<div className={`font-bold ${tx.type === 'BUY' ? 'text-green-500' : 'text-red-500'}`}>
													{tx.type}
												</div>
												<div className="text-sm text-gray-500">
													{tx.grams}g • ${tx.pricePerGram}/g
												</div>
											</div>

											<div className="text-right">
												<div className="font-bold">${tx.totalUSD}</div>
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