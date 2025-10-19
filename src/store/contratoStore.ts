import { create } from 'zustand';
import { Contrato, CreateContratoRequest, UpdateContratoRequest, ApiError } from '../types';
import { contratoService } from '@/services/contratoSevice';

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
      console.log('🔄 Fetching contratos...');
      const contratos = await contratoService.getContratos();
      console.log('✅ Contratos obtenidos:', contratos);
      console.log('📊 Tipo de contratos:', typeof contratos);
      console.log('📊 Es array:', Array.isArray(contratos));
      console.log('📊 Cantidad:', contratos?.length || 0);
      set({ contratos, isLoading: false });
    } catch (error) {
      console.error('❌ Error al cargar contratos:', error);
      set({ 
        error: (error as ApiError).message || 'Error al cargar contratos',
        isLoading: false 
      });
    }
  },

  getContratoById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      console.log('🔄 Obteniendo contrato por ID:', id);
      const contrato = await contratoService.getContratoById(id);
      console.log('✅ Contrato obtenido:', contrato);
      set({ isLoading: false });
      return contrato;
    } catch (error) {
      console.error('❌ Error al obtener contrato:', error);
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
      console.log('🔄 Creando contrato con datos:', contratoData);
      const nuevoContrato = await contratoService.createContrato(contratoData);
      console.log('✅ Contrato creado exitosamente:', nuevoContrato);
      
      set(state => {
        const contratosActuales = Array.isArray(state.contratos) ? state.contratos : [];
        const nuevosContratos = [...contratosActuales, nuevoContrato];
        console.log('📊 Estado anterior - contratos:', contratosActuales.length);
        console.log('📊 Estado nuevo - contratos:', nuevosContratos.length);
        console.log('📊 Nuevo contrato agregado:', nuevoContrato);
        
        return {
          contratos: nuevosContratos,
          isLoading: false
        };
      });
    } catch (error) {
      console.error('❌ Error al crear contrato:', error);
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
      console.log('🔄 Actualizando contrato:', id, contratoData);
      const contratoActualizado = await contratoService.updateContrato(id, contratoData);
      console.log('✅ Contrato actualizado:', contratoActualizado);
      set(state => ({
        contratos: (Array.isArray(state.contratos) ? state.contratos : []).map(contrato => 
          contrato._id === id ? contratoActualizado : contrato
        ),
        isLoading: false
      }));
    } catch (error) {
      console.error('❌ Error al actualizar contrato:', error);
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
      console.log('🔄 Eliminando contrato:', id);
      await contratoService.deleteContrato(id);
      console.log('✅ Contrato eliminado exitosamente');
      set(state => ({
        contratos: (Array.isArray(state.contratos) ? state.contratos : []).filter(contrato => contrato._id !== id),
        isLoading: false
      }));
    } catch (error) {
      console.error('❌ Error al eliminar contrato:', error);
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
      console.log('🔄 Obteniendo contratos por estado:', estado);
      const contratos = await contratoService.getContratosByEstado(estado);
      console.log('✅ Contratos por estado obtenidos:', contratos);
      set({ isLoading: false });
      return contratos;
    } catch (error) {
      console.error('❌ Error al obtener contratos por estado:', error);
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
      console.log('🔄 Obteniendo contratos próximos a vencer...');
      const contratos = await contratoService.getContratosProximosAVencer();
      console.log('✅ Contratos próximos a vencer:', contratos);
      set({ isLoading: false });
      return contratos;
    } catch (error) {
      console.error('❌ Error al obtener contratos próximos a vencer:', error);
      set({ 
        error: (error as ApiError).message || 'Error al obtener contratos próximos a vencer',
        isLoading: false 
      });
      throw error;
    }
  },

  clearError: () => {
    set({ error: null });
  }
}));