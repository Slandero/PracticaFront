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

  async getProfile(): Promise<UserProfile> {
    const response = await api.get<ApiResponse<UserProfile>>('/auth/profile');
    return response.data.data;
  },


  async updateProfile(profileData: UpdateProfileRequest): Promise<UserProfile> {
    const response = await api.put<ApiResponse<UserProfile>>('/auth/profile', profileData);
    return response.data.data;
  },

  async changePassword(passwordData: ChangePasswordRequest): Promise<void> {
    await api.put('/auth/change-password', passwordData);
  }
};
