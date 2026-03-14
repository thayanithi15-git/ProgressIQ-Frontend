import { create } from 'zustand';
import api from '@/utils/api';
import { useNotificationStore } from '@/utils/notification';

export interface StudentListItem {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  year: string;
  academicYear: string;
  phone: string;
  place: string;
  points: number;
  projectsCompleted: number;
  tasksCompleted: number;
  certificationsCompleted: number;
  internshipsCompleted: number;
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
  lastActive: string;
  status: 'Active' | 'Inactive';
}

export interface StudentProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  year: string;
  academicYear: string;
  phone: string;
  place: string;
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
  status: string;
}

export interface StudentStats {
  totalPoints: number;
  projects: { total: number; approved: number; pending: number };
  tasks: { total: number; approved: number; pending: number };
  certifications: { total: number; approved: number; pending: number };
  internships: { total: number; approved: number; pending: number };
}

interface AssignedStudentsState {
  // Data
  students: StudentListItem[];
  selectedStudent: { profile: StudentProfile; stats: StudentStats; recent: any } | null;

  // Filters
  searchQuery: string;
  department: string;
  year: string;
  status: string;
  minPoints: number | null;
  maxPoints: number | null;
  sortBy: 'name' | 'points' | 'department' | 'year';
  sortOrder: 'asc' | 'desc';
  rollNo: string;
  familyIncome: string;
  minCgpa: number | null;
  maxArrears: number | null;
  goodAt: string;

  // Pagination
  page: number;
  limit: number;
  total: number;
  totalPages: number;

  // Loading
  isLoading: boolean;
  isLoadingProfile: boolean;

  // Actions
  fetchStudents: () => Promise<void>;
  fetchStudentProfile: (studentId: string) => Promise<void>;
  setSearchQuery: (query: string) => void;
  setDepartment: (dept: string) => void;
  setYear: (year: string) => void;
  setStatus: (status: string) => void;
  setMinPoints: (min: number | null) => void;
  setMaxPoints: (max: number | null) => void;
  setSortBy: (by: 'name' | 'points' | 'department' | 'year') => void;
  setSortOrder: (order: 'asc' | 'desc') => void;
  setRollNo: (rollNo: string) => void;
  setFamilyIncome: (income: string) => void;
  setMinCgpa: (cgpa: number | null) => void;
  setMaxArrears: (arrears: number | null) => void;
  setGoodAt: (skills: string) => void;
  setPage: (page: number) => void;
  resetFilters: () => void;
  closeProfileModal: () => void;
}

export const useAssignedStudentsStore = create<AssignedStudentsState>((set, get) => ({
  // Initial States
  students: [],
  selectedStudent: null,

  searchQuery: '',
  department: '',
  year: '',
  status: '',
  minPoints: null,
  maxPoints: null,
  sortBy: 'name',
  sortOrder: 'asc',
  rollNo: '',
  familyIncome: '',
  minCgpa: null,
  maxArrears: null,
  goodAt: '',

  page: 1,
  limit: 20,
  total: 0,
  totalPages: 0,

  isLoading: false,
  isLoadingProfile: false,

  // =====================================
  // FETCH STUDENTS
  // =====================================
  fetchStudents: async () => {
    const { showNotification } = useNotificationStore.getState();
    const state = get();

    try {
      set({ isLoading: true });

      const params = new URLSearchParams({
        page: state.page.toString(),
        limit: state.limit.toString(),
        search: state.searchQuery,
        ...(state.department && { department: state.department }),
        ...(state.year && { year: state.year }),
        ...(state.status && { status: state.status }),
        ...(state.minPoints !== null && { minPoints: state.minPoints.toString() }),
        ...(state.maxPoints !== null && { maxPoints: state.maxPoints.toString() }),
        sortBy: state.sortBy,
        sortOrder: state.sortOrder,
        ...(state.rollNo && { rollNo: state.rollNo }),
        ...(state.familyIncome && { familyIncome: state.familyIncome }),
        ...(state.minCgpa !== null && { minCgpa: state.minCgpa.toString() }),
        ...(state.maxArrears !== null && { maxArrears: state.maxArrears.toString() }),
        ...(state.goodAt && { goodAt: state.goodAt }),
      });

      const response = await api.get(`/api/mentor/assigned-students?${params}`);

      if (response.data.success) {
        set({
          students: response.data.data,
          total: response.data.pagination?.total || 0,
          totalPages: response.data.pagination?.totalPages || 0,
        });
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch students';
      showNotification(message, 'error');
      console.error('Error fetching students:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  // =====================================
  // FETCH STUDENT PROFILE
  // =====================================
  fetchStudentProfile: async (studentId: string) => {
    const { showNotification } = useNotificationStore.getState();

    try {
      set({ isLoadingProfile: true });

      const response = await api.get(`/api/mentor/assigned-students/${studentId}`);

      if (response.data.success) {
        set({ selectedStudent: response.data.data });
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch student profile';
      showNotification(message, 'error');
      console.error('Error fetching student profile:', error);
    } finally {
      set({ isLoadingProfile: false });
    }
  },

  // =====================================
  // FILTER ACTIONS
  // =====================================
  setSearchQuery: (query: string) => {
    set({ searchQuery: query, page: 1 });
    get().fetchStudents();
  },

  setDepartment: (dept: string) => {
    set({ department: dept, page: 1 });
    get().fetchStudents();
  },

  setYear: (year: string) => {
    set({ year, page: 1 });
    get().fetchStudents();
  },

  setStatus: (status: string) => {
    set({ status, page: 1 });
    get().fetchStudents();
  },

  setMinPoints: (min: number | null) => {
    set({ minPoints: min, page: 1 });
    get().fetchStudents();
  },

  setMaxPoints: (max: number | null) => {
    set({ maxPoints: max, page: 1 });
    get().fetchStudents();
  },

  setSortBy: (by: 'name' | 'points' | 'department' | 'year') => {
    set({ sortBy: by, page: 1 });
    get().fetchStudents();
  },

  setSortOrder: (order: 'asc' | 'desc') => {
    set({ sortOrder: order, page: 1 });
    get().fetchStudents();
  },

  setRollNo: (rollNo: string) => {
    set({ rollNo, page: 1 });
    get().fetchStudents();
  },

  setFamilyIncome: (familyIncome: string) => {
    set({ familyIncome, page: 1 });
    get().fetchStudents();
  },

  setMinCgpa: (minCgpa: number | null) => {
    set({ minCgpa, page: 1 });
    get().fetchStudents();
  },

  setMaxArrears: (maxArrears: number | null) => {
    set({ maxArrears, page: 1 });
    get().fetchStudents();
  },

  setGoodAt: (goodAt: string) => {
    set({ goodAt, page: 1 });
    get().fetchStudents();
  },

  setPage: (page: number) => {
    set({ page });
    get().fetchStudents();
  },

  // =====================================
  // RESET FILTERS
  // =====================================
  resetFilters: () => {
    set({
      searchQuery: '',
      department: '',
      year: '',
      status: '',
      minPoints: null,
      maxPoints: null,
      sortBy: 'name',
      sortOrder: 'asc',
      rollNo: '',
      familyIncome: '',
      minCgpa: null,
      maxArrears: null,
      goodAt: '',
      page: 1,
    });
    get().fetchStudents();
  },

  // =====================================
  // CLOSE PROFILE MODAL
  // =====================================
  closeProfileModal: () => {
    set({ selectedStudent: null });
  },
}));