import {NextResponse} from "next/server";
import {prisma} from "@/src/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';

export async function POST(req: Request) {
	try {
		const body = await req.json();
		const {email, password} = body;

		if (!email || !password) {
			return NextResponse.json(
					{message: 'Missing fields'},
					{status: 400}
			);
		}

		const user = await prisma.user.findUnique({
			where: {email},
		});

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

		const token = jwt.sign({
					userId: user.id,
					email: user.email,
					role: user.role,
				},
				process.env.JWT_SECRET!,
				{expiresIn: '7d'}
		);

		const response = NextResponse.json({
			message: 'Login successful', token: token,
		}, {status: 200,});

		response.cookies.set({
			name: 'token',
			value: token,
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			path: '/',
		});

		return response;
	} catch (error) {
		return NextResponse.json(
				{message: 'Server error'},
				{status: 500}
		);
	}
}