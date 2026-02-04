// passwordStore.ts
import api from '@/components/utils/api';
import { create } from 'zustand';

interface PasswordData {
    admin?: string;
    user?: string;
    operator?: string;
}

interface PasswordStore {
    passwords: PasswordData;
    loading: { [key: string]: boolean };
    error: string | null;
    success: string | null;
    machineId: string;
    StatusDatas: {},

    // Actions
    setPassword: (role: string, password: string, id: string) => Promise<void>;
    updatePassword: (role: string, oldPassword: string, newPassword: string, id: string) => Promise<void>;
    removePassword: (role: string, id: string) => Promise<void>;
    setMachineId: (id: string,) => void;
    clearError: () => void;
    clearSuccess: () => void;
}

export const usePasswordStore = create<PasswordStore>((set, get) => ({
    StatusDatas: {},
    passwords: {
        admin: 'admin123', // Demo data
    },
    loading: {},
    error: null,
    success: null,
    machineId: 'MACH001',

    setPassword: async (role: string, password: string, id: any) => {

        set((state) => ({
            loading: { ...state.loading, [role]: true },
            error: null,
            success: null
        }));

        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            const response = await api.post(`machinery/${id}/password/set`, { role, password });

            set((state) => ({
                passwords: { ...state.passwords, [role]: password },
                loading: { ...state.loading, [role]: false },
                success: `${role.charAt(0).toUpperCase() + role.slice(1)} password has been set successfully`
            }));

            // Auto clear success message after 3 seconds
            setTimeout(() => {
                set((state) => ({ ...state, success: null }));
            }, 3000);

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to set password';
            set((state) => ({
                error: errorMessage,
                loading: { ...state.loading, [role]: false },
                success: null
            }));
            throw error;
        }
    },

    updatePassword: async (role: string, oldPassword: string, newPassword: string, id: string) => {

        set((state) => ({
            loading: { ...state.loading, [role]: true },
            error: null,
            success: null
        }));

        try {
            await new Promise(resolve => setTimeout(resolve, 1000));

            const response = await api.put(`machinery/${id}/password/update/${role}`, { oldPassword, newPassword });

            set((state) => ({
                passwords: { ...state.passwords, [role]: newPassword },
                loading: { ...state.loading, [role]: false },
                success: `${role.charAt(0).toUpperCase() + role.slice(1)} password has been updated successfully`
            }));

            // Auto clear success message after 3 seconds
            setTimeout(() => {
                set((state) => ({ ...state, success: null }));
            }, 3000);

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to update password';
            set((state) => ({
                error: errorMessage,
                loading: { ...state.loading, [role]: false },
                success: null
            }));
            throw error;
        }
    },

    removePassword: async (role: string, id: string) => {

        set((state) => ({
            loading: { ...state.loading, [role]: true },
            error: null,
            success: null
        }));

        try {
            await new Promise(resolve => setTimeout(resolve, 1000));

            const response = await api.delete(`machinery/${id}/password/${role}`);

            set((state) => {
                const newPasswords = { ...state.passwords };
                delete newPasswords[role as keyof PasswordData];
                return {
                    passwords: newPasswords,
                    loading: { ...state.loading, [role]: false },
                    success: `${role.charAt(0).toUpperCase() + role.slice(1)} password has been removed successfully`
                };
            });

            // Auto clear success message after 3 seconds
            setTimeout(() => {
                set((state) => ({ ...state, success: null }));
            }, 3000);

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to remove password';
            set((state) => ({
                error: errorMessage,
                loading: { ...state.loading, [role]: false },
                success: null
            }));
            throw error;
        }
    },

    getPasswordStatus: async (machineryId: string) => {
        set({
            // loading: true,
            error: null,
            success: null 
        });

        try {
            const response = await api.get(`machinery/${machineryId}/password/status`);

            const { data } = response.data;

            set({
                StatusDatas: data.passwordsSet,
                // loading: false,
                success: "Password status fetched successfully"
            });

            console.log("passwordsSet: ",data)

            // Auto clear success message after 3 seconds
            setTimeout(() => {
                set((state) => ({ ...state, success: null }));
            }, 3000);

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch password status';
            set({
                error: errorMessage,
                // loading: false,
                // data: null
            });
        }
    },

    setMachineId: (id: string) => {
        set({ machineId: id });
    },

    clearError: () => {
        set({ error: null });
    },

    clearSuccess: () => {
        set({ success: null });
    }
}));