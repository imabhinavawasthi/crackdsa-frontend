"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getStoredToken } from "@/functions/auth";
import Button from "@/components/ui/button/Button";
import { 
  Lock, 
  ArrowLeft, 
  BookOpen, 
  Edit3, 
  Layers, 
  Users, 
  Clock, 
  HelpCircle, 
  FileText, 
  Video, 
  Loader2, 
  AlertCircle, 
  DollarSign, 
  ChevronDown, 
  ChevronRight, 
  ExternalLink,
  Tag
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

type InstructorSchema = {
  name: string;
  role: string;
  company: string;
  color: string;
};

type CourseSectionItem = {
  id: string;
  title: string;
  type: "video" | "problem" | "article";
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
  category: "interview-prep" | "core-dsa" | "system-design" | "advanced";
  instructors: InstructorSchema[];
  tags: string[];
  is_pro: boolean;
  is_popular: boolean;
  status: "active" | "upcoming" | "draft";
  price: number;
  original_price: number;
  total_problems: number;
  total_articles: number;
  total_videos: number;
  curriculum: CourseSection[];
  metadata: Record<string, any>;
};

export default function AdminCourseDetailsPage() {
  const { user, isLoading: authLoading, isLoggedIn } = useAuth();
  const params = useParams();
  const router = useRouter();
  
  const id = params?.id as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Accordion state - stores IDs of expanded sections
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  // Accordion state - stores IDs of expanded subsections
  const [expandedSubsections, setExpandedSubsections] = useState<Record<string, boolean>>({});

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

  const fetchCourseDetails = useCallback(async () => {
    if (!id) return;
    const token = getStoredToken();
    if (!token) return;

    try {
      setLoading(true);
      setError(null);
      
      const res = await fetch(`${backendUrl}/api/v1/admin/courses/${id}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!res.ok) {
        if (res.status === 404) {
          throw new Error("Course ID not found in academy records.");
        }
        throw new Error(`Failed to load details: ${res.statusText}`);
      }

      const data = await res.json();
      setCourse(data);

      // Expand first section by default
      if (data.curriculum && data.curriculum.length > 0) {
        setExpandedSections({ [data.curriculum[0].id]: true });
        
        // Also expand subsections of the first section if any
        if (data.curriculum[0].subsections) {
          const subs: Record<string, boolean> = {};
          data.curriculum[0].subsections.forEach((sub: CourseSubsection) => {
            subs[sub.id] = true;
          });
          setExpandedSubsections(subs);
        }
      }
    } catch (err: unknown) {
      console.error("Failed to load course details:", err);
      const errMessage = err instanceof Error ? err.message : String(err);
      setError(errMessage || "Unable to retrieve course details.");
    } finally {
      setLoading(false);
    }
  }, [backendUrl, id]);

  useEffect(() => {
    if (isLoggedIn && user?.roles?.includes("admin") && id) {
      fetchCourseDetails();
    }
  }, [isLoggedIn, user, id, fetchCourseDetails]);

  useEffect(() => {
    if (course) {
      document.title = `${course.title} | CrackDSA Admin`;
    }
  }, [course]);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const toggleSubsection = (subId: string) => {
    setExpandedSubsections(prev => ({
      ...prev,
      [subId]: !prev[subId]
    }));
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "interview-prep": return "Interview Preparation";
      case "core-dsa": return "Core Data Structures & Algos";
      case "system-design": return "System Design (HLD/LLD)";
      case "advanced": return "Advanced Core Computer Science";
      default: return category;
    }
  };

  const getItemIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video size={14} className="text-brand-500 shrink-0" />;
      case "problem":
        return <HelpCircle size={14} className="text-purple-500 shrink-0" />;
      case "article":
        return <FileText size={14} className="text-orange-500 shrink-0" />;
      default:
        return <BookOpen size={14} className="text-gray-400 shrink-0" />;
    }
  };

  const getItemBadgeStyle = (type: string) => {
    switch (type) {
      case "video": return "bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/10";
      case "problem": return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/10";
      case "article": return "bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/10";
      default: return "bg-gray-100 text-gray-500";
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 size={32} className="animate-spin text-brand-500" />
        <p className="text-gray-500 dark:text-gray-400 text-sm font-semibold">Verifying secure admin credentials...</p>
      </div>
    );
  }

  if (!isLoggedIn || !user?.roles?.includes("admin")) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-8 shadow-lg text-center space-y-6"
        >
          <div className="w-16 h-16 bg-red-500/10 text-red-500 border border-red-500/10 rounded-2xl flex items-center justify-center mx-auto">
            <Lock size={30} />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-black text-gray-955 dark:text-white tracking-tight">Access Prohibited</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
              This environment is strictly reserved for CrackDSA Administrators. You do not possess the required RBAC credentials to view this page.
            </p>
          </div>
          <div className="pt-2">
            <Link href="/dashboard" className="inline-flex w-full items-center justify-center px-5 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold transition-all shadow-md shadow-brand-500/15">
              Return to Student Site
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 px-4">
      
      {/* Back Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link 
            href="/admin/courses" 
            className="p-2.5 rounded-xl border border-gray-250 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:text-gray-955 dark:hover:text-white bg-white dark:bg-gray-900 transition-all shadow-sm"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <span className="text-[10px] font-black text-brand-500 uppercase tracking-widest block leading-none mb-1">Academy Catalog Console</span>
            <h1 className="text-xl sm:text-2xl font-black text-gray-955 dark:text-white tracking-tight">
              Course Details & Syllabus
            </h1>
          </div>
        </div>
        
        {course && (
          <Button 
            onClick={() => router.push(`/admin/courses/${course.id}/edit`)}
            startIcon={<Edit3 size={15} />}
            variant="outline"
            size="sm"
            className="self-start sm:self-center bg-white dark:bg-gray-900 text-gray-800 dark:text-white dark:border-gray-850 hover:bg-gray-50 dark:hover:bg-gray-850"
          >
            Edit Specifications & Syllabus
          </Button>
        )}
      </div>

      {loading ? (
        <div className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-3xl p-12 text-center space-y-4">
          <Loader2 size={32} className="animate-spin text-brand-500 mx-auto" />
          <p className="text-gray-500 dark:text-gray-400 text-sm font-semibold">Pulling course specifications...</p>
        </div>
      ) : error || !course ? (
        <div className="bg-red-500/5 border border-red-500/10 rounded-2xl p-6 flex items-start gap-3">
          <AlertCircle size={20} className="text-red-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-black text-red-600">Failed to Retrieve Details</h4>
            <p className="text-xs text-red-500/80 mt-1 font-semibold">{error || "Course details not found."}</p>
            <Link href="/admin/courses" className="text-xs font-bold text-red-600 underline mt-3 block">
              Back to Course Catalog
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* LEFT PANEL: Course Metadata Specifications */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Basic Spec Sheet */}
            <div className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800/80 rounded-3xl p-6 space-y-6 shadow-theme-xs">
              <div className="space-y-2 border-b border-gray-100 dark:border-gray-850 pb-4">
                <span className="inline-block text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/10">
                  {course.status}
                </span>
                <h3 className="font-black text-lg text-gray-900 dark:text-white leading-tight">{course.title}</h3>
                <div className="text-xs font-mono text-gray-400 font-semibold select-all">/{course.slug}</div>
              </div>

              {/* pricing */}
              <div className="space-y-2.5">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block leading-none">PRICING TIER</span>
                <div className="flex items-baseline gap-2.5">
                  <span className="text-2xl font-black text-gray-900 dark:text-white">₹{course.price}</span>
                  {course.original_price > course.price && (
                    <span className="text-sm text-gray-400 font-bold line-through">₹{course.original_price}</span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className={`inline-block text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                    course.is_pro 
                      ? "bg-amber-500/10 text-amber-600 border border-amber-500/10" 
                      : "bg-gray-100 dark:bg-gray-800 text-gray-400"
                  }`}>
                    {course.is_pro ? "PRO ACCOUNT ONLY" : "FREE TRIAL PERMITTED"}
                  </span>
                  {course.is_popular && (
                    <span className="inline-block text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 border border-emerald-500/10">
                      POPULAR BADGE
                    </span>
                  )}
                </div>
              </div>

              {/* Category */}
              <div className="space-y-1.5 pt-4 border-t border-gray-100 dark:border-gray-850">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block leading-none">ACADEMY DIRECTORY</span>
                <div className="flex items-center gap-2 text-xs font-bold text-gray-700 dark:text-gray-300">
                  <Layers size={13} className="text-brand-500" />
                  <span>{getCategoryLabel(course.category)}</span>
                </div>
              </div>

              {/* co-instructors */}
              <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-gray-850">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block leading-none">LECTURING TEAM ({course.instructors?.length || 0})</span>
                <div className="space-y-2">
                  {course.instructors && course.instructors.length > 0 ? (
                    course.instructors.map((inst, index) => (
                      <div key={index} className="flex items-center gap-2.5 p-2 rounded-xl bg-gray-50 dark:bg-gray-850 border border-gray-100 dark:border-gray-800">
                        <div className={`w-2.5 h-2.5 rounded-full bg-gradient-to-r ${inst.color || "from-brand-500 to-indigo-500"}`} />
                        <div>
                          <div className="text-xs font-black text-gray-900 dark:text-white leading-tight">{inst.name}</div>
                          <div className="text-[10px] text-gray-400 font-semibold">{inst.role} @ {inst.company}</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-gray-400 italic">No co-instructors allocated to this course catalog.</div>
                  )}
                </div>
              </div>

              {/* tags list */}
              {course.tags && course.tags.length > 0 && (
                <div className="space-y-2 pt-4 border-t border-gray-100 dark:border-gray-850">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block leading-none">SEARCH TAGS</span>
                  <div className="flex flex-wrap gap-1.5">
                    {course.tags.map((tag, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1 text-[10px] font-semibold text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-850 px-2 py-0.5 rounded border border-gray-100 dark:border-gray-800">
                        <Tag size={8} />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Description summary */}
              {course.description && (
                <div className="space-y-2 pt-4 border-t border-gray-100 dark:border-gray-850">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block leading-none">PROSPECTUS SUMMARY</span>
                  <div 
                    className="text-xs text-gray-500 dark:text-gray-400 font-medium leading-relaxed max-h-[160px] overflow-y-auto pr-1 select-text"
                    dangerouslySetInnerHTML={{ __html: course.description }}
                  />
                </div>
              )}
            </div>

            {/* Extensible Meta properties bucket */}
            {course.metadata && Object.keys(course.metadata).length > 0 && (
              <div className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800/80 rounded-3xl p-6 space-y-4 shadow-theme-xs">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block leading-none">METADATA BUCKET JSON</span>
                <pre className="text-[10px] font-mono p-4.5 rounded-2xl bg-gray-50 dark:bg-gray-950 text-gray-600 dark:text-gray-400 border border-gray-100 dark:border-gray-850 overflow-x-auto leading-relaxed">
                  {JSON.stringify(course.metadata, null, 2)}
                </pre>
              </div>
            )}

          </div>

          {/* RIGHT PANEL: Nested Curriculum Syllabus accordion tree */}
          <div className="lg:col-span-2 space-y-6">
            
            <div className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-theme-xs">
              
              {/* Syllabus Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-100 dark:border-gray-850 pb-4.5">
                <div>
                  <h3 className="font-black text-base text-gray-900 dark:text-white uppercase tracking-wider">Course Syllabus Curriculum</h3>
                  <p className="text-xs text-gray-400 font-semibold mt-0.5">Accordion-driven curriculum tree showing sections, nested subsections, and teaching assets.</p>
                </div>
                
                {/* Stats recap row */}
                <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-850 p-2 rounded-xl border border-gray-100 dark:border-gray-800 shrink-0 self-start sm:self-auto">
                  <div className="flex items-center gap-1 text-[11px] font-black uppercase text-gray-500 dark:text-gray-400">
                    <Video size={12} className="text-brand-500" />
                    <span>{course.total_videos} Videos</span>
                  </div>
                  <div className="w-1 h-3 bg-gray-300 dark:bg-gray-850 rounded-full" />
                  <div className="flex items-center gap-1 text-[11px] font-black uppercase text-gray-500 dark:text-gray-400">
                    <HelpCircle size={12} className="text-purple-500" />
                    <span>{course.total_problems} Probs</span>
                  </div>
                  <div className="w-1 h-3 bg-gray-300 dark:bg-gray-850 rounded-full" />
                  <div className="flex items-center gap-1 text-[11px] font-black uppercase text-gray-500 dark:text-gray-400">
                    <FileText size={12} className="text-orange-500" />
                    <span>{course.total_articles} Articles</span>
                  </div>
                </div>
              </div>

              {/* Sections Accordion Tree */}
              {!course.curriculum || course.curriculum.length === 0 ? (
                <div className="text-center py-14 bg-gray-50/50 dark:bg-gray-850/20 border border-dashed border-gray-200 dark:border-gray-800 rounded-2xl space-y-3">
                  <BookOpen size={30} className="mx-auto text-gray-400" />
                  <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Syllabus Empty</h4>
                  <p className="text-[11px] text-gray-400 max-w-xs mx-auto">This course list contains zero curriculum outlines. Click edit page to write sections!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {course.curriculum.map((section, sIdx) => {
                    const isSecExpanded = !!expandedSections[section.id];
                    const subCount = section.subsections?.length || 0;
                    const directCount = section.items?.length || 0;

                    return (
                      <div 
                        key={section.id || sIdx}
                        className="border border-gray-150 dark:border-gray-800/80 rounded-2xl bg-white dark:bg-gray-900 overflow-hidden"
                      >
                        {/* Section Header Accordion Trigger */}
                        <button
                          onClick={() => toggleSection(section.id)}
                          className="w-full flex items-center justify-between p-4.5 bg-gray-50/60 dark:bg-gray-850/20 text-left hover:bg-gray-50 dark:hover:bg-gray-850/40 transition-colors border-b border-transparent dark:border-transparent data-[open=true]:border-gray-100 dark:data-[open=true]:border-gray-800"
                          data-open={isSecExpanded}
                        >
                          <div className="flex items-start gap-3.5 pr-4">
                            <span className="flex items-center justify-center w-6.5 h-6.5 rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-black shrink-0 border border-brand-500/10">
                              {sIdx + 1}
                            </span>
                            <div>
                              <h4 className="font-bold text-sm text-gray-900 dark:text-white leading-tight">{section.title}</h4>
                              {section.description && (
                                <p className="text-xs text-gray-400 font-medium mt-0.5 line-clamp-1">{section.description}</p>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3 shrink-0">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
                              {subCount > 0 ? `${subCount} Modules` : `${directCount} Assets`}
                            </span>
                            {isSecExpanded ? <ChevronDown size={16} className="text-gray-400" /> : <ChevronRight size={16} className="text-gray-400" />}
                          </div>
                        </button>

                        {/* Expandable Section Contents */}
                        <AnimatePresence initial={false}>
                          {isSecExpanded && (
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: "auto" }}
                              exit={{ height: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="p-4.5 space-y-4 bg-transparent border-t border-gray-100 dark:border-gray-800">
                                
                                {/* 1. Render Direct Items list if present */}
                                {section.items && section.items.length > 0 && (
                                  <div className="space-y-2">
                                    {section.items.map((item, itemIdx) => (
                                      <div 
                                        key={item.id || itemIdx}
                                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 bg-gray-50/50 dark:bg-gray-850/30 hover:bg-gray-50 dark:hover:bg-gray-850/60 rounded-xl border border-gray-100 dark:border-gray-800/80 transition-colors"
                                      >
                                        <div className="flex items-start gap-2.5">
                                          <div className="mt-0.5 shrink-0">{getItemIcon(item.type)}</div>
                                          <div>
                                            <span className="text-xs font-bold text-gray-900 dark:text-white">{item.title}</span>
                                            {item.is_free && (
                                              <span className="ml-2 text-[8px] font-black uppercase tracking-widest px-1 rounded bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/10">
                                                PREVIEW FREE
                                              </span>
                                            )}
                                            <div className="text-[9px] font-mono text-gray-400 mt-1 select-all">Asset Look-up ID: {item.asset_id}</div>
                                          </div>
                                        </div>

                                        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                                          {item.duration_label && (
                                            <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${getItemBadgeStyle(item.type)}`}>
                                              {item.duration_label}
                                            </span>
                                          )}
                                          
                                          {/* Direct links to view the connected lectures or problems in backend admin */}
                                          {item.type === "video" && (
                                            <Link 
                                              href={`/admin/videos/${item.asset_id}`}
                                              className="p-1 text-gray-400 hover:text-brand-500 transition-colors"
                                              title="Check Admin video assets details"
                                            >
                                              <ExternalLink size={12} />
                                            </Link>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}

                                {/* 2. Render nested Subsections accordion if present */}
                                {section.subsections && section.subsections.length > 0 && (
                                  <div className="space-y-3 pl-3 sm:pl-4 border-l-2 border-gray-100 dark:border-gray-800">
                                    {section.subsections.map((sub, subIdx) => {
                                      const isSubExpanded = !!expandedSubsections[sub.id];
                                      
                                      return (
                                        <div 
                                          key={sub.id || subIdx}
                                          className="border border-gray-150 dark:border-gray-800/80 rounded-xl bg-white dark:bg-gray-900/60 overflow-hidden"
                                        >
                                          {/* Subsection Trigger Header */}
                                          <button
                                            onClick={() => toggleSubsection(sub.id)}
                                            className="w-full flex items-center justify-between p-3.5 bg-gray-50/40 dark:bg-gray-850/10 text-left hover:bg-gray-50 dark:hover:bg-gray-850/30 transition-colors border-b border-transparent data-[open=true]:border-gray-100 dark:data-[open=true]:border-gray-800"
                                            data-open={isSubExpanded}
                                          >
                                            <div>
                                              <h5 className="font-bold text-xs text-gray-900 dark:text-white leading-tight">
                                                {sIdx + 1}.{subIdx + 1} {sub.title}
                                              </h5>
                                              {sub.description && (
                                                <p className="text-[10px] text-gray-400 font-semibold mt-0.5">{sub.description}</p>
                                              )}
                                            </div>
                                            
                                            <div className="flex items-center gap-2 shrink-0">
                                              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest bg-gray-100/80 dark:bg-gray-800/80 px-2 py-0.5 rounded">
                                                {sub.items?.length || 0} items
                                              </span>
                                              {isSubExpanded ? <ChevronDown size={14} className="text-gray-400" /> : <ChevronRight size={14} className="text-gray-400" />}
                                            </div>
                                          </button>

                                          {/* Subsection items list */}
                                          <AnimatePresence initial={false}>
                                            {isSubExpanded && (
                                              <motion.div
                                                initial={{ height: 0 }}
                                                animate={{ height: "auto" }}
                                                exit={{ height: 0 }}
                                                className="overflow-hidden"
                                              >
                                                <div className="p-3 space-y-2 bg-transparent">
                                                  {!sub.items || sub.items.length === 0 ? (
                                                    <div className="text-center py-4 text-[10px] font-bold text-gray-400 italic">No assets linked in this subsection module.</div>
                                                  ) : (
                                                    sub.items.map((item, itemIdx) => (
                                                      <div 
                                                        key={item.id || itemIdx}
                                                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3.5 p-2.5 bg-gray-50/20 dark:bg-gray-850/10 hover:bg-gray-50/50 dark:hover:bg-gray-850/30 rounded-lg border border-gray-100/80 dark:border-gray-800/60 transition-colors"
                                                      >
                                                        <div className="flex items-start gap-2.5">
                                                          <div className="mt-0.5 shrink-0">{getItemIcon(item.type)}</div>
                                                          <div>
                                                            <span className="text-xs font-bold text-gray-900 dark:text-white leading-tight">{item.title}</span>
                                                            {item.is_free && (
                                                              <span className="ml-2 text-[8px] font-black uppercase tracking-widest px-1 rounded bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/10">
                                                                FREE
                                                              </span>
                                                            )}
                                                            <div className="text-[9px] font-mono text-gray-400 select-all leading-none mt-1">Asset ID: {item.asset_id}</div>
                                                          </div>
                                                        </div>

                                                        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                                                          {item.duration_label && (
                                                            <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${getItemBadgeStyle(item.type)}`}>
                                                              {item.duration_label}
                                                            </span>
                                                          )}
                                                          {item.type === "video" && (
                                                            <Link 
                                                              href={`/admin/videos/${item.asset_id}`}
                                                              className="p-1 text-gray-400 hover:text-brand-500 transition-colors"
                                                              title="Check Admin video assets details"
                                                            >
                                                              <ExternalLink size={11} />
                                                            </Link>
                                                          )}
                                                        </div>
                                                      </div>
                                                    ))
                                                  )}
                                                </div>
                                              </motion.div>
                                            )}
                                          </AnimatePresence>
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}

                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              )}

            </div>

          </div>

        </div>
      )}

    </div>
  );
}
