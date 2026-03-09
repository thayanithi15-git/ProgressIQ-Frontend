import { create } from 'zustand';
import api from '@/utils/api';
import { useNotificationStore } from '@/utils/notification';

// ==========================================
// TYPES & INTERFACES
// ==========================================

export interface MentorStats {
  totalAssignedStudents: number;
  totalProjects: number;
  totalTasks: number;
  pendingApprovals: number;
  completedProjects: number;
  activeStudents: number;
}

export interface AssignedStudent {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  year: string;
  academicYear?: string;
  phone?: string;
  place?: string;
  points: number;
  projectsCompleted: number;
  tasksCompleted?: number;
  certificationsCompleted?: number;
  internshipsCompleted?: number;
  lastActive: string;
  status: 'Active' | 'Inactive';
}

export interface MentorProject {
  id: string;
  title: string;
  description: string;
  status: 'In Progress' | 'Completed' | 'Pending';
  studentsCount: number;
  completionRate: number;
  createdDate: string;
}

export interface MentorTask {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  status: 'To Do' | 'In Progress' | 'Done';
  dueDate: string;
  priority: 'Low' | 'Medium' | 'High';
}

export interface PendingApproval {
  id: string;
  entityId?: string;
  studentId?: string;
  studentName: string;
  entityType: 'PROJECT' | 'TASK' | 'INTERNSHIP' | 'CERTIFICATION';
  entityTitle: string;
  submittedDate: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export interface MentorCertification {
  id: string;
  title: string;
  platform: string;
  status: string;
  from: string;
  to: string;
  student: {
    id: string;
    name: string;
    email: string;
    department: string;
    year: string;
  };
  feedback?: string | null;
}

export interface MentorInternship {
  id: string;
  companyName: string;
  role: string;
  type: string;
  status: string;
  from: string;
  to: string;
  student: {
    id: string;
    name: string;
    email: string;
    department: string;
    year: string;
  };
  feedback?: string | null;
}

export interface MentorSurvey {
  id: string;
  title: string;
  description?: string;
  questions: string[];
  createdDate: string;
  respondents: number;
  status: 'Active' | 'Closed';
}

export interface SurveyAnswerResponse {
  responseId: string;
  student: {
    id: string;
    name: string;
    email: string;
    department: string;
    year: string;
  };
  submittedAt: string;
  answers: Array<{ question: string; answer: string }>;
}

export interface ActivityData {
  date: string;
  approvals: number;
  feedback: number;
}

// ==========================================
// STORE
// ==========================================

interface MentorDashboardStore {
  // Stats
  stats: MentorStats | null;
  statsLoading: boolean;
  statsError: string | null;
  fetchStats: () => Promise<void>;

  // Assigned Students
  assignedStudents: AssignedStudent[];
  studentsLoading: boolean;
  studentsError: string | null;
  fetchAssignedStudents: (page?: number, limit?: number) => Promise<void>;

  // Projects
  projects: MentorProject[];
  projectsLoading: boolean;
  projectsError: string | null;
  fetchProjects: () => Promise<void>;

  // Tasks
  tasks: MentorTask[];
  tasksLoading: boolean;
  tasksError: string | null;
  fetchTasks: () => Promise<void>;

  // Pending Approvals
  pendingApprovals: PendingApproval[];
  approvalsLoading: boolean;
  approvalsError: string | null;
  fetchPendingApprovals: () => Promise<void>;
  updateApproval: (approvalId: string, status: string, points?: number, feedback?: string) => Promise<void>;

  // Activity Data
  activityData: ActivityData[];

  // Certifications
  certifications: MentorCertification[];
  certificationsLoading: boolean;
  fetchCertifications: () => Promise<void>;

  // Internships
  internships: MentorInternship[];
  internshipsLoading: boolean;
  fetchInternships: () => Promise<void>;

  // Surveys
  surveys: MentorSurvey[];
  surveysLoading: boolean;
  surveyResponses: SurveyAnswerResponse[];
  fetchSurveys: () => Promise<void>;
  createSurvey: (payload: { title: string; description?: string; questions: string[] }) => Promise<boolean>;
  fetchSurveyResponses: (surveyId: string) => Promise<void>;

