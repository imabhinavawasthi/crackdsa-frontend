"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  fetchCacheStats,
  invalidateCacheNamespace,
  CacheStatsResponse,
} from "@/api/admin-cache";
import {
  Database,
  RefreshCw,
  Trash2,
  Zap,
  CheckCircle2,
  AlertCircle,
  Activity,
  Layers,
  Search,
  BookOpen,
  Video,
  Table,
  SheetIcon,
  Trophy,
  TvMinimalPlay,
  Clock,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const TARGET_NAMESPACES = [
  {
    id: "courses",
    name: "Courses & Curriculum",
    description: "Course summaries, curriculum tree, metadata, and topic batches",
    icon: <BookOpen className="w-5 h-5 text-brand-500" />,
    color: "brand",
  },
  {
    id: "live_classes",
    name: "Live Classes",
    description: "Featured dashboard class, public topics list, and class schedules",
    icon: <TvMinimalPlay className="w-5 h-5 text-red-500" />,
    color: "red",
  },
  {
    id: "videos",
    name: "Video Lectures",
    description: "Video lecture catalog and individual video lecture lookups",
    icon: <Video className="w-5 h-5 text-blue-500" />,
    color: "blue",
  },
  {
    id: "problems",
    name: "Practice Problems",
    description: "Difficulty counts, topic aggregates, company tags, and problem metadata",
    icon: <Table className="w-5 h-5 text-purple-500" />,
    color: "purple",
  },
  {
    id: "sheets",
    name: "DSA Sheets & CP Newbie",
    description: "DSA sheets list, problem lookups, and Newbie-to-Expert CP sheet",
    icon: <SheetIcon className="w-5 h-5 text-emerald-500" />,
    color: "emerald",
  },
  {
    id: "contests",
    name: "Contests & Editorials",
    description: "Contest lists, contest problem breakdowns, and editorial navigation",
    icon: <Trophy className="w-5 h-5 text-amber-500" />,
    color: "amber",
  },
];

export default function AdminCachePage() {
  const { user, isLoading: authLoading, isLoggedIn } = useAuth();
  const [stats, setStats] = useState<CacheStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNamespace, setSelectedNamespace] = useState<string>("all");

  const loadStats = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchCacheStats();
      setStats(data);
    } catch (err: any) {
      console.error("Failed to load cache stats:", err);
      setMessage({ type: "error", text: err.message || "Failed to load cache metrics" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    document.title = "In-Memory Cache Control | Admin Cockpit";
    if (isLoggedIn && user?.roles?.includes("admin")) {
      loadStats();
    }
  }, [isLoggedIn, user, loadStats]);

  const handleInvalidate = async (namespace: string) => {
    try {
      setActionLoading(namespace);
      setMessage(null);
      const res = await invalidateCacheNamespace(namespace);
      setMessage({
        type: "success",
        text: res.message || `Namespace '${namespace}' successfully invalidated.`,
      });
      await loadStats();
    } catch (err: any) {
      console.error(`Failed to invalidate cache (${namespace}):`, err);
      setMessage({
        type: "error",
        text: err.message || `Failed to invalidate namespace '${namespace}'.`,
      });
    } finally {
      setActionLoading(null);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <RefreshCw className="w-6 h-6 animate-spin text-brand-500" />
        <p className="text-sm text-gray-500">Checking credentials...</p>
      </div>
    );
  }

  if (!isLoggedIn || !user?.roles?.includes("admin")) {
    return (
      <div className="p-8 max-w-xl mx-auto text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Admin Privileges Required</h2>
        <p className="text-sm text-gray-500">You must be logged in as an administrator to access cache controls.</p>
        <Link href="/dashboard" className="inline-block px-4 py-2 bg-brand-500 text-white rounded-xl text-sm font-semibold">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const filteredKeys = (stats?.keys || []).filter((k) => {
    const matchesNamespace = selectedNamespace === "all" || k.namespace === selectedNamespace;
    const matchesQuery =
      searchQuery === "" ||
      k.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
      k.namespace.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesNamespace && matchesQuery;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2.5 rounded-2xl bg-brand-500/10 text-brand-500 border border-brand-500/20">
              <Zap className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              In-Memory Cache Control
            </h1>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5">
            Monitor real-time RAM cache hit rates and selectively flush cached namespaces across courses, classes, problems, and sheets.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadStats}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 text-sm font-semibold transition"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button
            onClick={() => {
              if (window.confirm("Are you sure you want to flush the entire in-memory cache?")) {
                handleInvalidate("all");
              }
            }}
            disabled={actionLoading === "all"}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold shadow-sm transition disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
            Purge All Cache
          </button>
        </div>
      </div>

      {/* Alert Notification */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className={`p-4 rounded-2xl flex items-center justify-between border ${
              message.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                : "bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400"
            }`}
          >
            <div className="flex items-center gap-2.5 text-sm font-semibold">
              {message.type === "success" ? (
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
              )}
              <span>{message.text}</span>
            </div>
            <button
              onClick={() => setMessage(null)}
              className="text-xs font-bold hover:underline ml-4"
            >
              Dismiss
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 space-y-1">
          <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider">
            <span>Total Cached Keys</span>
            <Database className="w-4 h-4 text-brand-500" />
          </div>
          <div className="text-2xl font-black text-gray-900 dark:text-white">
            {stats ? stats.total_keys : "—"}
          </div>
          <p className="text-[11px] text-gray-400">Active entries in RAM</p>
        </div>

        <div className="p-5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 space-y-1">
          <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider">
            <span>Cache Hit Rate</span>
            <Activity className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {stats ? `${stats.hit_rate_pct}%` : "—"}
          </div>
          <p className="text-[11px] text-gray-400">
            {stats ? `${stats.hits} hits / ${stats.hits + stats.misses} reqs` : "Waiting for calls"}
          </p>
        </div>

        <div className="p-5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 space-y-1">
          <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider">
            <span>Cache Hits</span>
            <Sparkles className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-blue-600 dark:text-blue-400">
            {stats ? stats.hits.toLocaleString() : "—"}
          </div>
          <p className="text-[11px] text-gray-400">Served instantly under 1ms</p>
        </div>

        <div className="p-5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 space-y-1">
          <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider">
            <span>Active Namespaces</span>
            <Layers className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-black text-purple-600 dark:text-purple-400">
            {stats ? Object.keys(stats.namespaces).length : "—"}
          </div>
          <p className="text-[11px] text-gray-400">Granular domain partitions</p>
        </div>
      </div>

      {/* Granular Invalidation Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-brand-500" />
            Namespace-Specific Invalidation
          </h2>
          <span className="text-xs text-gray-400 font-medium">
            Flushing a namespace only drops its cached objects without affecting other services
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {TARGET_NAMESPACES.map((ns) => {
            const count = stats?.namespaces[ns.id] || 0;
            const isFlushing = actionLoading === ns.id;

            return (
              <div
                key={ns.id}
                className="p-5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-brand-500/30 transition flex flex-col justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800">
                        {ns.icon}
                      </div>
                      <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                        {ns.name}
                      </h3>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                      {count} {count === 1 ? "key" : "keys"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {ns.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800/80">
                  <code className="text-[11px] font-mono text-gray-400">
                    namespace: &quot;{ns.id}&quot;
                  </code>
                  <button
                    onClick={() => handleInvalidate(ns.id)}
                    disabled={isFlushing}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-gray-100 hover:bg-red-50 text-gray-700 hover:text-red-600 dark:bg-gray-800 dark:hover:bg-red-950/40 dark:text-gray-300 dark:hover:text-red-400 transition disabled:opacity-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    {isFlushing ? "Flushing..." : "Invalidate"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Key Inspector & Live Keys Table */}
      <div className="p-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Search className="w-4 h-4 text-brand-500" />
              Cached Keys Inspector
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Inspecting up to 100 in-memory keys currently cached in FastAPI process
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter by key or namespace..."
                className="pl-9 pr-3 py-1.5 rounded-xl text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-1 focus:ring-brand-500 w-56 text-gray-900 dark:text-gray-100"
              />
            </div>

            <select
              value={selectedNamespace}
              onChange={(e) => setSelectedNamespace(e.target.value)}
              className="py-1.5 px-3 rounded-xl text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-1 focus:ring-brand-500 text-gray-900 dark:text-gray-100"
            >
              <option value="all">All Namespaces</option>
              {TARGET_NAMESPACES.map((ns) => (
                <option key={ns.id} value={ns.id}>
                  {ns.name} ({stats?.namespaces[ns.id] || 0})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto border border-gray-100 dark:border-gray-800 rounded-xl">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/60 text-gray-500 border-b border-gray-100 dark:border-gray-800">
                <th className="py-2.5 px-4 font-semibold">Cache Key</th>
                <th className="py-2.5 px-4 font-semibold">Namespace</th>
                <th className="py-2.5 px-4 font-semibold">TTL Remaining</th>
                <th className="py-2.5 px-4 font-semibold">Age</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60 text-gray-700 dark:text-gray-300 font-mono">
              {filteredKeys.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-gray-400 font-sans">
                    {stats?.total_keys === 0
                      ? "No keys currently in cache. Browse courses, problems, or live sessions to populate cache!"
                      : "No keys matched the filter."}
                  </td>
                </tr>
              ) : (
                filteredKeys.map((item, idx) => {
                  const ageSec = Math.max(0, Math.floor(Date.now() / 1000 - item.created_at));
                  return (
                    <tr
                      key={idx}
                      className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition"
                    >
                      <td className="py-2 px-4 truncate max-w-md text-gray-900 dark:text-gray-100 font-medium">
                        {item.key}
                      </td>
                      <td className="py-2 px-4">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-brand-500/10 text-brand-600 dark:text-brand-400 font-sans">
                          {item.namespace}
                        </span>
                      </td>
                      <td className="py-2 px-4">
                        <span className="flex items-center gap-1 text-gray-500">
                          <Clock className="w-3 h-3" />
                          {item.ttl_remaining_seconds >= 0
                            ? `${item.ttl_remaining_seconds}s`
                            : "No expiry"}
                        </span>
                      </td>
                      <td className="py-2 px-4 text-gray-400">
                        {ageSec < 60 ? `${ageSec}s ago` : `${Math.floor(ageSec / 60)}m ago`}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
