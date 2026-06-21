import type {Metadata} from 'next';
import {Inter, Space_Grotesk, Vazirmatn} from 'next/font/google';
import './globals.css';
import {Toaster} from "sonner";
import {ThemeProvider} from "@/src/components/providers/theme-provider";
import '@fontsource/vazirmatn/400.css';
import '@fontsource/vazirmatn/500.css';
import '@fontsource/vazirmatn/700.css';
import AuthProvider from "@/src/components/providers/auth-provider";
import {LocaleProvider} from "@/src/lib/i18n/LocaleProvider";
import {getDictionary} from "@/src/lib/i18n/getDictionary";

const inter = Inter({
	subsets: ['latin'],
	variable: '--font-inter',
});
const spaceGrotesk = Space_Grotesk({subsets: ['latin'], variable: '--font-space'})
const vazirmatn = Vazirmatn({subsets: ['arabic'], variable: '--font-vazir'});

export const metadata: Metadata = {
	title: 'Zarrin Gold Store',
	description: 'Luxury Jewelry E-Commerce Platform',
	icons: {
		icon: '/icon/gold-dollar-coin.png',
	}
};

export default async function RootLayout({
	                                         children,
                                         }: Readonly<{
	children: React.ReactNode;
}>) {
	const dict = await getDictionary('en');

	return (
			<html lang='en' dir="ltr" suppressHydrationWarning>
			<head>
				{/* Prevents a flash of wrong direction/language before React hydrates */}
				<script
						dangerouslySetInnerHTML={{
							__html: `
              try {
                var l = localStorage.getItem('locale');
                if (l === 'fa') {
                  document.documentElement.dir = 'rtl';
                  document.documentElement.lang = 'fa';
                }
              } catch (e) {}
            `,
						}}
				/>
			</head>
			<body
					className={`${inter.variable} ${spaceGrotesk.variable} ${vazirmatn.variable} antialiased`}
			>
			<LocaleProvider initialDict={dict}>
				<ThemeProvider>
					<AuthProvider>
						<Toaster richColors/>
						{children}
					</AuthProvider>
				</ThemeProvider>
			</LocaleProvider>
			</body>
			</html>
	)
			;
}