import api from '@/components/utils/api';
import { create } from 'zustand';

// Types for API responses
interface OverviewData {
  users: {
    total: number;
    verified: number;
    unverified: number;
    verificationRate: number;
  };
  machinery: {
    total: number;
    withFiles: number;
    utilizationRate: number;
  };
  files: {
    total: number;
    avgFilesPerMachinery: number;
  };
  partPrograms: {
    total: number;
    avgProgramsPerMachinery: number;
  };
  recentActivity: {
    newFiles: number;
    newPartPrograms: number;
    newUsers: number;
    period: string;
  };
}

interface QuickStatsData {
  totalUsers: number;
  verifiedUsers: number;
  unverifiedUsers: number;
  totalMachinery: number;
  totalFiles: number;
  totalPartPrograms: number;
  todayUploads: number;
  verificationRate: number;
}

interface MachineryStatsData {
  statusBreakdown: {
    inactive: number;
    maintenance: number;
    active: number;
  };
  recentMachinery: Array<{
    _id: string;
    name: string;
    model: string;
    status: string;
    location: string;
    createdBy: {
      _id: string;
      name: string;
    } | null;
    createdAt: string;
    passwords: Record<string, any>;
    passwordsSet: Record<string, any>;
  }>;
  machineryWithIssues: Array<{
    _id: string;
    name: string;
    model: string;
    status: string;
    location: string;
    passwords: Record<string, any>;
    passwordsSet: Record<string, any>;
  }>;
  passwordProtectedCount: number;
  totalVisible: number;
}

interface FileStatsData {
  files: {
    total: number;
    active: number;
    passwordProtected: number;
    typeBreakdown: Array<{
      _id: string;
      count: number;
      totalSize: number;
    }>;
    recent: Array<{
      _id: string;
      machinery: {
        _id: string;
        name: string;
        passwords: Record<string, any>;
        passwordsSet: Record<string, any>;
      };
      originalFileName: string;
      fileSize: number;
      uploadedBy: {
        _id: string;
        name: string;
      };
      fileType: string;
      createdAt: string;
    }>;
    largest: Array<{
      _id: string;
      machinery: {
        _id: string;
        name: string;
        passwords: Record<string, any>;
        passwordsSet: Record<string, any>;
      };
      originalFileName: string;
      fileSize: number;
      fileType: string;
    }>;
  };
  configs: {
    total: number;
    typeBreakdown: Array<{
      _id: string;
      count: number;
      totalSize: number;
    }>;
  };
}

interface BackupStatsData {
  total: number;
  statusBreakdown: Record<string, number>;
  recent: Array<any>;
  expired: Array<any>;
  storage: {
    totalSizeMB: number;
    averageSize: number;
  };
  trend: Array<any>;
}

interface ActivityData {
  stats: {
    total: number;
    period: string;
    statusBreakdown: {
      failed: number;
      success: number;
    };
    actionBreakdown: Array<{
      _id: string;
      count: number;
    }>;
    resourceTypeBreakdown: Record<string, number>;
    hourlyTrend: Array<{
      _id: number;
      count: number;
    }>;
    topUsers: Array<{
      _id: {
        userId: string;
        userName: string;
      };
      activityCount: number;
    }>;
  };
  recent: Array<{
    _id: string;
    userName: string;
    action: string;
    resource: string;
    resourceType: string;
    status: string;
    details: {
      errorMessage: string | null;
      requestBody: any;
      responseData: any;
      duration: number;
    };
    createdAt: string;
  }>;
}

interface SystemHealthData {
  database: {
    collections: {
      users: number;
      machinery: number;
      files: number;
      partPrograms: number;
    };
  };
  errors: {
    last24Hours: number;
    last7Days: number;
    errorRate: number;
  };
  performance: {
    avgResponseTime: number;
    uptime: number;
    requestsPerMinute: number;
  };
  storage: {
    totalSize: number;
    totalSizeGB: number;
    fileCount: number;
  };
}

interface StorageData {
  files: {
    totalSizeBytes: number;
    totalSizeMB: number;
    count: number;
    averageSizeMB: number;
  };
  configs: {
    totalSizeBytes: number;
    totalSizeMB: number;
    count: number;
  };
  backups: {
    totalSizeMB: number;
    count: number;
  };
  total: {
    totalSizeMB: number;
  };
}

interface UserStatsData {
  total: number;
  active: number;
  new: number;
  roleBreakdown: {
    admin: number;
    user: number;
  };
}

interface TrendsData {
  period: string;
  metric: string;
  trends: Array<{
    _id: {
      date: string;
      status: string;
    };
    count: number;
  }>;
  timestamp: string;
}

interface ExportData {
  exportDate: string;
  type: string;
  data: {
    exportDate: string;
    user: {
      id: string;
      role: string;
    };
    summary: any;
    machinery: any;
    systemHealth: any;
  };
}

