import api from './api';
import { 
  Servicio, 
  CreateServicioRequest, 
  UpdateServicioRequest,
  ApiResponse 
} from '../types';

export const servicioService = {
  async getServicios(): Promise<Servicio[]> {
    const response = await api.get<ApiResponse<Servicio[]>>('/servicios');
    return response.data.data;
  },

  async getServicioById(id: string): Promise<Servicio> {
    const response = await api.get<ApiResponse<Servicio>>(`/servicios/${id}`);
    return response.data.data;
  },

  async createServicio(servicioData: CreateServicioRequest): Promise<Servicio> {
    const response = await api.post<ApiResponse<Servicio>>('/servicios', servicioData);
    return response.data.data;
  },

  async updateServicio(id: string, servicioData: UpdateServicioRequest): Promise<Servicio> {
    const response = await api.put<ApiResponse<Servicio>>(`/servicios/${id}`, servicioData);
    return response.data.data;
  },

  async deleteServicio(id: string): Promise<void> {
    await api.delete(`/servicios/${id}`);
  },

  async getServiciosByTipo(tipo: 'Internet' | 'Television'): Promise<Servicio[]> {
    const response = await api.get<ApiResponse<Servicio[]>>(`/servicios?tipo=${tipo}`);
    return response.data.data;
  }
};