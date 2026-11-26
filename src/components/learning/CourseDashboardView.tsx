"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Play,
  PlayCircle,
  Code2,
  FileText,
  Award,
  ChevronDown,
  CheckCircle2,
  Circle,
  Radio,
  Users,
  BadgeCheck,
  Clock,
  ArrowRight,
  BookOpen,
  RotateCcw,
  Lock,
  ExternalLink,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CourseSection, CourseSectionItem } from "@/components/learning/CourseSidebar";

interface Instructor {
  id?: string;
  name: string;
  role: string;
  company?: string;
  sub_title?: string;
  bio?: string;
  profile_image_url?: string;
  metadata?: {
    Github?: string;
    Youtube?: string;
    Linkedin?: string;
    [key: string]: unknown;
  } | null;
}

interface CourseDetail {
  id: string;
  slug: string;
  title: string;
  category?: string;
  description?: string;
  instructors: Instructor[];
  sections: CourseSection[];
}

interface CourseDashboardViewProps {
  course: CourseDetail;
  courseSlug: string;
  flatSyllabusItems: CourseSectionItem[];
  completedItemIds: string[];
  revisionItemIds: string[];
  continueTarget: CourseSectionItem | null;
  onSelectItem: (item: CourseSectionItem) => void;
  instructor?: Instructor | null;
  practiceProblemsCount?: number;
}

// Duration helper to parse strings like "15 mins" or "1h 20m"
function parseDurationMinutes(label?: string): number {
  if (!label) return 0;
  const lower = label.toLowerCase();
  let mins = 0;
  const hourMatch = lower.match(/(\d+)\s*h/);
  if (hourMatch) mins += parseInt(hourMatch[1], 10) * 60;
  const minMatch = lower.match(/(\d+)\s*m/);
  if (minMatch) mins += parseInt(minMatch[1], 10);
  return mins;
}

function formatMinutes(totalMins: number): string {
  if (totalMins <= 0) return "0 mins";
  const h = Math.floor(totalMins / 60);
  const m = totalMins % 60;
  if (h > 0 && m > 0) return `${h}h ${m}m`;
  if (h > 0) return `${h}h`;
  return `${m} mins`;
}

// Strips HTML tags for clean text preview
function stripHtml(html?: string): string {
  if (!html) return "";
  return html.replace(/<[^>]*>?/gm, " ").replace(/\s+/g, " ").trim();
}

const accordionVariants = {
  collapsed: {
    height: 0,
    opacity: 0,
    transition: {
      height: { duration: 0.3, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] },
      opacity: { duration: 0.2 },
    },
  },
  expanded: {
    height: "auto",
    opacity: 1,
    transition: {
      height: { duration: 0.35, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] },
      opacity: { duration: 0.25, delay: 0.05 },
    },
  },
};

