import { create } from 'zustand';
import { Servicio, CreateServicioRequest, UpdateServicioRequest, ApiError, PaginationInfo } from '../types';
import { servicioService } from '../services/servicioService';

interface ServicioState {
  servicios: Servicio[];
  pagination: PaginationInfo | null;
  isLoading: boolean;
  error: string | null;

  fetchServicios: (params?: { tipo?: 'Internet' | 'Televisión'; page?: number; limit?: number }) => Promise<void>;
  getServicioById: (id: string) => Promise<Servicio>;
  createServicio: (servicioData: CreateServicioRequest) => Promise<void>;
  updateServicio: (id: string, servicioData: UpdateServicioRequest) => Promise<void>;
  deleteServicio: (id: string) => Promise<void>;
  getServiciosByTipo: (tipo: 'Internet' | 'Televisión', params?: { page?: number; limit?: number }) => Promise<Servicio[]>;
  clearError: () => void;
}

export const useServicioStore = create<ServicioState>((set, get) => ({
  servicios: [],
  pagination: null,
  isLoading: false,
  error: null,

  fetchServicios: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const { servicios, pagination } = await servicioService.getServicios(params);
      set({ servicios, pagination, isLoading: false });
    } catch (error) {
      console.error('fetchServicios: Error:', error);
      set({
        error: (error as ApiError).message || 'Error al cargar servicios',
        isLoading: false
      });
    }
  },

  getServicioById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const servicio = await servicioService.getServicioById(id);
      set({ isLoading: false });
      return servicio;
    } catch (error) {
      set({ 
        error: (error as ApiError).message || 'Error al obtener servicio',
        isLoading: false 
      });
      throw error;
    }
  },

  createServicio: async (servicioData: CreateServicioRequest) => {
    set({ isLoading: true, error: null });
    try {
      const nuevoServicio = await servicioService.createServicio(servicioData);
      console.log('createServicio: Servicio creado:', nuevoServicio);
      set(state => {
        const serviciosActuales = Array.isArray(state.servicios) ? state.servicios : [];
        const nuevosServicios = [...serviciosActuales, nuevoServicio];
        return {
          servicios: nuevosServicios,
          isLoading: false
        };
      });
    } catch (error) {
      console.error('createServicio: Error:', error);
      set({ 
        error: (error as ApiError).message || 'Error al crear servicio',
        isLoading: false 
      });
      throw error;
    }
  },

  updateServicio: async (id: string, servicioData: UpdateServicioRequest) => {
    set({ isLoading: true, error: null });
    try {
      const servicioActualizado = await servicioService.updateServicio(id, servicioData);
      set(state => {
        const serviciosActuales = Array.isArray(state.servicios) ? state.servicios : [];
        return {
          servicios: serviciosActuales.map(servicio => 
            servicio._id === id ? servicioActualizado : servicio
          ),
          isLoading: false
        };
      });
    } catch (error) {
      set({ 
        error: (error as ApiError).message || 'Error al actualizar servicio',
        isLoading: false 
      });
      throw error;
    }
  },

  deleteServicio: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await servicioService.deleteServicio(id);
      set(state => {
        const serviciosActuales = Array.isArray(state.servicios) ? state.servicios : [];
        return {
          servicios: serviciosActuales.filter(servicio => servicio._id !== id),
          isLoading: false
        };
      });
    } catch (error) {
      set({ 
        error: (error as ApiError).message || 'Error al eliminar servicio',
        isLoading: false 
      });
      throw error;
    }
  },

  getServiciosByTipo: async (tipo: 'Internet' | 'Televisión', params) => {
    set({ isLoading: true, error: null });
    try {
      const { servicios, pagination } = await servicioService.getServiciosByTipo(tipo, params);
      set({ pagination, isLoading: false });
      return servicios;
    } catch (error) {
      set({
        error: (error as ApiError).message || 'Error al obtener servicios por tipo',
        isLoading: false
      });
      throw error;
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));