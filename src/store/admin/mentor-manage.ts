import api from '@/utils/api';
import { useNotificationStore } from '@/utils/notification';
import { create } from 'zustand';

export interface Mentor {
  _id: string;
  name: string;
  email: string;
  contactNo: string;
  place: string;
  department: string;
  designation: string;
}

export interface Student {
  _id: string;
  userId: { _id: string; email: string } | null;
  firstName: string;
  lastName: string;
  phone: string;
  parentName: string;
  parentPhone: string;
  place: string;
  department: string;
  year: string;
  rewardPoints: number;
  status: string;
  createdAt: string;
}

export interface CreateMentorPayload {
  name: string;
  email: string;
  contactNo: string;
  place: string;
  department: string;
  designation: string;
}

export interface UpdateMentorPayload {
  name?: string;
  email?: string;
  contactNo?: string;
  place?: string;
  department?: string;
  designation?: string;
}

export interface MentorFilters {
  department?: string;
  designation?: string;
  searchName?: string;
  searchEmail?: string;
  place?: string;
}

interface MentorManagementState {
  mentors: Mentor[];
  currentMentor: Mentor | null;
  total: number;
  isLoading: boolean;
  currentPage: number;
  pageSize: number;
  filters: MentorFilters;
  viewMode: 'list' | 'profile';
  students: Student[];
  studentsLoading: boolean;

  // API Methods
  fetchMentors: (page?: number, limit?: number, filters?: MentorFilters) => Promise<void>;
  fetchMentorById: (mentorId: string) => Promise<void>;
  createMentor: (data: CreateMentorPayload) => Promise<Mentor | null>;
  updateMentor: (mentorId: string, data: UpdateMentorPayload) => Promise<void>;
  deleteMentor: (mentorId: string) => Promise<void>;
  fetchStudentsForMapping: () => Promise<void>;
  mapStudentsToMentor: (mentorId: string, studentIds: string[]) => Promise<void>;

  // State Management
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setFilters: (filters: MentorFilters) => void;
  setViewMode: (mode: 'list' | 'profile') => void;
  setCurrentMentor: (mentor: Mentor | null) => void;
  resetFilters: () => void;
}

const initialFilters: MentorFilters = {
  department: undefined,
  designation: undefined,
  searchName: '',
  searchEmail: '',
  place: undefined,
};

