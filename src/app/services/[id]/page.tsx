'use client'

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useServicioStore } from '@/store/serviceStore';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UpdateServicioRequest } from '@/types';

export default function ServicioEditarPage() {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    tipo: 'Internet' as 'Internet' | 'Televisión',
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
          tipo: servicio.tipo as 'Internet' | 'Televisión',
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
      await updateServicio(servicioId, servicioData as UpdateServicioRequest);
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">Editar Servicio</h1>
          <p className="mt-2 text-muted-foreground">Modifica la información del servicio</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Editar Servicio</CardTitle>
            <CardDescription>Modifica la información del servicio</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre del Servicio</Label>
                <Input
                  id="nombre"
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  required
                  placeholder="Ej: Internet 100 Mbps"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="descripcion">Descripción</Label>
                <Textarea
                  id="descripcion"
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
                  required
                  rows={3}
                  placeholder="Describe las características del servicio"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="precio">Precio</Label>
                  <Input
                    id="precio"
                    type="number"
                    name="precio"
                    value={formData.precio}
                    onChange={handleInputChange}
                    required
                    placeholder="50000"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo de Servicio</Label>
                  <Select
                    name="tipo"
                    value={formData.tipo}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, tipo: value as 'Internet' | 'Televisión' }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona el tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Internet">Internet</SelectItem>
                      <SelectItem value="Television">Televisión</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/services')}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={!formData.nombre || !formData.descripcion || !formData.precio || isLoading}
                >
                  {isLoading ? "Actualizando..." : "Actualizar Servicio"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
