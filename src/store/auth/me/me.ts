import { create } from 'zustand';
import api from '@/components/utils/api';
import { useNotificationStore } from '@/components/notify/notification';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any; // allow extra fields from backend
}

interface AuthMeState {
  userDetails: AuthUser | null;
  isLoading: boolean;
  error: string | null;
  TokenExpired: boolean;

  fetchMe: () => Promise<void>;
  clearUser: () => void;
}

export const useAuthMeStore = create<AuthMeState>((set) => ({
  userDetails: null,
  isLoading: false,
  error: null,
  TokenExpired: false,

  fetchMe: async () => {
    set({ isLoading: true, error: null });
    const { showNotification } = useNotificationStore.getState() as { showNotification: (message: string, type: string) => void };

    try {
      const response = await api.get<AuthUser>('/auth/me');
      set({ userDetails: response.data, isLoading: false, TokenExpired: false });
    } catch (error: any) {
      let errorMessage = 'Failed to fetch userDetails details';

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      set({ error: errorMessage, isLoading: false });
      if(errorMessage=='Token is not valid'){
        set({ TokenExpired: true });
      }
      showNotification(errorMessage, 'error');
    }
  },

  clearUser: () => {
    set({ userDetails: null, error: null });
  },
}));
