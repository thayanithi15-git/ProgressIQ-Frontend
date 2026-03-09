import { create } from 'zustand';
import api from '@/utils/api';
import { useNotificationStore } from '@/utils/notification';

// ==========================================
// TYPES & INTERFACES
// ==========================================

export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  department: string;
  year: string;
  phone: string;
  place: string;
  status: string;
  academicYear: string;
  avatarInitials?: string;
}

export interface MentorInfo {
  id: string;
  name: string;
  email: string;
  department: string;
  expertise: string[];
}

export interface StudentStats {
  totalPoints: number;
  totalHoursSpent: number;
  projects: {
    total: number;
    completed: number;
    pending: number;
    rejected: number;
  };
  tasks: {
    total: number;
    completed: number;
    pending: number;
    overdue: number;
  };
  certifications: {
    total: number;
    completed: number;
    pending: number;
    rejected: number;
  };
  internships: {
    total: number;
    completed: number;
    pending: number;
    rejected: number;
  };
  ranking: {
    overallRank: number;
    departmentRank: number;
  } | null;
}

export interface MonthlyActivity {
  month: string;
  hours: number;
}

export interface PointsBySource {
  source: string;
  points: number;
}

export interface HeatmapEntry {
  date: string;
  value: number;
  intensity: number;
}

export interface RecentFeedback {
  id: string;
  mentor: string;
  message: string;
  date: string;
}

export interface RecentActivity {
  date: string;
  activity: string;
  hoursSpent: number;
}

export interface PointsTrendEntry {
  date: string;
  points: number;
  awards: number;
}

export interface TaskCompletionEntry {
  month: string;
  completed: number;
  pending: number;
  overdue: number;
}

export type HeatmapYear = number;

// ==========================================
// ZUSTAND STORE
// ==========================================

interface StudentDashboardState {
  // Profile
  student: StudentProfile | null;
  mentor: MentorInfo | null;

  // Stats
  stats: StudentStats | null;

  // Charts
  monthlyActivity: MonthlyActivity[];
  pointsBySource: PointsBySource[];
  pointsTrend: PointsTrendEntry[];
  taskCompletion: TaskCompletionEntry[];

  // Heatmap
  heatmapData: HeatmapEntry[];
  heatmapYear: HeatmapYear;

  // Feeds
  recentFeedback: RecentFeedback[];
  recentActivities: RecentActivity[];

  // Filters
  pointsTrendFilter: 'week' | 'month' | 'year';
  activityFilter: 'week' | 'month' | 'year';

  // Loading States
  isLoadingProfile: boolean;
  isLoadingStats: boolean;
  isLoadingCharts: boolean;
  isLoadingHeatmap: boolean;

  // Actions
  fetchDashboard: () => Promise<void>;
  fetchHeatmap: (year?: number) => Promise<void>;
  fetchPointsTrend: (filter?: 'week' | 'month' | 'year') => Promise<void>;
  fetchActivityChart: (filter?: 'week' | 'month' | 'year') => Promise<void>;
  fetchTaskCompletion: () => Promise<void>;

  // Filter Setters
  setHeatmapYear: (year: number) => void;
  setPointsTrendFilter: (filter: 'week' | 'month' | 'year') => void;
  setActivityFilter: (filter: 'week' | 'month' | 'year') => void;

  // Utility
  refreshDashboard: () => Promise<void>;
}

