import { create } from 'zustand';
import api from '@/utils/api';
import { useNotificationStore } from '@/utils/notification';

export interface MentorInternship {
  id: string;
  companyName: string;
  companyUrl?: string;
  role: string;
  type: string;
  paid: boolean;
  from: string;
  to: string;
  description?: string;
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

interface InternshipsState {
  // Data
  internships: MentorInternship[];
  internshipDetail: MentorInternship | null;

  // Filters
  searchQuery: string;
  statusFilter: string;
  typeFilter: string;
  paidFilter: string;
  departmentFilter: string;
  yearFilter: string;
  sortBy: 'company' | 'student' | 'status' | 'from';
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
  fetchInternships: () => Promise<void>;
  fetchInternshipDetail: (id: string) => Promise<void>;
  setSearchQuery: (query: string) => void;
  setStatusFilter: (status: string) => void;
  setTypeFilter: (type: string) => void;
  setPaidFilter: (paid: string) => void;
  setDepartmentFilter: (dept: string) => void;
  setYearFilter: (year: string) => void;
  setSortBy: (by: 'company' | 'student' | 'status' | 'from') => void;
  setSortOrder: (order: 'asc' | 'desc') => void;
  setPage: (page: number) => void;
  resetFilters: () => void;
  closeDetail: () => void;
}

export const useMentorInternshipsStore = create<InternshipsState>((set, get) => ({
  // Initial States
  internships: [],
  internshipDetail: null,

  searchQuery: '',
  statusFilter: '',
  typeFilter: '',
  paidFilter: '',
  departmentFilter: '',
  yearFilter: '',
  sortBy: 'from',
  sortOrder: 'desc',

  page: 1,
  limit: 20,
  total: 0,
  totalPages: 0,

  isLoading: false,
  isLoadingDetail: false,

  // =====================================
  // FETCH INTERNSHIPS
  // =====================================
  fetchInternships: async () => {
    const { showNotification } = useNotificationStore.getState();
    const state = get();

    try {
      set({ isLoading: true });

      const params = new URLSearchParams({
        page: state.page.toString(),
        limit: state.limit.toString(),
        search: state.searchQuery,
        ...(state.statusFilter && { status: state.statusFilter }),
        ...(state.typeFilter && { type: state.typeFilter }),
        ...(state.paidFilter && { paid: state.paidFilter }),
        ...(state.departmentFilter && { department: state.departmentFilter }),
        ...(state.yearFilter && { year: state.yearFilter }),
        sortBy: state.sortBy,
        sortOrder: state.sortOrder,
      });

      const response = await api.get(`/api/mentor/internships?${params}`);

      if (response.data.success) {
        set({
          internships: response.data.data,
          total: response.data.pagination?.total || 0,
          totalPages: response.data.pagination?.totalPages || 0,
        });
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch internships';
      showNotification(message, 'error');
      console.error('Error fetching internships:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  // =====================================
  // FETCH INTERNSHIP DETAIL
  // =====================================
  fetchInternshipDetail: async (id: string) => {
    const { showNotification } = useNotificationStore.getState();

    try {
      set({ isLoadingDetail: true });

      const response = await api.get(`/api/mentor/internships/${id}`);

      if (response.data.success) {
        set({ internshipDetail: response.data.data });
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch internship details';
      showNotification(message, 'error');
      console.error('Error fetching internship detail:', error);
    } finally {
      set({ isLoadingDetail: false });
    }
  },

  // =====================================
  // FILTER ACTIONS
  // =====================================
  setSearchQuery: (query: string) => {
    set({ searchQuery: query, page: 1 });
    get().fetchInternships();
  },

  setStatusFilter: (status: string) => {
    set({ statusFilter: status, page: 1 });
    get().fetchInternships();
  },

  setTypeFilter: (type: string) => {
    set({ typeFilter: type, page: 1 });
    get().fetchInternships();
  },

  setPaidFilter: (paid: string) => {
    set({ paidFilter: paid, page: 1 });
    get().fetchInternships();
  },

  setDepartmentFilter: (dept: string) => {
    set({ departmentFilter: dept, page: 1 });
    get().fetchInternships();
  },

  setYearFilter: (year: string) => {
    set({ yearFilter: year, page: 1 });
    get().fetchInternships();
  },

  setSortBy: (by: 'company' | 'student' | 'status' | 'from') => {
    set({ sortBy: by, page: 1 });
    get().fetchInternships();
  },

  setSortOrder: (order: 'asc' | 'desc') => {
    set({ sortOrder: order, page: 1 });
    get().fetchInternships();
  },

  setPage: (page: number) => {
    set({ page });
    get().fetchInternships();
  },

  // =====================================
  // RESET FILTERS
  // =====================================
  resetFilters: () => {
    set({
      searchQuery: '',
      statusFilter: '',
      typeFilter: '',
      paidFilter: '',
      departmentFilter: '',
      yearFilter: '',
      sortBy: 'from',
      sortOrder: 'desc',
      page: 1,
    });
    get().fetchInternships();
  },

  // =====================================
  // CLOSE DETAIL
  // =====================================
  closeDetail: () => {
    set({ internshipDetail: null });
  },
}));