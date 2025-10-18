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

  // Función para obtener cookie
  const getCookie = (name: string): string | null => {
    if (typeof window === 'undefined') return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
  };

  // Función para establecer cookie
  const setCookie = (name: string, value: string, days: number = 7) => {
    if (typeof window === 'undefined') return;
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
  };

  // Función para eliminar cookie
  const deleteCookie = (name: string) => {
    if (typeof window === 'undefined') return;
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
  };

  // Verificar si hay un token válido al cargar la aplicación
  useEffect(() => {
    const checkAuth = async () => {
      if (typeof window === 'undefined') {
        setIsLoading(false);
        return;
      }
      
      const storedToken = getCookie('token');
      const storedUser = getCookie('user');

      if (storedToken && storedUser) {
        try {
          // Verificar si el token no ha expirado
          const decodedToken = jwtDecode<DecodedToken>(storedToken);
          const currentTime = Date.now() / 1000;

          if (decodedToken.exp > currentTime) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
            console.log('Usuario autenticado desde cookies:', JSON.parse(storedUser));
          } else {
            // Token expirado, limpiar cookies
            deleteCookie('token');
            deleteCookie('user');
            console.log('Token expirado, limpiando cookies');
          }
        } catch (error) {
          // Token inválido, limpiar cookies
          deleteCookie('token');
          deleteCookie('user');
          console.log('Token inválido, limpiando cookies');
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

      // Guardar en cookies
      setCookie('token', newToken, 7); // 7 días de expiración
      setCookie('user', JSON.stringify(user), 7);

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

      // Guardar en cookies
      setCookie('token', newToken, 7); // 7 días de expiración
      setCookie('user', JSON.stringify(user), 7);

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
      deleteCookie('token');
      deleteCookie('user');
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