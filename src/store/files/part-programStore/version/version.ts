import api from '@/components/utils/api';
import { create } from 'zustand';

// Updated interface to match the API response
export interface PartProgramsVersion {
    _id: string;
    machinery: {
        _id: string;
        name: string;
        serialNumber: string;
        passwords?: Record<string, any>;
        passwordsSet?: Record<string, any>;
    };
    configName: string;
    fileName: string;
    originalFileName: string;
    gcpFilePath?: string;
    storageMethod: 'gcp' | 'mongodb';
    fileSize: number;
    mimeType: string;
    fileExtension: string;
    configType: string;
    version: number;
    isActive: boolean;
    description: string;
    configSettings: Record<string, any>;
    uploadedBy: {
        _id: string;
        name: string;
        email: string;
    };
    downloadCount: number;
    checksum: string;
    tags: string[];
    validationStatus: string;
    environment: string;
    createdAt: string;
    updatedAt: string;
}

export interface ConfigsResponse {
    status: string;
    data: {
        configs: PartProgramsVersion[];
        machinery: {
            _id: string;
            name: string;
            serialNumber: string;
        };
        pagination: {
            currentPage: number;
            totalPages: number;
            totalFiles: number;
            hasNext: boolean;
            hasPrev: boolean;
        };
    };
}

export interface ConfigDetailResponse {
    status: string;
    data: {
        config: PartProgramsVersion;
    };
}

interface ConfigVersionStore {
    // State
    versions: PartProgramsVersion[];
    selectedVersion: PartProgramsVersion | null;
    fileContent: string | null;
    currentMachinery: { _id: string; name: string; serialNumber: string } | null;
    pagination: {
        currentPage: number;
        totalPages: number;
        totalFiles: number;
        hasNext: boolean;
        hasPrev: boolean;
    } | null;

    // Loading states
    isLoadingVersions: boolean;
    isLoadingFileDetail: boolean;
    isLoadingContent: boolean;
    isLoadingDownload: boolean;

    downloadPasswordInput: string;

    selectedMachineId: string | null;

    // Error states
    versionsError: string | null;
    fileDetailError: string | null;
    contentError: string | null;
    downloadError: string | null;

    // Password state
    isPasswordRequired: boolean;
    passwordInput: string;
    isDownloadPasswordRequired: boolean;

    selectedContent: any;

    // Actions
    selectMachine: (id: string | null) => void;
    handleActivateVersion: (machineryId: string, configId: string) => void;
    fetchVersions: (machineId: string, page?: number, limit?: number) => Promise<void>;
    fetchFileDetail: (partprogramId: string, fileId: string) => Promise<void>;
    handleDeleteVersion: (machineryId: string, configId: string) => Promise<void>;
    fetchFileContent: (machineryId: string, configId: string, password?: string) => Promise<void>;

    downloadFile: (fileId: string) => Promise<void>;
    setDownloadPasswordInput: (password: string) => void;
    resetDownloadPasswordState: () => void;

    selectVersion: (partprogramId: string, fileId: string) => void;
    setPasswordInput: (password: string) => void;
    resetPasswordState: () => void;
    clearErrors: () => void;
    reset: () => void;
}