// Store interface
interface DashboardStore {
  // Data
  overview: OverviewData | null;
  quickStats: QuickStatsData | null;
  machineryStats: MachineryStatsData | null;
  fileStats: FileStatsData | null;
  backupStats: BackupStatsData | null;
  activities: ActivityData | null;
  systemHealth: SystemHealthData | null;
  storage: StorageData | null;
  userStats: UserStatsData | null;
  trends: TrendsData | null;
  exportData: ExportData | null;

  // Loading states
  loading: {
    overview: boolean;
    quickStats: boolean;
    machineryStats: boolean;
    fileStats: boolean;
    backupStats: boolean;
    activities: boolean;
    systemHealth: boolean;
    storage: boolean;
    userStats: boolean;
    trends: boolean;
    exportData: boolean;
    all: boolean;
  };

  // Error states
  errors: {
    overview: string | null;
    quickStats: string | null;
    machineryStats: string | null;
    fileStats: string | null;
    backupStats: string | null;
    activities: string | null;
    systemHealth: string | null;
    storage: string | null;
    userStats: string | null;
    trends: string | null;
    exportData: string | null;
  };

  // Last updated
  lastUpdated: Date;

  // Actions
  fetchOverview: () => Promise<void>;
  fetchQuickStats: () => Promise<void>;
  fetchMachineryStats: () => Promise<void>;
  fetchFileStats: () => Promise<void>;
  fetchBackupStats: () => Promise<void>;
  fetchActivities: () => Promise<void>;
  fetchSystemHealth: () => Promise<void>;
  fetchStorage: () => Promise<void>;
  fetchUserStats: () => Promise<void>;
  fetchTrends: () => Promise<void>;
  fetchExportData: () => Promise<void>;
  fetchAllData: () => Promise<void>;
  refresh: () => void;
  clearErrors: () => void;
}

