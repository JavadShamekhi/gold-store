export const locales = ['en', 'fa'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

export const localeNames: Record<Locale, string> = {
	en: 'English',
	fa: 'فارسی',
};

export const rtlLocales: Locale[] = ['fa'];

export function getDirection(locale: Locale): 'ltr' | 'rtl' {
	return rtlLocales.includes(locale) ? 'rtl' : 'ltr';
}