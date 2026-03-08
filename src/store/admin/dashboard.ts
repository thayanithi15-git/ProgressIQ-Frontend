import { create } from 'zustand';
import api from '@/utils/api';
import { useNotificationStore } from '@/utils/notification';

// ==========================================
// TYPES & INTERFACES
// ==========================================

export interface AdminStats {
  totalStudents: number;
  totalMentors: number;
  totalProjects: number;
  totalInternships: number;
  totalCertifications: number;
  aboveAvgCount: number;
  activeStudents: number;
  avgPoints: number;
}

export interface TopStudent {
  rank: number;
  name: string;
  email: string;
  department: string;
  year: string;
  designation: string;
  points: number;
  projectsCompleted: number;
  internshipsCompleted: number;
  certificationsEarned: number;
  departmentRank: number;
  overallRank: number;
  lastActive: string;
}

export interface ActivityData {
  date: string;
  hours: number;
  activities: number;
}

export interface PointsTrendData {
  date: string;
  points: number;
  awards: number;
}

export interface DepartmentDistribution {
  department: string;
  students: number;
  percentage: number;
}

export interface YearDistribution {
  year: string;
  students: number;
  percentage: number;
}

export interface ProjectStatus {
  status: string;
  count: number;
  percentage: number;
}

export interface InternshipType {
  type: string;
  count: number;
  percentage: number;
}

export interface MonthlySubmission {
  month: string;
  projects: number;
  internships: number;
  certifications: number;
}

export interface PointsBySource {
  source: string;
  points: number;
  awards: number;
}

export type TimeFilter = 'week' | 'month' | 'year' | 'all';
export type SubmissionFilter = '6months' | 'year' | 'all';

// ==========================================
// ZUSTAND STORE
// ==========================================

interface AdminDashboardState {
  // Data States
  stats: AdminStats | null;
  topStudents: TopStudent[];
  activityData: ActivityData[];
  pointsTrendData: PointsTrendData[];
  departmentDistribution: DepartmentDistribution[];
  yearDistribution: YearDistribution[];
  projectStatus: ProjectStatus[];
  internshipTypes: InternshipType[];
  monthlySubmissions: MonthlySubmission[];
  pointsBySource: PointsBySource[];

  // Filter States
  activityFilter: TimeFilter;
  pointsFilter: TimeFilter;
  projectStatusFilter: TimeFilter;
  submissionFilter: SubmissionFilter;
  pointsSourceFilter: TimeFilter;
  topStudentsLimit: number;

  // Loading States
  isLoadingStats: boolean;
  isLoadingStudents: boolean;
  isLoadingCharts: boolean;

  // Actions
  fetchStats: () => Promise<void>;
  fetchTopStudents: (limit?: number) => Promise<void>;
  fetchActivityChart: (filter?: TimeFilter) => Promise<void>;
  fetchPointsTrend: (filter?: TimeFilter) => Promise<void>;
  fetchDepartmentDistribution: () => Promise<void>;
  fetchYearDistribution: () => Promise<void>;
  fetchProjectStatus: (filter?: TimeFilter) => Promise<void>;
  fetchInternshipTypes: () => Promise<void>;
  fetchMonthlySubmissions: (filter?: SubmissionFilter) => Promise<void>;
  fetchPointsBySource: (filter?: TimeFilter) => Promise<void>;
  
  // Filter Actions
  setActivityFilter: (filter: TimeFilter) => void;
  setPointsFilter: (filter: TimeFilter) => void;
  setProjectStatusFilter: (filter: TimeFilter) => void;
  setSubmissionFilter: (filter: SubmissionFilter) => void;
  setPointsSourceFilter: (filter: TimeFilter) => void;
  setTopStudentsLimit: (limit: number) => void;

  // Utility Actions
  fetchAllData: () => Promise<void>;
  refreshDashboard: () => Promise<void>;
}

