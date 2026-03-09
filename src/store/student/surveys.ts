import { create } from 'zustand';
import api from '@/utils/api';
import { useNotificationStore } from '@/utils/notification';

// ==========================================
// TYPES
// ==========================================

export interface SurveyQuestion {
  _id?: string;
  question: string;
  type: 'TEXT' | 'MULTIPLE_CHOICE' | 'RATING' | 'YES_NO';
  options?: string[];
  required?: boolean;
}

export interface Survey {
  _id: string;
  title: string;
  description?: string;
  questions: SurveyQuestion[];
  createdBy: {
    _id: string;
    firstName: string;
    lastName: string;
  } | string;
  createdAt: string;
  hasResponded: boolean;
  postedBy: string;
}

export interface SurveyWithResponse extends Survey {
  previousAnswer?: Record<number, string | string[]> | null;
}

export interface QuestionWithAnswer {
  question: SurveyQuestion;
  answer: string | string[];
  questionIndex: number;
}

export interface SurveyResponseDetail {
  surveyId: string;
  surveyTitle: string;
  questionsWithAnswers: QuestionWithAnswer[];
  submittedAt: string;
}

interface Pagination {
  total: number;
  limit: number;
  skip: number;
}

// ==========================================
// STORE
// ==========================================

interface SurveysState {
  surveys: Survey[];
  selectedSurvey: SurveyWithResponse | null;
  myResponse: SurveyResponseDetail | null;
  pagination: Pagination;
  searchQuery: string;
  filterAnswered: 'ALL' | 'PENDING' | 'ANSWERED';

  // Modal state
  isAnswerModalOpen: boolean;
  isViewResponseModalOpen: boolean;

  // Answers being filled
  currentAnswers: Record<number, string | string[]>;

  // Loading
  isLoading: boolean;
  isLoadingSurvey: boolean;
  isSubmitting: boolean;

  // Actions
  fetchSurveys: () => Promise<void>;
  fetchSurveyById: (id: string) => Promise<void>;
  submitResponse: (id: string, answers: Record<number, string | string[]>) => Promise<boolean>;
  updateResponse: (id: string, answers: Record<number, string | string[]>) => Promise<boolean>;
  fetchMyResponse: (id: string) => Promise<void>;

  // UI
  setSearchQuery: (q: string) => void;
  setFilterAnswered: (f: 'ALL' | 'PENDING' | 'ANSWERED') => void;
  setPage: (skip: number) => void;
  openAnswerModal: (id: string) => Promise<void>;
  closeAnswerModal: () => void;
  openViewResponseModal: (id: string) => Promise<void>;
  closeViewResponseModal: () => void;
  setCurrentAnswer: (qIndex: number, value: string | string[]) => void;
  resetAnswers: () => void;
}

const normalizeQuestions = (questions: any[] = []): SurveyQuestion[] =>
  questions.map((q: any) => {
    if (typeof q === 'string') {
      return { question: q, type: 'TEXT', options: [], required: true };
    }

    return {
      _id: q?._id,
      question: q?.question || '',
      type: q?.type || 'TEXT',
      options: Array.isArray(q?.options) ? q.options : [],
      required: typeof q?.required === 'boolean' ? q.required : true,
    };
  });

const getPostedBy = (survey: any): string => {
  if (survey?.postedBy) return survey.postedBy;
  if (typeof survey?.createdBy === 'string') return survey.createdBy;
  if (survey?.createdBy?.firstName || survey?.createdBy?.lastName) {
    return `${survey.createdBy.firstName || ''} ${survey.createdBy.lastName || ''}`.trim();
  }
  if (survey?.mentorId?.name) return survey.mentorId.name;
  return 'Mentor';
};

const normalizeSurvey = (survey: any): Survey => ({
  ...survey,
  questions: normalizeQuestions(survey?.questions || []),
  postedBy: getPostedBy(survey),
});

