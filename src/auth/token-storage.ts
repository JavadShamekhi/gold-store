const KEY = 'auth_token';

export const tokenStorage = {
	set(token: string) {
		if (typeof window === 'undefined') return;
		localStorage.setItem(KEY, token);
	},

	get() {
		if (typeof window === 'undefined') return null;
		return localStorage.getItem(KEY);
	},

	remove() {
		if (typeof window === 'undefined') return;
		localStorage.removeItem(KEY);
	},
};