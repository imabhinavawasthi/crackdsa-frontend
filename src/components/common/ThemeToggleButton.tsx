"use client";

import React from "react";
import { useTheme } from "../../context/ThemeContext";
import { Sun, Moon } from "lucide-react";

export const ThemeToggleButton: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="relative flex items-center w-14 h-7 rounded-full bg-gray-200 dark:bg-gray-700 transition-colors duration-300 p-0.5"
    >
      {/* Sliding knob */}
      <span
        className={`flex items-center justify-center w-6 h-6 rounded-full bg-white dark:bg-gray-900 shadow-sm transition-transform duration-300 ${
          isDark ? "translate-x-7" : "translate-x-0"
        }`}
      >
        {isDark ? (
          <Moon size={13} className="text-brand-400" />
        ) : (
          <Sun size={13} className="text-warning-500" />
        )}
      </span>
    </button>
  );
};
