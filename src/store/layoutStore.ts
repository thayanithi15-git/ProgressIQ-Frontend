import { create } from 'zustand';

// Sidebar store interface
interface SidebarStore {
  isOpen: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
  openSidebar: () => void;
}

// Theme store interface
interface ThemeStore {
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (isDark: boolean) => void;
}

// Sidebar store
export const useSidebarStore = create<SidebarStore>((set) => ({
  isOpen: true,
  toggleSidebar: () => set((state) => ({ isOpen: !state.isOpen })),
  closeSidebar: () => set({ isOpen: false }),
  openSidebar: () => set({ isOpen: true }),
}));

// Theme store with SSR-safe document access
export const useThemeStore = create<ThemeStore>((set) => ({
  isDark: false, // light by default
  toggleTheme: () =>
    set((state) => {
      if (typeof window !== "undefined") {
        document.documentElement.classList.toggle("dark", !state.isDark);
      }
      return { isDark: !state.isDark };
    }),
  setTheme: (isDark: boolean) => {
    if (typeof window !== "undefined") {
      if (isDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
    set({ isDark });
  },
}));
