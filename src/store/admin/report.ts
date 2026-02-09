import { create } from 'zustand';
import api from '@/utils/api';
import { useNotificationStore } from '@/utils/notification';

// ==========================================
// TYPES & INTERFACES
// ==========================================

export type ReportType = 'pdf' | 'excel' | 'csv';
export type ReportCategory = 'students' | 'mentors' | 'projects' | 'internships' | 'certifications' | 'performance' | 'attendance' | 'comprehensive';

export interface ReportFilter {
  // Date Filters
  startDate?: string;
  endDate?: string;
  
  // Student Filters
  department?: string | string[];
  year?: string | string[];
  status?: 'Active' | 'Inactive' | 'All';
  
  // Performance Filters
  minPoints?: number;
  maxPoints?: number;
  designation?: 'Gold Scholar' | 'Silver Scholar' | 'Bronze Scholar' | 'All';
  
  // Project Filters
  projectStatus?: 'Completed' | 'In Progress' | 'Pending' | 'All';
  
  // Internship Filters
  internshipType?: 'Industry' | 'Research' | 'Startup' | 'All';
  internshipStatus?: 'Approved' | 'Pending' | 'Rejected' | 'All';
  
  // Certification Filters
  certificationStatus?: 'Verified' | 'Pending' | 'All';
  platform?: string;
  
  // Mentor Filters
  mentorId?: string;
  
  // Additional Filters
  includeInactive?: boolean;
  sortBy?: 'name' | 'points' | 'date' | 'department';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
}

export interface ReportRequest {
  type: ReportType;
  category: ReportCategory;
  filter: ReportFilter;
  options?: {
    includeCharts?: boolean;
    includeStatistics?: boolean;
    includeRankings?: boolean;
    customTitle?: string;
  };
}

export interface GeneratedReport {
  id: string;
  type: ReportType;
  category: ReportCategory;
  filter: ReportFilter;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  downloadUrl?: string;
  generatedAt: string;
  expiresAt?: string;
  fileSize?: string;
  error?: string;
}

export interface ReportHistory {
  reports: GeneratedReport[];
  total: number;
}

export interface ReportPreview {
  totalRecords: number;
  sampleData: any[];
  appliedFilters: ReportFilter;
  estimatedFileSize: string;
}

interface AdminReportsState {
  // Data States
  currentRequest: ReportRequest | null;
  reportHistory: GeneratedReport[];
  reportPreview: ReportPreview | null;
  
  // Available Options
  departments: string[];
  years: string[];
  mentors: { id: string; name: string }[];
  platforms: string[];
  
  // Filter States
  selectedType: ReportType;
  selectedCategory: ReportCategory;
  filters: ReportFilter;
  
  // Loading States
  isGenerating: boolean;
  isLoadingHistory: boolean;
  isLoadingPreview: boolean;
  isLoadingOptions: boolean;
  
  // Actions
  generateReport: (request: ReportRequest) => Promise<void>;
  fetchReportHistory: () => Promise<void>;
  fetchReportPreview: (category: ReportCategory, filters: ReportFilter) => Promise<void>;
  downloadReport: (reportId: string) => Promise<void>;
  deleteReport: (reportId: string) => Promise<void>;
  
  // Filter Actions
  setReportType: (type: ReportType) => void;
  setReportCategory: (category: ReportCategory) => void;
  updateFilters: (filters: Partial<ReportFilter>) => void;
  resetFilters: () => void;
  
  // Options Actions
  fetchDepartments: () => Promise<void>;
  fetchYears: () => Promise<void>;
  fetchMentors: () => Promise<void>;
  fetchPlatforms: () => Promise<void>;
  
  // Utility Actions
  validateFilters: () => boolean;
  getFilterSummary: () => string;
}

const initialFilters: ReportFilter = {
  status: 'All',
  designation: 'All',
  projectStatus: 'All',
  internshipType: 'All',
  internshipStatus: 'All',
  certificationStatus: 'All',
  includeInactive: false,
  sortBy: 'name',
  sortOrder: 'asc',
};

