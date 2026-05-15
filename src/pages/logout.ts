import type { APIRoute } from 'astro';
import { removeAuthToken, getAuthToken } from '../lib/cookies';

const BACKEND_URL = 'http://localhost:3000';

async function logoutBackend(token: string) {
  await fetch(`${BACKEND_URL}/auth/logout`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
}

export const POST: APIRoute = async ({ cookies }) => {
  const token = getAuthToken(cookies);

  if (token) {
    try {
      await logoutBackend(token);
    } catch {
      // Ignore errors - just clear cookie
    }
  }

  removeAuthToken(cookies);
  return new Response(null, {
    status: 302,
    headers: {
      'Location': '/login',
    },
  });
};

export const GET: APIRoute = async ({ cookies }) => {
  const token = getAuthToken(cookies);

  if (token) {
    try {
      await logoutBackend(token);
    } catch {
      // Ignore errors - just clear cookie
    }
  }

  removeAuthToken(cookies);
  return Astro.redirect('/login');
};