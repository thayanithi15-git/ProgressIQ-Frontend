import { create } from 'zustand';
import { toast } from 'sonner';
import api from '@/utils/api';

interface Internship {
  id: string;
  companyName: string;
  companyUrl: string;
  role: string;
  type: string;
  paid: boolean;
  from: string;
  to: string;
  description: string;
  status: string;
  student: {
    name: string;
    department: string;
    year: string;
    email: string;
  } | null;
  mentor: {
    name: string;
    email: string;
  } | null;
}

interface AdminInternshipsState {
  internships: Internship[];
  internshipDetail: any | null;
  searchQuery: string;
  statusFilter: string;
  typeFilter: string;
  paidFilter: string;
  departmentFilter: string;
  yearFilter: string;
  page: number;
  total: number;
  totalPages: number;
  isLoading: boolean;

  fetchInternships: () => Promise<void>;
  fetchInternshipDetail: (id: string) => Promise<void>;
  setSearchQuery: (query: string) => void;
  setStatusFilter: (status: string) => void;
  setTypeFilter: (type: string) => void;
  setPaidFilter: (paid: string) => void;
  setDepartmentFilter: (dept: string) => void;
  setYearFilter: (year: string) => void;
  setPage: (page: number) => void;
  resetFilters: () => void;
  closeDetail: () => void;
}

export const useAdminInternshipsStore = create<AdminInternshipsState>((set, get) => ({
  internships: [],
  internshipDetail: null,
  searchQuery: '',
  statusFilter: '',
  typeFilter: 'all',
  paidFilter: 'all',
  departmentFilter: 'all',
  yearFilter: 'all',
  page: 1,
  total: 0,
  totalPages: 0,
  isLoading: false,

  fetchInternships: async () => {
    set({ isLoading: true });
    try {
      const { searchQuery, statusFilter, typeFilter, paidFilter, departmentFilter, yearFilter, page } = get();
      const params = new URLSearchParams({
        page: page.toString(),
        search: searchQuery,
        status: statusFilter,
        type: typeFilter,
        paid: paidFilter,
        department: departmentFilter,
        year: yearFilter,
      });

      const res = await api.get(`/api/admin/internships?${params}`);

      set({
        internships: res.data.internships,
        total: res.data.pagination.total,
        totalPages: res.data.pagination.totalPages,
      });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch internships');
    } finally {
      set({ isLoading: false });
    }
  },

  fetchInternshipDetail: async (id) => {
    try {
      const res = await axios.get(`/api/admin/internships/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      set({ internshipDetail: res.data.internship });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch details');
    }
  },

  setSearchQuery: (query) => {
    set({ searchQuery: query, page: 1 });
  },

  setStatusFilter: (status) => {
    set({ statusFilter: status, page: 1 });
  },

  setTypeFilter: (type) => {
    set({ typeFilter: type, page: 1 });
  },

  setPaidFilter: (paid) => {
    set({ paidFilter: paid, page: 1 });
  },

  setDepartmentFilter: (dept) => {
    set({ departmentFilter: dept, page: 1 });
  },

  setYearFilter: (year) => {
    set({ yearFilter: year, page: 1 });
  },

  setPage: (page) => {
    set({ page });
  },

  resetFilters: () => {
    set({
      searchQuery: '',
      statusFilter: '',
      typeFilter: 'all',
      paidFilter: 'all',
      departmentFilter: 'all',
      yearFilter: 'all',
      page: 1
    });
  },

  closeDetail: () => {
    set({ internshipDetail: null });
  },
}));
