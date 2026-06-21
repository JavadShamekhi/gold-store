import type { Locale } from './config';

const dictionaries = {
	en: () => import('@/src/messages/en.json').then((m) => m.default),
	fa: () => import('@/src/messages/fa.json').then((m) => m.default),
};

export async function getDictionary(locale: Locale) {
	return dictionaries[locale]();
}