export const useStudentDashboardStore = create<StudentDashboardState>((set, get) => ({
  // Initial States
  student: null,
  mentor: null,
  stats: null,
  monthlyActivity: [],
  pointsBySource: [],
  pointsTrend: [],
  taskCompletion: [],
  heatmapData: [],
  heatmapYear: new Date().getFullYear(),
  recentFeedback: [],
  recentActivities: [],
  pointsTrendFilter: 'year',
  activityFilter: 'year',
  isLoadingProfile: false,
  isLoadingStats: false,
  isLoadingCharts: false,
  isLoadingHeatmap: false,

  // ==========================================
  // FETCH DASHBOARD (main)
  // ==========================================
  fetchDashboard: async () => {
    const { showNotification } = useNotificationStore.getState();

    try {
      set({ isLoadingProfile: true, isLoadingStats: true, isLoadingCharts: true });

      const response = await api.get('/api/student/dashboard');

      if (response.data.success) {
        const { student, mentor, stats, charts, heatmap, recentFeedback, recentActivities } =
          response.data.data;

        set({
          student,
          mentor,
          stats,
          monthlyActivity: charts?.monthlyActivity ?? [],
          pointsBySource: charts?.pointsBySource ?? [],
          heatmapData: heatmap ?? [],
          recentFeedback: recentFeedback ?? [],
          recentActivities: recentActivities ?? [],
        });
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch dashboard';
      showNotification(message, 'error');
      console.error('Error fetching student dashboard:', error);
    } finally {
      set({ isLoadingProfile: false, isLoadingStats: false, isLoadingCharts: false });
    }
  },

  // ==========================================
  // FETCH HEATMAP
  // ==========================================
  fetchHeatmap: async (year?: number) => {
    const { showNotification } = useNotificationStore.getState();
    const currentYear = year ?? get().heatmapYear;

    try {
      set({ isLoadingHeatmap: true });

      const response = await api.get(`/api/student/heatmap?year=${currentYear}`);

      if (response.data.success) {
        set({ heatmapData: response.data.data });
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch heatmap data';
      showNotification(message, 'error');
      console.error('Error fetching heatmap:', error);
    } finally {
      set({ isLoadingHeatmap: false });
    }
  },

  // ==========================================
  // FETCH POINTS TREND
  // ==========================================
  fetchPointsTrend: async (filter?: 'week' | 'month' | 'year') => {
    const { showNotification } = useNotificationStore.getState();
    const currentFilter = filter ?? get().pointsTrendFilter;

    try {
      set({ isLoadingCharts: true });

      const response = await api.get(`/api/student/charts/points-trend?filter=${currentFilter}`);

      if (response.data.success) {
        set({ pointsTrend: response.data.data });
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
  // FETCH ACTIVITY CHART
  // ==========================================
  fetchActivityChart: async (filter?: 'week' | 'month' | 'year') => {
    const { showNotification } = useNotificationStore.getState();
    const currentFilter = filter ?? get().activityFilter;

    try {
      set({ isLoadingCharts: true });

      const response = await api.get(
        `/api/student/charts/monthly-activity?filter=${currentFilter}`
      );

      if (response.data.success) {
        set({ monthlyActivity: response.data.data });
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch activity chart';
      showNotification(message, 'error');
      console.error('Error fetching activity chart:', error);
    } finally {
      set({ isLoadingCharts: false });
    }
  },

  // ==========================================
  // FETCH TASK COMPLETION
  // ==========================================
  fetchTaskCompletion: async () => {
    const { showNotification } = useNotificationStore.getState();

    try {
      const response = await api.get('/api/student/charts/task-completion');

      if (response.data.success) {
        set({ taskCompletion: response.data.data });
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch task completion';
      showNotification(message, 'error');
      console.error('Error fetching task completion:', error);
    }
  },

  // ==========================================
  // FILTER SETTERS
  // ==========================================
  setHeatmapYear: (year: number) => {
    set({ heatmapYear: year });
    get().fetchHeatmap(year);
  },

  setPointsTrendFilter: (filter: 'week' | 'month' | 'year') => {
    set({ pointsTrendFilter: filter });
    get().fetchPointsTrend(filter);
  },

  setActivityFilter: (filter: 'week' | 'month' | 'year') => {
    set({ activityFilter: filter });
    get().fetchActivityChart(filter);
  },

  // ==========================================
  // REFRESH DASHBOARD
  // ==========================================
  refreshDashboard: async () => {
    const { showNotification } = useNotificationStore.getState();

    try {
      showNotification('Refreshing dashboard...', 'pending');

      await Promise.all([
        get().fetchDashboard(),
        get().fetchHeatmap(),
        get().fetchPointsTrend(),
        get().fetchTaskCompletion(),
      ]);

      showNotification('Dashboard refreshed successfully', 'success');
    } catch (error) {
      showNotification('Failed to refresh dashboard', 'error');
      console.error('Error refreshing student dashboard:', error);
    }
  },
}));
