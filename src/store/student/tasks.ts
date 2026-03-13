import { create } from 'zustand';
import api from '@/utils/api';
import { useNotificationStore } from '@/utils/notification';
import { getStoredMentorId } from '@/utils/mentorSession';

// ==========================================
// TYPES
// ==========================================

export interface Task {
  _id: string;
  studentId: string;
  mentorId: {
    _id: string;
    firstName: string;
    lastName: string;
  } | string;
  title: string;
  description: string;
  dueDate: string;
  completedAt?: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';
  feedback?: string | null;
  isOverdue?: boolean;
  submissionNote?: string;
  verificationNote?: string;
  pointsAwarded?: number;
  verifiedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskPayload {
  mentorId?: string;
  title: string;
  description: string;
  dueDate: string;
}

export interface UpdateTaskPayload extends Partial<CreateTaskPayload> {}

export interface TaskFeedback {
  id: string;
  mentor: string;
  mentorEmail: string;
  message: string;
  createdAt: string;
  type: string;
}

export type TaskStatusFilter = 'ALL' | 'PENDING' | 'IN_PROGRESS' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';

interface Pagination {
  total: number;
  limit: number;
  skip: number;
}

// ==========================================
// STORE
// ==========================================

interface TasksState {
  tasks: Task[];
  selectedTask: Task | null;
  selectedFeedback: TaskFeedback | null;
  pagination: Pagination;
  statusFilter: TaskStatusFilter;
  searchQuery: string;
  isLoading: boolean;
  isSubmitting: boolean;
  isModalOpen: boolean;
  isCompleteModalOpen: boolean;
  isFeedbackModalOpen: boolean;
  editingTask: Task | null;
  completingTaskId: string | null;

  // Actions
  fetchTasks: (status?: TaskStatusFilter) => Promise<void>;
  fetchTaskById: (id: string) => Promise<void>;
  createTask: (payload: CreateTaskPayload) => Promise<boolean>;
  updateTask: (id: string, payload: UpdateTaskPayload) => Promise<boolean>;
  deleteTask: (id: string) => Promise<boolean>;
  startTask: (id: string) => Promise<boolean>;
  submitTask: (id: string, completedAt?: string, submissionNote?: string) => Promise<boolean>;
  fetchFeedback: (id: string) => Promise<void>;

