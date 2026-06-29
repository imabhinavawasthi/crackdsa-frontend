"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, ChevronRight, GraduationCap, Crown, ArrowUpRight } from "lucide-react";
import { fadeInUp, staggerContainer } from "@/utils/animations";

interface CourseItem {
  course_id: string;
  course_name: string;
}

interface EnrolledCoursesSectionProps {
  enrolledCourses: CourseItem[];
}

export function EnrolledCoursesSection({ enrolledCourses }: EnrolledCoursesSectionProps) {
  if (!enrolledCourses || enrolledCourses.length === 0) return null;

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={staggerContainer}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BookOpen size={18} className="text-purple-500" />
            <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Your Courses</h2>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Included with your Pro subscription</p>
        </div>
        <Link
          href="/courses"
          className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition-colors"
        >
          Browse all <ChevronRight size={15} />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {enrolledCourses.map((course) => (
          <motion.div key={course.course_id} variants={fadeInUp}>
            <Link href={`/courses/${course.course_id}`} className="block group">
              <div className="relative overflow-hidden rounded-2xl border border-gray-200/60 dark:border-gray-800/60 bg-white/80 dark:bg-gray-900/50 backdrop-blur-sm p-5 transition-all hover:shadow-lg hover:-translate-y-0.5 hover:border-purple-300/50 dark:hover:border-purple-500/20">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-purple-500 to-violet-600 text-white shadow-md">
                    <GraduationCap size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1">{course.course_name}</h3>
                    <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-500 dark:text-gray-400">
                      <Crown size={11} className="text-amber-500" />
                      <span className="font-semibold">Included in Pro</span>
                    </div>
                  </div>
                  <ArrowUpRight size={16} className="text-gray-300 dark:text-gray-600 group-hover:text-brand-500 transition-colors shrink-0" />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
