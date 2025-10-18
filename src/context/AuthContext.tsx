'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '@/services/api';

// Interfaces
interface User {
  id: string;
  nombre: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

interface DecodedToken {
  id: string;
  email: string;
  iat: number;
  exp: number;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (nombre: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

// Crear el contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook personalizado para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

// Props del provider
interface AuthProviderProps {
  children: ReactNode;
}

// Provider del contexto
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar si hay un token válido al cargar la aplicación
  useEffect(() => {
    const checkAuth = async () => {
      if (typeof window === 'undefined') {
        setIsLoading(false);
        return;
      }
      
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        try {
          // Verificar si el token no ha expirado
          const decodedToken = jwtDecode<DecodedToken>(storedToken);
          const currentTime = Date.now() / 1000;

          if (decodedToken.exp > currentTime) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
            console.log('Usuario autenticado desde localStorage:', JSON.parse(storedUser));
          } else {
            // Token expirado, limpiar localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            console.log('Token expirado, limpiando localStorage');
          }
        } catch (error) {
          // Token inválido, limpiar localStorage
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          console.log('Token inválido, limpiando localStorage');
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  // Función de login
  const login = async (email: string, password: string) => {
    try {
      console.log('Iniciando login para:', email);
      const response = await api.post('/auth/login', { email, password });
      console.log('Respuesta del login:', response.data);
      
      const { token: newToken, user } = response.data.data;

      // Guardar en localStorage
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(user));

      // Actualizar estado
      setToken(newToken);
      setUser(user);
      console.log('Login exitoso, usuario:', user);
    } catch (error: any) {
      console.error('Error en login:', error.response?.data);
      throw new Error(error.response?.data?.message || 'Error al iniciar sesión');
    }
  };

  // Función de registro
  const register = async (nombre: string, email: string, password: string) => {
    try {
      const data = { nombre, email, password };
      console.log('Enviando datos de registro:', data);
      
      const response = await api.post('/auth/register', data);
      console.log('Respuesta del registro:', response.data);
      
      const { token: newToken, user } = response.data.data;

      // Guardar en localStorage
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(user));

      // Actualizar estado
      setToken(newToken);
      setUser(user);
      console.log('Registro exitoso, usuario:', user);
    } catch (error: any) {
      console.error('Error en registro:', error.response?.data);
      console.error('Errores específicos:', error.response?.data?.errors);
      
      if (error.response?.data?.errors) {
        error.response.data.errors.forEach((err: any, index: number) => {
          console.error(`Error ${index + 1}:`, err);
        });
      }
      
      throw new Error(error.response?.data?.message || 'Error al registrarse');
    }
  };

  // Función de logout
  const logout = () => {
    console.log('Cerrando sesión');
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    setToken(null);
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!user && !!token,
    isLoading,
    login,
    register,
    logout,
  };

  console.log('Estado de autenticación:', { 
    isAuthenticated: value.isAuthenticated, 
    isLoading: value.isLoading, 
    user: value.user?.nombre 
  });

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};