'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useContratoStore } from '@/store/contratoStore';
import { useServicioStore } from '@/store/serviceStore';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ServiciosSelector from '@/components/ServiciosSelector';

export default function ContratoNuevoPage() {
  const [formData, setFormData] = useState({
    numeroContrato: '', // Cambiar de 'numero' a 'numeroContrato'
    fechaInicio: '',
    fechaFin: '',
    estado: 'Activo' as 'Activo' | 'Inactivo' | 'Suspendido' | 'Cancelado',
    servicios_ids: [] as string[],
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { user } = useAuth();
  const { createContrato, fetchContratos } = useContratoStore();
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
      if (!formData.numeroContrato || !formData.fechaInicio || !formData.fechaFin) {
        throw new Error('Todos los campos son obligatorios');
      }

      if (formData.servicios_ids.length === 0) {
        throw new Error('Debes seleccionar al menos un servicio');
      }

      if (new Date(formData.fechaFin) <= new Date(formData.fechaInicio)) {
        throw new Error('La fecha de fin debe ser posterior a la fecha de inicio');
      }

      // Validar que la fecha de inicio no sea anterior a hoy
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0); // Resetear horas para comparar solo fechas
      const fechaInicio = new Date(formData.fechaInicio);
      
      if (fechaInicio < hoy) {
        throw new Error('La fecha de inicio no puede ser anterior a hoy');
      }

      // Validar formato del número de contrato
      const numeroContratoRegex = /^[A-Z0-9-]+$/;
      if (!numeroContratoRegex.test(formData.numeroContrato)) {
        throw new Error('El número de contrato solo puede contener letras mayúsculas, números y guiones');
      }

      if (formData.numeroContrato.length < 3 || formData.numeroContrato.length > 20) {
        throw new Error('El número de contrato debe tener entre 3 y 20 caracteres');
      }

      if (!user?.id) {
        throw new Error('Usuario no autenticado');
      }

      // Preparar datos para el backend con la estructura correcta
      const contratoData = {
        numeroContrato: formData.numeroContrato.trim().toUpperCase(), // Convertir a mayúsculas
        fechaInicio: new Date(formData.fechaInicio).toISOString(),
        fechaFin: new Date(formData.fechaFin).toISOString(),
        estado: formData.estado,
        servicios_ids: formData.servicios_ids,
        usuario_id: user.id
      };

      console.log('📤 Creando contrato con datos:', contratoData);
      console.log('👤 Usuario ID:', user.id);
      console.log('📅 Fecha inicio (ISO):', contratoData.fechaInicio);
      console.log('📅 Fecha fin (ISO):', contratoData.fechaFin);
      console.log('🔢 Servicios seleccionados:', formData.servicios_ids);
      
      await createContrato(contratoData);
      console.log('✅ Contrato creado exitosamente');
      
      // Recargar la lista de contratos para asegurar que se actualice
      await fetchContratos();
      console.log('🔄 Lista de contratos recargada');
      
      router.push('/dashboard');
    } catch (err: any) {
      console.error('❌ Error al crear contrato:', err);
      console.error('📋 Detalles del error:', err.response?.data);
      console.error('📊 Status del error:', err.response?.status);
      console.error('📝 Mensaje del error:', err.response?.data?.message);
      
      // MOSTRAR ERRORES ESPECÍFICOS DEL BACKEND
      let errorMessage = err.message || 'Error al crear contrato';
      
      if (err.response?.data?.errors && Array.isArray(err.response.data.errors)) {
        console.error('🔍 Estructura de errores:', JSON.stringify(err.response.data.errors, null, 2));
        
        const specificErrors = err.response.data.errors.map((error: any, index: number) => {
          console.error(`Error ${index + 1}:`, error);
          return `${error.path || 'Campo'}: ${error.msg || error.message || 'Error desconocido'}`;
        }).join(', ');
        
        errorMessage = `Errores de validación: ${specificErrors}`;
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Asegurar que servicios sea un array
  const serviciosArray = Array.isArray(servicios) ? servicios : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">Crear Nuevo Contrato</h1>
          <p className="mt-2 text-muted-foreground">Completa la información del contrato</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Crear Contrato</CardTitle>
            <CardDescription>Agrega un nuevo contrato al sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="numeroContrato">Número de Contrato</Label>
                  <Input
                    id="numeroContrato"
                    type="text"
                    name="numeroContrato"
                    value={formData.numeroContrato}
                    onChange={handleInputChange}
                    required
                    placeholder="Ej: CONT-2024-001"
                    maxLength={20}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="estado">Estado</Label>
                  <Select
                    name="estado"
                    value={formData.estado}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, estado: value as 'Activo' | 'Inactivo' | 'Suspendido' | 'Cancelado' }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona el estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Activo">Activo</SelectItem>
                      <SelectItem value="Inactivo">Inactivo</SelectItem>
                      <SelectItem value="Suspendido">Suspendido</SelectItem>
                      <SelectItem value="Cancelado">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fechaInicio">Fecha de Inicio</Label>
                  <Input
                    id="fechaInicio"
                    type="date"
                    name="fechaInicio"
                    value={formData.fechaInicio}
                    onChange={handleInputChange}
                    required
                    min={new Date().toISOString().split('T')[0]} // Fecha mínima: hoy
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fechaFin">Fecha de Fin</Label>
                  <Input
                    id="fechaFin"
                    type="date"
                    name="fechaFin"
                    value={formData.fechaFin}
                    onChange={handleInputChange}
                    required
                    min={formData.fechaInicio || new Date().toISOString().split('T')[0]} // Fecha mínima: fecha de inicio
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Label>Servicios</Label>
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
                  variant="outline"
                  onClick={() => router.push('/dashboard')}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={!formData.numeroContrato || !formData.fechaInicio || !formData.fechaFin || formData.servicios_ids.length === 0 || isLoading}
                >
                  {isLoading ? "Creando..." : "Crear Contrato"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}