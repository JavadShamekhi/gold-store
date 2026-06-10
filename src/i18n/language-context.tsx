'use client';

import {createContext, useContext, useEffect, useState} from 'react';

type Lang = 'en' | 'fa';

type LangContextType = {
	lang: Lang;
	setLang: (lang: Lang) => void;
};

const LanguageContext = createContext<LangContextType>({
	lang: 'en',
	setLang: () => {
	},
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({
	                                 children,
                                 }: {
	children: React.ReactNode;
}) => {
	// ✅ FIX: lazy init instead of useEffect
	const [lang, setLang] = useState<Lang>(() => {
		if (typeof window === 'undefined') return 'en';

		return (localStorage.getItem('lang') as Lang) || 'en';
	});

	useEffect(() => {
		localStorage.setItem('lang', lang);

		const html = document.documentElement;
		html.lang = lang;
		html.dir = lang === 'fa' ? 'rtl' : 'ltr';

		// Use the classes defined in your @theme
		if (lang === 'fa') {
			html.classList.add('font-fa');
			html.classList.remove('font-en');
		} else {
			html.classList.add('font-en');
			html.classList.remove('font-fa');
		}
	}, [lang]);

	return (
			<LanguageContext.Provider value={{lang, setLang}}>
				{children}
			</LanguageContext.Provider>
	);
};