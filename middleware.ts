import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_PATHS = [
	'/login',
	'/_next',
	'/favicon.ico',
	'/api/auth/login'
];

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p));
	const session = request.cookies.get('xpoint_session')?.value;

	if (!isPublic && !session) {
		const url = request.nextUrl.clone();
		url.pathname = '/login';
		return NextResponse.redirect(url);
	}

	if (isPublic && session && pathname === '/login') {
		const url = request.nextUrl.clone();
		url.pathname = '/';
		return NextResponse.redirect(url);
	}

	return NextResponse.next();
}

export const config = {
	matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};
