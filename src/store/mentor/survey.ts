import { create } from 'zustand';
import api from '@/utils/api';
import { useNotificationStore } from '@/utils/notification';

export interface Survey {
  id: string;
  title: string;
  description: string;
  questions: string[];
  createdDate: string;
  respondents: number;
  status: 'Active' | 'Closed';
}

export interface SurveyResponse {
  responseId: string;
  student: {
    id: string;
    name: string;
    email: string;
    department: string;
    year: string;
  };
  submittedAt: string;
  answers: Array<{
    question: string;
    answer: string;
  }>;
}

export interface SurveyDetail {
  survey: {
    id: string;
    title: string;
    questions: string[];
  };
  responses: SurveyResponse[];
}

interface SurveysState {
  // Data
  surveys: Survey[];
  surveyDetail: SurveyDetail | null;

  // Filters
  searchQuery: string;
  statusFilter: string;
  departmentFilter: string;
  yearFilter: string;

  // Pagination
  page: number;
  limit: number;
  total: number;
  totalPages: number;

  // Loading
  isLoading: boolean;
  isLoadingDetail: boolean;
  isSubmitting: boolean;

  // Actions
  fetchSurveys: () => Promise<void>;
  fetchSurveyResponses: (surveyId: string) => Promise<void>;
  createSurvey: (title: string, description: string, questions: string[]) => Promise<void>;
  setSearchQuery: (query: string) => void;
  setStatusFilter: (status: string) => void;
  setDepartmentFilter: (dept: string) => void;
  setYearFilter: (year: string) => void;
  setPage: (page: number) => void;
  resetFilters: () => void;
  closeSurveyDetail: () => void;
}

export const useSurveysStore = create<SurveysState>((set, get) => ({
  // Initial States
  surveys: [],
  surveyDetail: null,

  searchQuery: '',
  statusFilter: '',
  departmentFilter: '',
  yearFilter: '',

  page: 1,
  limit: 20,
  total: 0,
  totalPages: 0,

  isLoading: false,
  isLoadingDetail: false,
  isSubmitting: false,

  // =====================================
  // FETCH SURVEYS
  // =====================================
  fetchSurveys: async () => {
    const { showNotification } = useNotificationStore.getState();
    const state = get();

    try {
      set({ isLoading: true });

      const params = new URLSearchParams({
        page: state.page.toString(),
        limit: state.limit.toString(),
        search: state.searchQuery,
        ...(state.statusFilter && { status: state.statusFilter }),
      });

      const response = await api.get(`/api/mentor/surveys?${params}`);

      if (response.data.success) {
        set({
          surveys: response.data.data,
          total: response.data.pagination?.total || 0,
          totalPages: response.data.pagination?.totalPages || 0,
        });
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch surveys';
      showNotification(message, 'error');
      console.error('Error fetching surveys:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  // =====================================
  // FETCH SURVEY RESPONSES
  // =====================================
  fetchSurveyResponses: async (surveyId: string) => {
    const { showNotification } = useNotificationStore.getState();
    const state = get();

    try {
      set({ isLoadingDetail: true });

      const params = new URLSearchParams({
        page: state.page.toString(),
        limit: state.limit.toString(),
        ...(state.departmentFilter && { department: state.departmentFilter }),
        ...(state.yearFilter && { year: state.yearFilter }),
      });

      const response = await api.get(`/api/mentor/surveys/${surveyId}/responses?${params}`);

      if (response.data.success) {
        set({
          surveyDetail: response.data.data,
          total: response.data.pagination?.total || 0,
          totalPages: response.data.pagination?.totalPages || 0,
        });
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch survey responses';
      showNotification(message, 'error');
      console.error('Error fetching survey responses:', error);
    } finally {
      set({ isLoadingDetail: false });
    }
  },

  // =====================================
  // CREATE SURVEY
  // =====================================
  createSurvey: async (title: string, description: string, questions: string[]) => {
    const { showNotification } = useNotificationStore.getState();

    try {
      set({ isSubmitting: true });

      const response = await api.post('/api/mentor/surveys', {
        title,
        description,
        questions,
      });

      if (response.data.success) {
        showNotification('Survey created successfully', 'success');
        get().fetchSurveys();
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to create survey';
      showNotification(message, 'error');
      console.error('Error creating survey:', error);
    } finally {
      set({ isSubmitting: false });
    }
  },

  // =====================================
  // FILTER ACTIONS
  // =====================================
  setSearchQuery: (query: string) => {
    set({ searchQuery: query, page: 1 });
    get().fetchSurveys();
  },

  setStatusFilter: (status: string) => {
    set({ statusFilter: status, page: 1 });
    get().fetchSurveys();
  },

  setDepartmentFilter: (dept: string) => {
    set({ departmentFilter: dept, page: 1 });
    get().fetchSurveyResponses(get().surveyDetail?.survey.id || '');
  },

  setYearFilter: (year: string) => {
    set({ yearFilter: year, page: 1 });
    get().fetchSurveyResponses(get().surveyDetail?.survey.id || '');
  },

  setPage: (page: number) => {
    set({ page });
    get().fetchSurveys();
  },

  resetFilters: () => {
    set({
      searchQuery: '',
      statusFilter: '',
      departmentFilter: '',
      yearFilter: '',
      page: 1,
    });
    get().fetchSurveys();
  },

  closeSurveyDetail: () => {
    set({ surveyDetail: null });
  },
}));