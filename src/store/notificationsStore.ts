import { create } from 'zustand';
import api from '@/utils/api';
import { useNotificationStore as useToastStore } from '@/utils/notification';

export interface AppNotification {
  _id: string;
  userId: string;
  title?: string;
  message: string;
  type: 'INFO' | 'WARNING' | 'SUCCESS' | 'ERROR' | 'TASK' | 'PROJECT' | 'SURVEY' | 'POINTS';
  link?: string;
  read: boolean;
  createdAt: string;
}

interface NotificationsState {
  notifications: AppNotification[];
  unreadCount: number;
  isLoading: boolean;
  
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

export const useAppNotificationsStore = create<NotificationsState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,

  fetchNotifications: async () => {
    try {
      set({ isLoading: true });
      const res = await api.get('/api/notifications');
      if (res.data?.notifications) {
        const notifs = res.data.notifications;
        set({
          notifications: notifs,
          unreadCount: notifs.filter((n: AppNotification) => !n.read).length
        });
      }
    } catch (error) {
      console.error('Failed to fetch notifications', error);
    } finally {
      set({ isLoading: false });
    }
  },

  markAsRead: async (id: string) => {
    try {
      await api.post(`/api/notifications/${id}/read`);
      const { notifications } = get();
      const updated = notifications.map(n => n._id === id ? { ...n, read: true } : n);
      set({ 
        notifications: updated,
        unreadCount: updated.filter(n => !n.read).length
      });
    } catch (error) {
      console.error('Failed to mark notification as read', error);
    }
  },

  markAllAsRead: async () => {
    try {
      const { notifications } = get();
      const unreadIds = notifications.filter(n => !n.read).map(n => n._id);
      if (unreadIds.length === 0) return;

      // Optimistic update
      const updated = notifications.map(n => ({ ...n, read: true }));
      set({ notifications: updated, unreadCount: 0 });

      // In a real app we would have a backend route for markAllRead.
      // For now, we hit the individual endpoint concurrently.
      await Promise.all(unreadIds.map(id => api.post(`/api/notifications/${id}/read`).catch(() => null)));
    } catch (error) {
      console.error('Failed to mark all as read', error);
      get().fetchNotifications(); // revert on fail
    }
  }
}));
