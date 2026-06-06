"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  PlayCircle, 
  Code2, 
  FileText, 
  ChevronDown, 
  ChevronLeft,
  CheckCircle2, 
  Circle,
  Search,
  RotateCcw,
  Bookmark
} from "lucide-react";

export interface CourseSectionItem {
  id: string;
  title: string;
  type: "video" | "problem" | "article";
  asset_id: string;
  is_free: boolean;
  duration_label: string;
}

export interface CourseSubsection {
  id: string;
  title: string;
  description?: string;
  items: CourseSectionItem[];
}

export interface CourseSection {
  id: string;
  title: string;
  description?: string;
  items?: CourseSectionItem[];
  subsections?: CourseSubsection[];
}

interface CourseSidebarProps {
  sections: CourseSection[];
  activeItemId: string;
  completedItemIds: string[];
  revisionItemIds?: string[];
  bookmarkedItemIds?: string[];
  isLoggedIn?: boolean;
  onSelectItem: (item: CourseSectionItem) => void;
  onToggleComplete: (itemId: string) => void;
  onCloseSidebar?: () => void;
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

const itemSlideVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.04,
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
  exit: { opacity: 0, x: -8, transition: { duration: 0.15 } },
};

const checkBounceVariants = {
  unchecked: { scale: 1 },
  checked: {
    scale: [1, 1.35, 0.9, 1.1, 1],
    transition: { duration: 0.45, ease: "easeOut" as const },
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

const CourseSidebar: React.FC<CourseSidebarProps> = ({
  sections,
  activeItemId,
  completedItemIds,
  revisionItemIds = [],
  bookmarkedItemIds = [],
  isLoggedIn = false,
  onSelectItem,
  onToggleComplete,
  onCloseSidebar
}) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [expandedSubsections, setExpandedSubsections] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = React.useRef<HTMLInputElement>(null);
  const [hasMounted, setHasMounted] = useState(false);

  // Track mount for progress ring animation
  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setHasMounted(true);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  // Global search keyboard shortcut (⌘K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Auto-expand sections and subsections containing the active item
  useEffect(() => {
    sections.forEach((sec) => {
      const hasActiveDirect = sec.items?.some((item) => item.id === activeItemId);
      let hasActiveSub = false;

      if (sec.subsections) {
        sec.subsections.forEach((sub) => {
          if (sub.items.some((item) => item.id === activeItemId)) {
            hasActiveSub = true;
            setExpandedSubsections((prev) => ({ ...prev, [sub.id]: true }));
          }
        });
      }

      if (hasActiveDirect || hasActiveSub) {
        setExpandedSections((prev) => ({ ...prev, [sec.id]: true }));
      }
    });
  }, [sections, activeItemId]);

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const toggleSubsection = (subId: string) => {
    setExpandedSubsections((prev) => ({
      ...prev,
      [subId]: !prev[subId]
    }));
  };

  const getItemTypeIcon = (type: "video" | "problem" | "article", isCompleted = false) => {
    const colorClass = isCompleted 
      ? "text-gray-300 dark:text-gray-700" 
      : type === "video" 
      ? "text-brand-500" 
      : type === "problem" 
      ? "text-emerald-500" 
      : "text-purple-500";

    switch (type) {
      case "video":
        return <PlayCircle size={15} className={`shrink-0 ${colorClass}`} />;
      case "problem":
        return <Code2 size={15} className={`shrink-0 ${colorClass}`} />;
      case "article":
        return <FileText size={15} className={`shrink-0 ${colorClass}`} />;
    }
  };

  // Syllabus progress counts helpers
  const getSectionItemsCount = (sec: CourseSection) => {
    let count = 0;
    if (sec.items) count += sec.items.length;
    if (sec.subsections) {
      sec.subsections.forEach((sub) => {
        count += sub.items.length;
      });
    }
    return count;
  };

  const getSectionCompletedCount = (sec: CourseSection) => {
    let count = 0;
    if (sec.items) {
      count += sec.items.filter((item) => completedItemIds.includes(item.id)).length;
    }
    if (sec.subsections) {
      sec.subsections.forEach((sub) => {
        count += sub.items.filter((item) => completedItemIds.includes(item.id)).length;
      });
    }
    return count;
  };

  const totalItems = sections.reduce((acc, curr) => acc + getSectionItemsCount(curr), 0);
  const completedCount = completedItemIds.length;
  const progressPercent = totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;

  const renderItemRow = (item: CourseSectionItem, index: number) => {
    const isActive = item.id === activeItemId;
    const isCompleted = completedItemIds.includes(item.id);
    const isRevision = revisionItemIds.includes(item.id);
    const isBookmarked = bookmarkedItemIds.includes(item.id);

    return (
      <motion.div
        key={item.id}
        custom={index}
        variants={itemSlideVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className={`flex items-start gap-3 p-3.5 cursor-pointer hover:bg-gray-50/50 dark:hover:bg-gray-800/10 transition-all duration-200 ${
          isActive 
            ? "bg-brand-500/5 dark:bg-brand-500/10 border-l-4 border-brand-500 pl-2.5 shadow-[inset_4px_0_12px_-4px_rgba(var(--brand-rgb,99,102,241),0.3)]" 
            : ""
        }`}
      >
        {/* Checkbox Trigger with bounce animation */}
        <motion.button
          onClick={(e) => {
            e.stopPropagation();
            if (isLoggedIn) {
              onToggleComplete(item.id);
            }
          }}
          className={`shrink-0 mt-0.5 transition-colors focus:outline-none ${
            !isLoggedIn
              ? "text-gray-250 dark:text-gray-700 cursor-not-allowed"
              : isCompleted 
              ? "text-emerald-500 dark:text-emerald-400" 
              : isRevision
              ? "text-amber-500 dark:text-amber-400"
              : "text-gray-300 dark:text-gray-600 hover:text-gray-400"
          }`}
          title={
            !isLoggedIn 
              ? "Log in to track progress" 
              : isCompleted 
              ? "Mark Uncompleted" 
              : isRevision
              ? "Mark Completed (Currently: Revision)"
              : "Mark Completed"
          }
          variants={checkBounceVariants}
          animate={isCompleted ? "checked" : "unchecked"}
          whileTap={isLoggedIn ? { scale: 0.85 } : {}}
          disabled={!isLoggedIn}
        >
          {isCompleted ? (
            <CheckCircle2 size={16} className="text-emerald-500 dark:text-emerald-400 fill-emerald-500/15 dark:fill-emerald-500/10 stroke-[2.5]" />
          ) : isRevision ? (
            <RotateCcw size={16} className="stroke-[2.5]" />
          ) : (
            <Circle size={16} />
          )}
        </motion.button>

        {/* Title and details */}
          <div 
            onClick={() => onSelectItem(item)}
            className="flex-1 space-y-1 text-left select-none"
          >
            <span className={`text-xs leading-relaxed block ${
              isActive 
                ? "text-brand-600 dark:text-brand-400 font-extrabold" 
                : isCompleted
                ? "text-gray-400 dark:text-gray-500 font-medium"
                : "text-gray-700 dark:text-gray-350 font-bold"
            }`}>
              {item.title}
            </span>
            
            <div className={`flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest pt-0.5 ${
              isCompleted ? "text-gray-300 dark:text-gray-700" : "text-gray-400"
            }`}>
              {getItemTypeIcon(item.type, isCompleted)}
              <span>{item.type}</span>
              <span>•</span>
              <span>{item.duration_label}</span>
              {isBookmarked && (
                <>
                  <span>•</span>
                  <span className="text-amber-500 flex items-center gap-0.5">
                    <Bookmark size={10} className="fill-amber-500" />
                    Bookmarked
                  </span>
                </>
              )}
            </div>
          </div>
      </motion.div>
    );
  };

  // Filter sections based on search query
  const filteredSections = React.useMemo(() => {
    if (!searchQuery.trim()) return sections;
    const query = searchQuery.toLowerCase();
    
    return sections.map(sec => {
      const secMatch = sec.title.toLowerCase().includes(query);
      const filteredItems = sec.items?.filter(item => item.title.toLowerCase().includes(query)) || [];
      const filteredSub = sec.subsections?.map(sub => {
        const subMatch = sub.title.toLowerCase().includes(query);
        const subItems = sub.items.filter(item => item.title.toLowerCase().includes(query));
        if (subMatch || subItems.length > 0) {
          return { ...sub, items: subMatch && subItems.length === 0 ? sub.items : subItems };
        }
        return null;
      }).filter(Boolean) as CourseSubsection[] || [];
      
      if (secMatch || filteredItems.length > 0 || filteredSub.length > 0) {
        return {
          ...sec,
          items: secMatch && filteredItems.length === 0 && (!sec.subsections || sec.subsections.length === 0) ? sec.items : filteredItems,
          subsections: filteredSub
        };
      }
      return null;
    }).filter(Boolean) as CourseSection[];
  }, [sections, searchQuery]);

  // SVG progress ring calculations
  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
      
      {/* 1. Header Progress visualizer with Minimize arrow */}
      <div className="p-5 border-b border-gray-100 dark:border-gray-800/80 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* SVG Circular Progress Ring - animated on mount */}
            <div className="relative w-8 h-8 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r={radius} fill="none" className="stroke-gray-100 dark:stroke-gray-800" strokeWidth="3" />
                <motion.circle
                  cx="18"
                  cy="18"
                  r={radius}
                  fill="none"
                  className="stroke-brand-500"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset: hasMounted ? strokeDashoffset : circumference }}
                  transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
                />
              </svg>
              <span className="absolute text-[8px] font-bold text-gray-700 dark:text-gray-300">{progressPercent}%</span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                Course Content
              </h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                {completedCount}/{totalItems} items completed
              </p>
            </div>
          </div>
          
          {onCloseSidebar && (
            <motion.button
              onClick={onCloseSidebar}
              className="flex h-6 w-6 items-center justify-center rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-500 dark:hover:text-gray-300 dark:hover:bg-gray-800 transition-colors"
              title="Minimize Sidebar"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronLeft size={16} />
            </motion.button>
          )}
        </div>

        {/* Global Search Input */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={14} className="text-gray-400 group-focus-within:text-brand-500 transition-colors" />
          </div>
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search syllabus..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-12 py-2 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-xl text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-[9px] font-bold text-gray-400 bg-white dark:bg-gray-800 px-1.5 py-0.5 rounded border border-gray-200 dark:border-gray-700">⌘K</span>
          </div>
        </div>
      </div>

      {/* 2. Scrollable Sections Accordion */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
        <AnimatePresence mode="popLayout">
          {filteredSections.map((sec) => {
            const isExpanded = !!expandedSections[sec.id];
            const sectionItemsCount = getSectionItemsCount(sec);
            const sectionCompleted = getSectionCompletedCount(sec);
            
            return (
              <motion.div
                key={sec.id}
                className="rounded-2xl border border-gray-200 dark:border-gray-800/60 overflow-hidden bg-gray-50/20 dark:bg-gray-900/40"
                variants={sectionFadeVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                layout
              >
                {/* Section Accordion Trigger */}
                <button
                  onClick={() => toggleSection(sec.id)}
                  className="w-full flex items-center justify-between p-4 bg-gray-50/40 dark:bg-gray-800/10 hover:bg-gray-50 dark:hover:bg-gray-800/20 transition-all text-left"
                >
                  <div className="space-y-1 pr-4">
                    <h4 className="text-xs sm:text-[13px] font-bold text-gray-900 dark:text-white leading-tight">
                      {sec.title}
                    </h4>
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1.5 mt-1">
                      <span>{sectionCompleted}/{sectionItemsCount} Complete</span>
                    </p>
                  </div>
                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                  >
                    <ChevronDown size={16} />
                  </motion.div>
                </button>

                {/* Subsections and Items list - smooth height animation */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      key={`section-content-${sec.id}`}
                      variants={accordionVariants}
                      initial="collapsed"
                      animate="expanded"
                      exit="collapsed"
                      className="overflow-hidden"
                    >
                      <div className="border-t border-gray-100 dark:border-gray-800/40 divide-y divide-gray-50 dark:divide-gray-800/20 bg-white dark:bg-gray-900">
                        
                        {/* Direct items list (if any) */}
                        {sec.items && sec.items.map((item, idx) => renderItemRow(item, idx))}

                        {/* Subsection items list (if any) */}
                        {sec.subsections && sec.subsections.map((sub) => {
                          const isSubExpanded = !!expandedSubsections[sub.id];
                          const subCompleted = sub.items.filter((item) => completedItemIds.includes(item.id)).length;
                          
                          return (
                            <div key={sub.id} className="bg-gray-50/10 dark:bg-gray-800/10 border-l-2 border-brand-500/20 dark:border-brand-500/10">
                              
                              {/* Subsection Accordion Trigger */}
                              <button
                                onClick={() => toggleSubsection(sub.id)}
                                className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50/50 dark:hover:bg-gray-800/10 transition-all text-left border-b border-gray-50 dark:border-gray-800/10"
                              >
                                <div className="space-y-0.5">
                                  <h5 className="text-[11px] font-bold text-gray-800 dark:text-gray-200 leading-snug">
                                    {sub.title}
                                  </h5>
                                  <p className="text-[8px] text-gray-400 font-bold uppercase tracking-wider">
                                    {subCompleted}/{sub.items.length} Complete
                                  </p>
                                </div>
                                <motion.div
                                  animate={{ rotate: isSubExpanded ? 180 : 0 }}
                                  transition={{ duration: 0.25, ease: "easeInOut" }}
                                >
                                  <ChevronDown size={13} className="text-gray-400" />
                                </motion.div>
                              </button>

                              {/* Subsection Items - smooth height animation */}
                              <AnimatePresence initial={false}>
                                {isSubExpanded && (
                                  <motion.div
                                    key={`sub-content-${sub.id}`}
                                    variants={accordionVariants}
                                    initial="collapsed"
                                    animate="expanded"
                                    exit="collapsed"
                                    className="overflow-hidden"
                                  >
                                    <div className="divide-y divide-gray-50 dark:divide-gray-800/10 pl-2 bg-white dark:bg-gray-900/60">
                                      {sub.items.map((item, idx) => renderItemRow(item, idx))}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CourseSidebar;
