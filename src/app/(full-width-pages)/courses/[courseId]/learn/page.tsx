"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { 
  ArrowLeft, 
  Menu, 
  BookOpen, 
  PlayCircle, 
  Code2, 
  FileText, 
  CheckCircle2, 
  Award,
  Zap,
  Activity,
  AlertCircle,
  RotateCcw,
  MessageSquare,
  FolderDown,
  X,
  Sparkles,
  HelpCircle,
  GraduationCap,
  ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Custom classroom components
import VideoPlayer from "@/components/learning/VideoPlayer";
import ProblemViewer from "@/components/learning/ProblemViewer";
import ArticleReader from "@/components/learning/ArticleReader";
import CourseSidebar, { CourseSectionItem, CourseSection, CourseSubsection } from "@/components/learning/CourseSidebar";
import NotesTab from "@/components/learning/NotesTab";
import DiscussionTab from "@/components/learning/DiscussionTab";
import ResourcesTab from "@/components/learning/ResourcesTab";
import { ThemeToggleButton } from "@/components/common/ThemeToggleButton";
import UserDropdown from "@/components/header/UserDropdown";
// Static high-quality summaries database for video sessions
const LECTURE_SUMMARIES: Record<string, string> = {
  "item-1": "In this session, we deep-dive into compiler compilation models, the difference between stack and heap memory allocations, pointer reference variables in C++, and reference handles in Java. We map out memory addresses to understand dynamic resizing and stack frame execution boundaries.",
  "item-5": "This session covers the extremely popular Two-Pointer linear scan strategy. Learn how to solve array partition, in-place reverse operations, and palindrome validations. We analyze O(N) runtime scans vs O(N^2) brute-force searches.",
  "item-9": "A comprehensive guide to tree node structures. We cover Breadth-First Search (BFS) and Depth-First Search (DFS) traversals (Pre-order, In-order, Post-order) recursively and iteratively. We analyze call stack auxiliary depths.",
  "item-12": "Master the foundations of dynamic programming. We trace recursion trees of repetitive subproblems and optimize them using Top-Down Memoization (HashMap/Array cache) and convert them to high-performance Bottom-Up Tabulation (iterative tables)."
};

// Animation variants for curriculum accordion
const accordionVariants = {
  collapsed: {
    height: 0,
    opacity: 0,
    transition: {
      height: { duration: 0.3, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] },
      opacity: { duration: 0.2 }
    }
  },
  expanded: {
    height: "auto",
    opacity: 1,
    transition: {
      height: { duration: 0.35, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] },
      opacity: { duration: 0.25, delay: 0.05 }
    }
  }
};

interface Instructor {
  name: string;
  role: string;
  company: string;
  color: string;
}

interface CourseDetail {
  id: string;
  title: string;
  description: string;
  instructor: Instructor;
  sections: CourseSection[];
}

