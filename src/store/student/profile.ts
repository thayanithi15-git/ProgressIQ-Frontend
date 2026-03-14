import { create } from 'zustand';
import api from '@/utils/api';
import { useNotificationStore } from '@/utils/notification';
import { setStoredMentorProfile } from '@/utils/mentorSession';

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
  familyIncome: string;
}

export interface AcademicInfo {
  department: string;
  year: string;
  academicYear: string;
  rollNo: string;
  cgpa: number;
  arrearCount: number;
  goodAt: string[];
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

export interface SocialLinks {
  github?: string;
  linkedin?: string;
  leetcode?: string;
  portfolio?: string;
  codechef?: string;
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
  familyIncome?: string;
  rollNo?: string;
  cgpa?: number;
  arrearCount?: number;
  goodAt?: string[];
}

// ==========================================
// STORE
// ==========================================

interface ProfileState {
  profile: CompleteProfile | null;
  socials: SocialLinks | null;
  isLoading: boolean;
  isUpdating: boolean;
  isEditMode: boolean;
  isSocialsEditMode: boolean;
  editForm: UpdateProfilePayload;
  socialsForm: SocialLinks;

  // Actions
  fetchProfile: () => Promise<void>;
  updateProfile: (payload: UpdateProfilePayload) => Promise<boolean>;
  updateSocials: (payload: SocialLinks) => Promise<boolean>;

  // UI
  setEditMode: (v: boolean) => void;
  setSocialsEditMode: (v: boolean) => void;
  setEditField: (key: keyof UpdateProfilePayload, value: string) => void;
  setSocialsField: (key: keyof SocialLinks, value: string) => void;
  initEditForm: () => void;
  initSocialsForm: () => void;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  profile: null,
  socials: null,
  isLoading: false,
  isUpdating: false,
  isEditMode: false,
  isSocialsEditMode: false,
  editForm: {},
  socialsForm: {},

  // ─── FETCH PROFILE ────────────────────────────────────────
  fetchProfile: async () => {
    const { showNotification } = useNotificationStore.getState();
    try {
      set({ isLoading: true });
      const [profRes, socRes] = await Promise.all([
        api.get('/api/student/profile/complete'),
        api.get('/api/student/profile/socials')
      ]);
      if (profRes.data.success) {
        set({ profile: profRes.data.data, socials: socRes.data?.data || null });
        setStoredMentorProfile(profRes.data.data?.mentorInfo || null);
      }
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

  // ─── UPDATE SOCIALS ───────────────────────────────────────
  updateSocials: async (payload) => {
    const { showNotification } = useNotificationStore.getState();
    try {
      set({ isUpdating: true });
      const res = await api.post('/api/student/profile/socials', payload);
      if (res.data.success) {
        showNotification('Social links updated successfully', 'success');
        set({ socials: res.data.data, isSocialsEditMode: false });
        return true;
      }
      return false;
    } catch (error: any) {
      showNotification(error.response?.data?.message || 'Failed to update social links', 'error');
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

  setSocialsEditMode: (v) => {
    if (v) get().initSocialsForm();
    set({ isSocialsEditMode: v });
  },

  setEditField: (key, value) => set(state => ({
    editForm: { ...state.editForm, [key]: value },
  })),

  setSocialsField: (key, value) => set(state => ({
    socialsForm: { ...state.socialsForm, [key]: value },
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
        familyIncome: profile.familyInfo.familyIncome ?? '',
        rollNo:      profile.academicInfo.rollNo ?? '',
        cgpa:        profile.academicInfo.cgpa ?? 0,
        arrearCount: profile.academicInfo.arrearCount ?? 0,
        goodAt:      profile.academicInfo.goodAt ?? [],
      },
    });
  },

  initSocialsForm: () => {
    const { socials } = get();
    set({
      socialsForm: {
        github:    socials?.github ?? '',
        linkedin:  socials?.linkedin ?? '',
        leetcode:  socials?.leetcode ?? '',
        portfolio: socials?.portfolio ?? '',
        codechef:  socials?.codechef ?? '',
      },
    });
  },
}));
