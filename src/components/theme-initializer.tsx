'use client';

import { useEffect } from 'react';
import { useThemeStore } from '@/store/layoutStore';

export function ThemeInitializer() {
  useEffect(() => {
    // Initialize theme from localStorage on app load
    const initializeTheme = useThemeStore.getState().initializeTheme;
    initializeTheme();
  }, []);

  return null;
}
