import Link from 'next/link';

export default function GoldActions() {
	return (
			<div className="flex gap-4">
				<Link
						href="/gold/buy"
						className="flex-1 bg-green-500 text-black text-center py-3 rounded-xl font-bold hover:opacity-90"
				>
					Buy Gold
				</Link>

				<Link
						href="/gold/sell"
						className="flex-1 bg-red-500 text-white text-center py-3 rounded-xl font-bold hover:opacity-90"
				>
					Sell Gold
				</Link>
			</div>
	);
}