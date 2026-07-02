import {useLocale} from "@/src/lib/i18n/LocaleProvider";
import {formatNumber, toPersianDigits} from "@/src/lib/i18n/formatters";

type ChangeData = {
	percent: number | null;
	direction: 'up' | 'down' | 'unchanged' | null;
	previousPrice: number | null;
}

export default function GoldPriceCard({
	                                      price,
	                                      change,
                                      }: {
	price: number;
	change?: ChangeData;
}) {
	const {dict, locale} = useLocale();
	const percent = change?.percent ?? null;
	const direction = change?.direction ?? null;

	const directionColor = direction === 'up' ?
			'text-green-500' : direction === 'down' ? 'text-red-500' : 'text-[var(--foreground]/60';
	const directionArrow = direction === 'up' ? '▲' : direction === 'down' ? '▼' : '';
	const formattedPrice = formatNumber(price*10, locale);
	const formattedPercent = percent !== null ? formatNumber(Math.abs(percent), locale, {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	}) : null;
	const sign = direction === 'down' ? '-' : '+';
	const percentDisplay =
			direction === 'unchanged'
					? formatNumber(0, locale, {minimumFractionDigits: 2, maximumFractionDigits: 2})
					: `${locale === 'fa' ? toPersianDigits(sign) : sign}${formattedPercent}`;

	return (
			<div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6">
				<p className="text-sm text-[var(--foreground)]/60">
					{dict?.gold.priceCard.label}
				</p>

				<h2 className="text-3xl font-bold text-[#d4af37]">
					{formattedPrice} <span className="text-lg">{dict?.gold.priceCard.currency}</span>
				</h2>

				{formattedPercent !== null && direction !== null && (
						<p className={`flex items-center gap-0.5 text-sm font-medium mt-2 ${directionColor}`}>
							{directionArrow && <span className="text-xs">{directionArrow}</span>}
							{percentDisplay}%
						</p>
				)}
			</div>
	);
}