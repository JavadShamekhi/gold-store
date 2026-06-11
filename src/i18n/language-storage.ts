export type Lang = 'en' | 'fa';

const KEY = 'lang';

export const langStorage = {
	get(): Lang | null {
		if (typeof window === 'undefined') return null;
		return (localStorage.getItem(KEY) as Lang) || null;
	},

	set(lang: Lang) {
		localStorage.setItem(KEY, lang);
	},
};