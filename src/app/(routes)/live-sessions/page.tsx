"use client";

import React, { useEffect, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, RefreshCw, BookOpen } from "lucide-react";
import { LiveClass, LiveClassCounts } from "@/types/live-class";
import { fetchLiveClasses } from "@/api/live-classes";
import { LiveClassesHeroBanner } from "@/components/live-classes/LiveClassesHeroBanner";
import { UpcomingClassesSection } from "@/components/live-classes/UpcomingClassesSection";
import { 
  LiveClassesToolbar, 
  ClassStatusFilter 
} from "@/components/live-classes/LiveClassesToolbar";
import { LiveClassCard } from "@/components/live-classes/LiveClassCard";

export default function LiveSessionsPage() {
  const [classes, setClasses] = useState<LiveClass[]>([]);
  const [counts, setCounts] = useState<LiveClassCounts>({ all: 0, live: 0, upcoming: 0, completed: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Pagination states
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const limit = 9;

  // Filter states
  const [statusFilter, setStatusFilter] = useState<ClassStatusFilter>("all");
  const [selectedTopic, setSelectedTopic] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [topics, setTopics] = useState<string[]>([]);
  const [upcomingClasses, setUpcomingClasses] = useState<LiveClass[]>([]);

  const loadClasses = useCallback(async (
    targetPage: number,
    targetStatus: string,
    targetTopic: string,
    targetSearch: string
  ) => {
    setLoading(true);
    setError(false);
    try {
      const data = await fetchLiveClasses({
        page: targetPage,
        limit,
        status: targetStatus,
        topic: targetTopic,
        search: targetSearch,
      });

      setClasses(data.items || []);
      setTotalCount(data.total_count || 0);
      setTotalPages(data.total_pages || 1);
      setCounts(data.counts || { all: 0, live: 0, upcoming: 0, completed: 0 });

      // Populate topics directly from backend across all public videos
      if (data.available_topics && data.available_topics.length > 0) {
        setTopics(data.available_topics);
      } else if (data.items) {
        setTopics((prev) => {
          const s = new Set(prev);
          data.items.forEach((item) => {
            if (item.class_topic) s.add(item.class_topic.toLowerCase());
          });
          return Array.from(s);
        });
      }

      // Populate upcoming / live classes
      if (data.upcoming_classes) {
        setUpcomingClasses(data.upcoming_classes);
      }
    } catch (err) {
      console.error("[LiveSessionsPage] Error fetching live classes:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  // Initial load and filter change trigger
  useEffect(() => {
    loadClasses(page, statusFilter, selectedTopic, searchQuery);
  }, [page, statusFilter, selectedTopic, searchQuery, loadClasses]);

  const handleStatusChange = (newStatus: ClassStatusFilter) => {
    setStatusFilter(newStatus);
    setPage(1);
  };

  const handleTopicChange = (newTopic: string) => {
    setSelectedTopic(newTopic);
    setPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setPage(1);
  };

  const startIdx = totalCount > 0 ? (page - 1) * limit + 1 : 0;
  const endIdx = Math.min(page * limit, totalCount);

  return (
    <div className="w-full space-y-7 pb-16 pt-1">
      {/* 1. Deep Navy Hero Banner matching Courses Header aesthetic */}
      <LiveClassesHeroBanner />

      {/* 2. Dedicated Upcoming & Live Classes Section */}
      <UpcomingClassesSection 
        upcomingClasses={upcomingClasses} 
        onScrollToCatalog={() => {
          document.getElementById("recorded-catalog")?.scrollIntoView({ behavior: "smooth" });
        }}
      />

      {/* 3. Uncluttered Toolbar with Lecture Search, Topic Filter & Status Tabs */}
      <div id="recorded-catalog" className="scroll-mt-6">
        <LiveClassesToolbar
          statusFilter={statusFilter}
          onStatusChange={handleStatusChange}
          counts={counts}
          topics={topics}
          selectedTopic={selectedTopic}
          onTopicChange={handleTopicChange}
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
        />
      </div>

      {/* 3. Loading State - Square Grid Skeletons */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div
              key={idx}
              className="rounded-3xl bg-white dark:bg-gray-900 border border-slate-200/80 dark:border-gray-800 overflow-hidden shadow-2xs animate-pulse flex flex-col justify-between"
            >
              <div className="w-full aspect-[16/10] bg-slate-200 dark:bg-slate-800" />
              <div className="p-5 space-y-3">
                <div className="w-3/4 h-5 bg-slate-200 dark:bg-slate-800 rounded-lg" />
                <div className="w-1/2 h-3.5 bg-slate-100 dark:bg-slate-800/60 rounded" />
                <div className="pt-2 border-t border-slate-100 dark:border-gray-800 flex items-center justify-between">
                  <div className="w-20 h-4 bg-slate-100 dark:bg-slate-800/60 rounded" />
                  <div className="w-16 h-4 bg-slate-100 dark:bg-slate-800/60 rounded" />
                </div>
              </div>
              <div className="px-5 pb-5">
                <div className="w-full h-9 bg-slate-100 dark:bg-slate-800/60 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. Error State */}
      {error && !loading && (
        <div className="py-16 px-6 text-center rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto mb-3">
            <BookOpen size={24} />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
            Unable to Load Live Classes
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-4">
            We encountered an issue retrieving live classes from the server.
          </p>
          <button
            type="button"
            onClick={() => loadClasses(page, statusFilter, selectedTopic, searchQuery)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors cursor-pointer"
          >
            <RefreshCw size={14} />
            <span>Retry</span>
          </button>
        </div>
      )}

      {/* 5. Clean, Square Cards Grid for Past & Public Lectures */}
      {!loading && !error && (
        <div className="space-y-6">
          {classes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {classes.map((c) => (
                <LiveClassCard key={c.id || c.class_url_slug} classItem={c} />
              ))}
            </div>
          ) : (
            <div className="py-16 px-6 text-center rounded-2xl border border-dashed border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-900">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                No Lectures Found
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-4">
                No classes match your current search or topic filter criteria.
              </p>
              <button
                type="button"
                onClick={() => {
                  setStatusFilter("all");
                  setSelectedTopic("all");
                  setSearchQuery("");
                  setPage(1);
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 transition-colors cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          )}

          {/* 6. Clean Pagination Bar */}
          {totalCount > 0 && totalPages > 1 && (
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200/80 dark:border-gray-800">
              <span className="text-xs text-slate-500 font-medium">
                Showing <strong className="text-slate-900 dark:text-white">{startIdx}</strong>–
                <strong className="text-slate-900 dark:text-white">{endIdx}</strong> of{" "}
                <strong className="text-slate-900 dark:text-white">{totalCount}</strong> lectures
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={14} />
                  <span>Previous</span>
                </button>

                <div className="flex items-center gap-1 px-2">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {page}
                  </span>
                  <span className="text-xs text-slate-400">/</span>
                  <span className="text-xs text-slate-500">
                    {totalPages}
                  </span>
                </div>

                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <span>Next</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}