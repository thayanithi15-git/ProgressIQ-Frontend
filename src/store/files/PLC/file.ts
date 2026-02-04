import api from "@/components/utils/api";
import { create } from "zustand";

interface FileDetails {
    _id: string;
    machinery: string;
    fileName: string;
    originalFileName: string;
    fileSize: number;
    mimeType: string;
    fileExtension: string;
    version: number;
    isActive: boolean;
    description: string;
    uploadedBy: {
        _id: string;
        name: string;
        email: string;
    };
    downloadCount: number;
    tags: string[];
    fileType: string;   
    isPasswordProtected: boolean;
    createdAt: string;
    updatedAt: string;
}

interface MachineryData {
    _id: string;
    name: string;
    serialNumber: string;
}

interface PlcFileStore {
    // Selection
    selectedMachineId: string | null;

    // Data
    machineryData: MachineryData | null;
    partProgramFiles: FileDetails[];
    plcLogicFiles: FileDetails[];
    configFiles: FileDetails[];

    // Loading states
    loading: boolean;
    error: string | null;

    // Actions
    selectMachine: (id: string | null) => void;
    clearSelection: () => void;

    // File management
    fetchPLC: (machineryId: string) => Promise<void>;
    fetchConfigs: (machineryId: string) => Promise<void>;
    fetchPartPrograms: (machineryId: string) => Promise<void>;

    // Utility
    clearAllData: () => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
}

export const usePlcFileStore = create<PlcFileStore>((set, get) => ({
    // Initial state
    selectedMachineId: '6897781f64313a4ad2d57573',
    machineryData: null,
    partProgramFiles: [],
    plcLogicFiles: [],
    configFiles: [],
    loading: false,
    error: null,

    // Selection actions
    selectMachine: (id) => {
        set({ selectedMachineId: id });
        if (id && id !== 'null') {
            get().fetchPLC(id);
            get().fetchConfigs(id);
        } else {
            get().clearAllData();
        }
    },

    clearSelection: () => {
        set({ selectedMachineId: null });
        get().clearAllData();
    },

    // File fetching
    fetchPLC: async (machineryId: string) => {

        try {
            set({ loading: true, error: null });
            // Fetch active file details (your existing API)
            const response = await api.get(`machinery/${machineryId}/files/active`);

            // console.log("datas: ",response.data.data.activeFile)

            // Add active file to appropriate section based on file extension or type
            set({ plcLogicFiles: response.data.data.activeFile });


        } catch (error) {
            console.error('Error fetching files:', error);
            set({
                error: 'Failed to load files. Please try again.',
                
            });
        } finally{
            set({ loading: false })
        }
    },

    fetchConfigs: async (machineryId: string) => {

        try {
            set({ loading: true, error: null });
            // Fetch active file details (your existing API)
            const response = await api.get(`machinery/${machineryId}/config/active`);

            // console.log("datas: ",response.data.data.activeFile)

            // Add active file to appropriate section based on file extension or type
            console.log(" COnfig: ",response.data.data.activeConfig)
            set({ configFiles: response.data.data.activeConfig });


        } catch (error) {
            console.error('Error fetching files:', error);
            set({
                error: 'Failed to load files. Please try again.',
                
            });
        } finally{
            set({ loading: false })
        }
    },

    fetchPartPrograms: async (machineryId: string) => {

        try {
            set({ loading: true, error: null });
            // Fetch active file details (your existing API)
            const response = await api.get(`machinery/${machineryId}/files/active`);

            // console.log("datas: ",response.data.data.activeFile)

            // Add active file to appropriate section based on file extension or type
            set({ plcLogicFiles: response.data.data.activeFile });


        } catch (error) {
            console.error('Error fetching files:', error);
            set({
                error: 'Failed to load files. Please try again.',
                
            });
        } finally{
            set({ loading: false })
        }
    },

    // Utility actions
    clearAllData: () => {
        set({
            machineryData: null,
            partProgramFiles: [],
            plcLogicFiles: [],
            configFiles: [],
            error: null,
            loading: false
        });
    },

    setLoading: (loading) => set({ loading }),

    setError: (error) => set({ error })
})); 