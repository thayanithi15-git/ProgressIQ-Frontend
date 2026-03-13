import { create } from 'zustand';
import api from '@/utils/api';
import { useNotificationStore } from '@/utils/notification';

// ==========================================
// TYPES
// ==========================================

export interface MentorTask {
  id: string;
  _id?: string;        // alias so both id forms work
  title: string;
  description: string;
  assignedTo: string;  // student full name
  status: string;      // display status  (To Do / In Progress / Submitted / Done / Rejected)
  rawStatus: string;   // backend enum   (PENDING / IN_PROGRESS / SUBMITTED / APPROVED / REJECTED)
  dueDate: string;
  priority: string;
  student: {
    id: string;
    email: string;
    department: string;
    year: string;
  };
  submissionNote?: string | null;
  verificationNote?: string | null;
  pointsAwarded?: number;
  verifiedAt?: string | null;
  feedback?: string | null;
}

interface TasksState {
  // Data
  tasks: MentorTask[];
  taskDetail: MentorTask | null;

  // Filters
  searchQuery: string;
  statusFilter: string;
  departmentFilter: string;
  yearFilter: string;
  sortBy: 'title' | 'student' | 'status' | 'dueDate';
  sortOrder: 'asc' | 'desc';

  // Pagination
  page: number;
  limit: number;
  total: number;
  totalPages: number;

  // Loading
  isLoading: boolean;
  isLoadingDetail: boolean;
  isSubmitting: boolean;

  // Actions
  fetchTasks: () => Promise<void>;
  fetchTaskDetail: (id: string) => Promise<void>;
  createTask: (title: string, description: string, dueDate: string, studentIds: string[]) => Promise<void>;
  updateTask: (id: string, data: any) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  verifyTask: (id: string, status: 'APPROVED' | 'REJECTED', verificationNote: string, points: number) => Promise<void>;
  notifyStudents: (id: string, message: string) => Promise<void>;

  // UI
  setSearchQuery: (query: string) => void;
  setStatusFilter: (status: string) => void;
  setDepartmentFilter: (dept: string) => void;
  setYearFilter: (year: string) => void;
  setSortBy: (by: 'title' | 'student' | 'status' | 'dueDate') => void;
  setSortOrder: (order: 'asc' | 'desc') => void;
  setPage: (page: number) => void;
  resetFilters: () => void;
  closeDetail: () => void;
}

