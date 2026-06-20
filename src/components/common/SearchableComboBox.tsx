"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Search, ChevronDown, Check, PlayCircle, Code2, FileText, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useKeyPress } from "@/hooks/useKeyPress";

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
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Set portal target on mount (client-side only)
  useEffect(() => {
    setPortalTarget(document.body);
  }, []);

  // Listen for Escape key to close the modal
  useKeyPress("Escape", () => {
    if (isOpen) {
      setIsOpen(false);
    }
  });

  // When modal opens, reset search term and focus input
  useEffect(() => {
    if (isOpen) {
      setSearchTerm("");
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  // Find the selected option to display its title
  const selectedOption = options.find((opt) => opt.id === value);
  const displayLabel = selectedOption ? selectedOption.title : value || "";

  // Get matching icon based on asset type
  const getTypeIcon = (itemType: typeof type) => {
    switch (itemType) {
      case "video":
        return <PlayCircle size={14} className="text-brand-500 shrink-0" />;
      case "problem":
        return <Code2 size={14} className="text-purple-500 shrink-0" />;
      case "article":
        return <FileText size={14} className="text-orange-500 shrink-0" />;
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

  // Modal content rendered via portal
  const modalContent = (
    <AnimatePresence>
      {isOpen && portalTarget && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-gray-900/40 dark:bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative w-full max-w-lg bg-white dark:bg-gray-950 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col max-h-[80vh]"
          >
            {/* Header / Search Input */}
            <div className="flex items-center gap-3 p-4 border-b border-gray-100 dark:border-gray-850 bg-gray-50/50 dark:bg-gray-900/30">
              <Search size={18} className="text-gray-400 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                placeholder={`Search ${type}s by name or ID...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 bg-transparent text-sm font-bold text-gray-900 dark:text-gray-100 focus:outline-none placeholder-gray-400"
              />
              {searchTerm ? (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors bg-gray-200 dark:bg-gray-800 rounded-md"
                >
                  <X size={14} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1 text-gray-400 hover:text-red-500 transition-colors bg-gray-100 dark:bg-gray-800 rounded-md"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Options List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
              {filteredOptions.length > 0 ? (
                <div className="space-y-1">
                  {filteredOptions.map((opt) => {
                    const isSelected = opt.id === value;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          onChange(opt.id);
                          setIsOpen(false);
                        }}
                        className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all ${
                          isSelected
                            ? "bg-brand-500 text-white shadow-sm"
                            : "hover:bg-gray-100 dark:hover:bg-gray-900"
                        }`}
                      >
                        <div className="flex items-center gap-3 overflow-hidden pr-4">
                          <div className={`p-2 rounded-lg ${isSelected ? "bg-white/20" : "bg-gray-100 dark:bg-gray-800"}`}>
                            {getTypeIcon(type)}
                          </div>
                          <div className="min-w-0">
                            <span className={`block font-bold truncate text-sm ${isSelected ? "text-white" : "text-gray-900 dark:text-gray-100"}`}>
                              {opt.title}
                            </span>
                            {opt.extra && (
                              <span
                                className={`block text-[11px] font-mono mt-0.5 truncate ${
                                  isSelected ? "text-white/80" : "text-gray-500"
                                }`}
                              >
                                {opt.extra}
                              </span>
                            )}
                          </div>
                        </div>
                        {isSelected && <Check size={18} className="shrink-0 ml-2 text-white" />}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="py-12 text-center flex flex-col items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center mb-3">
                    <Search size={20} className="text-gray-400" />
                  </div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">No results found</p>
                  <p className="text-xs font-semibold text-gray-500 mt-1 max-w-[200px]">
                    We couldn't find any {type} matching your search.
                  </p>
                </div>
              )}
            </div>
            
            {/* Footer */}
            <div className="p-3 border-t border-gray-100 dark:border-gray-850 bg-gray-50 dark:bg-gray-900/50 text-center">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                {filteredOptions.length} assets available
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <div className="relative w-full select-none text-left">
        {/* Toggle Button */}
        <div
          onClick={(e) => {
            e.preventDefault();
            setIsOpen(true);
          }}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg border-2 border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-700 transition-colors shadow-sm cursor-pointer"
        >
          <div className="flex items-center gap-2 truncate pr-2">
            {getTypeIcon(type)}
            <span className="text-xs font-bold text-gray-800 dark:text-gray-200 truncate">
              {displayLabel || placeholder}
            </span>
          </div>
          <Search
            size={14}
            className="text-gray-400 transition-colors duration-200 shrink-0 group-hover:text-gray-600 dark:group-hover:text-gray-200"
          />
        </div>
      </div>

      {/* Portal the modal to document.body */}
      {portalTarget && createPortal(modalContent, portalTarget)}
    </>
  );
};

export default SearchableComboBox;
