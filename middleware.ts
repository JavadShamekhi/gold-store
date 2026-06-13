import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const LANG_COOKIE = 'lang';

export async function middleware(request: NextRequest) {
	const token = request.cookies.get('token')?.value;

	const { pathname } = request.nextUrl;

	const lang =
			request.cookies.get(LANG_COOKIE)?.value || 'en';

	const response = NextResponse.next();

	response.headers.set('x-lang', lang);

	// PUBLIC ROUTES
	const publicRoutes = [
		'/',
		'/login',
		'/register',
		'/products',
	];

	const isPublic = publicRoutes.some(
			(route) =>
					pathname === route ||
					pathname.startsWith(`${route}/`)
	);

	// VERIFY TOKEN
	let payload: any = null;

	if (token) {
		try {
			const secret = new TextEncoder().encode(
					process.env.JWT_SECRET
			);

			const result = await jwtVerify(token, secret);

			payload = result.payload;
		} catch {
			payload = null;
		}
	}

	// ADMIN ROUTES
	if (pathname.startsWith('/admin')) {
		if (!payload) {
			return NextResponse.redirect(
					new URL('/login', request.url)
			);
		}

		if (payload.role !== 'ADMIN') {
			return NextResponse.redirect(
					new URL('/', request.url)
			);
		}
	}

	// USER PROTECTED ROUTES
	if (
			pathname.startsWith('/wallet') ||
			pathname.startsWith('/profile') ||
			pathname.startsWith('/orders') ||
			pathname.startsWith('/transactions')
	) {
		if (!payload) {
			return NextResponse.redirect(
					new URL('/login', request.url)
			);
		}
	}

	// LOGIN PAGE
	if (pathname === '/login' && payload) {
		if (payload.role === 'ADMIN') {
			return NextResponse.redirect(
					new URL('/admin/products', request.url)
			);
		}

		return NextResponse.redirect(
				new URL('/', request.url)
		);
	}

	return response;
}

export const config = {
	matcher: [
		'/((?!api|_next/static|_next/image|favicon.ico).*)',
	],
};