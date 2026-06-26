import {NextResponse} from 'next/server';
import {AUTH_COOKIE_NAME, getAuthCookieOptions} from "@/src/lib/jwt";

export async function POST() {
	const response = NextResponse.json({
		message: 'Logged out successfully',
	});

	// 🧹 Clear cookie
	response.cookies.set({
		name: AUTH_COOKIE_NAME,
		value: '',
		...getAuthCookieOptions(),
		expires: new Date(0), // 👈 instantly delete
	});

	return response;
}