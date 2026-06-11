import {cookies} from "next/headers";
import {NextResponse} from "next/server";
import jwt from "jsonwebtoken";
import {prisma} from "@/src/lib/prisma";

export async function GET() {
	try {
		const cookieStore = await cookies();
		const token = cookieStore.get('token')?.value;
		if (!token) {
			return NextResponse.json({user: null}, {status: 401});
		}
		const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
		const user = await prisma.user.findUnique({
			where: {id: decoded.userId},
			select: {id: true, email: true, role: true}
		});
		return NextResponse.json({user});
	} catch (error) {
		return NextResponse.json({user: null}, {status: 401});
	}
}