export default function LearnPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseId = (params?.courseId as string) || "dsa-bootcamp-recordings";

  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Classroom Player states
  const [activeItem, setActiveItem] = useState<CourseSectionItem | null>(null);
  const [completedItemIds, setCompletedItemIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"overview" | "notes" | "discussion" | "resources">("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);

  // Up Next Overlay States
  const [upNextItem, setUpNextItem] = useState<CourseSectionItem | null>(null);
  const [upNextCountdown, setUpNextCountdown] = useState(0);

  // Reference helper to manipulate child video playhead
  const [playerRef, setPlayerRef] = useState<{ setCurrentTime: (time: number) => void } | null>(null);

  // Curriculum Accordion State
  const [dashboardExpandedSections, setDashboardExpandedSections] = useState<Record<string, boolean>>({});

  // Helper to count section items
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

  // Helper to count completed items in a section
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

  // Helper to gather all course items in sequence
  const getFlattenedItems = (sections: CourseSection[]): CourseSectionItem[] => {
    const flattened: CourseSectionItem[] = [];
    sections.forEach((sec) => {
      if (sec.items) {
        flattened.push(...sec.items);
      }
      if (sec.subsections) {
        sec.subsections.forEach((sub) => {
          if (sub.items) {
            flattened.push(...sub.items);
          }
        });
      }
    });
    return flattened;
  };

  const fetchCourseDetails = async () => {
    try {
      setLoading(true);
      setError(false);
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
      const res = await fetch(`${backendUrl}/api/v1/courses/${courseId}`);
      
      if (!res.ok) {
        throw new Error(`Server returned status: ${res.status}`);
      }
      
      const data = await res.json();
      setCourse(data);

      // Load persistent progress list from localStorage
      const savedProgress = localStorage.getItem(`progress-${courseId}`);
      if (savedProgress) {
        try {
          setCompletedItemIds(JSON.parse(savedProgress));
        } catch (e) {
          console.error("Failed to parse progress:", e);
        }
      }

      // Identify starting item
      if (data.sections && data.sections.length > 0) {
        const queryItemId = searchParams.get("item");
        const flatItems = getFlattenedItems(data.sections);
        let initialItem: CourseSectionItem | null = null;

        if (queryItemId) {
          initialItem = flatItems.find((it) => it.id === queryItemId) || null;
          setActiveItem(initialItem);
        } else {
          setActiveItem(null); // Load Classroom Dashboard by default!
        }
      }
    } catch (err) {
      console.error("Failed to fetch course details:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseDetails();
  }, [courseId]);

  // Handle Up Next countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (upNextCountdown > 0 && upNextItem) {
      timer = setInterval(() => {
        setUpNextCountdown((prev) => {
          if (prev <= 1) {
            handleSelectItem(upNextItem);
            setUpNextItem(null);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [upNextCountdown, upNextItem]);

  // Sync active item parameter to URL
  const handleSelectItem = (item: CourseSectionItem) => {
    setActiveItem(item);
    setCurrentTime(0);
    
    // Update URL query parameters seamlessly
    const newUrl = `${window.location.pathname}?item=${item.id}`;
    window.history.pushState({ path: newUrl }, "", newUrl);
  };

  // Toggle item completion state
  const handleToggleComplete = (itemId: string) => {
    let updated: string[];
    if (completedItemIds.includes(itemId)) {
      updated = completedItemIds.filter((id) => id !== itemId);
    } else {
      updated = [...completedItemIds, itemId];
    }
    setCompletedItemIds(updated);
    localStorage.setItem(`progress-${courseId}`, JSON.stringify(updated));
  };

  // Jump to specific time inside video player
  const handleJumpToTime = (timeInSeconds: number) => {
    if (playerRef) {
      playerRef.setCurrentTime(timeInSeconds);
      // Smoothly scroll back to the top of the video player viewport
      const container = document.getElementById("classroom-main-stage");
      if (container) {
        container.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  // Autoplay next item upon video completion
  const handleVideoEnded = () => {
    if (!course || !activeItem) return;

    // Toggle current item as complete automatically!
    if (!completedItemIds.includes(activeItem.id)) {
      handleToggleComplete(activeItem.id);
    }

    const flatItems = getFlattenedItems(course.sections);
    const currentIndex = flatItems.findIndex((it) => it.id === activeItem.id);

    if (currentIndex !== -1 && currentIndex < flatItems.length - 1) {
      setUpNextItem(flatItems[currentIndex + 1]);
      setUpNextCountdown(5); // Show overlay for 5 seconds
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-950 space-y-4">
        <div className="h-10 w-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-bold text-gray-500 dark:text-gray-400">Loading your customized classroom workspace...</p>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-950 px-6">
        <div className="max-w-md text-center py-16 px-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl shadow-sm">
          <div className="flex w-14 h-14 mx-auto items-center justify-center rounded-2xl bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/10 mb-5">
            <AlertCircle size={28} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Failed to Load Classroom</h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            We experienced a connection issue loading the course syllabus. Check that the backend server is running and try again.
          </p>
          <button 
            onClick={fetchCourseDetails}
            className="mt-6 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold shadow-md shadow-brand-500/15"
          >
            <RotateCcw size={14} />
            <span>Retry Workspace</span>
          </button>
        </div>
      </div>
    );
  }

  const flatSyllabusItems = getFlattenedItems(course.sections);
  const totalSyllabusItems = flatSyllabusItems.length;

  // Dynamic Continue Where You Left resolver
  const getContinueLearningTarget = () => {
    const firstUncompleted = flatSyllabusItems.find((it) => !completedItemIds.includes(it.id));
    return firstUncompleted || (flatSyllabusItems.length > 0 ? flatSyllabusItems[0] : null);
  };

  const continueTarget = getContinueLearningTarget();
  const progressPercent = totalSyllabusItems > 0 ? Math.round((completedItemIds.length / totalSyllabusItems) * 100) : 0;

  // Count progress for specific types
  const videoItems = flatSyllabusItems.filter((it) => it.type === "video");
  const completedVideos = videoItems.filter((it) => completedItemIds.includes(it.id));

  const problemItems = flatSyllabusItems.filter((it) => it.type === "problem");
  const completedProblems = problemItems.filter((it) => completedItemIds.includes(it.id));

  const articleItems = flatSyllabusItems.filter((it) => it.type === "article");
  const completedArticles = articleItems.filter((it) => completedItemIds.includes(it.id));

  return (
    <div className="h-screen w-screen flex bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 overflow-hidden font-sans">
      
      {/* Immersive Left Sidebar: Syllabus & Navigation Drawer */}
      <AnimatePresence initial={false}>
        {isSidebarOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 350, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="h-full flex flex-col shrink-0 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 overflow-hidden z-20"
          >
            {/* Integrated Sidebar Navigation Header */}
            <div className="p-5 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shrink-0 flex flex-col gap-3">
              <Link 
                href="/courses"
                className="inline-flex items-center gap-2 text-[10px] font-bold text-gray-400 hover:text-brand-500 dark:text-gray-500 dark:hover:text-brand-400 transition-colors uppercase tracking-wider"
              >
                <ArrowLeft size={13} />
                <span>Back to Courses</span>
              </Link>
              
              <div className="space-y-1">
                <h2 className="text-sm font-bold text-gray-900 dark:text-white leading-snug tracking-tight line-clamp-2">
                  {course.title}
                </h2>
              </div>

              {/* Classroom Dashboard Home Trigger */}
              <button
                onClick={() => {
                  setActiveItem(null);
                  const newUrl = window.location.pathname;
                  window.history.pushState({ path: newUrl }, "", newUrl);
                }}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all border text-left cursor-pointer select-none ${
                  activeItem === null
                    ? "bg-brand-500/10 border-brand-500/10 text-brand-600 dark:text-brand-400 shadow-sm"
                    : "bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-800 border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400"
                }`}
              >
                <Activity size={14} className="shrink-0 stroke-[2.5] text-brand-500" />
                <span>Course Dashboard</span>
              </button>
            </div>

            {/* Syllabus Component Scroll Pane */}
            <div className="flex-1 overflow-y-auto custom-scrollbar bg-white dark:bg-gray-900">
              <CourseSidebar
                sections={course.sections}
                activeItemId={activeItem?.id || ""}
                completedItemIds={completedItemIds}
                onSelectItem={handleSelectItem}
                onToggleComplete={handleToggleComplete}
                onCloseSidebar={() => setIsSidebarOpen(false)}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Focus Console (Right Pane) */}
      <div 
        id="classroom-main-stage"
        className="flex-1 h-full overflow-y-auto flex flex-col custom-scrollbar bg-gray-50 dark:bg-gray-950"
      >
        
        {/* Distraction-Free Narrow Top Controller Header */}
        <header className="h-14 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex items-center justify-between px-6 shrink-0 z-10 shadow-sm select-none">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700/80 text-gray-500 hover:text-brand-500 border border-gray-200 dark:border-gray-800 transition-colors"
              title={isSidebarOpen ? "Minimize Syllabus" : "Expand Syllabus"}
            >
              <Menu size={16} />
            </button>
            
            {activeItem ? (
              <div className="flex items-center gap-2.5">
                <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest hidden sm:inline">
                  Active Lesson:
                </span>
                <span className="text-xs font-bold text-brand-500 dark:text-brand-400 truncate max-w-[200px] md:max-w-md">
                  {activeItem.title}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-extrabold text-brand-500 dark:text-brand-400 uppercase tracking-wider">
                  Academy Student Classroom Console
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md uppercase tracking-wider border border-emerald-500/10 hidden sm:inline-block">
              {completedItemIds.length} / {totalSyllabusItems} Completed
            </span>

            <ThemeToggleButton />
            <UserDropdown />
          </div>
        </header>

        {/* Central Focus Stage Wrapper */}
        <main className="flex-1 w-full max-w-5xl mx-auto p-4 sm:p-6 md:p-8 space-y-8 pb-20">
          
          {/* Dashboard Home - Rendered when activeItem is null */}
          {activeItem === null ? (
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="max-w-4xl mx-auto w-full space-y-8 select-none"
            >
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Modern Continue Learning Card */}
                {continueTarget && (
                  <motion.div 
                    whileHover={{ scale: 1.01, translateY: -2 }}
                    className="md:col-span-2 rounded-3xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border border-gray-200 dark:border-gray-800 p-6 flex flex-col justify-between shadow-xl shadow-gray-200/40 dark:shadow-none group relative overflow-hidden"
                  >
                    {/* Glowing Accent */}
                    <div className="absolute top-0 right-0 w-48 h-48 bg-brand-500/10 rounded-full blur-3xl -mr-20 -mt-20 transition-transform group-hover:scale-110" />

                    <div className="space-y-4 relative z-10">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold text-brand-500 uppercase tracking-widest leading-none flex items-center gap-1.5">
                          <Zap size={12} className="fill-brand-500" />
                          Up Next For You
                        </span>
                        <span className={`px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-wider border backdrop-blur-md ${
                          continueTarget.type === "video"
                            ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
                            : continueTarget.type === "problem"
                            ? "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20"
                            : "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20"
                        }`}>
                          {continueTarget.type}
                        </span>
                      </div>
                      
                      <div>
                        <h3 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight leading-snug line-clamp-2">
                          {continueTarget.title}
                        </h3>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-2">
                          {continueTarget.duration_label} remaining
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleSelectItem(continueTarget)}
                      className="mt-6 w-fit relative z-10 flex items-center justify-center gap-2 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-bold py-3.5 px-7 text-sm shadow-[0_0_20px_rgba(var(--brand-500),0.3)] hover:shadow-[0_0_25px_rgba(var(--brand-500),0.5)] transition-all cursor-pointer active:scale-95"
                    >
                      <PlayCircle size={16} />
                      <span>Resume Learning</span>
                    </button>
                  </motion.div>
                )}

                {/* Rich Progress Stats Card */}
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 flex flex-col justify-between shadow-lg shadow-gray-200/20 dark:shadow-none"
                >
                  <div className="space-y-4">
                    <span className="text-[10px] font-extrabold text-gray-400 dark:text-gray-500 uppercase tracking-widest leading-none">Course Progress</span>
                    
                    <div className="space-y-2">
                      <div className="flex items-baseline justify-between">
                        <span className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter">
                          {progressPercent}%
                        </span>
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20">
                          {completedItemIds.length} / {totalSyllabusItems}
                        </span>
                      </div>
                      
                      {/* Visual progress bar */}
                      <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${progressPercent}%` }}
                          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                          className="h-full bg-brand-500 rounded-full relative"
                        >
                          <div className="absolute inset-0 bg-white/20 w-full h-full animate-pulse" />
                        </motion.div>
                      </div>
                    </div>
                  </div>

                  {/* Sub-counters */}
                  <div className="grid grid-cols-3 gap-2 pt-5 border-t border-gray-100 dark:border-gray-800 mt-4">
                    <div className="text-center group/stat cursor-default">
                      <span className="text-sm font-black text-gray-800 dark:text-gray-100 group-hover/stat:text-brand-500 transition-colors">{completedVideos.length}/{videoItems.length}</span>
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block mt-1">Videos</span>
                    </div>
                    <div className="text-center border-x border-gray-100 dark:border-gray-800 px-1 group/stat cursor-default">
                      <span className="text-sm font-black text-gray-800 dark:text-gray-100 group-hover/stat:text-brand-500 transition-colors">{completedProblems.length}/{problemItems.length}</span>
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block mt-1">Problems</span>
                    </div>
                    <div className="text-center group/stat cursor-default">
                      <span className="text-sm font-black text-gray-800 dark:text-gray-100 group-hover/stat:text-brand-500 transition-colors">{completedArticles.length}/{articleItems.length}</span>
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block mt-1">Notes</span>
                    </div>
                  </div>
                </motion.div>

              </div>

              {/* 3. Global Syllabus outline navigator */}
              <div className="space-y-4 pt-2">
                <h3 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider border-l-2 border-brand-500 pl-2">
                  Full Curriculum Syllabus
                </h3>
                
                <div className="space-y-5">
                  {course.sections.map((section, sectionIndex) => {
                    const sectionItemsCount = getSectionItemsCount(section);
                    const sectionCompleted = getSectionCompletedCount(section);
                    const isExpanded = dashboardExpandedSections[section.id] ?? (
                      continueTarget 
                        ? (section.items?.some(it => it.id === continueTarget.id) || section.subsections?.some(sub => sub.items.some(it => it.id === continueTarget.id)))
                        : (sectionIndex === 0)
                    );

                    return (
                      <motion.div
                        key={section.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut", delay: sectionIndex * 0.1 }}
                        className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800/80 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
                      >
                        {/* Section Accordion Trigger Header */}
                        <button
                          onClick={() => {
                            setDashboardExpandedSections(prev => ({
                              ...prev,
                              [section.id]: !isExpanded
                            }));
                          }}
                          className="w-full flex items-center justify-between p-5 text-left cursor-pointer select-none group bg-transparent hover:bg-gray-50/30 dark:hover:bg-gray-800/10 transition-colors"
                        >
                          <div className="space-y-1.5 pr-4 flex-1">
                            <h4 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white leading-snug group-hover:text-brand-500 dark:group-hover:text-brand-400 transition-colors">
                              {section.title}
                            </h4>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1.5 mt-1">
                              <span>{sectionCompleted} / {sectionItemsCount} Complete</span>
                            </p>
                          </div>
                          
                          <div className="flex items-center gap-3 shrink-0">
                            <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-md border shrink-0 ${
                              sectionCompleted === sectionItemsCount && sectionItemsCount > 0
                                ? "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/10"
                                : "text-brand-500 dark:text-brand-400 bg-brand-500/5 dark:bg-brand-500/10 border-brand-500/10"
                            }`}>
                              {sectionCompleted === sectionItemsCount && sectionItemsCount > 0 ? "Completed" : "In Progress"}
                            </span>
                            
                            <motion.div
                              animate={{ rotate: isExpanded ? 180 : 0 }}
                              transition={{ duration: 0.25, ease: "easeInOut" }}
                              className="text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300"
                            >
                              <ChevronDown size={20} />
                            </motion.div>
                          </div>
                        </button>

                        {/* Section Content Accordion Expandable Frame */}
                        <AnimatePresence initial={false}>
                          {isExpanded && (
                            <motion.div
                              key={`section-dashboard-content-${section.id}`}
                              variants={accordionVariants}
                              initial="collapsed"
                              animate="expanded"
                              exit="collapsed"
                              className="overflow-hidden"
                            >
                              <div className="px-5 pb-5 border-t border-gray-100 dark:border-gray-800/60 pt-5 space-y-5">
                                
                                {section.description && (
                                  <p className="text-xs text-gray-500 leading-relaxed font-medium pb-2 border-b border-gray-50 dark:border-gray-800/30">
                                    {section.description}
                                  </p>
                                )}

                                {/* Section Items Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                                  {section.items?.map((item) => {
                                    const isCompleted = completedItemIds.includes(item.id);
                                    const TypeIcon = item.type === "video" ? PlayCircle : item.type === "problem" ? Code2 : FileText;
                                    return (
                                      <motion.button
                                        key={item.id}
                                        whileHover={{ translateY: -1, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}
                                        transition={{ duration: 0.2, ease: "easeOut" }}
                                        onClick={() => handleSelectItem(item)}
                                        className={`flex items-center justify-between p-3.5 rounded-xl border bg-gray-50/10 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:border-gray-300 dark:hover:border-gray-700 transition-all text-left cursor-pointer group ${
                                          isCompleted
                                            ? "border-emerald-300/60 dark:border-emerald-500/20 shadow-[0_0_12px_rgba(16,185,129,0.08)] dark:shadow-[0_0_12px_rgba(16,185,129,0.06)]"
                                            : "border-gray-200 dark:border-gray-800/80"
                                        }`}
                                      >
                                        <span className="flex items-center gap-2 text-xs font-bold text-gray-600 dark:text-gray-300 group-hover:text-brand-500 dark:group-hover:text-brand-400 transition-colors truncate pr-2">
                                          <TypeIcon size={13} className={`shrink-0 ${
                                            isCompleted ? "text-emerald-500" : "text-gray-400 dark:text-gray-500 group-hover:text-brand-500 dark:group-hover:text-brand-400"
                                          } transition-colors`} />
                                          {item.title}
                                        </span>
                                        <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold uppercase tracking-wider shrink-0 border ${
                                          isCompleted
                                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/10"
                                            : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 border-gray-200 dark:border-gray-700"
                                        }`}>
                                          {isCompleted ? "Completed" : "Start"}
                                        </span>
                                      </motion.button>
                                    );
                                  })}
                                  
                                  {/* Subsections rendering */}
                                  {section.subsections?.map((sub) => (
                                    <div key={sub.id} className="col-span-1 sm:col-span-2 space-y-2.5 pt-1">
                                      <span className="text-[10px] font-extrabold text-gray-400 dark:text-gray-500 uppercase tracking-widest leading-none block pt-2 border-t border-gray-50 dark:border-gray-800">
                                        {sub.title}
                                      </span>
                                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {sub.items.map((item) => {
                                          const isCompleted = completedItemIds.includes(item.id);
                                          const TypeIcon = item.type === "video" ? PlayCircle : item.type === "problem" ? Code2 : FileText;
                                          return (
                                            <motion.button
                                              key={item.id}
                                              whileHover={{ translateY: -1, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}
                                              transition={{ duration: 0.2, ease: "easeOut" }}
                                              onClick={() => handleSelectItem(item)}
                                              className={`flex items-center justify-between p-3.5 rounded-xl border bg-gray-50/10 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:border-gray-300 dark:hover:border-gray-700 transition-all text-left cursor-pointer group ${
                                                isCompleted
                                                  ? "border-emerald-300/60 dark:border-emerald-500/20 shadow-[0_0_12px_rgba(16,185,129,0.08)] dark:shadow-[0_0_12px_rgba(16,185,129,0.06)]"
                                                  : "border-gray-200 dark:border-gray-800/80"
                                              }`}
                                            >
                                              <span className="flex items-center gap-2 text-xs font-bold text-gray-600 dark:text-gray-300 group-hover:text-brand-500 dark:group-hover:text-brand-400 transition-colors truncate pr-2">
                                                <TypeIcon size={13} className={`shrink-0 ${
                                                  isCompleted ? "text-emerald-500" : "text-gray-400 dark:text-gray-500 group-hover:text-brand-500 dark:group-hover:text-brand-400"
                                                } transition-colors`} />
                                                {item.title}
                                              </span>
                                              <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold uppercase tracking-wider shrink-0 border ${
                                                isCompleted
                                                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/10"
                                                  : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 border-gray-200 dark:border-gray-700"
                                              }`}>
                                                {isCompleted ? "Completed" : "Start"}
                                              </span>
                                            </motion.button>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* 4. Instructor info card */}
              <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 space-y-4">
                <h4 className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Your Instructor</h4>
                <div className="flex items-center gap-4">
                  <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${course.instructor.color} text-white font-bold text-base shadow-sm`}>
                    {course.instructor.name.split(" ").map(w => w[0]).join("")}
                  </div>
                  <div className="space-y-1">
                    <h5 className="text-sm sm:text-base font-black text-gray-900 dark:text-white leading-none">
                      {course.instructor.name}
                    </h5>
                    <p className="text-xs text-brand-500 dark:text-brand-400 font-bold flex items-center gap-2 pt-0.5">
                      <span>{course.instructor.role}</span>
                      <span>{course.instructor.company}</span>
                    </p>
                  </div>
                </div>
              </div>

            </motion.div>
          ) : (
            <>
              {/* Main Visual Media Player Stage */}
              {activeItem?.type === "video" && (
                <div className="relative rounded-3xl overflow-hidden bg-gray-50 dark:bg-gray-800/10 p-0 sm:p-2 border border-gray-200 dark:border-gray-800/60 shadow-inner">
                  <VideoPlayer
                    url={activeItem.asset_id}
                    title={activeItem.title}
                    onTimeUpdate={setCurrentTime}
                    onPlayerRefReady={setPlayerRef}
                    onEnded={handleVideoEnded}
                  />

                  {/* Up Next Overlay */}
                  <AnimatePresence>
                    {upNextItem && (
                      <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="absolute bottom-6 right-6 z-50 w-72 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl overflow-hidden"
                      >
                        <div className="p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-extrabold text-brand-500 uppercase tracking-widest">Up Next in {upNextCountdown}s</span>
                            <button 
                              onClick={() => setUpNextItem(null)}
                              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                            >
                              <X size={14} />
                            </button>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-bold text-gray-900 dark:text-white leading-snug line-clamp-2">
                              {upNextItem.title}
                            </h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 uppercase font-bold tracking-wider">
                              {upNextItem.type} • {upNextItem.duration_label}
                            </p>
                          </div>
                          
                          <div className="flex gap-2 pt-1">
                            <button
                              onClick={() => setUpNextItem(null)}
                              className="flex-1 px-3 py-2 text-[11px] font-bold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-colors"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => {
                                handleSelectItem(upNextItem);
                                setUpNextItem(null);
                              }}
                              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-[11px] font-bold text-white bg-brand-500 hover:bg-brand-600 rounded-xl transition-colors"
                            >
                              <PlayCircle size={12} />
                              Play Now
                            </button>
                          </div>
                        </div>
                        {/* Countdown progress bar */}
                        <div className="h-1 bg-gray-100 dark:bg-gray-800 w-full">
                          <div 
                            className="h-full bg-brand-500 transition-all duration-1000 ease-linear"
                            style={{ width: `${(upNextCountdown / 5) * 100}%` }}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
              {activeItem?.type === "problem" && (
                <ProblemViewer slug={activeItem.asset_id} />
              )}
              {activeItem?.type === "article" && (
                <ArticleReader slug={activeItem.asset_id} />
              )}

              {/* Actionable Bottom Study Tabs Panel - Exclusively for Video sessions */}
              {activeItem?.type === "video" && (
                <div className="space-y-6">
                  <div className="flex bg-gray-50/50 dark:bg-gray-900/40 p-1.5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm shrink-0 relative">
                    {([
                      { id: "overview", label: "Lecture Details", icon: <Activity size={14} />, disabled: false },
                      { id: "notes", label: "Notes", icon: <FileText size={14} />, disabled: false },
                      { id: "discussion", label: "Q&A (Coming Soon)", icon: <MessageSquare size={14} />, disabled: true },
                      { id: "resources", label: "Resources", icon: <FolderDown size={14} />, disabled: false }
                    ] as const).map((tab) => {
                      const isActive = activeTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => {
                            if (!tab.disabled) {
                              setActiveTab(tab.id);
                            }
                          }}
                          disabled={tab.disabled}
                          className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-3 text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-colors duration-200 select-none cursor-pointer relative z-10 ${
                            tab.disabled
                              ? "opacity-40 cursor-not-allowed text-gray-400 dark:text-gray-600"
                              : isActive 
                              ? "text-white"
                              : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                          }`}
                          title={tab.disabled ? "Q&A discussions coming soon" : undefined}
                        >
                          {isActive && (
                            <motion.div
                              layoutId="activeStudyTab"
                              className="absolute inset-0 bg-brand-500 rounded-xl shadow-sm"
                              transition={{ type: "spring", stiffness: 400, damping: 30 }}
                            />
                          )}
                          <span className="relative z-10">{tab.icon}</span>
                          <span className="hidden sm:inline relative z-10">{tab.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Tab content viewer frame */}
                  <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 sm:p-7 min-h-[250px] shadow-sm">
                    <AnimatePresence mode="wait">
                      {activeTab === "overview" && (
                        <motion.div
                          key="tab-overview"
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                          className="space-y-6"
                        >
                          <div className="space-y-2.5">
                            <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white tracking-tight">About this Session</h3>
                            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                              {activeItem && LECTURE_SUMMARIES[activeItem.id] 
                                ? LECTURE_SUMMARIES[activeItem.id] 
                                : course.description}
                            </p>
                          </div>

                          <div className="h-[1px] bg-gray-100 dark:bg-gray-800/80" />

                          {/* Instructor spotlight details */}
                          <div className="space-y-4">
                            <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Instructor Spotlight</h4>
                            <div className="flex items-center gap-4">
                              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${course.instructor.color} text-white font-bold text-sm shadow-sm`}>
                                {course.instructor.name.split(" ").map(w => w[0]).join("")}
                              </div>
                              <div>
                                <h5 className="text-sm font-bold text-gray-900 dark:text-white leading-none">
                                  {course.instructor.name}
                                </h5>
                                <p className="text-xs text-brand-500 dark:text-brand-400 font-bold mt-1.5 flex items-center gap-1.5">
                                  <span>{course.instructor.role}</span>
                                  <span>•</span>
                                  <span>{course.instructor.company}</span>
                                </p>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {activeTab === "notes" && (
                        <motion.div
                          key="tab-notes"
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                        >
                          <NotesTab
                            courseId={courseId}
                            itemId={activeItem?.id || "general"}
                          />
                        </motion.div>
                      )}

                      {activeTab === "discussion" && (
                        <motion.div
                          key="tab-discussion"
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                        >
                          <DiscussionTab
                            courseId={courseId}
                            itemId={activeItem?.id || "general"}
                            lectureTitle={activeItem?.title || "Class Lecture"}
                          />
                        </motion.div>
                      )}

                      {activeTab === "resources" && (
                        <motion.div
                          key="tab-resources"
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                        >
                          <ResourcesTab itemId={activeItem?.id || "general"} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              )}
            </>
          )}

        </main>
      </div>

    </div>
  );
}
