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
  numeroContrato: string; 
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
  numeroContrato: string; 
  fechaInicio: string;
  fechaFin: string;
  estado: 'Activo' | 'Inactivo' | 'Suspendido' | 'Cancelado';
  servicios_ids: string[];
  usuario_id: string;
}

export interface UpdateContratoRequest {
  numeroContrato?: string; 
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

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: {
    contracts?: T[];
    services?: T[];
    pagination?: PaginationInfo;
  };
  message?: string;
}

export interface ContractStats {
  totalContracts: number;
  contractsByStatus: Array<{ _id: string; count: number }>;
  contractsByServiceType: Array<{ _id: string; count: number }>;
}

export interface ApiError {
  message: string;
  status?: number;
  errors?: any[];
}