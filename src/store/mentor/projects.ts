import { create } from 'zustand';
import api from '@/utils/api';
import { useNotificationStore } from '@/utils/notification';

export interface MentorProject {
  id: string;
  title: string;
  description: string;
  status: string;
  studentsCount: number;
  completionRate: number;
  createdDate: string;
  student: {
    id: string;
    name: string;
    email: string;
    department: string;
    year: string;
  };
  links: {
    github?: string;
    website?: string;
  };
  feedback?: string;
}

export interface ProjectDetail extends MentorProject {
  githubLink?: string;
  websiteLink?: string;
  completedAt?: string;
}

interface ProjectsState {
  // Data
  projects: MentorProject[];
  projectDetail: ProjectDetail | null;

  // Filters
  searchQuery: string;
  statusFilter: string;
  departmentFilter: string;
  yearFilter: string;
  sortBy: 'title' | 'student' | 'status' | 'completedAt';
  sortOrder: 'asc' | 'desc';

  // Pagination
  page: number;
  limit: number;
  total: number;
  totalPages: number;

  // Loading
  isLoading: boolean;
  isLoadingDetail: boolean;

  // Actions
  fetchProjects: () => Promise<void>;
  fetchProjectDetail: (id: string) => Promise<void>;
  setSearchQuery: (query: string) => void;
  setStatusFilter: (status: string) => void;
  setDepartmentFilter: (dept: string) => void;
  setYearFilter: (year: string) => void;
  setSortBy: (by: 'title' | 'student' | 'status' | 'completedAt') => void;
  setSortOrder: (order: 'asc' | 'desc') => void;
  setPage: (page: number) => void;
  resetFilters: () => void;
  closeDetail: () => void;
}

export const useMentorProjectsStore = create<ProjectsState>((set, get) => ({
  // Initial States
  projects: [],
  projectDetail: null,

  searchQuery: '',
  statusFilter: '',
  departmentFilter: '',
  yearFilter: '',
  sortBy: 'completedAt',
  sortOrder: 'desc',

  page: 1,
  limit: 20,
  total: 0,
  totalPages: 0,

  isLoading: false,
  isLoadingDetail: false,

  // =====================================
  // FETCH PROJECTS
  // =====================================
  fetchProjects: async () => {
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

      const response = await api.get(`/api/mentor/projects?${params}`);

      if (response.data.success) {
        set({
          projects: response.data.data,
          total: response.data.pagination?.total || 0,
          totalPages: response.data.pagination?.totalPages || 0,
        });
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch projects';
      showNotification(message, 'error');
      console.error('Error fetching projects:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  // =====================================
  // FETCH PROJECT DETAIL
  // =====================================
  fetchProjectDetail: async (id: string) => {
    const { showNotification } = useNotificationStore.getState();

    try {
      set({ isLoadingDetail: true });

      const response = await api.get(`/api/mentor/projects/${id}`);

      if (response.data.success) {
        set({ projectDetail: response.data.data });
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch project details';
      showNotification(message, 'error');
      console.error('Error fetching project detail:', error);
    } finally {
      set({ isLoadingDetail: false });
    }
  },

  // =====================================
  // FILTER ACTIONS
  // =====================================
  setSearchQuery: (query: string) => {
    set({ searchQuery: query, page: 1 });
    get().fetchProjects();
  },

  setStatusFilter: (status: string) => {
    set({ statusFilter: status, page: 1 });
    get().fetchProjects();
  },

  setDepartmentFilter: (dept: string) => {
    set({ departmentFilter: dept, page: 1 });
    get().fetchProjects();
  },

  setYearFilter: (year: string) => {
    set({ yearFilter: year, page: 1 });
    get().fetchProjects();
  },

  setSortBy: (by: 'title' | 'student' | 'status' | 'completedAt') => {
    set({ sortBy: by, page: 1 });
    get().fetchProjects();
  },

  setSortOrder: (order: 'asc' | 'desc') => {
    set({ sortOrder: order, page: 1 });
    get().fetchProjects();
  },

  setPage: (page: number) => {
    set({ page });
    get().fetchProjects();
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
      sortBy: 'completedAt',
      sortOrder: 'desc',
      page: 1,
    });
    get().fetchProjects();
  },

  // =====================================
  // CLOSE DETAIL
  // =====================================
  closeDetail: () => {
    set({ projectDetail: null });
  },
}));