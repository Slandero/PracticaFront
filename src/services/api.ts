import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { jwtDecode } from 'jwt-decode';

// Configuración base de la API
const API_BASE_URL = 'http://localhost:8000/api'; // Ajusta según tu puerto del backend

// Para debug - verificar la URL
console.log('API Base URL:', API_BASE_URL);

// Interfaz para el token JWT decodificado
interface DecodedToken {
  id: string;        // Cambiar de userId a id
  email: string;
  iat: number;
  exp: number;
}

// Crear instancia de Axios
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token de autenticación
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        // Verificar si el token no ha expirado
        try {
          const decodedToken = jwtDecode<DecodedToken>(token);
          const currentTime = Date.now() / 1000;
          
          if (decodedToken.exp < currentTime) {
            // Token expirado, limpiar localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
            return config;
          }
          
          config.headers.Authorization = `Bearer ${token}`;
        } catch (error) {
          // Token inválido, limpiar localStorage
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
      }
    }
    return config;
  },
  (error) => {
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
      // Token expirado o inválido
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;