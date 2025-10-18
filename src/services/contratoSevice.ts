import api from './api';
import { 
  Contrato, 
  CreateContratoRequest, 
  UpdateContratoRequest,
  ApiResponse 
} from '../types';

export const contratoService = {
  async getContratos(): Promise<Contrato[]> {
    const response = await api.get<ApiResponse<Contrato[]>>('/contratos');
    return response.data.data;
  },

  async getContratoById(id: string): Promise<Contrato> {
    const response = await api.get<ApiResponse<Contrato>>(`/contratos/${id}`);
    return response.data.data;
  },

  async createContrato(contratoData: CreateContratoRequest): Promise<Contrato> {
    const response = await api.post<ApiResponse<Contrato>>('/contratos', contratoData);
    return response.data.data;
  },

  async updateContrato(id: string, contratoData: UpdateContratoRequest): Promise<Contrato> {
    const response = await api.put<ApiResponse<Contrato>>(`/contratos/${id}`, contratoData);
    return response.data.data;
  },

  async deleteContrato(id: string): Promise<void> {
    await api.delete(`/contratos/${id}`);
  },

  async getContratosByEstado(estado: string): Promise<Contrato[]> {
    const response = await api.get<ApiResponse<Contrato[]>>(`/contratos?estado=${estado}`);
    return response.data.data;
  },

  async getContratosProximosAVencer(): Promise<Contrato[]> {
    const response = await api.get<ApiResponse<Contrato[]>>('/contratos/proximos-vencer');
    return response.data.data;
  }
};