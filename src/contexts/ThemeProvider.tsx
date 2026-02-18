"use client";

import { useEffect } from "react";
import { useThemeStore } from "@/src/hooks/store/useDarkTheme";

type Props = {
  initialDark: boolean;
};

export function ThemeProvider({ initialDark }: Props) {
  const setDark = useThemeStore((s) => s.setDark);
  const isDark = useThemeStore((s) => s.isDark);

  useEffect(() => {
    setDark(initialDark);
  }, [initialDark, setDark]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  return null;
}