export const usePartProgramsVersionStore = create<ConfigVersionStore>((set, get) => ({
    // Initial state
    selectedMachineId: '6897781f64313a4ad2d57573',
    versions: [],
    selectedVersion: null,
    fileContent: null,
    currentMachinery: null,
    pagination: null,
    isLoadingDownload: false,
    
    selectedContent: '',

    isDownloadPasswordRequired: false,
    downloadPasswordInput: '',

    isLoadingVersions: false,
    isLoadingFileDetail: false,
    isLoadingContent: false,

    versionsError: null,
    fileDetailError: null,
    contentError: null,
    downloadError: null,

    isPasswordRequired: false,
    passwordInput: '',

    // Selection actions
    selectMachine: (id) => {
        set({ selectedMachineId: id });
        if (id && id !== 'null') {
            get().fetchVersions(id);
        }
    },

    // Actions
    fetchVersions: async (partprogramId: string, page = 1, limit = 10) => {
        set({ isLoadingVersions: true, versionsError: null });

        try {
            const response = await api.get(`machinery/part-programs/${partprogramId}/files`);
            const totalDatas = response.data;

            set({
                versions: totalDatas.data,
                currentMachinery: totalDatas.data.machinery,
                pagination: totalDatas.data.pagination,
                isLoadingVersions: false
            });

        } catch (error) {
            set({
                versionsError: error instanceof Error ? error.message : 'Failed to fetch versions',
                isLoadingVersions: false
            });
        }
    },

    fetchFileDetail: async (partprogramId: string, fileId: string) => {
        set({ isLoadingFileDetail: true, fileDetailError: null });

        try {
            const response = await api.get(`machinery/part-programs/${partprogramId}/files/${fileId}/content`);
            const totalDatas = response.data;

            // console.log('Config Detail Response:', totalDatas.data.fileInfo);

            set({
                selectedVersion: totalDatas.data.fileInfo,
                selectedContent: totalDatas.data.content,
                isLoadingFileDetail: false,
                // Check if password is required - you may need to adjust this based on your API
                // isPasswordRequired: totalDatas.data.config.configSettings?.isPasswordProtected || false,
                // fileContent: null // Clear previous content
            });

            // If not password protected, fetch content automatically
            // if (!totalDatas.data.config.configSettings?.isPasswordProtected) {
            //     get().fetchFileContent(machineryId, configId);
            // }

        } catch (error) {
            set({
                fileDetailError: error instanceof Error ? error.message : 'Failed to fetch file detail',
                isLoadingFileDetail: false
            });
        }
    },

    handleDeleteVersion: async (selectedPartProgramId: string,fileId: string) => {
        try {
            const response = await api.delete(`machinery/part-program-files/${fileId}`);

            if (response) {
                get().fetchVersions(selectedPartProgramId);
                // Clear selected version if it was deleted
                // const currentSelected = get().selectedVersion;
                // if (currentSelected?._id === configId) {
                //     set({ selectedVersion: null, fileContent: null });
                // }

                // Refresh the versions list
            }

        } catch (error) {
            set({
                fileDetailError: error instanceof Error ? error.message : 'Failed to delete version',
            });
        }
    },

    handleActivateVersion: async (partprogramId: string, fileId: string) => {
        try {
            const response = await api.put(`machinery/part-programs/${partprogramId}/activate-file/${fileId}`);

            if (response) {
                // Refresh the versions list to update the active status
                get().fetchVersions(partprogramId);

                // Also refresh the selected version detail if it's the activated one
                const currentSelected = get().selectedVersion;
                if (currentSelected?._id === partprogramId) {
                    get().fetchFileDetail(partprogramId, fileId);
                }
            }

        } catch (error) {
            set({
                fileDetailError: error instanceof Error ? error.message : 'Failed to activate version',
            });
        }
    },

    fetchFileContent: async (machineryId: string, configId: string, password?: string) => {
        set({ isLoadingContent: true, contentError: null });

        try {
            const url = `machinery/${machineryId}/config/${configId}${password ? `?password=${password}` : ''}/content`;
            const response = await api.get(url);

            set({
                fileContent: response.data.data.content,
                isLoadingContent: false,
                isPasswordRequired: false,
                passwordInput: ''
            });

        } catch (error) {
            set({
                contentError: error instanceof Error ? error.message : 'Failed to fetch file content',
                isLoadingContent: false
            });

            // If it's a password error, show password input
            if (error instanceof Error && error.message.includes('password')) {
                set({ isPasswordRequired: true });
            }
        }
    },

    setDownloadPasswordInput: (password: string) => {
        set({ downloadPasswordInput: password });
    },



    downloadFile: async (fileId: string) => {
        set({ isLoadingDownload: true, downloadError: null });

        // console.log("cledk")

        try {
            const payload: any = {};
            // if (password) {
            //     payload.password = password;
            // }

            const response = await api.get(`machinery/part-programs-files/${fileId}/download`);

            // Create blob link to download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;

            // Get filename from response headers or use default
            const contentDisposition = response.headers['content-disposition'];
            let filename = 'download';
            if (contentDisposition) {
                const filenameMatch = contentDisposition.match(/filename="(.+)"/);
                if (filenameMatch) {
                    filename = filenameMatch[1];
                }
            } else if (get().selectedVersion) {
                filename = get().selectedVersion!.originalFileName;
            }

            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

            set({
                isLoadingDownload: false,
                isDownloadPasswordRequired: false,
                downloadPasswordInput: ''
            });

            // Refresh versions to update download count
            // get().fetchVersions(machineryId);

        } catch (error) {
            set({
                downloadError: error instanceof Error ? error.message : 'Failed to download file',
                isLoadingDownload: false
            });

            // If it's a password error, show password input
            if (error instanceof Error && error.message.includes('password')) {
                set({ isDownloadPasswordRequired: true });
            }
        }
    },

    selectVersion: (partprogramId: string, fileId: string) => {
        get().fetchFileDetail(partprogramId, fileId);
    },

    setPasswordInput: (password: string) => {
        set({ passwordInput: password });
    },

    resetPasswordState: () => {
        set({
            isPasswordRequired: false,
            passwordInput: '',
            contentError: null
        });
    },

    clearErrors: () => {
        set({
            versionsError: null,
            fileDetailError: null,
            contentError: null
        });
    },

    resetDownloadPasswordState: () => {
        set({
            isDownloadPasswordRequired: false,
            downloadPasswordInput: '',
            downloadError: null
        });
    },

    reset: () => {
        set({
            versions: [],
            selectedVersion: null,
            fileContent: null,
            currentMachinery: null,
            pagination: null,
            isLoadingVersions: false,
            isLoadingFileDetail: false,
            isLoadingContent: false,
            versionsError: null,
            fileDetailError: null,
            contentError: null,
            isPasswordRequired: false,
            passwordInput: ''
        });
    }
}));