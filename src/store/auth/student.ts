import api from '@/utils/api';
import { getEncryptedItem, removeEncryptedItem, setEncryptedItem } from '@/utils/encryption';
import { useNotificationStore } from '@/utils/notification';
import { setStoredMentorProfile } from '@/utils/mentorSession';
import { create } from 'zustand';

interface StudentUser {
  userId: string;
  email: string;
  role: 'STUDENT';
  token: string;
}

interface StudentAuthState {
  user: StudentUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  googleLogin: (credential: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => void;
}

export const useStudentAuthStore = create<StudentAuthState>((set) => ({
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

      if (role !== 'STUDENT') {
        throw new Error('Unauthorized: Student access only');
      }

      setEncryptedItem('token', token);
      setEncryptedItem('role', role);
      setEncryptedItem('userId', userId);

      if (typeof window !== 'undefined') {
        let displayName = email.split('@')[0] || 'Student';
        try {
          const profileRes = await api.get('/api/student/profile');
          if (profileRes.data?.success && profileRes.data?.data) {
            const first = profileRes.data.data.firstName || '';
            const last = profileRes.data.data.lastName || '';
            const full = `${first} ${last}`.trim();
            if (full) displayName = full;
          }
        } catch {}

        try {
          const completeRes = await api.get('/api/student/profile/complete');
          if (completeRes.data?.success && completeRes.data?.data?.mentorInfo) {
            setStoredMentorProfile(completeRes.data.data.mentorInfo);
          } else {
            setStoredMentorProfile(null);
          }
        } catch {
          setStoredMentorProfile(null);
        }

        localStorage.setItem(
          'credxUser',
          JSON.stringify({
            username: displayName,
            email,
            role,
            picture,
            signedInAt: new Date().toISOString(),
          })
        );
      }

      const studentUser: StudentUser = {
        userId,
        email,
        role: 'STUDENT',
        token,
      };

      set({
        user: studentUser,
        isAuthenticated: true,
        isLoading: false,
      });

      showNotification('Login successful! Welcome Student.', 'success');
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

      if (role !== 'STUDENT') {
        throw new Error('Unauthorized: Student access only');
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
            picture,
            signedInAt: new Date().toISOString(),
          })
        );
      }

      const studentUser: StudentUser = {
        userId,
        email,
        role: 'STUDENT',
        token,
      };

      set({
        user: studentUser,
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

    if (token && role === 'STUDENT' && userId) {
      set({
        user: {
          userId,
          email: '',
          role: 'STUDENT',
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
