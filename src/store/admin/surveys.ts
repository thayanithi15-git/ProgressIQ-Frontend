import { create } from 'zustand';
import { toast } from 'sonner';
import api from '@/utils/api';

interface Survey {
  id: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  mentor: {
    name: string;
    email: string;
  } | null;
  questions: string[];
  respondents: number;
}

interface AdminSurveysState {
  surveys: Survey[];
  surveyResponses: any[];
  isLoading: boolean;
  isResponsesLoading: boolean;
  statusFilter: string;
  page: number;
  total: number;
  totalPages: number;

  fetchSurveys: () => Promise<void>;
  fetchSurveyResponses: (id: string) => Promise<void>;
  setStatusFilter: (status: string) => void;
  setPage: (page: number) => void;
  resetFilters: () => void;
  clearResponses: () => void;
}

export const useAdminSurveysStore = create<AdminSurveysState>((set, get) => ({
  surveys: [],
  surveyResponses: [],
  isLoading: false,
  isResponsesLoading: false,
  statusFilter: 'all',
  page: 1,
  total: 0,
  totalPages: 0,

  fetchSurveys: async () => {
    set({ isLoading: true });
    try {
      const { statusFilter, page } = get();
      const params = new URLSearchParams({
        page: page.toString(),
        status: statusFilter,
      });

      const res = await api.get(`/api/admin/surveys?${params}`);

      set({
        surveys: res.data.surveys,
        total: res.data.pagination.total,
        totalPages: res.data.pagination.totalPages,
      });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch surveys');
    } finally {
      set({ isLoading: false });
    }
  },

  fetchSurveyResponses: async (id) => {
    set({ isResponsesLoading: true, surveyResponses: [] });
    try {
      const res = await api.get(`/api/admin/surveys/${id}/responses`);
      set({ surveyResponses: res.data.responses });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch responses');
    } finally {
      set({ isResponsesLoading: false });
    }
  },

  setStatusFilter: (status) => {
    set({ statusFilter: status, page: 1 });
  },

  setPage: (page) => {
    set({ page });
  },

  resetFilters: () => {
    set({ statusFilter: 'all', page: 1 });
  },

  clearResponses: () => {
    set({ surveyResponses: [] });
  }
}));
