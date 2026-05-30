"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { getStoredToken } from "@/functions/auth";
import Button from "@/components/ui/button/Button";
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Code2, 
  HelpCircle,
  FileText,
  Loader2,
  AlertCircle,
  Eye,
  Link as LinkIcon,
  ExternalLink,
  BookOpen,
  Award
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

type PracticeProblem = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  difficulty: "Easy" | "Medium" | "Hard";
  platform: string;
  problem_url: string | null;
  solutions: Record<string, unknown>;
  resources: {
    video_lectures?: string[];
    blogs?: Array<{ title: string; url: string }>;
    official_editorial_url?: string;
  };
  attributes: {
    difficulty_level?: number;
    pattern?: string;
    importance_score?: number;
    frequency_score?: number;
    tags?: string[];
    company_tags?: string[];
  };
  is_active: boolean;
  created_at: string;
};

export default function AdminProblemsPage() {
  const { user, isLoggedIn } = useAuth();
  const router = useRouter();
  
  // State for problems list
  const [problems, setProblems] = useState<PracticeProblem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<"all" | "Easy" | "Medium" | "Hard">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

  // Fetch all admin problems
  const fetchProblems = useCallback(async () => {
    const token = getStoredToken();
    if (!token) return;

    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${backendUrl}/api/v1/admin/practice-problems`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!res.ok) {
        throw new Error(`Failed to load: ${res.statusText}`);
      }

      const data = await res.json();
      setProblems(data);
    } catch (err: unknown) {
      console.error("Failed to load admin problems:", err);
      const errMessage = err instanceof Error ? err.message : String(err);
      setError(errMessage || "Failed to load practice problems catalog.");
    } finally {
      setLoading(false);
    }
  }, [backendUrl]);

  useEffect(() => {
    if (isLoggedIn && user?.roles?.includes("admin")) {
      fetchProblems();
    }
  }, [isLoggedIn, user, fetchProblems]);

  useEffect(() => {
    document.title = "Practice Problems Catalog | CrackDSA";
  }, []);

  // Handle soft delete
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to soft-delete this practice problem? Students will no longer see it.")) {
      return;
    }

    const token = getStoredToken();
    if (!token) return;

    try {
      const res = await fetch(`${backendUrl}/api/v1/admin/practice-problems/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!res.ok) {
        throw new Error("Failed to delete the practice problem.");
      }

      fetchProblems();
    } catch (err: unknown) {
      const errMessage = err instanceof Error ? err.message : String(err);
      alert(errMessage || "Delete transaction failed.");
    }
  };

  // Filter & Search computation
  const filteredProblems = problems.filter((prob) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      prob.title.toLowerCase().includes(query) || 
      prob.slug.toLowerCase().includes(query) ||
      (prob.attributes?.pattern && prob.attributes.pattern.toLowerCase().includes(query)) ||
      (prob.attributes?.tags && prob.attributes.tags.some(tag => tag.toLowerCase().includes(query)));

    const matchesDifficulty = 
      difficultyFilter === "all" || prob.difficulty === difficultyFilter;

    const matchesStatus = 
      statusFilter === "all" ||
      (statusFilter === "active" && prob.is_active) ||
      (statusFilter === "inactive" && !prob.is_active);

    return matchesSearch && matchesDifficulty && matchesStatus;
  });

  // Get color for difficulty badge
  const getDifficultyStyles = (difficulty: "Easy" | "Medium" | "Hard") => {
    switch (difficulty) {
      case "Easy":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/10";
      case "Medium":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/10";
      case "Hard":
        return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/10";
    }
  };

  // Get color for platform badge
  const getPlatformStyles = (platform: string) => {
    const cleanPlatform = platform.toLowerCase();
    if (cleanPlatform.includes("leetcode")) {
      return "bg-amber-500/5 text-amber-500 border border-amber-500/15";
    } else if (cleanPlatform.includes("codeforces")) {
      return "bg-blue-500/5 text-blue-500 border border-blue-500/15";
    } else if (cleanPlatform.includes("hackerrank")) {
      return "bg-emerald-500/5 text-emerald-500 border border-emerald-500/15";
    } else if (cleanPlatform.includes("gfg") || cleanPlatform.includes("geeks")) {
      return "bg-green-500/5 text-green-500 border border-green-500/15";
    } else {
      return "bg-brand-500/5 text-brand-500 border border-brand-500/15";
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 px-4">
      
      {/* Header Dashboard */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-100 dark:border-gray-800/80 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-950 dark:text-white tracking-tight">
            Practice Problems
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-semibold mt-1">
            Configure coding problems, link formatted editorials/solutions, and map external practice environments.
          </p>
        </div>
        <Button 
          onClick={() => router.push("/admin/problems/add")}
          startIcon={<Plus size={16} />}
          variant="primary"
          size="sm"
          className="self-start sm:self-center"
        >
          Add New Problem
        </Button>
      </div>

      {/* Filtering Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/70 p-4.5 rounded-2xl">
        
        {/* Search Input bar */}
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text"
            placeholder="Search by title, tag, pattern..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-transparent text-sm text-gray-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500 dark:focus:ring-brand-400 placeholder:text-gray-400 font-medium"
          />
        </div>

        {/* Filters Grid */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Difficulty Filter */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-gray-100 dark:bg-gray-800">
            {(["all", "Easy", "Medium", "Hard"] as const).map((diff) => (
              <button
                key={diff}
                onClick={() => setDifficultyFilter(diff)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  difficultyFilter === diff 
                    ? "bg-white dark:bg-gray-900 text-gray-950 dark:text-white shadow-sm"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-950 dark:hover:text-gray-200"
                }`}
              >
                {diff}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-gray-100 dark:bg-gray-800">
            {(["all", "active", "inactive"] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setStatusFilter(filter)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                  statusFilter === filter 
                    ? "bg-white dark:bg-gray-900 text-gray-950 dark:text-white shadow-sm"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-950 dark:hover:text-gray-200"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
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
      ) : filteredProblems.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl space-y-4">
          <Code2 size={40} className="mx-auto text-gray-300 dark:text-gray-700 animate-pulse" />
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-gray-950 dark:text-white">No Practice Problems Found</h3>
            <p className="text-xs text-gray-400 max-w-sm mx-auto">
              No problem assets matched your active search query, tags, or difficulty filters.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-2xl overflow-hidden shadow-theme-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-800/30">
                  <th className="px-6 py-4.5 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Problem Details</th>
                  <th className="px-6 py-4.5 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Platform & URL</th>
                  <th className="px-6 py-4.5 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Difficulty</th>
                  <th className="px-6 py-4.5 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Linked Assets</th>
                  <th className="px-6 py-4.5 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4.5 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60">
                {filteredProblems.map((prob) => {
                  const solutionCount = Object.keys(prob.solutions || {}).length;
                  const videoCount = prob.resources?.video_lectures?.length || 0;
                  const blogCount = prob.resources?.blogs?.length || 0;
                  const difficultyLevel = prob.attributes?.difficulty_level || null;
                  const pattern = prob.attributes?.pattern || null;

                  return (
                    <tr 
                      key={prob.id}
                      className="hover:bg-gray-50/40 dark:hover:bg-gray-800/10 transition-all group"
                    >
                      {/* Problem Info column */}
                      <td className="px-6 py-4.5 max-w-sm">
                        <div className="flex items-start gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 font-bold border border-brand-500/10">
                            <Code2 size={16} />
                          </div>
                          <div className="space-y-1">
                            <Link 
                              href={`/admin/problems/${prob.id}`}
                              className="font-bold text-sm text-gray-900 dark:text-white leading-tight hover:text-brand-500 dark:hover:text-brand-400 transition-colors"
                            >
                              {prob.title}
                            </Link>
                            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                              <span className="text-[10px] text-gray-450 dark:text-gray-500 font-mono">
                                /{prob.slug}
                              </span>
                              {pattern && (
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase bg-brand-500/5 text-brand-500 dark:text-brand-400 border border-brand-500/10">
                                  {pattern}
                                </span>
                              )}
                              {difficultyLevel && (
                                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-450">
                                  <Award size={10} />
                                  Lvl {difficultyLevel}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Platform & External URL column */}
                      <td className="px-6 py-4.5">
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-xl text-xs font-bold capitalize ${getPlatformStyles(prob.platform)}`}>
                            {prob.platform}
                          </span>
                          {prob.problem_url && (
                            <a 
                              href={prob.problem_url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-gray-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors"
                              title="Go to problem platform"
                            >
                              <ExternalLink size={14} />
                            </a>
                          )}
                        </div>
                      </td>

                      {/* Difficulty Badge column */}
                      <td className="px-6 py-4.5">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-xl text-xs font-bold tracking-wider ${getDifficultyStyles(prob.difficulty)}`}>
                          {prob.difficulty}
                        </span>
                      </td>

                      {/* Solutions/Resources Count column */}
                      <td className="px-6 py-4.5">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400">
                            <Code2 size={12} className="text-gray-400" />
                            <span>{solutionCount} Solution{solutionCount !== 1 ? "s" : ""}</span>
                          </div>
                          {(videoCount > 0 || blogCount > 0) && (
                            <div className="flex items-center gap-1.5 text-xs text-gray-400">
                              <BookOpen size={11} />
                              <span>
                                {videoCount > 0 ? `${videoCount} Video${videoCount !== 1 ? "s" : ""}` : ""}
                                {videoCount > 0 && blogCount > 0 ? " • " : ""}
                                {blogCount > 0 ? `${blogCount} Blog${blogCount !== 1 ? "s" : ""}` : ""}
                              </span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Active Status Badge column */}
                      <td className="px-6 py-4.5">
                        {prob.is_active ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-500/10 text-red-500">
                            <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                            Deleted
                          </span>
                        )}
                      </td>

                      {/* Action buttons column */}
                      <td className="px-6 py-4.5 text-right">
                        <div className="flex items-center justify-end gap-2.5 opacity-80 group-hover:opacity-100 transition-opacity">
                          <Link 
                            href={`/admin/problems/${prob.id}`}
                            className="p-2 rounded-xl text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
                            title="Preview problem detail player"
                          >
                            <Eye size={15} />
                          </Link>
                          <button 
                            onClick={() => router.push(`/admin/problems/${prob.id}/edit`)}
                            className="p-2 rounded-xl text-gray-400 hover:text-brand-500 dark:hover:text-brand-400 hover:bg-brand-500/5 transition-all border border-transparent hover:border-brand-500/10"
                            title="Edit problem settings"
                          >
                            <Edit3 size={15} />
                          </button>
                          {prob.is_active && (
                            <button 
                              onClick={() => handleDelete(prob.id)}
                              className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-500/5 transition-all border border-transparent hover:border-red-500/10"
                              title="Soft delete problem"
                            >
                              <Trash2 size={15} />
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
