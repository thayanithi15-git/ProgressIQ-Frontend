import { create } from 'zustand';
import api from '@/utils/api';
import { useNotificationStore } from '@/utils/notification';
import { getStoredMentorId } from '@/utils/mentorSession';

// ==========================================
// TYPES
// ==========================================

export interface Project {
  _id: string;
  studentId: string;
  mentorId: {
    _id: string;
    firstName: string;
    lastName: string;
    department?: string;
  } | string;
  title: string;
  description: string;
  githubLink?: string;
  websiteLink?: string;
  completedAt?: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';
  feedback?: string | null;
  submissionNote?: string | null;
  verificationNote?: string | null;
  pointsAwarded?: number;
  verifiedAt?: string | null;
  createdByMentor?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectPayload {
  mentorId?: string;
  title: string;
  description: string;
  githubLink?: string;
  websiteLink?: string;
  completedAt?: string;
}

export interface UpdateProjectPayload extends Partial<CreateProjectPayload> {}

export type ProjectStatusFilter = 'ALL' | 'PENDING' | 'IN_PROGRESS' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';

interface Pagination {
  total: number;
  limit: number;
  skip: number;
}

// ==========================================
// STORE
// ==========================================

interface ProjectsState {
  projects: Project[];
  selectedProject: Project | null;
  pagination: Pagination;
  statusFilter: ProjectStatusFilter;
  searchQuery: string;
  isLoading: boolean;
  isSubmitting: boolean;
  isModalOpen: boolean;
  isSubmitModalOpen: boolean;
  editingProject: Project | null;
  submittingProjectId: string | null;

  // Actions
  fetchProjects: (status?: ProjectStatusFilter) => Promise<void>;
  fetchProjectById: (id: string) => Promise<void>;
  createProject: (payload: CreateProjectPayload) => Promise<boolean>;
  updateProject: (id: string, payload: UpdateProjectPayload) => Promise<boolean>;
  deleteProject: (id: string) => Promise<boolean>;
  startProject: (id: string) => Promise<boolean>;
  submitProject: (id: string, submissionNote?: string) => Promise<boolean>;

