export function rtl(
		ltr: string,
		rtl: string
) {
	if (typeof document === 'undefined') return ltr;
	return document.documentElement.dir === 'rtl' ? rtl : ltr;
}