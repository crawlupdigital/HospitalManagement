import { create } from 'zustand';
import api from '../lib/axios';

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('auth_token') || null,
  isAuthenticated: !!localStorage.getItem('auth_token'),
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data.data;
      
      localStorage.setItem('auth_token', token);
      
      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });
      return true;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Login failed',
        isLoading: false 
      });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('auth_token');
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },

  fetchUser: async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) return;

    set({ isLoading: true });
    try {
      const response = await api.get('/auth/me');
      set({ 
        user: response.data.data,
        isAuthenticated: true,
        isLoading: false 
      });
    } catch (error) {
      // Token might be invalid
      localStorage.removeItem('auth_token');
      set({ 
        user: null, 
        token: null, 
        isAuthenticated: false,
        isLoading: false 
      });
    }
  }
}));
