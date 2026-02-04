import { create } from 'zustand';
import api from '@/components/utils/api';
import { useNotificationStore } from '@/components/notify/notification';
import { log } from 'console';

export interface MachineParameter {
    paramID: string;
    name: string;
    value: number;
    unit: string;
}

export interface Machine {
    id?: string;
    imageUrl?: string;
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
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateMachinePayload {
    imageUrl: string;
    name: string;
    model: string;
    manufacturer: string;
    serialNumber: string;
    description: string;
    status: string;
    location: string;
    installationDate: string;
    tags: string[];
    parameters: MachineParameter[];
}

interface MachineState {
    customTags: Machine[];
    currentMachine: Machine | null;
    isLoading: boolean;
    isCreating: boolean;
    isUpdating: boolean;
    isDeleting: boolean;
    error: string | null;

    // Actions
    createMachine: (machineData: CreateMachinePayload) => Promise<boolean>;
    fetchCustomTags: () => Promise<void>;
    clearCurrentMachine: () => void;
    clearError: () => void;
}

export const useMachineCreationStore = create<MachineState>((set, get) => ({
    customTags: [],
    currentMachine: null,
    isLoading: false,
    isCreating: false,
    isUpdating: false,
    isDeleting: false,
    error: null,

    createMachine: async (machineData: CreateMachinePayload) => {
        set({ isCreating: true, error: null });
        const { showNotification } = useNotificationStore.getState() as {
            showNotification: (message: string, type: string) => void
        };

        try {
            const response = await api.post<Machine>('/machinery', machineData);

            // Add the new machine to the list
            set(state => ({
                // machines: [...state.machines, response.data],
                isCreating: false
            }));

            showNotification(`Machine created successfully! ${response}`, 'success');
            return true;
        } catch (error: any) {
            let errorMessage = 'Failed to create machine';

            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.message) {
                errorMessage = error.message;
            }

            set({ error: errorMessage, isCreating: false });
            showNotification(errorMessage, 'error');
            return false;
        }
    },

    fetchCustomTags: async () => {
        const { showNotification } = useNotificationStore.getState() as {
            showNotification: (message: string, type: string) => void;
        };

        try {

            const [customTagsRes, tagsRes] = await Promise.all([
                api.get('/machinery/customTags'),
                api.get('/machinery/tags')
            ]);

            // Handle possibly different shapes
            const customTags = Array.isArray(customTagsRes.data?.data)
                ? customTagsRes.data.data
                : customTagsRes.data;

            const tagsData = Array.isArray(tagsRes.data?.data?.tags)
                ? tagsRes.data.data.tags
                : tagsRes.data.tags || tagsRes.data;

            const mergedTags = [...(customTags || []), ...(tagsData || [])];
            // console.log("Tags: ", mergedTags)

            const uniqueTags = [...new Set(mergedTags)];

            set({ customTags: uniqueTags, isLoading: false });

        } catch (error: any) {
            let errorMessage = 'Failed to fetch tags';

            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.message) {
                errorMessage = error.message;
            }

            set({ error: errorMessage, isLoading: false });
            showNotification(errorMessage, 'error');
        }
    },

    clearCurrentMachine: () => {
        set({ currentMachine: null });
    },

    clearError: () => {
        set({ error: null });
    }
}));