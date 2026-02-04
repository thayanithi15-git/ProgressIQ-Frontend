import api from "@/components/utils/api";
import { useNotificationStore } from "@/components/notify/notification";
import { create } from "zustand";
import { log } from "node:console";

export type FileType = "manual" | "auto";
export type SectionType = "part-programs" | "plc-logic" | "config-files";

interface FileUploadFormData {
    file: File | null;
    description: string;
    tags: string[];
    setAsActive: boolean;
    fileType: FileType;
    isPasswordProtected: boolean;
    password: string;
    configType: string;
}

interface FileUploadStore {
    isModalOpen: boolean;
    currentSection: SectionType | null;
    uploadProgress: number;
    isUploading: boolean;
    formData: FileUploadFormData;
    errors: Record<string, string>;

    // Modal actions
    openModal: (section: SectionType) => void;
    closeModal: () => void;

    // Form actions
    updateFormData: <K extends keyof FileUploadFormData>(
        key: K,
        value: FileUploadFormData[K]
    ) => void;
    resetFormData: () => void;

    // Validation
    setError: (field: string, message: string) => void;
    clearError: (field: string) => void;
    clearAllErrors: () => void;
    validateForm: () => boolean;

    // Upload actions
    setUploadProgress: (progress: number) => void;
    setUploading: (status: boolean) => void;
    uploadPLCFile: (machineryId: string) => Promise<boolean>;
    uploadConfigFile: (machineryId: string) => Promise<boolean>;
    uploadPartProgramsFile: (machineryId: string) => Promise<boolean>;
}

const initialFormData: FileUploadFormData = {
    file: null,
    description: "",
    tags: [],
    setAsActive: false,
    fileType: "manual",
    isPasswordProtected: false,
    password: "",
    configType: "",
};

