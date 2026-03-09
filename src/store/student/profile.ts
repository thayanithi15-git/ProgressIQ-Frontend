import { create } from 'zustand';
import api from '@/utils/api';
import { useNotificationStore } from '@/utils/notification';

// ==========================================
// TYPES
// ==========================================

export interface PersonalInfo {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  dob: string;
  phone: string;
  place: string;
  status: string;
}

export interface FamilyInfo {
  parentName: string;
  parentPhone: string;
}

export interface AcademicInfo {
  department: string;
  year: string;
  academicYear: string;
}

export interface AchievementInfo {
  rewardPoints: number;
}

export interface MentorInfo {
  id: string;
  fullName: string;
  email: string;
  department: string;
  expertise: string[];
  phone: string | null;
  experience: string | null;
}

export interface AccountInfo {
  createdAt: string;
  lastUpdated: string;
}

export interface CompleteProfile {
  personalInfo: PersonalInfo;
  familyInfo: FamilyInfo;
  academicInfo: AcademicInfo;
  achievementInfo: AchievementInfo;
  mentorInfo: MentorInfo | null;
  accountInfo: AccountInfo;
}

export interface UpdateProfilePayload {
  gender?: string;
  dob?: string;
  phone?: string;
  parentName?: string;
  parentPhone?: string;
  place?: string;
}

// ==========================================
// STORE
// ==========================================

interface ProfileState {
  profile: CompleteProfile | null;
  isLoading: boolean;
  isUpdating: boolean;
  isEditMode: boolean;
  editForm: UpdateProfilePayload;

  // Actions
  fetchProfile: () => Promise<void>;
  updateProfile: (payload: UpdateProfilePayload) => Promise<boolean>;

  // UI
  setEditMode: (v: boolean) => void;
  setEditField: (key: keyof UpdateProfilePayload, value: string) => void;
  initEditForm: () => void;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  profile: null,
  isLoading: false,
  isUpdating: false,
  isEditMode: false,
  editForm: {},

  // ─── FETCH PROFILE ────────────────────────────────────────
  fetchProfile: async () => {
    const { showNotification } = useNotificationStore.getState();
    try {
      set({ isLoading: true });
      const res = await api.get('/api/student/profile/complete');
      if (res.data.success) set({ profile: res.data.data });
    } catch (error: any) {
      showNotification(error.response?.data?.message || 'Failed to fetch profile', 'error');
    } finally {
      set({ isLoading: false });
    }
  },

  // ─── UPDATE PROFILE ───────────────────────────────────────
  updateProfile: async (payload) => {
    const { showNotification } = useNotificationStore.getState();
    try {
      set({ isUpdating: true });
      const res = await api.put('/api/student/profile', payload);
      if (res.data.success) {
        showNotification('Profile updated successfully', 'success');
        await get().fetchProfile();
        set({ isEditMode: false });
        return true;
      }
      return false;
    } catch (error: any) {
      showNotification(error.response?.data?.message || 'Failed to update profile', 'error');
      return false;
    } finally {
      set({ isUpdating: false });
    }
  },

  // ─── UI ───────────────────────────────────────────────────
  setEditMode: (v) => {
    if (v) get().initEditForm();
    set({ isEditMode: v });
  },

  setEditField: (key, value) => set(state => ({
    editForm: { ...state.editForm, [key]: value },
  })),

  initEditForm: () => {
    const { profile } = get();
    if (!profile) return;
    set({
      editForm: {
        gender:      profile.personalInfo.gender ?? '',
        dob:         profile.personalInfo.dob ? profile.personalInfo.dob.split('T')[0] : '',
        phone:       profile.personalInfo.phone ?? '',
        place:       profile.personalInfo.place ?? '',
        parentName:  profile.familyInfo.parentName ?? '',
        parentPhone: profile.familyInfo.parentPhone ?? '',
      },
    });
  },
}));