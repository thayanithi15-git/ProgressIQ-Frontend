import { create } from 'zustand';
import api from '@/utils/api';
import { useNotificationStore } from '@/utils/notification';
import { getStoredMentorId } from '@/utils/mentorSession';

// ==========================================
// TYPES
// ==========================================

export interface Certification {
  _id: string;
  studentId: string;
  mentorId: {
    _id: string;
    firstName: string;
    lastName: string;
  } | string;
  title: string;
  platform: string;
  platformLink: string;
  from: string;
  to: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  feedback?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCertificationPayload {
  mentorId?: string;
  title: string;
  platform: string;
  platformLink: string;
  from: string;
  to: string;
}

export interface UpdateCertificationPayload extends Partial<CreateCertificationPayload> {}

export interface CertificationFeedback {
  id: string;
  mentor: string;
  mentorEmail: string;
  message: string;
  createdAt: string;
  type: string;
}

export type CertStatusFilter = 'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED';

interface Pagination {
  total: number;
  limit: number;
  skip: number;
}

// ==========================================
// STORE
// ==========================================

interface CertificationsState {
  certifications: Certification[];
  selectedCertification: Certification | null;
  selectedFeedback: CertificationFeedback | null;
  pagination: Pagination;
  statusFilter: CertStatusFilter;
  searchQuery: string;
  isLoading: boolean;
  isSubmitting: boolean;
  isModalOpen: boolean;
  isFeedbackModalOpen: boolean;
  editingCertification: Certification | null;

  // Actions
  fetchCertifications: (status?: CertStatusFilter) => Promise<void>;
  fetchCertificationById: (id: string) => Promise<void>;
  createCertification: (payload: CreateCertificationPayload) => Promise<boolean>;
  updateCertification: (id: string, payload: UpdateCertificationPayload) => Promise<boolean>;
  deleteCertification: (id: string) => Promise<boolean>;
  fetchFeedback: (id: string) => Promise<void>;

  // UI
  setStatusFilter: (filter: CertStatusFilter) => void;
  setSearchQuery: (q: string) => void;
  setPage: (skip: number) => void;
  openCreateModal: () => void;
  openEditModal: (cert: Certification) => void;
  closeModal: () => void;
  openFeedbackModal: (id: string) => Promise<void>;
  closeFeedbackModal: () => void;
}

export const useCertificationsStore = create<CertificationsState>((set, get) => ({
  certifications: [],
  selectedCertification: null,
  selectedFeedback: null,
  pagination: { total: 0, limit: 10, skip: 0 },
  statusFilter: 'ALL',
  searchQuery: '',
  isLoading: false,
  isSubmitting: false,
  isModalOpen: false,
  isFeedbackModalOpen: false,
  editingCertification: null,

  fetchCertifications: async (status?) => {
    const { showNotification } = useNotificationStore.getState();
    const { pagination, statusFilter } = get();
    const activeFilter = status ?? statusFilter;

    try {
      set({ isLoading: true });

      const params = new URLSearchParams({
        limit: String(pagination.limit),
        skip: String(pagination.skip),
      });
      if (activeFilter !== 'ALL') params.append('status', activeFilter);

      const res = await api.get(`/api/student/certifications?${params}`);
      if (res.data.success) {
        set({
          certifications: res.data.data.certifications,
          pagination: { ...pagination, total: res.data.data.pagination.total },
        });
      }
    } catch (error: any) {
      showNotification(error.response?.data?.message || 'Failed to fetch certifications', 'error');
    } finally {
      set({ isLoading: false });
    }
  },

  fetchCertificationById: async (id) => {
    const { showNotification } = useNotificationStore.getState();
    try {
      const res = await api.get(`/api/student/certifications/${id}`);
      if (res.data.success) set({ selectedCertification: res.data.data });
    } catch (error: any) {
      showNotification(error.response?.data?.message || 'Failed to fetch certification', 'error');
    }
  },

  createCertification: async (payload) => {
    const { showNotification } = useNotificationStore.getState();
    try {
      const mentorId = getStoredMentorId();
      if (!mentorId) {
        showNotification('No mentor assigned. Please contact admin.', 'error');
        return false;
      }
      set({ isSubmitting: true });
      const res = await api.post('/api/student/certifications', { ...payload, mentorId });
      if (res.data.success) {
        showNotification('Certification created successfully', 'success');
        get().fetchCertifications();
        set({ isModalOpen: false, editingCertification: null });
        return true;
      }
      return false;
    } catch (error: any) {
      showNotification(error.response?.data?.message || 'Failed to create certification', 'error');
      return false;
    } finally {
      set({ isSubmitting: false });
    }
  },

  updateCertification: async (id, payload) => {
    const { showNotification } = useNotificationStore.getState();
    try {
      set({ isSubmitting: true });
      const res = await api.put(`/api/student/certifications/${id}`, payload);
      if (res.data.success) {
        showNotification('Certification updated successfully', 'success');
        get().fetchCertifications();
        set({ isModalOpen: false, editingCertification: null });
        return true;
      }
      return false;
    } catch (error: any) {
      showNotification(error.response?.data?.message || 'Failed to update certification', 'error');
      return false;
    } finally {
      set({ isSubmitting: false });
    }
  },

  deleteCertification: async (id) => {
    const { showNotification } = useNotificationStore.getState();
    try {
      const res = await api.delete(`/api/student/certifications/${id}`);
      if (res.data.success) {
        showNotification('Certification deleted', 'success');
        get().fetchCertifications();
        return true;
      }
      return false;
    } catch (error: any) {
      showNotification(error.response?.data?.message || 'Failed to delete certification', 'error');
      return false;
    }
  },

  fetchFeedback: async (id) => {
    const { showNotification } = useNotificationStore.getState();
    try {
      const res = await api.get(`/api/student/certifications/${id}/feedback`);
      if (res.data.success) set({ selectedFeedback: res.data.data });
    } catch (error: any) {
      showNotification(error.response?.data?.message || 'No feedback found', 'error');
    }
  },

  setStatusFilter: (filter) => {
    set({ statusFilter: filter, pagination: { ...get().pagination, skip: 0 } });
    get().fetchCertifications(filter);
  },

  setSearchQuery: (q) => set({ searchQuery: q }),

  setPage: (skip) => {
    set({ pagination: { ...get().pagination, skip } });
    get().fetchCertifications();
  },

  openCreateModal: () => set({ isModalOpen: true, editingCertification: null }),

  openEditModal: (cert) => set({ isModalOpen: true, editingCertification: cert }),

  closeModal: () => set({ isModalOpen: false, editingCertification: null }),

  openFeedbackModal: async (id) => {
    await get().fetchFeedback(id);
    set({ isFeedbackModalOpen: true });
  },

  closeFeedbackModal: () => set({ isFeedbackModalOpen: false, selectedFeedback: null }),
}));
