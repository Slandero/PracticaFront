import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { jwtDecode } from 'jwt-decode';

const API_BASE_URL = 'http://localhost:8000/api'; 


interface DecodedToken {
  id: string;        
  email: string;
  iat: number;
  exp: number;
}

// Crear instancia de Axios
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Función para obtener cookie
const getCookie = (name: string): string | null => {
  if (typeof window === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
};

// Función para eliminar cookie
const deleteCookie = (name: string) => {
  if (typeof window === 'undefined') return;
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
};

// Interceptor para agregar token de autenticación
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = getCookie('token');
      console.log('Token encontrado:', token ? 'Sí' : 'No');

      if (token) {
        // Verificar si el token no ha expirado
        try {
          const decodedToken = jwtDecode<DecodedToken>(token);
          const currentTime = Date.now() / 1000;

          if (decodedToken.exp < currentTime) {
            console.log('Token expirado');
            deleteCookie('token');
            deleteCookie('user');
            window.location.href = '/login';
            return config;
          }

          config.headers.Authorization = `Bearer ${token}`;
        } catch (error) {
          console.log('Token inválido:', error);
          deleteCookie('token');
          deleteCookie('user');
          window.location.href = '/login';
        }
      } else {
        console.log('No hay token disponible');
      }
    }
    return config;
  },
  (error) => {
    console.error('Error en interceptor de request:', error);
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {

    if (error.response?.status === 401) {
      // Token expirado o inválido - limpiar cookies
      if (typeof window !== 'undefined') {
        deleteCookie('token');
        deleteCookie('user');
        // Evitar bucle infinito: solo redirigir si no estamos ya en login
        if (!window.location.pathname.startsWith('/login')) {
          window.location.href = '/login';
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
