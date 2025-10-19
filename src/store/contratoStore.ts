import { create } from 'zustand';
import { Contrato, CreateContratoRequest, UpdateContratoRequest, ApiError, PaginationInfo, ContractStats } from '../types';
import { contratoService } from '@/services/contratoSevice';

interface ContratoState {
  contratos: Contrato[];
  pagination: PaginationInfo | null;
  stats: ContractStats | null;
  isLoading: boolean;
  error: string | null;

  fetchContratos: (params?: { estado?: string; page?: number; limit?: number }) => Promise<void>;
  getContratoById: (id: string) => Promise<Contrato>;
  createContrato: (contratoData: CreateContratoRequest) => Promise<void>;
  updateContrato: (id: string, contratoData: UpdateContratoRequest) => Promise<void>;
  deleteContrato: (id: string) => Promise<void>;
  getContratosByEstado: (estado: string, params?: { page?: number; limit?: number }) => Promise<Contrato[]>;
  fetchContractStats: () => Promise<void>;

  clearError: () => void;
}

export const useContratoStore = create<ContratoState>((set, get) => ({
  contratos: [],
  pagination: null,
  stats: null,
  isLoading: false,
  error: null,

  fetchContratos: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const { contratos, pagination } = await contratoService.getContratos(params);

      set({ contratos, pagination, isLoading: false });
    } catch (error) {
      console.error('Error al cargar contratos:', error);
      set({
        error: (error as ApiError).message || 'Error al cargar contratos',
        isLoading: false
      });
    }
  },

  getContratoById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const contrato = await contratoService.getContratoById(id);
      console.log('Contrato obtenido:', contrato);
      set({ isLoading: false });
      return contrato;
    } catch (error) {
      console.error('Error al obtener contrato:', error);
      set({ 
        error: (error as ApiError).message || 'Error al obtener contrato',
        isLoading: false 
      });
      throw error;
    }
  },

  createContrato: async (contratoData: CreateContratoRequest) => {
    set({ isLoading: true, error: null });
    try {
      const nuevoContrato = await contratoService.createContrato(contratoData);
      console.log('Contrato creado exitosamente:', nuevoContrato);
      
      set(state => {
        const contratosActuales = Array.isArray(state.contratos) ? state.contratos : [];
        const nuevosContratos = [...contratosActuales, nuevoContrato];
        
        return {
          contratos: nuevosContratos,
          isLoading: false
        };
      });
    } catch (error) {
      console.error('Error al crear contrato:', error);
      set({ 
        error: (error as ApiError).message || 'Error al crear contrato',
        isLoading: false 
      });
      throw error;
    }
  },

  updateContrato: async (id: string, contratoData: UpdateContratoRequest) => {
    set({ isLoading: true, error: null });
    try {
      const contratoActualizado = await contratoService.updateContrato(id, contratoData);
      console.log('Contrato actualizado:', contratoActualizado);
      set(state => ({
        contratos: (Array.isArray(state.contratos) ? state.contratos : []).map(contrato => 
          contrato._id === id ? contratoActualizado : contrato
        ),
        isLoading: false
      }));
    } catch (error) {
      console.error('Error al actualizar contrato:', error);
      set({ 
        error: (error as ApiError).message || 'Error al actualizar contrato',
        isLoading: false 
      });
      throw error;
    }
  },

  deleteContrato: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await contratoService.deleteContrato(id);
      console.log('Contrato eliminado exitosamente');
      set(state => ({
        contratos: (Array.isArray(state.contratos) ? state.contratos : []).filter(contrato => contrato._id !== id),
        isLoading: false
      }));
    } catch (error) {
      console.error('Error al eliminar contrato:', error);
      set({ 
        error: (error as ApiError).message || 'Error al eliminar contrato',
        isLoading: false 
      });
      throw error;
    }
  },

  getContratosByEstado: async (estado: string, params) => {
    set({ isLoading: true, error: null });
    try {
      const { contratos, pagination } = await contratoService.getContratosByEstado(estado, params);
      set({ pagination, isLoading: false });
      return contratos;
    } catch (error) {
      console.error('Error al obtener contratos por estado:', error);
      set({
        error: (error as ApiError).message || 'Error al obtener contratos por estado',
        isLoading: false
      });
      throw error;
    }
  },

  fetchContractStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const stats = await contratoService.getContractStats();
      console.log('Estadísticas obtenidas:', stats);
      set({ stats, isLoading: false });
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      set({
        error: (error as ApiError).message || 'Error al obtener estadísticas',
        isLoading: false
      });
      throw error;
    }
  },

  clearError: () => {
    set({ error: null });
  }
}));