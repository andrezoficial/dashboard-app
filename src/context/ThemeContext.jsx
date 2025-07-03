import React from "react";
import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle() {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <button
      onClick={toggleDarkMode}
      className="p-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
      aria-label="Toggle Dark Mode"
    >
      {darkMode ? "🌙 Modo Oscuro" : "☀️ Modo Claro"}
    </button>
  );
}
