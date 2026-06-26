import {NextResponse} from "next/server";
import {prisma} from "@/src/lib/prisma";
import bcrypt from "bcryptjs";
import {registerSchema} from "@/src/features/auth/schemas/register-schema";

export async function POST(req: Request) {
	try {
		const body = await req.json();

		const parsed = registerSchema.safeParse(body);
		if (!parsed.success) {
			// Return the first validation error message — keeps the response
			// shape simple and consistent with your existing routes.
			const firstError = parsed.error.issues[0]?.message ?? 'Invalid input';
			return NextResponse.json(
					{message: firstError},
					{status: 400}
			);
		}

		const {name, email, password} = parsed.data;

		// Normalize email so "User@x.com" and "user@x.com" aren't treated
		// as different accounts.
		const normalizedEmail = email.trim().toLowerCase();

		const existingUser = await prisma.user.findUnique({
			where: {email: normalizedEmail},
		});

		if (existingUser) {
			// Deliberately vague — confirming "this email is already registered"
			// is a minor account-enumeration leak, but for most apps this is an
			// acceptable tradeoff for clearer UX. Flagging in case you want to
			// soften it later (e.g. always returning a generic message and
			// emailing the existing user instead).
			return NextResponse.json(
					{message: 'An account with this email already exists'},
					{status: 409}
			);
		}

		// 12 salt rounds is a reasonable default cost for bcrypt in 2026 —
		// higher than the common "10" default, without being slow enough
		// to hurt UX on typical serverless function CPU.
		const hashedPassword = await bcrypt.hash(password, 12);

		const user = await prisma.user.create({
			data: {
				name,
				email: normalizedEmail,
				password: hashedPassword,
				// role intentionally omitted — relies on your Prisma schema's
				// @default("user") so nobody can pass role: "admin" in the body.
			},
			select: {id: true, email: true, name: true, role: true},
		});

		// No cookie/token set here — per your choice, signup just creates the
		// account and the user is redirected to /login to sign in normally.
		return NextResponse.json(
				{message: 'Account created successfully', user},
				{status: 201}
		);

	} catch (error) {
		console.error('Signup error:', error);
		return NextResponse.json(
				{message: 'Server error'},
				{status: 500}
		);
	}
}