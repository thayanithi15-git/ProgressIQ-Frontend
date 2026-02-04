import { create } from 'zustand';
import api from '@/components/utils/api';
import { useNotificationStore } from '@/components/notify/notification';

interface SetPasswordErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  [key: string]: string | undefined;
}

interface SetPasswordStore {
  isLoading: boolean;
  email: string;
  password: string;
  confirmPassword: string;
  token: string | null;
  errors: SetPasswordErrors;
  successMessage: string;

  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setConfirmPassword: (confirmPassword: string) => void;
  setToken: (token: string | null) => void;
  setErrors: (errors: SetPasswordErrors) => void;
  setSuccessMessage: (message: string) => void;
  setLoading: (loading: boolean) => void;

  clearForm: () => void;
  validateEmail: (email: string) => boolean;
  validateResetForm: () => boolean;
  handleSetPassword: (token: string, password: string) => Promise<boolean>;
  extractEmailFromToken: (token: string) => string;
}

export const useSetPasswordStore = create<SetPasswordStore>((set, get) => ({
  isLoading: false,
  email: '',
  password: '',
  confirmPassword: '',
  token: null,
  errors: {},
  successMessage: '',

  setEmail: (email) => set({ email }),
  setPassword: (password) => set({ password }),
  setConfirmPassword: (confirmPassword) => set({ confirmPassword }),
  setToken: (token) => set({ token }),
  setErrors: (errors) => set({ errors }),
  setSuccessMessage: (message) => set({ successMessage: message }),
  setLoading: (loading) => set({ isLoading: loading }),

  clearForm: () =>
    set({
      email: '',
      password: '',
      confirmPassword: '',
      errors: {},
      successMessage: '',
    }),

  validateEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  validateResetForm: () => {
    const { email, password, confirmPassword, token } = get();
    const errors: SetPasswordErrors = {};

    if (!token) {
      if (!email.trim()) {
        errors.email = 'Email is required';
      } else if (!get().validateEmail(email)) {
        errors.email = 'Please enter a valid email address';
      }
    } else {
      if (!password.trim()) {
        errors.password = 'New password is required';
      } else if (password.length < 8) {
        errors.password = 'Password must be at least 6 characters long';
      }

      if (!confirmPassword.trim()) {
        errors.confirmPassword = 'Please confirm your password';
      } else if (password !== confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
    }

    set({ errors });
    return Object.keys(errors).length === 0;
  },

  handleSetPassword: async (token, password) => {
    set({ isLoading: true, errors: {}, successMessage: '' });
    const { showNotification } = useNotificationStore.getState() as { showNotification: (message: string, type: string) => void };

    try {
      const response = await api.post('/auth/set-password', {
        token,
        password,
      });

      if (response) {
        set({
          successMessage:
            'Password has been reset successfully! You can now sign in with your new password.',
          isLoading: false,
        });
        const message =
          typeof response === 'string'
            ? response
            : response.data?.message ||
              'Password has been set successfully! You can now sign in.';
        showNotification(message, 'success');
        return true;
      }
      return false;
    } catch (error: any) {
      set({ isLoading: false });

      let errorMessage = 'Failed to reset password. Please try again.';

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }

      showNotification(errorMessage, 'error');
      return false;
    }
  },

  extractEmailFromToken: (token) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.email || '';
    } catch (error) {
      console.error('Error decoding token:', error);
      return '';
    }
  },
}));
