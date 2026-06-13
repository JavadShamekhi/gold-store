export default function GoldBalanceCard({grams}: {grams: number}) {
	return (
			<div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6">
				<p className="text-sm text-gray-400">Gold Balance</p>
				<h2 className="text-3xl font-bold">
					{grams} g
				</h2>
			</div>
	);
}