export const useAdminReportsStore = create<AdminReportsState>((set, get) => ({
  // Initial States
  currentRequest: null,
  reportHistory: [],
  reportPreview: null,
  departments: [],
  years: [],
  mentors: [],
  platforms: [],
  
  // Initial Filter States
  selectedType: 'pdf',
  selectedCategory: 'students',
  filters: initialFilters,
  
  // Initial Loading States
  isGenerating: false,
  isLoadingHistory: false,
  isLoadingPreview: false,
  isLoadingOptions: false,

  generateReport: async (request: ReportRequest) => {
    const { showNotification } = useNotificationStore.getState();
    
    try {
      set({ isGenerating: true });
      showNotification('Generating report...', 'pending');

      const response = await api.post('/api/admin/reports', {
        type: request.type,
        category: request.category,
        filter: request.filter,
        options: request.options,
      });

      if (response.data.success || response.data.message) {
        const newReport: GeneratedReport = {
          id: response.data.reportId || Date.now().toString(),
          type: request.type,
          category: request.category,
          filter: request.filter,
          status: 'queued',
          generatedAt: new Date().toISOString(),
        };

        set((state) => ({
          reportHistory: [newReport, ...state.reportHistory],
          currentRequest: request,
        }));

        showNotification(
          response.data.message || 'Report generation queued successfully!',
          'success'
        );

        setTimeout(() => {
          get().fetchReportHistory();
        }, 1000);
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to generate report';
      showNotification(message, 'error');
      console.error('Error generating report:', error);
    } finally {
      set({ isGenerating: false });
    }
  },

  fetchReportHistory: async () => {
    const { showNotification } = useNotificationStore.getState();
    
    try {
      set({ isLoadingHistory: true });
      
      const response = await api.get('/api/admin/reports/history');
      
      if (response.data.success) {
        set({ reportHistory: response.data.data });
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch report history';
      showNotification(message, 'error');
      console.error('Error fetching report history:', error);
    } finally {
      set({ isLoadingHistory: false });
    }
  },

  fetchReportPreview: async (category: ReportCategory, filters: ReportFilter) => {
    const { showNotification } = useNotificationStore.getState();
    
    try {
      set({ isLoadingPreview: true });
      
      const response = await api.post('/api/admin/reports/preview', {
        category,
        filter: filters,
      });
      
      if (response.data.success) {
        set({ reportPreview: response.data.data });
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch preview';
      showNotification(message, 'error');
      console.error('Error fetching preview:', error);
      set({ reportPreview: null });
    } finally {
      set({ isLoadingPreview: false });
    }
  },

  downloadReport: async (reportId: string) => {
    const { showNotification } = useNotificationStore.getState();
    
    try {
      showNotification('Preparing download...', 'pending');
      
      const response = await api.get(`/api/admin/reports/download/${reportId}`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      const contentDisposition = response.headers['content-disposition'];
      const filename = contentDisposition
        ? contentDisposition.split('filename=')[1].replace(/"/g, '')
        : `report_${reportId}.pdf`;
      
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      showNotification('Report downloaded successfully!', 'success');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to download report';
      showNotification(message, 'error');
      console.error('Error downloading report:', error);
    }
  },

  deleteReport: async (reportId: string) => {
    const { showNotification } = useNotificationStore.getState();
    
    try {
      showNotification('Deleting report...', 'pending');
      
      await api.delete(`/api/admin/reports/${reportId}`);
      
      set((state) => ({
        reportHistory: state.reportHistory.filter((r) => r.id !== reportId),
      }));

      showNotification('Report deleted successfully', 'success');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to delete report';
      showNotification(message, 'error');
      console.error('Error deleting report:', error);
    }
  },

  setReportType: (type: ReportType) => {
    set({ selectedType: type });
  },

  setReportCategory: (category: ReportCategory) => {
    set({ selectedCategory: category });
    get().resetFilters();
  },

  updateFilters: (newFilters: Partial<ReportFilter>) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    }));
  },

  resetFilters: () => {
    set({ filters: initialFilters, reportPreview: null });
  },

  fetchDepartments: async () => {
    try {
      const response = await api.get('/api/admin/options/departments');
      if (response.data.success) {
        set({ departments: response.data.data });
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  },

  fetchYears: async () => {
    try {
      const response = await api.get('/api/admin/options/years');
      if (response.data.success) {
        set({ years: response.data.data });
      }
    } catch (error) {
      console.error('Error fetching years:', error);
    }
  },

  fetchMentors: async () => {
    try {
      const response = await api.get('/api/admin/options/mentors');
      if (response.data.success) {
        set({ mentors: response.data.data });
      }
    } catch (error) {
      console.error('Error fetching mentors:', error);
    }
  },

  fetchPlatforms: async () => {
    try {
      const response = await api.get('/api/admin/options/platforms');
      if (response.data.success) {
        set({ platforms: response.data.data });
      }
    } catch (error) {
      console.error('Error fetching platforms:', error);
    }
  },

  validateFilters: () => {
    const { filters } = get();
    
    if (filters.startDate && filters.endDate) {
      const start = new Date(filters.startDate);
      const end = new Date(filters.endDate);
      if (start > end) {
        useNotificationStore.getState().showNotification(
          'Start date must be before end date',
          'error'
        );
        return false;
      }
    }
    
    if (filters.minPoints !== undefined && filters.maxPoints !== undefined) {
      if (filters.minPoints > filters.maxPoints) {
        useNotificationStore.getState().showNotification(
          'Minimum points must be less than maximum points',
          'error'
        );
        return false;
      }
    }
    
    return true;
  },

  getFilterSummary: () => {
    const { filters, selectedCategory } = get();
    const activeParts: string[] = [];
    
    if (filters.department) {
      const depts = Array.isArray(filters.department) 
        ? filters.department.join(', ') 
        : filters.department;
      activeParts.push(`Department: ${depts}`);
    }
    
    if (filters.year) {
      const years = Array.isArray(filters.year) 
        ? filters.year.join(', ') 
        : filters.year;
      activeParts.push(`Year: ${years}`);
    }
    
    if (filters.status && filters.status !== 'All') {
      activeParts.push(`Status: ${filters.status}`);
    }
    
    if (filters.designation && filters.designation !== 'All') {
      activeParts.push(`Designation: ${filters.designation}`);
    }
    
    if (filters.startDate && filters.endDate) {
      activeParts.push(
        `Period: ${new Date(filters.startDate).toLocaleDateString()} - ${new Date(
          filters.endDate
        ).toLocaleDateString()}`
      );
    }
    
    if (filters.minPoints !== undefined || filters.maxPoints !== undefined) {
      const min = filters.minPoints ?? 0;
      const max = filters.maxPoints ?? '∞';
      activeParts.push(`Points: ${min} - ${max}`);
    }
    
    return activeParts.length > 0 
      ? activeParts.join(' • ') 
      : 'No filters applied';
  },
}));