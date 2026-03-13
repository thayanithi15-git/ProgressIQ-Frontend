import { create } from 'zustand';
import api from '@/utils/api';
import { useNotificationStore } from '@/utils/notification';

// ==========================================
// TYPES & INTERFACES
// ==========================================

export type ReportType = 'pdf' | 'excel' | 'csv';
export type ReportCategory = 'students' | 'mentors' | 'projects' | 'internships' | 'certifications' | 'performance' | 'comprehensive';

export interface ReportFilter {
  // Date Filters
  startDate?: string;
  endDate?: string;

  // Student Filters
  department?: string;
  year?: string;
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

  // ========= Advanced Student Filters =========
  minProjects?: number;
  minInternships?: number;
  certificationName?: string;
  topNPoints?: number;

  // Additional
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

export interface ReportPreview {
  totalRecords: number;
  sampleData: any[];
  appliedFilters: ReportFilter;
  estimatedFileSize: string;
  usedDefaultDateRange?: boolean;
}

interface AdminReportsState {
  // Data States
  currentRequest: ReportRequest | null;
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
  isLoadingPreview: boolean;
  isLoadingOptions: boolean;

  // Actions
  generateReport: (request: ReportRequest) => Promise<void>;
  fetchReportPreview: (category: ReportCategory, filters: ReportFilter) => Promise<void>;

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
  isLoadingPreview: false,
  isLoadingOptions: false,

  // ==========================================
  // Generate Report – instantly stream download
  // ==========================================
  generateReport: async (request: ReportRequest) => {
    const { showNotification } = useNotificationStore.getState();

    try {
      set({ isGenerating: true });
      showNotification('Generating report...', 'pending');

      const response = await api.post(
        '/api/admin/reports',
        {
          type: request.type,
          category: request.category,
          filter: request.filter,
          options: request.options,
        },
        { responseType: 'blob' }
      );

      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;

      // Try to extract filename from Content-Disposition
      const contentDisposition = response.headers['content-disposition'];
      let filename = `${request.category}_report.${request.type}`;
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?([^";]+)"?/);
        if (match && match[1]) filename = match[1].trim();
      }

      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      showNotification('Report downloaded successfully!', 'success');
    } catch (error: any) {
      if (error.response?.data instanceof Blob) {
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const errData = JSON.parse(reader.result as string);
            showNotification(errData.message || 'Failed to generate report', 'error');
          } catch {
            showNotification('Failed to generate report', 'error');
          }
        };
        reader.readAsText(error.response.data);
      } else {
        const message = error.response?.data?.message || 'Failed to generate report';
        showNotification(message, 'error');
      }
      console.error('Error generating report:', error);
    } finally {
      set({ isGenerating: false });
    }
  },

  // ==========================================
  // Preview Report
  // ==========================================
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
        useNotificationStore
          .getState()
          .showNotification('Start date must be before end date', 'error');
        return false;
      }
    }

    if (filters.minPoints !== undefined && filters.maxPoints !== undefined) {
      if (filters.minPoints > filters.maxPoints) {
        useNotificationStore
          .getState()
          .showNotification('Minimum points must be less than maximum points', 'error');
        return false;
      }
    }

    return true;
  },

  getFilterSummary: () => {
    const { filters } = get();
    const activeParts: string[] = [];

    if (filters.department) activeParts.push(`Dept: ${filters.department}`);
    if (filters.year) activeParts.push(`Year: ${filters.year}`);
    if (filters.status && filters.status !== 'All') activeParts.push(`Status: ${filters.status}`);
    if (filters.designation && filters.designation !== 'All')
      activeParts.push(`Designation: ${filters.designation}`);
    if (filters.startDate && filters.endDate)
      activeParts.push(`Period: ${filters.startDate} → ${filters.endDate}`);
    if (filters.minPoints !== undefined || filters.maxPoints !== undefined)
      activeParts.push(`Points: ${filters.minPoints ?? 0} – ${filters.maxPoints ?? '∞'}`);
    if (filters.minProjects && filters.minProjects > 0)
      activeParts.push(`Min Projects: ${filters.minProjects}`);
    if (filters.minInternships && filters.minInternships > 0)
      activeParts.push(`Min Internships: ${filters.minInternships}`);
    if (filters.certificationName) activeParts.push(`Cert: ${filters.certificationName}`);
    if (filters.topNPoints && filters.topNPoints > 0)
      activeParts.push(`Top ${filters.topNPoints} by Points`);

    return activeParts.length > 0 ? activeParts.join(' • ') : 'No filters applied';
  },
}));