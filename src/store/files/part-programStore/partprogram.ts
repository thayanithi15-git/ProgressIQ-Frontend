// store/partPrograms/partPrograms.ts
import { create } from 'zustand';

export interface ToolRequired {
  toolNumber: string;
  toolDescription: string;
  toolOffset: string;
}

export interface MaterialInfo {
  materialType: string;
  materialGrade: string;
  dimensions: string;
}

export interface MachiningParameters {
  spindleSpeed: number | '';
  feedRate: number | '';
  depthOfCut: number | '';
}

export interface PartProgramFormData {
  programName: string;
  programNumber: string;
  description: string;
  partNumber: string;
  workOrder: string;
  status: 'active' | 'inactive' | 'testing';
  estimatedCycleTime: number | '';
  toolsRequired: ToolRequired[];
  materialInfo: MaterialInfo;
  machiningParameters: MachiningParameters;
  tags: string[];
}

export interface PartProgramErrors {
  programName?: string;
  programNumber?: string;
  description?: string;
  partNumber?: string;
  workOrder?: string;
  estimatedCycleTime?: string;
  toolsRequired?: string;
  materialInfo?: {
    materialType?: string;
    materialGrade?: string;
    dimensions?: string;
  };
  machiningParameters?: {
    spindleSpeed?: string;
    feedRate?: string;
    depthOfCut?: string;
  };
  general?: string;
}

interface PartProgramState {
  // Modal state
  isOpenPartPrograms: boolean;
  isSubmitting: boolean;
  
  // Form data
  formData: PartProgramFormData;
  errors: PartProgramErrors;
  
  // Suggested tags
  suggestedTags: string[];
  
  // Actions
  openPartProgramsModal: () => void;
  closeModal: () => void;
  setFormData: (data: Partial<PartProgramFormData>) => void;
  setErrors: (errors: Partial<PartProgramErrors>) => void;
  resetForm: () => void;
  
  // Tool management
  addTool: () => void;
  removeTool: (index: number) => void;
  updateTool: (index: number, tool: Partial<ToolRequired>) => void;
  
  // Tag management
  addTag: (tag: string) => void;
  removeTag: (tag: string) => void;
  
  // Form validation and submission
  validateForm: () => boolean;
  submitPartProgram: (machineryId: string) => Promise<boolean>;
}

const initialFormData: PartProgramFormData = {
  programName: '',
  programNumber: '',
  description: '',
  partNumber: '',
  workOrder: '',
  status: 'active',
  estimatedCycleTime: '',
  toolsRequired: [
    {
      toolNumber: '',
      toolDescription: '',
      toolOffset: ''
    }
  ],
  materialInfo: {
    materialType: '',
    materialGrade: '',
    dimensions: ''
  },
  machiningParameters: {
    spindleSpeed: '',
    feedRate: '',
    depthOfCut: ''
  },
  tags: []
};

const suggestedTags = [
  'production', 'testing', 'prototype', 'maintenance',
  'shaft', 'gear', 'housing', 'bracket',
  'turning', 'milling', 'drilling', 'boring',
  'steel', 'aluminum', 'brass', 'plastic',
  'high-precision', 'batch', 'single-part', 'critical'
];

