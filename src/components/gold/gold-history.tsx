export default function GoldHistory() {
	return (
			<div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6">
				<h3 className="font-bold mb-4">🧾 Recent Transactions</h3>

				<div className="space-y-3 text-sm text-gray-300">
					<p>BUY • 2g • $180</p>
					<p>SELL • 1g • $90</p>
					<p>BUY • 0.5g • $45</p>
				</div>
			</div>
	);
}