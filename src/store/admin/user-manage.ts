import api from '@/utils/api';
import { useNotificationStore } from '@/utils/notification';
import { create } from 'zustand';

export interface User {
  _id: string;
  role: 'ADMIN' | 'STUDENT' | 'MENTOR';
  email: string;
  isActive: boolean;
  createdAt: string;
  passwordHash?: string;
}

export interface StudentData extends User {
  userId?: string;
  firstName: string;
  lastName: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  dob: string;
  phone: string;
  parentName: string;
  parentPhone: string;
  place: string;
  department: string;
  year: string;
  academicYear: string;
  rewardPoints: number;
  status?: string;
}

export interface AdminData extends User {
  role: 'ADMIN';
}

export interface CreateStudentPayload {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  dob: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  department: string;
  academicYear: string;
  year: string;
  place: string;
  parentName: string;
  parentPhone: string;
  isActive: boolean;
  rewardPoints: number;
}

export interface CreateAdminPayload {
  email: string;
  password: string;
}

export interface UpdateUserPayload {
  email?: string;
  isActive?: boolean;
  firstName?: string;
  lastName?: string;
  phone?: string;
  dob?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  department?: string;
  academicYear?: string;
  year?: string;
  place?: string;
  parentName?: string;
  parentPhone?: string;
  rewardPoints?: number;
}

export interface UserFilters {
  role?: 'ADMIN' | 'STUDENT' | 'MENTOR';
  isActive?: boolean;
  searchEmail?: string;
}

interface UserManagementState {
  users: User[];
  total: number;
  isLoading: boolean;
  currentPage: number;
  pageSize: number;
  filters: UserFilters;
  editingUserId: string | null;

  // API Methods
  fetchUsers: (page: number, limit: number, filters?: UserFilters) => Promise<void>;
  createStudent: (data: CreateStudentPayload) => Promise<StudentData | null>;
  createAdmin: (data: CreateAdminPayload) => Promise<AdminData | null>;
  updateUser: (userId: string, data: UpdateUserPayload) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;

  // State Management
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setFilters: (filters: UserFilters) => void;
  setEditingUserId: (userId: string | null) => void;
  resetFilters: () => void;
}

const initialFilters: UserFilters = {
  role: undefined,
  isActive: undefined,
  searchEmail: '',
};

export const useUserManagementStore = create<UserManagementState>((set, get) => ({
  users: [],
  total: 0,
  isLoading: false,
  currentPage: 1,
  pageSize: 10,
  filters: initialFilters,
  editingUserId: null,

  fetchUsers: async (page: number, limit: number, filters?: UserFilters) => {
    const { showNotification } = useNotificationStore.getState();

    try {
      set({ isLoading: true });

      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (filters?.role) {
        params.append('role', filters.role);
      }
      if (filters?.isActive !== undefined) {
        params.append('isActive', filters.isActive.toString());
      }
      if (filters?.searchEmail) {
        params.append('email', filters.searchEmail);
      }

      const response = await api.get(`/api/admin/users?${params.toString()}`);

      set({
        users: response.data.users || [],
        total: response.data.total || 0,
        currentPage: page,
        isLoading: false,
      });
    } catch (error: any) {
      set({ isLoading: false });
      const errorMessage = error.response?.data?.message || 'Failed to fetch users';
      showNotification(errorMessage, 'error');
      console.error('Fetch users error:', error);
    }
  },

  createStudent: async (data: CreateStudentPayload) => {
    const { showNotification } = useNotificationStore.getState();

    try {
      set({ isLoading: true });

      const response = await api.post('/api/admin/users/students', data);

      set({ isLoading: false });
      showNotification('Student created successfully!', 'success');

      const state = get();
      state.fetchUsers(state.currentPage, state.pageSize, state.filters);

      return response.data.student as StudentData;
    } catch (error: any) {
      set({ isLoading: false });
      const errorMessage = error.response?.data?.message || 'Failed to create student';
      showNotification(errorMessage, 'error');
      return null;
    }
  },

  createAdmin: async (data: CreateAdminPayload) => {
    const { showNotification } = useNotificationStore.getState();

    try {
      set({ isLoading: true });

      const response = await api.post('/api/admin/users/admins', data);

      set({ isLoading: false });
      showNotification('Admin created successfully!', 'success');

      const state = get();
      state.fetchUsers(state.currentPage, state.pageSize, state.filters);

      return response.data.user as AdminData;
    } catch (error: any) {
      set({ isLoading: false });
      const errorMessage = error.response?.data?.message || 'Failed to create admin';
      showNotification(errorMessage, 'error');
      return null;
    }
  },

  updateUser: async (userId: string, data: UpdateUserPayload) => {
    const { showNotification } = useNotificationStore.getState();

    try {
      set({ isLoading: true });

      await api.put(`/api/admin/users/${userId}`, data);

      set({ isLoading: false, editingUserId: null });
      showNotification('User updated successfully!', 'success');

      const state = get();
      state.fetchUsers(state.currentPage, state.pageSize, state.filters);
    } catch (error: any) {
      set({ isLoading: false });
      const errorMessage = error.response?.data?.message || 'Failed to update user';
      showNotification(errorMessage, 'error');
    }
  },

  deleteUser: async (userId: string) => {
    const { showNotification } = useNotificationStore.getState();

    try {
      set({ isLoading: true });

      await api.delete(`/api/admin/students/${userId}`);

      set({ isLoading: false });
      showNotification('User deleted successfully!', 'success');

      const state = get();
      state.fetchUsers(state.currentPage, state.pageSize, state.filters);
    } catch (error: any) {
      set({ isLoading: false });
      const errorMessage = error.response?.data?.message || 'Failed to delete user';
      showNotification(errorMessage, 'error');
    }
  },

  setCurrentPage: (page: number) => {
    const state = get();
    set({ currentPage: page });
    state.fetchUsers(page, state.pageSize, state.filters);
  },

  setPageSize: (size: number) => {
    const state = get();
    set({ pageSize: size, currentPage: 1 });
    state.fetchUsers(1, size, state.filters);
  },

  setFilters: (filters: UserFilters) => {
    set({ filters, currentPage: 1 });
    const state = get();
    state.fetchUsers(1, state.pageSize, filters);
  },

  setEditingUserId: (userId: string | null) => {
    set({ editingUserId: userId });
  },

  resetFilters: () => {
    set({ filters: initialFilters, currentPage: 1 });
    const state = get();
    state.fetchUsers(1, state.pageSize, initialFilters);
  },
}));