export const useSurveysStore = create<SurveysState>((set, get) => ({
  surveys: [],
  selectedSurvey: null,
  myResponse: null,
  pagination: { total: 0, limit: 12, skip: 0 },
  searchQuery: '',
  filterAnswered: 'ALL',
  isAnswerModalOpen: false,
  isViewResponseModalOpen: false,
  currentAnswers: {},
  isLoading: false,
  isLoadingSurvey: false,
  isSubmitting: false,

  // ─── FETCH LIST ───────────────────────────────────────────
  fetchSurveys: async () => {
    const { showNotification } = useNotificationStore.getState();
    const { pagination } = get();

    try {
      set({ isLoading: true });

      const params = new URLSearchParams({
        limit: String(pagination.limit),
        skip: String(pagination.skip),
      });

      const res = await api.get(`/api/student/surveys?${params}`);
      if (res.data.success) {
        set({
          surveys: (res.data.data.surveys || []).map(normalizeSurvey),
          pagination: { ...pagination, total: res.data.data.pagination.total },
        });
      }
    } catch (error: any) {
      showNotification(error.response?.data?.message || 'Failed to fetch surveys', 'error');
    } finally {
      set({ isLoading: false });
    }
  },

  // ─── FETCH SINGLE ─────────────────────────────────────────
  fetchSurveyById: async (id) => {
    const { showNotification } = useNotificationStore.getState();
    try {
      set({ isLoadingSurvey: true });
      const res = await api.get(`/api/student/surveys/${id}`);
      if (res.data.success) set({ selectedSurvey: normalizeSurvey(res.data.data) as SurveyWithResponse });
    } catch (error: any) {
      showNotification(error.response?.data?.message || 'Failed to fetch survey', 'error');
    } finally {
      set({ isLoadingSurvey: false });
    }
  },

  // ─── SUBMIT RESPONSE ──────────────────────────────────────
  submitResponse: async (id, answers) => {
    const { showNotification } = useNotificationStore.getState();
    try {
      set({ isSubmitting: true });
      const res = await api.post(`/api/student/surveys/${id}/respond`, { answers });
      if (res.data.success) {
        showNotification('Survey response submitted!', 'success');
        // Update survey in list as responded
        set(state => ({
          surveys: state.surveys.map(s => s._id === id ? { ...s, hasResponded: true } : s),
          isAnswerModalOpen: false,
        }));
        return true;
      }
      return false;
    } catch (error: any) {
      showNotification(error.response?.data?.message || 'Failed to submit response', 'error');
      return false;
    } finally {
      set({ isSubmitting: false });
    }
  },

  // ─── UPDATE RESPONSE ──────────────────────────────────────
  updateResponse: async (id, answers) => {
    const { showNotification } = useNotificationStore.getState();
    try {
      set({ isSubmitting: true });
      const res = await api.put(`/api/student/surveys/${id}/respond`, { answers });
      if (res.data.success) {
        showNotification('Survey response updated!', 'success');
        set({ isAnswerModalOpen: false });
        return true;
      }
      return false;
    } catch (error: any) {
      showNotification(error.response?.data?.message || 'Failed to update response', 'error');
      return false;
    } finally {
      set({ isSubmitting: false });
    }
  },

  // ─── FETCH MY RESPONSE ────────────────────────────────────
  fetchMyResponse: async (id) => {
    const { showNotification } = useNotificationStore.getState();
    try {
      const res = await api.get(`/api/student/surveys/${id}/responses`);
      if (res.data.success) set({ myResponse: res.data.data });
    } catch (error: any) {
      // Silently fail — response might not exist
      set({ myResponse: null });
    }
  },

  // ─── UI ACTIONS ───────────────────────────────────────────
  setSearchQuery: (q) => set({ searchQuery: q }),

  setFilterAnswered: (f) => set({ filterAnswered: f }),

  setPage: (skip) => {
    set({ pagination: { ...get().pagination, skip } });
    get().fetchSurveys();
  },

  openAnswerModal: async (id) => {
    await get().fetchSurveyById(id);
    // Pre-fill answers if already responded
    const survey = get().selectedSurvey;
    if (survey?.previousAnswer) {
      set({ currentAnswers: survey.previousAnswer as any });
    } else {
      set({ currentAnswers: {} });
    }
    set({ isAnswerModalOpen: true });
  },

  closeAnswerModal: () => set({ isAnswerModalOpen: false, selectedSurvey: null, currentAnswers: {} }),

  openViewResponseModal: async (id) => {
    await get().fetchMyResponse(id);
    set({ isViewResponseModalOpen: true });
  },

  closeViewResponseModal: () => set({ isViewResponseModalOpen: false, myResponse: null }),

  setCurrentAnswer: (qIndex, value) => set(state => ({
    currentAnswers: { ...state.currentAnswers, [qIndex]: value },
  })),

  resetAnswers: () => set({ currentAnswers: {} }),
}));
