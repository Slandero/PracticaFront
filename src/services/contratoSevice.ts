import api from './api';
import {
  Contrato,
  CreateContratoRequest,
  UpdateContratoRequest,
  ApiResponse,
  PaginatedResponse,
  PaginationInfo,
  ContractStats
} from '@/types';

export const contratoService = {
  async getContratos(params?: {
    estado?: string;
    page?: number;
    limit?: number
  }): Promise<{ contratos: Contrato[]; pagination: PaginationInfo }> {
    const queryParams = new URLSearchParams();
    if (params?.estado) queryParams.append('estado', params.estado);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const url = `/contracts${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await api.get(url);

    // El backend devuelve { success: true, data: { contracts: [...], pagination: {...} } }
    return {
      contratos: response.data.data?.contracts || response.data.data || [],
      pagination: response.data.data?.pagination || {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 10,
        hasNextPage: false,
        hasPrevPage: false
      }
    };
  },

 
  async getContratoById(id: string): Promise<Contrato> {
  const response = await api.get<ApiResponse<Contrato>>(`/contracts/${id}?populate=servicios`);
  console.log('Contrato obtenido con servicios:', response.data.data);
  return response.data.data;
},

  async createContrato(contratoData: CreateContratoRequest): Promise<Contrato> {
    console.log('Enviando contrato a: /contracts');
    console.log('Datos del contrato:', JSON.stringify(contratoData, null, 2));
    
    try {
      const response = await api.post<ApiResponse<Contrato>>('/contracts', contratoData);
      return response.data.data;
    } catch (error: any) {
 
      throw error;
    }
  },

  async updateContrato(id: string, contratoData: UpdateContratoRequest): Promise<Contrato> {
    const response = await api.put<ApiResponse<Contrato>>(`/contracts/${id}`, contratoData);
    return response.data.data;
  },

  async deleteContrato(id: string): Promise<void> {
    await api.delete(`/contracts/${id}`);
  },

  async getContratosByEstado(estado: string, params?: {
    page?: number;
    limit?: number
  }): Promise<{ contratos: Contrato[]; pagination: PaginationInfo }> {
    return this.getContratos({ estado, ...params });
  },

  async getContractStats(): Promise<ContractStats> {
    const response = await api.get<ApiResponse<ContractStats>>('/contracts/stats');
    return response.data.data;
  }
};
