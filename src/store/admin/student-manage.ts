import api from '@/utils/api';
import { useNotificationStore } from '@/utils/notification';
import { create } from 'zustand';

export interface UserId {
  _id: string;
  email: string;
}

export interface Student {
  _id: string;
  userId: UserId | null;
  firstName: string;
  lastName: string;
  phone: string;
  parentName: string;
  parentPhone: string;
  place: string;
  department: string;
  year: string;
  academicYear: string;
  rollNo: string;
  cgpa: number;
  arrearCount: number;
  familyIncome: string;
  goodAt: string[];
  socials?: {
    github?: string;
    linkedin?: string;
    leetcode?: string;
    codechef?: string;
    portfolio?: string;
  };
  rewardPoints: number;
  status: string;
  createdAt: string;
}

export interface CreateStudentPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  gender: string;
  dob: string;
  phone: string;
  parentName: string;
  parentPhone: string;
  place: string;
  department: string;
  year: string;
  academicYear: string;
  rollNo: string;
  cgpa: number;
  arrearCount: number;
  familyIncome: string;
  goodAt: string[];
}

export interface UpdateStudentPayload {
  email?: string;
  firstName?: string;
  lastName?: string;
  gender?: string;
  dob?: string;
  phone?: string;
  parentName?: string;
  parentPhone?: string;
  place?: string;
  department?: string;
  year?: string;
  academicYear?: string;
  rollNo?: string;
  cgpa?: number;
  arrearCount?: number;
  familyIncome?: string;
  goodAt?: string[];
  status?: string;
  rewardPoints?: number;
}

export interface StudentFilters {
  department?: string;
  year?: string;
  status?: string;
  searchEmail?: string;
  searchName?: string;
  minRewardPoints?: number;
  maxRewardPoints?: number;
  sortBy?: 'name' | 'points' | 'created' | 'department';
  rollNo?: string;
  familyIncome?: string;
  minCgpa?: number;
  maxArrears?: number;
  goodAt?: string;
}

interface StudentManagementState {
  students: Student[];
  currentStudent: Student | null;
  total: number;
  isLoading: boolean;
  currentPage: number;
  pageSize: number;
  filters: StudentFilters;
  viewMode: 'list' | 'profile';

  // API Methods
  fetchStudents: (page: number, limit: number, filters?: StudentFilters) => Promise<void>;
  fetchStudentById: (studentId: string) => Promise<void>;
  createStudent: (data: CreateStudentPayload) => Promise<Student | null>;
  updateStudent: (studentId: string, data: UpdateStudentPayload) => Promise<void>;
  deleteStudent: (studentId: string) => Promise<void>;
  bulkUpload: (students: Partial<CreateStudentPayload>[]) => Promise<{ success: number; failed: number; errors: any[] } | null>;

  // State Management
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setFilters: (filters: StudentFilters) => void;
  setViewMode: (mode: 'list' | 'profile') => void;
  setCurrentStudent: (student: Student | null) => void;
  resetFilters: () => void;
}

const initialFilters: StudentFilters = {
  department: undefined,
  year: undefined,
  status: undefined,
  searchEmail: '',
  searchName: '',
};

