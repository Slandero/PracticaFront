'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useServicioStore } from '@/store/serviceStore';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

export default function ServiciosPage() {
  const { servicios, isLoading, error, deleteServicio, fetchServicios } = useServicioStore();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchServicios();
  }, [fetchServicios]);

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este servicio?')) {
      return;
    }

    setDeletingId(id);
    try {
      await deleteServicio(id);
    } catch (error) {
      console.error('Error al eliminar servicio:', error);
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Validación adicional para servicios
  const serviciosArray = Array.isArray(servicios) ? servicios : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Servicios</h1>
              <p className="mt-2 text-gray-600">
                Gestiona los servicios de telecomunicaciones disponibles
              </p>
            </div>
            <Button onClick={() => router.push('/services/nuevo')}>
              Nuevo Servicio
            </Button>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {serviciosArray.length === 0 ? (
            <Card>
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">📡</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No hay servicios disponibles
                </h3>
                <p className="text-gray-600 mb-6">
                  Comienza creando tu primer servicio de telecomunicaciones
                </p>
                <Button onClick={() => router.push('/services/nuevo')}>
                  Crear Primer Servicio
                </Button>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {serviciosArray.map((servicio) => (
                <Card key={servicio._id}>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {servicio.nombre}
                        </h3>
                        <div className="flex items-center mb-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            servicio.tipo === 'Internet' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-purple-100 text-purple-800'
                          }`}>
                            {servicio.tipo}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-3">
                          {servicio.descripcion}
                        </p>
                        <p className="text-2xl font-bold text-green-600">
                          ${servicio.precio.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button
                        variant="secondary"
                        onClick={() => router.push(`/services/${servicio._id}`)}
                        className="flex-1 text-sm"
                      >
                        Editar
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => handleDelete(servicio._id)}
                        loading={deletingId === servicio._id}
                        className="flex-1 text-sm"
                      >
                        Eliminar
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
