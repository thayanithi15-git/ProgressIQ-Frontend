import api from "@/components/utils/api";
import { create } from "zustand";

interface BackupMetadata {
  compressionType: string;
  backupMethod: string;
}

interface BackupItem {
  _id: string;
  backupId: string;
  fileName: string;
  originalName: string;
  filePath: string;
  description: string;
  databaseName: string;
  collections: string[];
  size: number;
  sizeMB: number;
  fileHash?: string;
  bucketName: string;
  backupType: string;
  status: 'completed' | 'in_progress' | 'failed' | 'pending';
  createdBy: string | null;
  retentionPeriod: number;
  isExpired: boolean;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  lastAccessedAt?: string;
  metadata: BackupMetadata;
}

// Updated BackupStats interface to match API response
interface BackupStats {
  totalBackups: number;
  completedBackups: number;
  failedBackups: number;
  pendingBackups: number;
  recentBackups: number;
  totalSize: {
    bytes: number;
    mb: number;
    gb: number;
  };
  averageSizeMB: string;
  dateRange: {
    oldest: string;
    newest: string;
  };
  collectionStats: Array<{
    _id: string;
    count: number;
    avgSize: number;
    totalSize: number;
  }>;
  successRate: number;
  serviceStatus?: {
    isRunning: boolean;
    isBackupInProgress: boolean;
    config: {
      cronSchedule: string;
      maxBackups: number;
      collections: string[];
      autoCleanup: boolean;
      encryptionEnabled: boolean;
      compressionEnabled: boolean;
    };
    backupType: string;
    nextBackupSchedule: string;
    backupBucket: string;
    encryptionEnabled: boolean;
    compressionEnabled: boolean;
    totalCollections: number;
  };
  securityFeatures?: {
    method: string;
    encryption: boolean;
    compression: boolean;
    commandInjectionPrevention: boolean;
  };
}

interface BackupListResponse {
  backups: BackupItem[];
  pagination: {
    current: number;
    total: number;
    totalItems: number;
  };
}

interface BackupStore {
  // Data
  stats: BackupStats | null;
  backups: BackupItem[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  } | null;

  // Loading states
  loading: boolean;
  statsLoading: boolean;
  backupsLoading: boolean;
  error: string | null;

  // Filters
  statusFilter: string;
  typeFilter: string;
  searchTerm: string;

  // Actions
  fetchStats: () => Promise<void>;
  fetchBackups: (page?: number, limit?: number) => Promise<void>;
  refreshData: () => Promise<void>;
  
  // Filters
  setStatusFilter: (status: string) => void;
  setTypeFilter: (type: string) => void;
  setSearchTerm: (term: string) => void;
  clearFilters: () => void;

  // Utility
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Backup actions
  createBackup: (type: string, description?: string) => Promise<void>;
  deleteBackup: (backupId: string) => Promise<void>;
  downloadBackup: (backupId: string) => Promise<void>;
}

// Helper function to transform API stats to expected format
const transformStatsData = (apiData: any): BackupStats => {
  const statistics = apiData.statistics || [];
  const recentBackups = apiData.recentBackups || [];
  
  // Calculate stats from statistics array
  const completedStat = statistics.find((s: any) => s._id === 'completed');
  const failedStat = statistics.find((s: any) => s._id === 'failed');
  const pendingStat = statistics.find((s: any) => s._id === 'pending');
  const inProgressStat = statistics.find((s: any) => s._id === 'in_progress');
  
  const completedBackups = completedStat?.count || 0;
  const failedBackups = failedStat?.count || 0;
  const pendingBackups = pendingStat?.count || 0;
  const inProgressBackups = inProgressStat?.count || 0;
  
  const totalBackups = completedBackups + failedBackups + pendingBackups + inProgressBackups;
  
  // Calculate total size from statistics
  const totalSizeBytes = statistics.reduce((acc: number, stat: any) => acc + (stat.totalSize || 0), 0);
  
  // Calculate success rate
  const successRate = totalBackups > 0 ? Math.round((completedBackups / totalBackups) * 100) : 0;
  
  // Get date range from recent backups
  const dates = recentBackups.map((backup: any) => backup.createdAt).sort();
  const dateRange = {
    oldest: dates[0] || new Date().toISOString(),
    newest: dates[dates.length - 1] || new Date().toISOString()
  };
  
  // Calculate average size
  const averageSizeMB = totalBackups > 0 ? 
    ((totalSizeBytes / (1024 * 1024)) / totalBackups).toFixed(2) : '0';
  
  // Create collection stats from service config
  const collections = apiData.serviceStatus?.config?.collections || [];
  const collectionStats = collections.map((collection: string) => ({
    _id: collection,
    count: Math.floor(totalBackups / collections.length), // Rough estimate
    avgSize: parseFloat(averageSizeMB),
    totalSize: totalSizeBytes / (1024 * 1024) / collections.length // Rough estimate in MB
  }));

  return {
    totalBackups,
    completedBackups,
    failedBackups,
    pendingBackups,
    recentBackups: recentBackups.length,
    totalSize: {
      bytes: totalSizeBytes,
      mb: totalSizeBytes / (1024 * 1024),
      gb: totalSizeBytes / (1024 * 1024 * 1024)
    },
    averageSizeMB,
    dateRange,
    collectionStats,
    successRate,
    serviceStatus: apiData.serviceStatus,
    securityFeatures: apiData.securityFeatures
  };
};

