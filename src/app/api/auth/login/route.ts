import { NextResponse } from "next/server";

export async function POST(request: Request) {
	const { username, password } = await request.json();

	const isValid = username === 'admin' && password === 'xpoint123';
	if (!isValid) {
		return NextResponse.json({ message: 'Geçersiz kullanıcı adı veya şifre' }, { status: 401 });
	}

	const res = NextResponse.json({ ok: true });
	res.cookies.set('xpoint_session', 'active', {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		path: '/',
		maxAge: 60 * 60 * 8 // 8 saat
	});
	return res;
}





