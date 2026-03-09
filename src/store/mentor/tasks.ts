import { create } from 'zustand';
import api from '@/utils/api';
import { useNotificationStore } from '@/utils/notification';

export interface MentorTask {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  status: string;
  dueDate: string;
  priority: string;
  student: {
    id: string;
    email: string;
    department: string;
    year: string;
  };
  feedback?: string;
}

export interface TaskDetail extends MentorTask {
  completedAt?: string;
}

interface TasksState {
  // Data
  tasks: MentorTask[];
  taskDetail: TaskDetail | null;

  // Filters
  searchQuery: string;
  statusFilter: string;
  departmentFilter: string;
  yearFilter: string;
  priorityFilter: string;
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
  setSearchQuery: (query: string) => void;
  setStatusFilter: (status: string) => void;
  setDepartmentFilter: (dept: string) => void;
  setYearFilter: (year: string) => void;
  setPriorityFilter: (priority: string) => void;
  setSortBy: (by: 'title' | 'student' | 'status' | 'dueDate') => void;
  setSortOrder: (order: 'asc' | 'desc') => void;
  setPage: (page: number) => void;
  resetFilters: () => void;
  closeDetail: () => void;
}

export const useMentorTasksStore = create<TasksState>((set, get) => ({
  // Initial States
  tasks: [],
  taskDetail: null,

  searchQuery: '',
  statusFilter: '',
  departmentFilter: '',
  yearFilter: '',
  priorityFilter: '',
  sortBy: 'dueDate',
  sortOrder: 'asc',

  page: 1,
  limit: 20,
  total: 0,
  totalPages: 0,

  isLoading: false,
  isLoadingDetail: false,
  isSubmitting: false,

  // =====================================
  // FETCH TASKS
  // =====================================
  fetchTasks: async () => {
    const { showNotification } = useNotificationStore.getState();
    const state = get();

    try {
      set({ isLoading: true });

      const params = new URLSearchParams({
        page: state.page.toString(),
        limit: state.limit.toString(),
        search: state.searchQuery,
        ...(state.statusFilter && { status: state.statusFilter }),
        ...(state.departmentFilter && { department: state.departmentFilter }),
        ...(state.yearFilter && { year: state.yearFilter }),
        sortBy: state.sortBy,
        sortOrder: state.sortOrder,
      });

      const response = await api.get(`/api/mentor/tasks?${params}`);

      if (response.data.success) {
        set({
          tasks: response.data.data,
          total: response.data.pagination?.total || 0,
          totalPages: response.data.pagination?.totalPages || 0,
        });
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch tasks';
      showNotification(message, 'error');
      console.error('Error fetching tasks:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  // =====================================
  // FETCH TASK DETAIL
  // =====================================
  fetchTaskDetail: async (id: string) => {
    const { showNotification } = useNotificationStore.getState();

    try {
      set({ isLoadingDetail: true });

      const response = await api.get(`/api/mentor/tasks/${id}`);

      if (response.data.success) {
        set({ taskDetail: response.data.data });
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch task details';
      showNotification(message, 'error');
      console.error('Error fetching task detail:', error);
    } finally {
      set({ isLoadingDetail: false });
    }
  },

  // =====================================
  // CREATE TASK
  // =====================================
  createTask: async (title: string, description: string, dueDate: string, studentIds: string[]) => {
    const { showNotification } = useNotificationStore.getState();

    try {
      set({ isSubmitting: true });

      const response = await api.post('/api/mentor/tasks/assign', {
        title,
        description,
        dueDate,
        studentIds,
      });

      if (response.data.success) {
        showNotification('Task assigned successfully', 'success');
        get().fetchTasks();
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to create task';
      showNotification(message, 'error');
      console.error('Error creating task:', error);
    } finally {
      set({ isSubmitting: false });
    }
  },

  // =====================================
  // FILTER ACTIONS
  // =====================================
  setSearchQuery: (query: string) => {
    set({ searchQuery: query, page: 1 });
    get().fetchTasks();
  },

  setStatusFilter: (status: string) => {
    set({ statusFilter: status, page: 1 });
    get().fetchTasks();
  },

  setDepartmentFilter: (dept: string) => {
    set({ departmentFilter: dept, page: 1 });
    get().fetchTasks();
  },

  setYearFilter: (year: string) => {
    set({ yearFilter: year, page: 1 });
    get().fetchTasks();
  },

  setPriorityFilter: (priority: string) => {
    set({ priorityFilter: priority, page: 1 });
  },

  setSortBy: (by: 'title' | 'student' | 'status' | 'dueDate') => {
    set({ sortBy: by, page: 1 });
    get().fetchTasks();
  },

  setSortOrder: (order: 'asc' | 'desc') => {
    set({ sortOrder: order, page: 1 });
    get().fetchTasks();
  },

  setPage: (page: number) => {
    set({ page });
    get().fetchTasks();
  },

  // =====================================
  // RESET FILTERS
  // =====================================
  resetFilters: () => {
    set({
      searchQuery: '',
      statusFilter: '',
      departmentFilter: '',
      yearFilter: '',
      priorityFilter: '',
      sortBy: 'dueDate',
      sortOrder: 'asc',
      page: 1,
    });
    get().fetchTasks();
  },

  // =====================================
  // CLOSE DETAIL
  // =====================================
  closeDetail: () => {
    set({ taskDetail: null });
  },
}));