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
  ChevronDown,
  Rocket
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { BACKEND_URL } from "@/config/api";

// Custom classroom components
import VideoPlayer from "@/components/learning/VideoPlayer";
import ProblemViewer from "@/components/learning/ProblemViewer";
import ArticleReader from "@/components/learning/ArticleReader";
import CourseSidebar, { CourseSectionItem, CourseSection, CourseSubsection, getFlattenedItems, getSectionItemsCount, getSectionCompletedCount } from "@/components/learning/CourseSidebar";
import NotesTab from "@/components/learning/NotesTab";
import DiscussionTab from "@/components/learning/DiscussionTab";
import ResourcesTab from "@/components/learning/ResourcesTab";
import AppHeader from "@/layout/AppHeader";
import { useAuth } from "@/context/AuthContext";
import StatusSelector from "@/components/learning/StatusSelector";
import BookmarkButton from "@/components/learning/BookmarkButton";
import { fetchUserAssetStates as fetchUserAssetStatesFromApi, updateUserAssetState } from "@/api/user";
import ReadMoreHTML from "@/components/common/ReadMoreHTML";


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
  id: string;
  name: string;
  role: string;
  company: string;
  color?: string;
  profile_image_url?: string;
}

interface CourseDetail {
  id: string;
  slug: string;
  title: string;
  description: string;
  instructors: Instructor[];
  sections: CourseSection[];
}

