"use client";

import { useEffect } from "react";
import { useThemeStore } from "@/src/store/useDarkTheme";

export function ThemeProvider() {
  const isDark = useThemeStore((state) => state.isDark);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  return null;
}
