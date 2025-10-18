'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useContratoStore } from '@/store/contratoStore';
import { useServicioStore } from '@/store/serviceStore';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import ServiciosSelector from '@/components/ServiciosSelector';

export default function ContratoNuevoPage() {
  const [formData, setFormData] = useState({
    numero: '',
    fechaInicio: '',
    fechaFin: '',
    estado: 'Activo' as 'Activo' | 'Inactivo' | 'Suspendido' | 'Cancelado',
    servicios_ids: [] as string[],
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { createContrato } = useContratoStore();
  const { servicios, fetchServicios, isLoading: serviciosLoading, error: serviciosError } = useServicioStore();
  const router = useRouter();

  // Cargar servicios al montar el componente
  useEffect(() => {
    console.log('🔄 Iniciando carga de servicios...');
    fetchServicios();
  }, []);

  // Debug: Log cuando cambien los servicios
  useEffect(() => {
    console.log('📋 Servicios en el store:', servicios);
    console.log('📊 Número de servicios:', servicios?.length || 0);
    console.log('⏳ Cargando:', serviciosLoading);
    console.log('❌ Error:', serviciosError);
  }, [servicios, serviciosLoading, serviciosError]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleServicioToggle = (servicioId: string) => {
    setFormData(prev => ({
      ...prev,
      servicios_ids: prev.servicios_ids.includes(servicioId)
        ? prev.servicios_ids.filter(id => id !== servicioId)
        : [...prev.servicios_ids, servicioId]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Validaciones
      if (!formData.numero || !formData.fechaInicio || !formData.fechaFin) {
        throw new Error('Todos los campos son obligatorios');
      }

      if (formData.servicios_ids.length === 0) {
        throw new Error('Debes seleccionar al menos un servicio');
      }

      if (new Date(formData.fechaFin) <= new Date(formData.fechaInicio)) {
        throw new Error('La fecha de fin debe ser posterior a la fecha de inicio');
      }

      console.log('Creando contrato con datos:', formData);
      await createContrato(formData);
      console.log('Contrato creado exitosamente');
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Error al crear contrato:', err);
      setError(err.message || 'Error al crear contrato');
    } finally {
      setIsLoading(false);
    }
  };

  // Asegurar que servicios sea un array
  const serviciosArray = Array.isArray(servicios) ? servicios : [];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Crear Nuevo Contrato</h1>
          <p className="mt-2 text-gray-600">Completa la información del contrato</p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Número de Contrato"
                type="text"
                name="numero"
                value={formData.numero}
                onChange={handleInputChange}
                required
                placeholder="Ej: CONT-2024-001"
              />

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <select
                  name="estado"
                  value={formData.estado}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                  <option value="Suspendido">Suspendido</option>
                  <option value="Cancelado">Cancelado</option>
                </select>
              </div>

              <Input
                label="Fecha de Inicio"
                type="date"
                name="fechaInicio"
                value={formData.fechaInicio}
                onChange={handleInputChange}
                required
              />

              <Input
                label="Fecha de Fin"
                type="date"
                name="fechaFin"
                value={formData.fechaFin}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Servicios
                <span className="text-red-500 ml-1">*</span>
              </label>
              
              <ServiciosSelector
                servicios={serviciosArray}
                serviciosSeleccionados={formData.servicios_ids}
                onToggleServicio={handleServicioToggle}
                isLoading={serviciosLoading}
                error={serviciosError}
                onRecargar={() => fetchServicios()}
                onCreateServicio={() => router.push('/services/nuevo')}
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.push('/dashboard')}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                loading={isLoading}
                disabled={!formData.numero || !formData.fechaInicio || !formData.fechaFin || formData.servicios_ids.length === 0}
              >
                Crear Contrato
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}