// store/partPrograms/partProgramsList.ts
import { create } from 'zustand';
import api from '@/components/utils/api';

export interface PartProgram {
  _id: string;
  machinery: string;
  programName: string;
  programNumber: string;
  description: string;
  partNumber: string;
  workOrder: string;
  status: 'active' | 'inactive' | 'testing';
  activeFileVersion: string | null;
  totalFiles: number;
  lastModifiedBy: string;
  createdBy: string;
  tags: string[];
  estimatedCycleTime: number;
  toolsRequired: {
    toolNumber: string;
    toolDescription: string;
    toolOffset: string;
    _id: string;
    id: string;
  }[];
  materialInfo: {
    materialType: string;
    materialGrade: string;
    dimensions: string;
  };
  machiningParameters: {
    spindleSpeed: number;
    feedRate: number;
    depthOfCut: number;
  };
  createdAt: string;
  updatedAt: string;
  id: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

interface PartProgramsListState {
  partPrograms: PartProgram[];
  pagination: Pagination | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchPartPrograms: (machineryId: string) => Promise<void>;
  clearPartPrograms: () => void;
}

export const usePartProgramsListStore = create<PartProgramsListState>((set, get) => ({
  // Initial state
  partPrograms: [],
  pagination: null,
  loading: false,
  error: null,

  // Fetch part programs
  fetchPartPrograms: async (machineryId: string) => {
    try {
      set({ loading: true, error: null });
      
      const response = await api.get(`machinery/${machineryId}/part-programs`);
      
      if (response.data.success) {
        set({
          partPrograms: response.data.data,
          pagination: response.data.pagination,
          loading: false
        });
      } else {
        throw new Error('Failed to fetch part programs');
      }
    } catch (error) {
      console.error('Error fetching part programs:', error);
      set({
        error: 'Failed to load part programs. Please try again.',
        loading: false,
        partPrograms: [],
        pagination: null
      });
    }
  },

  // Clear part programs
  clearPartPrograms: () => {
    set({
      partPrograms: [],
      pagination: null,
      error: null
    });
  }
}));