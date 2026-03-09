import { create } from 'zustand';
import api from '@/utils/api';
import { useNotificationStore } from '@/utils/notification';

export interface MentorCertification {
  id: string;
  title: string;
  platform: string;
  platformLink?: string;
  from: string;
  to: string;
  status: string;
  student: {
    id: string;
    name: string;
    email: string;
    department: string;
    year: string;
  };
  feedback?: string;
}

interface CertificationsState {
  // Data
  certifications: MentorCertification[];
  certificationDetail: MentorCertification | null;

  // Filters
  searchQuery: string;
  statusFilter: string;
  departmentFilter: string;
  yearFilter: string;
  sortBy: 'title' | 'student' | 'status' | 'to';
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
  fetchCertifications: () => Promise<void>;
  fetchCertificationDetail: (id: string) => Promise<void>;
  setSearchQuery: (query: string) => void;
  setStatusFilter: (status: string) => void;
  setDepartmentFilter: (dept: string) => void;
  setYearFilter: (year: string) => void;
  setSortBy: (by: 'title' | 'student' | 'status' | 'to') => void;
  setSortOrder: (order: 'asc' | 'desc') => void;
  setPage: (page: number) => void;
  resetFilters: () => void;
  closeDetail: () => void;
}

export const useMentorCertificationsStore = create<CertificationsState>((set, get) => ({
  // Initial States
  certifications: [],
  certificationDetail: null,

  searchQuery: '',
  statusFilter: '',
  departmentFilter: '',
  yearFilter: '',
  sortBy: 'to',
  sortOrder: 'desc',

  page: 1,
  limit: 20,
  total: 0,
  totalPages: 0,

  isLoading: false,
  isLoadingDetail: false,

  // =====================================
  // FETCH CERTIFICATIONS
  // =====================================
  fetchCertifications: async () => {
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

      const response = await api.get(`/api/mentor/certifications?${params}`);

      if (response.data.success) {
        set({
          certifications: response.data.data,
          total: response.data.pagination?.total || 0,
          totalPages: response.data.pagination?.totalPages || 0,
        });
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch certifications';
      showNotification(message, 'error');
      console.error('Error fetching certifications:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  // =====================================
  // FETCH CERTIFICATION DETAIL
  // =====================================
  fetchCertificationDetail: async (id: string) => {
    const { showNotification } = useNotificationStore.getState();

    try {
      set({ isLoadingDetail: true });

      const response = await api.get(`/api/mentor/certifications/${id}`);

      if (response.data.success) {
        set({ certificationDetail: response.data.data });
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch certification details';
      showNotification(message, 'error');
      console.error('Error fetching certification detail:', error);
    } finally {
      set({ isLoadingDetail: false });
    }
  },

  // =====================================
  // FILTER ACTIONS
  // =====================================
  setSearchQuery: (query: string) => {
    set({ searchQuery: query, page: 1 });
    get().fetchCertifications();
  },

  setStatusFilter: (status: string) => {
    set({ statusFilter: status, page: 1 });
    get().fetchCertifications();
  },

  setDepartmentFilter: (dept: string) => {
    set({ departmentFilter: dept, page: 1 });
    get().fetchCertifications();
  },

  setYearFilter: (year: string) => {
    set({ yearFilter: year, page: 1 });
    get().fetchCertifications();
  },

  setSortBy: (by: 'title' | 'student' | 'status' | 'to') => {
    set({ sortBy: by, page: 1 });
    get().fetchCertifications();
  },

  setSortOrder: (order: 'asc' | 'desc') => {
    set({ sortOrder: order, page: 1 });
    get().fetchCertifications();
  },

  setPage: (page: number) => {
    set({ page });
    get().fetchCertifications();
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
      sortBy: 'to',
      sortOrder: 'desc',
      page: 1,
    });
    get().fetchCertifications();
  },

  // =====================================
  // CLOSE DETAIL
  // =====================================
  closeDetail: () => {
    set({ certificationDetail: null });
  },
}));