export const useDashboardStore = create<DashboardStore>((set, get) => ({
  // Initial state
  overview: null,
  quickStats: null,
  machineryStats: null,
  fileStats: null,
  backupStats: null,
  activities: null,
  systemHealth: null,
  storage: null,
  userStats: null,
  trends: null,
  exportData: null,

  loading: {
    overview: false,
    quickStats: false,
    machineryStats: false,
    fileStats: false,
    backupStats: false,
    activities: false,
    systemHealth: false,
    storage: false,
    userStats: false,
    trends: false,
    exportData: false,
    all: false,
  },

  errors: {
    overview: null,
    quickStats: null,
    machineryStats: null,
    fileStats: null,
    backupStats: null,
    activities: null,
    systemHealth: null,
    storage: null,
    userStats: null,
    trends: null,
    exportData: null,
  },

  lastUpdated: new Date(),

  // Actions
  fetchOverview: async () => {
    set((state) => ({
      loading: { ...state.loading, overview: true },
      errors: { ...state.errors, overview: null },
    }));

    try {
      const response = await api.get('dashboard/overview');
      const data = response.data.data; // Extract data from response

      set((state) => ({
        overview: data,
        loading: { ...state.loading, overview: false },
        lastUpdated: new Date(),
      }));
    } catch (error) {
      set((state) => ({
        loading: { ...state.loading, overview: false },
        errors: { ...state.errors, overview: error instanceof Error ? error.message : 'Failed to fetch overview' },
      }));
    }
  },

  fetchQuickStats: async () => {
    set((state) => ({
      loading: { ...state.loading, quickStats: true },
      errors: { ...state.errors, quickStats: null },
    }));

    try {
      const response = await api.get('dashboard/quick-stats');
      const data = response.data.data;

      set((state) => ({
        quickStats: data,
        loading: { ...state.loading, quickStats: false },
      }));
    } catch (error) {
      set((state) => ({
        loading: { ...state.loading, quickStats: false },
        errors: { ...state.errors, quickStats: error instanceof Error ? error.message : 'Failed to fetch quick stats' },
      }));
    }
  },

  fetchMachineryStats: async () => {
    set((state) => ({
      loading: { ...state.loading, machineryStats: true },
      errors: { ...state.errors, machineryStats: null },
    }));

    try {
      const response = await api.get('dashboard/machinery/stats');
      const data = response.data.data;

      set((state) => ({
        machineryStats: data,
        loading: { ...state.loading, machineryStats: false },
      }));
    } catch (error) {
      set((state) => ({
        loading: { ...state.loading, machineryStats: false },
        errors: { ...state.errors, machineryStats: error instanceof Error ? error.message : 'Failed to fetch machinery stats' },
      }));
    }
  },

  fetchFileStats: async () => {
    set((state) => ({
      loading: { ...state.loading, fileStats: true },
      errors: { ...state.errors, fileStats: null },
    }));

    try {
      const response = await api.get('dashboard/files/stats');
      const data = response.data.data;

      set((state) => ({
        fileStats: data,
        loading: { ...state.loading, fileStats: false },
      }));
    } catch (error) {
      set((state) => ({
        loading: { ...state.loading, fileStats: false },
        errors: { ...state.errors, fileStats: error instanceof Error ? error.message : 'Failed to fetch file stats' },
      }));
    }
  },

  fetchBackupStats: async () => {
    set((state) => ({
      loading: { ...state.loading, backupStats: true },
      errors: { ...state.errors, backupStats: null },
    }));

    try {
      const response = await api.get('dashboard/backups/stats');
      const data = response.data.data;

      set((state) => ({
        backupStats: data,
        loading: { ...state.loading, backupStats: false },
      }));
    } catch (error) {
      set((state) => ({
        loading: { ...state.loading, backupStats: false },
        errors: { ...state.errors, backupStats: error instanceof Error ? error.message : 'Failed to fetch backup stats' },
      }));
    }
  },

  fetchActivities: async () => {
    set((state) => ({
      loading: { ...state.loading, activities: true },
      errors: { ...state.errors, activities: null },
    }));

    try {
      const response = await api.get('dashboard/activities');
      const data = response.data.data;

      set((state) => ({
        activities: data,
        loading: { ...state.loading, activities: false },
      }));
    } catch (error) {
      set((state) => ({
        loading: { ...state.loading, activities: false },
        errors: { ...state.errors, activities: error instanceof Error ? error.message : 'Failed to fetch activities' },
      }));
    }
  },

  fetchSystemHealth: async () => {
    set((state) => ({
      loading: { ...state.loading, systemHealth: true },
      errors: { ...state.errors, systemHealth: null },
    }));

    try {
      const response = await api.get('dashboard/system-health');
      const data = response.data.data;

      set((state) => ({
        systemHealth: data,
        loading: { ...state.loading, systemHealth: false },
      }));
    } catch (error) {
      set((state) => ({
        loading: { ...state.loading, systemHealth: false },
        errors: { ...state.errors, systemHealth: error instanceof Error ? error.message : 'Failed to fetch system health' },
      }));
    }
  },

  fetchStorage: async () => {
    set((state) => ({
      loading: { ...state.loading, storage: true },
      errors: { ...state.errors, storage: null },
    }));

    try {
      const response = await api.get('dashboard/storage');
      const data = response.data.data;

      set((state) => ({
        storage: data,
        loading: { ...state.loading, storage: false },
      }));
    } catch (error) {
      set((state) => ({
        loading: { ...state.loading, storage: false },
        errors: { ...state.errors, storage: error instanceof Error ? error.message : 'Failed to fetch storage data' },
      }));
    }
  },

  fetchUserStats: async () => {
    set((state) => ({
      loading: { ...state.loading, userStats: true },
      errors: { ...state.errors, userStats: null },
    }));

    try {
      const response = await api.get('dashboard/users/stats');
      const data = response.data.data;

      set((state) => ({
        userStats: data,
        loading: { ...state.loading, userStats: false },
      }));
    } catch (error) {
      set((state) => ({
        loading: { ...state.loading, userStats: false },
        errors: { ...state.errors, userStats: error instanceof Error ? error.message : 'Failed to fetch user stats' },
      }));
    }
  },

  fetchTrends: async () => {
    set((state) => ({
      loading: { ...state.loading, trends: true },
      errors: { ...state.errors, trends: null },
    }));

    try {
      const response = await api.get('dashboard/trends');
      const data = response.data.data;

      set((state) => ({
        trends: data,
        loading: { ...state.loading, trends: false },
      }));
    } catch (error) {
      set((state) => ({
        loading: { ...state.loading, trends: false },
        errors: { ...state.errors, trends: error instanceof Error ? error.message : 'Failed to fetch trends' },
      }));
    }
  },

  fetchExportData: async () => {
    set((state) => ({
      loading: { ...state.loading, exportData: true },
      errors: { ...state.errors, exportData: null },
    }));

    try {
      const response = await api.get('dashboard/export');
      // Note: export endpoint has different response structure
      const data = {
        exportDate: response.data.exportDate,
        type: response.data.type,
        data: response.data.data
      };

      set((state) => ({
        exportData: data,
        loading: { ...state.loading, exportData: false },
      }));
    } catch (error) {
      set((state) => ({
        loading: { ...state.loading, exportData: false },
        errors: { ...state.errors, exportData: error instanceof Error ? error.message : 'Failed to fetch export data' },
      }));
    }
  },

  fetchAllData: async () => {
    set((state) => ({
      loading: { ...state.loading, all: true },
    }));

    const actions = [
      get().fetchOverview,
      get().fetchQuickStats,
      get().fetchMachineryStats,
      get().fetchFileStats,
      get().fetchBackupStats,
      get().fetchActivities,
      get().fetchSystemHealth,
      get().fetchStorage,
      get().fetchUserStats,
      get().fetchTrends,
    ];

    try {
      await Promise.allSettled(actions.map(action => action()));
    } finally {
      set((state) => ({
        loading: { ...state.loading, all: false },
        lastUpdated: new Date(),
      }));
    }
  },

  refresh: () => {
    get().fetchAllData();
  },

  clearErrors: () => {
    set({
      errors: {
        overview: null,
        quickStats: null,
        machineryStats: null,
        fileStats: null,
        backupStats: null,
        activities: null,
        systemHealth: null,
        storage: null,
        userStats: null,
        trends: null,
        exportData: null,
      },
    });
  },
}));