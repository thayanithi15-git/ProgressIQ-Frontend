import { create } from 'zustand';
import api from '@/components/utils/api';
import { useNotificationStore } from '@/components/notify/notification';
import { decryptData } from '@/components/utils/crypto';

const getAppRole = () => {
  const newEncryptedRole = localStorage.getItem("role");
  return newEncryptedRole ? decryptData(newEncryptedRole) : null;
};
export interface MachineParameter {
  paramID: string;
  name: string;
  value: number;
  unit: string;
  _id?: string;
}

export interface CurrentActiveFile {
  _id: string;
  fileName: string;
  version: number;
  uploadedBy: string;
  createdAt: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
}

export interface Machine {
  _id: string;
  name: string;
  model: string;
  manufacturer: string;
  serialNumber: string;
  description: string;
  status: 'active' | 'inactive' | 'maintenance';
  location: string;
  installationDate: string;
  tags: string[];
  parameters: MachineParameter[];
  currentActiveFile?: CurrentActiveFile;
  currentActiveConfig?: any;
  createdBy: User;
  updatedBy: User;
  createdAt: string;
  updatedAt: string;
  passwordsSet?: {
    admin: boolean;
  };
}

export interface UpdateMachinePayload {
  name?: string;
  model?: string;
  manufacturer?: string;
  serialNumber?: string;
  description?: string;
  status?: string;
  location?: string;
  installationDate?: string;
  tags?: string[];
  parameters?: MachineParameter[];
}

