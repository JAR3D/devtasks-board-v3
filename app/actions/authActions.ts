'use server';

import { cookies } from 'next/headers';
import { connectToDatabase } from '@/lib/db';
import { User } from '@/lib/models/User';
import {
  AUTH_COOKIE_NAME,
  hashPassword,
  signToken,
  verifyPassword,
} from '@/lib/auth';

type AuthResult = { ok: true } | { ok: false; error: string };

type AuthPayload = {
  email: string;
  password: string;
};

const setAuthCookie = async (token: string, maxAge: number) => {
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge,
  });
};

const registerAction = async (payload: AuthPayload): Promise<AuthResult> => {
  await connectToDatabase();

  const email = String(payload.email ?? '')
    .trim()
    .toLowerCase();
  const password = String(payload.password ?? '');

  if (!email || !password) {
    return { ok: false, error: 'email and password required' };
  }

  if (password.length < 6) {
    return { ok: false, error: 'password too short' };
  }

  const existing = await User.findOne({ email }).lean();
  if (existing) {
    return { ok: false, error: 'email already in use' };
  }

  const passwordHash = await hashPassword(password);
  const user = await User.create({ email, passwordHash });

  const token = signToken({ userId: user._id.toString(), email: user.email });
  await setAuthCookie(token, 60 * 60 * 24 * 7);

  return { ok: true };
};

const loginAction = async (payload: AuthPayload): Promise<AuthResult> => {
  await connectToDatabase();

  const email = String(payload.email ?? '')
    .trim()
    .toLowerCase();
  const password = String(payload.password ?? '');

  if (!email || !password) {
    return { ok: false, error: 'email and password required' };
  }

  const user = await User.findOne({ email }).lean();
  if (!user) {
    return { ok: false, error: 'invalid credentials' };
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    return { ok: false, error: 'invalid credentials' };
  }

  const token = signToken({ userId: user._id.toString(), email: user.email });
  await setAuthCookie(token, 60 * 60 * 24 * 7);

  return { ok: true };
};

export const logoutAction = async (): Promise<AuthResult> => {
  await setAuthCookie('', 0);

  return { ok: true };
};

export const loginFormAction = async (
  _prevState: AuthResult,
  formData: FormData,
): Promise<AuthResult> => {
  const email = String(formData.get('email') ?? '');
  const password = String(formData.get('password') ?? '');
  return loginAction({ email, password });
};

export const registerFormAction = async (
  _prevState: AuthResult,
  formData: FormData,
): Promise<AuthResult> => {
  const email = String(formData.get('email') ?? '');
  const password = String(formData.get('password') ?? '');
  return registerAction({ email, password });
};
