import { create } from 'zustand';
import api from '@/utils/api';
import { getStoredMentorId } from '@/utils/mentorSession';

// ==========================================
// TYPES & INTERFACES
// ==========================================

export interface Student {
  id: string;
  name: string;
  email: string;
  department: string;
  year: string;
  phone: string;
  place: string;
  status: string;
  academicYear: string;
}

export interface Mentor {
  id: string;
  name: string;
  email: string;
  department: string;
  expertise: string[];
}

export interface Project {
  _id: string;
  title: string;
  description: string;
  githubLink: string;
  websiteLink: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  completedAt: string;
  feedback?: string;
  mentorId?: { firstName: string; lastName: string };
  createdAt?: string;
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: 'PENDING' | 'SUBMITTED' | 'COMPLETED' | 'REJECTED';
  dueDate: string;
  completedAt?: string;
  isOverdue: boolean;
  feedback?: string;
  mentorId?: { firstName: string; lastName: string };
}

export interface Certification {
  _id: string;
  title: string;
  platform: string;
  platformLink: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  from: string;
  to: string;
  feedback?: string;
}

export interface Internship {
  _id: string;
  companyName: string;
  companyUrl: string;
  role: string;
  type: string;
  paid: boolean;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  from: string;
  to: string;
  description: string;
  durationDays?: number;
  feedback?: string;
}

export interface Survey {
  _id: string;
  title: string;
  questions: string[];
  hasResponded: boolean;
  postedBy: string;
  createdAt: string;
}

export interface Ranking {
  rank: number;
  name: string;
  email: string;
  department: string;
  year: string;
  points: number;
  overallRank: number;
  departmentRank: number;
  isCurrentStudent: boolean;
}

export interface DashboardStats {
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
  ranking?: {
    overallRank: number;
    departmentRank: number;
  };
}

// ==========================================
// STORE
// ==========================================

interface StudentStore {
  // Dashboard
  dashboard: any | null;
  dashboardLoading: boolean;
  dashboardError: string | null;
  fetchDashboard: () => Promise<void>;

