export default function GoldPriceCard({
	                                      price,
	                                      change,
                                      }: {
	price: number;
	change?: number;
}) {
	return (
			<div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6">
				<p className="text-sm text-gray-400">Gold Price</p>

				<h2 className="text-3xl font-bold text-[var(--primary)]">
					${price}
				</h2>

				{change !== undefined && (
						<p
								className={`text-sm mt-2 ${
										change >= 0 ? 'text-green-500' : 'text-red-500'
								}`}
						>
							{change > 0 ? '▲' : '▼'} {change}%
						</p>
				)}
			</div>
	);
}