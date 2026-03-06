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
  points: number;
  projectsCompleted: number;
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
  studentName: string;
  entityType: 'PROJECT' | 'TASK' | 'INTERNSHIP';
  entityTitle: string;
  submittedDate: string;
  status: 'Pending' | 'Approved' | 'Rejected';
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
}

export const useMentorDashboardStore = create<MentorDashboardStore>((set) => ({
  stats: null,
  statsLoading: false,
  statsError: null,
  fetchStats: async () => {
    set({ statsLoading: true, statsError: null });
    try {
      const response = await api.get('/api/mentors/stats');
      set({
        stats: response.data.data,
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
      set({
        assignedStudents: response.data.data,
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

  tasks: [],
  tasksLoading: false,
  tasksError: null,
  fetchTasks: async () => {
    set({ tasksLoading: true, tasksError: null });
    try {
      const response = await api.get('/api/mentors/tasks');
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

  pendingApprovals: [],
  approvalsLoading: false,
  approvalsError: null,
  fetchPendingApprovals: async () => {
    set({ approvalsLoading: true, approvalsError: null });
    try {
      const response = await api.get('/api/mentors/approvals');
      set({
        pendingApprovals: response.data.data,
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
      const response = await api.put(`/api/mentors/approvals/${approvalId}`, {
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
        pendingApprovals: approvalsResponse.data.data,
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
}));
