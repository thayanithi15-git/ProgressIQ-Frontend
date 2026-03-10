import api from '@/utils/api';
import { getEncryptedItem, removeEncryptedItem, setEncryptedItem } from '@/utils/encryption';
import { useNotificationStore } from '@/utils/notification';
import { create } from 'zustand';

interface AdminUser {
  userId: string;
  email: string;
  role: 'ADMIN';
  token: string;
}

interface AdminAuthState {
  user: AdminUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => void;
}

export const useAdminAuthStore = create<AdminAuthState>((set) => ({
  user: null,
  isLoading: false,
  isAuthenticated: false,

  login: async (email: string, password: string) => {
    const { showNotification } = useNotificationStore.getState();
    
    try {
      set({ isLoading: true });
      showNotification('Signing in...', 'pending');

      const response = await api.post('/api/auth/login', {
        email,
        password,
      });

      const { token, role, userId } = response.data;

      if (role !== 'ADMIN') {
        throw new Error('Unauthorized: Admin access only');
      }

      // Encrypt and store sensitive data
      setEncryptedItem('token', token);
      setEncryptedItem('role', role);
      setEncryptedItem('userId', userId);

      // Store user session for UI (fallback to email prefix as name)
      if (typeof window !== 'undefined') {
        const nameFromEmail = email.split('@')[0] || 'Admin';
        localStorage.setItem(
          'credxUser',
          JSON.stringify({
            username: nameFromEmail,
            email,
            role,
            signedInAt: new Date().toISOString(),
          })
        );
      }

      const adminUser: AdminUser = {
        userId,
        email,
        role: 'ADMIN',
        token,
      };

      set({
        user: adminUser,
        isAuthenticated: true,
        isLoading: false,
      });

      showNotification('Login successful! Welcome Admin.', 'success');
    } catch (error: any) {
      set({ isLoading: false, user: null, isAuthenticated: false });
      
      const errorMessage = error.response?.data?.message || error.message || 'Login failed. Please try again.';
      showNotification(errorMessage, 'error');
      
      throw error;
    }
  },

  logout: () => {
    const { showNotification } = useNotificationStore.getState();
    
    removeEncryptedItem('token');
    removeEncryptedItem('role');
    removeEncryptedItem('userId');
    if (typeof window !== 'undefined') {
      localStorage.removeItem('credxUser');
    }

    set({
      user: null,
      isAuthenticated: false,
    });

    showNotification('Logged out successfully', 'info');
  },

  checkAuth: () => {
    const token = getEncryptedItem('token');
    const role = getEncryptedItem('role');
    const userId = getEncryptedItem('userId');

    if (token && role === 'ADMIN' && userId) {
      set({
        user: {
          userId,
          email: '',
          role: 'ADMIN',
          token,
        },
        isAuthenticated: true,
      });
    } else {
      set({
        user: null,
        isAuthenticated: false,
      });
    }
  },
}));
