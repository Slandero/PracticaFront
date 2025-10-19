"use client";

import { useAuth } from "@/context/AuthContext";
import { useContratoStore } from "@/store/contratoStore";
import { useServicioStore } from "@/store/serviceStore";
import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ProtectedRoute from "@/components/ProtectedRoute";
import { 
  FileText, 
  Settings, 
  TrendingUp, 
  Users,
  Plus,
  Eye,
  ArrowRight,
  Calendar,
  DollarSign
} from "lucide-react";

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const { contratos, fetchContratos, isLoading: contratosLoading } = useContratoStore();
  const { servicios, fetchServicios, isLoading: serviciosLoading } = useServicioStore();

  useEffect(() => {
    // Solo hacer fetch si el usuario está autenticado
    if (isAuthenticated) {
      fetchContratos().catch(error => {
        console.error('Error al cargar contratos:', error);
      });
      fetchServicios().catch(error => {
        console.error('Error al cargar servicios:', error);
      });
    }
  }, [fetchContratos, fetchServicios, isAuthenticated]);

  const contratosArray = Array.isArray(contratos) ? contratos : [];
  const serviciosArray = Array.isArray(servicios) ? servicios : [];
  
  const contratosActivos = contratosArray.filter(c => c.estado === "Activo").length;
  const totalServicios = serviciosArray.length;

  if (contratosLoading || serviciosLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#377E47] mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 font-medium">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
      <div className="container-modern py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-[#377E47] to-[#4a9d5a] rounded-3xl shadow-2xl mb-6">
            <span className="text-3xl">👋</span>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            ¡Bienvenido, <span className="text-gradient">{user?.nombre || "Usuario"}</span>!
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Gestiona tus contratos y servicios de telecomunicaciones de manera eficiente
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <Card  className="text-center group">
            <div className="w-16 h-16 bg-gradient-to-r from-[#377E47] to-[#4a9d5a] rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-4xl font-bold text-[#377E47] mb-2">{contratosArray.length}</h3>
            <p className="text-gray-600 font-medium">Contratos Totales</p>
            <p className="text-sm text-gray-500 mt-1">{contratosActivos} activos</p>
          </Card>

          <Card  className="text-center group">
            <div className="w-16 h-16 bg-gradient-to-r from-[#377E47] to-[#4a9d5a] rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <Settings className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-4xl font-bold text-[#377E47] mb-2">{totalServicios}</h3>
            <p className="text-gray-600 font-medium">Servicios</p>
            <p className="text-sm text-gray-500 mt-1">Disponibles</p>
          </Card>

          <Card  className="text-center group">
            <div className="w-16 h-16 bg-gradient-to-r from-[#377E47] to-[#4a9d5a] rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-4xl font-bold text-[#377E47] mb-2">{contratosActivos}</h3>
            <p className="text-gray-600 font-medium">Contratos Activos</p>
            <p className="text-sm text-gray-500 mt-1">En funcionamiento</p>
          </Card>

          <Card  className="text-center group">
            <div className="w-16 h-16 bg-gradient-to-r from-[#377E47] to-[#4a9d5a] rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-4xl font-bold text-[#377E47] mb-2">1</h3>
            <p className="text-gray-600 font-medium">Usuarios</p>
            <p className="text-sm text-gray-500 mt-1">Activo</p>
          </Card>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
              <CardDescription>Gestiona tus contratos y servicios</CardDescription>
            </CardHeader>
            <CardContent>
            <div className="space-y-4">
              <Button 
                variant="default" 
                size="lg"
                className="w-full flex items-center justify-center group"
                onClick={() => window.location.href = '/contratos/nuevo'}
              >
                <Plus className="w-5 h-5 mr-3 group-hover:rotate-90 transition-transform duration-300" />
                Nuevo Contrato
                <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="w-full flex items-center justify-center group"
                onClick={() => window.location.href = '/services/nuevo'}
              >
                <Plus className="w-5 h-5 mr-3 group-hover:rotate-90 transition-transform duration-300" />
                Nuevo Servicio
                <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contratos Recientes</CardTitle>
              <CardDescription>Últimos contratos creados</CardDescription>
            </CardHeader>
            <CardContent>
            {contratosArray.length > 0 ? (
              <div className="space-y-4">
                {contratosArray.slice(0, 3).map((contrato) => (
                  <div key={contrato._id} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-green-50 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-300">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-[#377E47] rounded-xl flex items-center justify-center">
                        <FileText className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{contrato.numeroContrato}</p>
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(contrato.fechaInicio).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge variant={contrato.estado === "Activo" ? "default" : "secondary"} className="px-3 py-1">
                        {contrato.estado}
                      </Badge>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => window.location.href = `/contratos/${contrato._id}`}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-10 h-10 text-gray-400" />
                </div>
                <p className="text-gray-500 text-lg">No hay contratos creados aún</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => window.location.href = '/contratos/nuevo'}
                >
                  Crear Primer Contrato
                </Button>
              </div>
            )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}