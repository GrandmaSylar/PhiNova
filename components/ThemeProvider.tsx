"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type Theme = "day" | "night";

interface ThemeContextValue {
  theme: Theme;
  toggle: () => void;
}

const ThemeCtx = createContext<ThemeContextValue>({
  theme: "day",
  toggle: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("day");

  useEffect(() => {
    const saved = localStorage.getItem("phinova-theme") as Theme | null;
    const initial: Theme =
      saved ?? (matchMedia("(prefers-color-scheme: dark)").matches ? "night" : "day");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(initial);
    document.documentElement.setAttribute("data-theme", initial);
  }, []);

  function toggle() {
    const next: Theme = theme === "day" ? "night" : "day";
    setTheme(next);
    localStorage.setItem("phinova-theme", next);
    document.documentElement.setAttribute("data-theme", next);
  }

  return <ThemeCtx.Provider value={{ theme, toggle }}>{children}</ThemeCtx.Provider>;
}

export const useTheme = () => useContext(ThemeCtx);