export const useMentorTasksStore = create<TasksState>((set, get) => ({
  tasks: [],
  taskDetail: null,

  searchQuery: '',
  statusFilter: '',
  departmentFilter: '',
  yearFilter: '',
  sortBy: 'dueDate',
  sortOrder: 'asc',

  page: 1,
  limit: 20,
  total: 0,
  totalPages: 0,

  isLoading: false,
  isLoadingDetail: false,
  isSubmitting: false,

  // ─── FETCH LIST ────────────────────────────────────────────
  fetchTasks: async () => {
    const { showNotification } = useNotificationStore.getState();
    const state = get();
    try {
      set({ isLoading: true });

      const params = new URLSearchParams({
        page:      state.page.toString(),
        limit:     state.limit.toString(),
        search:    state.searchQuery,
        sortBy:    state.sortBy,
        sortOrder: state.sortOrder,
        ...(state.statusFilter     && { status:     state.statusFilter }),
        ...(state.departmentFilter && { department: state.departmentFilter }),
        ...(state.yearFilter       && { year:        state.yearFilter }),
      });

      const res = await api.get(`/api/mentor/tasks?${params}`);
      if (res.data.success) {
        set({
          tasks:      res.data.data,
          total:      res.data.pagination?.total      || 0,
          totalPages: res.data.pagination?.totalPages || 0,
        });
      }
    } catch (error: any) {
      showNotification(error.response?.data?.message || 'Failed to fetch tasks', 'error');
    } finally {
      set({ isLoading: false });
    }
  },

  // ─── FETCH DETAIL ──────────────────────────────────────────
  fetchTaskDetail: async (id) => {
    const { showNotification } = useNotificationStore.getState();
    try {
      set({ isLoadingDetail: true });
      const res = await api.get(`/api/mentor/tasks/${id}`);
      if (res.data.success) set({ taskDetail: res.data.data });
    } catch (error: any) {
      showNotification(error.response?.data?.message || 'Failed to fetch task details', 'error');
    } finally {
      set({ isLoadingDetail: false });
    }
  },

  // ─── CREATE ────────────────────────────────────────────────
  createTask: async (title, description, dueDate, studentIds) => {
    const { showNotification } = useNotificationStore.getState();
    try {
      set({ isSubmitting: true });
      const res = await api.post('/api/mentor/tasks/assign', { title, description, dueDate, studentIds });
      if (res.data.success) {
        showNotification('Task assigned successfully', 'success');
        get().fetchTasks();
      }
    } catch (error: any) {
      showNotification(error.response?.data?.message || 'Failed to create task', 'error');
    } finally {
      set({ isSubmitting: false });
    }
  },

  // ─── UPDATE ────────────────────────────────────────────────
  updateTask: async (id, data) => {
    const { showNotification } = useNotificationStore.getState();
    try {
      set({ isSubmitting: true });
      const res = await api.put(`/api/mentor/tasks/${id}`, data);
      if (res.data.success) {
        showNotification('Task updated successfully', 'success');
        get().fetchTasks();
      }
    } catch (error: any) {
      showNotification(error.response?.data?.message || 'Failed to update task', 'error');
    } finally {
      set({ isSubmitting: false });
    }
  },

  // ─── DELETE ────────────────────────────────────────────────
  deleteTask: async (id) => {
    const { showNotification } = useNotificationStore.getState();
    try {
      set({ isSubmitting: true });
      const res = await api.delete(`/api/mentor/tasks/${id}`);
      if (res.data.success) {
        showNotification('Task deleted', 'success');
        get().fetchTasks();
        if (get().taskDetail?.id === id) set({ taskDetail: null });
      }
    } catch (error: any) {
      showNotification(error.response?.data?.message || 'Failed to delete task', 'error');
    } finally {
      set({ isSubmitting: false });
    }
  },

  // ─── VERIFY ────────────────────────────────────────────────
  verifyTask: async (id, status, verificationNote, points) => {
    const { showNotification } = useNotificationStore.getState();
    try {
      set({ isSubmitting: true });
      const res = await api.put(`/api/mentor/tasks/${id}/verify`, { status, verificationNote, points });
      if (res.data.success) {
        showNotification(`Task ${status === 'APPROVED' ? 'approved' : 'rejected'} successfully`, 'success');
        get().fetchTasks();
        if (get().taskDetail?.id === id) get().fetchTaskDetail(id);
      }
    } catch (error: any) {
      showNotification(error.response?.data?.message || 'Failed to verify task', 'error');
    } finally {
      set({ isSubmitting: false });
    }
  },

  // ─── NOTIFY ────────────────────────────────────────────────
  notifyStudents: async (id, message) => {
    const { showNotification } = useNotificationStore.getState();
    try {
      set({ isSubmitting: true });
      const res = await api.post('/api/mentor/notify', { type: 'TASK', entityId: id, message });
      if (res.data.success) {
        showNotification(res.data.message || 'Students notified', 'success');
      }
    } catch (error: any) {
      showNotification(error.response?.data?.message || 'Failed to notify', 'error');
    } finally {
      set({ isSubmitting: false });
    }
  },

  // ─── UI / FILTERS ──────────────────────────────────────────
  setSearchQuery: (query) => { set({ searchQuery: query, page: 1 }); get().fetchTasks(); },
  setStatusFilter: (status) => { set({ statusFilter: status, page: 1 }); get().fetchTasks(); },
  setDepartmentFilter: (dept) => { set({ departmentFilter: dept, page: 1 }); get().fetchTasks(); },
  setYearFilter: (year) => { set({ yearFilter: year, page: 1 }); get().fetchTasks(); },
  setSortBy: (by) => { set({ sortBy: by, page: 1 }); get().fetchTasks(); },
  setSortOrder: (order) => { set({ sortOrder: order, page: 1 }); get().fetchTasks(); },
  setPage: (page) => { set({ page }); get().fetchTasks(); },

  resetFilters: () => {
    set({ searchQuery:'', statusFilter:'', departmentFilter:'', yearFilter:'', sortBy:'dueDate', sortOrder:'asc', page:1 });
    get().fetchTasks();
  },

  closeDetail: () => set({ taskDetail: null }),
}));