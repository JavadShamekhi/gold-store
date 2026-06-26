import {cookies} from "next/headers";
import {NextResponse} from "next/server";
import {prisma} from "@/src/lib/prisma";
import {AUTH_COOKIE_NAME, verifyToken} from "@/src/lib/jwt";

export async function GET() {
	try {
		const cookieStore = await cookies();
		const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
		if (!token) {
			return NextResponse.json({user: null}, {status: 401});
		}
		const decoded = verifyToken(token);
		const user = await prisma.user.findUnique({
			where: {id: decoded.userId},
			select: {id: true, email: true, name: true, role: true}
		});

		if (!user) {
			// Token was valid but the user no longer exists (e.g. deleted account).
			// Treat this the same as "not authenticated" rather than crashing.
			return NextResponse.json({user: null}, {status: 401});
		}

		return NextResponse.json({user});
	} catch (error) {
		// Covers expired/invalid/tampered tokens (jwt.verify throws) as well
		// as a missing JWT_SECRET — all collapse to "not authenticated" here.
		return NextResponse.json({user: null}, {status: 401});
	}
}