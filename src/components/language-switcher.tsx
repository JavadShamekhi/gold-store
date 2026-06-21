'use client';

import {useLocale} from '@/src/lib/i18n/LocaleProvider';

export default function LanguageSwitcher() {
	const {locale, setLocale} = useLocale();

	return (
			<button
					onClick={() => setLocale(locale === 'en' ? 'fa' : 'en')}
					className="
				px-3 py-1 rounded-full border
				border-[var(--border)]
				hover:border-[var(--primary)]
				transition text-sm
				hover:scale-105
				cursor-pointer
			"
			>
				{locale === 'en' ? 'پارسی' : 'EN'}
			</button>
	);
}