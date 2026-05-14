import type { AstroCookies } from 'astro';

export const AUTH_COOKIE_NAME = 'access_token';
export const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

export function getAuthToken(cookies: AstroCookies | null): string | undefined {
  if (!cookies) {
    return getAuthTokenFromClient();
  }
  return cookies.get(AUTH_COOKIE_NAME)?.value;
}

export function getAuthTokenFromClient(): string | undefined {
  if (typeof document === 'undefined') return undefined;
  const match = document.cookie.match(new RegExp(`(^| )${AUTH_COOKIE_NAME}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : undefined;
}

export function setAuthToken(cookies: AstroCookies | null, token: string): void {
  if (!cookies) {
    setAuthTokenOnClient(token);
    return;
  }
  cookies.set(AUTH_COOKIE_NAME, token, {
    path: '/',
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE / 1000,
  });
}

export function setAuthTokenOnClient(token: string): void {
  if (typeof document === 'undefined') return;
  const expires = new Date(Date.now() + COOKIE_MAX_AGE).toUTCString();
  document.cookie = `${AUTH_COOKIE_NAME}=${encodeURIComponent(token)};expires=${expires};path=/;sameSite=lax${import.meta.env.PROD ? ';secure' : ''}`;
}

export function removeAuthToken(cookies: AstroCookies | null): void {
  if (!cookies) {
    removeAuthTokenFromClient();
    return;
  }
  cookies.delete(AUTH_COOKIE_NAME, { path: '/' });
}

export function removeAuthTokenFromClient(): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${AUTH_COOKIE_NAME}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
}