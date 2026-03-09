import { create } from 'zustand';
import api from '@/utils/api';
import { useNotificationStore } from '@/utils/notification';

// ==========================================
// TYPES
// ==========================================

export interface RankingEntry {
  rank: number;
  studentId: string;
  name: string;
  email: string;
  department: string;
  year: string;
  points: number;
  overallRank?: number;
  departmentRank?: number;
  isCurrentStudent: boolean;
}

export interface DepartmentRankingEntry {
  rank: number;
  studentId: string;
  name: string;
  email: string;
  year: string;
  points: number;
  isCurrentStudent: boolean;
}

export interface CurrentStudentRanking {
  overallRank: number;
  departmentRank: number;
}

export interface StudentRankingPosition {
  studentInfo: {
    id: string;
    name: string;
    department: string;
    year: string;
    totalPoints: number;
  };
  ranking: {
    overallRank: number;
    departmentRank: number;
    studentsAheadOverall: number;
    studentsAheadDepartment: number;
  };
  stats: {
    totalStudents: number;
    departmentStudents: number;
    percentile: number;
  };
}

export type RankingView = 'overall' | 'department';

interface Pagination {
  total: number;
  limit: number;
  skip: number;
}

// ==========================================
// STORE
// ==========================================

interface RankingsState {
  // Data
  rankings: RankingEntry[];
  departmentRankings: DepartmentRankingEntry[];
  currentStudentRanking: CurrentStudentRanking | null;
  myPosition: StudentRankingPosition | null;
  departmentName: string;

  // Filters & View
  activeView: RankingView;
  searchQuery: string;
  selectedYear: string;

  // Pagination
  pagination: Pagination;
  deptPagination: Pagination;

  // Loading
  isLoadingOverall: boolean;
  isLoadingDepartment: boolean;
  isLoadingPosition: boolean;

  // Actions
  fetchAllRankings: () => Promise<void>;
  fetchDepartmentRankings: () => Promise<void>;
  fetchMyPosition: () => Promise<void>;
  fetchAll: () => Promise<void>;

  // UI
  setActiveView: (view: RankingView) => void;
  setSearchQuery: (q: string) => void;
  setSelectedYear: (year: string) => void;
  setPage: (skip: number) => void;
  setDeptPage: (skip: number) => void;
}

export const useRankingsStore = create<RankingsState>((set, get) => ({
  rankings: [],
  departmentRankings: [],
  currentStudentRanking: null,
  myPosition: null,
  departmentName: '',
  activeView: 'overall',
  searchQuery: '',
  selectedYear: 'ALL',
  pagination: { total: 0, limit: 20, skip: 0 },
  deptPagination: { total: 0, limit: 20, skip: 0 },
  isLoadingOverall: false,
  isLoadingDepartment: false,
  isLoadingPosition: false,

  // ─── FETCH OVERALL ────────────────────────────────────────
  fetchAllRankings: async () => {
    const { showNotification } = useNotificationStore.getState();
    const { pagination } = get();

    try {
      set({ isLoadingOverall: true });

      const params = new URLSearchParams({
        limit: String(pagination.limit),
        skip: String(pagination.skip),
      });

      const res = await api.get(`/api/student/rankings?${params}`);
      if (res.data.success) {
        set({
          rankings: res.data.data.rankings,
          currentStudentRanking: res.data.data.currentStudentRanking,
          pagination: { ...pagination, total: res.data.data.pagination.total },
        });
      }
    } catch (error: any) {
      showNotification(error.response?.data?.message || 'Failed to fetch rankings', 'error');
    } finally {
      set({ isLoadingOverall: false });
    }
  },

  // ─── FETCH DEPARTMENT ─────────────────────────────────────
  fetchDepartmentRankings: async () => {
    const { showNotification } = useNotificationStore.getState();
    const { deptPagination } = get();

    try {
      set({ isLoadingDepartment: true });

      const params = new URLSearchParams({
        limit: String(deptPagination.limit),
        skip: String(deptPagination.skip),
      });

      const res = await api.get(`/api/student/rankings/department?${params}`);
      if (res.data.success) {
        set({
          departmentRankings: res.data.data.rankings,
          departmentName: res.data.data.department,
          deptPagination: { ...deptPagination, total: res.data.data.pagination.total },
        });
      }
    } catch (error: any) {
      showNotification(error.response?.data?.message || 'Failed to fetch department rankings', 'error');
    } finally {
      set({ isLoadingDepartment: false });
    }
  },

  // ─── FETCH MY POSITION ────────────────────────────────────
  fetchMyPosition: async () => {
    const { showNotification } = useNotificationStore.getState();
    try {
      set({ isLoadingPosition: true });
      const res = await api.get('/api/student/rankings/position');
      if (res.data.success) set({ myPosition: res.data.data });
    } catch (error: any) {
      showNotification(error.response?.data?.message || 'Failed to fetch ranking position', 'error');
    } finally {
      set({ isLoadingPosition: false });
    }
  },

  // ─── FETCH ALL ────────────────────────────────────────────
  fetchAll: async () => {
    await Promise.all([
      get().fetchAllRankings(),
      get().fetchDepartmentRankings(),
      get().fetchMyPosition(),
    ]);
  },

  // ─── UI ───────────────────────────────────────────────────
  setActiveView: (view) => set({ activeView: view }),

  setSearchQuery: (q) => set({ searchQuery: q }),

  setSelectedYear: (year) => set({ selectedYear: year }),

  setPage: (skip) => {
    set({ pagination: { ...get().pagination, skip } });
    get().fetchAllRankings();
  },

  setDeptPage: (skip) => {
    set({ deptPagination: { ...get().deptPagination, skip } });
    get().fetchDepartmentRankings();
  },
}));
