"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  BookOpen, 
  ChevronLeft,
  GraduationCap,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { SidebarCategory } from "@/utils/mdxLoader";

interface DsaDocsSidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  syllabus: SidebarCategory[];
}

export default function DsaDocsSidebar({ isOpen, setIsOpen, syllabus }: DsaDocsSidebarProps) {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  // Parse category id from active path on mount to auto-expand active sections
  useEffect(() => {
    syllabus.forEach((cat) => {
      const hasActive = cat.items.some((item) => pathname.includes(`/dsa/${cat.id}/${item.slug}`));
      if (hasActive) {
        setExpandedCategories((prev) => ({ ...prev, [cat.id]: true }));
      }
    });
  }, [pathname, syllabus]);

  const toggleCategory = (catId: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [catId]: !prev[catId]
    }));
  };

  // Filter Categories and Items based on Search Query
  const filteredCategories = syllabus.map((cat) => {
    const matchedItems = cat.items.filter((item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    let matchedSections = cat.sections;
    if (cat.sections) {
      matchedSections = cat.sections.map((sec) => {
        const secMatchedItems = sec.items.filter((item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
        return {
          ...sec,
          items: secMatchedItems
        };
      }).filter((sec) => sec.items.length > 0);
    }

    return {
      ...cat,
      items: matchedItems,
      sections: matchedSections
    };
  }).filter((cat) => cat.items.length > 0 || (cat.sections && cat.sections.length > 0));

  // Automatically expand all categories when search query is populated
  useEffect(() => {
    if (searchQuery.trim() !== "") {
      const expanded: Record<string, boolean> = {};
      filteredCategories.forEach((cat) => {
        expanded[cat.id] = true;
      });
      setExpandedCategories(expanded);
    }
  }, [searchQuery]);

  const isItemActive = (catId: string, itemSlug: string) => {
    return pathname.endsWith(`/dsa/${catId}/${itemSlug}`);
  };

  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.aside
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 260, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.18, ease: "easeInOut" }}
          className="h-full border-r border-gray-150 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shrink-0 flex flex-col overflow-hidden z-20 select-none"
        >
          
          {/* Header & Dashboard Navigation */}
          <div className="px-4.5 pt-4 pb-3 flex flex-col gap-3 shrink-0">
            <div className="flex items-center justify-between">
              <Link 
                href="/learn"
                className="inline-flex items-center gap-1 text-[10px] font-bold text-gray-400 dark:text-gray-500 hover:text-brand-500 dark:hover:text-brand-400 uppercase tracking-widest transition-colors"
              >
                <ChevronLeft size={11} className="stroke-[3]" />
                <span>Dashboard</span>
              </Link>
              
              <button
                onClick={() => setIsOpen(false)}
                className="flex h-5 w-5 items-center justify-center rounded-md border border-gray-150 dark:border-gray-800/80 text-gray-400 hover:text-gray-700 hover:bg-gray-50 dark:text-gray-500 dark:hover:text-gray-350 dark:hover:bg-gray-855 transition-all cursor-pointer"
                title="Hide Sidebar"
              >
                <ChevronLeft size={12} className="stroke-[2.5]" />
              </button>
            </div>

            {/* Platform Branding Badges */}
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-md bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/10">
                <GraduationCap size={14} className="stroke-[2.5]" />
              </div>
              <span className="text-[11px] font-black text-gray-805 dark:text-white tracking-widest uppercase">
                DSA CURRICULUM
              </span>
            </div>

            {/* Premium Topics Search bar with ⌘K Badge */}
            <div className="relative flex items-center">
              <div className="absolute left-3 text-gray-400 dark:text-gray-500">
                <Search size={13} className="stroke-[2.5]" />
              </div>
              <input
                type="text"
                placeholder="Quick search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs font-semibold pl-9 pr-9 py-1.5 rounded-lg bg-gray-50 hover:bg-gray-100/60 dark:bg-gray-850 dark:hover:bg-gray-800 border border-gray-150 dark:border-gray-800 focus:border-brand-500/40 dark:focus:border-brand-400/40 focus:bg-white dark:focus:bg-gray-950 focus:ring-2 focus:ring-brand-500/10 dark:focus:ring-brand-400/10 outline-none text-gray-800 dark:text-gray-200 transition-all shadow-inner placeholder:text-gray-400 dark:placeholder:text-gray-600 placeholder:font-semibold"
              />
              <div className="absolute right-2.5 px-1.5 py-0.5 rounded text-[8.5px] font-extrabold bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 text-gray-400 dark:text-gray-600 select-none">
                ⌘K
              </div>
            </div>
          </div>

          {/* High-density syllabus navigation list */}
          <div className="flex-1 overflow-y-auto custom-scrollbar px-3 pb-4 space-y-4">
            
            {/* General Home Link */}
            <Link
              href="/learn/dsa"
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-[13px] font-bold transition-all border ${
                pathname === "/learn/dsa"
                  ? "bg-brand-500/10 border-brand-500/10 text-brand-600 dark:text-brand-400 shadow-sm"
                  : "bg-transparent border-transparent text-gray-600 hover:text-gray-850 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-50/50 dark:hover:bg-gray-855/50"
              }`}
            >
              <BookOpen size={13} className="shrink-0 stroke-[2.5]" />
              <span>Syllabus Overview</span>
            </Link>

            {filteredCategories.length > 0 ? (
              filteredCategories.map((cat) => {
                const isExpanded = !!expandedCategories[cat.id];

                return (
                  <div key={cat.id} className="space-y-1">
                    {/* Collapsible Category Header Trigger - Sleek typography */}
                    <button
                      onClick={() => toggleCategory(cat.id)}
                      className="w-full px-2 py-1.5 text-xs sm:text-[13px] font-bold tracking-tight text-gray-800 hover:text-brand-500 dark:text-gray-200 dark:hover:text-brand-400 select-none flex items-center justify-between transition-colors text-left cursor-pointer"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>{cat.title}</span>
                        <span className="text-[9px] font-bold text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-850 px-1.5 py-0.5 rounded-md border border-gray-150 dark:border-gray-805 leading-none">
                          {cat.items.length}
                        </span>
                      </div>
                      {isExpanded ? (
                        <ChevronUp size={12} className="text-gray-400 dark:text-gray-500 stroke-[3] shrink-0" />
                      ) : (
                        <ChevronDown size={12} className="text-gray-400 dark:text-gray-500 stroke-[3] shrink-0" />
                      )}
                    </button>

                    {/* Sub-articles links (Conditionally rendered on expand) */}
                    {isExpanded && (
                      <div className="pl-1.5 space-y-2">
                        {cat.sections ? (
                          cat.sections.map((section, secIdx) => (
                            <div key={secIdx} className="space-y-0.5">
                              {/* Section Title */}
                              <div className="px-3 py-0.5 text-[9px] font-bold uppercase tracking-wider text-gray-350 dark:text-gray-600 select-none">
                                {section.title}
                              </div>
                              {/* Section Items with light timeline guide */}
                              <div className="space-y-0 border-l border-gray-150 dark:border-gray-800 ml-3">
                                {section.items.map((item) => {
                                  const active = isItemActive(cat.id, item.slug);
                                  return (
                                    <Link
                                      key={item.slug}
                                      href={`/learn/dsa/${cat.id}/${item.slug}`}
                                      className={`block px-3 py-1 rounded-r text-xs sm:text-[12.5px] font-medium transition-all truncate border-l-2 ml-[-1.5px] leading-relaxed ${
                                        active
                                          ? "text-brand-600 dark:text-brand-400 font-bold bg-brand-500/[0.04] dark:bg-brand-400/[0.03] border-brand-500"
                                          : "text-gray-550 hover:text-gray-850 dark:text-gray-400 dark:hover:text-gray-200 border-transparent hover:border-gray-300 dark:hover:border-gray-700"
                                      }`}
                                    >
                                      {item.title}
                                    </Link>
                                  );
                                })}
                              </div>
                            </div>
                          ))
                        ) : (
                          // Fallback flat items
                          <div className="space-y-0 border-l border-gray-150 dark:border-gray-800 ml-3">
                            {cat.items.map((item) => {
                              const active = isItemActive(cat.id, item.slug);
                              return (
                                <Link
                                  key={item.slug}
                                  href={`/learn/dsa/${cat.id}/${item.slug}`}
                                  className={`block px-3 py-1 rounded-r text-xs sm:text-[12.5px] font-medium transition-all truncate border-l-2 ml-[-1.5px] leading-relaxed ${
                                    active
                                      ? "text-brand-600 dark:text-brand-400 font-bold bg-brand-500/[0.04] dark:bg-brand-400/[0.03] border-brand-500"
                                      : "text-gray-550 hover:text-gray-850 dark:text-gray-400 dark:hover:text-gray-200 border-transparent hover:border-gray-300 dark:hover:border-gray-700"
                                  }`}
                                >
                                  {item.title}
                                </Link>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 select-none">
                <p className="text-[10px] text-gray-400 dark:text-gray-650 font-bold">No topics matched</p>
                <p className="text-[8.5px] text-gray-300 dark:text-gray-700 font-medium mt-0.5">Try a different keyword</p>
              </div>
            )}
          </div>

        </motion.aside>
      )}
    </AnimatePresence>
  );
}