export default function LearnPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseSlug = params?.slug as string;

  const { user, isLoggedIn } = useAuth();
  const firstName = user?.full_name ? user.full_name.split(" ")[0] : "";

  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [instructorsList, setInstructorsList] = useState<any[]>([]);

  // Classroom Player states
  const [activeItem, setActiveItem] = useState<CourseSectionItem | null>(null);
  const [isProgressLoading, setIsProgressLoading] = useState(false);
  const [itemStates, setItemStates] = useState<Record<string, any>>({});

  const completedItemIds = React.useMemo(() => {
    return Object.values(itemStates)
      .filter((state) => state.status === "done")
      .map((state) => state.asset_id);
  }, [itemStates]);

  const revisionItemIds = React.useMemo(() => {
    return Object.values(itemStates)
      .filter((state) => state.status === "revision")
      .map((state) => state.asset_id);
  }, [itemStates]);

  const bookmarkedItemIds = React.useMemo(() => {
    return Object.values(itemStates)
      .filter((state) => state.is_bookmarked)
      .map((state) => state.asset_id);
  }, [itemStates]);
  const [activeTab, setActiveTab] = useState<"overview" | "notes" | "discussion" | "resources">("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    if (typeof window === "undefined") return true;
    const stored = localStorage.getItem("crackdsa_course_sidebar");
    return stored === null ? true : stored === "open";
  });

  const handleToggleCourseSidebar = (forceState?: boolean) => {
    setIsSidebarOpen(prev => {
      const nextState = forceState !== undefined ? forceState : !prev;
      if (typeof window !== "undefined") {
        localStorage.setItem("crackdsa_course_sidebar", nextState ? "open" : "closed");
      }
      return nextState;
    });
  };
  const [currentTime, setCurrentTime] = useState(0);
  const [resolvedAsset, setResolvedAsset] = useState<{ urlOrSlug: string; loading: boolean; error: boolean; data?: any }>({
    urlOrSlug: "",
    loading: false,
    error: false,
    data: undefined
  });

  // Up Next Overlay States
  const [upNextItem, setUpNextItem] = useState<CourseSectionItem | null>(null);
  const [upNextCountdown, setUpNextCountdown] = useState(0);

  // Reference helper to manipulate child video playhead
  const [playerRef, setPlayerRef] = useState<{ setCurrentTime: (time: number) => void } | null>(null);

  // Curriculum Accordion State
  const [dashboardExpandedSections, setDashboardExpandedSections] = useState<Record<string, boolean>>({});

  // Streak Tracker state
  const [streakCount, setStreakCount] = useState(1);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const streakKey = `streak-count-${courseSlug}`;
    const dateKey = `streak-last-date-${courseSlug}`;
    
    const todayStr = new Date().toDateString();
    const lastDateStr = localStorage.getItem(dateKey);
    const currentStreak = parseInt(localStorage.getItem(streakKey) || "1", 10);
    
    if (!lastDateStr) {
      localStorage.setItem(streakKey, "1");
      localStorage.setItem(dateKey, todayStr);
      setStreakCount(1);
    } else {
      const today = new Date();
      const lastDate = new Date(lastDateStr);
      
      const diffTime = today.setHours(0,0,0,0) - lastDate.setHours(0,0,0,0);
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        const newStreak = currentStreak + 1;
        localStorage.setItem(streakKey, newStreak.toString());
        localStorage.setItem(dateKey, todayStr);
        setStreakCount(newStreak);
      } else if (diffDays > 1) {
        localStorage.setItem(streakKey, "1");
        localStorage.setItem(dateKey, todayStr);
        setStreakCount(1);
      } else {
        setStreakCount(currentStreak);
      }
    }
  }, [courseSlug]);


  const fetchCourseDetails = async () => {
    if (!courseSlug) return;
    try {
      setLoading(true);
      setError(false);
      const backendUrl = BACKEND_URL;
      
      const [courseRes, curriculumRes, instructorsRes] = await Promise.all([
        fetch(`${backendUrl}/api/v1/courses/${courseSlug}`),
        fetch(`${backendUrl}/api/v1/courses/${courseSlug}/curriculum`),
        fetch(`${backendUrl}/api/v1/instructors`)
      ]);
      
      if (!courseRes.ok) {
        throw new Error(`Server returned status: ${courseRes.status} for course summary`);
      }
      if (!curriculumRes.ok) {
        throw new Error(`Server returned status: ${curriculumRes.status} for curriculum`);
      }
      
      const courseData = await courseRes.json();
      const curriculumData = await curriculumRes.json();
      let instructorsData = { items: [] };
      if (instructorsRes.ok) {
        instructorsData = await instructorsRes.json();
        setInstructorsList(instructorsData.items || []);
      }
      
      // Map instructor IDs to objects
      const matchedInstructors = (instructorsData.items || []).filter((i: any) => 
        (courseData.instructor_ids || []).includes(i.id)
      );

      setCourse({
        id: courseData.id,
        slug: courseData.slug,
        title: courseData.title,
        description: courseData.description,
        instructors: matchedInstructors,
        sections: curriculumData || [],
      });

      // Progress is loaded from backend database for logged-in users.
      // Guest users see everything as pending.

      // Identify starting item
      const sections = curriculumData || [];
      if (sections.length > 0) {
        const queryItemId = searchParams.get("item");
        const flatItems = getFlattenedItems(sections);
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
    if (courseSlug) {
      fetchCourseDetails();
    }
  }, [courseSlug]);

  // Resolve asset UUIDs dynamically to their URL or Slug
  useEffect(() => {
    if (!activeItem) {
      setResolvedAsset({ urlOrSlug: "", loading: false, error: false });
      return;
    }

    const assetId = activeItem.asset_id;
    const type = activeItem.type;

    // Check if assetId matches UUID regex
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(assetId);

    // For video, only fetch if it's a UUID (video-lectures API requires UUID)
    if (type === "video" && !isUuid) {
      setResolvedAsset({ urlOrSlug: assetId, loading: false, error: false, data: undefined });
      return;
    }

    // It's either a UUID, or it's a slug for a problem/article (both endpoints support slug/id)
    let active = true;
    const resolveUuid = async () => {
      setResolvedAsset({ urlOrSlug: "", loading: true, error: false, data: undefined });
      try {
        const backendUrl = BACKEND_URL;
        let endpoint = "";
        if (type === "video") {
          endpoint = `/api/v1/video-lectures/${assetId}`;
        } else if (type === "problem") {
          endpoint = `/api/v1/practice-problems/${assetId}`;
        } else if (type === "article") {
          endpoint = `/api/v1/articles/${assetId}`;
        }

        const res = await fetch(`${backendUrl}${endpoint}`);
        if (!res.ok) {
          throw new Error(`Server returned status: ${res.status}`);
        }
        const data = await res.json();

        let urlOrSlug = "";
        if (type === "video") {
          urlOrSlug = data.video_url || "";
        } else {
          urlOrSlug = data.slug || "";
        }

        if (active) {
          setResolvedAsset({ urlOrSlug, loading: false, error: false, data });
        }
      } catch (err) {
        console.error("Failed to dynamically resolve curriculum asset UUID:", err);
        if (active) {
          setResolvedAsset({ urlOrSlug: "", loading: false, error: true, data: undefined });
        }
      }
    };

    resolveUuid();

    return () => {
      active = false;
    };
  }, [activeItem?.id, activeItem?.asset_id, activeItem?.type]);

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

  const loadUserAssetStates = async () => {
    setIsProgressLoading(true);
    try {
      const data = await fetchUserAssetStatesFromApi();
      const stateMap: Record<string, any> = {};
      data.forEach((state: any) => {
        stateMap[state.asset_id] = state;
      });
      setItemStates(stateMap);
    } catch (e) {
      console.error("Failed to fetch user asset states from backend:", e);
    } finally {
      setIsProgressLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      loadUserAssetStates();
    } else {
      setItemStates({});
    }
  }, [isLoggedIn, courseSlug]);

  // Update item progress status in DB
  const handleUpdateStatus = async (assetId: string, assetType: string, newStatus: "pending" | "done" | "revision") => {
    if (!isLoggedIn) return;

    // 1. Optimistic UI update
    setItemStates((prev) => ({
      ...prev,
      [assetId]: {
        ...(prev[assetId] || {
          asset_id: assetId,
          asset_type: assetType,
          is_bookmarked: false,
          notes: []
        }),
        status: newStatus
      } as any
    }));

    // 2. Persist to Backend
    try {
      const updatedState = await updateUserAssetState(assetType as any, assetId, { status: newStatus });
      setItemStates((prev) => ({
        ...prev,
        [assetId]: updatedState
      }));
    } catch (err) {
      console.error("Failed to persist user progress to backend:", err);
    }
  };

  // Toggle item completion state
  const handleToggleComplete = (assetId: string, assetType: string = "video") => {
    if (!isLoggedIn) return;
    const currentStatus = itemStates[assetId]?.status || "pending";
    const newStatus = currentStatus === "done" ? "pending" : "done";
    
    handleUpdateStatus(assetId, assetType, newStatus);
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
    if (!completedItemIds.includes(activeItem.asset_id)) {
      handleToggleComplete(activeItem.asset_id, activeItem.type);
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
  const completedCourseItems = flatSyllabusItems.filter(it => completedItemIds.includes(it.asset_id)).length;

  // Dynamic Continue Where You Left resolver
  const getContinueLearningTarget = () => {
    const firstUncompleted = flatSyllabusItems.find((it) => !completedItemIds.includes(it.asset_id));
    return firstUncompleted || (flatSyllabusItems.length > 0 ? flatSyllabusItems[0] : null);
  };

  const continueTarget = getContinueLearningTarget();
  const progressPercent = totalSyllabusItems > 0 ? Math.round((completedCourseItems / totalSyllabusItems) * 100) : 0;

  // Count progress for specific types
  const videoItems = flatSyllabusItems.filter((it) => it.type === "video");
  const completedVideos = videoItems.filter((it) => completedItemIds.includes(it.asset_id));

  const problemItems = flatSyllabusItems.filter((it) => it.type === "problem");
  const completedProblems = problemItems.filter((it) => completedItemIds.includes(it.asset_id));

  const articleItems = flatSyllabusItems.filter((it) => it.type === "article");
  const completedArticles = articleItems.filter((it) => completedItemIds.includes(it.asset_id));

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
                revisionItemIds={revisionItemIds}
                bookmarkedItemIds={bookmarkedItemIds}
                isLoggedIn={isLoggedIn}
                onSelectItem={handleSelectItem}
                onToggleComplete={handleToggleComplete}
                onCloseSidebar={() => handleToggleCourseSidebar(false)}
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
        
        {/* Unified Application Header configured to toggle Course Sidebar */}
        <div className="shrink-0 z-40 relative">
          <AppHeader 
            onToggleSidebar={() => handleToggleCourseSidebar()} 
            isSidebarOpen={isSidebarOpen} 
          />
        </div>

        {/* Central Focus Stage Wrapper */}
        <main className="flex-1 w-full max-w-5xl mx-auto p-4 sm:p-6 md:p-8 space-y-8 pb-20">
          
          {/* Dashboard Home - Rendered when activeItem is null */}
          {activeItem === null ? (
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="max-w-5xl mx-auto w-full space-y-8 select-none"
            >
              
              {/* Premium Dashboard Header Banner */}
              <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-gray-900 via-slate-800 to-slate-900 dark:from-black dark:via-gray-950 dark:to-zinc-900 border border-slate-800 p-8 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
                {/* Decorative blurred background circles for depth */}
                <div className="absolute top-0 left-1/4 w-72 h-72 bg-brand-500/10 rounded-full blur-3xl -translate-y-12" />
                <div className="absolute bottom-0 right-1/4 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl translate-y-12" />
                
                <div className="relative z-10 space-y-2">
                  <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-tight">
                    {firstName ? `Welcome back, ${firstName}! 👋` : "Welcome to your Classroom! 🚀"}
                  </h1>
                  <p className="text-slate-400 text-xs sm:text-sm font-medium max-w-xl leading-relaxed">
                    {progressPercent === 100 
                      ? "Congratulations! You have completed all lessons in this course. You are ready to crush your DSA interviews!"
                      : `You have completed ${progressPercent}% of the curriculum. Keep up the high momentum to build solid algorithmic foundations.`}
                  </p>
                </div>
                
                {/* Circular Progress Badge */}
                <div className="relative z-10 shrink-0 self-start md:self-auto flex items-center gap-4 bg-white/5 dark:bg-black/20 backdrop-blur-md border border-white/10 px-5 py-4 rounded-2xl">
                  <div className="relative h-14 w-14 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="28" cy="28" r="24" className="stroke-white/10" strokeWidth="4" fill="transparent" />
                      <circle cx="28" cy="28" r="24" className="stroke-brand-500 transition-all duration-1000 ease-out" strokeWidth="4" fill="transparent"
                        strokeDasharray={`${2 * Math.PI * 24}`}
                        strokeDashoffset={`${2 * Math.PI * 24 * (1 - progressPercent / 100)}`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="absolute text-xs font-black text-white">{progressPercent}%</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block leading-none">Course Completed</span>
                    <span className="text-sm font-black text-white mt-1 block">
                      {completedCourseItems} <span className="text-xs text-slate-400 font-medium">/ {totalSyllabusItems} lessons</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Two Column Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left/Main Column */}
                <div className="lg:col-span-2 space-y-8">
                  
                  {/* Premium Continue Learning Card */}
                  {continueTarget && (
                    <div className="group relative rounded-3xl bg-white dark:bg-gray-900 border border-gray-250/70 dark:border-gray-800 p-6 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between min-h-[200px]">
                      {/* Visual glowing border accent */}
                      <div className="absolute inset-px rounded-[22px] border border-transparent group-hover:border-brand-500/20 pointer-events-none transition-colors" />
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black text-brand-500 dark:text-brand-400 uppercase tracking-widest flex items-center gap-1.5">
                            {progressPercent === 100 ? (
                              <>
                                <Sparkles size={12} className="fill-yellow-500 stroke-yellow-500 text-yellow-500 animate-pulse" />
                                Course Fully Completed
                              </>
                            ) : progressPercent === 0 ? (
                              <>
                                <Rocket size={12} className="text-brand-500" />
                                Start Your Learning Journey
                              </>
                            ) : (
                              <>
                                <Zap size={12} className="fill-brand-500 stroke-brand-500 text-brand-500" />
                                Continue Where You Left Off
                              </>
                            )}
                          </span>
                          
                          {progressPercent !== 100 && (
                            <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider border ${
                              continueTarget.type === "video"
                                ? "bg-blue-500/5 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/20"
                                : continueTarget.type === "problem"
                                ? "bg-orange-500/5 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-500/20"
                                : "bg-purple-500/5 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-500/20"
                            }`}>
                              {continueTarget.type}
                            </span>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white tracking-tight leading-snug group-hover:text-brand-500 dark:group-hover:text-brand-400 transition-colors line-clamp-2">
                            {progressPercent === 100 
                              ? `Congratulations, ${firstName || "Explorer"}! 🎉` 
                              : progressPercent === 0
                              ? `Ready to start? Let's begin: ${continueTarget.title}`
                              : continueTarget.title
                            }
                          </h3>
                          <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 leading-relaxed">
                            {progressPercent === 100 
                              ? `You have successfully completed all ${totalSyllabusItems} items in this course! You've mastered these DSA patterns and are ready to ace your interviews.`
                              : progressPercent === 0
                              ? "Kick off your prep path by launching the first pattern lecture or challenge."
                              : `Resume your learning path. Next up: "${continueTarget.title}"`
                            }
                          </p>
                          {progressPercent !== 100 && (
                            <div className="flex items-center gap-4 text-xs text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider pt-1">
                              <span className="flex items-center gap-1">
                                <BookOpen size={12} className="text-brand-500" />
                                {continueTarget.duration_label} Remaining
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="mt-6 flex items-center gap-3">
                        <button
                          onClick={() => handleSelectItem(progressPercent === 100 ? flatSyllabusItems[0] : continueTarget)}
                          className="flex items-center justify-center gap-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold py-3 px-6 text-xs transition-all shadow-md shadow-brand-500/20 cursor-pointer active:scale-95 group-hover:scale-[1.02]"
                        >
                          {progressPercent === 100 ? (
                            <RotateCcw size={14} />
                          ) : continueTarget.type === "video" ? (
                            <PlayCircle size={14} />
                          ) : continueTarget.type === "problem" ? (
                            <Code2 size={14} />
                          ) : (
                            <FileText size={14} />
                          )}
                          <span>
                            {progressPercent === 100 
                              ? "Review from Beginning" 
                              : progressPercent === 0
                              ? "Start Lesson"
                              : "Resume Lesson"
                            }
                          </span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Dynamic Accordion Syllabus List */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-black text-gray-450 dark:text-gray-500 uppercase tracking-widest flex items-center gap-2">
                      <BookOpen size={14} className="text-brand-500" />
                      Full Course Syllabus
                    </h3>
                    
                    <div className="space-y-4">
                      {course.sections.map((section, sectionIndex) => {
                        const sectionItemsCount = getSectionItemsCount(section);
                        const sectionCompleted = getSectionCompletedCount(section, completedItemIds);
                        const sectionProgress = sectionItemsCount > 0 ? Math.round((sectionCompleted / sectionItemsCount) * 100) : 0;
                        
                        const isExpanded = dashboardExpandedSections[section.id] ?? (
                          continueTarget 
                            ? (section.items?.some(it => it.id === continueTarget.id) || section.subsections?.some(sub => sub.items.some(it => it.id === continueTarget.id)))
                            : (sectionIndex === 0)
                        );

                        return (
                          <div
                            key={section.id}
                            className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-250/70 dark:border-gray-800 shadow-sm overflow-hidden"
                          >
                            {/* Header */}
                            <button
                              onClick={() => {
                                setDashboardExpandedSections(prev => ({
                                  ...prev,
                                  [section.id]: !isExpanded
                                }));
                              }}
                              className="w-full p-5 text-left cursor-pointer select-none bg-transparent hover:bg-gray-50/50 dark:hover:bg-gray-800/10 transition-colors"
                            >
                              <div className="flex items-start justify-between gap-4">
                                <div className="space-y-1.5 flex-1">
                                  <h4 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white leading-snug group-hover:text-brand-500 dark:group-hover:text-brand-400 transition-colors">
                                    {section.title}
                                  </h4>
                                  
                                  <div className="flex items-center gap-3 text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider">
                                    <span>{sectionCompleted} / {sectionItemsCount} Completed</span>
                                    <span>•</span>
                                    <span>{sectionProgress}% Done</span>
                                  </div>
                                  
                                  {/* Horizontal miniature progress track */}
                                  <div className="h-1 w-32 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden mt-2">
                                    <div 
                                      className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
                                      style={{ width: `${sectionProgress}%` }}
                                    />
                                  </div>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                  <span className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                                    sectionCompleted === sectionItemsCount && sectionItemsCount > 0
                                      ? "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/15"
                                      : "text-brand-500 dark:text-brand-400 bg-brand-500/5 dark:bg-brand-500/10 border-brand-500/15"
                                  }`}>
                                    {sectionCompleted === sectionItemsCount && sectionItemsCount > 0 ? "Completed" : "In Progress"}
                                  </span>
                                  
                                  <div className="text-gray-400 dark:text-gray-500">
                                    <ChevronDown size={18} className={`transform transition-transform duration-250 ${isExpanded ? "rotate-180" : ""}`} />
                                  </div>
                                </div>
                              </div>
                            </button>
                            
                            {/* Accordion Content */}
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
                                  <div className="px-5 pb-5 border-t border-gray-100 dark:border-gray-800/60 pt-4 space-y-4">
                                    {section.description && (
                                      <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-medium pb-2 border-b border-gray-50 dark:border-gray-800/30">
                                        {section.description}
                                      </p>
                                    )}
                                                                 {/* Items list */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                                      {section.items?.map((item) => {
                                        const isCompleted = completedItemIds.includes(item.asset_id);
                                        const isRevision = revisionItemIds.includes(item.asset_id);
                                        const TypeIcon = item.type === "video" ? PlayCircle : item.type === "problem" ? Code2 : FileText;
                                        return (
                                          <button
                                            key={item.id}
                                            onClick={() => handleSelectItem(item)}
                                            className={`flex items-center justify-between p-3.5 rounded-xl border bg-gray-50/20 hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-all text-left cursor-pointer group ${
                                              isCompleted
                                                ? "border-emerald-250 dark:border-emerald-500/20 bg-emerald-50/5 dark:bg-emerald-500/5 shadow-[0_0_8px_rgba(16,185,129,0.04)]"
                                                : isRevision
                                                ? "border-amber-250 dark:border-amber-500/20 bg-amber-50/5 dark:bg-amber-500/5 shadow-[0_0_8px_rgba(245,158,11,0.04)]"
                                                : "border-gray-200 dark:border-gray-800/80"
                                            }`}
                                          >
                                            <span className="flex items-center gap-2 text-xs font-bold text-gray-600 dark:text-gray-300 group-hover:text-brand-500 dark:group-hover:text-brand-400 transition-colors truncate pr-2">
                                              <TypeIcon size={14} className={`shrink-0 ${
                                                isCompleted ? "text-emerald-500" : isRevision ? "text-amber-500" : "text-gray-400 dark:text-gray-500 group-hover:text-brand-500 dark:group-hover:text-brand-400"
                                              } transition-colors`} />
                                              <span className="truncate">{item.title}</span>
                                            </span>
                                            <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider shrink-0 border ${
                                              isCompleted
                                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/10"
                                                : isRevision
                                                ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/10"
                                                : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-555 border-gray-255 dark:border-gray-700"
                                            }`}>
                                              {isCompleted ? "Completed" : isRevision ? "Revision" : "Start"}
                                            </span>
                                          </button>
                                        );
                                      })}
                                    </div>
                                    
                                    {/* Subsection nested items */}
                                    {section.subsections?.map((sub) => (
                                      <div key={sub.id} className="space-y-2 pt-2 border-t border-gray-50 dark:border-gray-800/50">
                                        <span className="text-[9px] font-black text-gray-400 dark:text-gray-550 uppercase tracking-widest leading-none block">
                                          {sub.title}
                                        </span>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                          {sub.items.map((item) => {
                                            const isCompleted = completedItemIds.includes(item.asset_id);
                                            const isRevision = revisionItemIds.includes(item.asset_id);
                                            const TypeIcon = item.type === "video" ? PlayCircle : item.type === "problem" ? Code2 : FileText;
                                            return (
                                              <button
                                                key={item.id}
                                                onClick={() => handleSelectItem(item)}
                                                className={`flex items-center justify-between p-3.5 rounded-xl border bg-gray-50/20 hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-all text-left cursor-pointer group ${
                                                  isCompleted
                                                    ? "border-emerald-255 dark:border-emerald-500/20 bg-emerald-50/5 dark:bg-emerald-500/5 shadow-[0_0_8px_rgba(16,185,129,0.04)]"
                                                    : isRevision
                                                    ? "border-amber-255 dark:border-amber-500/20 bg-amber-50/5 dark:bg-amber-500/5 shadow-[0_0_8px_rgba(245,158,11,0.04)]"
                                                    : "border-gray-200 dark:border-gray-800/80"
                                                }`}
                                              >
                                                <span className="flex items-center gap-2 text-xs font-bold text-gray-600 dark:text-gray-300 group-hover:text-brand-500 dark:group-hover:text-brand-400 transition-colors truncate pr-2">
                                                  <TypeIcon size={14} className={`shrink-0 ${
                                                    isCompleted ? "text-emerald-500" : isRevision ? "text-amber-500" : "text-gray-400 dark:text-gray-500 group-hover:text-brand-500 dark:group-hover:text-brand-400"
                                                  } transition-colors`} />
                                                  <span className="truncate">{item.title}</span>
                                                </span>
                                                <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider shrink-0 border ${
                                                  isCompleted
                                                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/10"
                                                    : isRevision
                                                    ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/10"
                                                    : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-555 border-gray-255 dark:border-gray-700"
                                                }`}>
                                                  {isCompleted ? "Completed" : isRevision ? "Revision" : "Start"}
                                                </span>
                                              </button>
                                            );
                                          })}
                                        </div>
                                      </div>
                                    ))}
                                    
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>

                {/* Right/Sidebar Column */}
                <div className="space-y-6">
                  
                  {/* Overall Statistics Breakdown Card */}
                  <div className="rounded-3xl bg-white dark:bg-gray-900 border border-gray-250/70 dark:border-gray-800 p-6 space-y-6 shadow-sm">
                    <h4 className="text-xs font-black text-gray-450 dark:border-gray-800 uppercase tracking-widest">
                      Learning Statistics
                    </h4>
                    
                    <div className="space-y-4">
                      {/* Circular progress with metrics */}
                      <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-850 pb-4">
                        <span className="text-2xl font-black text-gray-950 dark:text-white">{progressPercent}%</span>
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/15">
                          {completedCourseItems} / {totalSyllabusItems} Completed
                        </span>
                      </div>
                      
                      {/* Sub metrics list */}
                      <div className="space-y-3.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-gray-500 dark:text-gray-400 flex items-center gap-2">
                            <PlayCircle size={14} className="text-blue-500" />
                            Videos Watched
                          </span>
                          <span className="text-xs font-black text-gray-800 dark:text-gray-200">
                            {completedVideos.length} / {videoItems.length}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-gray-500 dark:text-gray-400 flex items-center gap-2">
                            <Code2 size={14} className="text-orange-500" />
                            Problems Solved
                          </span>
                          <span className="text-xs font-black text-gray-800 dark:text-gray-200">
                            {completedProblems.length} / {problemItems.length}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-gray-500 dark:text-gray-400 flex items-center gap-2">
                            <FileText size={14} className="text-purple-500" />
                            Notes Read
                          </span>
                          <span className="text-xs font-black text-gray-800 dark:text-gray-200">
                            {completedArticles.length} / {articleItems.length}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Course Stats Widget */}
                  <div className="rounded-3xl bg-white dark:bg-gray-900 border border-gray-250/70 dark:border-gray-800 p-6 space-y-5 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-colors" />
                    
                    <h4 className="text-xs font-black text-gray-450 dark:text-gray-500 uppercase tracking-widest flex items-center gap-1.5 relative z-10">
                      <Activity size={14} className="text-blue-500" />
                      Course Stats
                    </h4>
                    
                    <div className="grid grid-cols-2 gap-3 relative z-10">
                      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 flex flex-col gap-1.5 items-center justify-center text-center">
                        <span className="text-2xl font-black text-gray-900 dark:text-white">{flatSyllabusItems.filter(i => i.type === "video").length}</span>
                        <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Video Lessons</span>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 flex flex-col gap-1.5 items-center justify-center text-center">
                        <span className="text-2xl font-black text-gray-900 dark:text-white">{flatSyllabusItems.filter(i => i.type === "problem").length}</span>
                        <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Coding Problems</span>
                      </div>
                    </div>
                  </div>

                  {/* Instructor Spotlight Card */}
                  {course.instructors && course.instructors.length > 0 && (
                    <div className="rounded-3xl bg-white dark:bg-gray-900 border border-gray-250/70 dark:border-gray-800 p-6 space-y-5 shadow-sm relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/5 rounded-full blur-2xl group-hover:bg-brand-500/10 transition-colors" />
                      
                      <h4 className="text-xs font-black text-gray-450 dark:text-gray-500 uppercase tracking-widest flex items-center gap-1.5 relative z-10">
                        <Award size={14} className="text-brand-500" />
                        Instructor Spotlight
                      </h4>
                      
                      <div className="space-y-4 relative z-10">
                        {course.instructors.map(instructor => (
                          <div key={instructor.id} className="flex items-center gap-4 bg-gray-50 dark:bg-gray-800/40 p-3 rounded-2xl border border-gray-100 dark:border-gray-800/60 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800/60 cursor-pointer">
                            {instructor.profile_image_url ? (
                              <img src={instructor.profile_image_url} alt={instructor.name} className="h-12 w-12 shrink-0 rounded-2xl object-cover shadow-sm border border-gray-200 dark:border-gray-700" />
                            ) : (
                              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-blue-500 text-white font-black text-sm shadow-sm">
                                {instructor.name.split(" ").map((w) => w[0]).join("").substring(0, 2)}
                              </div>
                            )}
                            <div className="space-y-1">
                              <h5 className="text-sm font-bold text-gray-900 dark:text-white leading-none">
                                {instructor.name}
                              </h5>
                              <p className="text-[10px] text-brand-600 dark:text-brand-400 font-bold uppercase tracking-wider">
                                {instructor.role} {instructor.company ? `@ ${instructor.company}` : ""}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>

              </div>

            </motion.div>
          ) : (
            <>
              {/* Main Visual Media Player Stage */}
              {resolvedAsset.loading ? (
                <div className="w-full aspect-video rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center p-8 space-y-4 animate-pulse">
                  <div className="h-10 w-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
                  <p className="text-xs font-bold text-gray-400 dark:text-gray-550 uppercase tracking-widest">Resolving library asset specifications...</p>
                </div>
              ) : resolvedAsset.error && !resolvedAsset.urlOrSlug ? (
                <div className="w-full aspect-video rounded-3xl bg-white dark:bg-gray-900 border border-red-500/10 flex flex-col items-center justify-center p-8 space-y-4 text-center">
                  <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center border border-red-500/10">
                    <AlertCircle size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-red-600">Failed to Resolve Asset</h4>
                    <p className="text-xs text-red-500/80 mt-1 font-semibold">Unable to fetch asset specifications from the database.</p>
                  </div>
                </div>
              ) : (
                <>
                  {activeItem?.type === "video" && (
                    <div className="flex flex-col gap-4">
{/* Video Action Bar */}
                      <div className="flex items-center justify-between bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-2xl p-4 shadow-sm z-20 relative">
                        <div className="flex items-center gap-3">
                          <StatusSelector
                            assetId={activeItem.asset_id}
                            assetType="video"
                            onStateChange={(state) => {
                              setItemStates((prev) => ({
                                ...prev,
                                [activeItem.asset_id]: {
                                  ...(prev[activeItem.asset_id] || {
                                    asset_id: activeItem.asset_id,
                                    asset_type: "video",
                                    is_bookmarked: false,
                                    notes: []
                                  }),
                                  status: state.status
                                } as any
                              }));
                            }}
                            disabledTitle="Log in to track progress"
                          />
                          <BookmarkButton
                            assetId={activeItem.asset_id}
                            assetType="video"
                            onStateChange={(state) => {
                              setItemStates((prev) => ({
                                ...prev,
                                [activeItem.asset_id]: {
                                  ...(prev[activeItem.asset_id] || {
                                    asset_id: activeItem.asset_id,
                                    asset_type: "video",
                                    status: "pending",
                                    notes: []
                                  }),
                                  is_bookmarked: state.is_bookmarked
                                } as any
                              }));
                            }}
                            disabledTitle="Log in to bookmark"
                          />
                        </div>
                        <div className="text-xs text-gray-400 font-bold tracking-wider uppercase">
                          {activeItem.title}
                        </div>
                      </div>
<div className="relative rounded-3xl overflow-hidden bg-gray-50 dark:bg-gray-800/10 p-0 sm:p-2 border border-gray-200 dark:border-gray-800/60 shadow-inner">
                      <VideoPlayer
                        url={resolvedAsset.urlOrSlug}
                        title={activeItem.title}
                        thumbnailUrl={resolvedAsset.data?.thumbnail_url || resolvedAsset.data?.thumbnailUrl}
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
                  </div>
                  )}
                  {activeItem?.type === "problem" && (
                    <ProblemViewer
                      slug={resolvedAsset.urlOrSlug}
                      problemData={resolvedAsset.data}
                      onStateChange={(updates) => {
                        setItemStates((prev) => ({
                          ...prev,
                          [activeItem.asset_id]: {
                            ...(prev[activeItem.asset_id] || {
                              asset_id: activeItem.asset_id,
                              asset_type: activeItem.type,
                              is_bookmarked: false,
                              status: "pending",
                              notes: []
                            }),
                            ...updates
                          } as any
                        }));
                      }}
                    />
                  )}
                  {activeItem?.type === "article" && (
                    <ArticleReader slug={resolvedAsset.urlOrSlug} articleData={resolvedAsset.data} />
                  )}
                </>
              )}

              {/* Actionable Bottom Study Tabs Panel - Exclusively for Video sessions */}
              {activeItem?.type === "video" && (
                <div className="space-y-6">
                  {resolvedAsset.loading ? (
                    <div className="w-full animate-pulse space-y-6">
                      <div className="h-[60px] w-full bg-gray-100 dark:bg-gray-800/60 rounded-2xl border border-gray-200 dark:border-gray-800" />
                      <div className="h-[300px] w-full bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800" />
                    </div>
                  ) : (
                  <>
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
                            {resolvedAsset.data?.description ? (
                              <ReadMoreHTML content={resolvedAsset.data.description} maxHeight={120} />
                            ) : (
                              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-medium">No description available for this lecture.</p>
                            )}
                          </div>

                          <div className="h-[1px] bg-gray-100 dark:bg-gray-800/80" />

                          {/* Instructor spotlight details */}
                          {resolvedAsset.data?.attributes?.instructor_id && instructorsList.find(i => i.id === resolvedAsset.data?.attributes?.instructor_id) && (() => {
                              const instructor = instructorsList.find(i => i.id === resolvedAsset.data?.attributes?.instructor_id);
                              return (
                                <div className="space-y-4">
                                  <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Instructor Spotlight</h4>
                                  <div className="flex items-center gap-4">
                                    {instructor.profile_image_url ? (
                                      <img src={instructor.profile_image_url} alt={instructor.name} className="h-12 w-12 shrink-0 rounded-2xl object-cover shadow-sm border border-gray-100 dark:border-gray-800" />
                                    ) : (
                                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-blue-500 text-white font-bold text-sm shadow-sm">
                                        {instructor.name.split(" ").map((w: string) => w[0]).join("").substring(0,2)}
                                      </div>
                                    )}
                                    <div className="space-y-0.5">
                                      <h5 className="text-sm font-bold text-gray-900 dark:text-white">{instructor.name}</h5>
                                      <p className="text-xs text-gray-500 font-medium">{instructor.role} {instructor.company ? `@ ${instructor.company}` : ""}</p>
                                    </div>
                                  </div>
                                </div>
                              );
                            })()}
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
                            courseId={courseSlug}
                            itemId={activeItem?.asset_id || activeItem?.id || "general"}
                            assetType={activeItem?.type}
                            onNotesChange={(newNotes) => {
                              if (activeItem) {
                                setItemStates((prev) => ({
                                  ...prev,
                                  [activeItem.asset_id]: {
                                    ...(prev[activeItem.asset_id] || {
                                      asset_id: activeItem.asset_id,
                                      asset_type: activeItem.type,
                                      status: "pending",
                                      is_bookmarked: false
                                    }),
                                    notes: newNotes
                                  } as any
                                }));
                              }
                            }}
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
                            courseId={courseSlug}
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
                           <ResourcesTab itemId={activeItem?.id || "general"} backendResources={resolvedAsset.data?.resources} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  </>
                  )}
                </div>
              )}
            </>
          )}

        </main>
      </div>

      {/* Progress Loading Toast */}
      <AnimatePresence>
        {isProgressLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 md:left-auto md:-translate-x-0 md:right-6 z-[100] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl p-4 flex items-center gap-4 min-w-[280px]"
          >
            <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-brand-500/10">
              <div className="absolute h-full w-full rounded-full border-[3px] border-brand-500/30" />
              <div className="absolute h-full w-full rounded-full border-[3px] border-brand-500 border-t-transparent animate-spin" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900 dark:text-white">Syncing Progress</h4>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Loading your course data...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
