import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { User } from '@/lib/models/User';
import { verifyPassword, signToken, AUTH_COOKIE_NAME } from '@/lib/auth';

export const POST = async (req: Request) => {
  await connectToDatabase();
  const body = await req.json();

  const email = String(body.email ?? '')
    .trim()
    .toLowerCase();
  const password = String(body.password ?? '');

  if (!email || !password) {
    return NextResponse.json(
      { error: 'email and password required' },
      { status: 400 },
    );
  }

  const user = await User.findOne({ email }).lean();
  if (!user) {
    return NextResponse.json({ error: 'invalid credentials' }, { status: 401 });
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    return NextResponse.json({ error: 'invalid credentials' }, { status: 401 });
  }

  const token = signToken({ userId: user._id.toString(), email: user.email });

  const response = NextResponse.json({ ok: true });
  response.cookies.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
};
