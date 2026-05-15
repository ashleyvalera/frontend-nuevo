import type { APIRoute } from 'astro';
import { getAuthToken } from '../../lib/cookies';

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
    const [prestamosRes, pagosRes, clientesRes] = await Promise.all([
      fetchWithAuth('/prestamos', {}, cookies),
      fetchWithAuth('/pagos', {}, cookies),
      fetchWithAuth('/usuarios', {}, cookies),
    ]);

    const prestamos = await prestamosRes.json();
    const pagos = await pagosRes.json();
    const clientes = await clientesRes.json();

    const prestamosArr = Array.isArray(prestamos) ? prestamos : (prestamos.data || []);
    const pagosArr = Array.isArray(pagos) ? pagos : (pagos.data || []);
    const clientesArr = Array.isArray(clientes) ? clientes : (clientes.data || []);

    const totalPrestado = prestamosArr.reduce((sum: number, p: any) => sum + (p.montoOriginal || 0), 0);
    const saldoPendiente = prestamosArr.reduce((sum: number, p: any) => sum + (p.montoActual || 0), 0);

    const hoy = new Date().toISOString().split('T')[0];
    const cobrosHoy = pagosArr.filter((p: any) => 
      p.fechaPago?.startsWith && p.fechaPago.startsWith(hoy)
    ).length;

    const clientesConPrestamos = new Set(prestamosArr.map((p: any) => p.clienteId));
    const clientesActivos = clientesConPrestamos.size;

    const prestamosMorosos = prestamosArr.filter((p: any) => p.estado === 'moroso').length;

    const porEstado = {
      activo: prestamosArr.filter((p: any) => p.estado === 'activo').length,
      pagado: prestamosArr.filter((p: any) => p.estado === 'pagado').length,
      moroso: prestamosArr.filter((p: any) => p.estado === 'moroso').length,
      cancelado: prestamosArr.filter((p: any) => p.estado === 'cancelado').length,
    };

    const porTipo = {
      dinero: prestamosArr.filter((p: any) => p.tipo === 'dinero').length,
      artefacto: prestamosArr.filter((p: any) => p.tipo === 'artefacto').length,
    };

    return new Response(JSON.stringify({
      totalPrestado,
      saldoPendiente,
      clientesActivos,
      cobrosHoy,
      clientesMorosos: prestamosMorosos,
      prestamosPorEstado: Object.entries(porEstado).map(([estado, count]) => ({ estado, count })),
      prestamosPorTipo: Object.entries(porTipo).map(([tipo, count]) => ({ tipo, count })),
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Error al obtener datos del dashboard' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};