export const usePartProgramStore = create<PartProgramState>((set, get) => ({
  // Initial state
  isOpenPartPrograms: false,
  isSubmitting: false,
  formData: initialFormData,
  errors: {},
  suggestedTags,

  // Modal actions
  openPartProgramsModal: () => {
    set({ isOpenPartPrograms: true, errors: {} });
  },

  closeModal: () => {
    set({ isOpenPartPrograms: false });
    // Reset form after a delay to allow modal animation
    setTimeout(() => {
      get().resetForm();
    }, 300);
  },

  // Form data management
  setFormData: (data) => {
    set((state) => ({
      formData: { ...state.formData, ...data },
      errors: {} // Clear errors when form data changes
    }));
  },

  setErrors: (errors) => {
    set((state) => ({
      errors: { ...state.errors, ...errors }
    }));
  },

  resetForm: () => {
    set({
      formData: { ...initialFormData },
      errors: {},
      isSubmitting: false
    });
  },

  // Tool management
  addTool: () => {
    set((state) => ({
      formData: {
        ...state.formData,
        toolsRequired: [
          ...state.formData.toolsRequired,
          { toolNumber: '', toolDescription: '', toolOffset: '' }
        ]
      }
    }));
  },

  removeTool: (index) => {
    set((state) => ({
      formData: {
        ...state.formData,
        toolsRequired: state.formData.toolsRequired.filter((_, i) => i !== index)
      }
    }));
  },

  updateTool: (index, toolUpdate) => {
    set((state) => ({
      formData: {
        ...state.formData,
        toolsRequired: state.formData.toolsRequired.map((tool, i) =>
          i === index ? { ...tool, ...toolUpdate } : tool
        )
      }
    }));
  },

  // Tag management
  addTag: (tag) => {
    const trimmedTag = tag.trim().toLowerCase();
    if (!trimmedTag) return;
    
    set((state) => {
      if (state.formData.tags.includes(trimmedTag)) {
        return state;
      }
      return {
        formData: {
          ...state.formData,
          tags: [...state.formData.tags, trimmedTag]
        }
      };
    });
  },

  removeTag: (tagToRemove) => {
    set((state) => ({
      formData: {
        ...state.formData,
        tags: state.formData.tags.filter(tag => tag !== tagToRemove)
      }
    }));
  },

  // Form validation
  validateForm: () => {
    const { formData } = get();
    const newErrors: PartProgramErrors = {};

    // Required fields validation
    if (!formData.programName.trim()) {
      newErrors.programName = 'Program name is required';
    }

    if (!formData.programNumber.trim()) {
      newErrors.programNumber = 'Program number is required';
    }

    // Validate tools if any are partially filled
    const hasIncompleteTool = formData.toolsRequired.some(tool => 
      (tool.toolNumber || tool.toolDescription || tool.toolOffset) &&
      (!tool.toolNumber || !tool.toolDescription || !tool.toolOffset)
    );

    if (hasIncompleteTool) {
      newErrors.toolsRequired = 'All tool fields must be completed or left empty';
    }

    // Validate numeric fields if provided
    if (formData.estimatedCycleTime !== '' && (isNaN(Number(formData.estimatedCycleTime)) || Number(formData.estimatedCycleTime) <= 0)) {
      newErrors.estimatedCycleTime = 'Must be a positive number';
    }

    if (formData.machiningParameters.spindleSpeed !== '' && (isNaN(Number(formData.machiningParameters.spindleSpeed)) || Number(formData.machiningParameters.spindleSpeed) <= 0)) {
      newErrors.machiningParameters = { 
        ...newErrors.machiningParameters, 
        spindleSpeed: 'Must be a positive number' 
      };
    }

    if (formData.machiningParameters.feedRate !== '' && (isNaN(Number(formData.machiningParameters.feedRate)) || Number(formData.machiningParameters.feedRate) <= 0)) {
      newErrors.machiningParameters = { 
        ...newErrors.machiningParameters, 
        feedRate: 'Must be a positive number' 
      };
    }

    if (formData.machiningParameters.depthOfCut !== '' && (isNaN(Number(formData.machiningParameters.depthOfCut)) || Number(formData.machiningParameters.depthOfCut) <= 0)) {
      newErrors.machiningParameters = { 
        ...newErrors.machiningParameters, 
        depthOfCut: 'Must be a positive number' 
      };
    }

    set({ errors: newErrors });
    return Object.keys(newErrors).length === 0;
  },

  // API submission
  submitPartProgram: async (machineryId: string) => {
    const { formData, validateForm } = get();

    if (!validateForm()) {
      return false;
    }

    set({ isSubmitting: true });

    try {
      const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || '';
      const token = localStorage.getItem("token");

      // Prepare the request body
      const requestBody = {
        programName: formData.programName,
        programNumber: formData.programNumber,
        description: formData.description || undefined,
        partNumber: formData.partNumber || undefined,
        workOrder: formData.workOrder || undefined,
        status: formData.status,
        estimatedCycleTime: formData.estimatedCycleTime || undefined,
        toolsRequired: formData.toolsRequired.filter(tool => 
          tool.toolNumber && tool.toolDescription && tool.toolOffset
        ),
        materialInfo: Object.values(formData.materialInfo).some(val => val) ? formData.materialInfo : undefined,
        machiningParameters: Object.values(formData.machiningParameters).some(val => val !== '') ? {
          spindleSpeed: formData.machiningParameters.spindleSpeed || undefined,
          feedRate: formData.machiningParameters.feedRate || undefined,
          depthOfCut: formData.machiningParameters.depthOfCut || undefined
        } : undefined,
        tags: formData.tags.length > 0 ? formData.tags : undefined
      };

      // Remove undefined values
      Object.keys(requestBody).forEach(key => {
        if (requestBody[key as keyof typeof requestBody] === undefined) {
          delete requestBody[key as keyof typeof requestBody];
        }
      });

      const response = await fetch(`${BASE_URL}machinery/${machineryId}/part-programs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { "x-auth-token": token }),
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to create part program: ${response.statusText}`);
      }

      const result = await response.json();

      if (result) {
        // Success notification would be handled by the component
        get().closeModal();
        return true;
      } else {
        throw new Error(result.message || 'Failed to create part program');
      }

    } catch (error) {
      console.error('Part program submission error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create part program. Please try again.';
      
      set({
        errors: {
          general: errorMessage
        }
      });
      return false;
    } finally {
      set({ isSubmitting: false });

    }
  }
}));