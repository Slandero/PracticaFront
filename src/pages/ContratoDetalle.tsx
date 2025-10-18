'use client'

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useContratoStore } from '@/store/contratoStore';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

const ContratoDetalle: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [contrato, setContrato] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const { getContratoById } = useContratoStore();
  const router = useRouter();

  useEffect(() => {
    const loadContrato = async () => {
      if (!id) return;
      
      try {
        const contratoData = await getContratoById(id);
        setContrato(contratoData);
      } catch (err: any) {
        setError(err.message || 'Error al cargar contrato');
      } finally {
        setIsLoading(false);
      }
    };

    loadContrato();
  }, [id, getContratoById]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES');
  };

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
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
          <Button onClick={() => router.push('/dashboard')}>
            Volver al Dashboard
          </Button>
        </div>
      </div>
    );
  }

  if (!contrato) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Contrato no encontrado</p>
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Detalle del Contrato</h1>
              <p className="mt-2 text-gray-600">Contrato #{contrato.numero}</p>
            </div>
            <div className="flex space-x-4">
              <Link to={`/contratos/${contrato._id}/editar`}>
                <Button variant="secondary">Editar</Button>
              </Link>
              <Button onClick={() => router.push('/dashboard')}>
                Volver al Dashboard
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Información del Contrato */}
          <Card title="Información del Contrato">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Número</label>
                <p className="text-lg font-semibold text-gray-900">{contrato.numero}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500">Estado</label>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(contrato.estado)}`}>
                  {contrato.estado}
                </span>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500">Fecha de Inicio</label>
                <p className="text-gray-900">{formatDate(contrato.fechaInicio)}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500">Fecha de Fin</label>
                <p className="text-gray-900">{formatDate(contrato.fechaFin)}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500">Fecha de Creación</label>
                <p className="text-gray-900">{formatDate(contrato.createdAt)}</p>
              </div>
            </div>
          </Card>

          {/* Servicios Asociados */}
          <Card title="Servicios Asociados">
            {contrato.servicios && contrato.servicios.length > 0 ? (
              <div className="space-y-4">
                {contrato.servicios.map((servicio: any) => (
                  <div key={servicio._id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">{servicio.nombre}</h3>
                        <p className="text-sm text-gray-600 mt-1">{servicio.descripcion}</p>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-2 ${
                          servicio.tipo === 'Internet' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                          {servicio.tipo}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-green-600">
                          ${servicio.precio.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500">mensual</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                No hay servicios asociados a este contrato.
              </p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ContratoDetalle;