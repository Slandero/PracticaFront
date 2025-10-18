'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function HomePage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log('HomePage - Estado de autenticación:', { isAuthenticated, isLoading });
    if (!isLoading) {
      if (isAuthenticated) {
        console.log('Usuario autenticado, redirigiendo a dashboard');
        router.push('/dashboard');
      } else {
        console.log('Usuario no autenticado, redirigiendo a login');
        router.push('/login');
      }
    }
  }, [isAuthenticated, isLoading, router]);

  // Mostrar loading mientras se verifica la autenticación
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Verificando autenticación...</p>
      </div>
    </div>
  );
}