import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export async function getCurrentUser() {
	const cookieStore = await cookies();

	const token = cookieStore.get('token')?.value;

	if (!token) {
		return null;
	}

	try {
		return jwt.verify(
				token,
				process.env.JWT_SECRET!
		) as {
			userId: string;
			email: string;
			role: string;
		};
	} catch {
		return null;
	}
}