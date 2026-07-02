import {useLocale} from "@/src/lib/i18n/LocaleProvider";
import {formatNumber} from "@/src/lib/i18n/formatters";

export default function GoldBalanceCard({grams}: { grams: number }) {
	const {dict, locale} = useLocale();

	const formattedGrams = formatNumber(grams, locale, {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	});

	return (
			<div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6">
				<p className="text-sm text-gray-400">{dict?.gold.balanceCard.label}</p>
				<h2 className="text-3xl font-bold">
					{formattedGrams} {dict?.gold.balanceCard.unit}
				</h2>
			</div>
	);
}