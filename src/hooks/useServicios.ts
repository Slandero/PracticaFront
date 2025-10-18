import { useEffect } from 'react';
import { useServicioStore } from '../store/serviceStore';

export const useServicios = () => {
  const {
    servicios,
    isLoading,
    error,
    fetchServicios,
    getServicioById,
    createServicio,
    updateServicio,
    deleteServicio,
    getServiciosByTipo,
    clearError,
  } = useServicioStore();

  useEffect(() => {
    fetchServicios();
  }, [fetchServicios]);

  return {
    servicios,
    isLoading,
    error,
    fetchServicios,
    getServicioById,
    createServicio,
    updateServicio,
    deleteServicio,
    getServiciosByTipo,
    clearError,
  };
};