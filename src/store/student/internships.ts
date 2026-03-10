import { create } from 'zustand';
import api from '@/utils/api';
import { useNotificationStore } from '@/utils/notification';
import { getStoredMentorId } from '@/utils/mentorSession';

// ==========================================
// TYPES
// ==========================================

export interface Internship {
  _id: string;
  studentId: string;
  mentorId: {
    _id: string;
    firstName: string;
    lastName: string;
  } | string;
  companyName: string;
  companyUrl?: string;
  role: string;
  type: 'REMOTE' | 'ONSITE' | 'HYBRID';
  paid: boolean;
  from: string;
  to: string;
  description?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  feedback?: string | null;
  durationDays?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateInternshipPayload {
  mentorId?: string;
  companyName: string;
  companyUrl?: string;
  role: string;
  type: 'REMOTE' | 'ONSITE' | 'HYBRID';
  paid: boolean;
  from: string;
  to: string;
  description?: string;
}

export interface UpdateInternshipPayload extends Partial<CreateInternshipPayload> {}

export interface InternshipFeedback {
  id: string;
  mentor: string;
  mentorEmail: string;
  message: string;
  createdAt: string;
}

export type InternshipStatusFilter = 'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED';
export type InternshipTypeFilter = 'ALL' | 'REMOTE' | 'ONSITE' | 'HYBRID';

interface Pagination {
  total: number;
  limit: number;
  skip: number;
}

// ==========================================
// STORE
// ==========================================

interface InternshipsState {
  internships: Internship[];
  selectedInternship: Internship | null;
  selectedFeedback: InternshipFeedback | null;
  pagination: Pagination;
  statusFilter: InternshipStatusFilter;
  typeFilter: InternshipTypeFilter;
  searchQuery: string;
  isLoading: boolean;
  isSubmitting: boolean;
  isModalOpen: boolean;
  isFeedbackModalOpen: boolean;
  editingInternship: Internship | null;

  // Actions
  fetchInternships: (status?: InternshipStatusFilter, type?: InternshipTypeFilter) => Promise<void>;
  fetchInternshipById: (id: string) => Promise<void>;
  createInternship: (payload: CreateInternshipPayload) => Promise<boolean>;
  updateInternship: (id: string, payload: UpdateInternshipPayload) => Promise<boolean>;
  deleteInternship: (id: string) => Promise<boolean>;
  fetchFeedback: (id: string) => Promise<void>;

