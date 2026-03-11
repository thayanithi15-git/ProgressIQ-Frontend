import { create } from 'zustand';
import api from '@/utils/api';
import { useNotificationStore } from '@/utils/notification';

export interface Submission {
  id: string;
  entityId: string;
  studentId: string;
  studentName: string;
  entityType: 'PROJECT' | 'TASK' | 'INTERNSHIP' | 'CERTIFICATION';
  entityTitle: string;
  submittedDate: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export interface SubmissionDetail {
  entityType: string;
  submission: any;
  summary: {
    title: string;
    status: string;
    submittedDate: string;
  };
  student: {
    id: string;
    name: string;
    email: string;
    department: string;
    year: string;
  };
  feedback: string | null;
  points: any[];
  approval: any;
}

export interface SubmissionStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  byType: {
    project: number;
    task: number;
    internship: number;
    certification: number;
  };
}

interface ApprovalsState {
  // Data
  submissions: Submission[];
  submissionDetail: SubmissionDetail | null;
  stats: SubmissionStats | null;

  // Filters
  searchQuery: string;
  statusFilter: string;
  entityTypeFilter: string;

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
  fetchSubmissions: () => Promise<void>;
  fetchSubmissionDetail: (entityType: string, id: string) => Promise<void>;
  setSearchQuery: (query: string) => void;
  setStatusFilter: (status: string) => void;
  setEntityTypeFilter: (type: string) => void;
  setPage: (page: number) => void;
  resetFilters: () => void;
  closeDetail: () => void;
  updateApproval: (id: string, entityType: string, status: string, points?: number, feedback?: string) => Promise<void>;
}

export const useApprovalsStore = create<ApprovalsState>((set, get) => ({
  // Initial States
  submissions: [],
  submissionDetail: null,
  stats: null,

  searchQuery: '',
  statusFilter: '',
  entityTypeFilter: '',

  page: 1,
  limit: 20,
  total: 0,
  totalPages: 0,

  isLoading: false,
  isLoadingDetail: false,
  isSubmitting: false,

  // =====================================
  // FETCH SUBMISSIONS
  // =====================================
  fetchSubmissions: async () => {
    const { showNotification } = useNotificationStore.getState();
    const state = get();

    try {
      set({ isLoading: true });

      const params = new URLSearchParams({
        page: state.page.toString(),
        limit: state.limit.toString(),
        search: state.searchQuery,
        ...(state.statusFilter && { status: state.statusFilter }),
        ...(state.entityTypeFilter && { entityType: state.entityTypeFilter }),
      });

      const response = await api.get(`/api/mentor/approvals?${params}`);

      if (response.data.success) {
        set({
          submissions: response.data.data,
          stats: response.data.stats,
          total: response.data.pagination?.total || 0,
          totalPages: response.data.pagination?.totalPages || 0,
        });
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch submissions';
      showNotification(message, 'error');
      console.error('Error fetching submissions:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  // =====================================
  // FETCH SUBMISSION DETAIL
  // =====================================
  fetchSubmissionDetail: async (entityType: string, id: string) => {
    const { showNotification } = useNotificationStore.getState();

    try {
      set({ isLoadingDetail: true });

      const response = await api.get(`/api/mentor/submissions/${entityType}/${id}`);

      if (response.data.success) {
        set({ submissionDetail: response.data.data });
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch submission details';
      showNotification(message, 'error');
      console.error('Error fetching submission detail:', error);
    } finally {
      set({ isLoadingDetail: false });
    }
  },

  // =====================================
  // UPDATE APPROVAL
  // =====================================
  updateApproval: async (id: string, entityType: string, status: string, points?: number, feedback?: string) => {
    const { showNotification } = useNotificationStore.getState();

    try {
      set({ isSubmitting: true });

      const storedUser = localStorage.getItem("credxUser");
      const user = storedUser ? JSON.parse(storedUser) : null;
      const userId = user?.userId;

      const response = await api.put(`/api/mentor/approvals/${id}`, {
        entityType,
        status,
        points: points || 0,
        feedback: feedback || '',
      });

      if (response.data.success) {
        showNotification('Submission updated successfully', 'success');
        get().fetchSubmissions();
        get().closeDetail();
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update submission';
      showNotification(message, 'error');
      console.error('Error updating submission:', error);
    } finally {
      set({ isSubmitting: false });
    }
  },

  // =====================================
  // FILTER ACTIONS
  // =====================================
  setSearchQuery: (query: string) => {
    set({ searchQuery: query, page: 1 });
    get().fetchSubmissions();
  },

  setStatusFilter: (status: string) => {
    set({ statusFilter: status, page: 1 });
    get().fetchSubmissions();
  },

  setEntityTypeFilter: (type: string) => {
    set({ entityTypeFilter: type, page: 1 });
    get().fetchSubmissions();
  },

  setPage: (page: number) => {
    set({ page });
    get().fetchSubmissions();
  },

  resetFilters: () => {
    set({
      searchQuery: '',
      statusFilter: '',
      entityTypeFilter: '',
      page: 1,
    });
    get().fetchSubmissions();
  },

  closeDetail: () => {
    set({ submissionDetail: null });
  },
}));