import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Terminal, Cpu, Code2, Clock, Star, Users } from "lucide-react";
import { CourseSummary } from "@/types/course";
import AspectFallbackImage from "@/components/common/AspectFallbackImage";

export function CourseCard({ course, index }: { course: CourseSummary; index: number }) {
  // Pick an icon based on ID/category
  let Icon = Code2;
  if (course.id.includes("python") || course.slug.includes("python")) Icon = Terminal;
  if (course.id.includes("os") || course.slug.includes("system-design")) Icon = Cpu;

  return (
    <Link href={`/courses/${course.slug}`} className="block focus:outline-none h-full">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -6 }}
      className="flex flex-col bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-brand-500/10 hover:border-brand-500/30 transition-all duration-300 group h-full cursor-pointer"
    >
      {/* Thumbnail Area (16:9 ratio) */}
      <AspectFallbackImage
        src={course.metadata?.thumbnail_url}
        localSrc={`/images/course/${course.slug}.png`}
        alt={`${course.title} thumbnail`}
        title={course.title}
        subtitle={`${course.metadata?.difficulty || "Beginner"} • ${course.metadata?.duration_weeks || 0} weeks`}
        className="border-b border-gray-100 dark:border-gray-800"
      />

      <div className="p-6 flex flex-col flex-1 relative">
        <div className="flex items-start justify-between mb-5 relative z-10">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner shrink-0 ${
            index % 3 === 0 ? "bg-blue-50 dark:bg-blue-500/10 text-blue-500" :
            index % 3 === 1 ? "bg-amber-50 dark:bg-amber-500/10 text-amber-500" :
            "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500"
          }`}>
            <Icon size={24} />
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <span className="rounded-lg bg-gray-100 dark:bg-gray-800 px-2.5 py-1 text-[9px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">
              {course.metadata?.difficulty || "Beginner"}
            </span>
            {course.metadata?.duration_weeks ? (
              <span className="flex items-center gap-1 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                <Clock size={10} /> {course.metadata.duration_weeks} Weeks
              </span>
            ) : null}
          </div>
        </div>

        <div className="space-y-2 mb-4 flex-1 relative z-10">
          <h4 className="text-xl font-black text-gray-900 dark:text-white leading-tight">
            {course.title}
          </h4>
          <div 
            className="text-xs text-gray-500 dark:text-gray-400 font-medium line-clamp-2 leading-relaxed prose prose-sm prose-gray dark:prose-invert max-w-none mb-3"
            dangerouslySetInnerHTML={{ __html: course.description }}
          />
          
          {/* Stats Row */}
          {(course.metadata?.rating || course.metadata?.number_of_students) && (
            <div className="flex items-center gap-3 pt-2">
              {course.metadata?.rating && (
                <div className="flex items-center gap-1 text-xs font-bold text-gray-600 dark:text-gray-400">
                  <Star size={14} className="text-amber-500 fill-amber-500" />
                  <span>{course.metadata.rating}</span>
                </div>
              )}
              {course.metadata?.rating && course.metadata?.number_of_students && (
                <div className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700" />
              )}
              {course.metadata?.number_of_students && (
                <div className="flex items-center gap-1 text-xs font-bold text-gray-600 dark:text-gray-400">
                  <Users size={14} className="text-brand-500" />
                  <span>{course.metadata.number_of_students > 1000 ? `${(course.metadata.number_of_students / 1000).toFixed(1)}k` : course.metadata.number_of_students} Enrolled</span>
                </div>
              )}
            </div>
          )}
        </div>

      <div className="border-t border-gray-100 dark:border-gray-800/80 pt-4 mt-auto flex items-center justify-between">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Price</span>
            {course.is_pro && (
              <span className="text-[8px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20 px-1.5 py-0.5 rounded uppercase tracking-wider">
                PRO Included
              </span>
            )}
          </div>
          <div className="flex items-baseline gap-1.5">
            {course.price === 0 ? (
              <span className="text-lg font-black text-emerald-500">Free</span>
            ) : (
              <>
                <span className="text-lg font-black text-gray-900 dark:text-white">₹{course.price}</span>
                {course.original_price > course.price && (
                  <span className="text-xs font-bold text-gray-400 line-through">₹{course.original_price}</span>
                )}
              </>
            )}
          </div>
        </div>
        
        <div
          className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-400 group-hover:bg-brand-500 group-hover:text-white transition-colors"
        >
          <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
      </div>
    </motion.div>
    </Link>
  );
}
