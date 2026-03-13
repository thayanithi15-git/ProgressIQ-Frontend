import { create } from "zustand";
import api from "@/utils/api";

export interface SystemLog {
  _id: string;
  userId: string;
  name: string;
  email: string;
  role: string;
  action: string;
  createdAt: string;
}

interface SystemLogState {
  logs: SystemLog[];
  total: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  isLoading: boolean;
  filters: {
    role?: string;
  };
  fetchLogs: (page?: number, limit?: number) => Promise<void>;
  setPageSize: (size: number) => void;
  setFilters: (filters: { role?: string }) => void;
  resetFilters: () => void;
}

export const useSystemLogStore = create<SystemLogState>((set, get) => ({
  logs: [],
  total: 0,
  currentPage: 1,
  totalPages: 1,
  pageSize: 10,
  isLoading: false,
  filters: {},

  fetchLogs: async (page = get().currentPage, limit = get().pageSize) => {
    set({ isLoading: true });
    try {
      const { filters } = get();
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(filters.role && filters.role !== "all" && { role: filters.role }),
      });

      const response = await api.get(`/api/admin/system-logs?${params}`);
      
      set({
        logs: response.data.logs || [],
        total: response.data.total || 0,
        currentPage: response.data.page || page,
        totalPages: response.data.totalPages || 1,
        isLoading: false,
      });
    } catch (error) {
      console.error("Failed to fetch system logs:", error);
      set({ isLoading: false });
    }
  },

  setPageSize: (size) => {
    set({ pageSize: size, currentPage: 1 });
    get().fetchLogs(1, size);
  },

  setFilters: (filters) => {
    set({ filters, currentPage: 1 });
    get().fetchLogs(1, get().pageSize);
  },

  resetFilters: () => {
    set({ filters: {}, currentPage: 1 });
    get().fetchLogs(1, get().pageSize);
  },
}));
