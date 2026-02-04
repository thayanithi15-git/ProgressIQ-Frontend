import { create } from 'zustand';
import api from '@/components/utils/api';
import { useNotificationStore } from '@/components/notify/notification';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Engineer' | 'Operator' | 'user';
  status: 'active' | 'inactive';
  createdAt?: string;
  updatedAt?: string;
  lastLogin?: string;
  verified?: boolean;
  [key: string]: any; // allow extra fields from backend
} 

export interface FetchUsersParams {
  role?: 'all' | 'Admin' | 'Engineer' | 'Operator' | 'user';
  status?: 'active' | 'inactive' | 'all';
  searchname?: string;
}

export interface AddUserParams {
  email: string;
  name: string;
  role: 'Admin' | 'Engineer' | 'Operator' | 'user';
}

export interface SendActivationEmailParams {
  email: string;
}

interface UserManagementState {
  // State
  users: User[];
  unverifiedUsers: User[];
  isLoading: boolean;
  isAddingUser: boolean;
  isDeletingUser: boolean;
  isSendingEmail: boolean;
  isFetchingUnverified: boolean;
  error: string | null;

  // Actions
  fetchAllUsers: (params?: FetchUsersParams) => Promise<void>;
  addUser: (userData: AddUserParams) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  getUnverifiedUsers: () => Promise<void>;
  sendAccountActivationMail: (params: SendActivationEmailParams) => Promise<void>;
  clearError: () => void;
  clearUsers: () => void;
}

export const useUserManagementStore = create<UserManagementState>((set, get) => ({
  // Initial State
  users: [],
  unverifiedUsers: [],
  isLoading: false,
  isAddingUser: false,
  isDeletingUser: false,
  isSendingEmail: false,
  isFetchingUnverified: false,
  error: null,

  // Fetch All Users
  fetchAllUsers: async (params = {}) => {
    set({ isLoading: true, error: null });
    const { showNotification } = useNotificationStore.getState() as { 
      showNotification: (message: string, type: string) => void 
    };

    try {
      const requestBody = {
        role: params.role?.toLowerCase() || 'all',
        status: params.status || 'active',
        searchname: params.searchname || ''
      };

      const response = await api.post<{ users: User[] }>('/admin/allUsers', requestBody);
      
      set({ 
        users: response.data.users || response.data || [], 
        isLoading: false 
      });
      
      showNotification('Users fetched successfully', 'success');
    } catch (error: any) {
      let errorMessage = 'Failed to fetch users';

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      set({ error: errorMessage, isLoading: false, users: [] });
      showNotification(errorMessage, 'error');
    }
  },

  // Add User
  addUser: async (userData: AddUserParams) => {
    set({ isAddingUser: true, error: null });
    const { showNotification } = useNotificationStore.getState() as { 
      showNotification: (message: string, type: string) => void 
    };

    try {
      const response = await api.post<User>('/admin/addUser', userData);
      
      // Add new user to existing users list
      set((state) => ({
        users: [response.data, ...state.users],
        isAddingUser: false
      }));
      
      showNotification('User added successfully', 'success');
      
      // Optionally refresh the users list
      get().fetchAllUsers();
    } catch (error: any) {
      let errorMessage = 'Failed to add user';

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      set({ error: errorMessage, isAddingUser: false });
      showNotification(errorMessage, 'error');
    }
  },

  // Delete User
  deleteUser: async (userId: string) => {
    set({ isDeletingUser: true, error: null });
    const { showNotification } = useNotificationStore.getState() as { 
      showNotification: (message: string, type: string) => void 
    };

    try {
      await api.delete(`/admin/deleteUser/${userId}`);
      
      // Remove user from the list
      set((state) => ({
        users: state.users.filter(user => user.id !== userId),
        isDeletingUser: false
      }));
      
      get().fetchAllUsers();
      
      showNotification('User deleted successfully', 'success');
    } catch (error: any) {
      let errorMessage = 'Failed to delete user';

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      set({ error: errorMessage, isDeletingUser: false });
      showNotification(errorMessage, 'error');
    }
  },

  // Get Unverified Users
  getUnverifiedUsers: async () => {
    set({ isFetchingUnverified: true, error: null });
    const { showNotification } = useNotificationStore.getState() as { 
      showNotification: (message: string, type: string) => void 
    };

    try {
      const response = await api.get<{ users: User[] }>('/admin/notVerifiedUsers');
      
      set({ 
        users: response.data.users || response.data || [], 
        isFetchingUnverified: false 
      });
      
      showNotification('Unverified users fetched successfully', 'success');
    } catch (error: any) {
      let errorMessage = 'Failed to fetch unverified users';

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      set({ error: errorMessage, isFetchingUnverified: false, unverifiedUsers: [] });
      showNotification(errorMessage, 'error');
    }
  },

  // Send Account Activation Mail Again
  sendAccountActivationMail: async (params: SendActivationEmailParams) => {
    set({ isSendingEmail: true, error: null });
    const { showNotification } = useNotificationStore.getState() as { 
      showNotification: (message: string, type: string) => void 
    };

    try {
      await api.post('/admin/sendAccountActivationMailAgain', params);
      
      set({ isSendingEmail: false });
      showNotification('Activation email sent successfully', 'success');
    } catch (error: any) {
      let errorMessage = 'Failed to send activation email';

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      set({ error: errorMessage, isSendingEmail: false });
      showNotification(errorMessage, 'error');
    }
  },

  // Clear Error
  clearError: () => {
    set({ error: null });
  },

  // Clear Users
  clearUsers: () => {
    set({ users: [], unverifiedUsers: [], error: null });
  },
}));