export const useFileUploadStore = create<FileUploadStore>((set, get) => ({
    isModalOpen: false,
    currentSection: null,
    uploadProgress: 0,
    isUploading: false,
    formData: { ...initialFormData },
    errors: {},

    openModal: (section) => set({
        isModalOpen: true,
        currentSection: section,
        formData: { ...initialFormData },
        errors: {},
        uploadProgress: 0
    }),

    closeModal: () => set({
        isModalOpen: false,
        currentSection: null,
        formData: { ...initialFormData },
        errors: {},
        uploadProgress: 0,
        isUploading: false
    }),

    updateFormData: (key, value) => set((state) => ({
        formData: { ...state.formData, [key]: value }
    })),

    resetFormData: () => set({
        formData: { ...initialFormData },
        errors: {},
        uploadProgress: 0
    }),

    setError: (field, message) => set((state) => ({
        errors: { ...state.errors, [field]: message }
    })),

    clearError: (field) => set((state) => {
        const { [field]: _, ...rest } = state.errors;
        return { errors: rest };
    }),

    clearAllErrors: () => set({ errors: {} }),

    validateForm: () => {
        const { formData, currentSection } = get();
        const errors: Record<string, string> = {};

        // Validate file
        if (!formData.file) {
            errors.file = "Please select a file to upload";
        }

        // Validate description
        if (!formData.description.trim()) {
            errors.description = "Description is required";
        } else if (formData.description.length < 10) {
            errors.description = "Description must be at least 10 characters long";
        }

        if(currentSection=='config files' && !formData.configType.trim() ) {
            errors.configType = "configType is required";
        }

        // Validate password if protected
        if (formData.isPasswordProtected) {
            if (!formData.password) {
                errors.password = "Password is required when file is password protected";
            } else if (formData.password.length < 6) {
                errors.password = "Password must be at least 6 characters long";
            }
        }

        // Validate tags
        if (formData.tags.length === 0) {
            errors.tags = "Please add at least one tag";
        }

        set({ errors });
        return Object.keys(errors).length === 0;
    },

    setUploadProgress: (progress) => set({ uploadProgress: progress }),

    setUploading: (status) => set({ isUploading: status }),

    uploadPLCFile: async (machineryId: string) => {
        const { formData, validateForm } = get();
        console.log("PLCCC")

        // Validate form first
        if (!validateForm()) {
            return false;
        }


        set({ isUploading: true, uploadProgress: 0 });

        try {
            // Ensure file exists before creating FormData
            if (!formData.file) {
                throw new Error("No file selected");
            }

            const formDataToSend = new FormData();

            // Append file first - this is critical for the backend
            formDataToSend.append('file', formData.file);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('tags', JSON.stringify(formData.tags));
            formDataToSend.append('setAsActive', formData.setAsActive.toString());
            formDataToSend.append('fileType', formData.fileType);
            formDataToSend.append('isPasswordProtected', formData.isPasswordProtected.toString());

            if (formData.isPasswordProtected && formData.password) {
                formDataToSend.append('password', formData.password);
            }

            // Log FormData contents for debugging
            console.log('FormData contents:');
            for (let [key, value] of formDataToSend.entries()) {
                console.log(key, value);
            }

            // Simulate upload progress
            const progressInterval = setInterval(() => {
                set((state) => ({
                    uploadProgress: Math.min(state.uploadProgress + 10, 90)
                }));
            }, 200);

            const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || '';
            const token = localStorage.getItem("token");

            // Make API call with proper multipart/form-data headers
            const authHeader = typeof api.defaults.headers.Authorization === 'string'
                ? api.defaults.headers.Authorization
                : String(api.defaults.headers.Authorization || '');

            const response = await fetch(`${BASE_URL}machinery/${machineryId}/files/upload`, {
                method: "POST",
                body: formDataToSend,
                headers: {
                    // Do not set Content-Type manually so boundary is included
                    ...(token && { "x-auth-token": token }),
                },
            });

            clearInterval(progressInterval);
            set({ uploadProgress: 100 });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Upload failed: ${response.statusText}`);
            }

            const result = await response.json();

            if (result.status === 'success') {
                // Show success notification
                const { showNotification } = useNotificationStore.getState();
                showNotification(result.message || 'File uploaded successfully!', 'success');

                // Reset form and close modal after successful upload
                setTimeout(() => {
                    get().closeModal();
                }, 500);
                return true;
            } else {
                throw new Error(result.message || 'Upload failed');
            }

        } catch (error) {
            console.error('Upload error:', error);

            // Show error notification
            const { showNotification } = useNotificationStore.getState();
            const errorMessage = error instanceof Error ? error.message : 'Upload failed. Please try again.';
            showNotification(errorMessage, 'error');

            set({
                errors: {
                    general: errorMessage
                },
                uploadProgress: 0
            });
            return false;
        } finally {
            set({ isUploading: false });
        }
    },

    uploadConfigFile: async (machineryId: string) => {
        const { formData, validateForm } = get();

        // Validate form first
        if (!validateForm()) {
            return false;
        }

        set({ isUploading: true, uploadProgress: 0 });

        try {
            // Ensure file exists before creating FormData
            if (!formData.file) {
                throw new Error("No file selected");
            } 

            const formDataToSend = new FormData();

            // Append file first - this is critical for the backend
            formDataToSend.append('file', formData.file);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('configType', formData.configType);
            formDataToSend.append('tags', JSON.stringify(formData.tags));
            formDataToSend.append('setAsActive', formData.setAsActive.toString());
            formDataToSend.append('fileType', formData.fileType);
            formDataToSend.append('isPasswordProtected', formData.isPasswordProtected.toString());

            if (formData.isPasswordProtected && formData.password) {
                formDataToSend.append('password', formData.password);
            }

            // Log FormData contents for debugging
            console.log('FormData contents:');
            for (let [key, value] of formDataToSend.entries()) {
                console.log(key, value);
            }

            // Simulate upload progress
            const progressInterval = setInterval(() => {
                set((state) => ({
                    uploadProgress: Math.min(state.uploadProgress + 10, 90)
                }));
            }, 200);

            const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || '';
            const token = localStorage.getItem("token");

            // Make API call with proper multipart/form-data headers
            const authHeader = typeof api.defaults.headers.Authorization === 'string'
                ? api.defaults.headers.Authorization
                : String(api.defaults.headers.Authorization || '');

            const response = await fetch(`${BASE_URL}machinery/${machineryId}/config/upload`, {
                method: "POST",
                body: formDataToSend,
                headers: {
                    // Do not set Content-Type manually so boundary is included
                    ...(token && { "x-auth-token": token }),
                },
            });

            clearInterval(progressInterval);
            set({ uploadProgress: 100 });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Upload failed: ${response.statusText}`);
            }

            const result = await response.json();

            if (result.status === 'success') {
                // Show success notification
                const { showNotification } = useNotificationStore.getState();
                showNotification(result.message || 'File uploaded successfully!', 'success');

                // Reset form and close modal after successful upload
                setTimeout(() => {
                    get().closeModal();
                }, 500);
                return true;
            } else {
                throw new Error(result.message || 'Upload failed');
            }

        } catch (error) {
            console.error('Upload error:', error);

            // Show error notification
            const { showNotification } = useNotificationStore.getState();
            const errorMessage = error instanceof Error ? error.message : 'Upload failed. Please try again.';
            showNotification(errorMessage, 'error');

            set({
                errors: {
                    general: errorMessage
                },
                uploadProgress: 0
            });
            return false;
        } finally {
            set({ isUploading: false });
        }
    },

    uploadPartProgramsFile: async (machineryId: string) => {
        const { formData, validateForm } = get();

        // Validate form first
        if (!validateForm()) {
            return false;
        }

        set({ isUploading: true, uploadProgress: 0 });

        try {
            // Ensure file exists before creating FormData
            if (!formData.file) {
                throw new Error("No file selected");
            } 

            const formDataToSend = new FormData();

            // Append file first - this is critical for the backend
            formDataToSend.append('file', formData.file);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('configType', formData.configType);
            formDataToSend.append('tags', JSON.stringify(formData.tags));
            formDataToSend.append('setAsActive', formData.setAsActive.toString());
            formDataToSend.append('fileType', formData.fileType);
            formDataToSend.append('isPasswordProtected', formData.isPasswordProtected.toString());

            if (formData.isPasswordProtected && formData.password) {
                formDataToSend.append('password', formData.password);
            }

            // Log FormData contents for debugging
            console.log('FormData contents:');
            for (let [key, value] of formDataToSend.entries()) {
                console.log(key, value);
            }

            // Simulate upload progress
            const progressInterval = setInterval(() => {
                set((state) => ({
                    uploadProgress: Math.min(state.uploadProgress + 10, 90)
                }));
            }, 200);

            const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || '';
            const token = localStorage.getItem("token");

            // Make API call with proper multipart/form-data headers
            const authHeader = typeof api.defaults.headers.Authorization === 'string'
                ? api.defaults.headers.Authorization
                : String(api.defaults.headers.Authorization || '');

            const response = await fetch(`${BASE_URL}machinery/${machineryId}/part-programs`, {
                method: "POST",
                body: formDataToSend,
                headers: {
                    // Do not set Content-Type manually so boundary is included
                    ...(token && { "x-auth-token": token }),
                },
            });

            clearInterval(progressInterval);
            set({ uploadProgress: 100 });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Upload failed: ${response.statusText}`);
            }

            const result = await response.json();

            if (result.status === 'success') {
                // Show success notification
                const { showNotification } = useNotificationStore.getState();
                showNotification(result.message || 'File uploaded successfully!', 'success');

                // Reset form and close modal after successful upload
                setTimeout(() => {
                    get().closeModal();
                }, 500);
                return true;
            } else {
                throw new Error(result.message || 'Upload failed');
            }

        } catch (error) {
            console.error('Upload error:', error);

            // Show error notification
            const { showNotification } = useNotificationStore.getState();
            const errorMessage = error instanceof Error ? error.message : 'Upload failed. Please try again.';
            showNotification(errorMessage, 'error');

            set({
                errors: {
                    general: errorMessage
                },
                uploadProgress: 0
            });
            return false;
        } finally {
            set({ isUploading: false });
        }
    }
}));