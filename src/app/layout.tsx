import type {Metadata} from 'next';
import {Inter, Playfair_Display} from 'next/font/google';
import './globals.css';
import {Toaster} from "sonner";
import {ThemeProvider} from "@/src/components/providers/theme-provider";
import {LanguageProvider} from "@/src/i18n/language-context";
import '@fontsource/vazirmatn/400.css';
import '@fontsource/vazirmatn/500.css';
import '@fontsource/vazirmatn/700.css';

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
					suppressHydrationWarning
					className={`${inter.variable} ${playfair.variable} antialiased`}
			>
			<LanguageProvider>
				<ThemeProvider>
					<Toaster richColors/>
					{children}
				</ThemeProvider>
			</LanguageProvider>
			</body>
			</html>
	)
			;
}