export const useMentorManagementStore = create<MentorManagementState>(
  (set, get) => ({
    mentors: [],
    currentMentor: null,
    total: 0,
    isLoading: false,
    currentPage: 1,
    pageSize: 10,
    filters: initialFilters,
    viewMode: 'list',
    students: [],
    studentsLoading: false,

    fetchMentors: async (page = 1, limit = 10, filters?: MentorFilters) => {
      const { showNotification } = useNotificationStore.getState();

      try {
        set({ isLoading: true });

        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });

        const activeFilters = filters || get().filters;

        if (activeFilters?.department) {
          params.append('department', activeFilters.department);
        }
        if (activeFilters?.designation) {
          params.append('designation', activeFilters.designation);
        }
        if (activeFilters?.searchName) {
          params.append('name', activeFilters.searchName);
        }
        if (activeFilters?.searchEmail) {
          params.append('email', activeFilters.searchEmail);
        }
        if (activeFilters?.place) {
          params.append('place', activeFilters.place);
        }

        const response = await api.get(`/api/admin/mentors?${params.toString()}`);

        // Handle pagination for client-side filtering
        const allMentors = response.data.mentors || [];
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedMentors = allMentors.slice(startIndex, endIndex);

        set({
          mentors: paginatedMentors,
          total: allMentors.length,
          currentPage: page,
          pageSize: limit,
          isLoading: false,
        });
      } catch (error: any) {
        set({ isLoading: false });
        const errorMessage = error.response?.data?.message || 'Failed to fetch mentors';
        showNotification(errorMessage, 'error');
        console.error('Fetch mentors error:', error);
      }
    },

    fetchMentorById: async (mentorId: string) => {
      const { showNotification } = useNotificationStore.getState();

      try {
        set({ isLoading: true });

        const response = await api.get(`/api/admin/mentors/${mentorId}`);

        set({
          currentMentor: response.data.mentor,
          viewMode: 'profile',
          isLoading: false,
        });
      } catch (error: any) {
        set({ isLoading: false });
        const errorMessage = error.response?.data?.message || 'Failed to fetch mentor';
        showNotification(errorMessage, 'error');
      }
    },

    createMentor: async (data: CreateMentorPayload) => {
      const { showNotification } = useNotificationStore.getState();

      try {
        set({ isLoading: true });

        const response = await api.post('/api/admin/mentors', data);

        set({ isLoading: false });
        showNotification('Mentor created successfully!', 'success');

        const state = get();
        state.fetchMentors(state.currentPage, state.pageSize, state.filters);

        return response.data.mentor as Mentor;
      } catch (error: any) {
        set({ isLoading: false });
        const errorMessage = error.response?.data?.message || 'Failed to create mentor';
        showNotification(errorMessage, 'error');
        return null;
      }
    },

    updateMentor: async (mentorId: string, data: UpdateMentorPayload) => {
      const { showNotification } = useNotificationStore.getState();

      try {
        set({ isLoading: true });

        const response = await api.put(`/api/admin/mentors/${mentorId}`, data);

        set({ isLoading: false, currentMentor: response.data.mentor });
        showNotification('Mentor updated successfully!', 'success');

        const state = get();
        state.fetchMentors(state.currentPage, state.pageSize, state.filters);
      } catch (error: any) {
        set({ isLoading: false });
        const errorMessage = error.response?.data?.message || 'Failed to update mentor';
        showNotification(errorMessage, 'error');
      }
    },

    deleteMentor: async (mentorId: string) => {
      const { showNotification } = useNotificationStore.getState();

      try {
        set({ isLoading: true });

        await api.delete(`/api/admin/mentors/${mentorId}`);

        set({ isLoading: false });
        showNotification('Mentor deleted successfully!', 'success');

        const state = get();
        state.fetchMentors(state.currentPage, state.pageSize, state.filters);
      } catch (error: any) {
        set({ isLoading: false });
        const errorMessage = error.response?.data?.message || 'Failed to delete mentor';
        showNotification(errorMessage, 'error');
      }
    },

    setCurrentPage: (page: number) => {
      const state = get();
      set({ currentPage: page });
      state.fetchMentors(page, state.pageSize, state.filters);
    },

    setPageSize: (size: number) => {
      const state = get();
      set({ pageSize: size, currentPage: 1 });
      state.fetchMentors(1, size, state.filters);
    },

    setFilters: (filters: MentorFilters) => {
      set({ filters, currentPage: 1 });
      const state = get();
      state.fetchMentors(1, state.pageSize, filters);
    },

    setViewMode: (mode: 'list' | 'profile') => {
      set({ viewMode: mode });
    },

    setCurrentMentor: (mentor: Mentor | null) => {
      set({ currentMentor: mentor });
    },

    resetFilters: () => {
      set({ filters: initialFilters, currentPage: 1 });
      const state = get();
      state.fetchMentors(1, state.pageSize, initialFilters);
    },

    fetchStudentsForMapping: async () => {
      const { showNotification } = useNotificationStore.getState();

      try {
        set({ studentsLoading: true });

        const response = await api.get('/api/admin/students');

        set({
          students: response.data.students || [],
          studentsLoading: false,
        });
      } catch (error: any) {
        set({ studentsLoading: false });
        const errorMessage = error.response?.data?.message || 'Failed to fetch students';
        showNotification(errorMessage, 'error');
        console.error('Fetch students error:', error);
      }
    },

    mapStudentsToMentor: async (mentorId: string, studentIds: string[]) => {
      const { showNotification } = useNotificationStore.getState();

      try {
        set({ isLoading: true });

        const response = await api.post('/api/admin/mappings', {
          mentorId,
          studentIds,
        });

        set({ isLoading: false });
        showNotification(`${response.data.count || 1} student(s) mapped successfully!`, 'success');

        const state = get();
        state.fetchMentors(state.currentPage, state.pageSize, state.filters);
      } catch (error: any) {
        set({ isLoading: false });
        const errorMessage = error.response?.data?.message || 'Failed to map students';
        showNotification(errorMessage, 'error');
        console.error('Map students error:', error);
      }
    },
  })
);