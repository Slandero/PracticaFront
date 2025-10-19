"use client";

import { useContratoStore } from "@/store/contratoStore";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  Calendar,
  FileText,
  Search,
  Filter
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ContratosPage() {
  const { contratos, fetchContratos, deleteContrato, isLoading } = useContratoStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState("todos");
  const router = useRouter();

  useEffect(() => {
    fetchContratos();
  }, [fetchContratos]);

  // Verificación de seguridad
  const contratosArray = Array.isArray(contratos) ? contratos : [];

  // Filtrar contratos
  const filteredContratos = contratosArray.filter(contrato => {
    const matchesSearch = contrato.numeroContrato.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEstado = filterEstado === "todos" || contrato.estado === filterEstado;
    return matchesSearch && matchesEstado;
  });

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de que quieres eliminar este contrato?")) {
      try {
        await deleteContrato(id);
        fetchContratos(); // Recargar la lista
      } catch (error) {
        console.error("Error al eliminar contrato:", error);
        alert("Error al eliminar el contrato");
      }
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "Activo":
        return "default";
      case "Inactivo":
        return "secondary";
      case "Pendiente":
        return "outline";
      default:
        return "secondary";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando contratos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Contratos</h1>
              <p className="text-gray-600 mt-2">
                Gestiona todos tus contratos de telecomunicaciones
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <Button 
                variant="default" 
                onClick={() => router.push('/contratos/nuevo')}
                className="flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Contrato
              </Button>
            </div>
          </div>
        </div>

        {/* Filtros y búsqueda */}
        <Card title="Filtros" className="mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar por número de contrato..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <select
                value={filterEstado}
                onChange={(e) => setFilterEstado(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="todos">Todos los estados</option>
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
                <option value="Pendiente">Pendiente</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Lista de contratos */}
        <Card title={`Contratos (${filteredContratos.length})`} >
          {filteredContratos.length > 0 ? (
            <div className="space-y-4">
              {filteredContratos.map((contrato) => (
                <div 
                  key={contrato._id} 
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <h3 className="text-lg font-semibold text-gray-900">
                        {contrato.numeroContrato}
                      </h3>
                      <Badge variant={getEstadoColor(contrato.estado)}>
                        {contrato.estado}
                      </Badge>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>Inicio: {new Date(contrato.fechaInicio).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>Fin: {new Date(contrato.fechaFin).toLocaleDateString()}</span>
                      </div>
                      <div>
                        <span>Servicios: {contrato.servicios_ids?.length || 0}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                    <Button 
                      variant="secondary" 
                      onClick={() => router.push(`/contratos/${contrato._id}`)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="secondary" 
                      onClick={() => router.push(`/contratos/${contrato._id}/editar`)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="destructive" 
                      onClick={() => handleDelete(contrato._id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm || filterEstado !== "todos" ? "No se encontraron contratos" : "No hay contratos"}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || filterEstado !== "todos" 
                  ? "Intenta ajustar los filtros de búsqueda" 
                  : "Crea tu primer contrato para comenzar"
                }
              </p>
              {!searchTerm && filterEstado === "todos" && (
                <Button 
                  variant="default" 
                  onClick={() => router.push('/contratos/nuevo')}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Crear Primer Contrato
                </Button>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}