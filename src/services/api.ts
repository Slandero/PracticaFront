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
    'Accept': 'application/json',
  },
});

// Interceptor para agregar token de autenticación
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      console.log('🔑 Token encontrado:', token ? 'Sí' : 'No');
      
      if (token) {
        // Verificar si el token no ha expirado
        try {
          const decodedToken = jwtDecode<DecodedToken>(token);
          const currentTime = Date.now() / 1000;
          
          console.log('⏰ Token expira en:', new Date(decodedToken.exp * 1000));
          console.log('🕐 Tiempo actual:', new Date());
          console.log('👤 Usuario ID:', decodedToken.id);
          
          if (decodedToken.exp < currentTime) {
            console.log('❌ Token expirado');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
            return config;
          }
          
          config.headers.Authorization = `Bearer ${token}`;
          console.log('✅ Token agregado a la request');
        } catch (error) {
          console.log('❌ Token inválido:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
      } else {
        console.log('⚠️ No hay token disponible');
      }
    }
    return config;
  },
  (error) => {
    console.error('❌ Error en interceptor de request:', error);
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log('✅ Respuesta exitosa:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ Error en respuesta:', error.response?.status, error.config?.url);
    console.error('📋 Datos del error:', error.response?.data);
    
    if (error.response?.status === 401) {
      console.log('🔒 Token expirado o inválido - redirigiendo a login');
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
