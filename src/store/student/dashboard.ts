import { create } from 'zustand';
import api from '@/utils/api';
import { useNotificationStore } from '@/utils/notification';

// ==========================================
// TYPES & INTERFACES
// ==========================================

export interface StudentDashboardData {
  name: string;
  email: string;
  totalPoints: number;
  rank: number;
  departmentRank: number;
  projectsCompleted: number;
  internshipsCompleted: number;
  certificationsEarned: number;
  currentRank: string;
  nextRankPoints: number;
}

export interface StudentProject {
  id: string;
  title: string;
  description: string;
  status: 'Draft' | 'Submitted' | 'Approved' | 'Rejected';
  mentorFeedback?: string;
  points: number;
  createdDate: string;
  submittedDate?: string;
}

export interface StudentTask {
  id: string;
  title: string;
  description: string;
  projectTitle?: string;
  status: 'To Do' | 'In Progress' | 'Completed' | 'Pending Approval';
  dueDate: string;
  priority: 'Low' | 'Medium' | 'High';
  points?: number;
}

export interface SurveyItem {
  id: string;
  title: string;
  description?: string;
  type: 'FEEDBACK' | 'ASSESSMENT' | 'GENERAL';
  createdBy: string;
  status: 'Not Responded' | 'Completed';
  dueDate?: string;
}

export interface Notification {
  id: string;
  message: string;
  type: 'APPROVAL' | 'FEEDBACK' | 'ASSIGNMENT' | 'GENERAL';
  isRead: boolean;
  createdAt: string;
}

export interface StudentRanking {
  rank: number;
  name?: string;
  points: number;
  departmentRank?: number;
  percentileRank?: number;
}

// ==========================================
// STORE
// ==========================================

interface StudentDashboardStore {
  // Dashboard
  dashboard: StudentDashboardData | null;
  dashboardLoading: boolean;
  dashboardError: string | null;
  fetchDashboard: () => Promise<void>;

  // Projects
  projects: StudentProject[];
  projectsLoading: boolean;
  projectsError: string | null;
  fetchProjects: () => Promise<void>;
  createProject: (title: string, description: string) => Promise<void>;

  // Tasks
  tasks: StudentTask[];
  tasksLoading: boolean;
  tasksError: string | null;
  fetchTasks: () => Promise<void>;
  updateTaskStatus: (taskId: string, status: string) => Promise<void>;

  // Surveys
  surveys: SurveyItem[];
  surveysLoading: boolean;
  surveysError: string | null;
  fetchSurveys: () => Promise<void>;
  respondToSurvey: (surveyId: string, answers: string[]) => Promise<void>;

  // Notifications
  notifications: Notification[];
  notificationsLoading: boolean;
  notificationsError: string | null;
  fetchNotifications: () => Promise<void>;
  markNotificationRead: (notificationId: string) => Promise<void>;

  // Profile & Rankings
  profile: StudentDashboardData | null;
  profileLoading: boolean;
  profileError: string | null;
  fetchProfile: () => Promise<void>;

  rankings: StudentRanking[];
  rankingsLoading: boolean;
  rankingsError: string | null;
  fetchRankings: () => Promise<void>;
}

