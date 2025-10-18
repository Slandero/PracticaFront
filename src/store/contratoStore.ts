import { create } from 'zustand';
import { Contrato, CreateContratoRequest, UpdateContratoRequest, ApiError } from '../types';
import { contratoService } from '../services/contratoSevice';

interface ContratoState {
  contratos: Contrato[];
  isLoading: boolean;
  error: string | null;
  
  fetchContratos: () => Promise<void>;
  getContratoById: (id: string) => Promise<Contrato>;
  createContrato: (contratoData: CreateContratoRequest) => Promise<void>;
  updateContrato: (id: string, contratoData: UpdateContratoRequest) => Promise<void>;
  deleteContrato: (id: string) => Promise<void>;
  getContratosByEstado: (estado: string) => Promise<Contrato[]>;
  getContratosProximosAVencer: () => Promise<Contrato[]>;
  clearError: () => void;
}

export const useContratoStore = create<ContratoState>((set, get) => ({
  contratos: [],
  isLoading: false,
  error: null,

  fetchContratos: async () => {
    set({ isLoading: true, error: null });
    try {
      const contratos = await contratoService.getContratos();
      set({ contratos, isLoading: false });
    } catch (error) {
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
      set({ isLoading: false });
      return contrato;
    } catch (error) {
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
      set(state => ({
        contratos: [...state.contratos, nuevoContrato],
        isLoading: false
      }));
    } catch (error) {
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
      set(state => ({
        contratos: state.contratos.map(contrato => 
          contrato._id === id ? contratoActualizado : contrato
        ),
        isLoading: false
      }));
    } catch (error) {
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
      set(state => ({
        contratos: state.contratos.filter(contrato => contrato._id !== id),
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: (error as ApiError).message || 'Error al eliminar contrato',
        isLoading: false 
      });
      throw error;
    }
  },

  getContratosByEstado: async (estado: string) => {
    set({ isLoading: true, error: null });
    try {
      const contratos = await contratoService.getContratosByEstado(estado);
      set({ isLoading: false });
      return contratos;
    } catch (error) {
      set({ 
        error: (error as ApiError).message || 'Error al obtener contratos por estado',
        isLoading: false 
      });
      throw error;
    }
  },

  getContratosProximosAVencer: async () => {
    set({ isLoading: true, error: null });
    try {
      const contratos = await contratoService.getContratosProximosAVencer();
      set({ isLoading: false });
      return contratos;
    } catch (error) {
      set({ 
        error: (error as ApiError).message || 'Error al obtener contratos próximos a vencer',
        isLoading: false 
      });
      throw error;
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));