'use client';

import {useEffect, useState} from 'react';

export default function SellGoldPage() {
	const [grams, setGrams] = useState<number>(0);
	const [price, setPrice] = useState<number>(0);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const fetchPrice = async () => {
			try {
				const res = await fetch('/api/gold/price');
				const data = await res.json();
				setPrice(data.price);
			} catch (err) {
				console.error(err);
			}
		};

		fetchPrice();
	}, []);

	const total = grams * price;

	const handleSell = async () => {
		if (!grams || grams <= 0) return;

		try {
			setLoading(true);

			const res = await fetch('/api/gold/sell', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include',
				body: JSON.stringify({
					grams,
				}),
			});

			if (!res.ok) throw new Error('Failed');

			alert('Gold sold successfully!');
			setGrams(0);
		} catch (err) {
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	return (
			<div className="min-h-screen flex items-center justify-center bg-[var(--background)] px-4">
				<div className="w-full max-w-xl bg-[var(--card)] border border-[var(--border)] rounded-3xl p-8 shadow-lg">

					<h1 className="text-2xl font-bold mb-6 text-center">
						💸 Sell Gold
					</h1>

					<input
							type="number"
							value={grams}
							onChange={(e) => setGrams(Number(e.target.value))}
							placeholder="Enter grams to sell"
							className="w-full p-3 rounded-xl border border-[var(--border)] bg-transparent outline-none mb-4"
					/>

					<div className="space-y-2 mb-6 text-sm">
						<p>Price per gram: <b>${price}</b></p>
						<p>Total value: <b>${total.toFixed(2)}</b></p>
					</div>

					<button
							onClick={handleSell}
							disabled={loading}
							className="w-full py-3 rounded-xl bg-red-500 text-white font-semibold hover:opacity-90 transition cursor-pointer"
					>
						{loading ? 'Processing...' : 'Sell Gold'}
					</button>

				</div>
			</div>
	);
}