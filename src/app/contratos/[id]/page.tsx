'use client'

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useContratoStore } from '@/store/contratoStore';
import { useServicioStore } from '@/store/serviceStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';

interface PageParams {
  id: string;
}

export default function ContratoDetallePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const { getContratoById } = useContratoStore();
 
  const { servicios: serviciosStore, fetchServicios } = useServicioStore();
  const [contrato, setContrato] = useState<any>(null);
  const [servicios, setServicios] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      if (!id) {
        setError('ID de contrato no válido');
        setIsLoading(false);
        return;
      }
      
      try {
        await fetchServicios();
        const contratoData = await getContratoById(id);
        setContrato(contratoData);
        
        console.log('📋 Contrato cargado:', contratoData);
        console.log('🔢 Servicios IDs:', contratoData.servicios_ids);
        console.log('📦 Servicios completos:', contratoData.servicios);
        console.log('📦 Servicios completos del backend:', contratoData.servicios);
        console.log('🏪 Servicios en el store:', serviciosStore);
        
        // Si el backend devuelve servicios poblados
        if (contratoData.servicios && Array.isArray(contratoData.servicios) && contratoData.servicios.length > 0) {
        console.log('✅ Usando servicios poblados del backend')
          setServicios(contratoData.servicios);
        } 
        // Si solo tenemos IDs, buscar los servicios en el store
       else if (contratoData.servicios_ids && Array.isArray(contratoData.servicios_ids) && contratoData.servicios_ids.length > 0) {
        console.log('🔍 Buscando servicios en el store por IDs...');
        console.log('🏪 Servicios en el store:', serviciosStore);
        console.log('🔢 Tipo de servicios_ids:', typeof contratoData.servicios_ids[0]);
        console.log('🔢 Primer elemento:', contratoData.servicios_ids[0]);
        
        // Si servicios_ids contiene objetos, usar directamente
        if (typeof contratoData.servicios_ids[0] === 'object' && 'id' in contratoData.servicios_ids[0]) {
          console.log('✅ servicios_ids contiene objetos, usando directamente');
          setServicios(contratoData.servicios_ids);
        } else {
          // Si servicios_ids contiene strings, filtrar del store
          console.log('✅ servicios_ids contiene strings, filtrando del store');
          setServicios(contratoData.servicios_ids);
        }
      } else {
        console.log('⚠️ No se encontraron servicios ni IDs');
        console.log('🔢 servicios_ids:', contratoData.servicios_ids);
        console.log('🔢 Tipo de servicios_ids:', typeof contratoData.servicios_ids[0]);
        console.log('🔢 Primer elemento:', contratoData.servicios_ids[0]);
          setServicios([]);
        }
      } catch (err: any) {
        setError(err.message || 'Error al cargar datos');
      } finally {
        setIsLoading(false);
      }
    };
  
    loadData();
  }, [id, getContratoById, fetchServicios, serviciosStore]);

  const getStatusColor = (estado: string) => {
    const colors = {
      Activo: 'bg-green-100 text-green-800',
      Inactivo: 'bg-gray-100 text-gray-800',
      Suspendido: 'bg-yellow-100 text-yellow-800',
      Cancelado: 'bg-red-100 text-red-800',
    };
    return colors[estado as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900">Error</h3>
            <p className="mt-2 text-sm text-gray-500">{error}</p>
            <div className="mt-4">
              <Button onClick={() => router.push('/dashboard')}>
                Volver al Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!contrato) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900">Contrato no encontrado</h3>
          <Button onClick={() => router.push('/dashboard')}>
            Volver al Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Detalle del Contrato</h1>
          <p className="mt-2 text-gray-600">Información completa del contrato</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Información del contrato */}
          <div className="lg:col-span-2">
            <Card title="Información del Contrato">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Número de Contrato</label>
                  <p className="mt-1 text-lg font-semibold text-gray-900">{contrato.numeroContrato}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Estado</label>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(contrato.estado)}`}>
                    {contrato.estado}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Fecha de Inicio</label>
                    <p className="mt-1 text-gray-900">{new Date(contrato.fechaInicio).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Fecha de Fin</label>
                    <p className="mt-1 text-gray-900">{new Date(contrato.fechaFin).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Servicios */}
          <div>
            <Card title="Servicios">
              {servicios.length > 0 ? (
                <div className="space-y-3">
                  {servicios.map((servicio) => (
                    <div key={servicio._id} className="border rounded-lg p-3">
                      <h4 className="font-medium text-gray-900">{servicio.nombre}</h4>
                      <p className="text-sm text-gray-600">{servicio.descripcion}</p>
                      <p className="text-sm font-medium text-blue-600">
                        ${servicio.precio.toLocaleString()}
                      </p>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        servicio.tipo === 'Internet' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {servicio.tipo}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No hay servicios asociados</p>
              )}
            </Card>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-4">
          <Button
            variant="secondary"
            onClick={() => router.push('/dashboard')}
          >
            Volver al Dashboard
          </Button>
          <Button
            onClick={() => router.push(`/contratos/${id}/editar`)}
          >
            Editar Contrato
          </Button>
        </div>
      </div>
    </div>
  );
}
