import { create } from "zustand";

type ThemeState = {
  isDark: boolean;
  toggleTheme: () => void;
  setDark: (value: boolean) => void;
};

export const useThemeStore = create<ThemeState>()(
  (set) => ({
    isDark: false,
    toggleTheme: () => set((state) => ({ isDark: !state.isDark })),
    setDark: (value) => set({ isDark: value }),
  }),
);
