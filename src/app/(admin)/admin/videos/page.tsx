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
  Video, 
  Clock, 
  Link as LinkIcon, 
  HelpCircle,
  FileText,
  Loader2,
  AlertCircle,
  Eye
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

type VideoLecture = {
  id: string;
  title: string;
  description: string;
  video_url: string;
  duration_seconds: number;
  thumbnail_url: string | null;
  resources: {
    problems?: string[];
    blogs?: string[];
    assignments?: string[];
  };
  attributes: Record<string, unknown>;
  is_active: boolean;
  created_at: string;
};

export default function AdminVideosPage() {
  const { user, isLoading: authLoading, isLoggedIn } = useAuth();
  const router = useRouter();
  
  // State for lectures list
  const [lectures, setLectures] = useState<VideoLecture[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "active" | "inactive">("all");

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

  // Fetch all admin lectures
  const fetchLectures = useCallback(async () => {
    const token = getStoredToken();
    if (!token) return;

    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${backendUrl}/api/v1/admin/video-lectures`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!res.ok) {
        throw new Error(`Failed to load: ${res.statusText}`);
      }

      const data = await res.json();
      setLectures(data);
    } catch (err: unknown) {
      console.error("Failed to load admin lectures:", err);
      const errMessage = err instanceof Error ? err.message : String(err);
      setError(errMessage || "Failed to load admin video lectures catalog.");
    } finally {
      setLoading(false);
    }
  }, [backendUrl]);

  useEffect(() => {
    if (isLoggedIn && user?.roles?.includes("admin")) {
      fetchLectures();
    }
  }, [isLoggedIn, user, fetchLectures]);

  useEffect(() => {
    document.title = "Video Lectures Catalog | CrackDSA";
  }, []);

  // Handle soft delete
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to soft-delete this video lecture? Students will no longer see it.")) {
      return;
    }

    const token = getStoredToken();
    if (!token) return;

    try {
      const res = await fetch(`${backendUrl}/api/v1/admin/video-lectures/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!res.ok) {
        throw new Error("Failed to delete the video lecture.");
      }

      fetchLectures();
    } catch (err: unknown) {
      const errMessage = err instanceof Error ? err.message : String(err);
      alert(errMessage || "Delete transaction failed.");
    }
  };

  // Filter & Search computation
  const filteredLectures = lectures.filter((lecture) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      lecture.title.toLowerCase().includes(query) || 
      (lecture.description && lecture.description.toLowerCase().includes(query));

    const matchesStatus = 
      activeFilter === "all" ||
      (activeFilter === "active" && lecture.is_active) ||
      (activeFilter === "inactive" && !lecture.is_active);

    return matchesSearch && matchesStatus;
  });

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

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 px-4">
      
      {/* Header Dashboard */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-100 dark:border-gray-800/80 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-950 dark:text-white tracking-tight">
            Video Lectures
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-semibold mt-1">
            Configure reusable cohort video assets and connect problems, learning blogs, or coding assignments.
          </p>
        </div>
        <Button 
          onClick={() => router.push("/admin/videos/add")}
          startIcon={<Plus size={16} />}
          variant="primary"
          size="sm"
          className="self-start sm:self-center"
        >
          Add New Lecture
        </Button>
      </div>

      {/* Filtering Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/70 p-4.5 rounded-2xl">
        
        {/* Search Input bar */}
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text"
            placeholder="Search by title or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-transparent text-sm text-gray-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500 dark:focus:ring-brand-400 placeholder:text-gray-400 font-medium"
          />
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-gray-100 dark:bg-gray-800 self-start md:self-auto">
          {(["all", "active", "inactive"] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                activeFilter === filter 
                  ? "bg-white dark:bg-gray-900 text-gray-950 dark:text-white shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-950 dark:hover:text-gray-200"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Main Table Content */}
      {loading ? (
        <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-8 space-y-4 animate-pulse">
          <div className="h-6 w-1/4 bg-gray-100 dark:bg-gray-800 rounded-lg" />
          <div className="space-y-3 pt-2">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-16 w-full bg-gray-50 dark:bg-gray-800/40 rounded-xl" />
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
      ) : filteredLectures.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl space-y-4">
          <Video size={40} className="mx-auto text-gray-300 dark:text-gray-700" />
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-gray-950 dark:text-white">No Video Lectures Found</h3>
            <p className="text-xs text-gray-400 max-w-sm mx-auto">
              No assets matched your active search query or filter selection tags.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-2xl overflow-hidden shadow-theme-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-800/30">
                  <th className="px-6 py-4.5 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Video Details</th>
                  <th className="px-6 py-4.5 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Duration</th>
                  <th className="px-6 py-4.5 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Resources Linked</th>
                  <th className="px-6 py-4.5 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4.5 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60">
                {filteredLectures.map((lecture) => {
                  const probCount = lecture.resources?.problems?.length || 0;
                  const blogCount = lecture.resources?.blogs?.length || 0;
                  const assCount = lecture.resources?.assignments?.length || 0;

                  return (
                    <tr 
                      key={lecture.id}
                      className="hover:bg-gray-50/40 dark:hover:bg-gray-800/10 transition-all group"
                    >
                      {/* Video Info column */}
                      <td className="px-6 py-4.5 max-w-sm">
                        <div className="flex items-start gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 font-bold border border-brand-500/10">
                            <Video size={16} />
                          </div>
                          <div className="space-y-1">
                            <Link 
                              href={`/admin/videos/${lecture.id}`}
                              className="font-bold text-sm text-gray-900 dark:text-white leading-tight hover:text-brand-500 dark:hover:text-brand-400 transition-colors"
                            >
                              {lecture.title}
                            </Link>
                            {lecture.description && (
                              <div className="text-xs text-gray-400 line-clamp-1">
                                {lecture.description}
                              </div>
                            )}
                            <div className="text-[10px] font-mono text-gray-400 select-all leading-none mt-1">
                              ID: {lecture.id}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Duration column */}
                      <td className="px-6 py-4.5 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300 font-semibold">
                          <Clock size={13} className="text-gray-400" />
                          <span>{Math.floor(lecture.duration_seconds / 60)}m {lecture.duration_seconds % 60}s</span>
                        </div>
                      </td>

                      {/* Connected Resources counts */}
                      <td className="px-6 py-4.5">
                        <div className="flex flex-wrap gap-2">
                          {probCount > 0 && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.75 rounded-md text-[10px] font-black uppercase tracking-wider bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/10">
                              <HelpCircle size={10} />
                              {probCount} {probCount === 1 ? "Prob" : "Probs"}
                            </span>
                          )}
                          {blogCount > 0 && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.75 rounded-md text-[10px] font-black uppercase tracking-wider bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/10">
                              <FileText size={10} />
                              {blogCount} {blogCount === 1 ? "Blog" : "Blogs"}
                            </span>
                          )}
                          {assCount > 0 && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.75 rounded-md text-[10px] font-black uppercase tracking-wider bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/10">
                              <LinkIcon size={10} />
                              {assCount} {assCount === 1 ? "Assgn" : "Assgns"}
                            </span>
                          )}
                          {probCount === 0 && blogCount === 0 && assCount === 0 && (
                            <span className="text-[10px] font-semibold text-gray-400 italic">None linked</span>
                          )}
                        </div>
                      </td>

                      {/* Active Status Badge */}
                      <td className="px-6 py-4.5 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          lecture.is_active 
                            ? "bg-green-500/10 text-green-600 border border-green-500/10" 
                            : "bg-gray-100 dark:bg-gray-800 text-gray-400 border border-transparent"
                        }`}>
                          {lecture.is_active ? "Active" : "Deleted"}
                        </span>
                      </td>

                      {/* Actions Buttons */}
                      <td className="px-6 py-4.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2.5">
                          <button
                            onClick={() => router.push(`/admin/videos/${lecture.id}`)}
                            className="p-2 rounded-lg bg-gray-50 hover:bg-brand-500/10 text-gray-600 dark:text-gray-400 dark:bg-gray-800/40 hover:text-brand-600 dark:hover:text-brand-400 border border-transparent dark:border-gray-800 transition-all"
                            title="View video details and player"
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            onClick={() => router.push(`/admin/videos/${lecture.id}/edit`)}
                            className="p-2 rounded-lg bg-gray-50 hover:bg-brand-500/10 text-gray-600 dark:text-gray-400 dark:bg-gray-800/40 hover:text-brand-600 dark:hover:text-brand-400 border border-transparent dark:border-gray-800 transition-all"
                            title="Edit Lecture details"
                          >
                            <Edit3 size={14} />
                          </button>
                          {lecture.is_active && (
                            <button
                              onClick={() => handleDelete(lecture.id)}
                              className="p-2 rounded-lg bg-gray-50 hover:bg-red-500/10 text-gray-600 dark:text-gray-400 dark:bg-gray-800/40 hover:text-red-600 dark:hover:text-red-400 border border-transparent dark:border-gray-800 transition-all"
                              title="Soft delete lecture"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
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
