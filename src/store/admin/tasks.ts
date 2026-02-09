import { create } from "zustand";
import api from "@/utils/api";
import { useNotificationStore } from "@/utils/notification";

export interface TaskItem {
  _id: string;
  title: string;
  description?: string;
  dueDate?: string;
  completedAt?: string;
  status?: string;

  studentId?: {
    _id: string;
    name: string;
    email: string;
  } | null;

  mentorId?: {
    _id: string;
    name: string;
    email: string;
    department?: string;
  } | null;
}

interface TaskFilters {
  search?: string;
  status?: string;
  from?: string;
  to?: string;
}

interface TasksState {
  // data
  tasks: TaskItem[];
  total: number;

  // pagination
  page: number;
  limit: number;

  // ui state
  isLoading: boolean;

  // filters
  filters: TaskFilters;
  sort?: string;

  // actions
  setFilters: (filters: Partial<TaskFilters>) => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setSort: (sort: string) => void;

  fetchTasks: (opts?: Partial<{
    page: number;
    limit: number;
    filters: TaskFilters;
    sort: string;
  }>) => Promise<void>;

  reset: () => void;
}

export const useAdminTasksStore = create<TasksState>((set, get) => ({

  // ───────── STATE ─────────
  tasks: [],
  total: 0,

  page: 1,
  limit: 10,

  isLoading: false,

  filters: {},
  sort: "createdAt:desc",

  // ───────── ACTIONS ─────────

  setFilters: (newFilters) => {
    set({
      filters: {
        ...get().filters,
        ...newFilters,
      },
      page: 1, // reset to first page on filter change
    });
  },

  setPage: (page) => set({ page }),

  setLimit: (limit) => set({ limit, page: 1 }),

  setSort: (sort) => set({ sort, page: 1 }),

  // ───────── FETCH ─────────

  fetchTasks: async (opts) => {
    const { showNotification } = useNotificationStore.getState();

    const page = opts?.page ?? get().page;
    const limit = opts?.limit ?? get().limit;
    const sort = opts?.sort ?? get().sort;

    const filters = {
      ...(get().filters || {}),
      ...(opts?.filters || {}),
    };

    try {
      set({ isLoading: true });

      const params: any = {
        page,
        limit,
        sort,
      };

      // Apply filters
      if (filters.search) params.search = filters.search;
      if (filters.status) params.status = filters.status;
      if (filters.from) params.from = filters.from;
      if (filters.to) params.to = filters.to;

      const res = await api.get("/api/admin/tasks", { params });

      set({
        tasks: res.data.tasks || [],
        total: res.data.total || 0,
        page,
        limit,
        filters,
        sort,
      });

    } catch (err: any) {
      showNotification(
        err.response?.data?.message || "Failed to load tasks",
        "error"
      );
    } finally {
      set({ isLoading: false });
    }
  },

  // ───────── RESET ─────────

  reset: () => set({
    tasks: [],
    total: 0,
    page: 1,
    limit: 10,
    filters: {},
    sort: "createdAt:desc",
  }),
}));
