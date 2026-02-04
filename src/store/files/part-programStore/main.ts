import { create } from "zustand";

interface PlcFileStore {
    selectedMachineId: string | null;
    selectMachine: (id: string | null) => void;
}

export const usePartProgramMainStore = create<PlcFileStore>((set, get) => ({
    // Initial state
    selectedMachineId: '6897781f64313a4ad2d57573',

    selectMachine: (id) => {
        set({ selectedMachineId: id });
    },

}))