  // Projects
  projects: Project[];
  projectsLoading: boolean;
  projectsError: string | null;
  fetchProjects: (status?: string) => Promise<void>;
  createProject: (data: Partial<Project>) => Promise<void>;
  updateProject: (id: string, data: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  getProjectById: (id: string) => Promise<Project | null>;

  // Tasks
  tasks: Task[];
  tasksLoading: boolean;
  tasksError: string | null;
  fetchTasks: (status?: string) => Promise<void>;
  createTask: (data: Partial<Task>) => Promise<void>;
  updateTask: (id: string, data: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  completeTask: (id: string) => Promise<void>;

  // Certifications
  certifications: Certification[];
  certificationsLoading: boolean;
  certificationsError: string | null;
  fetchCertifications: (status?: string) => Promise<void>;
  createCertification: (data: Partial<Certification>) => Promise<void>;
  updateCertification: (id: string, data: Partial<Certification>) => Promise<void>;
  deleteCertification: (id: string) => Promise<void>;

  // Internships
  internships: Internship[];
  internshipsLoading: boolean;
  internshipsError: string | null;
  fetchInternships: (type?: string) => Promise<void>;
  createInternship: (data: Partial<Internship>) => Promise<void>;
  updateInternship: (id: string, data: Partial<Internship>) => Promise<void>;
  deleteInternship: (id: string) => Promise<void>;

  // Surveys
  surveys: Survey[];
  surveysLoading: boolean;
  surveysError: string | null;
  fetchSurveys: () => Promise<void>;
  respondToSurvey: (surveyId: string, answers: any[]) => Promise<void>;

  // Profile
  profile: any | null;
  profileLoading: boolean;
  profileError: string | null;
  fetchProfile: () => Promise<void>;
  updateProfile: (data: Partial<Student>) => Promise<void>;

  // Rankings
  rankings: Ranking[];
  rankingsLoading: boolean;
  rankingsError: string | null;
  currentStudentRanking: any | null;
  fetchRankings: (department?: boolean) => Promise<void>;
  getDepartmentRankings: () => Promise<void>;

  // Activity Logs
  activityLogs: any[];
  activityLogsLoading: boolean;
  activityLogsError: string | null;
  fetchActivityLogs: (month?: string, year?: string) => Promise<void>;
  submitActivityLog: (data: any) => Promise<void>;

  // Feedback
  getFeedback: (type: string, id: string) => Promise<any>;
}

export const useStudentStore = create<StudentStore>((set, get) => ({
  // ========== DASHBOARD ==========
  dashboard: null,
  dashboardLoading: false,
  dashboardError: null,
  fetchDashboard: async () => {
    set({ dashboardLoading: true, dashboardError: null });
    try {
      const response = await api.get('/api/student/dashboard');
      set({
        dashboard: response.data.data,
        dashboardLoading: false,
      });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch dashboard';
      set({ dashboardError: message, dashboardLoading: false });
    }
  },

  // ========== PROJECTS ==========
  projects: [],
  projectsLoading: false,
  projectsError: null,
  fetchProjects: async (status?: string) => {
    set({ projectsLoading: true, projectsError: null });
    try {
      const url = status ? `/api/student/projects?status=${status}` : '/api/student/projects';
      const response = await api.get(url);
      set({
        projects: response.data.data.projects,
        projectsLoading: false,
      });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch projects';
      set({ projectsError: message, projectsLoading: false });
    }
  },
  createProject: async (data: Partial<Project>) => {
    try {
      const mentorId = getStoredMentorId();
      if (!mentorId) throw new Error('No mentor assigned. Please contact admin.');
      const response = await api.post('/api/student/projects', { ...data, mentorId });
      set((state) => ({
        projects: [...state.projects, response.data.data],
      }));
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to create project';
      set({ projectsError: message });
      throw error;
    }
  },
  updateProject: async (id: string, data: Partial<Project>) => {
    try {
      const response = await api.put(`/api/student/projects/${id}`, data);
      set((state) => ({
        projects: state.projects.map((p) => (p._id === id ? response.data.data : p)),
      }));
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update project';
      set({ projectsError: message });
      throw error;
    }
  },
  deleteProject: async (id: string) => {
    try {
      await api.delete(`/api/student/projects/${id}`);
      set((state) => ({
        projects: state.projects.filter((p) => p._id !== id),
      }));
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to delete project';
      set({ projectsError: message });
      throw error;
    }
  },
  getProjectById: async (id: string) => {
    try {
      const response = await api.get(`/api/student/projects/${id}`);
      return response.data.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch project';
      set({ projectsError: message });
      return null;
    }
  },

  // ========== TASKS ==========
  tasks: [],
  tasksLoading: false,
  tasksError: null,
  fetchTasks: async (status?: string) => {
    set({ tasksLoading: true, tasksError: null });
    try {
      const url = status ? `/api/student/tasks?status=${status}` : '/api/student/tasks';
      const response = await api.get(url);
      set({
        tasks: response.data.data.tasks,
        tasksLoading: false,
      });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch tasks';
      set({ tasksError: message, tasksLoading: false });
    }
  },
  createTask: async (data: Partial<Task>) => {
    try {
      const mentorId = getStoredMentorId();
      if (!mentorId) throw new Error('No mentor assigned. Please contact admin.');
      const response = await api.post('/api/student/tasks', { ...data, mentorId });
      set((state) => ({
        tasks: [...state.tasks, response.data.data],
      }));
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to create task';
      set({ tasksError: message });
      throw error;
    }
  },
  updateTask: async (id: string, data: Partial<Task>) => {
    try {
      const response = await api.put(`/api/student/tasks/${id}`, data);
      set((state) => ({
        tasks: state.tasks.map((t) => (t._id === id ? response.data.data : t)),
      }));
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update task';
      set({ tasksError: message });
      throw error;
    }
  },
  deleteTask: async (id: string) => {
    try {
      await api.delete(`/api/student/tasks/${id}`);
      set((state) => ({
        tasks: state.tasks.filter((t) => t._id !== id),
      }));
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to delete task';
      set({ tasksError: message });
      throw error;
    }
  },
  completeTask: async (id: string) => {
    try {
      const response = await api.put(`/api/student/tasks/${id}/complete`, {
        completedAt: new Date(),
      });
      set((state) => ({
        tasks: state.tasks.map((t) => (t._id === id ? response.data.data : t)),
      }));
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to complete task';
      set({ tasksError: message });
      throw error;
    }
  },

  // ========== CERTIFICATIONS ==========
  certifications: [],
  certificationsLoading: false,
  certificationsError: null,
  fetchCertifications: async (status?: string) => {
    set({ certificationsLoading: true, certificationsError: null });
    try {
      const url = status
        ? `/api/student/certifications?status=${status}`
        : '/api/student/certifications';
      const response = await api.get(url);
      set({
        certifications: response.data.data.certifications,
        certificationsLoading: false,
      });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch certifications';
      set({ certificationsError: message, certificationsLoading: false });
    }
  },
  createCertification: async (data: Partial<Certification>) => {
    try {
      const mentorId = getStoredMentorId();
      if (!mentorId) throw new Error('No mentor assigned. Please contact admin.');
      const response = await api.post('/api/student/certifications', { ...data, mentorId });
      set((state) => ({
        certifications: [...state.certifications, response.data.data],
      }));
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to create certification';
      set({ certificationsError: message });
      throw error;
    }
  },
  updateCertification: async (id: string, data: Partial<Certification>) => {
    try {
      const response = await api.put(`/api/student/certifications/${id}`, data);
      set((state) => ({
        certifications: state.certifications.map((c) => (c._id === id ? response.data.data : c)),
      }));
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update certification';
      set({ certificationsError: message });
      throw error;
    }
  },
  deleteCertification: async (id: string) => {
    try {
      await api.delete(`/api/student/certifications/${id}`);
      set((state) => ({
        certifications: state.certifications.filter((c) => c._id !== id),
      }));
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to delete certification';
      set({ certificationsError: message });
      throw error;
    }
  },

  // ========== INTERNSHIPS ==========
  internships: [],
  internshipsLoading: false,
  internshipsError: null,
  fetchInternships: async (type?: string) => {
    set({ internshipsLoading: true, internshipsError: null });
    try {
      const url = type ? `/api/student/internships?type=${type}` : '/api/student/internships';
      const response = await api.get(url);
      set({
        internships: response.data.data.internships,
        internshipsLoading: false,
      });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch internships';
      set({ internshipsError: message, internshipsLoading: false });
    }
  },
  createInternship: async (data: Partial<Internship>) => {
    try {
      const mentorId = getStoredMentorId();
      if (!mentorId) throw new Error('No mentor assigned. Please contact admin.');
      const response = await api.post('/api/student/internships', { ...data, mentorId });
      set((state) => ({
        internships: [...state.internships, response.data.data],
      }));
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to create internship';
      set({ internshipsError: message });
      throw error;
    }
  },
  updateInternship: async (id: string, data: Partial<Internship>) => {
    try {
      const response = await api.put(`/api/student/internships/${id}`, data);
      set((state) => ({
        internships: state.internships.map((i) => (i._id === id ? response.data.data : i)),
      }));
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update internship';
      set({ internshipsError: message });
      throw error;
    }
  },
  deleteInternship: async (id: string) => {
    try {
      await api.delete(`/api/student/internships/${id}`);
      set((state) => ({
        internships: state.internships.filter((i) => i._id !== id),
      }));
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to delete internship';
      set({ internshipsError: message });
      throw error;
    }
  },

  // ========== SURVEYS ==========
  surveys: [],
  surveysLoading: false,
  surveysError: null,
  fetchSurveys: async () => {
    set({ surveysLoading: true, surveysError: null });
    try {
      const response = await api.get('/api/student/surveys');
      set({
        surveys: response.data.data.surveys,
        surveysLoading: false,
      });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch surveys';
      set({ surveysError: message, surveysLoading: false });
    }
  },
  respondToSurvey: async (surveyId: string, answers: any[]) => {
    try {
      await api.post(`/api/student/surveys/${surveyId}/respond`, { answers });
      set((state) => ({
        surveys: state.surveys.map((s) =>
          s._id === surveyId ? { ...s, hasResponded: true } : s
        ),
      }));
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to respond to survey';
      set({ surveysError: message });
      throw error;
    }
  },

  // ========== PROFILE ==========
  profile: null,
  profileLoading: false,
  profileError: null,
  fetchProfile: async () => {
    set({ profileLoading: true, profileError: null });
    try {
      const response = await api.get('/api/student/profile/complete');
      set({
        profile: response.data.data,
        profileLoading: false,
      });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch profile';
      set({ profileError: message, profileLoading: false });
    }
  },
  updateProfile: async (data: Partial<Student>) => {
    try {
      const response = await api.put('/api/student/profile', data);
      set({
        profile: response.data.data,
      });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update profile';
      set({ profileError: message });
      throw error;
    }
  },

  // ========== RANKINGS ==========
  rankings: [],
  rankingsLoading: false,
  rankingsError: null,
  currentStudentRanking: null,
  fetchRankings: async (department?: boolean) => {
    set({ rankingsLoading: true, rankingsError: null });
    try {
      const url = department ? '/api/student/rankings/department' : '/api/student/rankings';
      const response = await api.get(url);
      set({
        rankings: response.data.data.rankings,
        currentStudentRanking: response.data.data.currentStudentRanking,
        rankingsLoading: false,
      });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch rankings';
      set({ rankingsError: message, rankingsLoading: false });
    }
  },
  getDepartmentRankings: async () => {
    try {
      const response = await api.get('/api/student/rankings/department');
      set({
        rankings: response.data.data.rankings,
      });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch department rankings';
      set({ rankingsError: message });
      throw error;
    }
  },

  // ========== ACTIVITY LOGS ==========
  activityLogs: [],
  activityLogsLoading: false,
  activityLogsError: null,
  fetchActivityLogs: async (month?: string, year?: string) => {
    set({ activityLogsLoading: true, activityLogsError: null });
    try {
      let url = '/api/student/activity-logs';
      if (month && year) {
        url += `?month=${month}&year=${year}`;
      }
      const response = await api.get(url);
      set({
        activityLogs: response.data.data.logs,
        activityLogsLoading: false,
      });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch activity logs';
      set({ activityLogsError: message, activityLogsLoading: false });
    }
  },
  submitActivityLog: async (data: any) => {
    try {
      const response = await api.post('/api/student/activity-logs', data);
      set((state) => ({
        activityLogs: [response.data.data, ...state.activityLogs],
      }));
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to submit activity log';
      set({ activityLogsError: message });
      throw error;
    }
  },

  // ========== FEEDBACK ==========
  getFeedback: async (type: string, id: string) => {
    try {
      const urlMap: any = {
        project: `/api/student/projects/${id}/feedback`,
        task: `/api/student/tasks/${id}/feedback`,
        certification: `/api/student/certifications/${id}/feedback`,
        internship: `/api/student/internships/${id}/feedback`,
      };
      const response = await api.get(urlMap[type]);
      return response.data.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch feedback';
      throw error;
    }
  },
}));
