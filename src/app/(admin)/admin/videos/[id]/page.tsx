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
  Play,
  CheckCircle
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

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
};

export default function ViewVideoLecturePage() {
  const { user, isLoading: authLoading, isLoggedIn } = useAuth();
  const params = useParams();
  const router = useRouter();
  
  const id = params?.id as string;

  const [lecture, setLecture] = useState<VideoLecture | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

  // Fetch specific video lecture
  const fetchLecture = useCallback(async () => {
    if (!id) return;
    const token = getStoredToken();
    if (!token) return;

    try {
      setLoading(true);
      setError(null);
      
      const res = await fetch(`${backendUrl}/api/v1/admin/video-lectures/${id}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!res.ok) {
        if (res.status === 404) {
          throw new Error("Video lecture asset could not be found.");
        }
        throw new Error(`Failed to load: ${res.statusText}`);
      }

      const data = await res.json();
      setLecture(data);
    } catch (err: unknown) {
      console.error("Failed to load lecture details:", err);
      const errMessage = err instanceof Error ? err.message : String(err);
      setError(errMessage || "Failed to load video lecture details.");
    } finally {
      setLoading(false);
    }
  }, [backendUrl, id]);

  useEffect(() => {
    if (isLoggedIn && user?.roles?.includes("admin") && id) {
      fetchLecture();
    }
  }, [isLoggedIn, user, id, fetchLecture]);

  useEffect(() => {
    if (lecture?.title) {
      document.title = `${lecture.title} | CrackDSA`;
    }
  }, [lecture]);

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
    <div className="max-w-5xl mx-auto space-y-8 pb-20 px-4">
      
      {/* Top Header back navigation */}
      <div className="flex items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-800/80 pb-6">
        <div className="flex items-center gap-4">
          <Link 
            href="/admin/videos" 
            className="p-2.5 rounded-xl border border-gray-250 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:text-gray-950 dark:hover:text-white bg-white dark:bg-gray-900 transition-all shadow-sm"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <span className="text-[10px] font-black text-brand-500 uppercase tracking-widest block leading-none mb-1">Viewer Cockpit</span>
            <h1 className="text-xl sm:text-2xl font-black text-gray-950 dark:text-white tracking-tight line-clamp-1">
              {loading ? "Loading lecture details..." : lecture?.title}
            </h1>
          </div>
        </div>
        {!loading && lecture && (
          <button 
            onClick={() => router.push(`/admin/videos/${lecture.id}/edit`)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-gray-750 dark:text-gray-300 border border-gray-200 dark:border-gray-800 hover:bg-gray-55 dark:hover:bg-gray-900 rounded-xl transition-all shadow-sm cursor-pointer bg-white dark:bg-gray-950"
          >
            <Edit3 size={15} />
            <span>Edit Lecture</span>
          </button>
        )}
      </div>

      {loading ? (
        <div className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-3xl p-12 text-center space-y-4">
          <Loader2 size={32} className="animate-spin text-brand-500 mx-auto" />
          <p className="text-gray-500 dark:text-gray-400 text-sm font-semibold">Retrieving video parameters from database...</p>
        </div>
      ) : error || !lecture ? (
        <div className="bg-red-500/5 border border-red-500/10 rounded-2xl p-6 flex items-start gap-3">
          <AlertCircle size={20} className="text-red-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-black text-red-600">Failed to Retrieve Details</h4>
            <p className="text-xs text-red-500/80 mt-1 font-semibold">{error || "Asset not found."}</p>
            <Link href="/admin/videos" className="text-xs font-bold text-red-600 underline mt-3 block">
              Back to Catalog Table
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main player + Notes area */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Aspect Ratio Video Mock Player */}
            <div className="relative aspect-video rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-gray-950 flex items-center justify-center group shadow-lg">
              {isPlaying ? (
                <div className="absolute inset-0 bg-black flex items-center justify-center p-4">
                  <div className="text-center space-y-3.5">
                    <Loader2 size={24} className="animate-spin text-brand-500 mx-auto" />
                    <p className="text-xs text-gray-400 font-semibold max-w-xs leading-relaxed">
                      Securing secure handshake with CDN stream player...
                    </p>
                    <div className="text-[10px] font-mono text-gray-600 bg-white/[0.03] px-3 py-1.5 rounded-lg border border-white/[0.05] max-w-md break-all">
                      {lecture.video_url}
                    </div>
                    <button 
                      onClick={() => setIsPlaying(false)}
                      className="text-xs font-bold text-brand-400 hover:text-brand-500 underline uppercase tracking-wider block pt-2 mx-auto"
                    >
                      Exit Mock Stream
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {lecture.thumbnail_url ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img 
                      src={lecture.thumbnail_url} 
                      alt={lecture.title} 
                      className="absolute inset-0 w-full h-full object-cover opacity-85 group-hover:scale-[1.02] transition-transform duration-500" 
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-tr from-gray-900 via-gray-900 to-gray-850 opacity-90" />
                  )}
                  
                  {/* Floating Play triggers */}
                  <div className="relative z-10 text-center space-y-4">
                    <button 
                      onClick={() => setIsPlaying(true)}
                      className="w-18 h-18 rounded-full bg-brand-500 text-white flex items-center justify-center shadow-lg shadow-brand-500/35 hover:scale-110 active:scale-95 transition-all mx-auto border border-brand-400/20"
                    >
                      <Play size={24} className="ml-1 fill-white" />
                    </button>
                    <div>
                      <h4 className="text-sm font-black text-white tracking-tight drop-shadow-sm px-4">{lecture.title}</h4>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                        Click to initiate stream
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Title & Notes detail card */}
            <div className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800/80 rounded-3xl p-6 sm:p-8 space-y-5">
              <div className="space-y-2 border-b border-gray-100 dark:border-gray-800/80 pb-4">
                <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest bg-green-500/10 text-green-600 px-2.5 py-1 rounded-full border border-green-500/10">
                  {lecture.is_active ? "Active Asset" : "Inactive Asset"}
                </span>
                <h2 className="text-lg font-black text-gray-950 dark:text-white leading-tight">{lecture.title}</h2>
              </div>
              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase text-gray-400 tracking-wider">Outline Notes</h4>
                {lecture.description ? (
                  <div 
                    className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-medium prose dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: lecture.description }}
                  />
                ) : (
                  <p className="text-sm text-gray-400 dark:text-gray-500 italic font-medium">
                    No curriculum outline or resource notes connected to this lecture.
                  </p>
                )}
              </div>
            </div>

          </div>

          {/* Right Resource tags sidebar */}
          <div className="space-y-6">
            
            {/* Asset Specs Card */}
            <div className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800/80 rounded-3xl p-6 space-y-4 shadow-sm">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider">Asset Parameters</h3>
              <div className="space-y-3.5">
                
                {/* Duration spec */}
                <div className="flex items-center justify-between text-xs border-b border-gray-50 dark:border-gray-800/60 pb-2.5">
                  <span className="text-gray-400 font-semibold flex items-center gap-1">
                    <Clock size={13} /> Duration
                  </span>
                  <span className="font-bold text-gray-850 dark:text-white">
                    {Math.floor(lecture.duration_seconds / 60)}m {lecture.duration_seconds % 60}s
                  </span>
                </div>

                {/* ID spec */}
                <div className="flex items-center justify-between text-xs border-b border-gray-50 dark:border-gray-800/60 pb-2.5 last:border-0 last:pb-0">
                  <span className="text-gray-400 font-semibold flex items-center gap-1">
                    <CheckCircle size={13} /> Asset ID
                  </span>
                  <span className="font-mono font-bold text-gray-600 dark:text-gray-400 text-[10px] select-all">
                    {lecture.id}
                  </span>
                </div>

                {/* Dynamic Attributes Specifications */}
                {lecture.attributes ? (Object.entries(lecture.attributes) as [string, unknown][]).map(([key, value]) => {
                  if (key === "tags") return null;

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
                      <span className="font-bold text-gray-850 dark:text-white text-right max-w-[160px] truncate select-all" title={displayValue}>
                        {displayValue}
                      </span>
                    </div>
                  );
                }) : null}

              </div>
            </div>

            {lecture.attributes?.tags && Array.isArray(lecture.attributes.tags) && (lecture.attributes.tags as string[]).length > 0 ? (
              <div className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800/80 rounded-3xl p-6 space-y-3 shadow-sm">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider">Classification Tags</h3>
                <div className="flex flex-wrap gap-2 pt-1">
                  {(lecture.attributes.tags as string[]).map((tag: string) => (
                    <span 
                      key={tag}
                      className="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-black bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/10 uppercase tracking-wider"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Dynamic Resources list */}
            <div className="space-y-4">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider">Connected Resources</h3>
              
              {lecture.resources && Object.keys(lecture.resources).length > 0 ? (
                (Object.entries(lecture.resources) as [string, unknown][]).map(([key, value]) => {
                  const items = Array.isArray(value) ? value : value ? [value] : [];
                  if (items.length === 0) return null;

                  const friendlyKey = key
                    .replace(/_/g, " ")
                    .split(" ")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ");

                  // Choose style and icon depending on resources key name
                  let colorClass = "text-blue-500 border-blue-500/10";
                  let icon = <LinkIcon size={15} />;

                  if (key.toLowerCase().includes("prob")) {
                    colorClass = "text-purple-500 border-purple-500/10";
                    icon = <HelpCircle size={15} />;
                  } else if (key.toLowerCase().includes("blog") || key.toLowerCase().includes("article")) {
                    colorClass = "text-orange-500 border-orange-500/10";
                    icon = <FileText size={15} />;
                  } else if (key.toLowerCase().includes("assignment") || key.toLowerCase().includes("task")) {
                    colorClass = "text-indigo-500 border-indigo-500/10";
                    icon = <CheckCircle size={15} />;
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
                <p className="text-xs text-gray-400 italic font-semibold">No assets or files connected.</p>
              )}
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
