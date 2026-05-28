import Container from "./container";
import {ShoppingCart, User} from "lucide-react";
import Link from "next/link";
import CartDrawer from "@/src/components/layout/cart-drawer";

const Navbar = () => {
	return (
			<header className="border-b border-white/10">
				<Container>
					<div className="flex items-center justify-between h-20">
						<Link href="/" className="text-3xl font-bold tracking-wide text-[#d4af37]">
							ZARRIN
						</Link>

						<nav className="hidden md:flex items-center gap-8 text-sm">
							<Link className="hover:text-[#d4af37] transition" href="/">Home</Link>
							<Link className="hover:text-[#d4af37] transition" href="/products">Products</Link>
							<Link className="hover:text-[#d4af37] transition" href="/about">About</Link>
							<Link className="hover:text-[#d4af37] transition" href="/contact">Contact</Link>
						</nav>

						<div className="flex items-center gap-4">
							<CartDrawer />

							<button className="hover:text-[#d4af37] transition cursor-pointer">
								<User size={22} />
							</button>
						</div>
					</div>
				</Container>
			</header>
	);
};

export default Navbar;