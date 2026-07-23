"use client";

import React, { useState, useEffect } from "react";
import { BookOpen, ExternalLink, Play, Clock } from "lucide-react";
import { fetchVideoDetails, VideoLectureDetail } from "@/api/videos";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import VideoCard from "./VideoCard";
import { useAuth } from "@/context/AuthContext";
import { UpgradeBanner } from "@/components/dashboard/UpgradeBanner";

interface RelatedArticle {
  id: string;
  title: string;
  slug: string;
}

interface ProblemEditorialProps {
  videoIds?: string[];
  articles?: RelatedArticle[];
}

const ProblemEditorial: React.FC<ProblemEditorialProps> = ({ videoIds = [], articles = [] }) => {
  const { user, isLoggedIn } = useAuth();
  const isPro = user?.is_pro_active === true;

  const [videos, setVideos] = useState<VideoLectureDetail[]>([]);
  const [loading, setLoading] = useState(!!(videoIds && videoIds.length > 0));
  const [activeVideo, setActiveVideo] = useState<VideoLectureDetail | null>(null);

  // Sync loading state immediately during render if videoIds change
  const [prevVideoIds, setPrevVideoIds] = useState<string[]>(videoIds);
  if (JSON.stringify(videoIds) !== JSON.stringify(prevVideoIds)) {
    setPrevVideoIds(videoIds);
    setLoading(!!(videoIds && videoIds.length > 0));
  }

  useEffect(() => {
    if (!videoIds || videoIds.length === 0) {
      setVideos([]);
      setActiveVideo(null);
      return;
    }

    const loadAllVideos = async () => {
      try {
        setLoading(true);
        // Fetch all video details concurrently
        const details = await Promise.all(
          videoIds.map(async (id) => {
            try {
              return await fetchVideoDetails(id);
            } catch (err) {
              console.error(`Failed to fetch video details for ID ${id}:`, err);
              return null;
            }
          })
        );
        const validVideos = details.filter((v): v is VideoLectureDetail => v !== null);
        setVideos(validVideos);
        if (validVideos.length > 0) {
          setActiveVideo(validVideos[0]);
        }
      } catch (err) {
        console.error("Failed to load video editorials:", err);
      } finally {
        setLoading(false);
      }
    };

    loadAllVideos();
  }, [videoIds]);

  const hasVideos = videos.length > 0;
  const hasArticles = articles && articles.length > 0;

  if (!isPro) {
    return (
      <div className="py-6 select-none w-full">
        <UpgradeBanner
          isLoggedIn={isLoggedIn}
          title="PRO Access Required"
          description="Unlock video explanations, conceptual breakdowns, code walking, and all other exclusive resources by upgrading to CrackDSA PRO."
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6 w-full animate-pulse select-none bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-6 w-2/3 rounded-lg" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="w-full aspect-video rounded-2xl" />
          </div>
          <div className="space-y-3">
            <Skeleton className="h-5 w-1/3 rounded-lg" />
            <Skeleton className="h-14 w-full rounded-xl" />
            <Skeleton className="h-14 w-full rounded-xl" />
            <Skeleton className="h-14 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!hasVideos && !hasArticles) {
    return (
      <div className="text-center py-16 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl w-full shadow-sm">
        <p className="text-xs sm:text-sm text-gray-405 dark:text-gray-500 font-medium">
          Video Editorial explanations and articles are currently under edit. Check back soon!
        </p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8 select-none">
      {/* 1. Video Editorial Section */}
      {hasVideos && activeVideo && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Active Video Card */}
          <div className="lg:col-span-2">
            <VideoCard video={activeVideo} />
          </div>

          {/* Video Playlist Sidebar (only show if multiple videos exist) */}
          {videos.length > 1 ? (
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl sm:rounded-3xl p-4 space-y-4 shadow-sm h-fit">
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                  Video Playlist
                </h4>
                <p className="text-[10px] text-gray-400 font-bold uppercase">
                  {videos.length} Lectures Available
                </p>
              </div>

              <div className="flex flex-col gap-2.5 max-h-[350px] overflow-y-auto custom-scrollbar pr-1">
                {videos.map((vid, idx) => {
                  const isActive = activeVideo.id === vid.id;
                  return (
                    <button
                      key={vid.id}
                      onClick={() => setActiveVideo(vid)}
                      className={`w-full text-left p-3 rounded-xl border transition-all duration-300 flex items-start gap-3 group cursor-pointer ${
                        isActive
                          ? "bg-brand-500/5 dark:bg-brand-500/10 border-brand-500/30 text-brand-600 dark:text-brand-400 shadow-sm"
                          : "bg-gray-50/30 dark:bg-gray-900/40 border-gray-200/60 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/60"
                      }`}
                    >
                      <div className={`mt-0.5 shrink-0 h-6 w-6 rounded-lg flex items-center justify-center transition-colors duration-300 ${
                        isActive
                          ? "bg-brand-500 text-white"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-400 group-hover:bg-brand-500 group-hover:text-white"
                      }`}>
                        <Play size={11} className={isActive ? "fill-white" : "group-hover:fill-white"} />
                      </div>
                      <div className="space-y-1 min-w-0 flex-1">
                        <span className={`text-xs block truncate ${isActive ? "font-extrabold" : "font-bold"}`}>
                          {idx + 1}. {vid.title}
                        </span>
                        {vid.duration_label && (
                          <span className="text-[9px] text-gray-400 font-bold uppercase flex items-center gap-1">
                            <Clock size={9} />
                            {vid.duration_label}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl sm:rounded-3xl p-4.5 space-y-3 shadow-sm h-fit">
              <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center gap-2">
                <Play size={13} className="text-brand-500" />
                <span>Lecture Editorial</span>
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                This dynamic video lesson goes step-by-step through the optimal algorithm, code execution state, and time/space complexity analysis.
              </p>
            </div>
          )}
        </div>
      )}

      {/* 2. Related Conceptual Articles Section */}
      {hasArticles && (
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center gap-2">
            <BookOpen size={14} className="text-brand-500" />
            <span>Related Conceptual Articles ({articles.length})</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {articles.map((art) => (
              <a
                key={art.id}
                href={`/learn/dsa/${art.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/60 hover:bg-gray-50 dark:hover:bg-gray-900 hover:border-brand-500/30 dark:hover:border-brand-500/30 hover:shadow-[0_0_15px_-5px_rgba(var(--color-brand-500),0.15)] transition-all duration-300 group cursor-pointer"
              >
                <div className="space-y-1 pr-3 truncate">
                  <h5 className="text-xs sm:text-sm font-bold text-gray-800 dark:text-gray-200 group-hover:text-brand-500 dark:group-hover:text-brand-400 transition-colors truncate">
                    {art.title}
                  </h5>
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                    Syllabus Documentation
                  </span>
                </div>
                <span className="shrink-0 p-1.5 rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/10 group-hover:bg-brand-500 group-hover:text-white group-hover:border-brand-500 transition-all duration-300">
                  <ExternalLink size={10} className="stroke-[2.5]" />
                </span>
              </a>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ProblemEditorial;