  // UI
  setStatusFilter: (filter: ProjectStatusFilter) => void;
  setSearchQuery: (q: string) => void;
  setPage: (skip: number) => void;
  openCreateModal: () => void;
  openEditModal: (project: Project) => void;
  closeModal: () => void;
  openSubmitModal: (id: string) => void;
  closeSubmitModal: () => void;
  setSelectedProject: (p: Project | null) => void;
}

export const useProjectsStore = create<ProjectsState>((set, get) => ({
  projects: [],
  selectedProject: null,
  pagination: { total: 0, limit: 10, skip: 0 },
  statusFilter: 'ALL',
  searchQuery: '',
  isLoading: false,
  isSubmitting: false,
  isModalOpen: false,
  isSubmitModalOpen: false,
  editingProject: null,
  submittingProjectId: null,

  // ─── FETCH LIST ───────────────────────────────────────────
  fetchProjects: async (status?) => {
    const { showNotification } = useNotificationStore.getState();
    const { pagination, statusFilter } = get();
    const activeFilter = status ?? statusFilter;

    try {
      set({ isLoading: true });
      const params = new URLSearchParams({
        limit: String(pagination.limit),
        skip:  String(pagination.skip),
      });
      if (activeFilter !== 'ALL') params.append('status', activeFilter);

      const res = await api.get(`/api/student/projects?${params}`);
      if (res.data.success) {
        set({
          projects:   res.data.data.projects,
          pagination: { ...pagination, total: res.data.data.pagination?.total ?? 0 },
        });
      }
    } catch (error: any) {
      showNotification(error.response?.data?.message || 'Failed to fetch projects', 'error');
    } finally {
      set({ isLoading: false });
    }
  },

  // ─── FETCH SINGLE ─────────────────────────────────────────
  fetchProjectById: async (id) => {
    const { showNotification } = useNotificationStore.getState();
    try {
      const res = await api.get(`/api/student/projects/${id}`);
      if (res.data.success) set({ selectedProject: res.data.data });
    } catch (error: any) {
      showNotification(error.response?.data?.message || 'Failed to fetch project', 'error');
    }
  },

  // ─── CREATE ───────────────────────────────────────────────
  createProject: async (payload) => {
    const { showNotification } = useNotificationStore.getState();
    try {
      const mentorId = getStoredMentorId();
      if (!mentorId) {
        showNotification('No mentor assigned. Please contact admin.', 'error');
        return false;
      }
      set({ isSubmitting: true });
      const res = await api.post('/api/student/projects', { ...payload, mentorId });
      if (res.data.success) {
        showNotification('Project created successfully', 'success');
        get().fetchProjects();
        set({ isModalOpen: false, editingProject: null });
        return true;
      }
      return false;
    } catch (error: any) {
      showNotification(error.response?.data?.message || 'Failed to create project', 'error');
      return false;
    } finally {
      set({ isSubmitting: false });
    }
  },

  // ─── UPDATE ───────────────────────────────────────────────
  updateProject: async (id, payload) => {
    const { showNotification } = useNotificationStore.getState();
    try {
      set({ isSubmitting: true });
      const res = await api.put(`/api/student/projects/${id}`, payload);
      if (res.data.success) {
        showNotification('Project updated successfully', 'success');
        get().fetchProjects();
        set({ isModalOpen: false, editingProject: null });
        return true;
      }
      return false;
    } catch (error: any) {
      showNotification(error.response?.data?.message || 'Failed to update project', 'error');
      return false;
    } finally {
      set({ isSubmitting: false });
    }
  },

  // ─── DELETE ───────────────────────────────────────────────
  deleteProject: async (id) => {
    const { showNotification } = useNotificationStore.getState();
    try {
      const res = await api.delete(`/api/student/projects/${id}`);
      if (res.data.success) {
        showNotification('Project deleted', 'success');
        get().fetchProjects();
        return true;
      }
      return false;
    } catch (error: any) {
      showNotification(error.response?.data?.message || 'Failed to delete project', 'error');
      return false;
    }
  },

  // ─── START ────────────────────────────────────────────────
  startProject: async (id) => {
    const { showNotification } = useNotificationStore.getState();
    try {
      set({ isSubmitting: true });
      const res = await api.put(`/api/student/projects/${id}/start`);
      if (res.data.success) {
        showNotification('Project started!', 'success');
        get().fetchProjects();
        return true;
      }
      return false;
    } catch (error: any) {
      showNotification(error.response?.data?.message || 'Failed to start project', 'error');
      return false;
    } finally {
      set({ isSubmitting: false });
    }
  },

  // ─── SUBMIT ───────────────────────────────────────────────
  submitProject: async (id, submissionNote) => {
    const { showNotification } = useNotificationStore.getState();
    try {
      set({ isSubmitting: true });
      const res = await api.put(`/api/student/projects/${id}/complete`, {
        submissionNote: submissionNote || '',
        completedAt: new Date().toISOString(),
      });
      if (res.data.success) {
        showNotification('Project submitted for review!', 'success');
        get().fetchProjects();
        set({ isSubmitModalOpen: false, submittingProjectId: null });
        return true;
      }
      return false;
    } catch (error: any) {
      showNotification(error.response?.data?.message || 'Failed to submit project', 'error');
      return false;
    } finally {
      set({ isSubmitting: false });
    }
  },

  // ─── UI ACTIONS ───────────────────────────────────────────
  setStatusFilter: (filter) => {
    set({ statusFilter: filter, pagination: { ...get().pagination, skip: 0 } });
    get().fetchProjects(filter);
  },

  setSearchQuery: (q) => set({ searchQuery: q }),

  setPage: (skip) => {
    set({ pagination: { ...get().pagination, skip } });
    get().fetchProjects();
  },

  openCreateModal:  ()      => set({ isModalOpen: true, editingProject: null }),
  openEditModal:    (p)     => set({ isModalOpen: true, editingProject: p }),
  closeModal:       ()      => set({ isModalOpen: false, editingProject: null }),
  openSubmitModal:  (id)    => set({ isSubmitModalOpen: true, submittingProjectId: id }),
  closeSubmitModal: ()      => set({ isSubmitModalOpen: false, submittingProjectId: null }),
  setSelectedProject: (p)   => set({ selectedProject: p }),
}));