export default function CourseDashboardView({
  course,
  courseSlug,
  flatSyllabusItems,
  completedItemIds,
  revisionItemIds,
  continueTarget,
  onSelectItem,
  instructor,
  practiceProblemsCount,
}: CourseDashboardViewProps) {
  // Accordion open/close state
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    if (continueTarget) {
      const found = course.sections.find(
        (s) =>
          s.items?.some((it) => it.id === continueTarget.id) ||
          s.subsections?.some((sub) => sub.items.some((it) => it.id === continueTarget.id))
      );
      if (found) initial[found.id] = true;
    }
    if (Object.keys(initial).length === 0 && course.sections.length > 0) {
      initial[course.sections[0].id] = true;
    }
    return initial;
  });

  const allExpanded = useMemo(() => {
    return course.sections.length > 0 && course.sections.every((s) => expandedSections[s.id]);
  }, [course.sections, expandedSections]);

  const handleToggleExpandAll = () => {
    if (allExpanded) {
      setExpandedSections({});
    } else {
      const all: Record<string, boolean> = {};
      course.sections.forEach((s) => {
        all[s.id] = true;
      });
      setExpandedSections(all);
    }
  };

  const handleToggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  // Metrics derived strictly from API data
  const totalLessons = flatSyllabusItems.length;
  const completedLessons = flatSyllabusItems.filter((it) => completedItemIds.includes(it.id)).length;
  const progressPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  const videoItems = flatSyllabusItems.filter((it) => it.type === "video");
  const completedVideos = videoItems.filter((it) => completedItemIds.includes(it.id));

  const problemItems = flatSyllabusItems.filter((it) => it.type === "problem");
  const completedProblems = problemItems.filter((it) => completedItemIds.includes(it.id));

  const articleItems = flatSyllabusItems.filter((it) => it.type === "article");
  const completedArticles = articleItems.filter((it) => completedItemIds.includes(it.id));

  // Count fully completed sections/modules
  const completedModulesCount = course.sections.filter((s) => {
    const items = [...(s.items || []), ...(s.subsections?.flatMap((sub) => sub.items) || [])];
    return items.length > 0 && items.every((it) => completedItemIds.includes(it.id));
  }).length;

  // Time spent calculated strictly from completed videos duration
  const totalCompletedMinutes = completedVideos.reduce((acc, v) => acc + parseDurationMinutes(v.duration_label), 0);
  const timeSpentString = totalCompletedMinutes > 0 ? formatMinutes(totalCompletedMinutes) : "0 mins";

  // Identify continueTarget section
  const continueTargetSection = course.sections.find(
    (s) =>
      s.items?.some((it) => it.id === continueTarget?.id) ||
      s.subsections?.some((sub) => sub.items.some((it) => it.id === continueTarget?.id))
  );

  const sectionProblems = continueTargetSection?.items?.filter((i) => i.type === "problem") || [];
  const sectionSolvedProblems = sectionProblems.filter((i) => completedItemIds.includes(i.id));

  // Certificate logic: unlocked at 75%+
  const isCertificateUnlocked = progressPercent >= 75;

  // Split title for styling
  const titleParts = course.title.trim().split(" ");
  const mainTitlePrefix = titleParts.slice(0, -1).join(" ");
  const mainTitleSuffix = titleParts.slice(-1)[0] || "";

  // Clean description
  const cleanDescription =
    stripHtml(course.description) ||
    "A complete DSA course from basics to advanced, with structured theory videos, practice problems, contest questions, and real interview insights.";

  // Instructor strictly from API
  const activeInstructor =
    instructor ||
    (course.instructors && course.instructors.length > 0 ? course.instructors[0] : null);

  return (
    <div className="w-full space-y-8 select-none">
      {/* 1. Back link */}
      <div>
        <Link
          href={`/course/${courseSlug}`}
          className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to Course</span>
        </Link>
      </div>

      {/* 2. Hero Header Banner */}
      <div className="relative rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/90 dark:border-gray-800 p-6 sm:p-8 lg:p-10 shadow-xs overflow-hidden">
        {/* Soft Ambient Background Glows */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/10 dark:bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 left-1/3 w-80 h-80 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          {/* Left Text & Stats */}
          <div className="space-y-4 max-w-2xl">
            {/* Category Pill */}
            <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/80 dark:border-blue-800/80">
              {course.category || "DSA COURSE"}
            </span>

            {/* Course Title with Highlighted Keyword */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">
              {mainTitlePrefix ? (
                <>
                  {mainTitlePrefix} <span className="text-blue-600 dark:text-blue-400">{mainTitleSuffix}</span>
                </>
              ) : (
                <span className="text-blue-600 dark:text-blue-400">{course.title}</span>
              )}
            </h1>

            {/* Clean Subtitle */}
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-medium line-clamp-3">
              {cleanDescription}
            </p>

            {/* 4 Feature Badges Row - Strictly Real Data from API */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {/* Badge 1: Real Video Lessons */}
              <div className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-gray-50/80 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800">
                <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                  <PlayCircle size={16} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-black text-gray-900 dark:text-white truncate">
                    {videoItems.length > 0 ? `${videoItems.length}` : "Video"}
                  </p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium truncate">Video Lessons</p>
                </div>
              </div>

              {/* Badge 2: Real Problems or Practice Hub */}
              <Link
                href="/practice"
                className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-gray-50/80 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 hover:border-emerald-500/30 transition-colors"
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <Code2 size={16} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-black text-gray-900 dark:text-white truncate">
                    {problemItems.length > 0
                      ? `${problemItems.length}`
                      : practiceProblemsCount
                      ? `${practiceProblemsCount}`
                      : "Top Curated"}
                  </p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium truncate">
                    {problemItems.length > 0 ? "Course Problems" : "DSA Practice"}
                  </p>
                </div>
              </Link>

              {/* Badge 3: Course Notes & PDFs on Request */}
              <a
                href={`https://wa.me/919956217210?text=${encodeURIComponent(
                  `Hi CrackDSA team, please share the course notes and PDFs for ${course.title}.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-gray-50/80 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 hover:border-purple-500/30 transition-colors"
              >
                <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                  <FileText size={16} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-black text-gray-900 dark:text-white truncate">
                    {articleItems.length > 0 ? `${articleItems.length}` : "Interview"}
                  </p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium truncate">Notes & PDFs</p>
                </div>
              </a>

              {/* Badge 4: Live Weekly Classes */}
              <Link
                href="/live-classes"
                className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-gray-50/80 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 hover:border-amber-500/30 transition-colors"
              >
                <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                  <Award size={16} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-black text-gray-900 dark:text-white truncate">Weekly</p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium truncate">Live Mentorship</p>
                </div>
              </Link>
            </div>
          </div>

          {/* Right Decorative Floating Illustration */}
          <div className="hidden lg:flex items-center justify-center relative w-72 h-56 shrink-0">
            {/* Subtle Node Graph Lines */}
            <svg className="absolute inset-0 w-full h-full text-blue-200 dark:text-blue-900/40" fill="none">
              <path
                d="M 60 70 Q 140 30 200 90 T 230 160"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="4 4"
              />
              <circle cx="60" cy="70" r="4" className="fill-blue-400" />
              <circle cx="200" cy="90" r="4" className="fill-blue-400" />
              <circle cx="230" cy="160" r="4" className="fill-blue-500" />
            </svg>

            {/* Floating Top Card */}
            <div className="absolute top-2 left-6 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-2xl p-4 shadow-lg shadow-blue-500/20 transform -rotate-3 hover:rotate-0 transition-transform">
              <Code2 size={24} className="stroke-[2.5]" />
            </div>

            {/* Floating Center Card */}
            <div className="absolute top-12 right-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 shadow-md transform rotate-6 hover:rotate-0 transition-transform">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <Users size={20} />
              </div>
            </div>

            {/* Floating Bottom Card */}
            <div className="absolute bottom-4 left-14 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-2.5 shadow-md flex items-center gap-2 transform -rotate-2">
              <span className="text-[18px] font-mono font-bold text-blue-600 dark:text-blue-400">{`{ }`}</span>
              <span className="text-[11px] font-extrabold text-gray-700 dark:text-gray-300">Clean Code</span>
            </div>

            {/* Floating Pill Tag */}
            <div className="absolute -top-1 right-2 text-right">
              <span className="text-[11px] font-extrabold text-blue-600 dark:text-blue-400 tracking-wider">
                Learn • Practice • Solve ↗
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (8 cols): Continue Learning + Course Curriculum */}
        <div className="lg:col-span-8 space-y-8">
          {/* Continue Learning Card */}
          {continueTarget && (
            <div className="rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 sm:p-7 shadow-xs overflow-hidden flex flex-col md:flex-row items-stretch justify-between gap-6">
              <div className="flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  {/* Badge & Label */}
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs">
                      <Play size={12} className="fill-white translate-x-0.5" />
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">
                      {progressPercent === 100
                        ? "Course Completed"
                        : progressPercent === 0
                        ? "Start Learning"
                        : "Continue Learning"}
                    </span>
                  </div>

                  {/* Lesson Title */}
                  <h2 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white tracking-tight leading-snug">
                    {progressPercent === 100 ? `Course Fully Completed! 🎉` : continueTarget.title}
                  </h2>

                  {/* Subtitle / Next up */}
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                    {progressPercent === 100
                      ? "Congratulations! You have completed all lessons in this curriculum. You are ready to crack interviews!"
                      : continueTargetSection
                      ? `Resume your learning path in "${continueTargetSection.title}". Next up: "${continueTarget.title}"`
                      : `Resume your learning path. Next up: "${continueTarget.title}"`}
                  </p>

                  {/* Real Tags Row - No mock numbers */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/60">
                      <PlayCircle size={12} />
                      {continueTarget.type === "video"
                        ? "Video Lesson"
                        : continueTarget.type === "problem"
                        ? "Problem"
                        : "Article"}
                    </span>

                    {continueTarget.duration_label && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                        <Clock size={12} />
                        {continueTarget.duration_label}
                      </span>
                    )}

                    {sectionProblems.length > 0 && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                        <Code2 size={12} />
                        Practice ({sectionSolvedProblems.length}/{sectionProblems.length})
                      </span>
                    )}
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => onSelectItem(continueTarget)}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-5 text-xs sm:text-sm shadow-md shadow-blue-500/20 transition-all cursor-pointer active:scale-95"
                  >
                    {progressPercent === 100 ? (
                      <>
                        <RotateCcw size={14} />
                        <span>Review from Start</span>
                      </>
                    ) : (
                      <>
                        <Play size={13} className="fill-white" />
                        <span>Resume Lesson</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => onSelectItem(continueTarget)}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold py-2.5 px-4 text-xs sm:text-sm transition-all cursor-pointer"
                  >
                    <span>View Lesson Details</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>

              {/* Video Thumbnail Preview */}
              <div
                onClick={() => onSelectItem(continueTarget)}
                className="relative w-full md:w-64 h-40 md:h-auto min-h-[140px] rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 border border-slate-700/60 flex items-center justify-center group cursor-pointer shrink-0 shadow-inner"
              >
                {/* Algorithmic tree subtle graphic */}
                <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" viewBox="0 0 200 120">
                  <circle cx="100" cy="25" r="8" fill="#60A5FA" />
                  <circle cx="60" cy="65" r="7" fill="#60A5FA" />
                  <circle cx="140" cy="65" r="7" fill="#60A5FA" />
                  <circle cx="40" cy="100" r="6" fill="#60A5FA" />
                  <circle cx="80" cy="100" r="6" fill="#60A5FA" />
                  <circle cx="120" cy="100" r="6" fill="#60A5FA" />
                  <circle cx="160" cy="100" r="6" fill="#60A5FA" />
                  <line x1="100" y1="25" x2="60" y2="65" stroke="#93C5FD" strokeWidth="2" />
                  <line x1="100" y1="25" x2="140" y2="65" stroke="#93C5FD" strokeWidth="2" />
                  <line x1="60" y1="65" x2="40" y2="100" stroke="#93C5FD" strokeWidth="2" />
                  <line x1="60" y1="65" x2="80" y2="100" stroke="#93C5FD" strokeWidth="2" />
                  <line x1="140" y1="65" x2="120" y2="100" stroke="#93C5FD" strokeWidth="2" />
                  <line x1="140" y1="65" x2="160" y2="100" stroke="#93C5FD" strokeWidth="2" />
                </svg>

                {/* Center Play Button */}
                <div className="relative z-10 w-12 h-12 rounded-full bg-white/95 text-blue-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Play size={18} className="fill-blue-600 translate-x-0.5" />
                </div>

                {/* Duration Tag */}
                {continueTarget.duration_label && (
                  <div className="absolute bottom-2.5 right-2.5 z-10 bg-black/80 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                    {continueTarget.duration_label}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Course Curriculum Accordion Section */}
          <div className="space-y-4">
            {/* Section Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen size={18} className="text-blue-600 dark:text-blue-400" />
                <h3 className="text-base sm:text-lg font-black text-gray-900 dark:text-white tracking-tight">
                  Course Curriculum
                </h3>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-500 dark:text-gray-400 font-semibold">
                  {course.sections.length} modules • {totalLessons} lessons
                </span>
                <button
                  onClick={handleToggleExpandAll}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/60 border border-blue-200 dark:border-blue-800 transition-colors cursor-pointer"
                >
                  <span>{allExpanded ? "Collapse All" : "Expand All"}</span>
                </button>
              </div>
            </div>

            {/* Curriculum Accordion List */}
            <div className="space-y-3">
              {course.sections.map((section, sectionIndex) => {
                const isExpanded = !!expandedSections[section.id];

                // Gather items in section + subsections
                const allSectionItems: CourseSectionItem[] = [
                  ...(section.items || []),
                  ...(section.subsections?.flatMap((sub) => sub.items) || []),
                ];
                const sectionItemsCount = allSectionItems.length;
                const sectionCompletedCount = allSectionItems.filter((it) => completedItemIds.includes(it.id)).length;
                const sectionProgress =
                  sectionItemsCount > 0 ? Math.round((sectionCompletedCount / sectionItemsCount) * 100) : 0;

                // Sum durations
                const sectionMinutes = allSectionItems.reduce(
                  (acc, it) => acc + parseDurationMinutes(it.duration_label),
                  0
                );
                const sectionDurationLabel = formatMinutes(sectionMinutes);

                // Status calculation
                const isCompleted = sectionCompletedCount === sectionItemsCount && sectionItemsCount > 0;
                const isInProgress = sectionCompletedCount > 0 && !isCompleted;

                return (
                  <div
                    key={section.id}
                    className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/90 dark:border-gray-800 shadow-xs overflow-hidden transition-colors"
                  >
                    {/* Accordion Header Row */}
                    <button
                      onClick={() => handleToggleSection(section.id)}
                      className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer text-left hover:bg-gray-50/60 dark:hover:bg-gray-800/30 transition-colors"
                    >
                      <div className="flex items-center gap-3.5 min-w-0 flex-1">
                        {/* Number Box */}
                        <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-black flex items-center justify-center text-xs shrink-0">
                          {sectionIndex + 1}
                        </div>

                        {/* Title & Meta */}
                        <div className="min-w-0">
                          <h4 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white truncate">
                            {section.title}
                          </h4>
                          <p className="text-[11px] text-gray-400 dark:text-gray-500 font-medium truncate mt-0.5">
                            {sectionItemsCount} lessons • {sectionDurationLabel}
                            {sectionCompletedCount > 0 && ` • ${sectionCompletedCount}/${sectionItemsCount} completed`}
                          </p>
                        </div>
                      </div>

                      {/* Right Area: Progress Bar + Status Badge + Chevron */}
                      <div className="flex items-center gap-4 shrink-0">
                        {/* Horizontal Progress Bar */}
                        <div className="hidden sm:flex items-center gap-2">
                          <div className="w-24 sm:w-28 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                isCompleted ? "bg-emerald-500" : isInProgress ? "bg-blue-600" : "bg-transparent"
                              }`}
                              style={{ width: `${sectionProgress}%` }}
                            />
                          </div>
                          <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 w-8 text-right">
                            {sectionProgress}%
                          </span>
                        </div>

                        {/* Status Badge */}
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${
                            isCompleted
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                              : isInProgress
                              ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
                              : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700"
                          }`}
                        >
                          {isCompleted ? "Completed" : isInProgress ? "In Progress" : "Not Started"}
                        </span>

                        {/* Chevron Icon */}
                        <div className="text-gray-400 dark:text-gray-500">
                          <ChevronDown
                            size={18}
                            className={`transform transition-transform duration-250 ${isExpanded ? "rotate-180" : ""}`}
                          />
                        </div>
                      </div>
                    </button>

                    {/* Accordion Expanded Content (Screenshot 2 style list) */}
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          key={`accordion-content-${section.id}`}
                          variants={accordionVariants}
                          initial="collapsed"
                          animate="expanded"
                          exit="collapsed"
                          className="overflow-hidden border-t border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-900/40"
                        >
                          <div className="p-3 sm:p-4 space-y-1.5">
                            {allSectionItems.map((item) => {
                              const itemCompleted = completedItemIds.includes(item.id);
                              const itemRevision = revisionItemIds.includes(item.id);
                              const isCurrentTarget = continueTarget?.id === item.id;

                              return (
                                <div
                                  key={item.id}
                                  onClick={() => onSelectItem(item)}
                                  className={`flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer group ${
                                    isCurrentTarget
                                      ? "bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800"
                                      : "hover:bg-white dark:hover:bg-gray-800/60 border border-transparent"
                                  }`}
                                >
                                  {/* Left: Status Icon + Title */}
                                  <div className="flex items-center gap-3 min-w-0 pr-3">
                                    {itemCompleted ? (
                                      <CheckCircle2
                                        size={18}
                                        className="text-emerald-500 fill-emerald-500/10 shrink-0"
                                      />
                                    ) : itemRevision ? (
                                      <RotateCcw
                                        size={18}
                                        className="text-amber-500 fill-amber-500/10 shrink-0"
                                      />
                                    ) : isCurrentTarget ? (
                                      <PlayCircle size={18} className="text-blue-600 fill-blue-600/10 shrink-0" />
                                    ) : (
                                      <Circle size={18} className="text-gray-300 dark:text-gray-600 shrink-0" />
                                    )}

                                    <span
                                      className={`text-xs sm:text-sm font-semibold truncate ${
                                        itemCompleted
                                          ? "text-gray-700 dark:text-gray-300"
                                          : itemRevision
                                          ? "text-amber-600 dark:text-amber-400 font-semibold"
                                          : isCurrentTarget
                                          ? "text-blue-600 dark:text-blue-400 font-bold"
                                          : "text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                                      }`}
                                    >
                                      {item.title}
                                    </span>
                                  </div>

                                  {/* Right: Badge + Duration + Play Button */}
                                  <div className="flex items-center gap-3 shrink-0">
                                    {itemCompleted && (
                                      <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                        Completed
                                      </span>
                                    )}

                                    {!itemCompleted && itemRevision && (
                                      <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                                        Revision
                                      </span>
                                    )}

                                    {!itemCompleted && !itemRevision && isCurrentTarget && (
                                      <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                                        In Progress
                                      </span>
                                    )}

                                    {item.duration_label && (
                                      <span className="text-[11px] font-medium text-gray-400 dark:text-gray-500">
                                        {item.duration_label}
                                      </span>
                                    )}

                                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-gray-400 group-hover:text-blue-600 group-hover:bg-blue-50 dark:group-hover:bg-blue-950/60 transition-colors">
                                      <Play size={12} className="group-hover:fill-blue-600" />
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
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

        {/* Right Column (4 cols): Your Progress + Certificate + Notes + Highlights + Live Classes + Instructor */}
        <div className="lg:col-span-4 space-y-6">
          {/* 1. Your Progress Card */}
          <div className="rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 space-y-5 shadow-xs">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Award size={14} />
              </div>
              <h4 className="text-xs font-black uppercase tracking-wider text-gray-900 dark:text-white">
                Your Progress
              </h4>
            </div>

            {/* Circular Progress Ring + Summary */}
            <div className="flex items-center gap-4 pt-1">
              <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="32"
                    cy="32"
                    r="26"
                    className="stroke-gray-100 dark:stroke-gray-800"
                    strokeWidth="5"
                    fill="transparent"
                  />
                  <circle
                    cx="32"
                    cy="32"
                    r="26"
                    className="stroke-blue-600 transition-all duration-1000 ease-out"
                    strokeWidth="5"
                    fill="transparent"
                    strokeDasharray={`${2 * Math.PI * 26}`}
                    strokeDashoffset={`${2 * Math.PI * 26 * (1 - progressPercent / 100)}`}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute text-xs font-black text-gray-900 dark:text-white">{progressPercent}%</span>
              </div>

              <div className="flex-1 space-y-1.5">
                <div className="flex items-baseline gap-1">
                  <span className="text-sm font-black text-gray-900 dark:text-white">
                    {completedLessons} / {totalLessons}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Lessons Completed</span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>

            <hr className="border-gray-100 dark:border-gray-800" />

            {/* Metrics List - 100% Real data from API */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-gray-500 dark:text-gray-400 flex items-center gap-2">
                  <PlayCircle size={14} className="text-blue-500" />
                  Videos Watched
                </span>
                <span className="font-black text-gray-900 dark:text-white">
                  {completedVideos.length} / {videoItems.length}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-gray-500 dark:text-gray-400 flex items-center gap-2">
                  <BookOpen size={14} className="text-emerald-500" />
                  Modules Completed
                </span>
                <span className="font-black text-gray-900 dark:text-white">
                  {completedModulesCount} / {course.sections.length}
                </span>
              </div>

              {problemItems.length > 0 && (
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    <Code2 size={14} className="text-emerald-500" />
                    Problems Solved
                  </span>
                  <span className="font-black text-gray-900 dark:text-white">
                    {completedProblems.length} / {problemItems.length}
                  </span>
                </div>
              )}

              {articleItems.length > 0 && (
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    <FileText size={14} className="text-purple-500" />
                    Notes Read
                  </span>
                  <span className="font-black text-gray-900 dark:text-white">
                    {completedArticles.length} / {articleItems.length}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-gray-500 dark:text-gray-400 flex items-center gap-2">
                  <Clock size={14} className="text-amber-500" />
                  Time Spent
                </span>
                <span className="font-black text-gray-900 dark:text-white">{timeSpentString}</span>
              </div>
            </div>
          </div>

          {/* 2. Course Certificate Section (Locked until 75%, manual claim via support) */}
          <div
            className={`rounded-3xl border p-5 space-y-3.5 ${
              isCertificateUnlocked
                ? "bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/80"
                : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-xs"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                    isCertificateUnlocked
                      ? "bg-emerald-600 text-white"
                      : "bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400"
                  }`}
                >
                  {isCertificateUnlocked ? <Award size={15} /> : <Lock size={14} />}
                </div>
                <h4 className="text-xs font-black uppercase tracking-wider text-gray-900 dark:text-white">
                  Course Certificate
                </h4>
              </div>

              <span
                className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider border ${
                  isCertificateUnlocked
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                    : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                }`}
              >
                {isCertificateUnlocked ? "Unlocked" : "Locked (75%)"}
              </span>
            </div>

            {!isCertificateUnlocked ? (
              <div className="space-y-2.5">
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                  Your verified certificate of completion is locked until you complete at least 75% of the course curriculum.
                </p>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-bold text-gray-600 dark:text-gray-300">
                    <span>Current Progress</span>
                    <span>{progressPercent}% / 75% required</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, Math.round((progressPercent / 75) * 100))}%` }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-emerald-900 dark:text-emerald-300 leading-relaxed font-medium">
                  Congratulations on completing over 75% of the course! As automated certificate generation is currently in development, please reach out to our team to claim your official verified certificate.
                </p>

                <a
                  href={`https://wa.me/919956217210?text=${encodeURIComponent(
                    `Hi CrackDSA team, I have completed ${progressPercent}% of the ${course.title} course and would like to request my official course certificate.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
                >
                  <Award size={14} />
                  <span>Claim Certificate via Support</span>
                </a>
              </div>
            )}
          </div>


          {/* 4. Course Highlights Card */}
          <div className="rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 space-y-4 shadow-xs">
            <h4 className="text-xs font-black uppercase tracking-wider text-gray-900 dark:text-white flex items-center gap-2">
              <BookOpen size={14} className="text-blue-600 dark:text-blue-400" />
              Course Highlights
            </h4>

            {/* 2x2 Grid with Real Data */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-gray-50/80 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 text-left">
                <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-2">
                  <Play size={13} className="fill-blue-600" />
                </div>
                <p className="text-lg font-black text-gray-900 dark:text-white">{videoItems.length || 0}</p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 font-semibold">Video Lessons</p>
              </div>

              <Link
                href="/practice"
                className="p-3.5 rounded-2xl bg-gray-50/80 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 text-left hover:border-emerald-500/40 transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2">
                  <Code2 size={13} />
                </div>
                <p className="text-lg font-black text-gray-900 dark:text-white">
                  {problemItems.length > 0 ? problemItems.length : practiceProblemsCount ? `${practiceProblemsCount}` : "Curated"}
                </p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 font-semibold">
                  {problemItems.length > 0 ? "Course Problems" : "Top Problems"}
                </p>
              </Link>

              <div className="p-3.5 rounded-2xl bg-gray-50/80 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 text-left">
                <div className="w-7 h-7 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-2">
                  <FileText size={13} />
                </div>
                <p className="text-sm font-black text-gray-900 dark:text-white mt-1">Interview</p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 font-semibold">Notes & PDFs</p>
              </div>

              <Link
                href="/live-classes"
                className="p-3.5 rounded-2xl bg-gray-50/80 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 text-left hover:border-blue-500/40 transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-2">
                  <Users size={13} />
                </div>
                <p className="text-sm font-black text-gray-900 dark:text-white mt-1">Live Classes</p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 font-semibold">Every Week</p>
              </Link>
            </div>
          </div>

          {/* 5. Live Weekly Classes Card */}
          <div className="rounded-3xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/60 p-5 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
                <Radio size={14} />
              </div>
              <h4 className="text-xs font-black text-blue-900 dark:text-blue-200 uppercase tracking-wider">
                Live Weekly Classes
              </h4>
            </div>

            <p className="text-xs text-blue-950/80 dark:text-blue-300 leading-relaxed font-medium">
              Interactive doubt-solving and problem-solving sessions with your instructor.
            </p>

            <Link
              href="/live-classes"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors pt-1"
            >
              <span>View Schedule</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          {/* 6. Instructor Spotlight Card - Directly using API data */}
          {activeInstructor && (
            <div className="rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 space-y-4 shadow-xs">
              <h4 className="text-xs font-black uppercase tracking-wider text-gray-900 dark:text-white flex items-center gap-2">
                <Award size={14} className="text-amber-500" />
                Instructor
              </h4>

              <div className="flex items-start gap-3.5">
                {activeInstructor.profile_image_url ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={activeInstructor.profile_image_url}
                    alt={activeInstructor.name}
                    className="w-12 h-12 rounded-2xl object-cover border border-gray-200 dark:border-gray-700 shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold text-sm flex items-center justify-center shrink-0">
                    {activeInstructor.name.slice(0, 2).toUpperCase()}
                  </div>
                )}

                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <h5 className="text-sm font-bold text-gray-900 dark:text-white truncate">
                      {activeInstructor.name}
                    </h5>
                    <BadgeCheck size={16} className="text-blue-600 fill-blue-600/10 shrink-0" />
                  </div>
                  <p className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 leading-tight">
                    {activeInstructor.role}
                  </p>
                  {activeInstructor.sub_title && (
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium line-clamp-1">
                      {activeInstructor.sub_title}
                    </p>
                  )}
                </div>
              </div>

              {activeInstructor.bio && (
                <p className="text-xs text-gray-600 dark:text-gray-400 font-medium leading-relaxed">
                  {activeInstructor.bio}
                </p>
              )}

              {/* Social links from API metadata */}
              {activeInstructor.metadata && (
                <div className="flex items-center gap-3 pt-1 border-t border-gray-100 dark:border-gray-800">
                  {activeInstructor.metadata.Linkedin && (
                    <a
                      href={activeInstructor.metadata.Linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
                    >
                      <span>LinkedIn</span>
                      <ExternalLink size={10} />
                    </a>
                  )}
                  {activeInstructor.metadata.Youtube && (
                    <a
                      href={activeInstructor.metadata.Youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-semibold text-red-500 hover:text-red-600 inline-flex items-center gap-1"
                    >
                      <span>YouTube</span>
                      <ExternalLink size={10} />
                    </a>
                  )}
                  {activeInstructor.metadata.Github && (
                    <a
                      href={activeInstructor.metadata.Github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-semibold text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white inline-flex items-center gap-1"
                    >
                      <span>GitHub</span>
                      <ExternalLink size={10} />
                    </a>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
