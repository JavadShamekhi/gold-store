import type {Metadata} from 'next';
import {Inter, Space_Grotesk, Vazirmatn} from 'next/font/google';
import './globals.css';
import {Toaster} from "sonner";
import {ThemeProvider} from "@/src/components/providers/theme-provider";
import AuthProvider from "@/src/components/providers/auth-provider";
import {LocaleProvider} from "@/src/lib/i18n/LocaleProvider";
import {getDictionary} from "@/src/lib/i18n/getDictionary";
import {cookies} from "next/headers";

const inter = Inter({
	subsets: ['latin'],
	variable: '--font-inter',
});
const spaceGrotesk = Space_Grotesk({subsets: ['latin'], variable: '--font-space'})
const vazirmatn = Vazirmatn({subsets: ['arabic'], variable: '--font-vazir'});

export async function generateMetadata(): Promise<Metadata> {
	const cookieStore = await cookies();
	const lang = (cookieStore.get('locale')?.value || 'en') as any;
	const dict = await getDictionary(lang);

	return {
		title: dict.metadata.title,
		description: dict.metadata.description,
		icons: {
			icon: '/icon/gold-dollar-coin.png',
		}
	}
};

export default async function RootLayout({
	                                         children,
                                         }: Readonly<{
	children: React.ReactNode;
}>) {
	const cookieStore = await cookies();
	const lang = (cookieStore.get('locale')?.value || 'en') as any;
	const dict = await getDictionary(lang);

	return (
			<html lang={lang} dir={lang === 'fa' ? 'rtl' : 'ltr'} suppressHydrationWarning>

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
	);
}