  // UI
  setStatusFilter: (filter: InternshipStatusFilter) => void;
  setTypeFilter: (filter: InternshipTypeFilter) => void;
  setSearchQuery: (q: string) => void;
  setPage: (skip: number) => void;
  openCreateModal: () => void;
  openEditModal: (internship: Internship) => void;
  closeModal: () => void;
  openFeedbackModal: (id: string) => Promise<void>;
  closeFeedbackModal: () => void;
}

export const useInternshipsStore = create<InternshipsState>((set, get) => ({
  internships: [],
  selectedInternship: null,
  selectedFeedback: null,
  pagination: { total: 0, limit: 10, skip: 0 },
  statusFilter: 'ALL',
  typeFilter: 'ALL',
  searchQuery: '',
  isLoading: false,
  isSubmitting: false,
  isModalOpen: false,
  isFeedbackModalOpen: false,
  editingInternship: null,

  fetchInternships: async (status?, type?) => {
    const { showNotification } = useNotificationStore.getState();
    const { pagination, statusFilter, typeFilter } = get();
    const activeStatus = status ?? statusFilter;
    const activeType = type ?? typeFilter;

    try {
      set({ isLoading: true });

      const params = new URLSearchParams({
        limit: String(pagination.limit),
        skip: String(pagination.skip),
      });
      if (activeStatus !== 'ALL') params.append('status', activeStatus);
      if (activeType !== 'ALL') params.append('type', activeType);

      const res = await api.get(`/api/student/internships?${params}`);
      if (res.data.success) {
        set({
          internships: res.data.data.internships,
          pagination: { ...pagination, total: res.data.data.pagination.total },
        });
      }
    } catch (error: any) {
      showNotification(error.response?.data?.message || 'Failed to fetch internships', 'error');
    } finally {
      set({ isLoading: false });
    }
  },

  fetchInternshipById: async (id) => {
    const { showNotification } = useNotificationStore.getState();
    try {
      const res = await api.get(`/api/student/internships/${id}`);
      if (res.data.success) set({ selectedInternship: res.data.data });
    } catch (error: any) {
      showNotification(error.response?.data?.message || 'Failed to fetch internship', 'error');
    }
  },

  createInternship: async (payload) => {
    const { showNotification } = useNotificationStore.getState();
    try {
      const mentorId = getStoredMentorId();
      if (!mentorId) {
        showNotification('No mentor assigned. Please contact admin.', 'error');
        return false;
      }
      set({ isSubmitting: true });
      const res = await api.post('/api/student/internships', { ...payload, mentorId });
      if (res.data.success) {
        showNotification('Internship created successfully', 'success');
        get().fetchInternships();
        set({ isModalOpen: false, editingInternship: null });
        return true;
      }
      return false;
    } catch (error: any) {
      showNotification(error.response?.data?.message || 'Failed to create internship', 'error');
      return false;
    } finally {
      set({ isSubmitting: false });
    }
  },

  updateInternship: async (id, payload) => {
    const { showNotification } = useNotificationStore.getState();
    try {
      set({ isSubmitting: true });
      const res = await api.put(`/api/student/internships/${id}`, payload);
      if (res.data.success) {
        showNotification('Internship updated successfully', 'success');
        get().fetchInternships();
        set({ isModalOpen: false, editingInternship: null });
        return true;
      }
      return false;
    } catch (error: any) {
      showNotification(error.response?.data?.message || 'Failed to update internship', 'error');
      return false;
    } finally {
      set({ isSubmitting: false });
    }
  },

  deleteInternship: async (id) => {
    const { showNotification } = useNotificationStore.getState();
    try {
      const res = await api.delete(`/api/student/internships/${id}`);
      if (res.data.success) {
        showNotification('Internship deleted', 'success');
        get().fetchInternships();
        return true;
      }
      return false;
    } catch (error: any) {
      showNotification(error.response?.data?.message || 'Failed to delete internship', 'error');
      return false;
    }
  },

  fetchFeedback: async (id) => {
    const { showNotification } = useNotificationStore.getState();
    try {
      const res = await api.get(`/api/student/internships/${id}/feedback`);
      if (res.data.success) set({ selectedFeedback: res.data.data });
    } catch (error: any) {
      showNotification(error.response?.data?.message || 'No feedback found', 'error');
    }
  },

  setStatusFilter: (filter) => {
    set({ statusFilter: filter, pagination: { ...get().pagination, skip: 0 } });
    get().fetchInternships(filter);
  },

  setTypeFilter: (filter) => {
    set({ typeFilter: filter, pagination: { ...get().pagination, skip: 0 } });
    get().fetchInternships(undefined, filter);
  },

  setSearchQuery: (q) => set({ searchQuery: q }),

  setPage: (skip) => {
    set({ pagination: { ...get().pagination, skip } });
    get().fetchInternships();
  },

  openCreateModal: () => set({ isModalOpen: true, editingInternship: null }),

  openEditModal: (internship) => set({ isModalOpen: true, editingInternship: internship }),

  closeModal: () => set({ isModalOpen: false, editingInternship: null }),

  openFeedbackModal: async (id) => {
    await get().fetchFeedback(id);
    set({ isFeedbackModalOpen: true });
  },

  closeFeedbackModal: () => set({ isFeedbackModalOpen: false, selectedFeedback: null }),
}));
