import api from "@/components/utils/api";
import { create } from "zustand";

export interface FileVersion {
  _id: string;
  machinery: string;
  fileName: string;
  originalFileName: string;
  gcpFilePath?: string;
  storageMethod: "gcp" | "mongodb";
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
  checksum: string;
  tags: string[];
  fileType: string;
  isPasswordProtected: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FileDetail extends FileVersion {
  machinery: {
    _id: string;
    name: string;
    serialNumber: string;
    passwords?: Record<string, any>;
    passwordsSet?: Record<string, any>;
  };
}

export interface VersionsResponse {
  status: string;
  data: {
    files: FileVersion[];
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

export interface FileDetailResponse {
  status: string;
  data: {
    file: FileDetail;
  };
}

interface VersionStore {
  // State
  versions: FileVersion[];
  selectedVersion: FileDetail | null;
  fileContent: string | null;
  currentMachinery: { _id: string; name: string; serialNumber: string } | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalFiles: number;
    hasNext: boolean;
    hasPrev: boolean;
  } | null;

  // Compare functionality
  compareFile1: FileVersion | null;
  compareFile2: FileVersion | null;
  compareContent1: string | null;
  compareContent2: string | null;
  isComparing: boolean;
  compareError: string | null;

  comparePassword1: string;
  comparePassword2: string;
  isComparePasswordRequired1: boolean;
  isComparePasswordRequired2: boolean;
  comparePasswordError: string | null;

  // Loading states
  isLoadingVersions: boolean;
  isLoadingFileDetail: boolean;
  isLoadingContent: boolean;
  isLoadingDownload: boolean;

  selectedMachineId: string | null;

  // Error states
  versionsError: string | null;
  fileDetailError: string | null;
  contentError: string | null;
  downloadError: string | null;

  // Password state for viewing content
  isPasswordRequired: boolean;
  passwordInput: string;

  // Password state for downloading
  isDownloadPasswordRequired: boolean;
  downloadPasswordInput: string;

  //
  fileType: string;
  machineId: string;

  // Actions
  selectMachine: (id: string | null) => void;
  handleActivateVersion: (machineryId: string, fileId: string) => void;
  fetchVersions: (
    machineId: string,
    page?: number,
    limit?: number
  ) => Promise<void>;
  fetchFileDetail: (machineryId: string, fileId: string) => Promise<void>;
  handleDeleteVersion: (machineryId: string, fileId: string) => Promise<void>;
  fetchFileContent: (
    machineryId: string,
    fileId: string,
    password?: string
  ) => Promise<void>;
  downloadFile: (
    machineryId: string,
    fileId: string,
    password: string
  ) => Promise<void>;
  selectVersion: (selectedMachineId: string, version: string) => void;
  setPasswordInput: (password: string) => void;
  setDownloadPasswordInput: (password: string) => void;
  resetPasswordState: () => void;
  resetDownloadPasswordState: () => void;
  clearErrors: () => void;
  reset: () => void;

  //new actions for compare functionality
  setCompareFile1: (file: FileVersion | null) => void;
  setCompareFile2: (file: FileVersion | null) => void;
  fetchCompareContent: (
    machineryId: string,
    fileId1: string,
    fileId2: string
  ) => Promise<void>;
  resetCompare: () => void;

  setComparePassword1: (password: string) => void;
  setComparePassword2: (password: string) => void;
  resetComparePasswordState: () => void;
}

export const usePLCVersionStore = create<VersionStore>((set, get) => ({
  // Initial state
  selectedMachineId: "6897781f64313a4ad2d57573",
  versions: [],
  selectedVersion: null,
  fileContent: null,
  currentMachinery: null,
  pagination: null,

  fileType: "",
  machineId: "",

  isLoadingVersions: false,
  isLoadingFileDetail: false,
  isLoadingContent: false,
  isLoadingDownload: false,

  versionsError: null,
  fileDetailError: null,
  contentError: null,
  downloadError: null,

  isPasswordRequired: false,
  passwordInput: "",

  isDownloadPasswordRequired: false,
  downloadPasswordInput: "",

  compareFile1: null,
  compareFile2: null,
  compareContent1: null,
  compareContent2: null,
  isComparing: false,
  compareError: null,

  comparePassword1: "",
  comparePassword2: "",
  isComparePasswordRequired1: false,
  isComparePasswordRequired2: false,
  comparePasswordError: null,

  // Selection actions
  selectMachine: (id) => {
    set({ selectedMachineId: id });
    if (id && id !== "null") {
      get().fetchVersions(id);
      // get().fetchConfigs(id);
    } else {
      // get().clearAllData();
    }
  },

  // Actions
  fetchVersions: async (machineId: string, page = 1, limit = 10) => {
    set({ isLoadingVersions: true, versionsError: null });

    try {
      const response = await api.get(
        `machinery/${machineId}/files?page=${page}&limit=${limit}`
      );

      const totalDatas = response.data;

      set({
        versions: totalDatas.data.files,
        currentMachinery: totalDatas.machinery,
        pagination: totalDatas.pagination,
        isLoadingVersions: false,
      });

      // Auto-select the active version if available
      // const activeVersion = data?.data?.files?.find(
      //     (f: { isActive: any }) => f.isActive
      // );

      // if (activeVersion && !get().selectedVersion) {
      //     get().fetchFileDetail(machineId, activeVersion._id);
      // }
    } catch (error) {
      set({
        versionsError:
          error instanceof Error ? error.message : "Failed to fetch versions",
        isLoadingVersions: false,
      });
    }
  },

  fetchFileDetail: async (machineryId: string, fileId: string) => {
    set({ isLoadingFileDetail: true, fileDetailError: null });

    try {
      const response = await api.get(
        `machinery/${machineryId}/files/${fileId}`
      );

      const totalDatas = response.data;

      set({
        selectedVersion: totalDatas.data.file,
        isLoadingFileDetail: false,
        isPasswordRequired: totalDatas.data.file.isPasswordProtected,
        fileContent: null, // Clear previous content
      });

      // If not password protected, fetch content automatically
      if (!totalDatas.data.file.isPasswordProtected) {
        get().fetchFileContent(machineryId, fileId);
      }
    } catch (error) {
      set({
        fileDetailError:
          error instanceof Error
            ? error.message
            : "Failed to fetch file detail",
        isLoadingFileDetail: false,
      });
    }
  },

  handleDeleteVersion: async (machineryId: string, fileId: string) => {
    // set({ isLoadingFileDetail: true, fileDetailError: null });

    try {
      const response = await api.delete(
        `machinery/${machineryId}/files/${fileId}`
      );

      set({
        // selectedVersion: totalDatas.data.file,
        // isLoadingFileDetail: false,
        // isPasswordRequired: totalDatas.data.file.isPasswordProtected,
        // fileContent: null // Clear previous content
      });

      if (response) {
        get().fetchVersions(machineryId);
      }
    } catch (error) {
      set({
        fileDetailError:
          error instanceof Error
            ? error.message
            : "Failed to fetch file detail",
        isLoadingFileDetail: false,
      });
    }
  },

  handleActivateVersion: async (machineryId: string, fileId: string) => {
    // set({ isLoadingFileDetail: true, fileDetailError: null });

    try {
      const response = await api.put(
        `machinery/${machineryId}/files/${fileId}/activate`
      );

      set({
        // selectedVersion: totalDatas.data.file,
        // isLoadingFileDetail: false,
        // isPasswordRequired: totalDatas.data.file.isPasswordProtected,
        // fileContent: null // Clear previous content
      });

      if (response) {
        get().fetchVersions(machineryId);
      }
    } catch (error) {
      set({
        fileDetailError:
          error instanceof Error
            ? error.message
            : "Failed to fetch file detail",
        isLoadingFileDetail: false,
      });
    }
  },

  fetchFileContent: async (
    machineryId: string,
    fileId: string,
    password?: string
  ) => {
    set({ isLoadingContent: true, contentError: null });

    try {
      // const url = new URL(`machinery/${machineryId}/files/${fileId}/content`);
      // if (password) {
      //     url.searchParams.append('password', password);
      // }

      const response = await api.get(
        `machinery/${machineryId}/files/${fileId}/content?password=${password}`
      );

      // const content = response;

      set({
        fileContent: response.data.data.content,
        isLoadingContent: false,
        isPasswordRequired: false,
        passwordInput: "",
      });

      if (response) {
        // console.log(response);
      }
    } catch (error) {
      set({
        contentError:
          error instanceof Error
            ? error.message
            : "Failed to fetch file content",
        isLoadingContent: false,
      });

      // If it's a password error, show password input
      if (error instanceof Error && error.message.includes("password")) {
        set({ isPasswordRequired: true });
      }
    }
  },

  downloadFile: async (
    machineryId: string,
    fileId: string,
    password: string
  ) => {
    set({ isLoadingDownload: true, downloadError: null });

    console.log("cledk");

    try {
      const payload: any = {};
      if (password) {
        payload.password = password;
      }

      const response = await api.post(
        `machinery/${machineryId}/files/${fileId}/download`,
        payload
      );

      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;

      // Get filename from response headers or use default
      const contentDisposition = response.headers["content-disposition"];
      let filename = "download";
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      } else if (get().selectedVersion) {
        filename = get().selectedVersion!.originalFileName;
      }

      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      set({
        isLoadingDownload: false,
        isDownloadPasswordRequired: false,
        downloadPasswordInput: "",
      });

      // Refresh versions to update download count
      // get().fetchVersions(machineryId);
    } catch (error) {
      set({
        downloadError:
          error instanceof Error ? error.message : "Failed to download file",
        isLoadingDownload: false,
      });

      // If it's a password error, show password input
      if (error instanceof Error && error.message.includes("password")) {
        set({ isDownloadPasswordRequired: true });
      }
    }
  },

  selectVersion: (selectedMachineId: string, version: string) => {
    // if (get().currentMachinery) {
    get().fetchFileDetail(selectedMachineId, version);
    // }
  },

  setPasswordInput: (password: string) => {
    set({ passwordInput: password });
  },

  setDownloadPasswordInput: (password: string) => {
    set({ downloadPasswordInput: password });
  },

  setFileType: (file: string) => {
    set({ fileType: file });
  },

  setMachineId: (id: string) => {
    set({ machineId: id });
  },

  resetPasswordState: () => {
    set({
      isPasswordRequired: false,
      passwordInput: "",
      contentError: null,
    });
  },

  resetDownloadPasswordState: () => {
    set({
      isDownloadPasswordRequired: false,
      downloadPasswordInput: "",
      downloadError: null,
    });
  },

  clearErrors: () => {
    set({
      versionsError: null,
      fileDetailError: null,
      contentError: null,
      downloadError: null,
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
      isLoadingDownload: false,
      versionsError: null,
      fileDetailError: null,
      contentError: null,
      downloadError: null,
      isPasswordRequired: false,
      passwordInput: "",
      isDownloadPasswordRequired: false,
      downloadPasswordInput: "",
    });
  },

  setCompareFile1: (file) => {
    console.log(file);
    set({ compareFile1: file });
  },
  setCompareFile2: (file) => set({ compareFile2: file }),

  fetchCompareContent: async (machineryId, fileId1, fileId2) => {
    set({ isComparing: true, compareError: null, comparePasswordError: null });

    try {
      const { compareFile1, compareFile2, comparePassword1, comparePassword2 } =
        get();

      // Check if files are password protected
      const file1 = compareFile1;
      const file2 = compareFile2;

      if (!file1 || !file2) {
        throw new Error("Files not selected");
      }

      // If files are password protected but passwords not provided, set the required flags
      if (file1.isPasswordProtected && !comparePassword1) {
        set({
          isComparePasswordRequired1: true,
          comparePasswordError: "Password required for the first file",
          isComparing: false,
        });
        return;
      }

      if (file2.isPasswordProtected && !comparePassword2) {
        set({
          isComparePasswordRequired2: true,
          comparePasswordError: "Password required for the second file",
          isComparing: false,
        });
        return;
      }

      // Prepare password params only if files are password protected
      const params1 = file1.isPasswordProtected
        ? `?password=${encodeURIComponent(comparePassword1)}`
        : "";
      const params2 = file2.isPasswordProtected
        ? `?password=${encodeURIComponent(comparePassword2)}`
        : "";

      // Fetch both files' content
      const [response1, response2] = await Promise.all([
        api.get(`machinery/${machineryId}/files/${fileId1}/content${params1}`),
        api.get(`machinery/${machineryId}/files/${fileId2}/content${params2}`),
      ]);

      set({
        compareContent1: response1.data.data.content,
        compareContent2: response2.data.data.content,
        isComparing: false,
        isComparePasswordRequired1: false,
        isComparePasswordRequired2: false,
        comparePasswordError: null,
      });
    } catch (error) {
      console.error("Compare error:", error);

      // Handle password errors specifically
      if (error instanceof Error) {
        if (
          error.message.includes("password") ||
          error.message.includes("unauthorized")
        ) {
          const { compareFile1, compareFile2 } = get();

          // Set password required flags based on which files are protected
          set({
            isComparePasswordRequired1:
              compareFile1?.isPasswordProtected || false,
            isComparePasswordRequired2:
              compareFile2?.isPasswordProtected || false,
            comparePasswordError: "Incorrect password or password required",
            isComparing: false,
          });
        } else {
          set({
            compareError: error.message,
            isComparing: false,
          });
        }
      } else {
        set({
          compareError: "Failed to fetch files for comparison",
          isComparing: false,
        });
      }
    }
  },

  resetCompare: () =>
    set({
      compareFile1: null,
      compareFile2: null,
      compareContent1: null,
      compareContent2: null,
      isComparing: false,
      compareError: null,
      comparePassword1: "",
      comparePassword2: "",
      isComparePasswordRequired1: false,
      isComparePasswordRequired2: false,
      comparePasswordError: null,
    }),
  setComparePassword1: (password) => set({ comparePassword1: password }),
  setComparePassword2: (password) => set({ comparePassword2: password }),

  resetComparePasswordState: () =>
    set({
      comparePassword1: "",
      comparePassword2: "",
      isComparePasswordRequired1: false,
      isComparePasswordRequired2: false,
      comparePasswordError: null,
      compareContent1: null, // Clear content when resetting passwords
      compareContent2: null, // Clear content when resetting passwords
    }),
}));
