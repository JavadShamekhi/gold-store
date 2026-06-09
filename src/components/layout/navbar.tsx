'use client';

import Container from "./container";
import { User} from "lucide-react";
import Link from "next/link";
import CartDrawer from "@/src/components/layout/cart-drawer";
import {useAuthStore} from "@/src/store/auth-store";
import ThemeToggle from "@/src/components/theme-toggle";
import GoldTicker from "@/src/components/gold-ticker";

const Navbar = () => {
	const user = useAuthStore((state) => state.user);

	return (
			<header className="border-b border-[var(--border)] bg-[var(--background)] text-[var(--varforeground)]">
				<Container>
					<div className="flex items-center justify-between h-20">
						<div className="flex flex-col items-center leading-tight">
							<Link
									href="/"
									className="text-3xl font-bold tracking-wide text-[var(--primary)]"
							>
								ZARRIN
							</Link>

							<div className="mt-1 mb-1 text-xs">
								<GoldTicker />
							</div>
						</div>

						<nav className="hidden md:flex items-center gap-8 text-sm">
							<Link className="hover:text-[var(--primary)] transition" href="/">Home</Link>
							<Link className="hover:text-[var(--primary)] transition" href="/products">Products</Link>
							<Link className="hover:text-[var(--primary)] transition" href="/about">About</Link>
							<Link className="hover:text-[var(--primary)] transition" href="/contact">Contact</Link>
						</nav>

						<div className="flex items-center gap-4">

							<ThemeToggle />
							<CartDrawer />
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
											<User size={22} />
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