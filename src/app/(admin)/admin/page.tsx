"use client";
 
import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { getStoredToken } from "@/functions/auth";
import { 
  Lock, 
  Video, 
  Clock, 
  Loader2,
  AlertCircle,
  ArrowRight,
  Activity,
  Table,
  FileText,
  BookOpen
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
 
type VideoLecture = {
  id: string;
  title: string;
  duration_seconds: number;
  is_active: boolean;
};
 
type PracticeProblem = {
  id: string;
  is_active: boolean;
};
 
export default function AdminDashboardPage() {
  const { user, isLoading: authLoading, isLoggedIn } = useAuth();
  
  // State for metrics computation
  const [lectures, setLectures] = useState<VideoLecture[]>([]);
  const [problems, setProblems] = useState<PracticeProblem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
 
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
 
  const fetchDashboardStats = useCallback(async () => {
    const token = getStoredToken();
    if (!token) return;
 
    try {
      setLoading(true);
      setError(null);
      
      // Concurrently fetch both Video Lectures and Practice Problems
      const [lecturesRes, problemsRes] = await Promise.all([
        fetch(`${backendUrl}/api/v1/admin/video-lectures`, {
          headers: { "Authorization": `Bearer ${token}` }
        }),
        fetch(`${backendUrl}/api/v1/admin/practice-problems`, {
          headers: { "Authorization": `Bearer ${token}` }
        })
      ]);
 
      if (!lecturesRes.ok) {
        throw new Error(`Failed to fetch video stats: ${lecturesRes.statusText}`);
      }
      if (!problemsRes.ok) {
        throw new Error(`Failed to fetch problem stats: ${problemsRes.statusText}`);
      }
 
      const [lecturesData, problemsData] = await Promise.all([
        lecturesRes.json(),
        problemsRes.json()
      ]);
 
      setLectures(lecturesData);
      setProblems(problemsData);
    } catch (err: unknown) {
      console.error("Failed to load admin dashboard stats:", err);
      const errMessage = err instanceof Error ? err.message : String(err);
      setError(errMessage || "Unable to retrieve database parameters.");
    } finally {
      setLoading(false);
    }
  }, [backendUrl]);
 
  useEffect(() => {
    if (isLoggedIn && user?.roles?.includes("admin")) {
      fetchDashboardStats();
    }
  }, [isLoggedIn, user, fetchDashboardStats]);
 
  useEffect(() => {
    document.title = "Admin Cockpit | CrackDSA";
  }, []);
 
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
          className="max-w-md w-full bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-3xl p-8 shadow-lg text-center space-y-6"
        >
          <div className="w-16 h-16 bg-red-500/10 text-red-500 border border-red-500/10 rounded-2xl flex items-center justify-center mx-auto">
            <Lock size={30} />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-black text-gray-950 dark:text-white tracking-tight">Access Prohibited</h1>
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
 
  // Derived metrics calculations
  const totalLectures = lectures.length;
  const activeLectures = lectures.filter(l => l.is_active).length;
 
  const totalProblems = problems.length;
  const activeProblems = problems.filter(p => p.is_active).length;
 
  let totalDurationSeconds = 0;
  lectures.forEach((lec) => {
    if (lec.is_active) {
      totalDurationSeconds += lec.duration_seconds || 0;
    }
  });
 
  const totalHours = Math.round(totalDurationSeconds / 3600);
 
  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 px-4">
      
      {/* Header Splash */}
      <div className="border-b border-gray-100 dark:border-gray-800/80 pb-6">
        <h1 className="text-2xl sm:text-3xl font-black text-gray-950 dark:text-white tracking-tight">
          Admin Cockpit
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm font-semibold mt-1">
          Welcome back, {user?.full_name || "Admin"}. Monitor course operational metrics and manage asset configurations.
        </p>
      </div>
 
      {/* Database Warning */}
      {error && (
        <div className="bg-red-500/5 border border-red-500/10 rounded-2xl p-6 flex items-start gap-3">
          <AlertCircle size={20} className="text-red-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-black text-red-600">Database Connection Interrupted</h4>
            <p className="text-xs text-red-500/80 mt-1 font-semibold">{error}</p>
          </div>
        </div>
      )}
 
      {/* Grid of Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total Lectures Card */}
        <div className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800/80 p-6 rounded-2xl flex items-start justify-between shadow-theme-xs">
          <div className="space-y-3">
            <span className="text-xs font-black text-gray-400 uppercase tracking-widest block">Video Assets</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-gray-950 dark:text-white leading-none">
                {loading ? "..." : totalLectures}
              </span>
              {!loading && (
                <span className="text-[10px] text-gray-400 font-bold">
                  ({activeLectures} active)
                </span>
              )}
            </div>
          </div>
          <div className="p-3 bg-brand-500/10 text-brand-500 rounded-xl">
            <Video size={20} />
          </div>
        </div>
 
        {/* Total Problems Card */}
        <div className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800/80 p-6 rounded-2xl flex items-start justify-between shadow-theme-xs">
          <div className="space-y-3">
            <span className="text-xs font-black text-gray-400 uppercase tracking-widest block">Practice Problems</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-gray-950 dark:text-white leading-none">
                {loading ? "..." : totalProblems}
              </span>
              {!loading && (
                <span className="text-[10px] text-gray-400 font-bold">
                  ({activeProblems} active)
                </span>
              )}
            </div>
          </div>
          <div className="p-3 bg-purple-500/10 text-purple-500 rounded-xl">
            <Table size={20} />
          </div>
        </div>
 
        {/* Total Hours Card */}
        <div className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800/80 p-6 rounded-2xl flex items-start justify-between shadow-theme-xs">
          <div className="space-y-3">
            <span className="text-xs font-black text-gray-400 uppercase tracking-widest block">Content Hours</span>
            <span className="text-3xl font-black text-gray-950 dark:text-white leading-none">
              {loading ? "..." : `~${totalHours}h`}
            </span>
          </div>
          <div className="p-3 bg-orange-500/10 text-orange-500 rounded-xl">
            <Clock size={20} />
          </div>
        </div>
 
        {/* System Health Card */}
        <div className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800/80 p-6 rounded-2xl flex items-start justify-between shadow-theme-xs">
          <div className="space-y-3">
            <span className="text-xs font-black text-gray-400 uppercase tracking-widest block">System Status</span>
            <div className="flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-full ${error ? "bg-red-500" : "bg-emerald-500 animate-pulse"}`} />
              <span className="text-sm font-bold text-gray-700 dark:text-gray-200">
                {error ? "Degraded" : "Healthy"}
              </span>
            </div>
          </div>
          <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl">
            <Activity size={20} />
          </div>
        </div>
 
      </div>
 
      {/* Quick Navigation Panel */}
      <div className="space-y-4">
        <h3 className="text-xs font-black uppercase text-gray-400 tracking-wider">Management Directories</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Courses Manager Direct Card */}
          <Link href="/admin/courses" className="group block bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800/60 rounded-3xl p-6.5 hover:border-brand-500/40 dark:hover:border-brand-400/40 hover:shadow-lg transition-all space-y-4">
            <div className="flex items-center justify-between">
              <div className="p-3 bg-brand-500/10 text-brand-500 dark:text-brand-400 border border-brand-500/10 rounded-2xl">
                <BookOpen size={22} />
              </div>
              <span className="text-xs font-bold text-brand-500 flex items-center gap-1 group-hover:translate-x-1.5 transition-transform">
                Enter Directory <ArrowRight size={13} />
              </span>
            </div>
            <div className="space-y-1">
              <h4 className="font-black text-base text-gray-900 dark:text-white leading-tight">Courses & Syllabus</h4>
              <p className="text-xs text-gray-500 leading-relaxed font-semibold">
                Create new academy courses, allocate co-instructors, update pricing tags, and construct detailed curriculum syllabus outlines.
              </p>
            </div>
          </Link>

          {/* Videos Manager Direct Card */}
          <Link href="/admin/videos" className="group block bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800/60 rounded-3xl p-6.5 hover:border-brand-500/40 dark:hover:border-brand-400/40 hover:shadow-lg transition-all space-y-4">
            <div className="flex items-center justify-between">
              <div className="p-3 bg-brand-500/10 text-brand-500 dark:text-brand-400 border border-brand-500/10 rounded-2xl">
                <Video size={22} />
              </div>
              <span className="text-xs font-bold text-brand-500 flex items-center gap-1 group-hover:translate-x-1.5 transition-transform">
                Enter Directory <ArrowRight size={13} />
              </span>
            </div>
            <div className="space-y-1">
              <h4 className="font-black text-base text-gray-900 dark:text-white leading-tight">Video Lectures</h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                Manage syllabus videos, configure duration ticks, link assignments, articles, problems, and toggle visibility.
              </p>
            </div>
          </Link>
 
          {/* Problems Manager Direct Card */}
          <Link href="/admin/problems" className="group block bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800/60 rounded-3xl p-6.5 hover:border-purple-500/40 dark:hover:border-purple-400/40 hover:shadow-lg transition-all space-y-4">
            <div className="flex items-center justify-between">
              <div className="p-3 bg-purple-500/10 text-purple-500 dark:text-purple-400 border border-purple-500/10 rounded-2xl">
                <Table size={22} />
              </div>
              <span className="text-xs font-bold text-purple-500 flex items-center gap-1 group-hover:translate-x-1.5 transition-transform">
                Enter Directory <ArrowRight size={13} />
              </span>
            </div>
            <div className="space-y-1">
              <h4 className="font-black text-base text-gray-900 dark:text-white leading-tight">Practice Problems</h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                Manage DSA coding challenges, configure platform origins, specify dynamic attributes, and write elegant solution code.
              </p>
            </div>
          </Link>
 
          {/* Blogs Manager Direct Card */}
          <Link href="/admin/blogs" className="group block bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800/60 rounded-3xl p-6.5 hover:border-emerald-500/40 dark:hover:border-emerald-400/40 hover:shadow-lg transition-all space-y-4">
            <div className="flex items-center justify-between">
              <div className="p-3 bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border border-emerald-500/10 rounded-2xl">
                <FileText size={22} />
              </div>
              <span className="text-xs font-bold text-emerald-500 flex items-center gap-1 group-hover:translate-x-1.5 transition-transform">
                Enter Directory <ArrowRight size={13} />
              </span>
            </div>
            <div className="space-y-1">
              <h4 className="font-black text-base text-gray-900 dark:text-white leading-tight">Articles / Blogs</h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                Write conceptual DSA summaries, system design insights, platform tips, company patterns, and student announcements.
              </p>
            </div>
          </Link>
 
        </div>
      </div>
 
    </div>
  );
}