export const useBackupStore = create<BackupStore>((set, get) => ({
  // Initial state
  stats: null,
  backups: [],
  pagination: null,
  loading: false,
  statsLoading: false,
  backupsLoading: false,
  error: null,
  statusFilter: 'all',
  typeFilter: 'all',
  searchTerm: '',

  // Fetch backup statistics
  fetchStats: async () => {
    try {
      set({ statsLoading: true, error: null });
      const response = await api.get('backup/stats');
      
      if (response.data.status === 'success') {
        const transformedStats = transformStatsData(response.data.data);
        set({ stats: transformedStats });
      } else {
        throw new Error('Failed to fetch backup stats');
      }
    } catch (error: any) {
      console.error('Error fetching backup stats:', error);
      set({ 
        error: error.response?.data?.message || 'Failed to load backup statistics. Please try again.',
        stats: null 
      });
    } finally {
      set({ statsLoading: false });
    }
  },

  // Fetch backup list
  fetchBackups: async (page = 1, limit = 10) => {
    try {
      set({ backupsLoading: true, error: null });
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      });

      const { statusFilter, typeFilter, searchTerm } = get();
      
      if (statusFilter && statusFilter !== 'all') {
        params.append('status', statusFilter);
      }
      
      if (typeFilter && typeFilter !== 'all') {
        params.append('type', typeFilter);
      }
      
      if (searchTerm) {
        params.append('search', searchTerm);
      }

      const response = await api.get(`backup/list?${params.toString()}`);
      
      if (response.data.status === 'success') {
        const data: BackupListResponse = response.data.data;
        
        // Transform pagination to match expected format
        const transformedPagination = {
          total: data.pagination.totalItems,
          page: data.pagination.current,
          limit: limit,
          pages: data.pagination.total
        };
        
        set({ 
          backups: data.backups,
          pagination: transformedPagination
        });
      } else {
        throw new Error('Failed to fetch backups');
      }
    } catch (error: any) {
      console.error('Error fetching backups:', error);
      set({ 
        error: error.response?.data?.message || 'Failed to load backups. Please try again.',
        backups: [],
        pagination: null
      });
    } finally {
      set({ backupsLoading: false });
    }
  },

  // Refresh all data
  refreshData: async () => {
    set({ loading: true });
    await Promise.all([
      get().fetchStats(),
      get().fetchBackups()
    ]);
    set({ loading: false });
  },

  // Filter actions
  setStatusFilter: (status: string) => {
    set({ statusFilter: status });
    get().fetchBackups(1); // Reset to first page when filtering
  },

  setTypeFilter: (type: string) => {
    set({ typeFilter: type });
    get().fetchBackups(1);
  },

  setSearchTerm: (term: string) => {
    set({ searchTerm: term });
    // Debounce search in the component
  },

  clearFilters: () => {
    set({ 
      statusFilter: 'all',
      typeFilter: 'all',
      searchTerm: ''
    });
    get().fetchBackups(1);
  },

  // Create new backup
  createBackup: async (type: string, description = 'Manual backup') => {
    try {
      set({ loading: true, error: null });
      
      const response = await api.post('backup/create', {
        backupType: type,
        description
      });
      
      if (response.data.status === 'success') {
        // Refresh data after creating backup
        await get().refreshData();
      } else {
        throw new Error('Failed to create backup');
      }
    } catch (error: any) {
      console.error('Error creating backup:', error);
      set({ 
        error: error.response?.data?.message || 'Failed to create backup. Please try again.'
      });
    } finally {
      set({ loading: false });
    }
  },

  // Delete backup
  deleteBackup: async (backupId: string) => {
    try {
      set({ loading: true, error: null });
      
      const response = await api.delete(`backup/${backupId}`);
      
      if (response.data.status === 'success') {
        // Refresh data after deletion
        await get().refreshData();
      } else {
        throw new Error('Failed to delete backup');
      }
    } catch (error: any) {
      console.error('Error deleting backup:', error);
      set({ 
        error: error.response?.data?.message || 'Failed to delete backup. Please try again.'
      });
    } finally {
      set({ loading: false });
    }
  },

  // Download backup
  downloadBackup: async (backupId: string) => {
    try {
      set({ loading: true, error: null });
      
      const response = await api.get(`backup/download/${backupId}`, {
        responseType: 'blob'
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `backup-${backupId}.zip`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
    } catch (error: any) {
      console.error('Error downloading backup:', error);
      set({ 
        error: error.response?.data?.message || 'Failed to download backup. Please try again.'
      });
    } finally {
      set({ loading: false });
    }
  },

  // Utility actions
  setLoading: (loading: boolean) => set({ loading }),
  setError: (error: string | null) => set({ error })
}));


