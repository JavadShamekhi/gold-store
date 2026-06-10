import {NextResponse} from 'next/server';
import type {NextRequest} from 'next/server';
import jwt from 'jsonwebtoken';
import createMiddleware from "next-intl/middleware";

const intlMiddleware = createMiddleware({
	locales: ['en', 'fa'],
	defaultLocale: 'en',
});

export function middleware(request: NextRequest) {
	const response = intlMiddleware(request);
	const token = request.cookies.get('token')?.value;
	const {pathname} = request.nextUrl;
	const isAdminRoute =
			pathname.startsWith('/en/admin') ||
			pathname.startsWith('/fa/admin');
	const isLoginPage =
			pathname === '/en/login' ||
			pathname === '/fa/login';


	// No token → block admin
	if (isAdminRoute && !token) {
		const locale = pathname.startsWith('/fa')
				? 'fa'
				: 'en';

		return NextResponse.redirect(
				new URL(`/${locale}/login`, request.url)
		);
	}

	// Token exists → verify it
	if (token) {
		try {
			const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
				role: string;
				userId: string;
				email: string;
			};

			// 🚨 ROLE CHECK (NEW PART)
			if (
					isAdminRoute &&
					decoded.role !== 'ADMIN'
			) {
				const locale = pathname.startsWith('/fa')
						? 'fa'
						: 'en';

				return NextResponse.redirect(
						new URL(`/${locale}`, request.url)
				);
			}

			if (isLoginPage) {
				const locale = pathname.startsWith('/fa')
						? 'fa'
						: 'en';

				return NextResponse.redirect(
						new URL(
								`/${locale}/admin/products`,
								request.url
						)
				);
			}
		} catch {
			const locale = pathname.startsWith('/fa')
					? 'fa'
					: 'en';

			return NextResponse.redirect(
					new URL(`/${locale}/login`, request.url)
			);
		}
	}

	return response;
}

export const config = {
	matcher: [
		'/',
		'/(fa|en)/:path*',
		'/((?!api|_next|.*\\..*).*)',
	],
};