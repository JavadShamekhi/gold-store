'use client';

import Link from 'next/link';
import { useLocale } from '@/src/lib/i18n/LocaleProvider';

export default function GoldActions() {
	const { dict } = useLocale();

	return (
			<div className="flex gap-4">
				<Link
						href="/gold/buy"
						className="flex-1 bg-green-500 text-black text-center py-3 rounded-xl font-bold hover:opacity-90 transition-opacity"
				>
					{dict?.gold.actions.buy}
				</Link>

				<Link
						href="/gold/sell"
						className="flex-1 bg-red-500 text-white text-center py-3 rounded-xl font-bold hover:opacity-90 transition-opacity"
				>
					{dict?.gold.actions.sell}
				</Link>
			</div>
	);
}