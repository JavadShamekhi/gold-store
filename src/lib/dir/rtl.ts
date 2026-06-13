export function isRTL() {
	if (typeof document === 'undefined') return false;
	return document.documentElement.dir === 'rtl';
}

export function rtl(ltr: string, rtl: string) {
	return isRTL() ? rtl : ltr;
}

// spacing helpers (optional but useful)
export function startPadding() {
	return isRTL() ? 'pr-' : 'pl-';
}

export function endPadding() {
	return isRTL() ? 'pl-' : 'pr-';
}