"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "light",
  setTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

export default function ThemeProvider({
  children,
  defaultTheme = "light",
  storageKey = "dashboard-theme",
}: {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem(storageKey);
    if (stored === "dark" || stored === "light") {
      setThemeState(stored);
    }
  }, [storageKey]);

  const setTheme = (next: Theme) => {
    setThemeState(next);
    localStorage.setItem(storageKey, next);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <div
        data-theme={theme}
        className={theme === "dark" ? "dark" : ""}
        style={{ transition: "background-color 0.3s ease, color 0.3s ease" }}
      >
        {mounted ? children : null}
      </div>
    </ThemeContext.Provider>
  );
}
