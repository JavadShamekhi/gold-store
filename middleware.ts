import {NextResponse} from 'next/server';
import type {NextRequest} from 'next/server';
import {jwtVerify} from 'jose'; // Essential for Edge Runtime

const LANG_COOKIE = 'lang';

export async function middleware(request: NextRequest) {
	const token = request.cookies.get('token')?.value;
	const {pathname} = request.nextUrl;
	const lang = request.cookies.get(LANG_COOKIE)?.value || 'en';

	const response = NextResponse.next();
	response.headers.set('x-lang', lang);

	// 1. ADMIN ROUTE PROTECTION
	if (pathname.startsWith('/admin')) {
		// No token? Go to login
		if (!token) {
			return NextResponse.redirect(new URL('/login', request.url));
		}

		try {
			// Verify JWT using jose
			const secret = new TextEncoder().encode(process.env.JWT_SECRET);
			const {payload} = await jwtVerify(token, secret);

			// Role check: If not ADMIN, kick them back to the home page
			if (payload.role !== 'ADMIN') {
				return NextResponse.redirect(new URL('/', request.url));
			}
		} catch (error) {
			// Token is fake or expired
			return NextResponse.redirect(new URL('/login', request.url));
		}
	}

	// 2. LOGIN PAGE PROTECTION
	// If the user is ALREADY logged in as admin, don't show them the login page
	if (pathname === '/login' && token) {
		try {
			const secret = new TextEncoder().encode(process.env.JWT_SECRET);
			const {payload} = await jwtVerify(token, secret);

			if (payload.role === 'ADMIN') {
				return NextResponse.redirect(new URL('/admin/products', request.url));
			}
		} catch (error) {
			// If token is bad, let them stay on login page to re-authenticate
			return NextResponse.next();
		}
	}

	return response;
}

// 3. CONFIGURATION
export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 */
		'/((?!api|_next/static|_next/image|favicon.ico).*)',
	],
};