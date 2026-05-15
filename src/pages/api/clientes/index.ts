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

export const GET: APIRoute = async ({ cookies }) => {
  try {
    const response = await fetchWithAuth('/usuarios', {}, cookies);
    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Error al obtener clientes' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const body = await request.json();
    
    // Primero verificamos que el token funcione
    const testRes = await fetchWithAuth('/usuarios', {}, cookies);
    console.log('Test GET /usuarios status:', testRes.status);
    
    // Ahora creamos el cliente
    const response = await fetchWithAuth('/usuarios', {
      method: 'POST',
      body: JSON.stringify(body),
    }, cookies);
    
    console.log('Create client status:', response.status);
    const data = await response.json();
    console.log('Create client response:', JSON.stringify(data));
    
    // Si hay error, devolver el mensaje real del backend
    if (!response.ok) {
      return new Response(JSON.stringify({ 
        error: data.message || data.error || 'Error del servidor',
        details: data
      }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error: ' + error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};