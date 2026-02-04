import api from "@/components/utils/api";
import { create } from "zustand";

export interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    assignedMachines: string[];
    status: string;
    createdAt: string;
}

export interface AssignedUser {
    _id: string;
    name: string;
    email: string;
    role: string;
    status: string;
    createdAt: string;
}

export interface MachineryDetails {
    id: string;
    name: string;
    model: string;
    serialNumber: string;
}

export interface AssignedUsersResponse {
    machinery: MachineryDetails; 
    assignedUsers: AssignedUser[];
}

export interface AssignMachineryRequest {
    userId: string;
}

export interface AssignMachineryResponse {
    machineryId: string;
    userId: string;
    assignedUsers: string[];
}

export interface GetUsersRequest {
    role: string;
    status: string;
    searchname: string;
}

interface ResourceAllocationStore {
    // Selection
    selectedMachineId: string | null;
    
    // Data
    users: User[];
    assignedUsers: AssignedUser[];
    machineryDetails: MachineryDetails | null;
    availableMachines: Array<{
        id: string;
        name: string;
        model: string;
        serialNumber: string;
    }>;
    
    // Loading states
    loading: boolean;
    assignLoading: boolean;
    unassignLoading: boolean;
    usersLoading: boolean;
    assignedUsersLoading: boolean;
    machinesLoading: boolean;
    
    // Error states
    error: string | null;
    assignError: string | null;
    unassignError: string | null;
    usersError: string | null;
    assignedUsersError: string | null;
    machinesError: string | null;
    
    // Search and filter
    searchTerm: string;
    selectedRole: string;
    selectedStatus: string;
    
    // Actions
    setSelectedMachine: (machineId: string | null) => void;
    setSearchTerm: (term: string) => void;
    setSelectedRole: (role: string) => void;
    setSelectedStatus: (status: string) => void;
    
    // API Actions
    fetchUsers: (params?: Partial<GetUsersRequest>) => Promise<void>;
    fetchAssignedUsers: (machineId: string) => Promise<void>;
    fetchAvailableMachines: () => Promise<void>;
    assignUserToMachine: (machineId: string, userId: string) => Promise<boolean>;
    unassignUserFromMachine: (machineId: string, userId: string) => Promise<boolean>;
    
    // Utility
    clearErrors: () => void;
    clearAllData: () => void;
    isUserAssigned: (userId: string) => boolean;
    getFilteredUsers: () => User[];
    getAvailableUsersCount: () => number;
    getAssignedUsersCount: () => number;
}

