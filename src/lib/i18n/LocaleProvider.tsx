'use client';

import {
	createContext,
	useContext,
	useEffect,
	useState,
	type ReactNode,
} from 'react';
import {defaultLocale, getDirection, locales, type Locale} from './config';
import {getDictionary} from './getDictionary';
import type {Dictionary} from './types';
import Cookies from 'js-cookie';

const STORAGE_KEY = 'locale';

type LocaleContextValue = {
	locale: Locale;
	dict: Dictionary | null;
	setLocale: (locale: Locale) => void;
	isLoading: boolean;
};

const LocaleContext = createContext<LocaleContextValue | undefined>(
		undefined,
);

function readStoredLocale(): Locale {
	if (typeof window === 'undefined') return defaultLocale;
	const stored = window.localStorage.getItem(STORAGE_KEY);
	return locales.includes(stored as Locale) ? (stored as Locale) : defaultLocale;
}

export function LocaleProvider({
	                               children,
	                               initialDict,
                               }: {
	children: ReactNode;
	initialDict: Dictionary;
}) {
	const [locale, setLocaleState] = useState<Locale>(defaultLocale);
	const [dict, setDict] = useState<Dictionary | null>(initialDict);
	const [isLoading, setIsLoading] = useState(false);

	// On mount, pick up whatever locale was stored from a previous visit.
	useEffect(() => {
		const stored = readStoredLocale();
		if (stored !== defaultLocale) {
			setLocale(stored);
		} else {
			applyDomAttributes(stored);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	function applyDomAttributes(loc: Locale) {
		document.documentElement.dir = getDirection(loc);
		document.documentElement.lang = loc;
	}

	function setLocale(next: Locale) {
		setIsLoading(true);
		getDictionary(next)
				.then((nextDict) => {
					setDict(nextDict);
					setLocaleState(next);
					Cookies.set(STORAGE_KEY, next, { expires: 365});
					applyDomAttributes(next);
					window.localStorage.setItem(STORAGE_KEY, next);
					applyDomAttributes(next);
					if (nextDict.metadata) {
						document.title = nextDict.metadata.title;
					}
				})
				.finally(() => setIsLoading(false));
	}

	return (
			<LocaleContext.Provider value={{locale, dict, setLocale, isLoading}}>
				{children}
			</LocaleContext.Provider>
	);
}

export function useLocale() {
	const ctx = useContext(LocaleContext);
	if (!ctx) {
		throw new Error('useLocale must be used within a LocaleProvider');
	}
	return ctx;
}