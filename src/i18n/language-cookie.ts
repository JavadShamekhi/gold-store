export const LANG_COOKIE = 'lang';

export function getLangFromCookie(cookieHeader?: string): 'en' | 'fa' {
	if (!cookieHeader) return 'en';

	const match = cookieHeader
			.split(';')
			.find(c => c.trim().startsWith(`${LANG_COOKIE}=`));

	if (!match) return 'en';

	const value = match.split('=')[1];

	return value === 'fa' ? 'fa' : 'en';
}