export interface Usuario {
  _id: string;
  nombre: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface Servicio {
  _id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  tipo: 'Internet' | 'Televisión';
  createdAt: string;
  updatedAt: string;
}

export interface Contrato {
  _id: string;
  numeroContrato: string; // Cambiar de 'numero' a 'numeroContrato'
  fechaInicio: string;
  fechaFin: string;
  estado: 'Activo' | 'Inactivo' | 'Suspendido' | 'Cancelado';
  usuario_id: string;
  servicios_ids: string[];
  servicios?: Servicio[];
  usuario?: Usuario;
  createdAt: string;
  updatedAt: string;
}

export interface CreateContratoRequest {
  numeroContrato: string; // Cambiar de 'numero' a 'numeroContrato'
  fechaInicio: string;
  fechaFin: string;
  estado: 'Activo' | 'Inactivo' | 'Suspendido' | 'Cancelado';
  servicios_ids: string[];
  usuario_id: string;
}

export interface UpdateContratoRequest {
  numeroContrato?: string; // Cambiar de 'numero' a 'numeroContrato'
  fechaInicio?: string;
  fechaFin?: string;
  estado?: 'Activo' | 'Inactivo' | 'Suspendido' | 'Cancelado';
  servicios_ids?: string[];
}

export interface CreateServicioRequest {
  nombre: string;
  descripcion: string;
  precio: number;
  tipo: 'Internet' | 'Televisión';
}

export interface UpdateServicioRequest {
  nombre?: string;
  descripcion?: string;
  precio?: number;
  tipo?: 'Internet' | 'Televisión';
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  message: string;
  status?: number;
  errors?: any[];
}