// src/pages/ContratoEditar.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useContratoStore } from '../store/contratoStore';
import { useServicioStore } from '../store/serviceStore';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const ContratoEditar: React.FC = () => {
  const { id } = useParams<{ id: string }>();
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
  const router = useRouter();

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      
      try {
        await fetchServicios();
        const contrato = await getContratoById(id);
        
        setFormData({
          numero: contrato.numero,
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Editar Contrato</h1>
          <p className="mt-2 text-gray-600">Modifica la información del contrato</p>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {servicios.map((servicio) => (
                  <div
                    key={servicio._id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      formData.servicios_ids.includes(servicio._id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onClick={() => handleServicioToggle(servicio._id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">{servicio.nombre}</h3>
                        <p className="text-sm text-gray-600">{servicio.descripcion}</p>
                        <p className="text-sm font-medium text-blue-600">
                          ${servicio.precio.toLocaleString()}
                        </p>
                      </div>
                      <div className={`w-4 h-4 border-2 rounded ${
                        formData.servicios_ids.includes(servicio._id)
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-300'
                      }`}>
                        {formData.servicios_ids.includes(servicio._id) && (
                          <div className="w-full h-full bg-white rounded-sm flex items-center justify-center">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
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
                variant="secondary"
                onClick={() => router.push(`/contratos/${id}`)}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                loading={isLoading}
                disabled={!formData.numero || !formData.fechaInicio || !formData.fechaFin || formData.servicios_ids.length === 0}
              >
                Actualizar Contrato
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default ContratoEditar;