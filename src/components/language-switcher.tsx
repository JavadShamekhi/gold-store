'use client';

import {useLanguage} from "@/src/i18n/language-context";

export default function LanguageSwitcher() {
	const {lang, setLang} = useLanguage();

	return (
			<button
					onClick={() => setLang(lang === 'en' ? 'fa' : 'en')}
					className="
				px-3 py-1 rounded-full border
				border-[var(--border)]
				hover:border-[var(--primary)]
				transition text-sm
				cursor-pointer
			"
			>
				{lang === 'en' ? 'فا' : 'EN'}
			</button>
	);
}