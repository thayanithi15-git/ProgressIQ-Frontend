import { create } from 'zustand';
import api from '@/utils/api';
import { useNotificationStore } from '@/utils/notification';

export interface ProjectItem {
  _id: string;
  title: string;
  description?: string;
  githubLink?: string;
  websiteLink?: string;
  completedAt?: string | null;
  status?: string;
  studentId?: any;
  mentorId?: any;
}

interface ProjectsState {
  projects: ProjectItem[];
  total: number;
  page: number;
  limit: number;
  isLoading: boolean;
  filters: {
    search?: string;
    status?: string;
    from?: string;
    to?: string;
    sort?: string;
  };
  fetchProjects: (opts?: Partial<{ page:number; limit:number; filters:any }>) => Promise<void>;
  fetchProjectById: (id: string) => Promise<ProjectItem | null>;
  setPage: (p: number) => void;
  setLimit: (l: number) => void;
  setFilters: (f: any) => void;
}

export const useAdminProjectsStore = create<ProjectsState>((set, get) => ({
  projects: [],
  total: 0,
  page: 1,
  limit: 10,
  isLoading: false,
  filters: {},

  fetchProjects: async (opts) => {
    const { showNotification } = useNotificationStore.getState();
    const page = opts?.page ?? get().page;
    const limit = opts?.limit ?? get().limit;
    const filters = { ...(get().filters || {}), ...(opts?.filters || {}) };

    try {
      set({ isLoading: true });
      const params: any = { page, limit };
      if (filters.search) params.search = filters.search;
      if (filters.status) params.status = filters.status;
      if (filters.from) params.from = filters.from;
      if (filters.to) params.to = filters.to;
      if (filters.sort) params.sort = filters.sort;

      const res = await api.get('/api/admin/projects', { params });
      set({ projects: res.data.projects || [], total: res.data.total || 0, page, limit, filters });
    } catch (err: any) {
      showNotification(err.response?.data?.message || 'Failed to load projects', 'error');
    } finally {
      set({ isLoading: false });
    }
  },

  fetchProjectById: async (id) => {
    const { showNotification } = useNotificationStore.getState();
    try {
      const res = await api.get(`/api/admin/projects/${id}`);
      return res.data.project || null;
    } catch (err: any) {
      showNotification(err.response?.data?.message || 'Failed to load project', 'error');
      return null;
    }
  },

  setPage: (p) => set({ page: p }),
  setLimit: (l) => set({ limit: l }),
  setFilters: (f) => set({ filters: { ...(get().filters || {}), ...f } }),
}));