export const useAdminDashboardStore = create<AdminDashboardState>((set, get) => ({
  // Initial States
  stats: null,
  topStudents: [],
  activityData: [],
  pointsTrendData: [],
  departmentDistribution: [],
  yearDistribution: [],
  projectStatus: [],
  internshipTypes: [],
  monthlySubmissions: [],
  pointsBySource: [],

  // Initial Filters
  activityFilter: 'year',
  pointsFilter: 'year',
  projectStatusFilter: 'all',
  submissionFilter: 'all',
  pointsSourceFilter: 'all',
  topStudentsLimit: 10,

  // Initial Loading States
  isLoadingStats: false,
  isLoadingStudents: false,
  isLoadingCharts: false,

  // ==========================================
  // FETCH STATS
  // ==========================================
  fetchStats: async () => {
    const { showNotification } = useNotificationStore.getState();
    
    try {
      set({ isLoadingStats: true });
      
      const response = await api.get('/api/admin/stats');
      
      if (response.data.success) {
        set({ stats: response.data.data });
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch statistics';
      showNotification(message, 'error');
      console.error('Error fetching stats:', error);
    } finally {
      set({ isLoadingStats: false });
    }
  },

  // ==========================================
  // FETCH TOP STUDENTS
  // ==========================================
  fetchTopStudents: async (limit?: number) => {
    const { showNotification } = useNotificationStore.getState();
    const currentLimit = limit || get().topStudentsLimit;
    
    try {
      set({ isLoadingStudents: true });
      
      const response = await api.get(`/api/admin/top-students?limit=${currentLimit}`);
      
      if (response.data.success) {
        set({ topStudents: response.data.data });
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch top students';
      showNotification(message, 'error');
      console.error('Error fetching top students:', error);
    } finally {
      set({ isLoadingStudents: false });
    }
  },

  // ==========================================
  // FETCH ACTIVITY CHART
  // ==========================================
  fetchActivityChart: async (filter?: TimeFilter) => {
    const { showNotification } = useNotificationStore.getState();
    const currentFilter = filter || get().activityFilter;
    
    try {
      set({ isLoadingCharts: true });
      
      const response = await api.get(`/api/admin/charts/activities?filter=${currentFilter}`);
      
      if (response.data.success) {
        set({ activityData: response.data.data });
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch activity data';
      showNotification(message, 'error');
      console.error('Error fetching activity chart:', error);
    } finally {
      set({ isLoadingCharts: false });
    }
  },

  // ==========================================
  // FETCH POINTS TREND
  // ==========================================
  fetchPointsTrend: async (filter?: TimeFilter) => {
    const { showNotification } = useNotificationStore.getState();
    const currentFilter = filter || get().pointsFilter;
    
    try {
      set({ isLoadingCharts: true });
      
      const response = await api.get(`/api/admin/charts/points-trend?filter=${currentFilter}`);
      
      if (response.data.success) {
        set({ pointsTrendData: response.data.data });
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch points trend';
      showNotification(message, 'error');
      console.error('Error fetching points trend:', error);
    } finally {
      set({ isLoadingCharts: false });
    }
  },

  // ==========================================
  // FETCH DEPARTMENT DISTRIBUTION
  // ==========================================
  fetchDepartmentDistribution: async () => {
    const { showNotification } = useNotificationStore.getState();
    
    try {
      const response = await api.get('/api/admin/charts/department-distribution');
      
      if (response.data.success) {
        set({ departmentDistribution: response.data.data });
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch department data';
      showNotification(message, 'error');
      console.error('Error fetching department distribution:', error);
    }
  },

  // ==========================================
  // FETCH YEAR DISTRIBUTION
  // ==========================================
  fetchYearDistribution: async () => {
    const { showNotification } = useNotificationStore.getState();
    
    try {
      const response = await api.get('/api/admin/charts/year-distribution');
      
      if (response.data.success) {
        set({ yearDistribution: response.data.data });
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch year distribution';
      showNotification(message, 'error');
      console.error('Error fetching year distribution:', error);
    }
  },

  // ==========================================
  // FETCH PROJECT STATUS
  // ==========================================
  fetchProjectStatus: async (filter?: TimeFilter) => {
    const { showNotification } = useNotificationStore.getState();
    const currentFilter = filter || get().projectStatusFilter;
    
    try {
      const response = await api.get(`/api/admin/charts/project-status?filter=${currentFilter}`);
      
      if (response.data.success) {
        set({ projectStatus: response.data.data });
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch project status';
      showNotification(message, 'error');
      console.error('Error fetching project status:', error);
    }
  },

  // ==========================================
  // FETCH INTERNSHIP TYPES
  // ==========================================
  fetchInternshipTypes: async () => {
    const { showNotification } = useNotificationStore.getState();
    
    try {
      const response = await api.get('/api/admin/charts/internship-types');
      
      if (response.data.success) {
        set({ internshipTypes: response.data.data });
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch internship types';
      showNotification(message, 'error');
      console.error('Error fetching internship types:', error);
    }
  },

  // ==========================================
  // FETCH MONTHLY SUBMISSIONS
  // ==========================================
  fetchMonthlySubmissions: async (filter?: SubmissionFilter) => {
    const { showNotification } = useNotificationStore.getState();
    const currentFilter = filter || get().submissionFilter;
    
    try {
      set({ isLoadingCharts: true });
      
      const response = await api.get(`/api/admin/charts/monthly-submissions?filter=${currentFilter}`);
      
      if (response.data.success) {
        set({ monthlySubmissions: response.data.data });
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch monthly submissions';
      showNotification(message, 'error');
      console.error('Error fetching monthly submissions:', error);
    } finally {
      set({ isLoadingCharts: false });
    }
  },

  // ==========================================
  // FETCH POINTS BY SOURCE
  // ==========================================
  fetchPointsBySource: async (filter?: TimeFilter) => {
    const { showNotification } = useNotificationStore.getState();
    const currentFilter = filter || get().pointsSourceFilter;
    
    try {
      const response = await api.get(`/api/admin/charts/points-by-source?filter=${currentFilter}`);
      
      if (response.data.success) {
        set({ pointsBySource: response.data.data });
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch points by source';
      showNotification(message, 'error');
      console.error('Error fetching points by source:', error);
    }
  },

  // ==========================================
  // FILTER SETTERS
  // ==========================================
  setActivityFilter: (filter: TimeFilter) => {
    set({ activityFilter: filter });
    get().fetchActivityChart(filter);
  },

  setPointsFilter: (filter: TimeFilter) => {
    set({ pointsFilter: filter });
    get().fetchPointsTrend(filter);
  },

  setProjectStatusFilter: (filter: TimeFilter) => {
    set({ projectStatusFilter: filter });
    get().fetchProjectStatus(filter);
  },

  setSubmissionFilter: (filter: SubmissionFilter) => {
    set({ submissionFilter: filter });
    get().fetchMonthlySubmissions(filter);
  },

  setPointsSourceFilter: (filter: TimeFilter) => {
    set({ pointsSourceFilter: filter });
    get().fetchPointsBySource(filter);
  },

  setTopStudentsLimit: (limit: number) => {
    set({ topStudentsLimit: limit });
    get().fetchTopStudents(limit);
  },

  // ==========================================
  // FETCH ALL DATA
  // ==========================================
  fetchAllData: async () => {
    const state = get();
    
    await Promise.all([
      state.fetchStats(),
      state.fetchTopStudents(),
      state.fetchActivityChart(),
      state.fetchPointsTrend(),
      state.fetchDepartmentDistribution(),
      state.fetchYearDistribution(),
      state.fetchProjectStatus(),
      state.fetchInternshipTypes(),
      state.fetchMonthlySubmissions(),
      state.fetchPointsBySource(),
    ]);
  },

  // ==========================================
  // REFRESH DASHBOARD
  // ==========================================
  refreshDashboard: async () => {
    const { showNotification } = useNotificationStore.getState();
    
    try {
      showNotification('Refreshing dashboard...', 'pending');
      await get().fetchAllData();
      showNotification('Dashboard refreshed successfully', 'success');
    } catch (error) {
      showNotification('Failed to refresh dashboard', 'error');
      console.error('Error refreshing dashboard:', error);
    }
  },
}));