export const useStudentDashboardStore = create<StudentDashboardStore>((set) => ({
  dashboard: null,
  dashboardLoading: false,
  dashboardError: null,
  fetchDashboard: async () => {
    set({ dashboardLoading: true, dashboardError: null });
    try {
      const response = await api.get('/api/students/dashboard');
      set({
        dashboard: response.data.data,
        dashboardLoading: false,
      });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch dashboard';
      set({ dashboardError: message, dashboardLoading: false });
      useNotificationStore.setState({
        notification: { message, type: 'error' },
      });
    }
  },

  projects: [],
  projectsLoading: false,
  projectsError: null,
  fetchProjects: async () => {
    set({ projectsLoading: true, projectsError: null });
    try {
      const response = await api.get('/api/students/projects');
      set({
        projects: response.data.data,
        projectsLoading: false,
      });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch projects';
      set({ projectsError: message, projectsLoading: false });
      useNotificationStore.setState({
        notification: { message, type: 'error' },
      });
    }
  },

  createProject: async (title: string, description: string) => {
    try {
      const response = await api.post('/api/students/projects', {
        title,
        description,
      });
      useNotificationStore.setState({
        notification: { message: 'Project created successfully', type: 'success' },
      });
      // Refetch projects
      const projectsResponse = await api.get('/api/students/projects');
      set({ projects: projectsResponse.data.data });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to create project';
      useNotificationStore.setState({
        notification: { message, type: 'error' },
      });
    }
  },

  tasks: [],
  tasksLoading: false,
  tasksError: null,
  fetchTasks: async () => {
    set({ tasksLoading: true, tasksError: null });
    try {
      const response = await api.get('/api/students/tasks');
      set({
        tasks: response.data.data,
        tasksLoading: false,
      });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch tasks';
      set({ tasksError: message, tasksLoading: false });
      useNotificationStore.setState({
        notification: { message, type: 'error' },
      });
    }
  },

  updateTaskStatus: async (taskId: string, status: string) => {
    try {
      await api.put(`/api/students/tasks/${taskId}`, { status });
      useNotificationStore.setState({
        notification: { message: 'Task updated successfully', type: 'success' },
      });
      // Refetch tasks
      const tasksResponse = await api.get('/api/students/tasks');
      set({ tasks: tasksResponse.data.data });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update task';
      useNotificationStore.setState({
        notification: { message, type: 'error' },
      });
    }
  },

  surveys: [],
  surveysLoading: false,
  surveysError: null,
  fetchSurveys: async () => {
    set({ surveysLoading: true, surveysError: null });
    try {
      const response = await api.get('/api/students/surveys');
      set({
        surveys: response.data.data,
        surveysLoading: false,
      });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch surveys';
      set({ surveysError: message, surveysLoading: false });
      useNotificationStore.setState({
        notification: { message, type: 'error' },
      });
    }
  },

  respondToSurvey: async (surveyId: string, answers: string[]) => {
    try {
      await api.post(`/api/students/surveys/${surveyId}/respond`, { answers });
      useNotificationStore.setState({
        notification: { message: 'Survey response submitted successfully', type: 'success' },
      });
      // Refetch surveys
      const surveysResponse = await api.get('/api/students/surveys');
      set({ surveys: surveysResponse.data.data });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to submit survey response';
      useNotificationStore.setState({
        notification: { message, type: 'error' },
      });
    }
  },

  notifications: [],
  notificationsLoading: false,
  notificationsError: null,
  fetchNotifications: async () => {
    set({ notificationsLoading: true, notificationsError: null });
    try {
      const response = await api.get('/api/notifications');
      set({
        notifications: response.data.data,
        notificationsLoading: false,
      });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch notifications';
      set({ notificationsError: message, notificationsLoading: false });
    }
  },

  markNotificationRead: async (notificationId: string) => {
    try {
      await api.post(`/api/notifications/${notificationId}/read`);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to mark notification as read';
      useNotificationStore.setState({
        notification: { message, type: 'error' },
      });
    }
  },

  profile: null,
  profileLoading: false,
  profileError: null,
  fetchProfile: async () => {
    set({ profileLoading: true, profileError: null });
    try {
      const response = await api.get('/api/students/profile');
      set({
        profile: response.data.data,
        profileLoading: false,
      });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch profile';
      set({ profileError: message, profileLoading: false });
      useNotificationStore.setState({
        notification: { message, type: 'error' },
      });
    }
  },

  rankings: [],
  rankingsLoading: false,
  rankingsError: null,
  fetchRankings: async () => {
    set({ rankingsLoading: true, rankingsError: null });
    try {
      const response = await api.get('/api/students/ranking');
      set({
        rankings: response.data.data,
        rankingsLoading: false,
      });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch rankings';
      set({ rankingsError: message, rankingsLoading: false });
      useNotificationStore.setState({
        notification: { message, type: 'error' },
      });
    }
  },
}));
