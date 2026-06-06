"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Loader2, ShieldAlert, ArrowLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { getStoredToken } from "@/functions/auth";
import ProblemViewer from "@/components/learning/ProblemViewer";

export default function ProblemDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [problem, setProblem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

  useEffect(() => {
    if (!slug) return;

    const fetchProblemDetail = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = getStoredToken();
        const headers = token ? { "Authorization": `Bearer ${token}` } : undefined;

        const res = await fetch(`${backendUrl}/api/v1/practice-problems/${slug}`, { headers });
        if (!res.ok) {
          if (res.status === 404) {
            throw new Error("Problem not found");
          }
          throw new Error("Failed to load problem details");
        }

        const data = await res.json();
        setProblem(data);
      } catch (err: any) {
        console.error("Error fetching problem detail:", err);
        setError(err.message || "Something went wrong while loading the problem.");
      } finally {
        setLoading(false);
      }
    };

    fetchProblemDetail();
  }, [slug, backendUrl]);

  if (loading) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 py-6 space-y-6 select-none">
        {/* Breadcrumb Skeleton */}
        <div className="flex items-center gap-2">
          <div className="h-4 w-12 bg-gray-250 dark:bg-gray-800 rounded animate-pulse" />
          <div className="h-3.5 w-3.5 text-gray-300 dark:text-gray-700 flex items-center justify-center">/</div>
          <div className="h-4 w-16 bg-gray-250 dark:bg-gray-800 rounded animate-pulse" />
          <div className="h-3.5 w-3.5 text-gray-300 dark:text-gray-700 flex items-center justify-center">/</div>
          <div className="h-4 w-28 bg-gray-200 dark:bg-gray-850 rounded animate-pulse" />
        </div>

        {/* Tab Controls Bar Skeleton */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1 max-w-lg flex bg-gray-100 dark:bg-gray-900 p-1.5 rounded-2xl gap-2 border border-gray-200/50 dark:border-gray-800/50">
            <div className="h-10 flex-1 bg-white dark:bg-gray-850 rounded-xl animate-pulse" />
            <div className="h-10 flex-1 bg-white dark:bg-gray-850 rounded-xl animate-pulse" />
            <div className="h-10 flex-1 bg-white dark:bg-gray-850 rounded-xl animate-pulse" />
            <div className="h-10 flex-1 bg-white dark:bg-gray-850 rounded-xl animate-pulse" />
          </div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-48 bg-gray-100 dark:bg-gray-900 rounded-2xl animate-pulse border border-gray-200/50 dark:border-gray-800/50" />
            <div className="h-10 w-10 bg-gray-100 dark:bg-gray-900 rounded-2xl animate-pulse border border-gray-200/50 dark:border-gray-800/50" />
          </div>
        </div>

        {/* Content Box Skeleton */}
        <div className="rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 sm:p-8 space-y-6">
          <div className="flex items-start justify-between flex-wrap gap-4 border-b border-gray-100 dark:border-gray-800 pb-5">
            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-2">
                <div className="h-6 w-16 bg-gray-200 dark:bg-gray-850 rounded-lg animate-pulse" />
                <div className="h-6 w-20 bg-gray-200 dark:bg-gray-850 rounded-lg animate-pulse" />
              </div>
              <div className="h-8 w-1/3 bg-gray-250 dark:bg-gray-800 rounded-lg animate-pulse" />
            </div>
            <div className="h-10 w-32 bg-gray-200 dark:bg-gray-850 rounded-xl animate-pulse" />
          </div>

          <div className="space-y-4">
            <div className="h-4 w-full bg-gray-150 dark:bg-gray-850 rounded animate-pulse" />
            <div className="h-4 w-5/6 bg-gray-150 dark:bg-gray-850 rounded animate-pulse" />
            <div className="h-4 w-4/5 bg-gray-150 dark:bg-gray-850 rounded animate-pulse" />
            <div className="h-4 w-2/3 bg-gray-150 dark:bg-gray-850 rounded animate-pulse" />
          </div>

          <div className="pt-6 border-t border-gray-100 dark:border-gray-800 space-y-6">
            <div className="flex flex-wrap gap-6">
              <div className="space-y-2 flex-1">
                <div className="h-3 w-16 bg-gray-250 dark:bg-gray-800 rounded animate-pulse" />
                <div className="flex gap-2">
                  <div className="h-6 w-14 bg-gray-100 dark:bg-gray-850/60 rounded-lg animate-pulse" />
                  <div className="h-6 w-20 bg-gray-100 dark:bg-gray-850/60 rounded-lg animate-pulse" />
                </div>
              </div>
              <div className="space-y-2 flex-1">
                <div className="h-3 w-20 bg-gray-250 dark:bg-gray-800 rounded animate-pulse" />
                <div className="flex gap-2">
                  <div className="h-6 w-16 bg-gray-100 dark:bg-gray-850/60 rounded-lg animate-pulse" />
                  <div className="h-6 w-16 bg-gray-100 dark:bg-gray-850/60 rounded-lg animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !problem) {
    return (
      <div className="max-w-xl mx-auto my-16 p-8 rounded-3xl border border-red-200 dark:border-red-900/30 bg-red-50/50 dark:bg-red-950/10 text-center space-y-4">
        <div className="w-12 h-12 mx-auto rounded-full bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 flex items-center justify-center">
          <ShieldAlert size={22} />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-bold text-gray-900 dark:text-white">Error Loading Problem</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{error || "The requested problem is not available."}</p>
        </div>
        <div className="pt-2">
          <Link
            href="/practice"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:bg-gray-55 dark:hover:bg-gray-800 transition-colors shadow-sm cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>Back to Practice</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto px-4 py-6 space-y-6 select-none">
      {/* Shadcn-Style Premium Breadcrumbs */}
      <nav aria-label="Breadcrumb">
        <ol className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 font-medium">
          <li>
            <Link href="/practice" className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors cursor-pointer">
              Practice
            </Link>
          </li>
          <li className="flex items-center gap-2">
            <ChevronRight size={12} className="text-gray-300 dark:text-gray-700" />
            <span className="text-gray-400 dark:text-gray-500">Problems</span>
          </li>
          <li className="flex items-center gap-2">
            <ChevronRight size={12} className="text-gray-300 dark:text-gray-700" />
            <span className="text-gray-900 dark:text-gray-100 font-semibold truncate max-w-[200px] sm:max-w-none">
              {problem.title}
            </span>
          </li>
        </ol>
      </nav>

      {/* ProblemViewer Component */}
      <div>
        <ProblemViewer slug={slug} problemData={problem} />
      </div>
    </div>
  );
}
