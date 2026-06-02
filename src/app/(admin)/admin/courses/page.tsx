"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { getStoredToken } from "@/functions/auth";
import Button from "@/components/ui/button/Button";
import { 
  Lock, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  BookOpen, 
  HelpCircle,
  FileText,
  Video,
  Loader2,
  AlertCircle,
  Eye,
  Tag,
  Layers,
  Users,
  DollarSign
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

type InstructorSchema = {
  name: string;
  role: string;
  company: string;
  color: string;
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
  created_at?: string;
};

export default function AdminCoursesPage() {
  const { user, isLoading: authLoading, isLoggedIn } = useAuth();
  const router = useRouter();

  // State for courses catalog
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "upcoming" | "draft">("all");
  const [categoryFilter, setCategoryFilter] = useState<"all" | "interview-prep" | "core-dsa" | "system-design" | "advanced">("all");

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

  // Fetch courses with all_status=true
  const fetchCourses = useCallback(async () => {
    const token = getStoredToken();
    if (!token) return;

    try {
      setLoading(true);
      setError(null);
      
      const res = await fetch(`${backendUrl}/api/v1/admin/courses/`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!res.ok) {
        throw new Error(`Failed to load courses: ${res.statusText}`);
      }

      const data = await res.json();
      setCourses(data);
    } catch (err: unknown) {
      console.error("Failed to load admin courses:", err);
      const errMessage = err instanceof Error ? err.message : String(err);
      setError(errMessage || "Failed to load admin courses catalog.");
    } finally {
      setLoading(false);
    }
  }, [backendUrl]);

  useEffect(() => {
    if (isLoggedIn && user?.roles?.includes("admin")) {
      fetchCourses();
    }
  }, [isLoggedIn, user, fetchCourses]);

  useEffect(() => {
    document.title = "Courses & Syllabus Catalog | CrackDSA Admin";
  }, []);

  // Handle soft delete
  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to soft-delete the course "${title}"? Students will no longer see it, and it will be hidden from this list.`)) {
      return;
    }

    const token = getStoredToken();
    if (!token) return;

    try {
      const res = await fetch(`${backendUrl}/api/v1/admin/courses/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!res.ok) {
        throw new Error("Failed to delete the course.");
      }

      fetchCourses();
    } catch (err: unknown) {
      const errMessage = err instanceof Error ? err.message : String(err);
      alert(errMessage || "Delete transaction failed.");
    }
  };

  // Filter & Search computations
  const filteredCourses = courses.filter((course) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      course.title.toLowerCase().includes(query) || 
      course.slug.toLowerCase().includes(query) ||
      (course.description && course.description.toLowerCase().includes(query));

    const matchesStatus = 
      statusFilter === "all" || course.status === statusFilter;

    const matchesCategory = 
      categoryFilter === "all" || course.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "interview-prep": return "Interview Prep";
      case "core-dsa": return "Core DSA";
      case "system-design": return "System Design";
      case "advanced": return "Advanced Topics";
      default: return category;
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 size={32} className="animate-spin text-brand-500" />
        <p className="text-gray-500 dark:text-gray-400 text-sm font-semibold">Verifying secure admin parameters...</p>
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
    <div className="max-w-7xl mx-auto space-y-8 pb-20 px-4">
      
      {/* Header Dashboard */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-100 dark:border-gray-800/80 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-955 dark:text-white tracking-tight flex items-center gap-2.5">
            <BookOpen className="text-brand-500" size={28} />
            Academy Courses
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-semibold mt-1">
            Build learning cohorts, define co-instructors team, customize dynamic pricing, and build curriculum syllabus outlines.
          </p>
        </div>
        <Button 
          onClick={() => router.push("/admin/courses/add")}
          startIcon={<Plus size={16} />}
          variant="primary"
          size="sm"
          className="self-start sm:self-center"
        >
          Add New Course
        </Button>
      </div>

      {/* Filtering Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800/70 p-4.5 rounded-2xl">
        
        {/* Search Input bar */}
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text"
            placeholder="Search by title, description, or slug..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-205 dark:border-gray-800 bg-transparent text-sm text-gray-955 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500 dark:focus:ring-brand-400 placeholder:text-gray-400 font-medium"
          />
        </div>

        {/* Dynamic Category and Status Filtering Badges */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Category Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-gray-400 uppercase tracking-wider">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as any)}
              className="px-3.5 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-transparent text-xs font-bold text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              <option value="all">All Categories</option>
              <option value="interview-prep">Interview Prep</option>
              <option value="core-dsa">Core DSA</option>
              <option value="system-design">System Design</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          {/* Status Tab Filters */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-gray-100 dark:bg-gray-800">
            {(["all", "active", "upcoming", "draft"] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                  statusFilter === status 
                    ? "bg-white dark:bg-gray-900 text-gray-955 dark:text-white shadow-sm"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-955 dark:hover:text-gray-200"
                }`}
              >
                {status}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Main Catalog Contents */}
      {loading ? (
        <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-8 space-y-4 animate-pulse">
          <div className="h-6 w-1/4 bg-gray-100 dark:bg-gray-800 rounded-lg" />
          <div className="space-y-3 pt-2">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-16 w-full bg-gray-55 dark:bg-gray-800/40 rounded-xl" />
            ))}
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-500/5 border border-red-500/10 rounded-2xl p-6 flex items-start gap-3">
          <AlertCircle size={20} className="text-red-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-black text-red-600">Database Connection Failure</h4>
            <p className="text-xs text-red-500/80 mt-1 font-semibold">{error}</p>
          </div>
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl space-y-4">
          <BookOpen size={44} className="mx-auto text-gray-300 dark:text-gray-700" />
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-gray-955 dark:text-white">No Courses Found</h3>
            <p className="text-xs text-gray-400 max-w-sm mx-auto">
              No academy courses matched your search queries, category tags, or active filtering parameters.
            </p>
          </div>
          <div className="pt-2">
            <Button size="sm" variant="outline" onClick={() => { setSearchQuery(""); setStatusFilter("all"); setCategoryFilter("all"); }}>
              Reset Filters
            </Button>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-2xl overflow-hidden shadow-theme-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-800/30">
                  <th className="px-6 py-4.5 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Course & Slug</th>
                  <th className="px-6 py-4.5 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Category</th>
                  <th className="px-6 py-4.5 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Instructors</th>
                  <th className="px-6 py-4.5 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Syllabus Stats</th>
                  <th className="px-6 py-4.5 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Pricing</th>
                  <th className="px-6 py-4.5 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4.5 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60">
                {filteredCourses.map((course) => {
                  return (
                    <tr 
                      key={course.id}
                      className="hover:bg-gray-50/40 dark:hover:bg-gray-800/10 transition-all group"
                    >
                      {/* Course Details */}
                      <td className="px-6 py-4.5 max-w-sm">
                        <div className="flex items-start gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 font-bold border border-brand-500/10">
                            <BookOpen size={16} />
                          </div>
                          <div className="space-y-1">
                            <Link 
                              href={`/admin/courses/${course.id}`}
                              className="font-bold text-sm text-gray-900 dark:text-white leading-tight hover:text-brand-500 dark:hover:text-brand-400 transition-colors"
                            >
                              {course.title}
                            </Link>
                            <div className="text-[10px] font-mono bg-gray-50 dark:bg-gray-800/40 text-gray-400 px-2 py-0.5 rounded border border-gray-100 dark:border-gray-800 inline-block font-semibold">
                              /{course.slug}
                            </div>
                            {course.description && (
                              <div className="text-xs text-gray-400 line-clamp-1 mt-1 font-medium" dangerouslySetInnerHTML={{ __html: course.description }} />
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-6 py-4.5 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/10">
                          <Layers size={10} />
                          {getCategoryLabel(course.category)}
                        </span>
                      </td>

                      {/* Instructors */}
                      <td className="px-6 py-4.5">
                        <div className="flex flex-wrap gap-1.5 max-w-[180px]">
                          {course.instructors && course.instructors.length > 0 ? (
                            course.instructors.map((inst, index) => (
                              <span 
                                key={index}
                                className={`inline-flex items-center px-2 py-0.75 rounded-md text-[10px] font-bold border leading-none bg-gradient-to-r ${inst.color || "from-gray-500 to-slate-500"} text-white border-transparent`}
                              >
                                {inst.name}
                              </span>
                            ))
                          ) : (
                            <span className="text-[10px] font-semibold text-gray-400 italic">Unallocated</span>
                          )}
                        </div>
                      </td>

                      {/* Dynamic Syllabus Metrics */}
                      <td className="px-6 py-4.5 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-gray-600 dark:text-gray-300">
                            <Video size={12} className="text-brand-500" />
                            {course.total_videos}
                          </span>
                          <span className="text-gray-300 dark:text-gray-700">|</span>
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-gray-600 dark:text-gray-300">
                            <HelpCircle size={12} className="text-purple-500" />
                            {course.total_problems}
                          </span>
                          <span className="text-gray-300 dark:text-gray-700">|</span>
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-gray-600 dark:text-gray-300">
                            <FileText size={12} className="text-orange-500" />
                            {course.total_articles}
                          </span>
                        </div>
                      </td>

                      {/* Pricing Tiers */}
                      <td className="px-6 py-4.5 whitespace-nowrap">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1 text-xs font-black text-gray-900 dark:text-white">
                            <DollarSign size={12} className="text-emerald-500 shrink-0" />
                            <span>{course.price === 0 ? "FREE" : `₹${course.price}`}</span>
                          </div>
                          {course.original_price > course.price && (
                            <div className="text-[10px] text-gray-400 line-through pl-3.5 font-bold">
                              ₹{course.original_price}
                            </div>
                          )}
                          <div>
                            <span className={`inline-block text-[8px] font-black uppercase tracking-wider px-1 rounded ${
                              course.is_pro 
                                ? "bg-amber-500/10 text-amber-600 border border-amber-500/10" 
                                : "bg-gray-100 dark:bg-gray-800 text-gray-400"
                            }`}>
                              {course.is_pro ? "PRO" : "FREE MODULE"}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Status badge */}
                      <td className="px-6 py-4.5 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          course.status === "active" 
                            ? "bg-green-500/10 text-green-600 border border-green-500/10" 
                            : course.status === "upcoming"
                            ? "bg-blue-500/10 text-blue-600 border border-blue-500/10"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-400 border border-transparent"
                        }`}>
                          {course.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2.5">
                          <button
                            onClick={() => router.push(`/admin/courses/${course.id}`)}
                            className="p-2 rounded-lg bg-gray-50 hover:bg-brand-500/10 text-gray-600 dark:text-gray-400 dark:bg-gray-800/40 hover:text-brand-600 dark:hover:text-brand-400 border border-transparent dark:border-gray-800 transition-all"
                            title="View syllabus tree details"
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            onClick={() => router.push(`/admin/courses/${course.id}/edit`)}
                            className="p-2 rounded-lg bg-gray-50 hover:bg-brand-500/10 text-gray-600 dark:text-gray-400 dark:bg-gray-800/40 hover:text-brand-600 dark:hover:text-brand-400 border border-transparent dark:border-gray-800 transition-all"
                            title="Edit course metadata & builder"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(course.id, course.title)}
                            className="p-2 rounded-lg bg-gray-50 hover:bg-red-500/10 text-gray-600 dark:text-gray-400 dark:bg-gray-800/40 hover:text-red-600 dark:hover:text-red-400 border border-transparent dark:border-gray-800 transition-all"
                            title="Soft delete course"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
