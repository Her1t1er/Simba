import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Language = 'en' | 'fr' | 'rw';
export type Theme = 'light' | 'dark';

interface SettingsState {
  language: Language;
  theme: Theme;
  setLanguage: (lang: Language) => void;
  toggleTheme: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      language: 'en',
      theme: 'light',
      setLanguage: (lang) => set({ language: lang }),
      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
    }),
    {
      name: 'simba-settings',
    }
  )
);
