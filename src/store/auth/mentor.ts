import api from '@/utils/api';
import { getEncryptedItem, removeEncryptedItem, setEncryptedItem } from '@/utils/encryption';
import { useNotificationStore } from '@/utils/notification';
import { create } from 'zustand';

interface MentorUser {
  userId: string;
  email: string;
  role: 'MENTOR';
  token: string;
}

interface MentorAuthState {
  user: MentorUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  googleLogin: (credential: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => void;
}

export const useMentorAuthStore = create<MentorAuthState>((set) => ({
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

      const { token, role, userId, picture } = response.data;

      if (role !== 'MENTOR') {
        throw new Error('Unauthorized: Mentor access only');
      }

      setEncryptedItem('token', token);
      setEncryptedItem('role', role);
      setEncryptedItem('userId', userId);

      if (typeof window !== 'undefined') {
        let displayName = email.split('@')[0] || 'Mentor';
        try {
          const profileRes = await api.get('/api/mentor/profile');
          if (profileRes.data?.success && profileRes.data?.data?.name) {
            displayName = profileRes.data.data.name;
          }
        } catch {}

        localStorage.setItem(
          'credxUser',
          JSON.stringify({
            username: displayName,
            email,
            role,
            userId,
            picture,
            signedInAt: new Date().toISOString(),
          })
        );
      }

      const mentorUser: MentorUser = {
        userId,
        email,
        role: 'MENTOR',
        token,
      };

      set({
        user: mentorUser,
        isAuthenticated: true,
        isLoading: false,
      });

      showNotification('Login successful! Welcome Mentor.', 'success');
    } catch (error: any) {
      set({ isLoading: false, user: null, isAuthenticated: false });
      const errorMessage = error.response?.data?.message || error.message || 'Login failed. Please try again.';
      showNotification(errorMessage, 'error');
      throw error;
    }
  },

  googleLogin: async (credential: string) => {
    const { showNotification } = useNotificationStore.getState();
    try {
      set({ isLoading: true });
      showNotification('Signing in with Google...', 'pending');

      const response = await api.post('/api/auth/google', {
        credential
      });

      const { token, role, userId, picture, email, username } = response.data;

      if (role !== 'MENTOR') {
        throw new Error('Unauthorized: Mentor access only');
      }

      setEncryptedItem('token', token);
      setEncryptedItem('role', role);
      setEncryptedItem('userId', userId);

      if (typeof window !== 'undefined') {
        localStorage.setItem(
          'credxUser',
          JSON.stringify({
            username,
            email,
            role,
            userId,
            picture,
            signedInAt: new Date().toISOString(),
          })
        );
      }

      const mentorUser: MentorUser = {
        userId,
        email,
        role: 'MENTOR',
        token,
      };

      set({
        user: mentorUser,
        isAuthenticated: true,
        isLoading: false,
      });

      showNotification('Google sign-in successful!', 'success');
    } catch (error: any) {
      set({ isLoading: false, user: null, isAuthenticated: false });
      const errorMessage = error.response?.data?.message || error.message || 'Google sign-in failed.';
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

    if (token && role === 'MENTOR' && userId) {
      set({
        user: {
          userId,
          email: '',
          role: 'MENTOR',
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
