// Tipos para el sistema de Telecom Plus S.A.S.

export interface Usuario {
    id: string;
    nombre: string;
    email: string;
    password?: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface Servicio {
    _id: string;
    nombre: string;
    descripcion: string;
    precio: number;
    tipo: 'Internet' | 'Television';
    createdAt: string;
    updatedAt: string;
  }
  
  export interface Contrato {
    _id: string;
    numero: string;
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
    numero: string;
    fechaInicio: string;
    fechaFin: string;
    estado: 'Activo' | 'Inactivo' | 'Suspendido' | 'Cancelado';
    servicios_ids: string[];
  }
  
  export interface UpdateContratoRequest {
    numero?: string;
    fechaInicio?: string;
    fechaFin?: string;
    estado?: 'Activo' | 'Inactivo' | 'Suspendido' | 'Cancelado';
    servicios_ids?: string[];
  }

  export interface CreateServicioRequest {
    nombre: string;
    descripcion: string;
    precio: number;
    tipo: 'Internet' | 'Television';
  }

  export interface UpdateServicioRequest {
    nombre?: string;
    descripcion?: string;
    precio?: number;
    tipo?: 'Internet' | 'Television';
  }
  
  export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
  }
  
  export interface ApiError {
    success: false;
    message: string;
    errors?: Record<string, string[]>;
  }