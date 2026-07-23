"use client";

import { useState, useEffect } from "react";
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
  Cpu,
  Play
} from "lucide-react";
import { CourseSummary, Instructor } from "@/types/course";
import { fetchCourseDetail } from "@/api/courses";
import { CompareSection } from "@/components/common/CompareSection";
import { ContactFooterCard } from "@/components/common/ContactFooterCard";
import { InstructorSection } from "@/components/courses/InstructorSection";
import { FeedbackSection } from "@/components/courses/FeedbackSection";
import { CompareProModal } from "@/components/courses/CompareProModal";
import { BACKEND_URL } from "@/config/api";
import { useAuth } from "@/context/AuthContext";
import AspectFallbackImage from "@/components/common/AspectFallbackImage";

// Reusable animations
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export default function CourseLandingPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  
  const { user, isLoggedIn } = useAuth();
  
  const [expandedSyllabus, setExpandedSyllabus] = useState<number | null>(0);
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  
  const [course, setCourse] = useState<CourseSummary | null>(null);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);


  // Check if student is enrolled in the course
  const isEnrolled = isLoggedIn && user?.enrolled_courses?.some((c: any) => c.course_id === slug || c.course_id === course?.id);
  const isProAccess = isEnrolled && user?.pro_courses?.some((c: any) => c.course_id === slug || c.course_id === course?.id);
  const isPurchasedAccess = isEnrolled && user?.purchased_courses?.some((c: any) => c.course_id === slug || c.course_id === course?.id);

  useEffect(() => {
    async function fetchCourseData() {
      if (!slug) return;
      try {
        const data = await fetchCourseDetail(slug);
        setCourse(data);
        
        // Fetch instructors independently using instructor_ids
        if (data && data.instructor_ids && data.instructor_ids.length > 0) {
          const backendUrl = BACKEND_URL;
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
        <Link href="/courses" className="text-brand-500 hover:underline">
          Return to Courses
        </Link>
      </div>
    );
  }

  if (course.status === "upcoming") {
    return (
      <div className="min-h-screen relative overflow-hidden bg-gray-50/50 dark:bg-[#0B0F19] flex items-center justify-center p-4 sm:p-6 md:p-10">
        {/* Background blobs */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-brand-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Content card */}
        <div className="relative z-10 w-full max-w-4xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-[2.5rem] p-6 sm:p-10 shadow-2xl flex flex-col md:flex-row gap-8 sm:gap-10 items-center">
          
          {/* Left Column: Image Banner */}
          <div className="w-full md:w-[320px] shrink-0">
            <AspectFallbackImage
              src={course.metadata?.thumbnail_url}
              localSrc={`/images/course/${course.slug}.png`}
              alt={`${course.title} thumbnail`}
              title={course.title}
              subtitle="Upcoming Course"
              className="rounded-3xl border border-gray-200 dark:border-gray-800 shadow-md"
            />
          </div>

          {/* Right Column: Text and Details */}
          <div className="flex-1 space-y-5 text-left w-full">
            <div className="flex flex-wrap items-center gap-3">
              <Link 
                href="/courses"
                className="inline-flex items-center gap-1.5 text-[10px] font-bold text-gray-400 dark:text-gray-500 hover:text-brand-500 transition-colors uppercase tracking-widest"
              >
                <ChevronLeft size={12} className="stroke-[2.5]" />
                <span>Catalog</span>
              </Link>
              <span className="rounded-lg bg-gradient-to-r from-brand-500 to-indigo-500 text-white px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest shadow-md shadow-brand-500/15">
                Upcoming Course
              </span>
              {course.is_pro && (
                <span className="text-[9px] font-black bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2 py-0.5 rounded-lg uppercase tracking-wider">
                  PRO Included
                </span>
              )}
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">
                {course.title}
              </h1>
              <div 
                className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed prose prose-sm dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: course.description }}
              />
            </div>

            {course.tags && course.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {course.tags.map((tag) => (
                  <span 
                    key={tag}
                    className="px-3 py-1.5 rounded-xl bg-gray-50 dark:bg-gray-800/60 text-[11px] font-bold text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-800/80"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <div className="border-t border-gray-100 dark:border-gray-800/80 pt-4 flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Expected Price</span>
                <div className="flex items-baseline gap-2">
                  {course.price === 0 ? (
                    <span className="text-2xl font-black text-emerald-500">Free</span>
                  ) : (
                    <>
                      <span className="text-2xl font-black text-gray-900 dark:text-white">₹{course.price}</span>
                      {course.original_price > course.price && (
                        <span className="text-sm font-bold text-gray-400 line-through">₹{course.original_price}</span>
                      )}
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200/60 dark:border-gray-800/60 text-xs font-semibold text-gray-500 dark:text-gray-400">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
                </span>
                Curriculum in Development
              </div>
            </div>
          </div>
        </div>
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
            {isEnrolled ? (
              <Link
                href={`/courses/${course.slug}/learn`}
                className="px-5 py-2 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-full transition-colors shadow-lg shadow-emerald-500/20"
              >
                Go to Classroom
              </Link>
            ) : (
              <>
                <button
                  onClick={() => setIsCompareModalOpen(true)}
                  className="hidden md:flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-brand-600 dark:text-brand-400 bg-brand-50 hover:bg-brand-100 dark:bg-brand-500/10 dark:hover:bg-brand-500/20 rounded-full transition-colors"
                >
                  <Trophy size={16} /> Compare PRO
                </button>
                <Link
                  href={`/checkout/course/${course.slug}`}
                  className="px-5 py-2 text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-full transition-colors shadow-lg shadow-brand-500/20"
                >
                  Enroll Now
                </Link>
              </>
            )}
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
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4 w-full"
              >
                {isEnrolled ? (
                  <div className="w-full sm:w-auto flex flex-col items-center lg:items-start gap-3">
                    <Link
                      href={`/courses/${course.slug}/learn`}
                      className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-lg transition-all shadow-lg shadow-emerald-500/35 w-full sm:w-auto flex items-center justify-center gap-2"
                    >
                      <Play size={22} className="fill-white" />
                      <span>Enter Classroom</span>
                    </Link>
                    <div className="flex items-center gap-2 text-sm font-bold text-emerald-600 dark:text-emerald-450 mt-1">
                      <CheckCircle2 size={16} />
                      {isProAccess ? (
                        <span>You are enrolled (Included in Pro)</span>
                      ) : isPurchasedAccess ? (
                        <span>You are enrolled (Purchased)</span>
                      ) : (
                        <span>You are enrolled</span>
                      )}
                    </div>
                  </div>
                ) : (
                  <>
                    <Link
                      href={`/checkout/course/${course.slug}`}
                      className="px-8 py-4 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl font-black text-lg transition-colors shadow-lg shadow-brand-500/30 w-full sm:w-auto flex items-center justify-center gap-2"
                    >
                      Enroll Now - ₹{course.price}
                    </Link>
                    {course.is_pro && (
                      <Link
                        href="/checkout/pro"
                        className="px-8 py-4 bg-white hover:bg-gray-50 text-gray-900 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white border-2 border-gray-200 dark:border-gray-700 rounded-2xl font-black text-lg transition-colors w-full sm:w-auto flex items-center justify-center gap-2"
                      >
                        <Trophy size={20} className="text-amber-500" /> Unlock with PRO
                      </Link>
                    )}
                  </>
                )}
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
              className="order-1 lg:order-2 w-full lg:w-[480px] shrink-0"
            >
              {course && (
                <AspectFallbackImage
                  src={course.metadata?.thumbnail_url}
                  localSrc={`/images/course/${course.slug}.png`}
                  alt={`${course.title} thumbnail`}
                  title={course.title}
                  subtitle={`${course.metadata?.difficulty || "Beginner"} • ${course.metadata?.duration_weeks || 0} weeks`}
                  className="rounded-3xl shadow-2xl shadow-brand-500/10 border border-gray-200 dark:border-gray-800"
                />
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
            {course.metadata?.marketing_syllabus?.map((topic: any, idx: number) => (
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
        {!isEnrolled && (
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
                    {course.price === 0 ? (
                      <span className="text-5xl font-black text-emerald-400">Free</span>
                    ) : (
                      <>
                        <span className="text-5xl font-black">₹{course.price}</span>
                        {course.original_price > course.price && (
                          <span className="text-xl text-gray-400 line-through">₹{course.original_price}</span>
                        )}
                      </>
                    )}
                  </div>
                  
                  <Link
                    href={`/checkout/course/${course.slug}`}
                    className="flex items-center justify-center gap-2 w-full rounded-2xl bg-brand-500 hover:bg-brand-600 text-white px-6 py-4 text-base font-bold transition-colors shadow-lg shadow-brand-500/25 mb-4"
                  >
                    {course.price === 0 ? "Enroll for Free" : "Buy Course Now"}
                  </Link>

                  {course.is_pro && (
                    <>
                      <p className="text-xs text-gray-300 mb-4">OR</p>

                      <Link
                        href="/checkout/pro"
                        className="flex items-center justify-center gap-2 w-full rounded-2xl bg-white text-brand-900 hover:bg-gray-100 px-6 py-4 text-sm font-bold transition-colors"
                      >
                        <Trophy size={16} />
                        Unlock with PRO
                      </Link>
                    </>
                  )}
                </div>

              </div>
            </div>
          </section>
        )}

        {/* --- 5. Support / Contact Footer --- */}
        <ContactFooterCard />

        {/* Compare PRO Modal */}
        <CompareProModal 
          isOpen={isCompareModalOpen}
          onClose={() => setIsCompareModalOpen(false)}
          courseTitle={course.title}
          coursePrice={course.price}
        />
      </main>
    </div>
  );
}
