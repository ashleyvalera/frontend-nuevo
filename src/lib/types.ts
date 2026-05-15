export interface Cliente {
  id: string;
  nombre: string;
  documentoTipo: "DNI" | "CE" | "PASAPORTE" | "RUC";
  documentoNumero: string;
  telefono: string;
  direccion: string;
  nombreNegocio?: string;
  estado: "activo" | "inactivo";
  createdAt: string;
}

export interface Prestamo {
  id: string;
  clienteId: string;
  cliente?: Cliente;
  tipo: "dinero" | "artefacto";
  montoOriginal: number;
  montoActual: number;
  tasaInteres: number;
  numeroCuotas: number;
  cuotaMonto: number;
  cuotaFrecuencia: "semanal" | "quincenal" | "mensual";
  fechaInicio: string;
  proximaFechaPago: string;
  estado: "activo" | "pagado" | "moroso" | "cancelado";
  descripcion?: string;
  createdAt: string;
}

export interface Pago {
  id: string;
  prestamoId: string;
  monto: number;
  montoCapital: number;
  montoInteres: number;
  nota?: string;
  fechaPago: string;
  tipo: "completo" | "parcial";
  createdAt: string;
  prestamo?: Prestamo;
}

export interface DashboardStats {
  totalPrestado: number;
  saldoPendiente: number;
  clientesActivos: number;
  cobrosHoy: number;
  clientesMorosos: number;
  prestamosPorEstado: { estado: string; count: number }[];
  prestamosPorTipo: { tipo: string; count: number }[];
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}