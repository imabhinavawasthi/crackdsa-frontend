"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Crown, Sparkles, CheckCircle2, Zap, NewspaperIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CourseSummary } from "@/types/course";
import { fetchCourses } from "@/api/courses";
import { CourseCard } from "@/components/courses/CourseCard";
import { FeaturedCourseCard } from "@/components/courses/FeaturedCourseCard";
import { ContactFooterCard } from "@/components/common/ContactFooterCard";

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function CoursesPage() {
  const [courses, setCourses] = useState<CourseSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("all");

  useEffect(() => {
    async function loadCourses() {
      try {
        const data = await fetchCourses();
        setCourses(data);
      } catch (err) {
        console.error("Failed to fetch courses", err);
      } finally {
        setLoading(false);
      }
    }
    loadCourses();
  }, []);

  // Determine featured course (first popular one, or just the first one)
  const featuredCourse = useMemo(() => {
    if (courses.length === 0) return null;
    return courses.find(c => c.is_popular) || courses[0];
  }, [courses]);

  // Determine secondary courses (all courses, including featured)
  const secondaryCourses = useMemo(() => {
    return courses;
  }, [courses]);

  // Apply category filter to secondary courses
  const filteredSecondaryCourses = useMemo(() => {
    if (activeTab === "all") return secondaryCourses;
    return secondaryCourses.filter(c => c.category === activeTab);
  }, [secondaryCourses, activeTab]);

  const tabs = [
    { id: "all", label: "All Courses" },
    { id: "interview-prep", label: "Interview Prep" },
    { id: "core-dsa", label: "Core DSA" },
    { id: "system-design", label: "System Design" },
    { id: "advanced", label: "Advanced CS" }
  ];

  if (loading && courses.length === 0) {
    // We will handle loading inline to show the header instantly
  }

  // --- Skeleton Components ---
  const FeaturedCourseSkeleton = () => (
    <div className="relative z-10 animate-pulse">
      <div className="relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-[2.5rem] overflow-hidden p-8 sm:p-12">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
          <div className="flex-1 space-y-6">
            <div className="flex gap-3">
              <div className="w-24 h-6 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
              <div className="w-20 h-6 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
            </div>
            <div className="space-y-4">
              <div className="w-3/4 h-12 bg-gray-200 dark:bg-gray-800 rounded-2xl"></div>
              <div className="w-full h-4 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
              <div className="w-5/6 h-4 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
              <div className="w-4/6 h-4 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
            </div>
            <div className="flex gap-2.5">
              <div className="w-20 h-8 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
              <div className="w-24 h-8 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
              <div className="w-16 h-8 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="space-y-2">
                  <div className="w-12 h-8 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
                  <div className="w-16 h-3 bg-gray-200 dark:bg-gray-800 rounded"></div>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:w-80 shrink-0 space-y-6">
            <div className="h-64 bg-gray-100 dark:bg-gray-800/40 rounded-3xl border border-gray-200 dark:border-gray-800"></div>
            <div className="h-12 bg-gray-100 dark:bg-gray-800 rounded-2xl"></div>
          </div>
        </div>
      </div>
    </div>
  );

  const CourseCardSkeleton = () => (
    <div className="flex flex-col bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 h-[280px] animate-pulse">
      <div className="flex items-start justify-between mb-5">
        <div className="w-12 h-12 rounded-2xl bg-gray-200 dark:bg-gray-800"></div>
        <div className="flex flex-col items-end gap-2">
          <div className="w-16 h-4 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
          <div className="w-12 h-3 bg-gray-200 dark:bg-gray-800 rounded"></div>
        </div>
      </div>
      <div className="space-y-3 mb-4 flex-1">
        <div className="w-5/6 h-6 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
        <div className="w-full h-3 bg-gray-200 dark:bg-gray-800 rounded"></div>
        <div className="w-4/6 h-3 bg-gray-200 dark:bg-gray-800 rounded"></div>
      </div>
      <div className="border-t border-gray-100 dark:border-gray-800 pt-4 mt-auto flex items-center justify-between">
        <div className="space-y-2">
          <div className="w-16 h-3 bg-gray-200 dark:bg-gray-800 rounded"></div>
          <div className="w-20 h-5 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
        </div>
        <div className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-gray-800"></div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-16 pb-24 pt-8 px-4 relative">
      
      {/* Background Ornaments */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[40%] left-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* 1. Premium Header Section */}
      <div className="text-center space-y-6 max-w-4xl mx-auto relative z-10 pb-8 border-b border-gray-100 dark:border-gray-800/60 mb-12">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl sm:text-4xl lg:text-[40px] font-black text-gray-900 dark:text-white tracking-tight leading-[1.2]"
        >
          Become Interview Ready with <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-indigo-500">Our Self Paced Courses</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-gray-500 dark:text-gray-400 text-sm sm:text-base leading-relaxed font-medium max-w-2xl mx-auto"
        >
          We don't just sell courses; we engineer outcomes. Our specialized tracks adapt to your pace, providing 1:1 doubt support and industry-validated problems to ensure you conquer your next big interview.
        </motion.p>

        {/* Impact Highlights */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 pt-6"
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <CheckCircle2 size={16} />
            </div>
            <div className="text-left">
              <div className="text-sm font-black text-gray-900 dark:text-white">Outcome Driven</div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Industry Validated</div>
            </div>
          </div>

          <div className="hidden sm:block w-px h-8 bg-gray-200 dark:bg-gray-800"></div>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <Zap size={16} />
            </div>
            <div className="text-left">
              <div className="text-sm font-black text-gray-900 dark:text-white">Live Doubt Classes</div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Personalized Support</div>
            </div>
          </div>

          <div className="hidden sm:block w-px h-8 bg-gray-200 dark:bg-gray-800"></div>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Crown size={16} />
            </div>
            <div className="text-left">
              <div className="text-sm font-black text-gray-900 dark:text-white">PRO Access</div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Unlock Everything</div>
            </div>
          </div>

        <div className="hidden sm:block w-px h-8 bg-gray-200 dark:bg-gray-800"></div>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center">
              <NewspaperIcon size={16} />
            </div>
            <div className="text-left">
              <div className="text-sm font-black text-gray-900 dark:text-white">Certificate</div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Industry Recognition</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <>
          <FeaturedCourseSkeleton />
          <div className="space-y-8 relative z-10 pt-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-200 dark:border-gray-800 pb-4">
              <h3 className="text-2xl font-black text-gray-900 dark:text-white">Specialized Tracks</h3>
              <div className="flex gap-2">
                {[1, 2, 3, 4].map(i => <div key={i} className="w-24 h-9 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse"></div>)}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => <CourseCardSkeleton key={i} />)}
            </div>
          </div>
        </>
      ) : courses.length === 0 ? (
        <div className="py-24 text-center text-gray-500 font-medium bg-gray-50 dark:bg-gray-900/50 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800 relative z-10">
          No active courses listed right now. Check back later!
        </div>
      ) : (
        <>
          {/* 2. Featured USP Course */}
          {featuredCourse && (
            <FeaturedCourseCard course={featuredCourse} />
          )}

          {/* 3. Filtering Tabs & Secondary Courses Grid */}
          <div className="space-y-8 relative z-10 pt-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-200 dark:border-gray-800 pb-4">
              <h3 className="text-2xl font-black text-gray-900 dark:text-white">Specialized Tracks</h3>
              
              {/* Filtering Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 custom-scrollbar">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                      activeTab === tab.id
                        ? "bg-brand-500 text-white shadow-md shadow-brand-500/20"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <AnimatePresence mode="wait">
              {filteredSecondaryCourses.length > 0 ? (
                <motion.div 
                  key={activeTab}
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {filteredSecondaryCourses.map((course, idx) => (
                    <CourseCard key={course.id} course={course} index={idx} />
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-16 text-center text-gray-500 font-medium bg-gray-50 dark:bg-gray-900/50 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800"
                >
                  No courses found in this category.
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </>
      )}

      {/* 4. Support Footer */}
      {!loading && courses.length > 0 && (
        <div className="relative z-10 pt-16">
          <ContactFooterCard />
        </div>
      )}

    </div>
  );
}