export const useResourceAllocationStore = create<ResourceAllocationStore>((set, get) => ({
    // Initial state
    selectedMachineId: null,
    users: [],
    assignedUsers: [],
    machineryDetails: null,
    availableMachines: [],
    
    // Loading states
    loading: false,
    assignLoading: false,
    unassignLoading: false,
    usersLoading: false,
    assignedUsersLoading: false,
    machinesLoading: false,
    
    // Error states
    error: null,
    assignError: null,
    unassignError: null,
    usersError: null,
    assignedUsersError: null,
    machinesError: null,
    
    // Search and filter
    searchTerm: "",
    selectedRole: "user",
    selectedStatus: "active",
    
    // Selection actions
    setSelectedMachine: (machineId) => {
        set({ selectedMachineId: machineId });
        if (machineId) {
            get().fetchAssignedUsers(machineId);
        } else {
            set({ assignedUsers: [], machineryDetails: null });
        }
    },
    
    setSearchTerm: (term) => set({ searchTerm: term }),
    setSelectedRole: (role) => {
        set({ selectedRole: role });
        get().fetchUsers();
    },
    setSelectedStatus: (status) => {
        set({ selectedStatus: status });
        get().fetchUsers();
    },
    
    // API Actions
    fetchUsers: async (params) => {
        try {
            set({ usersLoading: true, usersError: null });
            
            const requestParams = {
                role: params?.role || get().selectedRole,
                status: params?.status || get().selectedStatus,
                searchname: params?.searchname || get().searchTerm
            };
            
            const response = await api.post('admin/allUsers', requestParams);
            
            if (Array.isArray(response.data)) {
                set({ users: response.data });
            } else {
                throw new Error('Invalid response format');
            }
        } catch (error: any) {
            console.error('Error fetching users:', error);
            set({
                usersError: error.response?.data?.message || 'Failed to load users. Please try again.',
                users: []
            });
        } finally {
            set({ usersLoading: false });
        }
    },
    
    fetchAssignedUsers: async (machineId: string) => {
        try {
            set({ assignedUsersLoading: true, assignedUsersError: null });
            
            const response = await api.get(`machinery/${machineId}/assigned-users`);
            
            if (response.data?.status === 'success') {
                const data: AssignedUsersResponse = response.data.data;
                set({ 
                    assignedUsers: data.assignedUsers,
                    machineryDetails: data.machinery
                });
            } else {
                throw new Error('Invalid response format');
            }
        } catch (error: any) {
            console.error('Error fetching assigned users:', error);
            set({
                assignedUsersError: error.response?.data?.message || 'Failed to load assigned users. Please try again.',
                assignedUsers: [],
                machineryDetails: null
            });
        } finally {
            set({ assignedUsersLoading: false });
        }
    },

    fetchAvailableMachines: async () => {
        try {
            set({ machinesLoading: true, machinesError: null });
            
            await new Promise(resolve => setTimeout(resolve, 800));
            
        } catch (error: any) {
            console.error('Error fetching machines:', error);
            set({
                machinesError: error.response?.data?.message || 'Failed to load machines. Please try again.',
                availableMachines: []
            });
        } finally {
            set({ machinesLoading: false });
        }
    },
    
    assignUserToMachine: async (machineId: string, userId: string) => {
        try {
            set({ assignLoading: true, assignError: null });
            
            const requestData: AssignMachineryRequest = { userId };
            const response = await api.post(`machinery/${machineId}/assign`, requestData);
            
            if (response.data?.status === 'success') {
                // Refresh assigned users list
                await get().fetchAssignedUsers(machineId);
                // Refresh users list to update assignedMachines
                await get().fetchUsers();
                return true;
            } else {
                throw new Error('Assignment failed');
            }
        } catch (error: any) {
            console.error('Error assigning user:', error);
            set({
                assignError: error.response?.data?.message || 'Failed to assign user. Please try again.'
            });
            return false;
        } finally {
            set({ assignLoading: false });
        }
    },
    
    unassignUserFromMachine: async (machineId: string, userId: string) => {
        try {
            set({ unassignLoading: true, unassignError: null });
            
            const response = await api.delete(`machinery/${machineId}/assign/${userId}`);
            
            if (response.data?.status === 'success') {
                // Refresh assigned users list
                await get().fetchAssignedUsers(machineId);
                // Refresh users list to update assignedMachines
                await get().fetchUsers();
                return true;
            } else {
                throw new Error('Unassignment failed');
            }
        } catch (error: any) {
            console.error('Error unassigning user:', error);
            set({
                unassignError: error.response?.data?.message || 'Failed to unassign user. Please try again.'
            });
            return false;
        } finally {
            set({ unassignLoading: false });
        }
    },
    
    // Utility functions
    clearErrors: () => {
        set({
            error: null,
            assignError: null,
            unassignError: null,
            usersError: null,
            assignedUsersError: null,
            machinesError: null
        });
    },
    
    clearAllData: () => {
        set({
            selectedMachineId: null,
            users: [],
            assignedUsers: [],
            machineryDetails: null,
            availableMachines: [],
            searchTerm: "",
            selectedRole: "user",
            selectedStatus: "active",
            error: null,
            assignError: null,
            unassignError: null,
            usersError: null,
            assignedUsersError: null,
            machinesError: null,
            loading: false,
            assignLoading: false,
            unassignLoading: false,
            usersLoading: false,
            assignedUsersLoading: false,
            machinesLoading: false
        });
    },
    
    isUserAssigned: (userId: string) => {
        return get().assignedUsers.some(user => user._id === userId);
    },
    
    getFilteredUsers: () => {
        const { users, searchTerm } = get();
        if (!searchTerm) return users;
        
        const term = searchTerm.toLowerCase();
        return users.filter(user => 
            user.name.toLowerCase().includes(term) ||
            user.email.toLowerCase().includes(term)
        );
    },

    getAvailableUsersCount: () => {
        const { users, assignedUsers } = get();
        const assignedUserIds = new Set(assignedUsers.map(user => user._id));
        return users.filter(user => !assignedUserIds.has(user._id)).length;
    },

    getAssignedUsersCount: () => {
        return get().assignedUsers.length;
    }
}));