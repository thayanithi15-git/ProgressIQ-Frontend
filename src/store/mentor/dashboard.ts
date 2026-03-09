import { create } from 'zustand';
import api from '@/utils/api';
import { useNotificationStore } from '@/utils/notification';

export interface MentorStats {
  totalAssignedStudents: number;
  totalProjects: number;
  totalTasks: number;
  totalInternships: number;
  totalCertifications: number;
  pendingApprovals: number;
  completedProjects: number;
  activeStudents: number;
}

export interface TopStudent {
  studentId: string;
  name: string;
  department: string;
  year: string;
  points: number;
}

export interface ActivityData {
  date: string;
  approvals: number;
  approved: number;
  rejected: number;
  feedback: number;
}

export interface PointsTrendData {
  date: string;
  points: number;
  awards: number;
}

export interface WorkProgressData {
  month: string;
  project: number;
  task: number;
  internship: number;
  certification: number;
  approved: number;
  rejected: number;
  pending: number;
  total: number;
}

export interface ApprovalStats {
  modules: {
    projects: { total: number; approved: number; rejected: number; pending: number };
    tasks: { total: number; approved: number; rejected: number; pending: number };
    internships: { total: number; approved: number; rejected: number; pending: number };
    certifications: { total: number; approved: number; rejected: number; pending: number };
  };
}

interface MentorDashboardState {
  // Data
  stats: MentorStats | null;
  topStudents: TopStudent[];
  activityData: ActivityData[];
  pointsTrendData: PointsTrendData[];
  workProgressData: WorkProgressData[];
  approvalStats: ApprovalStats | null;

  // Loading
  isLoading: boolean;
  isLoadingStats: boolean;
  isLoadingCharts: boolean;

  // Actions
  fetchStats: () => Promise<void>;
  fetchAllData: () => Promise<void>;
  refreshDashboard: () => Promise<void>;
}

export const useMentorDashboardStore = create<MentorDashboardState>((set, get) => ({
  // Initial States
  stats: null,
  topStudents: [],
  activityData: [],
  pointsTrendData: [],
  workProgressData: [],
  approvalStats: null,

  isLoading: false,
  isLoadingStats: false,
  isLoadingCharts: false,

  // =====================================
  // FETCH STATS
  // =====================================
  fetchStats: async () => {
    const { showNotification } = useNotificationStore.getState();

    try {
      set({ isLoadingStats: true });

      const response = await api.get('/api/mentor/stats');

      if (response.data.success) {
        const data = response.data.data;
        set({
          stats: {
            totalAssignedStudents: data.totalAssignedStudents,
            totalProjects: data.totalProjects,
            totalTasks: data.totalTasks,
            totalInternships: data.totalInternships,
            totalCertifications: data.totalCertifications,
            pendingApprovals: data.pendingApprovals,
            completedProjects: data.completedProjects,
            activeStudents: data.activeStudents,
          },
          topStudents: data.topStudents || [],
          activityData: data.charts?.approvalTrend || [],
          pointsTrendData: data.charts?.pointsTrend || [],
          workProgressData: data.charts?.workProgressMonthly || [],
        });
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch stats';
      showNotification(message, 'error');
      console.error('Error fetching stats:', error);
    } finally {
      set({ isLoadingStats: false });
    }
  },

  // =====================================
  // FETCH ALL DATA
  // =====================================
  fetchAllData: async () => {
    const state = get();
    await state.fetchStats();
  },

  // =====================================
  // REFRESH DASHBOARD
  // =====================================
  refreshDashboard: async () => {
    const { showNotification } = useNotificationStore.getState();

    try {
      showNotification('Refreshing dashboard...', 'pending');
      set({ isLoading: true });
      await get().fetchAllData();
      showNotification('Dashboard refreshed successfully', 'success');
    } catch (error) {
      showNotification('Failed to refresh dashboard', 'error');
      console.error('Error refreshing dashboard:', error);
    } finally {
      set({ isLoading: false });
    }
  },
}));