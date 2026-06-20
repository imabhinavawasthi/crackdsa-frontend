"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  BookOpen, 
  ChevronLeft,
  GraduationCap,
  ChevronDown,
  Layers,
  FileText,
  Sparkles,
  X
} from "lucide-react";
import { SidebarCategory } from "@/utils/mdxLoader";
import { TopicIcon } from "@/components/common/TopicIcon";
import { useKeyPress } from "@/hooks/useKeyPress";

interface DsaDocsSidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  syllabus: SidebarCategory[];
}

// Animation variants
const accordionVariants = {
  collapsed: {
    height: 0,
    opacity: 0,
    transition: { height: { duration: 0.3, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }, opacity: { duration: 0.2 } },
  },
  expanded: {
    height: "auto",
    opacity: 1,
    transition: { height: { duration: 0.35, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }, opacity: { duration: 0.25, delay: 0.05 } },
  },
};

const sectionFadeVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
  exit: {
    opacity: 0,
    y: -6,
    transition: { duration: 0.2 },
  },
};

export default function DsaDocsSidebar({ isOpen, setIsOpen, syllabus }: DsaDocsSidebarProps) {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Parse category id from active path on mount to auto-expand active sections
  useEffect(() => {
    syllabus.forEach((cat) => {
      const hasActive = cat.items.some((item) => pathname.includes(`/dsa/${cat.id}/${item.slug}`));
      if (hasActive) {
        setExpandedCategories((prev) => ({ ...prev, [cat.id]: true }));
      }
    });
  }, [pathname, syllabus]);

  // Global search keyboard shortcut (⌘K / Ctrl+K)
  useKeyPress("k", (e) => {
    e.preventDefault();
    searchInputRef.current?.focus();
  }, { metaKey: true });

  const toggleCategory = (catId: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [catId]: !prev[catId]
    }));
  };

  // Filter Categories and Items based on Search Query
  const normalizedSearchQuery = searchQuery.trim().toLowerCase();
  const filteredCategories = syllabus.map((cat) => {
    const matchesCategory =
      normalizedSearchQuery === "" ||
      cat.title.toLowerCase().includes(normalizedSearchQuery) ||
      cat.description?.toLowerCase().includes(normalizedSearchQuery);
    const matchedItems =
      normalizedSearchQuery === "" || matchesCategory
        ? cat.items
        : cat.items.filter((item) =>
            item.title.toLowerCase().includes(normalizedSearchQuery)
          );

    let matchedSections = cat.sections;
    if (cat.sections) {
      matchedSections =
        normalizedSearchQuery === "" || matchesCategory
          ? cat.sections
          : cat.sections.map((sec) => {
              const secMatchedItems = sec.items.filter((item) =>
                item.title.toLowerCase().includes(normalizedSearchQuery)
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
  }).filter((cat) =>
    normalizedSearchQuery === "" ||
    cat.items.length > 0 ||
    (cat.sections && cat.sections.length > 0) ||
    cat.title.toLowerCase().includes(normalizedSearchQuery) ||
    cat.description?.toLowerCase().includes(normalizedSearchQuery)
  );

  const isItemActive = (catId: string, itemSlug: string) => {
    return pathname.endsWith(`/dsa/${catId}/${itemSlug}`);
  };

  // Calculate totals for the progress indicator
  const totalArticles = syllabus.reduce((acc, cat) => acc + cat.items.length, 0);
  const totalCategories = syllabus.length;

  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.aside
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 280, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="h-full border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shrink-0 flex flex-col overflow-hidden z-20 select-none"
        >
          
          {/* Header Section */}
          <div className="p-5 border-b border-gray-100 dark:border-gray-800 space-y-4 shrink-0">
            
            {/* Top Row: Back + Close */}
            <div className="flex items-center justify-between">
              <Link 
                href="/learn"
                className="inline-flex items-center gap-1.5 text-[10px] font-bold text-gray-400 dark:text-gray-500 hover:text-brand-500 dark:hover:text-brand-400 uppercase tracking-widest transition-colors group"
              >
                <ChevronLeft size={11} className="stroke-[3] group-hover:-translate-x-0.5 transition-transform" />
                <span>Dashboard</span>
              </Link>
              
              <motion.button
                onClick={() => setIsOpen(false)}
                className="flex h-6 w-6 items-center justify-center rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-500 dark:hover:text-gray-300 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                title="Hide Sidebar"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronLeft size={16} />
              </motion.button>
            </div>

            {/* Branding + Stats */}
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-indigo-600 text-white shadow-lg shadow-brand-500/20">
                <GraduationCap size={18} className="stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-gray-900 dark:text-white tracking-tight">
                  DSA Curriculum
                </h3>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider">
                  {totalCategories} modules · {totalArticles} articles
                </p>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={14} className="text-gray-400 group-focus-within:text-brand-500 transition-colors" />
              </div>
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-14 py-2.5 bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-medium text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500/50 dark:focus:border-brand-400/50 transition-all"
              />
              {searchQuery ? (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
                >
                  <X size={14} />
                </button>
              ) : (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-[9px] font-bold text-gray-400 dark:text-gray-500 bg-white dark:bg-gray-800 px-1.5 py-0.5 rounded border border-gray-200 dark:border-gray-700">⌘K</span>
                </div>
              )}
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
            
            {/* Syllabus Overview Link */}
            <Link
              href="/learn/dsa"
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                pathname === "/learn/dsa"
                  ? "bg-brand-500/10 dark:bg-brand-500/15 text-brand-600 dark:text-brand-400 shadow-sm border border-brand-500/15 dark:border-brand-500/20"
                  : "text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/50 border border-transparent"
              }`}
            >
              <BookOpen size={14} className="shrink-0 stroke-[2.5]" />
              <span>Syllabus Overview</span>
            </Link>

            {/* Category Sections */}
            <AnimatePresence mode="popLayout">
              {filteredCategories.length > 0 ? (
                filteredCategories.map((cat) => {
                  const isExpanded = normalizedSearchQuery !== "" || !!expandedCategories[cat.id];
                  const itemCount = cat.items.length;

                  return (
                    <motion.div
                      key={cat.id}
                      className="rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden"
                      variants={sectionFadeVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      layout
                    >
                      {/* Category Header */}
                      <button
                        onClick={() => toggleCategory(cat.id)}
                        className={`w-full flex items-center justify-between p-3.5 transition-all text-left cursor-pointer ${
                          isExpanded
                            ? "bg-gray-50 dark:bg-gray-800/40"
                            : "bg-white dark:bg-gray-900 hover:bg-gray-50/60 dark:hover:bg-gray-800/20"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className={`flex h-7 w-7 items-center justify-center rounded-lg shrink-0 ${
                            isExpanded 
                              ? "bg-brand-500/10 text-brand-500 dark:text-brand-400"
                              : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500"
                          }`}>
                            <TopicIcon topicName={cat.title} size={14} strokeWidth={2.5} />
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-gray-800 dark:text-gray-100 leading-tight truncate">
                              {cat.title}
                            </h4>
                            <p className="text-[9px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider mt-0.5">
                              {itemCount} {itemCount === 1 ? "article" : "articles"}
                            </p>
                          </div>
                        </div>
                        <motion.div
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                          className="shrink-0 ml-2"
                        >
                          <ChevronDown size={14} className="text-gray-400 dark:text-gray-500" />
                        </motion.div>
                      </button>

                      {/* Expanded Items */}
                      <AnimatePresence initial={false}>
                        {isExpanded && (
                          <motion.div
                            key={`cat-content-${cat.id}`}
                            variants={accordionVariants}
                            initial="collapsed"
                            animate="expanded"
                            exit="collapsed"
                            className="overflow-hidden"
                          >
                            <div className="border-t border-gray-100 dark:border-gray-800/60 bg-white dark:bg-gray-900/60">
                              {cat.sections && cat.sections.length > 0 ? (
                                cat.sections.map((section, secIdx) => (
                                  <div key={secIdx}>
                                    {/* Section Title */}
                                    <div className="px-4 pt-3 pb-1.5">
                                      <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 flex items-center gap-1.5">
                                        <Sparkles size={9} className="text-brand-500/60" />
                                        {section.title}
                                      </span>
                                    </div>
                                    {/* Section Items */}
                                    <div className="pb-1">
                                      {section.items.map((item) => {
                                        const active = isItemActive(cat.id, item.slug);
                                        return (
                                          <Link
                                            key={item.slug}
                                            href={`/learn/dsa/${cat.id}/${item.slug}`}
                                            className={`flex items-center gap-2.5 mx-2 px-3 py-2 rounded-lg text-xs transition-all ${
                                              active
                                                ? "bg-brand-500/10 dark:bg-brand-500/15 text-brand-600 dark:text-brand-400 font-bold border-l-2 border-brand-500 ml-2"
                                                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/40 font-medium"
                                            }`}
                                          >
                                            <FileText size={12} className={`shrink-0 ${active ? "text-brand-500" : "text-gray-300 dark:text-gray-600"}`} />
                                            <span className="truncate leading-tight">{item.title}</span>
                                          </Link>
                                        );
                                      })}
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <div className="py-1">
                                  {cat.items.map((item) => {
                                    const active = isItemActive(cat.id, item.slug);
                                    return (
                                      <Link
                                        key={item.slug}
                                        href={`/learn/dsa/${cat.id}/${item.slug}`}
                                        className={`flex items-center gap-2.5 mx-2 px-3 py-2 rounded-lg text-xs transition-all ${
                                          active
                                            ? "bg-brand-500/10 dark:bg-brand-500/15 text-brand-600 dark:text-brand-400 font-bold border-l-2 border-brand-500 ml-2"
                                            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/40 font-medium"
                                        }`}
                                      >
                                        <FileText size={12} className={`shrink-0 ${active ? "text-brand-500" : "text-gray-300 dark:text-gray-600"}`} />
                                        <span className="truncate leading-tight">{item.title}</span>
                                      </Link>
                                    );
                                  })}
                                </div>
                              )}
                              {cat.items.length === 0 && (!cat.sections || cat.sections.length === 0) && (
                                <p className="px-4 py-3 text-[10px] font-semibold text-gray-400 dark:text-gray-600 italic">
                                  Content planned
                                </p>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })
              ) : (
                <div className="text-center py-12 select-none space-y-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 mx-auto">
                    <Search size={18} className="text-gray-300 dark:text-gray-600" />
                  </div>
                  <p className="text-xs text-gray-400 dark:text-gray-500 font-bold">No topics found</p>
                  <p className="text-[10px] text-gray-300 dark:text-gray-600 font-medium">Try a different search term</p>
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer Branding */}
          <div className="p-4 border-t border-gray-100 dark:border-gray-800 shrink-0">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-bold text-gray-300 dark:text-gray-600 uppercase tracking-widest">
                CrackDSA Learn
              </span>
              <span className="text-[8px] font-bold text-gray-300 dark:text-gray-600 bg-gray-50 dark:bg-gray-800 px-2 py-0.5 rounded border border-gray-100 dark:border-gray-700 uppercase tracking-wider">
                v2.0
              </span>
            </div>
          </div>

        </motion.aside>
      )}
    </AnimatePresence>
  );
}
