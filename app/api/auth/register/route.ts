import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { User } from '@/lib/models/User';
import { hashPassword, signToken, AUTH_COOKIE_NAME } from '@/lib/auth';

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

  if (password.length < 6) {
    return NextResponse.json({ error: 'password too short' }, { status: 400 });
  }

  const existing = await User.findOne({ email }).lean();
  if (existing) {
    return NextResponse.json(
      { error: 'email already in use' },
      { status: 409 },
    );
  }

  const passwordHash = await hashPassword(password);
  const user = await User.create({ email, passwordHash });

  const token = signToken({ userId: user._id.toString(), email: user.email });

  const response = NextResponse.json({ ok: true });

  response.cookies.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return response;
};
