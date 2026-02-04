import api from "@/components/utils/api";
import { create } from "zustand";

interface PlcFileStore {
    selectedPartProgramId: string | null;
    selectPartProgram: (id: string | null) => void;
    isModalOpen: boolean;
    loading: boolean,

    PartProgramFiles: [],
    fetchPartProgram: (id: string) => void;
}

export const usePartProgramFileStore = create<PlcFileStore>((set, get) => ({
    // Initial state
    selectedPartProgramId: '689cd14e64b8f326c822de43',
    isModalOpen: false,
    loading: false,
    PartProgramFiles: [],
    error: null,

    selectPartProgram: (id) => {
        set({ selectedPartProgramId: id });
    },

    openModal: () => set({
        isModalOpen: true,
    }),

    closeModal: () => set({
        isModalOpen: false,
    }),

    fetchPartProgram: async (partprogramId: string) => {

        try {
            set({ loading: true, error: null });
            // Fetch active file details (your existing API)
            const response = await api.get(`machinery/part-programs/${partprogramId}`);

            // console.log("datas: ",response.data.data.activeFile)

            // Add active file to appropriate section based on file extension or type
            set({ PartProgramFiles: response.data.data });


        } catch (error) {
            console.error('Error fetching files:', error);
            set({
                // error: 'Failed to load files. Please try again.',

            });
        } finally {
            set({ loading: false })
        }
    },

}))