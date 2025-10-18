'use client'

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useServicioStore } from '@/store/serviceStore';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

export default function ServicioEditarPage() {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    tipo: 'Internet' as 'Internet' | 'Television',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

    const { getServicioById, updateServicio } = useServicioStore();
    const router = useRouter();
    const { id: servicioId } = useParams<{ id: string }>() || { id: '' } as { id: string };

  useEffect(() => {
    const loadServicio = async () => {
      try {
        const servicio = await getServicioById(servicioId);
        setFormData({
          nombre: servicio.nombre,
          descripcion: servicio.descripcion,
          precio: servicio.precio.toString(),
          tipo: servicio.tipo,
        });
      } catch (error) {
        setError('Error al cargar el servicio');
      } finally {
        setIsLoadingData(false);
      }
    };

    if (servicioId) {
      loadServicio();
    }
  }, [servicioId, getServicioById]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const servicioData = {
        ...formData,
        precio: parseFloat(formData.precio)
      };
      await updateServicio(servicioId, servicioData);
      router.push('/services');
    } catch (err: any) {
      setError(err.message || 'Error al actualizar servicio');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Editar Servicio</h1>
          <p className="mt-2 text-gray-600">Modifica la información del servicio</p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <Input
              label="Nombre del Servicio"
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              required
              placeholder="Ej: Internet 100 Mbps"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
                <span className="text-red-500 ml-1">*</span>
              </label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
                required
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe las características del servicio"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Precio"
                type="number"
                name="precio"
                value={formData.precio}
                onChange={handleInputChange}
                required
                placeholder="50000"

              />

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Servicio
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <select
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Internet">Internet</option>
                  <option value="Television">Televisión</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.push('/services')}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                loading={isLoading}
                disabled={!formData.nombre || !formData.descripcion || !formData.precio}
              >
                Actualizar Servicio
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
