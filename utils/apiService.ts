import { config } from '../constants/config';
import { storage } from './storage';

// API Configuration
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || config.API_BASE_URL;
const API_TIMEOUT = 10000; // 10 seconds

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  errors?: Array<{ field: string; message: string }>;
}

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    role: string;
    isVerified: boolean;
    avatar?: string;
    preferences?: any;
    children?: any[];
  };
  token: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  isVerified: boolean;
  avatar?: string;
  preferences?: any;
  children?: any[];
}

// API Service Class
class ApiService {
  private baseURL: string;
  private timeout: number;

  constructor(baseURL: string, timeout: number = 10000) {
    this.baseURL = baseURL;
    this.timeout = timeout;
  }

  // Get auth token from storage
  private async getAuthToken(): Promise<string | null> {
    try {
      return await storage.getItem('auth-token');
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  }

  // Set auth token in storage
  private async setAuthToken(token: string): Promise<void> {
    try {
      await storage.setItem('auth-token', token);
    } catch (error) {
      console.error('Error setting auth token:', error);
    }
  }

  // Remove auth token from storage
  private async removeAuthToken(): Promise<void> {
    try {
      await storage.removeItem('auth-token');
    } catch (error) {
      console.error('Error removing auth token:', error);
    }
  }

  // Make HTTP request
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const token = await this.getAuthToken();

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      console.log('🌐 Making API request to:', url);
      console.log('📤 Request config:', {
        method: config.method || 'GET',
        headers: config.headers,
        body: config.body ? JSON.parse(config.body as string) : undefined
      });

      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      console.log('📥 Response status:', response.status);
      console.log('📥 Response headers:', Object.fromEntries(response.headers.entries()));

      let data;
      try {
        data = await response.json();
        console.log('📥 Response data:', data);
      } catch (parseError) {
        console.error('❌ Failed to parse response as JSON:', parseError);
        throw new Error('Invalid response format from server');
      }

      if (!response.ok) {
        console.error('❌ API request failed:', {
          status: response.status,
          statusText: response.statusText,
          data: data
        });
        throw new Error(data.error || data.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return data;
    } catch (error) {
      console.error('❌ API request error:', {
        url,
        error: error instanceof Error ? error.message : error,
        baseURL: this.baseURL,
        endpoint
      });
      
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout. Please check your connection and try again.');
      }
      
      throw error;
    }
  }

  // Health check
  async healthCheck(): Promise<ApiResponse> {
    return this.request('/health');
  }

  // Authentication methods
  async register(userData: {
    name: string;
    email: string;
    password: string;
    phone?: string;
  }): Promise<ApiResponse<AuthResponse>> {
    console.log('userData: >>--->', userData);
    
    const response = await this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    if (response.success && response.data?.token) {
      await this.setAuthToken(response.data.token);
    }

    return response;
  }

  async login(credentials: {
    email: string;
    password: string;
  }): Promise<ApiResponse<AuthResponse>> {
    const response = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (response.success && response.data?.token) {
      await this.setAuthToken(response.data.token);
    }

    return response;
  }

  async getCurrentUser(): Promise<ApiResponse<UserProfile>> {
    return this.request<UserProfile>('/auth/me');
  }

  async logout(): Promise<void> {
    await this.removeAuthToken();
  }

  // User profile methods
  async updateProfile(profileData: Partial<UserProfile>): Promise<ApiResponse<UserProfile>> {
    return this.request<UserProfile>('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async updateAvatar(avatarUrl: string): Promise<ApiResponse<UserProfile>> {
    return this.request<UserProfile>('/users/avatar', {
      method: 'PUT',
      body: JSON.stringify({ avatar: avatarUrl }),
    });
  }

  // Child profile methods
  async getChildren(): Promise<ApiResponse<any[]>> {
    return this.request<any[]>('/children');
  }

  async addChild(childData: any): Promise<ApiResponse<any>> {
    return this.request<any>('/children', {
      method: 'POST',
      body: JSON.stringify(childData),
    });
  }

  async updateChild(childId: string, childData: any): Promise<ApiResponse<any>> {
    return this.request<any>(`/children/${childId}`, {
      method: 'PUT',
      body: JSON.stringify(childData),
    });
  }

  async removeChild(childId: string): Promise<ApiResponse> {
    return this.request(`/children/${childId}`, {
      method: 'DELETE',
    });
  }

  // Meal methods
  async getMeals(filters?: any): Promise<ApiResponse<any[]>> {
    const queryParams = filters ? `?${new URLSearchParams(filters).toString()}` : '';
    return this.request<any[]>(`/meals${queryParams}`);
  }

  async addMeal(mealData: any): Promise<ApiResponse<any>> {
    return this.request<any>('/meals', {
      method: 'POST',
      body: JSON.stringify(mealData),
    });
  }

  async updateMeal(mealId: string, mealData: any): Promise<ApiResponse<any>> {
    return this.request<any>(`/meals/${mealId}`, {
      method: 'PUT',
      body: JSON.stringify(mealData),
    });
  }

  async removeMeal(mealId: string): Promise<ApiResponse> {
    return this.request(`/meals/${mealId}`, {
      method: 'DELETE',
    });
  }

  // Food methods
  async getFoods(filters?: any): Promise<ApiResponse<any[]>> {
    const queryParams = filters ? `?${new URLSearchParams(filters).toString()}` : '';
    return this.request<any[]>(`/foods${queryParams}`);
  }

  // Gamification methods
  async getBadges(): Promise<ApiResponse<any[]>> {
    return this.request<any[]>('/gamification/badges');
  }

  async unlockBadge(badgeId: string): Promise<ApiResponse> {
    return this.request(`/gamification/badges/${badgeId}/unlock`, {
      method: 'POST',
    });
  }

  async getProgress(): Promise<ApiResponse<any>> {
    return this.request<any>('/gamification/progress');
  }

  // Reporting methods
  async getReports(filters?: any): Promise<ApiResponse<any[]>> {
    const queryParams = filters ? `?${new URLSearchParams(filters).toString()}` : '';
    return this.request<any[]>(`/reporting${queryParams}`);
  }

  // Learning methods
  async getLearningContent(filters?: any): Promise<ApiResponse<any[]>> {
    const queryParams = filters ? `?${new URLSearchParams(filters).toString()}` : '';
    return this.request<any[]>(`/learning${queryParams}`);
  }

  async updateLearningProgress(contentId: string, progress: number): Promise<ApiResponse> {
    return this.request(`/learning/${contentId}/progress`, {
      method: 'PUT',
      body: JSON.stringify({ progress }),
    });
  }

  // File upload
  async uploadFile(file: any, type: 'avatar' | 'meal' | 'food'): Promise<ApiResponse<{ url: string }>> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    return this.request<{ url: string }>('/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });
  }
}

// Create and export singleton instance
export const apiService = new ApiService(API_BASE_URL, API_TIMEOUT);