"use client";

import React, { useState, useEffect } from "react";
import { 
  Clock, 
  BookOpen, 
  Dumbbell, 
  ChevronDown, 
  ChevronUp, 
  Zap, 
  Building2, 
  ArrowRight,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  PlayCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import ErrorState from "@/components/common/ErrorState";

type Instructor = {
  name: string;
  role: string;
  company: string;
  color: string;
};

type CourseSectionItem = {
  id: string;
  title: string;
  type: string;
  asset_id: string;
  is_free: boolean;
  duration_label?: string | null;
};

type CourseSubsection = {
  id: string;
  title: string;
  description?: string | null;
  items: CourseSectionItem[];
};

type CourseSection = {
  id: string;
  title: string;
  description?: string | null;
  items?: CourseSectionItem[] | null;
  subsections?: CourseSubsection[] | null;
};

type Course = {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  duration_weeks: number;
  total_problems: number;
  total_projects: number;
  instructors: Instructor[];
  tags: string[];
  syllabus?: string[];
  curriculum?: CourseSection[];
  is_pro: boolean;
  is_popular: boolean;
  status: string;
  price: number;
  original_price: number;
};

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [expandedSyllabus, setExpandedSyllabus] = useState(false);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(false);
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
      const res = await fetch(`${backendUrl}/api/v1/courses`);
      
      if (!res.ok) {
        throw new Error(`Server returned status: ${res.status}`);
      }
      
      const data = await res.json();
      setCourses(data);
    } catch (err) {
      console.error("Failed to load courses from API:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-24 pt-6 px-4">
      
      {/* 1. Clear & Elegant Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1.25 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 font-bold text-xs uppercase tracking-wider"
        >
          <Sparkles size={13} />
          <span>Curated SDE Specializations</span>
        </motion.div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-brand-400">Academy Courses</span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base leading-relaxed">
          High-impact, structured learning tracks designed to help you revise concepts, master core patterns, and ace product SDE interviews.
        </p>
      </div>

      {/* 2. Main Course View State */}
      {loading ? (
        // Clean Simple Pulse Skeleton
        <div className="rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-8 shadow-sm animate-pulse space-y-6">
          <div className="flex items-center justify-between">
            <div className="h-6 w-20 bg-gray-200 dark:bg-gray-800 rounded-lg" />
            <div className="h-6 w-24 bg-gray-200 dark:bg-gray-800 rounded-lg" />
          </div>
          <div className="h-8 w-2/3 bg-gray-200 dark:bg-gray-800 rounded-xl" />
          <div className="space-y-2">
            <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded" />
            <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-800 rounded" />
          </div>
          <div className="h-20 bg-gray-100 dark:bg-gray-800/50 rounded-2xl" />
          <div className="flex items-center justify-between pt-2">
            <div className="h-10 w-32 bg-gray-200 dark:bg-gray-800 rounded-xl" />
            <div className="h-12 w-40 bg-gray-200 dark:bg-gray-800 rounded-xl" />
          </div>
        </div>
      ) : error ? (
        // Connection Failure State
        <ErrorState
          title="API Connection Failure"
          message="We had difficulty loading available academy courses. The backend server might be offline or currently undergoing updates."
          onRetry={fetchCourses}
          icon={AlertTriangle}
        />
      ) : courses.length > 0 ? (
        // Render single featured premium bootcamp course
        (() => {
          const course = courses[0];
          return (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm hover:shadow-md transition-all p-6 sm:p-8 space-y-6 sm:space-y-8 relative group"
            >
              {/* Badge Header Row */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 dark:border-gray-800/60 pb-5">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-brand-500 text-white shadow-sm shadow-brand-500/10">
                    <Zap size={12} />
                    Best Seller
                  </span>
                  <span className="rounded-lg bg-orange-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400 border border-orange-500/10">
                    50+ recordings
                  </span>
                </div>
                <span className="rounded-lg bg-gray-100 dark:bg-gray-800 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  {course.difficulty}
                </span>
              </div>

              {/* Course Title and Description */}
              <div className="space-y-3">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight leading-tight">
                  {course.title}
                </h2>
                <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                  {course.description}
                </p>
              </div>

              {/* Dynamic Feature Badges */}
              <div className="flex flex-wrap gap-2.5">
                {course.tags.map((tag) => (
                  <span 
                    key={tag}
                    className="px-3.5 py-1.5 rounded-xl bg-gray-50 dark:bg-gray-800/40 text-xs font-bold text-gray-600 dark:text-gray-400 border border-transparent dark:border-gray-800/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Core Metadata Counters (12 weeks, 50+ classes) */}
              <div className="grid grid-cols-3 gap-4 py-4.5 px-6 border border-gray-100 dark:border-gray-800/50 rounded-2xl bg-gray-50/50 dark:bg-gray-800/10">
                <div className="flex flex-col items-center justify-center text-center">
                  <Clock size={16} className="text-brand-500 mb-1" />
                  <span className="text-xs font-bold text-gray-800 dark:text-gray-200">{course.duration_weeks} Weeks</span>
                  <span className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">Duration</span>
                </div>
                <div className="flex flex-col items-center justify-center text-center border-x border-gray-200/60 dark:border-gray-800">
                  <PlayCircle size={16} className="text-brand-500 mb-1" />
                  <span className="text-xs font-bold text-gray-800 dark:text-gray-200">50 Classes</span>
                  <span className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">Recordings</span>
                </div>
                <div className="flex flex-col items-center justify-center text-center">
                  <Dumbbell size={16} className="text-brand-500 mb-1" />
                  <span className="text-xs font-bold text-gray-800 dark:text-gray-200">{course.total_problems}+</span>
                  <span className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">Problems</span>
                </div>
              </div>

              {/* Syllabus Accordion Preview */}
              <div className="border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden">
                <button
                  onClick={() => setExpandedSyllabus(!expandedSyllabus)}
                  className="w-full flex items-center justify-between px-6 py-4 text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/20 transition-all bg-gray-50/30 dark:bg-gray-800/5"
                >
                  <span className="flex items-center gap-2.5">
                    <BookOpen size={16} className="text-brand-500" />
                    <span>Curriculum Syllabus Sneak-peek</span>
                  </span>
                  {expandedSyllabus ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>

                <AnimatePresence initial={false}>
                  {expandedSyllabus && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900"
                    >
                      <ul className="px-6 py-5 space-y-3.5">
                        {((course.curriculum && course.curriculum.length > 0)
                          ? course.curriculum.map(sec => sec.title)
                          : (course.syllabus || [])
                        ).map((item, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 text-[10px] font-bold mt-0.5">
                              {idx + 1}
                            </span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Pricing section and Buy/Explore Action CTA */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-6 border-t border-gray-100 dark:border-gray-800/60 pt-6">
                
                {/* Mentor Spotlight & Avatar */}
                {course.instructors && course.instructors.length > 0 ? (
                  (() => {
                    const primaryInstructor = course.instructors[0];
                    return (
                      <div className="flex items-center gap-3">
                        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${primaryInstructor.color || "from-brand-500 to-blue-500"} text-white font-bold text-sm shadow-sm`}>
                          {primaryInstructor.name.split(" ").map(w => w[0]).join("")}
                        </div>
                        <div>
                          <h4 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white leading-none">
                            {primaryInstructor.name}
                          </h4>
                          <p className="text-[10px] sm:text-xs font-bold text-brand-500 dark:text-brand-400 mt-1.5 flex items-center gap-1.5">
                            <Building2 size={11} />
                            <span>{primaryInstructor.company}</span>
                          </p>
                        </div>
                      </div>
                    );
                  })()
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 text-white font-bold text-sm shadow-sm">
                      CD
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white leading-none">
                        CrackDSA Mentor
                      </h4>
                      <p className="text-[10px] sm:text-xs font-bold text-brand-500 dark:text-brand-400 mt-1.5 flex items-center gap-1.5">
                        <Building2 size={11} />
                        <span>CrackDSA Faculty</span>
                      </p>
                    </div>
                  </div>
                )}

                {/* Price tag + Call To Action */}
                <div className="flex items-center justify-between sm:justify-end gap-6">
                  <div className="flex flex-col text-right sm:text-right">
                    <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Sell Price</span>
                    <div className="flex items-baseline gap-1.5 mt-0.5">
                      <span className="text-2xl font-bold text-gray-900 dark:text-white">₹{course.price}</span>
                      <span className="text-xs text-gray-400 dark:text-gray-500 line-through font-bold">₹{course.original_price}</span>
                    </div>
                  </div>

                  <Link
                    href={`/courses/${course.slug}/learn`}
                    className="flex items-center justify-center gap-2 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white px-6 py-4 text-sm font-bold shadow-md shadow-brand-500/15 hover:shadow-lg hover:shadow-brand-500/20 transition-all group/btn"
                  >
                    <span>Enter Student Classroom</span>
                    <ArrowRight size={16} className="transition-transform group-hover/btn:translate-x-0.5" />
                  </Link>
                </div>

              </div>
            </motion.div>
          );
        })()
      ) : (
        <div className="text-center py-16 bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-3xl">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">No active courses listed</h3>
        </div>
      )}
      
      {/* 3. Sleek Academy Trust Stats */}
      <div className="rounded-3xl bg-gradient-to-br from-brand-500/5 via-blue-light-500/5 to-transparent border border-gray-200 dark:border-gray-800 p-8">
        <div className="grid grid-cols-3 gap-6 text-center">
          <div className="flex flex-col items-center">
            <span className="text-2xl sm:text-3xl font-bold text-brand-500 dark:text-brand-400">100%</span>
            <span className="text-[9px] sm:text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mt-1">Ex-FAANG Faculty</span>
          </div>
          <div className="flex flex-col items-center border-x border-gray-200 dark:border-gray-800/80 px-2">
            <span className="text-2xl sm:text-3xl font-bold text-brand-500 dark:text-brand-400">50+</span>
            <span className="text-[9px] sm:text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mt-1">Class Lectures</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl sm:text-3xl font-bold text-brand-500 dark:text-brand-400">₹999</span>
            <span className="text-[9px] sm:text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mt-1">Affordable SDE Price</span>
          </div>
        </div>
      </div>

    </div>
  );
}