  // UI
  setStatusFilter: (filter: TaskStatusFilter) => void;
  setSearchQuery: (q: string) => void;
  setPage: (skip: number) => void;
  openCreateModal: () => void;
  openEditModal: (task: Task) => void;
  closeModal: () => void;
  openCompleteModal: (id: string) => void;
  closeCompleteModal: () => void;
  openFeedbackModal: (id: string) => Promise<void>;
  closeFeedbackModal: () => void;
}

export const useTasksStore = create<TasksState>((set, get) => ({
  tasks: [],
  selectedTask: null,
  selectedFeedback: null,
  pagination: { total: 0, limit: 10, skip: 0 },
  statusFilter: 'ALL',
  searchQuery: '',
  isLoading: false,
  isSubmitting: false,
  isModalOpen: false,
  isCompleteModalOpen: false,
  isFeedbackModalOpen: false,
  editingTask: null,
  completingTaskId: null,

  fetchTasks: async (status?) => {
    const { showNotification } = useNotificationStore.getState();
    const { pagination, statusFilter } = get();
    const activeFilter = status ?? statusFilter;

    try {
      set({ isLoading: true });

      const params = new URLSearchParams({
        limit: String(pagination.limit),
        skip: String(pagination.skip),
      });
      if (activeFilter !== 'ALL') params.append('status', activeFilter);

      const res = await api.get(`/api/student/tasks?${params}`);
      if (res.data.success) {
        set({
          tasks: res.data.data.tasks,
          pagination: { ...pagination, total: res.data.data.pagination.total },
        });
      }
    } catch (error: any) {
      showNotification(error.response?.data?.message || 'Failed to fetch tasks', 'error');
    } finally {
      set({ isLoading: false });
    }
  },

  fetchTaskById: async (id) => {
    const { showNotification } = useNotificationStore.getState();
    try {
      const res = await api.get(`/api/student/tasks/${id}`);
      if (res.data.success) set({ selectedTask: res.data.data });
    } catch (error: any) {
      showNotification(error.response?.data?.message || 'Failed to fetch task', 'error');
    }
  },

  createTask: async (payload) => {
    const { showNotification } = useNotificationStore.getState();
    try {
      const mentorId = getStoredMentorId();
      if (!mentorId) {
        showNotification('No mentor assigned. Please contact admin.', 'error');
        return false;
      }
      set({ isSubmitting: true });
      const res = await api.post('/api/student/tasks', { ...payload, mentorId });
      if (res.data.success) {
        showNotification('Task created successfully', 'success');
        get().fetchTasks();
        set({ isModalOpen: false, editingTask: null });
        return true;
      }
      return false;
    } catch (error: any) {
      showNotification(error.response?.data?.message || 'Failed to create task', 'error');
      return false;
    } finally {
      set({ isSubmitting: false });
    }
  },

  updateTask: async (id, payload) => {
    const { showNotification } = useNotificationStore.getState();
    try {
      set({ isSubmitting: true });
      const res = await api.put(`/api/student/tasks/${id}`, payload);
      if (res.data.success) {
        showNotification('Task updated successfully', 'success');
        get().fetchTasks();
        set({ isModalOpen: false, editingTask: null });
        return true;
      }
      return false;
    } catch (error: any) {
      showNotification(error.response?.data?.message || 'Failed to update task', 'error');
      return false;
    } finally {
      set({ isSubmitting: false });
    }
  },

  deleteTask: async (id) => {
    const { showNotification } = useNotificationStore.getState();
    try {
      const res = await api.delete(`/api/student/tasks/${id}`);
      if (res.data.success) {
        showNotification('Task deleted', 'success');
        get().fetchTasks();
        return true;
      }
      return false;
    } catch (error: any) {
      showNotification(error.response?.data?.message || 'Failed to delete task', 'error');
      return false;
    }
  },

  startTask: async (id) => {
    const { showNotification } = useNotificationStore.getState();
    try {
      set({ isSubmitting: true });
      const res = await api.put(`/api/student/tasks/${id}/start`);
      if (res.data.success) {
        showNotification('Task started', 'success');
        get().fetchTasks();
        if (get().selectedTask?._id === id) {
          get().fetchTaskById(id);
        }
        return true;
      }
      return false;
    } catch (error: any) {
      showNotification(error.response?.data?.message || 'Failed to start task', 'error');
      return false;
    } finally {
      set({ isSubmitting: false });
    }
  },

  submitTask: async (id, completedAt, submissionNote) => {
    const { showNotification } = useNotificationStore.getState();
    try {
      set({ isSubmitting: true });
      const res = await api.put(`/api/student/tasks/${id}/complete`, {
        completedAt: completedAt || new Date().toISOString(),
        submissionNote: submissionNote || ''
      });
      if (res.data.success) {
        showNotification('Task submitted for review', 'success');
        get().fetchTasks();
        set({ isCompleteModalOpen: false, completingTaskId: null });
        if (get().selectedTask?._id === id) {
          get().fetchTaskById(id);
        }
        return true;
      }
      return false;
    } catch (error: any) {
      showNotification(error.response?.data?.message || 'Failed to submit task', 'error');
      return false;
    } finally {
      set({ isSubmitting: false });
    }
  },

  fetchFeedback: async (id) => {
    const { showNotification } = useNotificationStore.getState();
    try {
      const res = await api.get(`/api/student/tasks/${id}/feedback`);
      if (res.data.success) set({ selectedFeedback: res.data.data });
    } catch (error: any) {
      showNotification(error.response?.data?.message || 'No feedback found', 'error');
    }
  },

  setStatusFilter: (filter) => {
    set({ statusFilter: filter, pagination: { ...get().pagination, skip: 0 } });
    get().fetchTasks(filter);
  },

  setSearchQuery: (q) => set({ searchQuery: q }),

  setPage: (skip) => {
    set({ pagination: { ...get().pagination, skip } });
    get().fetchTasks();
  },

  openCreateModal: () => set({ isModalOpen: true, editingTask: null }),

  openEditModal: (task) => set({ isModalOpen: true, editingTask: task }),

  closeModal: () => set({ isModalOpen: false, editingTask: null }),

  openCompleteModal: (id) => set({ isCompleteModalOpen: true, completingTaskId: id }),

  closeCompleteModal: () => set({ isCompleteModalOpen: false, completingTaskId: null }),

  openFeedbackModal: async (id) => {
    await get().fetchFeedback(id);
    set({ isFeedbackModalOpen: true });
  },

  closeFeedbackModal: () => set({ isFeedbackModalOpen: false, selectedFeedback: null }),
}));
