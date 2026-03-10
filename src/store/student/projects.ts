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
  completedAt: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  feedback?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectPayload {
  mentorId?: string;
  title: string;
  description: string;
  githubLink?: string;
  websiteLink?: string;
  completedAt: string;
}

export interface UpdateProjectPayload extends Partial<CreateProjectPayload> {}

export interface ProjectFeedback {
  id: string;
  mentor: string;
  mentorEmail: string;
  message: string;
  createdAt: string;
  type: string;
}

export type ProjectStatusFilter = 'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED';

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
  selectedFeedback: ProjectFeedback | null;
  pagination: Pagination;
  statusFilter: ProjectStatusFilter;
  searchQuery: string;
  isLoading: boolean;
  isSubmitting: boolean;
  isModalOpen: boolean;
  isFeedbackModalOpen: boolean;
  editingProject: Project | null;

  // Actions
  fetchProjects: (status?: ProjectStatusFilter) => Promise<void>;
  fetchProjectById: (id: string) => Promise<void>;
  createProject: (payload: CreateProjectPayload) => Promise<boolean>;
  updateProject: (id: string, payload: UpdateProjectPayload) => Promise<boolean>;
  deleteProject: (id: string) => Promise<boolean>;
  fetchFeedback: (id: string) => Promise<void>;

  // UI
  setStatusFilter: (filter: ProjectStatusFilter) => void;
  setSearchQuery: (q: string) => void;
  setPage: (skip: number) => void;
  openCreateModal: () => void;
  openEditModal: (project: Project) => void;
  closeModal: () => void;
  openFeedbackModal: (id: string) => Promise<void>;
  closeFeedbackModal: () => void;
  setSelectedProject: (p: Project | null) => void;
}

export const useProjectsStore = create<ProjectsState>((set, get) => ({
  projects: [],
  selectedProject: null,
  selectedFeedback: null,
  pagination: { total: 0, limit: 10, skip: 0 },
  statusFilter: 'ALL',
  searchQuery: '',
  isLoading: false,
  isSubmitting: false,
  isModalOpen: false,
  isFeedbackModalOpen: false,
  editingProject: null,

  // ─── FETCH LIST ───────────────────────────────────────────
  fetchProjects: async (status?: ProjectStatusFilter) => {
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

      const res = await api.get(`/api/student/projects?${params}`);
      if (res.data.success) {
        set({
          projects: res.data.data.projects,
          pagination: { ...pagination, total: res.data.data.pagination.total },
        });
      }
    } catch (error: any) {
      showNotification(error.response?.data?.message || 'Failed to fetch projects', 'error');
    } finally {
      set({ isLoading: false });
    }
  },

  // ─── FETCH SINGLE ─────────────────────────────────────────
  fetchProjectById: async (id: string) => {
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

  // ─── FEEDBACK ─────────────────────────────────────────────
  fetchFeedback: async (id) => {
    const { showNotification } = useNotificationStore.getState();
    try {
      const res = await api.get(`/api/student/projects/${id}/feedback`);
      if (res.data.success) set({ selectedFeedback: res.data.data });
    } catch (error: any) {
      showNotification(error.response?.data?.message || 'No feedback found', 'error');
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

  openCreateModal: () => set({ isModalOpen: true, editingProject: null }),

  openEditModal: (project) => set({ isModalOpen: true, editingProject: project }),

  closeModal: () => set({ isModalOpen: false, editingProject: null }),

  openFeedbackModal: async (id) => {
    await get().fetchFeedback(id);
    set({ isFeedbackModalOpen: true });
  },

  closeFeedbackModal: () => set({ isFeedbackModalOpen: false, selectedFeedback: null }),

  setSelectedProject: (p) => set({ selectedProject: p }),
}));
