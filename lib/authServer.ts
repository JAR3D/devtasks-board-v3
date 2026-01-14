import 'server-only';
import { cookies } from 'next/headers';
import { AUTH_COOKIE_NAME, verifyToken } from '@/lib/auth';
import type { AuthTokenPayload } from '@/lib/auth';

export const getAuthFromCookies =
  async (): Promise<AuthTokenPayload | null> => {
    const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value;
    if (!token) return null;

    try {
      return verifyToken(token);
    } catch {
      return null;
    }
  };