export const useStudentManagementStore = create<StudentManagementState>(
  (set, get) => ({
    students: [],
    currentStudent: null,
    total: 0,
    isLoading: false,
    currentPage: 1,
    pageSize: 10,
    filters: initialFilters,
    viewMode: 'list',

    fetchStudents: async (page: number, limit: number, filters?: StudentFilters) => {
      const { showNotification } = useNotificationStore.getState();

      try {
        set({ isLoading: true });

        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });

        if (filters?.department) {
          params.append('department', filters.department);
        }
        if (filters?.year) {
          params.append('year', filters.year);
        }
        if (filters?.status) {
          params.append('status', filters.status);
        }
        if (filters?.searchEmail) {
          params.append('email', filters.searchEmail);
        }
        if (filters?.searchName) {
          params.append('name', filters.searchName);
        }
        if (filters?.minRewardPoints !== undefined) {
          params.append('minPoints', filters.minRewardPoints.toString());
        }
        if (filters?.maxRewardPoints !== undefined) {
          params.append('maxPoints', filters.maxRewardPoints.toString());
        }
        if (filters?.sortBy) {
          params.append('sortBy', filters.sortBy);
        }
        if (filters?.rollNo) {
          params.append('rollNo', filters.rollNo);
        }
        if (filters?.familyIncome) {
          params.append('familyIncome', filters.familyIncome);
        }
        if (filters?.minCgpa !== undefined) {
          params.append('minCgpa', filters.minCgpa.toString());
        }
        if (filters?.maxArrears !== undefined) {
          params.append('maxArrears', filters.maxArrears.toString());
        }
        if (filters?.goodAt) {
          params.append('goodAt', filters.goodAt);
        }

        const response = await api.get(`/api/admin/students?${params.toString()}`);

        set({
          students: response.data.students || [],
          total: response.data.total || 0,
          currentPage: page,
          isLoading: false,
        });
      } catch (error: any) {
        set({ isLoading: false });
        const errorMessage = error.response?.data?.message || 'Failed to fetch students';
        showNotification(errorMessage, 'error');
        console.error('Fetch students error:', error);
      }
    },

    fetchStudentById: async (studentId: string) => {
      const { showNotification } = useNotificationStore.getState();

      try {
        set({ isLoading: true });

        const response = await api.get(`/api/admin/students/${studentId}`);

        set({
          currentStudent: response.data.student,
          viewMode: 'profile',
          isLoading: false,
        });
      } catch (error: any) {
        set({ isLoading: false });
        const errorMessage = error.response?.data?.message || 'Failed to fetch student';
        showNotification(errorMessage, 'error');
      }
    },

    createStudent: async (data: CreateStudentPayload) => {
      const { showNotification } = useNotificationStore.getState();

      try {
        set({ isLoading: true });

        const response = await api.post('/api/admin/students', data);

        set({ isLoading: false });
        showNotification('Student created successfully!', 'success');

        const state = get();
        state.fetchStudents(state.currentPage, state.pageSize, state.filters);

        return response.data.student as Student;
      } catch (error: any) {
        set({ isLoading: false });
        const errorMessage = error.response?.data?.message || 'Failed to create student';
        showNotification(errorMessage, 'error');
        return null;
      }
    },

    updateStudent: async (studentId: string, data: UpdateStudentPayload) => {
      const { showNotification } = useNotificationStore.getState();

      try {
        set({ isLoading: true });

        const response = await api.put(`/api/admin/students/${studentId}`, data);

        set({ isLoading: false, currentStudent: response.data.student });
        showNotification('Student updated successfully!', 'success');

        const state = get();
        state.fetchStudents(state.currentPage, state.pageSize, state.filters);
      } catch (error: any) {
        set({ isLoading: false });
        const errorMessage = error.response?.data?.message || 'Failed to update student';
        showNotification(errorMessage, 'error');
      }
    },

    deleteStudent: async (studentId: string) => {
      const { showNotification } = useNotificationStore.getState();

      try {
        set({ isLoading: true });

        await api.delete(`/api/admin/students/${studentId}`);

        set({ isLoading: false });
        showNotification('Student deleted successfully!', 'success');

        const state = get();
        state.fetchStudents(state.currentPage, state.pageSize, state.filters);
      } catch (error: any) {
        set({ isLoading: false });
        const errorMessage = error.response?.data?.message || 'Failed to delete student';
        showNotification(errorMessage, 'error');
      }
    },

    bulkUpload: async (studentsArray: Partial<CreateStudentPayload>[]) => {
      const { showNotification } = useNotificationStore.getState();
      try {
        set({ isLoading: true });
        const response = await api.post('/api/admin/students/bulk', { students: studentsArray });
        set({ isLoading: false });
        
        const { results } = response.data;
        if (results.success > 0) {
          showNotification(`Successfully uploaded ${results.success} students!`, 'success');
        }
        if (results.failed > 0) {
          showNotification(`Failed to upload ${results.failed} students ${results.failed > 0 ? '(check errors)' : ''}.`, results.failed > 0 ? 'error' : 'success');
        }
        
        const state = get();
        state.fetchStudents(state.currentPage, state.pageSize, state.filters);
        return results;
      } catch (error: any) {
        set({ isLoading: false });
        const errorMessage = error.response?.data?.message || 'Failed to bulk upload students';
        showNotification(errorMessage, 'error');
        return null;
      }
    },

    setCurrentPage: (page: number) => {
      const state = get();
      set({ currentPage: page });
      state.fetchStudents(page, state.pageSize, state.filters);
    },

    setPageSize: (size: number) => {
      const state = get();
      set({ pageSize: size, currentPage: 1 });
      state.fetchStudents(1, size, state.filters);
    },

    setFilters: (filters: StudentFilters) => {
      set({ filters, currentPage: 1 });
      const state = get();
      state.fetchStudents(1, state.pageSize, filters);
    },

    setViewMode: (mode: 'list' | 'profile') => {
      set({ viewMode: mode });
    },

    setCurrentStudent: (student: Student | null) => {
      set({ currentStudent: student });
    },

    resetFilters: () => {
      set({ filters: initialFilters, currentPage: 1 });
      const state = get();
      state.fetchStudents(1, state.pageSize, initialFilters);
    },
  })
);