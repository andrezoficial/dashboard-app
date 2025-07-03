import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

export default function ThemeToggle() {
  const { temaOscuro, toggleTema } = useContext(ThemeContext);

  return (
    <button
      onClick={toggleTema}
      className="px-3 py-1 rounded border bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 transition"
      aria-label="Toggle dark mode"
    >
      {temaOscuro ? "Modo Claro" : "Modo Oscuro"}
    </button>
  );
}