  refreshAll: () => Promise<void>;
}

export const useMentorDashboardStore = create<MentorDashboardStore>((set, get) => ({
  stats: null,
  statsLoading: false,
  statsError: null,
  fetchStats: async () => {
    set({ statsLoading: true, statsError: null });
    try {
      const response = await api.get('/api/mentors/stats');
      const payload = response.data?.data || response.data;
      set({
        stats: {
          totalAssignedStudents: payload.totalAssignedStudents || payload.totalStudents || 0,
          totalProjects: payload.totalProjects || 0,
          totalTasks: payload.totalTasks || 0,
          pendingApprovals: payload.pendingApprovals || 0,
          completedProjects: payload.completedProjects || 0,
          activeStudents: payload.activeStudents || 0,
        },
        activityData: payload.activityData || [],
        statsLoading: false,
      });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch stats';
      set({ statsError: message, statsLoading: false });
      useNotificationStore.setState({
        notification: { message, type: 'error' },
      });
    }
  },

  assignedStudents: [],
  studentsLoading: false,
  studentsError: null,
  fetchAssignedStudents: async (page = 1, limit = 20) => {
    set({ studentsLoading: true, studentsError: null });
    try {
      const response = await api.get(`/api/mentors/assigned-students?page=${page}&limit=${limit}`);
      const data = response.data?.data || response.data?.students || [];
      set({
        assignedStudents: data,
        studentsLoading: false,
      });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch assigned students';
      set({ studentsError: message, studentsLoading: false });
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
      const response = await api.get('/api/mentors/projects');
      const data = response.data?.data || response.data?.projects || [];
      set({
        projects: data,
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

  tasks: [],
  tasksLoading: false,
  tasksError: null,
  fetchTasks: async () => {
    set({ tasksLoading: true, tasksError: null });
    try {
      const response = await api.get('/api/mentors/tasks');
      const data = response.data?.data || response.data?.tasks || [];
      set({
        tasks: data,
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

  pendingApprovals: [],
  approvalsLoading: false,
  approvalsError: null,
  fetchPendingApprovals: async () => {
    set({ approvalsLoading: true, approvalsError: null });
    try {
      const response = await api.get('/api/mentors/approvals');
      const data = response.data?.data || response.data?.approvals || [];
      set({
        pendingApprovals: data,
        approvalsLoading: false,
      });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch approvals';
      set({ approvalsError: message, approvalsLoading: false });
      useNotificationStore.setState({
        notification: { message, type: 'error' },
      });
    }
  },

  updateApproval: async (approvalId: string, status: string, points?: number, feedback?: string) => {
    try {
      const approval = get().pendingApprovals.find((a) => a.id === approvalId);
      const response = await api.put(`/api/mentors/approvals/${approvalId}`, {
        entityType: approval?.entityType,
        status,
        points,
        feedback,
      });
      useNotificationStore.setState({
        notification: { message: 'Approval updated successfully', type: 'success' },
      });
      // Refetch approvals
      set({ approvalsLoading: true });
      const approvalsResponse = await api.get('/api/mentors/approvals');
      set({
        pendingApprovals: approvalsResponse.data?.data || approvalsResponse.data?.approvals || [],
        approvalsLoading: false,
      });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update approval';
      useNotificationStore.setState({
        notification: { message, type: 'error' },
      });
    }
  },

  activityData: [],

  certifications: [],
  certificationsLoading: false,
  fetchCertifications: async () => {
    set({ certificationsLoading: true });
    try {
      const response = await api.get('/api/mentors/certifications');
      set({
        certifications: response.data?.data || [],
        certificationsLoading: false
      });
    } catch (error: any) {
      set({ certificationsLoading: false });
      const message = error.response?.data?.message || 'Failed to fetch certifications';
      useNotificationStore.setState({ notification: { message, type: 'error' } });
    }
  },

  internships: [],
  internshipsLoading: false,
  fetchInternships: async () => {
    set({ internshipsLoading: true });
    try {
      const response = await api.get('/api/mentors/internships');
      set({
        internships: response.data?.data || [],
        internshipsLoading: false
      });
    } catch (error: any) {
      set({ internshipsLoading: false });
      const message = error.response?.data?.message || 'Failed to fetch internships';
      useNotificationStore.setState({ notification: { message, type: 'error' } });
    }
  },

  surveys: [],
  surveysLoading: false,
  surveyResponses: [],
  fetchSurveys: async () => {
    set({ surveysLoading: true });
    try {
      const response = await api.get('/api/mentors/surveys');
      set({ surveys: response.data?.data || [], surveysLoading: false });
    } catch (error: any) {
      set({ surveysLoading: false });
      const message = error.response?.data?.message || 'Failed to fetch surveys';
      useNotificationStore.setState({ notification: { message, type: 'error' } });
    }
  },

  createSurvey: async (payload) => {
    try {
      await api.post('/api/mentors/surveys', payload);
      useNotificationStore.setState({ notification: { message: 'Survey created successfully', type: 'success' } });
      await get().fetchSurveys();
      return true;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to create survey';
      useNotificationStore.setState({ notification: { message, type: 'error' } });
      return false;
    }
  },

  fetchSurveyResponses: async (surveyId: string) => {
    try {
      const response = await api.get(`/api/mentors/surveys/${surveyId}/responses`);
      set({ surveyResponses: response.data?.data?.responses || [] });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch survey responses';
      useNotificationStore.setState({ notification: { message, type: 'error' } });
    }
  },

  refreshAll: async () => {
    await Promise.all([
      get().fetchStats(),
      get().fetchAssignedStudents(),
      get().fetchProjects(),
      get().fetchTasks(),
      get().fetchPendingApprovals(),
      get().fetchCertifications(),
      get().fetchInternships(),
      get().fetchSurveys()
    ]);
  },
}));
