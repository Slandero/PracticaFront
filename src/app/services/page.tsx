'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useServicioStore } from '@/store/serviceStore';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Settings, 
  Wifi,
  AlertCircle,
  CheckCircle2,
  Loader2
} from 'lucide-react';

export default function ServiciosPage() {
  const { servicios, isLoading, error, deleteServicio, fetchServicios } = useServicioStore();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchServicios();
  }, [fetchServicios]);

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este servicio? Esta acción no se puede deshacer.')) {
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

  const serviciosArray = Array.isArray(servicios) ? servicios : [];

  // Estado de carga elegante
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-green-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-16 w-16 rounded-full mx-auto mb-4" />
                  <Skeleton className="h-6 w-32 mx-auto mb-2" />
                  <Skeleton className="h-4 w-24 mx-auto" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-4" />
                  <div className="flex justify-between">
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-8 w-20" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-green-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header elegante */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Gestión de Servicios</h1>
              <p className="text-muted-foreground">
                Administra los servicios de telecomunicaciones disponibles
              </p>
            </div>
            <Button 
              onClick={() => router.push('/services/nuevo')}
              className="shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Servicio
            </Button>
          </div>
        </div>

        {/* Estados de error */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Error al cargar servicios: {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Lista de servicios */}
        {serviciosArray.length > 0 ? (
          <>
            {/* Estadísticas rápidas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Settings className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-2xl font-bold text-primary mb-1">
                    {serviciosArray.length}
                  </div>
                  <p className="text-sm text-muted-foreground">Servicios Totales</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Wifi className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    {serviciosArray.filter(s => s.tipo === 'Internet').length}
                  </div>
                  <p className="text-sm text-muted-foreground">Servicios de Internet</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Settings className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="text-2xl font-bold text-purple-600 mb-1">
                    {serviciosArray.filter(s => s.tipo === 'Televisión').length}
                  </div>
                  <p className="text-sm text-muted-foreground">Servicios de TV</p>
                </CardContent>
              </Card>
            </div>

            {/* Grid de servicios */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {serviciosArray.map((servicio) => (
                <Card 
                  key={servicio._id} 
                  className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <CardHeader className="text-center pb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Settings className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{servicio.nombre}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {servicio.descripcion}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center space-y-4">
                    <div className="flex items-center justify-center gap-2">
                      <Badge 
                        variant={servicio.tipo === 'Internet' ? 'default' : 'secondary'}
                        className="capitalize"
                      >
                        {servicio.tipo}
                      </Badge>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-3xl font-bold text-primary mb-1">
                        ${servicio.precio.toLocaleString()}
                      </p>
                      <p className="text-sm text-muted-foreground">por mes</p>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => router.push(`/services/${servicio._id}`)}
                        className="flex-1"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Editar
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDelete(servicio._id)}
                        disabled={deletingId === servicio._id}
                        className="flex-1"
                      >
                        {deletingId === servicio._id ? (
                          <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4 mr-1" />
                        )}
                        {deletingId === servicio._id ? 'Eliminando...' : 'Eliminar'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        ) : (
          <Card className="text-center py-16">
            <CardContent>
              <div className="w-24 h-24 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Settings className="w-12 h-12 text-muted-foreground" />
              </div>
              <CardTitle className="mb-3">No hay servicios disponibles</CardTitle>
              <CardDescription className="mb-8 text-base">
                Crea tu primer servicio para comenzar a gestionar los servicios de telecomunicaciones
              </CardDescription>
              <Button 
                onClick={() => router.push('/services/nuevo')}
                className="shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Plus className="w-4 h-4 mr-2" />
                Crear Primer Servicio
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}