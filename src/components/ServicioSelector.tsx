'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, RefreshCw, Plus } from 'lucide-react';

interface Servicio {
  _id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  tipo: 'Internet' | 'Televisión';
}

interface ServiciosSelectorProps {
  servicios: Servicio[];
  serviciosSeleccionados: string[];
  onToggleServicio: (servicioId: string) => void;
  isLoading?: boolean;
  error?: string | null;
  onRecargar?: () => void;
  onCreateServicio?: () => void;
}

export default function ServiciosSelector({
  servicios,
  serviciosSeleccionados,
  onToggleServicio,
  isLoading = false,
  error = null,
  onRecargar,
  onCreateServicio,
}: ServiciosSelectorProps) {
  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
          <span className="ml-2 text-gray-600">Cargando servicios...</span>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription className="flex items-center justify-between">
          <span>{error}</span>
          {onRecargar && (
            <Button variant="outline" size="sm" onClick={onRecargar}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Reintentar
            </Button>
          )}
        </AlertDescription>
      </Alert>
    );
  }

  if (!servicios || servicios.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <p className="text-gray-500 mb-4">No hay servicios disponibles</p>
          {onCreateServicio && (
            <Button onClick={onCreateServicio} variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Crear Primer Servicio
            </Button>
          )}
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-gray-600">
          {serviciosSeleccionados.length} de {servicios.length} seleccionados
        </p>
        {onCreateServicio && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onCreateServicio}
          >
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Servicio
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {servicios.map((servicio) => {
          const isSelected = serviciosSeleccionados.includes(servicio._id);
          return (
            <Card
              key={servicio._id}
              className={`p-4 cursor-pointer transition-all ${
                isSelected
                  ? 'border-green-500 bg-green-50 ring-2 ring-green-500'
                  : 'border-gray-200 hover:border-green-300'
              }`}
              onClick={() => onToggleServicio(servicio._id)}
            >
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => onToggleServicio(servicio._id)}
                  className="mt-1 w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{servicio.nombre}</h4>
                  <p className="text-sm text-gray-600 mt-1">{servicio.descripcion}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm font-medium text-green-600">
                      ${servicio.precio.toLocaleString()}
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        servicio.tipo === 'Internet'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}
                    >
                      {servicio.tipo}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}