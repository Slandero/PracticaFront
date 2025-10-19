'use client'

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useContratoStore } from '@/store/contratoStore';
import { useServicioStore } from '@/store/serviceStore';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function ContratoEditarPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  
  
  const [formData, setFormData] = useState({
    numero: '',
    fechaInicio: '',
    fechaFin: '',
    estado: 'Activo' as 'Activo' | 'Inactivo' | 'Suspendido' | 'Cancelado',
    servicios_ids: [] as string[],
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const { getContratoById, updateContrato } = useContratoStore();
  const { servicios, fetchServicios } = useServicioStore();

  useEffect(() => {
    const loadData = async () => {
      if (!id) {
        setError('ID de contrato no válido');
        setIsLoadingData(false);
        return;
      }
      
      try {
        await fetchServicios();
        const contrato = await getContratoById(id);
        
        setFormData({
          numero: contrato.numeroContrato,
          fechaInicio: contrato.fechaInicio.split('T')[0], // Formato para input date
          fechaFin: contrato.fechaFin.split('T')[0],
          estado: contrato.estado,
          servicios_ids: contrato.servicios_ids,
        });
      } catch (err: any) {
        setError(err.message || 'Error al cargar datos');
      } finally {
        setIsLoadingData(false);
      }
    };

    loadData();
  }, [id, getContratoById, fetchServicios]);

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
    if (!id) return;
    
    setError('');
    setIsLoading(true);

    try {
      await updateContrato(id, formData);
      router.push(`/contratos/${id}`);
    } catch (err: any) {
      setError(err.message || 'Error al actualizar contrato');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto mb-6"></div>
        <p className="text-xl text-muted-foreground font-medium">Cargando contrato...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">Editar Contrato</h1>
          <p className="mt-2 text-muted-foreground">Modifica la información del contrato</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Editar Contrato</CardTitle>
            <CardDescription>Modifica la información del contrato existente</CardDescription>
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
                  <Label htmlFor="numero">Número de Contrato</Label>
                  <Input
                    id="numero"
                    type="text"
                    name="numero"
                    value={formData.numero}
                    onChange={handleInputChange}
                    required
                    placeholder="Ej: CONT-2024-001"
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

                <div className="space-y-2">
                  <Label htmlFor="fechaInicio">Fecha de Inicio</Label>
                  <Input
                    id="fechaInicio"
                    type="date"
                    name="fechaInicio"
                    value={formData.fechaInicio}
                    onChange={handleInputChange}
                    required
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
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Label>Servicios</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {servicios.map((servicio) => (
                    <div
                      key={servicio._id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        formData.servicios_ids.includes(servicio._id)
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-border/80'
                      }`}
                      onClick={() => handleServicioToggle(servicio._id)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-foreground">{servicio.nombre}</h3>
                          <p className="text-sm text-muted-foreground">{servicio.descripcion}</p>
                          <p className="text-sm font-medium text-primary">
                            ${servicio.precio.toLocaleString()}
                          </p>
                        </div>
                        <div className={`w-4 h-4 border-2 rounded ${
                          formData.servicios_ids.includes(servicio._id)
                            ? 'border-primary bg-primary'
                            : 'border-border'
                        }`}>
                          {formData.servicios_ids.includes(servicio._id) && (
                            <div className="w-full h-full bg-primary-foreground rounded-sm flex items-center justify-center">
                              <div className="w-2 h-2 bg-primary rounded-full"></div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push(`/contratos/${id}`)}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={!formData.numero || !formData.fechaInicio || !formData.fechaFin || formData.servicios_ids.length === 0 || isLoading}
                >
                  {isLoading ? "Actualizando..." : "Actualizar Contrato"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}