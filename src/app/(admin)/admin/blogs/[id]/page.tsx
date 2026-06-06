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
  FileText,
  Loader2,
  AlertCircle,
  ExternalLink,
  CheckCircle,
  Sparkles,
  Tag,
  BookOpen,
  User,
  Image as ImageIcon,
  Link as LinkIcon
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
 
type Article = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  cover_image: string | null;
  category: string;
  difficulty: string | null;
  read_time_minutes: number;
  author_name: string | null;
  author_avatar: string | null;
  resources: {
    related_problems?: string[];
    related_videos?: string[];
    external_links?: string[];
    [key: string]: unknown;
  };
  attributes: {
    tags?: string[];
    series?: string;
    featured?: boolean;
    [key: string]: unknown;
  };
  is_published: boolean;
  is_active: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};
 
export default function ViewArticlePage() {
  const { user, isLoading: authLoading, isLoggedIn } = useAuth();
  const params = useParams();
  const router = useRouter();
  
  const id = params?.id as string;
 
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
 
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
 
  // Fetch specific article
  const fetchArticle = useCallback(async () => {
    if (!id) return;
    const token = getStoredToken();
    if (!token) return;
 
    try {
      setLoading(true);
      setError(null);
      
      const res = await fetch(`${backendUrl}/api/v1/admin/articles/${id}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
 
      if (!res.ok) {
        if (res.status === 404) {
          throw new Error("Article details could not be found.");
        }
        throw new Error(`Failed to load: ${res.statusText}`);
      }
 
      const data: Article = await res.json();
      setArticle(data);
    } catch (err: unknown) {
      console.error("Failed to load article details:", err);
      const errMessage = err instanceof Error ? err.message : String(err);
      setError(errMessage || "Failed to load article details.");
    } finally {
      setLoading(false);
    }
  }, [backendUrl, id]);
 
  useEffect(() => {
    if (isLoggedIn && user?.roles?.includes("admin") && id) {
      fetchArticle();
    }
  }, [isLoggedIn, user, id, fetchArticle]);
 
  useEffect(() => {
    if (article?.title) {
      document.title = `${article.title} | CrackDSA`;
    }
  }, [article]);
 
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
            href="/admin/blogs" 
            className="p-2.5 rounded-xl border border-gray-250 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:text-gray-950 dark:hover:text-white bg-white dark:bg-gray-900 transition-all shadow-sm"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <span className="text-[10px] font-black text-brand-500 uppercase tracking-widest block leading-none mb-1">Article Cockpit</span>
            <h1 className="text-xl sm:text-2xl font-black text-gray-950 dark:text-white tracking-tight line-clamp-1">
              {loading ? "Loading article details..." : article?.title}
            </h1>
          </div>
        </div>
        {!loading && article && (
          <button 
            onClick={() => router.push(`/admin/blogs/${article.id}/edit`)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-gray-750 dark:text-gray-300 border border-gray-200 dark:border-gray-800 hover:bg-gray-55 dark:hover:bg-gray-900 rounded-xl transition-all shadow-sm cursor-pointer bg-white dark:bg-gray-950"
          >
            <Edit3 size={15} />
            <span>Edit Article</span>
          </button>
        )}
      </div>
 
      {loading ? (
        <div className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-3xl p-12 text-center space-y-4">
          <Loader2 size={32} className="animate-spin text-brand-500 mx-auto" />
          <p className="text-gray-500 dark:text-gray-400 text-sm font-semibold">Retrieving article parameters from database...</p>
        </div>
      ) : error || !article ? (
        <div className="bg-red-500/5 border border-red-500/10 rounded-2xl p-6 flex items-start gap-3">
          <AlertCircle size={20} className="text-red-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-black text-red-600">Failed to Retrieve Details</h4>
            <p className="text-xs text-red-500/80 mt-1 font-semibold">{error || "Asset not found."}</p>
            <Link href="/admin/blogs" className="text-xs font-bold text-red-600 underline mt-3 block">
              Back to Articles Table
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Outline & Core Details Card */}
            <div className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 dark:border-gray-800/80 pb-4">
                <div className="flex items-center gap-2">
                  {/* Status badge */}
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                    !article.is_active
                      ? "bg-red-500/10 text-red-600 border-red-500/20"
                      : article.is_published
                      ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                      : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                  }`}>
                    {!article.is_active ? "Inactive" : article.is_published ? "Published" : "Draft"}
                  </span>
                  
                  {/* Category badge */}
                  <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest bg-gray-100 dark:bg-gray-800/80 text-gray-500 dark:text-gray-400 px-2.5 py-1 rounded-full border border-gray-200 dark:border-gray-800">
                    {article.category}
                  </span>

                  {/* Difficulty badge */}
                  {article.difficulty && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest bg-blue-500/10 text-blue-500 px-2.5 py-1 rounded-full border border-blue-500/10">
                      {article.difficulty}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400">
                  <Clock size={12} />
                  {article.read_time_minutes} min read
                </div>
              </div>

              {/* Subtitle */}
              {article.subtitle && (
                <p className="text-sm text-gray-600 dark:text-gray-300 font-semibold italic border-l-2 border-brand-500/30 pl-3">
                  {article.subtitle}
                </p>
              )}

              {/* Cover Image */}
              {article.cover_image && (
                <div className="rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800">
                  <img 
                    src={article.cover_image} 
                    alt={article.title}
                    className="w-full h-48 object-cover"
                  />
                </div>
              )}
              
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase text-gray-400 tracking-wider">Article Content</h4>
                {article.description ? (
                  <div 
                    className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-medium prose dark:prose-invert max-w-none ql-editor"
                    dangerouslySetInnerHTML={{ __html: article.description }}
                  />
                ) : (
                  <p className="text-sm text-gray-400 dark:text-gray-500 italic font-medium">
                    No content or description drafted for this article.
                  </p>
                )}
              </div>
            </div>
 
          </div>
 
          {/* Right Resource tags sidebar */}
          <div className="space-y-6">
            
            {/* Article Attributes Specs */}
            <div className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800/80 rounded-3xl p-6 space-y-4 shadow-sm">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider flex items-center gap-1">
                <FileText size={14} className="text-brand-500" />
                Article Details
              </h3>
              
              <div className="space-y-3.5 pt-1">
                {/* ID spec */}
                <div className="flex items-center justify-between text-xs border-b border-gray-50 dark:border-gray-800/60 pb-2.5">
                  <span className="text-gray-400 font-semibold flex items-center gap-1">
                    <CheckCircle size={13} /> Article UUID
                  </span>
                  <span className="font-mono font-bold text-gray-600 dark:text-gray-400 text-[10px] select-all">
                    {article.id}
                  </span>
                </div>
 
                {/* URL Slug spec */}
                <div className="flex items-center justify-between text-xs border-b border-gray-50 dark:border-gray-800/60 pb-2.5">
                  <span className="text-gray-400 font-semibold">
                    URL Slug
                  </span>
                  <span className="font-mono font-bold text-gray-800 dark:text-gray-200 text-[11px]">
                    {article.slug}
                  </span>
                </div>

                {/* Category */}
                <div className="flex items-center justify-between text-xs border-b border-gray-50 dark:border-gray-800/60 pb-2.5">
                  <span className="text-gray-400 font-semibold">
                    Category
                  </span>
                  <span className="font-bold text-gray-850 dark:text-white">
                    {article.category}
                  </span>
                </div>

                {/* Difficulty */}
                {article.difficulty && (
                  <div className="flex items-center justify-between text-xs border-b border-gray-50 dark:border-gray-800/60 pb-2.5">
                    <span className="text-gray-400 font-semibold">
                      Difficulty
                    </span>
                    <span className="font-bold text-gray-850 dark:text-white">
                      {article.difficulty}
                    </span>
                  </div>
                )}

                {/* Read Time */}
                <div className="flex items-center justify-between text-xs border-b border-gray-50 dark:border-gray-800/60 pb-2.5">
                  <span className="text-gray-400 font-semibold flex items-center gap-1">
                    <Clock size={13} /> Read Time
                  </span>
                  <span className="font-bold text-gray-850 dark:text-white">
                    {article.read_time_minutes} min
                  </span>
                </div>

                {/* Author */}
                {article.author_name && (
                  <div className="flex items-center justify-between text-xs border-b border-gray-50 dark:border-gray-800/60 pb-2.5">
                    <span className="text-gray-400 font-semibold flex items-center gap-1">
                      <User size={13} /> Author
                    </span>
                    <div className="flex items-center gap-2">
                      {article.author_avatar && (
                        <img 
                          src={article.author_avatar} 
                          alt={article.author_name}
                          className="w-5 h-5 rounded-full object-cover"
                        />
                      )}
                      <span className="font-bold text-gray-850 dark:text-white">
                        {article.author_name}
                      </span>
                    </div>
                  </div>
                )}

                {/* Series */}
                {article.attributes?.series && (
                  <div className="flex items-center justify-between text-xs border-b border-gray-50 dark:border-gray-800/60 pb-2.5">
                    <span className="text-gray-400 font-semibold flex items-center gap-1">
                      <BookOpen size={13} /> Series
                    </span>
                    <span className="font-bold text-gray-850 dark:text-white">
                      {article.attributes.series}
                    </span>
                  </div>
                )}

                {/* Published At */}
                {article.published_at && (
                  <div className="flex items-center justify-between text-xs border-b border-gray-50 dark:border-gray-800/60 pb-2.5">
                    <span className="text-gray-400 font-semibold">
                      Published At
                    </span>
                    <span className="font-bold text-gray-850 dark:text-white text-[10px]">
                      {new Date(article.published_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                    </span>
                  </div>
                )}

                {/* Created At */}
                <div className="flex items-center justify-between text-xs border-b border-gray-50 dark:border-gray-800/60 pb-2.5">
                  <span className="text-gray-400 font-semibold">
                    Created
                  </span>
                  <span className="font-bold text-gray-850 dark:text-white text-[10px]">
                    {new Date(article.created_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                  </span>
                </div>

                {/* Dynamic Attributes Specifications */}
                {article.attributes ? Object.entries(article.attributes).map(([key, value]) => {
                  if (key === "tags" || key === "series" || key === "featured") return null;
 
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
            {article.attributes?.tags && Array.isArray(article.attributes.tags) && article.attributes.tags.length > 0 && (
              <div className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800/80 rounded-3xl p-6 space-y-3 shadow-sm">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider flex items-center gap-1">
                  <Tag size={13} className="text-purple-500" />
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2 pt-1">
                  {article.attributes.tags.map((tag: string) => (
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
              
              {article.resources && Object.keys(article.resources).length > 0 ? (
                Object.entries(article.resources).map(([key, value]) => {
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
                  } else if (key.toLowerCase().includes("problem")) {
                    colorClass = "text-orange-500 border-orange-500/10";
                    icon = <FileText size={14} />;
                  } else if (key.toLowerCase().includes("link")) {
                    colorClass = "text-blue-500 border-blue-500/10";
                    icon = <ExternalLink size={14} />;
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
                <p className="text-xs text-gray-400 italic font-semibold">No resources connected.</p>
              )}
            </div>
 
          </div>
 
        </div>
      )}
 
    </div>
  );
}
