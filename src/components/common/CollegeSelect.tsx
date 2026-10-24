"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { Building2, Search, ChevronDown, Check, X, Plus } from "lucide-react";
import { POPULAR_COLLEGES } from "@/config/profile-constants";

interface CollegeSelectProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
}

export function CollegeSelect({
  value,
  onChange,
  disabled = false,
  className = "",
  placeholder = "Select your College / University",
}: CollegeSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCustomCollege, setIsCustomCollege] = useState(false);
  const [customCollege, setCustomCollege] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Sync state when external value changes
  useEffect(() => {
    if (value) {
      if (POPULAR_COLLEGES.includes(value) && value !== "Other") {
        setIsCustomCollege(false);
        setCustomCollege("");
      } else {
        setIsCustomCollege(true);
        setCustomCollege(value === "Other" ? "" : value);
      }
    } else {
      setIsCustomCollege(false);
      setCustomCollege("");
    }
  }, [value]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Auto-focus search input when opening
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Token-based smart matching so "iit delhi", "nit trichy", "bits pilani" match perfectly
  const filteredColleges = useMemo(() => {
    const trimmed = searchQuery.trim().toLowerCase();
    if (!trimmed) return POPULAR_COLLEGES;

    // Split search into words (e.g. ["iit", "delhi"])
    const words = trimmed.split(/\s+/).filter(Boolean);

    return POPULAR_COLLEGES.filter((col) => {
      if (col === "Other") return true; // Always keep 'Other' available
      // Strip brackets and punctuation from college name for clean token comparison
      const cleanCol = col.toLowerCase().replace(/[(),.-]/g, " ");
      return words.every((w) => cleanCol.includes(w));
    });
  }, [searchQuery]);

  const handleSelect = (collegeName: string) => {
    if (collegeName === "Other") {
      setIsCustomCollege(true);
      setCustomCollege(searchQuery.trim() || "");
      onChange(searchQuery.trim() || "");
    } else {
      setIsCustomCollege(false);
      setCustomCollege("");
      onChange(collegeName);
    }
    setIsOpen(false);
    setSearchQuery("");
  };

  const handleUseCustomDirectly = () => {
    if (!searchQuery.trim()) return;
    setIsCustomCollege(true);
    setCustomCollege(searchQuery.trim());
    onChange(searchQuery.trim());
    setIsOpen(false);
    setSearchQuery("");
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    setCustomCollege(newVal);
    onChange(newVal);
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full space-y-2 ${isOpen ? "z-50" : "z-20"} ${className}`}
    >
      {/* Dropdown Selector Button */}
      <div
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all cursor-pointer select-none ${
          disabled
            ? "cursor-not-allowed opacity-60 bg-gray-100 dark:bg-gray-800"
            : "bg-white dark:bg-gray-900 border-gray-200 dark:border-white/10 hover:border-blue-500/50"
        } ${isOpen ? "ring-4 ring-blue-500/10 border-blue-500" : ""}`}
      >
        <div className="flex items-center gap-2.5 min-w-0 pr-2">
          <Building2 size={16} className="text-gray-400 shrink-0" />
          <span
            className={`truncate text-sm ${
              isCustomCollege
                ? "text-gray-900 dark:text-white"
                : value
                ? "text-gray-900 dark:text-white"
                : "text-gray-400 dark:text-gray-500"
            }`}
          >
            {isCustomCollege
              ? customCollege
                ? `Other: ${customCollege}`
                : "Other (Custom College)"
              : value || placeholder}
          </span>
        </div>
        <ChevronDown
          size={16}
          className={`text-gray-400 shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-blue-500" : ""
          }`}
        />
      </div>

      {/* Dropdown Menu Popup */}
      {isOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute top-full left-0 z-50 w-full mt-1.5 bg-white dark:bg-[#0c1424] border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-72 animate-in fade-in zoom-in-95 duration-150"
        >
          {/* Search Input Box */}
          <div className="p-2.5 border-b border-gray-100 dark:border-white/10 sticky top-0 bg-white/95 dark:bg-[#0c1424]/95 backdrop-blur-sm z-10">
            <div className="relative flex items-center">
              <Search size={14} className="absolute left-3 text-gray-400 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search college name (e.g. IIT Delhi, BITS, NIT)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    if (filteredColleges.length > 0) {
                      handleSelect(filteredColleges[0]);
                    } else if (searchQuery.trim()) {
                      handleUseCustomDirectly();
                    }
                  }
                }}
                className="w-full pl-8 pr-7 py-2 rounded-xl bg-gray-50 dark:bg-white/[0.04] border border-gray-200 dark:border-white/10 text-xs font-semibold text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-blue-500"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          </div>

          {/* Quick "Use Custom College" action if user typed something not directly in list */}
          {searchQuery.trim() && (
            <div className="px-2 pt-1 pb-1 border-b border-gray-100 dark:border-white/5 bg-blue-50/50 dark:bg-blue-500/5">
              <button
                type="button"
                onClick={handleUseCustomDirectly}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-500/10 rounded-lg text-left transition-colors cursor-pointer"
              >
                <Plus size={14} className="shrink-0" />
                <span className="truncate">
                  Use custom college: <span className="underline">"{searchQuery.trim()}"</span>
                </span>
              </button>
            </div>
          )}

          {/* College Options List */}
          <div className="overflow-y-auto flex-1 p-1.5 space-y-0.5 no-scrollbar">
            {filteredColleges.length > 0 ? (
              filteredColleges.slice(0, 100).map((col) => {
                const isSelected = isCustomCollege ? col === "Other" : value === col;
                return (
                  <button
                    key={col}
                    type="button"
                    onClick={() => handleSelect(col)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg text-left transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold"
                        : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5"
                    }`}
                  >
                    <span className="truncate pr-2">{col}</span>
                    {isSelected && <Check size={14} className="text-blue-500 shrink-0" />}
                  </button>
                );
              })
            ) : (
              <div className="p-4 text-center text-xs text-gray-400 space-y-2">
                <p>No college found matching "{searchQuery}"</p>
                <button
                  type="button"
                  onClick={handleUseCustomDirectly}
                  className="px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold hover:bg-blue-100 dark:hover:bg-blue-500/20"
                >
                  Use "{searchQuery}" as my college
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Custom College Write-in Input (Shown when 'Other' is chosen) */}
      {isCustomCollege && (
        <div className="pt-1">
          <input
            type="text"
            required
            placeholder="Type your full College / University name..."
            value={customCollege}
            onChange={handleCustomChange}
            className="w-full px-4 py-2.5 rounded-xl border border-blue-400 dark:border-blue-500/60 bg-blue-50/30 dark:bg-blue-500/5 text-sm font-semibold text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
          />
        </div>
      )}
    </div>
  );
}
