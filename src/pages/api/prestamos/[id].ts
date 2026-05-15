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

export const GET: APIRoute = async ({ params, cookies }) => {
  try {
    const response = await fetchWithAuth(`/prestamos/${params.id}`, {}, cookies);
    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Error al obtener préstamo' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const PUT: APIRoute = async ({ params, request, cookies }) => {
  try {
    const body = await request.json();
    const response = await fetchWithAuth(`/prestamos/${params.id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    }, cookies);
    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Error al actualizar préstamo' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const DELETE: APIRoute = async ({ params, cookies }) => {
  try {
    const response = await fetchWithAuth(`/prestamos/${params.id}`, {
      method: 'DELETE',
    }, cookies);
    return new Response(null, { status: response.status });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Error al eliminar préstamo' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};