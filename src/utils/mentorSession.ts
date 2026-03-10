export type StoredMentorProfile = {
  id?: string;
  _id?: string;
  name?: string;
  email?: string;
  department?: string;
  designation?: string;
  contactNo?: string;
  place?: string;
};

export const getStoredMentorProfile = (): StoredMentorProfile | null => {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('mentorProfile');
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredMentorProfile;
  } catch {
    return null;
  }
};

export const getStoredMentorId = (): string | null => {
  const m = getStoredMentorProfile();
  return (m?.id || m?._id) ?? null;
};

export const setStoredMentorProfile = (mentor: StoredMentorProfile | null) => {
  if (typeof window === 'undefined') return;
  if (!mentor) {
    localStorage.removeItem('mentorProfile');
    return;
  }
  localStorage.setItem('mentorProfile', JSON.stringify(mentor));
};
