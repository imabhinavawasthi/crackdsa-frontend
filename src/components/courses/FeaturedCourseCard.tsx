import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Crown, ArrowRight, BookOpen, ChevronDown, ChevronUp, CheckCircle2, Code2, Terminal, Cpu } from "lucide-react";
import { CourseSummary } from "@/types/course";

export function FeaturedCourseCard({ course }: { course: CourseSummary }) {
  const [expandedSyllabus, setExpandedSyllabus] = useState(false);
  const router = useRouter();

  // Pick an icon based on ID/category
  let Icon = Code2;
  if (course.id.includes("python") || course.slug.includes("python")) Icon = Terminal;
  if (course.id.includes("os") || course.slug.includes("system-design")) Icon = Cpu;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      onClick={() => router.push(`/courses/${course.slug}`)}
      className="relative z-10 cursor-pointer group"
    >
      <div className="absolute -inset-1 bg-gradient-to-r from-brand-500 to-indigo-500 rounded-[2.5rem] blur opacity-25" />
      <div className="relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-[2.5rem] overflow-hidden shadow-2xl p-8 sm:p-12">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
          
          {/* Left Col: Info */}
          <div className="flex-1 space-y-6">
            
            {/* Thumbnail */}
            <div className="w-full aspect-video md:aspect-[21/9] rounded-2xl relative bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-800 overflow-hidden shrink-0">
              {course.metadata?.thumbnail_url ? (
                <img 
                  src={course.metadata.thumbnail_url} 
                  alt={`${course.title} thumbnail`} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center opacity-30 group-hover:opacity-50 group-hover:scale-110 transition-all duration-700">
                  <Icon className="w-20 h-20 text-gray-400 dark:text-gray-500" />
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              {course.is_popular && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest bg-brand-500 text-white shadow-md shadow-brand-500/20">
                  <Zap size={12} /> Popular Flagship
                </span>
              )}
              <span className="rounded-lg bg-gray-100 dark:bg-gray-800 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
                {course.metadata?.difficulty || "Beginner"}
              </span>
            </div>

            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white tracking-tight leading-[1.1] mb-4">
                {course.title}
              </h2>
              <div 
                className="text-base sm:text-lg text-gray-600 dark:text-gray-400 leading-relaxed font-medium line-clamp-4 prose prose-gray dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: course.description }}
              />
            </div>

            <div className="flex flex-wrap gap-2.5">
              {course.tags.map((tag: string) => (
                <span 
                  key={tag}
                  className="px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-800/60 text-xs font-bold text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-800/80"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
              <div className="flex flex-col gap-1">
                <span className="text-2xl font-black text-brand-500">{course.metadata?.duration_weeks || 0}</span>
                <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Weeks</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-2xl font-black text-brand-500">{course.total_videos || 0}</span>
                <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Lectures</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-2xl font-black text-brand-500">{course.total_problems || 0}</span>
                <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Problems</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-2xl font-black text-brand-500">{course.total_articles || 0}</span>
                <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Articles</span>
              </div>
            </div>
          </div>

          {/* Right Col: Pricing & Actions */}
          <div className="lg:w-80 shrink-0 space-y-6 flex flex-col justify-center">
            <div className="p-6 rounded-3xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-800 space-y-6">
              
              <div className="space-y-1">
                {course.original_price > course.price && (
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400">
                      Discounted
                    </span>
                  </div>
                )}
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-gray-900 dark:text-white">₹{course.price}</span>
                  {course.original_price > course.price && (
                    <span className="text-lg text-gray-400 line-through font-bold">₹{course.original_price}</span>
                  )}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold mt-2 flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-emerald-500" />
                  Lifetime Access
                </p>
              </div>

              <div className="space-y-3 relative z-20">
                <Link
                  href={`/checkout/course/${course.slug}`}
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center justify-center gap-2 w-full rounded-2xl bg-brand-600 hover:bg-brand-700 text-white px-6 py-4 text-sm font-bold shadow-xl shadow-brand-500/20 hover:shadow-brand-500/30 transition-all group/btn"
                >
                  <span>Enroll Now</span>
                  <ArrowRight size={16} className="transition-transform group-hover/btn:translate-x-1" />
                </Link>
                
                {course.is_pro && (
                  <>
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                      </div>
                      <div className="relative flex justify-center">
                        <span className="bg-gray-50 dark:bg-[#1a1f2e] px-2 text-[10px] uppercase font-bold text-gray-400">OR</span>
                      </div>
                    </div>

                    <Link
                      href={`/checkout/pro`}
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center justify-center gap-2 w-full rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/20 px-6 py-4 text-sm font-bold transition-colors"
                    >
                      <Crown size={16} />
                      <span>Unlock with PRO</span>
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Syllabus Accordion Preview */}
            {course.metadata?.marketing_syllabus && course.metadata.marketing_syllabus.length > 0 && (
              <div className="border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden bg-white dark:bg-gray-900 relative z-20">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpandedSyllabus(!expandedSyllabus);
                  }}
                  className="w-full flex items-center justify-between px-5 py-3.5 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-all focus:outline-none"
                >
                  <span className="flex items-center gap-2">
                    <BookOpen size={14} className="text-brand-500" />
                    <span>View Curriculum</span>
                  </span>
                  {expandedSyllabus ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>

                <AnimatePresence initial={false}>
                  {expandedSyllabus && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden border-t border-gray-100 dark:border-gray-800"
                    >
                      <ul className="px-5 py-4 space-y-3">
                        {course.metadata.marketing_syllabus.map((item: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-2.5 text-xs text-gray-600 dark:text-gray-400 font-medium">
                            <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 text-[9px] font-bold mt-0.5">
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
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
