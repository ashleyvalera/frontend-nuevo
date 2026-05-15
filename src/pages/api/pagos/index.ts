import type { APIRoute } from 'astro';
import { getAuthToken } from '../../../lib/cookies';

const BACKEND_URL = 'http://localhost:3000';

async function fetchWithAuth(endpoint: string, options: RequestInit = {}, cookies: any) {
  const token = getAuthToken(cookies);
  const response = await fetch(`${BACKEND_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  return response;
}

export const GET: APIRoute = async ({ cookies, url }) => {
  try {
    const prestamoId = url.searchParams.get('prestamoId');
    const endpoint = prestamoId ? `/pagos/prestamo/${prestamoId}` : '/pagos';
    const response = await fetchWithAuth(endpoint, {}, cookies);
    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Error al obtener pagos' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const body = await request.json();
    const response = await fetchWithAuth('/pagos', {
      method: 'POST',
      body: JSON.stringify(body),
    }, cookies);
    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Error al registrar pago' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};