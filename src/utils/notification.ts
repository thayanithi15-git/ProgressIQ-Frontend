import { create } from 'zustand';

export type NotificationType = 'success' | 'error' | 'pending' | 'info' | 'warning';

interface NotificationState {
  open: boolean;
  content: string;
  type: NotificationType;
  showNotification: (content: string, type?: NotificationType) => void;
  hideNotification: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  open: false,
  content: '',
  type: 'info',

  showNotification: (content: string, type: NotificationType = 'info') => {
    set({ open: true, content, type });
  },

  hideNotification: () => {
    set({ open: false });
  },
}));