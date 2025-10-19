'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useServicioStore } from '@/store/serviceStore';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

export default function ServicioNuevoPage() {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    tipo: 'Internet' as 'Internet' | 'Televisión', // Cambiar a "Televisión"
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { createServicio } = useServicioStore();
  const router = useRouter();

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
      // Validar datos según las reglas del backend
      if (!formData.nombre || formData.nombre.length < 2 || formData.nombre.length > 100) {
        throw new Error('El nombre debe tener entre 2 y 100 caracteres');
      }
      
      if (!formData.descripcion || formData.descripcion.length < 10 || formData.descripcion.length > 500) {
        throw new Error('La descripción debe tener entre 10 y 500 caracteres');
      }
      
      const precio = parseFloat(formData.precio);
      if (isNaN(precio) || precio < 0) {
        throw new Error('El precio debe ser un número mayor o igual a 0');
      }
      
      if (!formData.tipo || !['Internet', 'Televisión'].includes(formData.tipo)) {
        throw new Error('El tipo debe ser "Internet" o "Televisión"');
      }

      const servicioData = {
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion.trim(),
        precio: precio,
        tipo: formData.tipo
      };
      
      console.log('Enviando datos:', servicioData);
      
      await createServicio(servicioData);
      console.log('Servicio creado exitosamente');
      router.push('/services');
    } catch (err: any) {
      console.error('Error al crear servicio:', err);
      setError(err.message || 'Error al crear servicio');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Crear Nuevo Servicio</h1>
          <p className="mt-2 text-gray-600">Completa la información del servicio</p>
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
                placeholder="Describe las características del servicio (mínimo 10 caracteres)"
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
                  <option value="Televisión">Televisión</option>
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
                Crear Servicio
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
