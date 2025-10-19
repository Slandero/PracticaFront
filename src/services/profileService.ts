import api from './api';
import { ApiResponse } from '@/types';

interface UserProfile {
  _id: string;
  nombre: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

interface UpdateProfileRequest {
  nombre?: string;
  email?: string;
}

interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export const profileService = {
  /**
   * Obtiene el perfil del usuario actual
   * GET /api/auth/profile
   */
  async getProfile(): Promise<UserProfile> {
    const response = await api.get<ApiResponse<UserProfile>>('/auth/profile');
    return response.data.data;
  },

  /**
   * Actualiza el perfil del usuario
   * PUT /api/auth/profile
   */
  async updateProfile(profileData: UpdateProfileRequest): Promise<UserProfile> {
    const response = await api.put<ApiResponse<UserProfile>>('/auth/profile', profileData);
    return response.data.data;
  },

  /**
   * Cambia la contraseña del usuario
   * PUT /api/auth/change-password
   */
  async changePassword(passwordData: ChangePasswordRequest): Promise<void> {
    await api.put('/auth/change-password', passwordData);
  }
};
