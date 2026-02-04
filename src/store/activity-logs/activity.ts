import api from "@/components/utils/api";
import { create } from "zustand";

export interface ActivityLogItem {
    id: number;
    date: string;
    user: string;
    action: string;
    file: string;
    machine: string;
    status: 'success' | 'failed' | 'pending';
}

interface ActivityLogResponse {
    success: boolean;
    message: string;
    data: ActivityLogItem[];
}

interface ActivityLogStore {
    // Data
    activities: ActivityLogItem[];
    filteredActivities: ActivityLogItem[];

    // Loading states
    loading: boolean;
    error: string | null;

    // Filter states
    searchTerm: string;
    filterUser: string;
    filterAction: string;
    filterDate: string;
    filterStatus: string;

    // Pagination
    currentPage: number;
    pageSize: number;
    totalPages: number;

    // Actions
    fetchActivities: (role: string | null) => Promise<void>;
    setSearchTerm: (term: string) => void;
    setFilterUser: (user: string) => void;
    setFilterAction: (action: string) => void;
    setFilterDate: (date: string) => void;
    setFilterStatus: (status: string) => void;
    setCurrentPage: (page: number) => void;
    setPageSize: (size: number) => void;
    clearFilters: () => void;
    applyFilters: () => void;

    // Computed values
    getUniqueUsers: () => string[];
    getUniqueActions: () => string[];
    getUniqueStatuses: () => string[];
    getActivityStats: () => {
        total: number;
        success: number;
        failed: number;
        pending: number;
        successRate: number;
        uniqueUsers: number;
    };
}

export const useActivityLogStore = create<ActivityLogStore>((set, get) => ({
    // Initial state
    activities: [],
    filteredActivities: [],
    loading: false,
    error: null,

    // Filter initial state
    searchTerm: '',
    filterUser: 'all',
    filterAction: 'all',
    filterDate: 'all',
    filterStatus: 'all',

    // Pagination initial state
    currentPage: 1,
    pageSize: 10,
    totalPages: 1,
 
    // Fetch activities from API
    fetchActivities: async (role: string | null) => {
        try {
            set({ loading: true, error: null });

            //   const response = await api.get<ActivityLogResponse>('activity/all-formatted');

            let path = '';

            if (role == 'admin') {
                path = 'activity/all-formatted';
            } else {
                path = 'activity/my-activities-formatted';
            }

            const response = await api.get<ActivityLogResponse>(path);
            if (response.data.success) {
                set({
                    activities: response.data.data,
                    loading: false
                });

                // Apply filters after fetching
                get().applyFilters();
            } else {
                set({
                    error: response.data.message || 'Failed to fetch activities',
                    loading: false
                });
            }
        } catch (error) {
            console.error('Error fetching activities:', error);
            set({
                error: 'Failed to load activities. Please try again.',
                loading: false
            });
        }
    },

    // Filter setters
    setSearchTerm: (term) => {
        set({ searchTerm: term, currentPage: 1 });
        get().applyFilters();
    },

    setFilterUser: (user) => {
        set({ filterUser: user, currentPage: 1 });
        get().applyFilters();
    },

    setFilterAction: (action) => {
        set({ filterAction: action, currentPage: 1 });
        get().applyFilters();
    },

    setFilterDate: (date) => {
        set({ filterDate: date, currentPage: 1 });
        get().applyFilters();
    },

    setFilterStatus: (status) => {
        set({ filterStatus: status, currentPage: 1 });
        get().applyFilters();
    },

    setCurrentPage: (page) => {
        set({ currentPage: page });
    },

    setPageSize: (size) => {
        set({ pageSize: size, currentPage: 1 });
        get().applyFilters();
    },

    clearFilters: () => {
        set({
            searchTerm: '',
            filterUser: 'all',
            filterAction: 'all',
            filterDate: 'all',
            filterStatus: 'all',
            currentPage: 1
        });
        get().applyFilters();
    },

    // Apply all filters
    applyFilters: () => {
        const {
            activities,
            searchTerm,
            filterUser,
            filterAction,
            filterDate,
            filterStatus,
            pageSize
        } = get();

        let filtered = activities.filter(activity => {
            // Search term filter
            const matchesSearch = searchTerm === '' ||
                activity.file.toLowerCase().includes(searchTerm.toLowerCase()) ||
                activity.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                activity.machine.toLowerCase().includes(searchTerm.toLowerCase()) ||
                activity.action.toLowerCase().includes(searchTerm.toLowerCase());

            // User filter
            const matchesUser = filterUser === 'all' || activity.user === filterUser;

            // Action filter
            const matchesAction = filterAction === 'all' || activity.action === filterAction;

            // Status filter
            const matchesStatus = filterStatus === 'all' || activity.status === filterStatus;

            // Date filter
            const activityDate = new Date(activity.date);
            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
            const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

            let matchesDate = true;
            switch (filterDate) {
                case 'today':
                    matchesDate = activityDate >= today;
                    break;
                case 'week':
                    matchesDate = activityDate >= weekAgo;
                    break;
                case 'month':
                    matchesDate = activityDate >= monthAgo;
                    break;
                case 'all':
                default:
                    matchesDate = true;
            }

            return matchesSearch && matchesUser && matchesAction && matchesStatus && matchesDate;
        });

        // Sort by date (newest first)
        filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        const totalPages = Math.ceil(filtered.length / pageSize);

        set({
            filteredActivities: filtered,
            totalPages: totalPages === 0 ? 1 : totalPages
        });
    },

    // Computed values
    getUniqueUsers: () => {
        const { activities } = get();
        return [...new Set(activities.map(activity => activity.user))];
    },

    getUniqueActions: () => {
        const { activities } = get();
        return [...new Set(activities.map(activity => activity.action))];
    },

    getUniqueStatuses: () => {
        const { activities } = get();
        return [...new Set(activities.map(activity => activity.status))];
    },

    getActivityStats: () => {
        const { activities } = get();
        const total = activities.length;
        const success = activities.filter(a => a.status === 'success').length;
        const failed = activities.filter(a => a.status === 'failed').length;
        const pending = activities.filter(a => a.status === 'pending').length;
        const successRate = total > 0 ? Math.round((success / total) * 100) : 0;
        const uniqueUsers = new Set(activities.map(a => a.user)).size;

        return {
            total,
            success,
            failed,
            pending,
            successRate,
            uniqueUsers
        };
    }
}));