export interface MachineFilters {
  page: number;
  limit: number;
  search: string;
  status: string;
  tags: string;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalMachinery: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface MachineState {
  machines: Machine[];
  currentMachine: Machine | null;
  pagination: PaginationInfo | null;
  isLoading: boolean;
  singleMachineLoading: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  error: string | null;
  filters: MachineFilters;
  finalLoading: boolean;

  // Actions
  fetchMachines: (filters?: Partial<MachineFilters>) => Promise<void>;
  fetchMachineById: (id: string) => Promise<void>;
  updateMachine: (id: string, machineData: UpdateMachinePayload) => Promise<boolean>;
  updateParameters: (id: string, parameters: MachineParameter[]) => Promise<boolean>; // ADD THIS LINE
  deleteMachine: (id: string) => Promise<boolean>;
  clearCurrentMachine: () => void;
  clearError: () => void;
  setFilters: (filters: Partial<MachineFilters>) => void;
  resetFilters: () => void;
}

const defaultFilters: MachineFilters = {
  page: 1,
  limit: 10,
  search: '',
  status: '',
  tags: ''
};

export const useMachineStore = create<MachineState>((set, get) => ({
  machines: [],
  currentMachine: null,
  pagination: null,
  isLoading: false,
  singleMachineLoading: false,
  isUpdating: false,
  isDeleting: false,
  error: null,
  filters: defaultFilters,
  finalLoading: false,

  fetchMachines: async (newFilters?: Partial<MachineFilters>) => {
    const { showNotification } = useNotificationStore.getState() as {
      showNotification: (message: string, type: string) => void
    };

    try {
      set({ isLoading: true, error: null, });
      const currentFilters = get().filters;
      const filters = { ...currentFilters, ...newFilters };

      // Build query parameters
      const params = new URLSearchParams();
      params.append('page', filters.page.toString());
      params.append('limit', filters.limit.toString());
      if (filters.search) params.append('search', filters.search);
      if (filters.status) params.append('status', filters.status == 'all' ? '' : filters.status);
      if (filters.tags) params.append('tags', filters.tags);

      const role = getAppRole();
 
      let path = '';

      if (role == 'admin') {
        path = `/machinery?${params.toString()}`;
      } else {
        path = `machinery/my-assigned`
      }

      const response = await api.get(path);
      // assignedMachinery

      if (role == 'admin') {
        set({ machines: response.data.data.machinery });
      } else{
        set({ machines: response.data.data.assignedMachinery });
      }

      set({
        pagination: response.data.data.pagination,
        // isLoading: false,
        filters
      });
    } catch (error: any) {
      let errorMessage = 'Failed to fetch machines';

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      // set({ error: errorMessage, isLoading: false });
      showNotification(errorMessage, 'error');
    } finally {
      set({ isLoading: false });
    }
  },

  fetchMachineById: async (id: string) => {
    const { showNotification } = useNotificationStore.getState() as {
      showNotification: (message: string, type: string) => void
    };

    try {
      set({ singleMachineLoading: true, error: null });
      const response = await api.get(`/machinery/${id}`);
      set({ currentMachine: response.data.data.machinery });
    } catch (error: any) {
      let errorMessage = 'Failed to fetch machine details';

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      set({ error: errorMessage });
      showNotification(errorMessage, 'error');
    } finally {
      set({ singleMachineLoading: false });
    }
  },

  updateMachine: async (id: string, machineData: UpdateMachinePayload) => {
    set({ isUpdating: true, error: null });
    const { showNotification } = useNotificationStore.getState() as {
      showNotification: (message: string, type: string) => void
    };

    try {
      const response = await api.put(`/machinery/${id}`, machineData);

      // Update the machine in the list
      set(state => ({
        machines: state.machines.map(machine =>
          machine._id === id ? response.data.data : machine
        ),
        currentMachine: response.data.data,
        isUpdating: false
      }));

      showNotification('Machine updated successfully!', 'success');
      return true;
    } catch (error: any) {
      let errorMessage = 'Failed to update machine';

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      set({ error: errorMessage, isUpdating: false });
      showNotification(errorMessage, 'error');
      return false;
    }
  },


  updateParameters: async (machineId: string, parameters: MachineParameter[]) => {
    const { showNotification } = useNotificationStore.getState() as {
      showNotification: (message: string, type: string) => void
    };

    try {
      // Set loading state
      set((state) => ({
        ...state,
        isUpdating: true,
        error: null
      }));

      // Prepare the request payload
      const payload = {
        parameters: parameters.map(param => ({
          paramID: param.paramID,
          name: param.name,
          value: typeof param.value === 'string' ? parseFloat(param.value) || 0 : param.value,
          unit: param.unit,
          // Include _id if it exists (for updating existing parameters)
          ...(param._id && { _id: param._id })
        }))
      };

      // Make API call using your existing api utility
      const response = await api.put(`/machinery/${machineId}/parameters`, payload);

      // Get the updated machine data from response
      const updatedMachine = response.data.data?.machinery || response.data.data;

      // Update the store with the new parameters
      set((state) => ({
        ...state,
        currentMachine: state.currentMachine ? {
          ...state.currentMachine,
          parameters: updatedMachine?.parameters || parameters
        } : null,
        // Also update in machines list if it exists
        machines: state.machines.map(machine =>
          machine._id === machineId
            ? { ...machine, parameters: updatedMachine?.parameters || parameters }
            : machine
        ),
        isUpdating: false,
        error: null
      }));

      showNotification('Parameters updated successfully!', 'success');
      return true;

    } catch (error: any) {
      console.error('Error updating parameters:', error);

      let errorMessage = 'Failed to update parameters';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      // Set error state
      set((state) => ({
        ...state,
        isUpdating: false,
        error: errorMessage
      }));

      showNotification(errorMessage, 'error');
      return false;
    }
  },

  deleteMachine: async (id: string) => {
    set({ isDeleting: true, error: null });
    const { showNotification } = useNotificationStore.getState() as {
      showNotification: (message: string, type: string) => void
    };

    try {
      await api.delete(`/machinery/${id}`);

      // Remove the machine from the list
      set(state => ({
        machines: state.machines.filter(machine => machine._id !== id),
        currentMachine: state.currentMachine?._id === id ? null : state.currentMachine,
        isDeleting: false
      }));

      showNotification('Machine deleted successfully!', 'success');

      // Refetch machines to update pagination
      get().fetchMachines();

      return true;
    } catch (error: any) {
      let errorMessage = 'Failed to delete machine';

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      set({ error: errorMessage, isDeleting: false });
      showNotification(errorMessage, 'error');
      return false;
    }
  },

  clearCurrentMachine: () => {
    // set({ currentMachine: null });
    set({ finalLoading: false });
  },

  clearError: () => {
    set({ error: null });
    set({ finalLoading: false });
  },

  setFilters: (newFilters: Partial<MachineFilters>) => {
    const currentFilters = get().filters;
    const filters = { ...currentFilters, ...newFilters };
    set({ filters });
  },

  resetFilters: () => {
    set({ filters: defaultFilters });
    set({ finalLoading: false });
  }
}));