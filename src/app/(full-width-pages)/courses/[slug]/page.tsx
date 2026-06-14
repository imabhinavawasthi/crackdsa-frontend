"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft, 
  CheckCircle2, 
  BookOpen, 
  PlayCircle, 
  Trophy, 
  Star,
  Users,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Code2,
  Terminal,
  Cpu
} from "lucide-react";
import { CourseSummary, Instructor } from "@/types/course";
import { fetchCourseDetail } from "@/api/courses";
import { CompareSection } from "@/components/common/CompareSection";
import { ContactFooterCard } from "@/components/common/ContactFooterCard";
import { InstructorSection } from "@/components/courses/InstructorSection";
import { FeedbackSection } from "@/components/courses/FeedbackSection";

// Reusable animations
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export default function CourseLandingPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  
  const [expandedSyllabus, setExpandedSyllabus] = useState<number | null>(0);
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  
  const [course, setCourse] = useState<CourseSummary | null>(null);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCourseData() {
      if (!slug) return;
      try {
        const data = await fetchCourseDetail(slug);
        setCourse(data);
        
        // Fetch instructors independently using instructor_ids
        if (data && data.instructor_ids && data.instructor_ids.length > 0) {
          const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
          const res = await fetch(`${backendUrl}/api/v1/instructors/`);
          if (res.ok) {
            const result = await res.json();
            const allInstructors = result.items || [];
            const matchedInstructors = allInstructors.filter((i: any) => data.instructor_ids.includes(i.id));
            setInstructors(matchedInstructors);
          }
        }
      } catch (err) {
        console.error("Failed to fetch course data", err);
        setCourse(null);
      } finally {
        setLoading(false);
      }
    }
    fetchCourseData();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0B0F19]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-[#0B0F19]">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Course not found</h1>
        <button onClick={() => router.push("/courses")} className="text-brand-500 hover:underline">
          Return to Courses
        </button>
      </div>
    );
  }

  // Fallback Icon
  let Icon = Code2;
  if (course.id.includes("python") || course.slug.includes("python")) Icon = Terminal;
  if (course.id.includes("os") || course.slug.includes("system-design")) Icon = Cpu;

  const primaryInstructor = instructors[0] || { name: "CrackDSA Faculty", company: "Industry Expert", color: "from-brand-500 to-indigo-600" };

  // Determine Duration Text (Weeks/Hours or both)
  const wks = course.metadata?.duration_weeks || 0;
  const hrs = course.metadata?.duration_hours || 0;
  let durationText = "";
  if (wks > 0 && hrs > 0) {
    durationText = `${wks} Wks / ${hrs} Hrs`;
  } else if (wks > 0) {
    durationText = `${wks} Wks`;
  } else if (hrs > 0) {
    durationText = `${hrs} Hrs`;
  } else {
    durationText = "Self-Paced";
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0B0F19] selection:bg-brand-500/30 font-sans">
      
      {/* --- Simple Marketing Navbar --- */}
      <nav className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/80 dark:bg-[#0B0F19]/80 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/courses" className="flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
            <ChevronLeft size={20} />
            <span className="text-sm font-bold">Back to Academy</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href={`/checkout/course/${course.slug}`}
              className="px-5 py-2 text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-full transition-colors shadow-lg shadow-brand-500/20"
            >
              Enroll Now
            </Link>
            <Link
              href={`/courses/${course.slug}/learn`}
              className="hidden sm:block px-5 py-2 text-sm font-bold text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              Go to Classroom
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative pb-24">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-brand-500/10 rounded-full blur-[120px] pointer-events-none" />

        {/* --- 1. Hero Section (2-Column Grid) --- */}
        <section className="relative pt-16 pb-16 px-4">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Left Content */}
            <div className="space-y-8 text-center lg:text-left order-2 lg:order-1">
              <motion.div initial="hidden" animate="visible" variants={fadeIn}>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-black uppercase tracking-widest border border-brand-500/20">
                  {course.metadata?.difficulty || "Beginner"} Level
                </span>
              </motion.div>

              <motion.h1 
                initial="hidden" animate="visible" variants={fadeIn}
                className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-[1.1]"
              >
                {course.title}
              </motion.h1>

              <motion.div 
                initial="hidden" animate="visible" variants={fadeIn}
                className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
              >
                {/* Render HTML course description with line clamping */}
                <div 
                  className={`prose dark:prose-invert prose-lg max-w-none transition-all duration-300 ${isDescExpanded ? "" : "line-clamp-3"}`}
                  dangerouslySetInnerHTML={{ __html: course.description }}
                />
                
                <button 
                  onClick={() => setIsDescExpanded(!isDescExpanded)}
                  className="mt-3 text-sm font-bold text-brand-500 hover:text-brand-600 transition-colors flex items-center gap-1 mx-auto lg:mx-0"
                >
                  {isDescExpanded ? "Show Less" : "Read More..."}
                  {isDescExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              </motion.div>

              {/* Call to Action Button */}
              <motion.div 
                initial="hidden" animate="visible" variants={fadeIn}
                className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4"
              >
                <Link
                  href={`/checkout/course/${course.slug}`}
                  className="px-8 py-4 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl font-black text-lg transition-colors shadow-lg shadow-brand-500/30 w-full sm:w-auto flex items-center justify-center gap-2"
                >
                  Enroll Now - ₹{course.price}
                </Link>
              </motion.div>

              {/* Trust Badges */}
              <motion.div 
                initial="hidden" animate="visible" variants={fadeIn}
                className="flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-8 pt-4"
              >
                {(course.metadata?.number_of_students || 0) > 0 && (
                  <div className="flex items-center gap-2">
                    <Users className="text-brand-500 w-5 h-5 shrink-0" />
                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                      {course.metadata?.number_of_students?.toLocaleString()}+ Students
                    </span>
                  </div>
                )}
                {(course.metadata?.rating || 0) > 0 && (
                  <div className="flex items-center gap-2">
                    <Star className="text-amber-500 w-5 h-5 shrink-0" />
                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                      {course.metadata?.rating}/5 Rating
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <ShieldCheck className="text-emerald-500 w-5 h-5 shrink-0" />
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Lifetime Access</span>
                </div>
              </motion.div>
            </div>

            {/* Right Thumbnail */}
            <motion.div 
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="order-1 lg:order-2 w-full aspect-video lg:aspect-[4/3] rounded-3xl relative bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-800 overflow-hidden shadow-2xl shadow-brand-500/10 group"
            >
              {course.metadata?.thumbnail_url ? (
                <img 
                  src={course.metadata.thumbnail_url} 
                  alt={`${course.title} thumbnail`} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center opacity-30">
                  <Icon className="w-32 h-32 text-gray-400 dark:text-gray-500" />
                </div>
              )}
            </motion.div>

          </div>
        </section>

        {/* --- 2. Stats & Instructor Card --- */}
        <section className="px-4 max-w-6xl mx-auto pt-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 md:p-8 shadow-xl shadow-gray-200/50 dark:shadow-none flex flex-col md:flex-row items-center gap-8 justify-between"
          >
            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 md:gap-10 w-full md:w-auto flex-1">
              <div className="space-y-1">
                <p className="text-xs font-black uppercase text-gray-400 tracking-wider">Duration</p>
                <p className="text-2xl font-black text-gray-900 dark:text-white">
                  {durationText.split(" ")[0]} <span className="text-sm text-gray-500 font-bold ml-1">{durationText.substring(durationText.indexOf(" ") + 1)}</span>
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-black uppercase text-gray-400 tracking-wider">Problems</p>
                <p className="text-2xl font-black text-gray-900 dark:text-white">{course.total_problems}+</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-black uppercase text-gray-400 tracking-wider">Lectures</p>
                <p className="text-2xl font-black text-gray-900 dark:text-white">{course.total_videos || 0}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-black uppercase text-gray-400 tracking-wider">Projects</p>
                <p className="text-2xl font-black text-gray-900 dark:text-white">{course.metadata?.total_projects || 0}</p>
              </div>
            </div>

            {/* Instructor */}
            {primaryInstructor && (
              <div className="w-full md:w-auto pl-0 md:pl-8 border-t md:border-t-0 md:border-l border-gray-100 dark:border-gray-800 pt-6 md:pt-0 shrink-0">
                <p className="text-[10px] font-black uppercase text-gray-400 tracking-wider mb-3">Taught By</p>
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${primaryInstructor.color} flex items-center justify-center text-white font-bold text-lg shadow-inner overflow-hidden`}>
                    {primaryInstructor.profile_image_url ? (
                      <img src={primaryInstructor.profile_image_url} alt={primaryInstructor.name} className="w-full h-full object-cover" />
                    ) : (
                      primaryInstructor.name.charAt(0)
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{primaryInstructor.name}</p>
                    <p className="text-xs text-brand-600 dark:text-brand-400 font-semibold">{primaryInstructor.company}</p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </section>

        {/* --- 2.5 Instructor Section --- */}
        {instructors.length > 0 && (
          <InstructorSection instructors={instructors} />
        )}

        {/* --- 2.7 Compare Section --- */}
        <CompareSection />

        {/* --- 3. Curriculum Section --- */}
        <section className="px-4 max-w-4xl mx-auto pt-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-4">Course Curriculum</h2>
            <p className="text-gray-600 dark:text-gray-400">Everything you need to master {course.title.split(" ")[0]}</p>
          </div>

          <div className="space-y-4">
            {course.metadata?.marketing_syllabus?.map((topic, idx) => (
              <div 
                key={idx}
                className="border border-gray-200 dark:border-gray-800 rounded-2xl bg-white dark:bg-gray-900/50 overflow-hidden transition-all hover:border-brand-500/30"
              >
                <button
                  onClick={() => setExpandedSyllabus(expandedSyllabus === idx ? null : idx)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left"
                >
                  <div className="flex items-center gap-4">
                    <span className={`flex w-8 h-8 rounded-full items-center justify-center text-xs font-bold ${expandedSyllabus === idx ? "bg-brand-500 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-500"}`}>
                      {idx + 1}
                    </span>
                    <span className="text-base font-bold text-gray-900 dark:text-white">{topic}</span>
                  </div>
                  {expandedSyllabus === idx ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
                </button>
                
                <AnimatePresence>
                  {expandedSyllabus === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden border-t border-gray-100 dark:border-gray-800"
                    >
                      <div className="p-6 bg-gray-50 dark:bg-gray-900/20 text-sm text-gray-600 dark:text-gray-400 space-y-4">
                        <div className="flex items-center gap-3">
                          <PlayCircle size={16} className="text-brand-500" />
                          <span>Detailed concept breakdown video lectures.</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <BookOpen size={16} className="text-brand-500" />
                          <span>In-depth reading materials and quick-revision cheat sheets.</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <CheckCircle2 size={16} className="text-brand-500" />
                          <span>Curated problem sets specifically mapped to this week's goals.</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </section>

        {/* --- 3.5 Feedback Section --- */}
        {course.metadata?.feedbacks && course.metadata.feedbacks.length > 0 && (
          <FeedbackSection feedbacks={course.metadata.feedbacks} />
        )}

        {/* --- 4. Pricing & Final CTA Section --- */}
        <section className="px-4 max-w-5xl mx-auto pt-24">
          <div className="bg-gradient-to-br from-brand-900 to-indigo-950 rounded-[2.5rem] p-8 md:p-12 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/30 rounded-full blur-[80px]" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/30 rounded-full blur-[80px]" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
              
              <div className="flex-1 space-y-6 text-center md:text-left">
                <h2 className="text-3xl md:text-4xl font-extrabold">Ready to clear your interviews?</h2>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 justify-center md:justify-start">
                    <CheckCircle2 className="text-brand-400" />
                    <span className="font-medium text-gray-200">Lifetime access to all materials</span>
                  </li>
                  <li className="flex items-center gap-3 justify-center md:justify-start">
                    <CheckCircle2 className="text-brand-400" />
                    <span className="font-medium text-gray-200">1:1 Doubt resolution support</span>
                  </li>
                  <li className="flex items-center gap-3 justify-center md:justify-start">
                    <CheckCircle2 className="text-brand-400" />
                    <span className="font-medium text-gray-200">Premium Discord community access</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl w-full md:w-96 shrink-0 text-center">
                <div className="mb-2">
                  <span className="text-gray-300 font-bold uppercase tracking-widest text-xs">Standalone Price</span>
                </div>
                <div className="flex items-baseline justify-center gap-2 mb-6">
                  <span className="text-5xl font-black">₹{course.price}</span>
                  <span className="text-xl text-gray-400 line-through">₹{course.original_price}</span>
                </div>
                
                <Link
                  href={`/checkout/course/${course.slug}`}
                  className="flex items-center justify-center gap-2 w-full rounded-2xl bg-brand-500 hover:bg-brand-600 text-white px-6 py-4 text-base font-bold transition-colors shadow-lg shadow-brand-500/25 mb-4"
                >
                  Buy Course Now
                </Link>

                <p className="text-xs text-gray-300 mb-4">OR</p>

                <Link
                  href="/checkout/pro"
                  className="flex items-center justify-center gap-2 w-full rounded-2xl bg-white text-brand-900 hover:bg-gray-100 px-6 py-4 text-sm font-bold transition-colors"
                >
                  <Trophy size={16} />
                  Get PRO to Unlock All
                </Link>
              </div>

            </div>
          </div>
        </section>

        {/* --- 5. Support / Contact Footer --- */}
        <ContactFooterCard />

      </main>
    </div>
  );
}
