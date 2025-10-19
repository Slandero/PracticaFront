'use client'

import React from 'react';
import { Servicio } from '@/types';

interface ServiciosSelectorProps {
  servicios: Servicio[];
  serviciosSeleccionados: string[];
  onToggleServicio: (servicioId: string) => void;
  isLoading?: boolean;
  error?: string | null;
  onRecargar?: () => void;
  onCreateServicio?: () => void;
}

const ServiciosSelector: React.FC<ServiciosSelectorProps> = ({
  servicios,
  serviciosSeleccionados,
  onToggleServicio,
  isLoading = false,
  error = null,
  onRecargar,
  onCreateServicio
}) => {
  if (isLoading) {
    return (
      <div className="text-center py-8 border border-gray-300 rounded-lg">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-2 text-gray-600">Cargando servicios...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 border border-red-300 rounded-lg bg-red-50">
        <div className="text-red-400 text-4xl mb-2">⚠️</div>
        <p className="text-red-600 mb-4">Error al cargar servicios: {error}</p>
        {onRecargar && (
          <button
            onClick={onRecargar}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Reintentar
          </button>
        )}
      </div>
    );
  }

  if (servicios.length === 0) {
    return (
      <div className="text-center py-8 border border-gray-300 rounded-lg">
        <div className="text-gray-400 text-4xl mb-2"></div>
        <p className="text-gray-600 mb-4">No hay servicios disponibles</p>
        <div className="space-x-4">
          {onRecargar && (
            <button
              onClick={onRecargar}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              Recargar Servicios
            </button>
          )}
          {onCreateServicio && (
            <button
              onClick={onCreateServicio}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Crear Primer Servicio
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Selecciona los servicios para este contrato ({serviciosSeleccionados.length} seleccionados)
        </p>
        {serviciosSeleccionados.length > 0 && (
          <button
            onClick={() => {
              // Limpiar todas las selecciones
              serviciosSeleccionados.forEach(id => onToggleServicio(id));
            }}
            className="text-sm text-red-600 hover:text-red-700"
          >
            Limpiar selección
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {servicios.map((servicio) => {
          const isSelected = serviciosSeleccionados.includes(servicio._id);
          
          return (
            <div
              key={servicio._id}
              className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                isSelected
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-gray-300 hover:border-gray-400 hover:shadow-sm'
              }`}
              onClick={() => onToggleServicio(servicio._id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-medium text-gray-900">{servicio.nombre}</h3>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      servicio.tipo === 'Internet' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {servicio.tipo}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {servicio.descripcion}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-bold text-green-600">
                      ${servicio.precio.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">
                      /mes
                    </p>
                  </div>
                </div>
                
                <div className="ml-4">
                  <div className={`w-6 h-6 border-2 rounded-full flex items-center justify-center transition-colors ${
                    isSelected
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300'
                  }`}>
                    {isSelected && (
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {serviciosSeleccionados.length > 0 && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Servicios seleccionados:</h4>
          <div className="space-y-1">
            {serviciosSeleccionados.map(servicioId => {
              const servicio = servicios.find(s => s._id === servicioId);
              return servicio ? (
                <div key={servicioId} className="flex items-center justify-between text-sm">
                  <span className="text-blue-800">{servicio.nombre}</span>
                  <span className="font-medium text-blue-600">${servicio.precio.toLocaleString()}</span>
                </div>
              ) : null;
            })}
          </div>
          <div className="mt-2 pt-2 border-t border-blue-200">
            <div className="flex items-center justify-between font-medium text-blue-900">
              <span>Total mensual:</span>
              <span>
                ${serviciosSeleccionados.reduce((total, servicioId) => {
                  const servicio = servicios.find(s => s._id === servicioId);
                  return total + (servicio?.precio || 0);
                }, 0).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiciosSelector;