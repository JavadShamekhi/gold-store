import type {Metadata} from 'next';
import {Inter, Playfair_Display} from 'next/font/google';
import './globals.css';
import {Toaster} from "sonner";
import {ThemeProvider} from "@/src/components/providers/theme-provider";
import {LanguageProvider} from "@/src/i18n/language-context";
import '@fontsource/vazirmatn/400.css';
import '@fontsource/vazirmatn/500.css';
import '@fontsource/vazirmatn/700.css';
import AuthProvider from "@/src/components/providers/auth-provider";
import {cookies} from "next/headers";

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

export default async function RootLayout({
	                                   children,
                                   }: Readonly<{
	children: React.ReactNode;
}>) {
	const cookieStore = await cookies()
	const initialLang = cookieStore.get('lang')?.value || 'en';

	return (
			<html lang={initialLang} suppressHydrationWarning>
			<body
					className={`${inter.variable} ${playfair.variable} antialiased`}
			>
			<LanguageProvider>
				<ThemeProvider>
					<AuthProvider>
						<Toaster richColors/>
						{children}
					</AuthProvider>
				</ThemeProvider>
			</LanguageProvider>
			</body>
			</html>
	)
			;
}