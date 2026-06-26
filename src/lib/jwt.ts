import jwt from 'jsonwebtoken';

// Fail fast and clearly at startup/first-use if the secret is missing,
// instead of a cryptic crash deep inside jwt.sign/verify later.
function getJwtSecret(): string {
	const secret = process.env.JWT_SECRET;
	if (!secret) {
		throw new Error('JWT_SECRET environment variable is not set');
	}
	return secret;
}

export type JwtPayload = {
	userId: string;
	email: string;
	role: string;
};

export function signToken(payload: JwtPayload): string {
	return jwt.sign(payload, getJwtSecret(), { expiresIn: '7d' });
}

export function verifyToken(token: string): JwtPayload {
	return jwt.verify(token, getJwtSecret()) as JwtPayload;
}

// Single source of truth for cookie options — used by both login (to set)
// and logout (to clear). Keeping them in one place avoids the bug where
// logout's attributes don't match login's, which can cause delete to
// silently fail in some browsers.
export const AUTH_COOKIE_NAME = 'token';

export function getAuthCookieOptions() {
	return {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'lax' as const,
		path: '/',
	};
}