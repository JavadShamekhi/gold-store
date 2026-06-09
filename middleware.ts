import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export function middleware(request: NextRequest) {
	const token = request.cookies.get('token')?.value;
	const { pathname } = request.nextUrl;
	const isAdminRoute = pathname.startsWith('/admin');
	const isLoginPage = pathname === '/login';

	// No token → block admin
	if (isAdminRoute && !token) {
		return NextResponse.redirect(new URL('/login', request.url));
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
			if (isAdminRoute && decoded.role !== 'ADMIN') {
				return NextResponse.redirect(new URL('/', request.url));
			}

			// If user is logged in and goes to login page
			if (isLoginPage) {
				return NextResponse.redirect(new URL('/admin/products', request.url));
			}
		} catch (err) {
			return NextResponse.redirect(new URL('/login', request.url));
		}
	}

	return NextResponse.next();
}