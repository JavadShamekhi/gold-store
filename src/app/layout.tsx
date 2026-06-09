import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import {Toaster} from "sonner";
import {ThemeProvider} from "@/src/components/providers/theme-provider";

const inter = Inter({
	subsets: ['latin'],
	variable: '--font-inter',
});

const playfair = Playfair_Display({
	subsets: ['latin'],
	variable: '--font-playfair',
});

export const metadata: Metadata = {
	title: 'Zarrin Gold Store',
	description: 'Luxury Jewelry E-Commerce Platform',
};

export default function RootLayout({
	                                   children,
                                   }: Readonly<{
	children: React.ReactNode;
}>) {
	return (
			<html lang="en" suppressHydrationWarning>
			<body
					className={`${inter.variable} ${playfair.variable} antialiased`}
			>
				<ThemeProvider>
					<Toaster richColors/>
						{children}
				</ThemeProvider>
			</body>
			</html>
	);
}