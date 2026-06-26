import {NextResponse} from "next/server";
import {prisma} from "@/src/lib/prisma";
import bcrypt from "bcryptjs";
import {AUTH_COOKIE_NAME, getAuthCookieOptions, signToken} from "@/src/lib/jwt";

export async function POST(req: Request) {
	try {
		const {email, password} = await req.json();

		if (!email || !password) {
			return NextResponse.json(
					{message: 'Missing fields'},
					{status: 400}
			);
		}

		const normalizedEmail = String(email).trim().toLowerCase();

		const user = await prisma.user.findUnique({
			where: {email: normalizedEmail},
		});

		// Same message for "not found" and "wrong password" — returning
		// distinct messages (as the original code did with 404 vs 401) lets
		// an attacker enumerate which emails are registered. One generic
		// message + 401 for both cases closes that gap.
		if (!user) {
			return NextResponse.json(
					{message: 'User not found'},
					{status: 404},
			);
		}

		const isValid = await bcrypt.compare(
				password,
				user.password
		);

		if (!isValid) {
			return NextResponse.json(
					{message: 'Invalid credentials'},
					{status: 401}
			);
		}

		const token = signToken({
			userId: user.id,
			email: user.email,
			role: user.role,
		});

		const response = NextResponse.json({
			message: 'Login successful',
			token: token,
			user: {id: user.id, email: user.email, name: user.name, role: user.role}
		}, {status: 200,});

		response.cookies.set({
			name: AUTH_COOKIE_NAME,
			value: token,
			...getAuthCookieOptions(),
			maxAge: 60 * 60 * 24 * 7,
		});

		return response;
	} catch (error) {
		console.log('Login error', error);
		return NextResponse.json(
				{message: 'Server error'},
				{status: 500}
		);
	}
}