'use client';
import { useEffect } from 'react';
import { useThemeStore } from '@/store/layoutStore';
export function ThemeInitializer() {
  useEffect(() => {
    const initializeTheme = useThemeStore.getState().initializeTheme;
    initializeTheme();
  }, []);
  return null;
}
