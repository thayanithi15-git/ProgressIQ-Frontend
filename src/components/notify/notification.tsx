import { create } from 'zustand';

// NotificationType = 'success' | 'error' | 'pending' | 'info' | 'warning';

export const useNotificationStore = create((set) => ({
  open: false,
  content: '',
  type: 'info',

  showNotification: (content, type = 'info') => {
    set({ open: true, content, type });
  },

  hideNotification: () => {
    set({ open: false });
  },
}));