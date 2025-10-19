import api from './api';
import { 
  Servicio, 
  CreateServicioRequest, 
  UpdateServicioRequest,
  ApiResponse 
} from '@/types';

export const servicioService = {
  async getServicios(): Promise<Servicio[]> {
    const response = await api.get('/services');
    console.log('Response getServicios:', response.data);
    
    // El backend devuelve: { success: true, data: { services: [...], pagination: {...} } }
    // Necesitamos acceder a response.data.data.services
    const servicios = response.data.data?.services || response.data.services || response.data.data || response.data || [];
    console.log('Servicios extraídos:', servicios);
    console.log('Tipo de servicios:', typeof servicios, Array.isArray(servicios));
    return servicios;
  },

  async getServicioById(id: string): Promise<Servicio> {
    const response = await api.get(`/services/${id}`);
    console.log('Response getServicioById:', response.data);
    return response.data.data || response.data;
  },

  async createServicio(servicioData: CreateServicioRequest): Promise<Servicio> {
    console.log('Enviando datos al backend:', servicioData);
    
    try {
      const response = await api.post('/services', {
        nombre: servicioData.nombre.trim(),
        descripcion: servicioData.descripcion.trim(),
        precio: Number(servicioData.precio),
        tipo: servicioData.tipo
      });
      
      console.log('Response createServicio exitosa:', response.data);
      
      // El backend devuelve { success: true, data: data.data }
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Error del servidor');
      }
    } catch (error: any) {
      console.error('Error completo del backend:', error.response?.data);
      
      // Manejar diferentes tipos de errores
      if (error.response?.status === 409) {
        throw new Error('Ya existe un servicio con ese nombre. Por favor, elige un nombre diferente.');
      }
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Error desconocido del servidor';
      
      throw new Error(errorMessage);
    }
  },

  async updateServicio(id: string, servicioData: UpdateServicioRequest): Promise<Servicio> {
    const response = await api.put(`/services/${id}`, {
      nombre: servicioData.nombre?.trim(),
      descripcion: servicioData.descripcion?.trim(),
      precio: servicioData.precio ? Number(servicioData.precio) : undefined,
      tipo: servicioData.tipo
    });
    console.log('Response updateServicio:', response.data);
    return response.data.data || response.data;
  },

  async deleteServicio(id: string): Promise<void> {
    await api.delete(`/services/${id}`);
  },

  async getServiciosByTipo(tipo: 'Internet' | 'Televisión'): Promise<Servicio[]> {
    const response = await api.get(`/services?tipo=${tipo}`);
    console.log('Response getServiciosByTipo:', response.data);
    
    // El backend devuelve: { success: true, data: { services: [...], pagination: {...} } }
    const servicios = response.data.data?.services || response.data.services || response.data.data || response.data || [];
    return servicios;
  }
};
