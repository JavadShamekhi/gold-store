'use client';

import Container from "./container";
import {User} from "lucide-react";
import Link from "next/link";
import CartDrawer from "@/src/components/layout/cart-drawer";
import {useAuthStore} from "@/src/store/auth-store";
import ThemeToggle from "@/src/components/theme-toggle";
import GoldTicker from "@/src/components/gold-ticker";
import {useEffect, useState} from "react";

const Navbar = () => {
	const user = useAuthStore((state) => state.user);
	const [isScrolled, setIsScrolled] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			if (window.scrollY > 20) {
				setIsScrolled(true);
			} else {
				setIsScrolled(false);
			}
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

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
							<Link className="hover:text-[var(--primary)] transition" href="/">Home</Link>
							<Link className="hover:text-[var(--primary)] transition" href="/products">Products</Link>
							<Link className="hover:text-[var(--primary)] transition" href="/about">About</Link>
							<Link className="hover:text-[var(--primary)] transition" href="/contact">Contact</Link>
						</nav>

						{/* 3. Right Part (User, Darkmode, Cart) */}
						<div className="flex items-center justify-end gap-4">
							<ThemeToggle/>
							<CartDrawer/>
							<div className="flex items-center">
								{user ? (
										<span className="text-sm text-[var(--foreground)]/70">
									{user.email}
								</span>
								) : (
										<Link
												href="/login"
												className="hover:text-[var(--primary)] transition"
										>
											<User size={isScrolled ? 18 : 22}/>
										</Link>
								)}
							</div>
						</div>

					</div>
				</Container>
			</header>
	);
};

export default Navbar;