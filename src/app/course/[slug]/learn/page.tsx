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
  Rocket,
  Lock,
  ExternalLink,
  ArrowRight
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
import { fetchCourseDetail, fetchCourseCurriculum, fetchInstructors } from "@/api/courses";
import { fetchDifficultyCounts } from "@/api/problems";
import CourseDashboardView from "@/components/learning/CourseDashboardView";
import ReadMoreHTML from "@/components/common/ReadMoreHTML";
import { getAuthHeaders } from "@/functions/auth";

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
  category?: string;
  description: string;
  instructors: Instructor[];
  sections: CourseSection[];
}

export default function LearnPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawCourseSlug = params?.slug as string;
  const courseSlug = rawCourseSlug === "data-structures-algorithms-mastery-program" ? "dsa" : rawCourseSlug;

  const { user, isLoggedIn, isPro, isLoading: isAuthLoading } = useAuth();
  const firstName = user?.full_name ? user.full_name.split(" ")[0] : "";

  const [course, setCourse] = useState<CourseDetail | null>(null);

  // Access checking
  const isEnrolled = Boolean(
    isLoggedIn && (
      user?.roles?.includes("admin") ||
      user?.is_pro_active ||
      isPro ||
      user?.enrolled_courses?.some((c: any) => c.course_id === courseSlug || c.course_id === course?.id || c.course_name === courseSlug) ||
      user?.pro_courses?.some((c: any) => c.course_id === courseSlug || c.course_id === course?.id || c.course_name === courseSlug) ||
      user?.purchased_courses?.some((c: any) => c.course_id === courseSlug || c.course_id === course?.id || c.course_name === courseSlug)
    )
  );

  // Immediate redirect if not enrolled (DO NOT fetch course or classroom data for non-enrolled users)
  useEffect(() => {
    if (isAuthLoading) return;

    if (!isEnrolled && courseSlug) {
      const targetSlug = course?.slug || courseSlug;
      router.replace(`/course/${targetSlug}`);
    }
  }, [isAuthLoading, isEnrolled, courseSlug, course?.slug, router]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [instructorsList, setInstructorsList] = useState<any[]>([]);
  const [practiceProblemsCount, setPracticeProblemsCount] = useState<number>(1000);

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
      
      const [courseData, curriculumData, instructorsData] = await Promise.all([
        fetchCourseDetail(courseSlug),
        fetchCourseCurriculum(courseSlug),
        fetchInstructors()
      ]);
      
      if (instructorsData?.items) {
        setInstructorsList(instructorsData.items);
      }
      
      // Map instructor IDs to objects
      const matchedInstructors = (instructorsData?.items || []).filter((i: any) => 
        (courseData.instructor_ids || []).includes(i.id)
      );

      const finalInstructors = matchedInstructors.length > 0
        ? matchedInstructors
        : (courseData.instructors && courseData.instructors.length > 0)
        ? courseData.instructors.map((ins: any) => {
            const found = (instructorsData?.items || []).find((i: any) => i.name === ins.name);
            return found || ins;
          })
        : (instructorsData?.items || []);

      setCourse({
        id: courseData.id,
        slug: courseData.slug,
        title: courseData.title,
        category: (courseData as any).category || "DSA COURSE",
        description: courseData.description,
        instructors: finalInstructors,
        sections: curriculumData || [],
      });

      // Also fetch dynamic practice problems count
      try {
        const diffCounts = await fetchDifficultyCounts();
        if (diffCounts?.total) {
          setPracticeProblemsCount(diffCounts.total);
        }
      } catch {}

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
          setActiveItem(null); // Load Classroom Dashboard by default
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
    if (isAuthLoading) return;
    if (!isEnrolled) return;
    if (courseSlug) {
      fetchCourseDetails();
    }
  }, [isAuthLoading, isEnrolled, courseSlug]);

  // Resolve asset UUIDs dynamically to their URL or Slug
  useEffect(() => {
    if (!activeItem || !isEnrolled) {
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

    // It's either a UUID, or it's a slug for a problem/article
    let active = true;
    const resolveUuid = async () => {
      setResolvedAsset({ urlOrSlug: "", loading: true, error: false, data: undefined });
      try {
        const backendUrl = BACKEND_URL;
        let endpoint = "";
        if (type === "video") {
          endpoint = `/api/v1/video-lectures/${assetId}?item_id=${activeItem.id}&course_slug=${courseSlug}`;
        } else if (type === "problem") {
          endpoint = `/api/v1/practice-problems/${assetId}`;
        } else if (type === "article") {
          endpoint = `/api/v1/articles/${assetId}`;
        }

        const authHeaders = await getAuthHeaders();
        const res = await fetch(`${backendUrl}${endpoint}`, {
          headers: authHeaders,
        });
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
    if (isLoggedIn && isEnrolled) {
      loadUserAssetStates();
    } else {
      setItemStates({});
    }
  }, [isLoggedIn, isEnrolled, courseSlug]);

  // Update item progress status in DB
  const handleUpdateStatus = async (assetId: string, assetType: string, newStatus: "pending" | "done" | "revision") => {
    if (!isLoggedIn) return;

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

    if (!completedItemIds.includes(activeItem.id)) {
      handleToggleComplete(activeItem.id, activeItem.type);
    }

    const flatItems = getFlattenedItems(course.sections);
    const currentIndex = flatItems.findIndex((it) => it.id === activeItem.id);

    if (currentIndex !== -1 && currentIndex < flatItems.length - 1) {
      setUpNextItem(flatItems[currentIndex + 1]);
      setUpNextCountdown(5);
    }
  };

  const canAccessActiveItem = isEnrolled || (activeItem && activeItem.is_free);

  if (isAuthLoading || !isEnrolled || loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-950 space-y-4">
        <div className="h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-bold text-gray-500 dark:text-gray-400">
          {!isEnrolled && !isAuthLoading
            ? "Redirecting to course details..."
            : "Loading your customized classroom workspace..."}
        </p>
      </div>
    );
  }

  // If a paid item is chosen and the user doesn't have enrollment access
  if (activeItem && !canAccessActiveItem) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-[#0B0F19] px-6 select-none font-sans">
        <div className="max-w-md w-full text-center py-10 px-8 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl shadow-lg">
          <div className="flex w-14 h-14 mx-auto items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/15 mb-5 animate-pulse">
            <Lock size={26} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Lecture Locked</h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
            &ldquo;{activeItem.title}&rdquo; is exclusively available to enrolled students. Enroll now to access all lectures, problem solutions, and live weekly doubt sessions.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href={`/course/${courseSlug}`}
              className="inline-flex items-center justify-center gap-1.5 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/15 transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Enroll in Course</span>
            </Link>
            <button
              onClick={() => setActiveItem(null)}
              className="inline-flex items-center justify-center gap-1.5 px-5 py-3 rounded-xl border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 text-xs font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>View Syllabus</span>
            </button>
          </div>
        </div>
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
            We experienced an issue loading the course curriculum. Please verify the course slug and try again.
          </p>
          <div className="mt-6 flex gap-3 justify-center">
            <button 
              onClick={fetchCourseDetails}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/15"
            >
              <RotateCcw size={14} />
              <span>Retry</span>
            </button>
            <Link
              href={`/course/${courseSlug}`}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-xs font-bold"
            >
              <span>Course Details</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const flatSyllabusItems = getFlattenedItems(course.sections);
  const totalSyllabusItems = flatSyllabusItems.length;
  const completedCourseItems = flatSyllabusItems.filter(it => completedItemIds.includes(it.id)).length;

  const getContinueLearningTarget = () => {
    const firstUncompleted = flatSyllabusItems.find((it) => !completedItemIds.includes(it.id));
    return firstUncompleted || (flatSyllabusItems.length > 0 ? flatSyllabusItems[0] : null);
  };

  const continueTarget = getContinueLearningTarget();
  const progressPercent = totalSyllabusItems > 0 ? Math.round((completedCourseItems / totalSyllabusItems) * 100) : 0;

  const videoItems = flatSyllabusItems.filter((it) => it.type === "video");
  const completedVideos = videoItems.filter((it) => completedItemIds.includes(it.id));

  const problemItems = flatSyllabusItems.filter((it) => it.type === "problem");
  const completedProblems = problemItems.filter((it) => completedItemIds.includes(it.id));

  const articleItems = flatSyllabusItems.filter((it) => it.type === "article");
  const completedArticles = articleItems.filter((it) => completedItemIds.includes(it.id));

  return (
    <div className="h-screen w-screen flex bg-gray-50 dark:bg-[#070B14] text-gray-900 dark:text-gray-100 overflow-hidden font-sans">
      
      {/* Immersive Left Sidebar: Syllabus & Navigation Drawer */}
      <AnimatePresence initial={false}>
        {isSidebarOpen && activeItem !== null && (
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
                href={`/course/${courseSlug}`}
                className="inline-flex items-center gap-2 text-[10px] font-bold text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors uppercase tracking-wider"
              >
                <ArrowLeft size={13} />
                <span>Back to Course Page</span>
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
                    ? "bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 shadow-xs"
                    : "bg-gray-50 hover:bg-gray-100 dark:bg-gray-800/60 dark:hover:bg-gray-800 border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400"
                }`}
              >
                <Activity size={14} className="shrink-0 stroke-[2.5] text-blue-600 dark:text-blue-400" />
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
        className="flex-1 h-full overflow-y-auto flex flex-col custom-scrollbar bg-gray-50 dark:bg-[#070B14]"
      >
        
        {/* Unified Application Header configured to toggle Course Sidebar */}
        <div className="shrink-0 z-40 relative">
          <AppHeader 
            onToggleSidebar={() => handleToggleCourseSidebar()} 
            isSidebarOpen={isSidebarOpen && activeItem !== null} 
          />
        </div>

        {/* Free Preview Banner if user is not enrolled but watching free lesson */}
        {!isEnrolled && (
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2.5 text-xs font-semibold flex items-center justify-between gap-4 shadow-sm z-30">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 shrink-0" />
              <span>
                {activeItem?.is_free 
                  ? "You are watching a Free Preview lesson. Enroll to get complete lifetime access to all 200+ lessons, problem sets, and live weekly classes."
                  : "Previewing Course Syllabus. Enroll to access all video lectures and live mentorship."}
              </span>
            </div>
            <Link
              href={`/course/${courseSlug}`}
              className="shrink-0 rounded-lg bg-white px-3 py-1 text-xs font-bold text-blue-700 hover:bg-blue-50 transition-colors"
            >
              Enroll Now
            </Link>
          </div>
        )}

        {/* Central Focus Stage Wrapper */}
        <main className={`flex-1 w-full ${activeItem === null ? "max-w-7xl px-4 sm:px-6 lg:px-8 py-8" : "max-w-5xl p-4 sm:p-6 md:p-8"} mx-auto space-y-8 pb-20`}>
          
          {/* Dashboard Home - Rendered when activeItem is null */}
          {activeItem === null ? (
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="w-full"
            >
              <CourseDashboardView
                course={course}
                courseSlug={courseSlug}
                flatSyllabusItems={flatSyllabusItems}
                completedItemIds={completedItemIds}
                revisionItemIds={revisionItemIds}
                continueTarget={continueTarget}
                onSelectItem={handleSelectItem}
                instructor={course.instructors && course.instructors.length > 0 ? course.instructors[0] : (instructorsList.length > 0 ? instructorsList[0] : null)}
                practiceProblemsCount={practiceProblemsCount}
              />
            </motion.div>
          ) : (
            <>
              {/* Main Visual Media Player Stage */}
              {resolvedAsset.loading ? (
                <div className="w-full aspect-video rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center p-8 space-y-4 animate-pulse">
                  <div className="h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Loading lesson content...</p>
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
                      <div className="flex items-center justify-between bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 shadow-xs z-20 relative">
                        <div className="flex items-center gap-3">
                          <StatusSelector
                            assetId={activeItem.id}
                            assetType={activeItem.type}
                            onStateChange={(state) => {
                              setItemStates((prev) => ({
                                ...prev,
                                [activeItem.id]: {
                                  ...(prev[activeItem.id] || {
                                    asset_id: activeItem.id,
                                    asset_type: activeItem.type,
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
                            assetId={activeItem.id}
                            assetType={activeItem.type}
                            onStateChange={(state) => {
                              setItemStates((prev) => ({
                                ...prev,
                                [activeItem.id]: {
                                  ...(prev[activeItem.id] || {
                                    asset_id: activeItem.id,
                                    asset_type: activeItem.type,
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
                        <div className="text-xs text-gray-500 dark:text-gray-400 font-bold tracking-wider uppercase truncate max-w-md text-right">
                          {activeItem.title}
                        </div>
                      </div>

                      <div className="relative rounded-3xl overflow-hidden bg-gray-50 dark:bg-gray-800/10 p-0 sm:p-2 border border-gray-200 dark:border-gray-800 shadow-inner">
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
                                  <span className="text-[10px] font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-widest">Up Next in {upNextCountdown}s</span>
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
                                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-[11px] font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors"
                                  >
                                    <PlayCircle size={12} />
                                    Play Now
                                  </button>
                                </div>
                              </div>
                              <div className="h-1 bg-gray-100 dark:bg-gray-800 w-full">
                                <div 
                                  className="h-full bg-blue-600 transition-all duration-1000 ease-linear"
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
                          [activeItem.id]: {
                            ...(prev[activeItem.id] || {
                              asset_id: activeItem.id,
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
                    <div className="flex flex-col gap-5">
                      {/* Article Action Bar */}
                      <div className="flex items-center justify-between bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 shadow-xs z-20 relative">
                        <div className="flex items-center gap-3">
                          <StatusSelector
                            assetId={activeItem.id}
                            assetType={activeItem.type}
                            onStateChange={(state) => {
                              setItemStates((prev) => ({
                                ...prev,
                                [activeItem.id]: {
                                  ...(prev[activeItem.id] || {
                                    asset_id: activeItem.id,
                                    asset_type: activeItem.type,
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
                            assetId={activeItem.id}
                            assetType={activeItem.type}
                            onStateChange={(state) => {
                              setItemStates((prev) => ({
                                ...prev,
                                [activeItem.id]: {
                                  ...(prev[activeItem.id] || {
                                    asset_id: activeItem.id,
                                    asset_type: activeItem.type,
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
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border border-purple-200/60 dark:border-purple-800/60">
                            <FileText size={12} />
                            <span>Reading Module</span>
                          </span>
                          {activeItem.duration_label && (
                            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium hidden sm:inline">
                              · {activeItem.duration_label}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Main Article Content */}
                      <ArticleReader slug={resolvedAsset.urlOrSlug} articleData={resolvedAsset.data} />

                      {/* Bottom Completion & Next Lesson Navigation */}
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xs">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                            completedItemIds.includes(activeItem.id)
                              ? "bg-emerald-500/10 text-emerald-500"
                              : "bg-purple-500/10 text-purple-500"
                          }`}>
                            {completedItemIds.includes(activeItem.id) ? (
                              <CheckCircle2 size={20} />
                            ) : (
                              <BookOpen size={20} />
                            )}
                          </div>
                          <div>
                            <h4 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">
                              {completedItemIds.includes(activeItem.id) ? "Article Completed" : "Finished reading this module?"}
                            </h4>
                            <p className="text-[11px] text-gray-500 dark:text-gray-400">
                              {completedItemIds.includes(activeItem.id)
                                ? "Your progress has been recorded."
                                : "Mark as completed to update your course progress."}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          {!completedItemIds.includes(activeItem.id) && (
                            <button
                              onClick={() => handleToggleComplete(activeItem.id, activeItem.type)}
                              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
                            >
                              <CheckCircle2 size={14} />
                              <span>Mark as Completed</span>
                            </button>
                          )}

                          {(() => {
                            if (!course) return null;
                            const flatItems = getFlattenedItems(course.sections);
                            const currentIndex = flatItems.findIndex((it) => it.id === activeItem.id);
                            const next = currentIndex !== -1 && currentIndex < flatItems.length - 1 ? flatItems[currentIndex + 1] : null;
                            if (!next) return null;

                            return (
                              <button
                                onClick={() => {
                                  if (!completedItemIds.includes(activeItem.id)) {
                                    handleToggleComplete(activeItem.id, activeItem.type);
                                  }
                                  handleSelectItem(next);
                                }}
                                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm cursor-pointer active:scale-95"
                              >
                                <span>Next Lesson</span>
                                <ArrowRight size={14} />
                              </button>
                            );
                          })()}
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Bottom Study Tabs Panel for Video sessions */}
              {activeItem?.type === "video" && (
                <div className="space-y-6">
                  {resolvedAsset.loading ? (
                    <div className="w-full animate-pulse space-y-6">
                      <div className="h-[60px] w-full bg-gray-100 dark:bg-gray-800/60 rounded-2xl border border-gray-200 dark:border-gray-800" />
                      <div className="h-[300px] w-full bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800" />
                    </div>
                  ) : (
                    <>
                      <div className="flex bg-gray-50/50 dark:bg-gray-900/40 p-1.5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xs shrink-0 relative">
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
                                  className="absolute inset-0 bg-blue-600 rounded-xl shadow-xs"
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
                      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 sm:p-7 min-h-[250px] shadow-xs">
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
                                          <img src={instructor.profile_image_url} alt={instructor.name} className="h-12 w-12 shrink-0 rounded-2xl object-cover shadow-xs border border-gray-100 dark:border-gray-800" />
                                        ) : (
                                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold text-sm shadow-xs">
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
                                itemId={activeItem?.id || "general"}
                                assetType={activeItem?.type}
                                onNotesChange={(newNotes) => {
                                  if (activeItem) {
                                    setItemStates((prev) => ({
                                      ...prev,
                                      [activeItem.id]: {
                                        ...(prev[activeItem.id] || {
                                          asset_id: activeItem.id,
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
            <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-blue-600/10">
              <div className="absolute h-full w-full rounded-full border-[3px] border-blue-600/30" />
              <div className="absolute h-full w-full rounded-full border-[3px] border-blue-600 border-t-transparent animate-spin" />
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
