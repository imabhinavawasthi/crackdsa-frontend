import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Terminal, Cpu, Code2, Clock } from "lucide-react";
import { CourseSummary } from "@/types/course";

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
      <div className="w-full aspect-[16/9] relative bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 border-b border-gray-100 dark:border-gray-800 overflow-hidden shrink-0">
        {course.metadata?.thumbnail_url ? (
          <img 
            src={course.metadata.thumbnail_url} 
            alt={`${course.title} thumbnail`} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center opacity-30 group-hover:opacity-50 group-hover:scale-110 transition-all duration-500">
            <Icon className="w-16 h-16 text-gray-400 dark:text-gray-500" />
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-start justify-between mb-5">
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
          <span className="flex items-center gap-1 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
            <Clock size={10} /> {course.metadata?.duration_weeks || 0} Weeks
          </span>
        </div>
      </div>

      <div className="space-y-2 mb-4 flex-1">
        <h4 className="text-lg font-black text-gray-900 dark:text-white leading-tight">
          {course.title}
        </h4>
        <div 
          className="text-xs text-gray-500 dark:text-gray-400 font-medium line-clamp-3 leading-relaxed prose prose-sm prose-gray dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: course.description }}
        />
      </div>

      <div className="border-t border-gray-100 dark:border-gray-800/80 pt-4 mt-auto flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Enrollment</span>
          {course.is_pro ? (
            <span className="text-sm font-black text-amber-500">PRO Access</span>
          ) : (
            <span className="text-lg font-black text-gray-900 dark:text-white">₹{course.price}</span>
          )}
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
