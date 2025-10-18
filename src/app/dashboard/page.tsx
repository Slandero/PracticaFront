'use client'

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useContratoStore } from '@/store/contratoStore';
import ContratosList from '@/components/ContratosList';
import StatsCards from '@/components/StatsCards';

export default function DashboardPage() {
  const { user } = useAuth();
  const { contratos, isLoading } = useContratoStore();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-2 text-gray-600">
              Bienvenido, {user?.nombre}. Gestiona tus contratos de telecomunicaciones.
            </p>
          </div>
          
          {!isLoading && <StatsCards contratos={contratos} />}

          <div className="mt-6">
            <ContratosList />
          </div>
        </div>
      </main>
    </div>
  );
}
