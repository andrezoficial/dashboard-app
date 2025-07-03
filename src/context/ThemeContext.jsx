import React, { createContext, useState, useEffect } from "react";

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [temaOscuro, setTemaOscuro] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("temaOscuro");
      if (saved !== null) return saved === "true";
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  useEffect(() => {
    if (temaOscuro) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("temaOscuro", temaOscuro.toString());
  }, [temaOscuro]);

  const toggleTema = () => setTemaOscuro((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ temaOscuro, toggleTema }}>
      {children}
    </ThemeContext.Provider>
  );
}
