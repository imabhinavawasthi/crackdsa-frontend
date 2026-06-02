"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { Search, ChevronDown, Check, PlayCircle, Code2, FileText, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface SearchableOption {
  id: string;
  title: string;
  extra?: string;
}

interface SearchableComboBoxProps {
  value: string;
  type: "video" | "problem" | "article";
  options: SearchableOption[];
  onChange: (val: string) => void;
  placeholder?: string;
}

const SearchableComboBox: React.FC<SearchableComboBoxProps> = ({
  value,
  type,
  options,
  onChange,
  placeholder = "Select an asset..."
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const triggerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
  const [dropdownPos, setDropdownPos] = useState<{ top: number; left: number; width: number }>({
    top: 0,
    left: 0,
    width: 0,
  });

  // Set portal target on mount (client-side only)
  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setPortalTarget(document.body);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  // Calculate dropdown position relative to the viewport
  const updatePosition = useCallback(() => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + window.scrollY + 6,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  }, []);

  // Update position when opening or on scroll/resize
  useEffect(() => {
    if (!isOpen) return;
    updatePosition();
    const handleScrollOrResize = () => updatePosition();
    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);
    return () => {
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [isOpen, updatePosition]);

  // Close dropdown on click outside
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        triggerRef.current &&
        !triggerRef.current.contains(target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Listen for Escape key to close the combobox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // When dropdown opens, reset search term
  useEffect(() => {
    if (isOpen) {
      const timeoutId = window.setTimeout(() => {
      setSearchTerm("");
    }, 0);

    return () => window.clearTimeout(timeoutId);
    }
  }, [isOpen]);

  // Find the selected option to display its title
  const selectedOption = options.find((opt) => opt.id === value);
  const displayLabel = selectedOption ? selectedOption.title : value || "";

  // Get matching icon based on asset type
  const getTypeIcon = (itemType: typeof type) => {
    switch (itemType) {
      case "video":
        return <PlayCircle size={13} className="text-brand-500 shrink-0" />;
      case "problem":
        return <Code2 size={13} className="text-purple-500 shrink-0" />;
      case "article":
        return <FileText size={13} className="text-orange-500 shrink-0" />;
      default:
        return null;
    }
  };

  // Filter options based on search query
  const filteredOptions = options.filter((opt) => {
    const query = searchTerm.toLowerCase();
    const titleMatch = opt.title.toLowerCase().includes(query);
    const idMatch = opt.id.toLowerCase().includes(query);
    const extraMatch = opt.extra ? opt.extra.toLowerCase().includes(query) : false;
    return titleMatch || idMatch || extraMatch;
  });

  // Dropdown content rendered via portal
  const dropdownContent = (
    <AnimatePresence>
      {isOpen && portalTarget && (
        <motion.div
          ref={dropdownRef}
          initial={{ opacity: 0, y: 4, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 2, scale: 0.98 }}
          transition={{ duration: 0.12, ease: "easeOut" }}
          style={{
            position: "absolute",
            top: dropdownPos.top,
            left: dropdownPos.left,
            width: dropdownPos.width,
            zIndex: 9999,
          }}
          className="rounded-xl bg-white/95 dark:bg-gray-950/95 backdrop-blur-md border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden max-h-62.5 flex flex-col"
        >
          {/* Search Input Box */}
          <div className="flex items-center gap-2 px-2.5 py-2 border-b border-gray-100 dark:border-gray-850 bg-gray-50/50 dark:bg-gray-900/30">
            <Search size={12} className="text-gray-400 shrink-0" />
            <input
              type="text"
              autoFocus
              placeholder={`Search ${type}s...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent text-[10px] font-bold text-gray-800 dark:text-gray-200 focus:outline-none placeholder-gray-400"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                <X size={11} />
              </button>
            )}
          </div>

          {/* Options Scrollpane */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-1 max-h-47.5">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => {
                const isSelected = opt.id === value;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      onChange(opt.id);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-2.5 rounded-lg text-left text-[10px] font-bold transition-all ${
                      isSelected
                        ? "bg-brand-500 text-white shadow-sm"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-850"
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate pr-2">
                      {getTypeIcon(type)}
                      <div className="truncate">
                        <span className="block truncate">{opt.title}</span>
                        {opt.extra && (
                          <span
                            className={`block text-[8px] font-mono mt-0.5 ${
                              isSelected ? "text-white/70" : "text-gray-400"
                            }`}
                          >
                            {opt.extra}
                          </span>
                        )}
                      </div>
                    </div>
                    {isSelected && <Check size={11} className="shrink-0 ml-2" />}
                  </button>
                );
              })
            ) : (
              <div className="py-6 text-center text-[10px] font-semibold text-gray-400 italic">
                No matching {type}s found.
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <div ref={triggerRef} className="relative w-full select-none text-left">
        {/* Combobox Toggle Input Button */}
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-700 transition-colors shadow-sm cursor-pointer"
        >
          <div className="flex items-center gap-2 truncate pr-2">
            {getTypeIcon(type)}
            <span className="text-[10px] font-bold text-gray-800 dark:text-gray-200 truncate">
              {displayLabel || placeholder}
            </span>
          </div>
          <ChevronDown
            size={12}
            className={`text-gray-400 transition-transform duration-200 shrink-0 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </div>

      {/* Portal the dropdown to document.body so it escapes all overflow:hidden parents */}
      {portalTarget && createPortal(dropdownContent, portalTarget)}
    </>
  );
};

export default SearchableComboBox;
