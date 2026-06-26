import {create} from "zustand";
import {persist} from "zustand/middleware";

type User = {
	id: string;
	name: string;
	email: string;
	role: string;
};

type AuthStore = {
	user: User | null;
	isLoading: boolean;
	login: (user: User) => void;
	logout: () => Promise<void>;
	checkAuth: () => Promise<void>;
};

export const useAuthStore = create<AuthStore>()(
		persist((set) => ({
					user: null,
					isLoading: true,
					login: (user) => set({user, isLoading: false}),

					logout: async () => {
						try {
							await fetch('/api/auth/logout', {method: 'POST'});
						} catch (error) {
							console.error("Logout failed", error);
						} finally {
							set({user: null});
						}
					},

					checkAuth: async () => {
						set({isLoading: true});
						try {
							const res = await fetch('/api/auth/me');
							const data = await res.json();
							if (res.ok && data.user) {
								set({user: data.user, isLoading: false});
							} else {
								set({user: null, isLoading: false});
							}
						} catch (error) {
							set({user: null, isLoading: false});
						}
					},
				}),
				{
					name: 'gold-store-auth',
					partialize: (state) => ({user: state.user}),
				}
		)
);