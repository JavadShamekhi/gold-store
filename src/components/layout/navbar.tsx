'use client';

import Container from "./container";
import {LogOut, User} from "lucide-react";
import Link from "next/link";
import CartDrawer from "@/src/components/layout/cart-drawer";
import {useAuthStore} from "@/src/store/auth-store";
import ThemeToggle from "@/src/components/theme-toggle";
import GoldTicker from "@/src/components/gold/gold-ticker";
import {useEffect, useState, useSyncExternalStore} from "react";
import LanguageSwitcher from "@/src/components/language-switcher";
import {useT} from "@/src/i18n/use-t";
import {useRouter} from "next/navigation";

const subscribe = () => () => {
};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

const Navbar = () => {
	const {user, logout} = useAuthStore();
	const [isScrolled, setIsScrolled] = useState(false);
	const router = useRouter();
	const t = useT();

	// This replaces "mounted" and satisfies ESLint
	const isClient = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 20);
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	// Handle Logout Click
	const handleLogout = async () => {
		await logout(); // This calls the API to clear the cookie and resets Zustand
		router.push('/'); // Send user to home page
		router.refresh(); // Refresh to clear any server-side data
	};

	// If we are on the server, show a simple placeholder to prevent hydration mismatch
	if (!isClient) {
		return <header className="h-20 border-b border-[var(--border)] bg-[var(--background)]"/>;
	}

	return (
			<header
					className={`sticky top-0 z-50 transition-all duration-300 border-b border-[var(--border)] bg-[var(--background)] text-[var(--varforeground)] ${isScrolled ? "shadow-md" : ""}`}>
				<Container>
					{/* Changed flex to grid and added grid-cols-3 */}
					<div className={`grid grid-cols-3 items-center transition-all duration-300 ${isScrolled ? "h-14" : "h-20"}`}>

						{/* 1. Left Part (Logo) */}
						<div className="flex justify-start">
							<div className="flex flex-col items-center leading-tight">
								<Link
										href="/"
										className={`font-bold tracking-wide text-[var(--primary)] transition-all ${isScrolled ? "text-2xl" : "text-3xl"}`}
								>
									ZARRIN
								</Link>

								<div className={`mt-1 mb-1 text-xs transition-all ${isScrolled ? "hidden" : "block"}`}>
									<GoldTicker/>
								</div>
							</div>
						</div>

						{/* 2. Center Part (Nav Links) */}
						<nav className="hidden md:flex items-center justify-center gap-8 text-sm">
							<Link className="hover:text-[var(--primary)] transition" href="/">{t('home')}</Link>
							<Link className="hover:text-[var(--primary)] transition" href="/products">{t('products')}</Link>
							<Link className="hover:text-[var(--primary)] transition" href="/about">{t('about')}</Link>
							<Link className="hover:text-[var(--primary)] transition" href="/contact">{t('contact')}</Link>
						</nav>

						{/* 3. Right Part (User, Darkmode, Cart) */}
						<div className="flex items-center justify-end gap-4">
							<ThemeToggle/>
							<CartDrawer/>
							<div className="flex items-center">
								{user ? (
										<div className="flex items-center gap-3">
										<span className="text-sm text-[var(--foreground)]/70 hidden sm:block">
											{user.email}
										</span>
											<button
													onClick={handleLogout}
													className="hover:text-red-500 transition cursor-pointer p-1"
													title="Logout"
											>
												<LogOut size={20}/>
											</button>
										</div>
								) : (
										<Link
												href="/login"
												className="hover:text-[var(--primary)] transition"
										>
											<User size={isScrolled ? 20 : 22}/>
										</Link>
								)}
							</div>
							<LanguageSwitcher/>
						</div>

					</div>
				</Container>
			</header>
	);
};

export default Navbar;