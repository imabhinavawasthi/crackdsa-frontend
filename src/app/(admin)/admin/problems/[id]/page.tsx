"use client";
 
import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getStoredToken } from "@/functions/auth";

import { 
  Lock, 
  ArrowLeft, 
  Edit3, 
  Clock, 
  HelpCircle,
  FileText,
  Link as LinkIcon,
  Loader2,
  AlertCircle,
  ExternalLink,
  Code as CodeIcon,
  CheckCircle,
  Layers,
  Sparkles,
  Award,
  Tag,
  BookOpen
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
 
type PracticeProblem = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  difficulty: "Easy" | "Medium" | "Hard";
  platform: string;
  problem_url: string | null;
  solutions: Record<string, {
    code: string;
    explanation?: string;
    time_complexity?: string;
    space_complexity?: string;
  }>;
  resources: {
    video_lectures?: string[];
    official_editorial_url?: string;
    [key: string]: unknown;
  };
  attributes: {
    difficulty_level?: number;
    pattern?: string;
    tags?: string[];
    [key: string]: unknown;
  };
  is_active: boolean;
};
 
export default function ViewPracticeProblemPage() {
  const { user, isLoading: authLoading, isLoggedIn } = useAuth();
  const params = useParams();
  const router = useRouter();
  
  const id = params?.id as string;
 
  const [problem, setProblem] = useState<PracticeProblem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [activeLang, setActiveLang] = useState<string>("");
 
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
 
  // Fetch specific practice problem
  const fetchProblem = useCallback(async () => {
    if (!id) return;
    const token = getStoredToken();
    if (!token) return;
 
    try {
      setLoading(true);
      setError(null);
      
      const res = await fetch(`${backendUrl}/api/v1/admin/practice-problems/${id}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
 
      if (!res.ok) {
        if (res.status === 404) {
          throw new Error("Practice problem details could not be found.");
        }
        throw new Error(`Failed to load: ${res.statusText}`);
      }
 
      const data: PracticeProblem = await res.json();
      setProblem(data);
      
      // Select the first language key as active by default if available
      if (data.solutions && Object.keys(data.solutions).length > 0) {
        setActiveLang(Object.keys(data.solutions)[0]);
      }
    } catch (err: unknown) {
      console.error("Failed to load problem details:", err);
      const errMessage = err instanceof Error ? err.message : String(err);
      setError(errMessage || "Failed to load practice problem details.");
    } finally {
      setLoading(false);
    }
  }, [backendUrl, id]);
 
  useEffect(() => {
    if (isLoggedIn && user?.roles?.includes("admin") && id) {
      fetchProblem();
    }
  }, [isLoggedIn, user, id, fetchProblem]);
 
  useEffect(() => {
    if (problem?.title) {
      document.title = `${problem.title} | CrackDSA`;
    }
  }, [problem]);
 
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
              This environment is strictly reserved for CrackDSA Administrators. You do not possess the required credentials to view this page.
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
    <div className="max-w-5xl mx-auto space-y-8 pb-20 px-4">
      
      {/* Top Header back navigation */}
      <div className="flex items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-800/80 pb-6">
        <div className="flex items-center gap-4">
          <Link 
            href="/admin/problems" 
            className="p-2.5 rounded-xl border border-gray-250 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:text-gray-950 dark:hover:text-white bg-white dark:bg-gray-900 transition-all shadow-sm"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <span className="text-[10px] font-black text-brand-500 uppercase tracking-widest block leading-none mb-1">Problem Cockpit</span>
            <h1 className="text-xl sm:text-2xl font-black text-gray-950 dark:text-white tracking-tight line-clamp-1">
              {loading ? "Loading challenge details..." : problem?.title}
            </h1>
          </div>
        </div>
        {!loading && problem && (
          <button 
            onClick={() => router.push(`/admin/problems/${problem.id}/edit`)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-gray-750 dark:text-gray-300 border border-gray-200 dark:border-gray-800 hover:bg-gray-55 dark:hover:bg-gray-900 rounded-xl transition-all shadow-sm cursor-pointer bg-white dark:bg-gray-950"
          >
            <Edit3 size={15} />
            <span>Edit Problem</span>
          </button>
        )}
      </div>
 
      {loading ? (
        <div className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-3xl p-12 text-center space-y-4">
          <Loader2 size={32} className="animate-spin text-brand-500 mx-auto" />
          <p className="text-gray-500 dark:text-gray-400 text-sm font-semibold">Retrieving challenge parameters from database...</p>
        </div>
      ) : error || !problem ? (
        <div className="bg-red-500/5 border border-red-500/10 rounded-2xl p-6 flex items-start gap-3">
          <AlertCircle size={20} className="text-red-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-black text-red-600">Failed to Retrieve Details</h4>
            <p className="text-xs text-red-500/80 mt-1 font-semibold">{error || "Asset not found."}</p>
            <Link href="/admin/problems" className="text-xs font-bold text-red-600 underline mt-3 block">
              Back to Problems Table
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content & Solution Tabs */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Outline & Core Details Card */}
            <div className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 dark:border-gray-800/80 pb-4">
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                    problem.difficulty === "Easy"
                      ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                      : problem.difficulty === "Medium"
                      ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                      : "bg-rose-500/10 text-rose-600 border-rose-500/20"
                  }`}>
                    {problem.difficulty}
                  </span>
                  
                  <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest bg-gray-100 dark:bg-gray-800/80 text-gray-500 dark:text-gray-400 px-2.5 py-1 rounded-full border border-gray-200 dark:border-gray-800">
                    {problem.platform}
                  </span>
                </div>
                
                <span className={`inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${
                  problem.is_active 
                    ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/10" 
                    : "bg-red-500/10 text-red-600 border-red-500/10"
                }`}>
                  {problem.is_active ? "Active" : "Inactive / Soft-Deleted"}
                </span>
              </div>
              
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase text-gray-400 tracking-wider">Problem Description</h4>
                {problem.description ? (
                  <div 
                    className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-medium prose dark:prose-invert max-w-none ql-editor"
                    dangerouslySetInnerHTML={{ __html: problem.description }}
                  />
                ) : (
                  <p className="text-sm text-gray-400 dark:text-gray-500 italic font-medium">
                    No clear constraints or formatted description drafted for this problem.
                  </p>
                )}
              </div>
 
              {problem.problem_url && (
                <div className="pt-2">
                  <a 
                    href={problem.problem_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-500 hover:text-brand-600 dark:text-brand-400 dark:hover:text-brand-300 transition-colors uppercase tracking-wider"
                  >
                    View Original Platform Challenge <ExternalLink size={13} />
                  </a>
                </div>
              )}
            </div>
 
            {/* Solutions Code Visualizer Card */}
            <div className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800/80 pb-4">
                <h3 className="text-xs font-black uppercase text-gray-400 tracking-wider flex items-center gap-1.5">
                  <CodeIcon size={16} className="text-purple-500" />
                  Code Solutions ({Object.keys(problem.solutions || {}).length})
                </h3>
              </div>
 
              {problem.solutions && Object.keys(problem.solutions).length > 0 ? (
                <div className="space-y-5">
                  {/* Language Tab List */}
                  <div className="flex flex-wrap gap-1.5 border-b border-gray-100 dark:border-gray-800/60 pb-3">
                    {Object.keys(problem.solutions).map((lang) => (
                      <button
                        key={lang}
                        onClick={() => setActiveLang(lang)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                          activeLang === lang
                            ? "bg-brand-500 text-white shadow-sm shadow-brand-500/10"
                            : "bg-gray-50 hover:bg-gray-100 dark:bg-gray-800/40 dark:hover:bg-gray-800/80 text-gray-500 dark:text-gray-400"
                        }`}
                      >
                        {lang === "cpp" ? "C++" : lang === "python" ? "Python" : lang === "java" ? "Java" : lang}
                      </button>
                    ))}
                  </div>
 
                  {/* Active Solution Panel */}
                  {activeLang && problem.solutions[activeLang] && (
                    <div className="space-y-4">
                      {/* Complexities specs */}
                      <div className="flex flex-wrap gap-3">
                        {problem.solutions[activeLang].time_complexity && (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-bold bg-purple-500/10 text-purple-600 border border-purple-500/10">
                            Time: {problem.solutions[activeLang].time_complexity}
                          </span>
                        )}
                        {problem.solutions[activeLang].space_complexity && (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-bold bg-blue-500/10 text-blue-600 border border-blue-500/10">
                            Space: {problem.solutions[activeLang].space_complexity}
                          </span>
                        )}
                      </div>
 
                      {/* Code mock IDE Editor panel */}
                      <div className="relative rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800/85">
                        <div className="bg-gray-100 dark:bg-gray-950 px-4 py-2 flex items-center justify-between border-b border-gray-200 dark:border-gray-850/80">
                          <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest font-mono">
                            {activeLang}.source
                          </span>
                          <span className="text-[9px] font-bold text-gray-400 bg-white/5 border border-white/5 px-2 py-0.5 rounded">
                            READ-ONLY
                          </span>
                        </div>
                        <pre className="bg-gray-950 text-gray-200 p-4.5 rounded-b-2xl font-mono text-xs overflow-x-auto whitespace-pre leading-relaxed select-all">
                          <code>{problem.solutions[activeLang].code}</code>
                        </pre>
                      </div>
 
                      {/* Explanation notes */}
                      {problem.solutions[activeLang].explanation && (
                        <div className="bg-gray-50/50 dark:bg-gray-850/30 p-4.5 rounded-2xl border border-gray-100 dark:border-gray-800 space-y-1.5">
                          <h5 className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Solution Strategy</h5>
                          <p className="text-xs text-gray-600 dark:text-gray-300 font-medium leading-relaxed">
                            {problem.solutions[activeLang].explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-400 dark:text-gray-500 italic font-semibold text-center py-6">
                  No code solutions uploaded for this practice problem yet.
                </p>
              )}
            </div>
 
          </div>
 
          {/* Right Resource tags sidebar */}
          <div className="space-y-6">
            
            {/* Problem Attributes Specs */}
            <div className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800/80 rounded-3xl p-6 space-y-4 shadow-sm">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider flex items-center gap-1">
                <Award size={14} className="text-brand-500" />
                Problem Weight & Details
              </h3>
              
              <div className="space-y-3.5 pt-1">
                {/* ID spec */}
                <div className="flex items-center justify-between text-xs border-b border-gray-50 dark:border-gray-800/60 pb-2.5">
                  <span className="text-gray-400 font-semibold flex items-center gap-1">
                    <CheckCircle size={13} /> Problem UUID
                  </span>
                  <span className="font-mono font-bold text-gray-600 dark:text-gray-400 text-[10px] select-all">
                    {problem.id}
                  </span>
                </div>
 
                {/* URL Slug spec */}
                <div className="flex items-center justify-between text-xs border-b border-gray-50 dark:border-gray-800/60 pb-2.5">
                  <span className="text-gray-400 font-semibold">
                    URL Slug
                  </span>
                  <span className="font-mono font-bold text-gray-800 dark:text-gray-200 text-[11px]">
                    {problem.slug}
                  </span>
                </div>
 
                {/* Difficulty level weight chart */}
                {problem.attributes?.difficulty_level && (
                  <div className="space-y-2 border-b border-gray-50 dark:border-gray-800/60 pb-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400 font-semibold">Difficulty Weight</span>
                      <span className="font-bold text-gray-850 dark:text-white font-mono">{problem.attributes.difficulty_level}/10</span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          problem.difficulty === "Easy"
                            ? "bg-emerald-500"
                            : problem.difficulty === "Medium"
                            ? "bg-amber-500"
                            : "bg-rose-500"
                        }`}
                        style={{ width: `${(problem.attributes.difficulty_level / 10) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
 
                {/* Pattern Classification spec */}
                {problem.attributes?.pattern && (
                  <div className="flex items-center justify-between text-xs border-b border-gray-50 dark:border-gray-800/60 pb-2.5">
                    <span className="text-gray-400 font-semibold flex items-center gap-1">
                      <Layers size={13} /> Pattern
                    </span>
                    <span className="font-bold text-gray-850 dark:text-white">
                      {problem.attributes.pattern}
                    </span>
                  </div>
                )}
 
                {/* Dynamic Attributes Specifications */}
                {problem.attributes ? Object.entries(problem.attributes).map(([key, value]) => {
                  if (key === "difficulty_level" || key === "pattern" || key === "tags") return null;
 
                  const friendlyKey = key
                    .replace(/_/g, " ")
                    .split(" ")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ");
 
                  const displayValue = typeof value === "object" ? JSON.stringify(value) : String(value);
 
                  return (
                    <div key={key} className="flex items-center justify-between text-xs border-b border-gray-50 dark:border-gray-800/60 pb-2.5 last:border-0 last:pb-0">
                      <span className="text-gray-400 font-semibold">
                        {friendlyKey}
                      </span>
                      <span className="font-bold text-gray-850 dark:text-white text-right max-w-[150px] truncate select-all" title={displayValue}>
                        {displayValue}
                      </span>
                    </div>
                  );
                }) : null}
              </div>
            </div>
 
            {/* Tags Classification Card */}
            {problem.attributes?.tags && Array.isArray(problem.attributes.tags) && problem.attributes.tags.length > 0 && (
              <div className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800/80 rounded-3xl p-6 space-y-3 shadow-sm">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider flex items-center gap-1">
                  <Tag size={13} className="text-purple-500" />
                  DSA Tags
                </h3>
                <div className="flex flex-wrap gap-2 pt-1">
                  {problem.attributes.tags.map((tag: string) => (
                    <span 
                      key={tag}
                      className="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-black bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/10 uppercase tracking-wider"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
 
            {/* Connected Resources list */}
            <div className="space-y-4">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider">Connected Resources</h3>
              
              {problem.resources && Object.keys(problem.resources).length > 0 ? (
                Object.entries(problem.resources).map(([key, value]) => {
                  const items = Array.isArray(value) ? value : value ? [value] : [];
                  if (items.length === 0) return null;
 
                  const friendlyKey = key
                    .replace(/_/g, " ")
                    .split(" ")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ");
 
                  // Choose styles depending on keys
                  let colorClass = "text-blue-500 border-blue-500/10";
                  let icon = <LinkIcon size={14} />;
 
                  if (key.toLowerCase().includes("video")) {
                    colorClass = "text-red-500 border-red-500/10";
                    icon = <BookOpen size={14} />;
                  } else if (key.toLowerCase().includes("editorial") || key.toLowerCase().includes("blog")) {
                    colorClass = "text-orange-500 border-orange-500/10";
                    icon = <FileText size={14} />;
                  }
 
                  return (
                    <div key={key} className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800/80 rounded-2xl p-5 space-y-3 shadow-theme-xs">
                      <div className={`flex items-center gap-2 font-black text-xs uppercase tracking-wider ${colorClass}`}>
                        {icon}
                        <span>{friendlyKey} ({items.length})</span>
                      </div>
                      
                      <div className="space-y-2 pt-1">
                        {items.map((item, idx) => {
                          const isUrl = String(item).startsWith("http://") || String(item).startsWith("https://") || String(item).includes(".com/") || String(item).includes(".org/");
                          const href = String(item).startsWith("http") ? String(item) : `https://${item}`;
 
                          if (isUrl) {
                            return (
                              <a
                                href={href}
                                target="_blank"
                                rel="noreferrer"
                                key={idx}
                                className="flex items-center justify-between p-2 rounded-lg bg-gray-50/75 dark:bg-gray-800/30 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-brand-500/5 hover:text-brand-600 dark:hover:text-brand-400 transition-colors border border-transparent dark:border-gray-800"
                              >
                                <span className="line-clamp-1 truncate select-all">{item}</span>
                                <ExternalLink size={12} className="opacity-60" />
                              </a>
                            );
                          }
 
                          return (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 mr-2 mb-2"
                            >
                              {item}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-xs text-gray-400 italic font-semibold">No learning assets connected.</p>
              )}
            </div>
 
          </div>
 
        </div>
      )}
 
    </div>
  );
}
