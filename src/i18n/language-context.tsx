'use client';

import {createContext, useContext, useEffect, useState} from 'react';
import {langStorage, Lang} from './language-storage';

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
	                                 initialLang,
                                 }: {
	children: React.ReactNode;
	initialLang?: Lang;
}) => {
	const [lang, setLangState] = useState<Lang>(initialLang || 'en');

	// 🔄 hydrate from localStorage AFTER mount
	useEffect(() => {
		const stored = langStorage.get();

		if (stored && stored !== lang) {
			setLangState(stored);
		}
	}, []);

	// 🔄 sync changes
	useEffect(() => {
		langStorage.set(lang);

		document.cookie = `lang=${lang}; path=/; max-age=31536000`;

		document.documentElement.lang = lang;
		document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';

		document.documentElement.classList.remove('font-fa', 'font-en');
		document.documentElement.classList.add(
				lang === 'fa' ? 'font-fa' : 'font-en'
		);
	}, [lang]);

	return (
			<LanguageContext.Provider value={{lang, setLang: setLangState}}>
				{children}
			</LanguageContext.Provider>
	);
};