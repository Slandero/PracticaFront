'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useServicioStore } from '@/store/serviceStore';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function ServicioNuevoPage() {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    tipo: 'Internet' as 'Internet' | 'Televisión', 
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">Crear Nuevo Servicio</h1>
          <p className="mt-2 text-muted-foreground">Completa la información del servicio</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Crear Servicio</CardTitle>
            <CardDescription>Agrega un nuevo servicio a tu catálogo</CardDescription>
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
                  placeholder="Describe las características del servicio (mínimo 10 caracteres)"
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
                      <SelectItem value="Televisión">Televisión</SelectItem>
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
                  {isLoading ? "Creando..." : "Crear Servicio"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
