"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import ProblemViewer from "@/components/learning/ProblemViewer";
import { fetchProblemDetail } from "@/api/problems";
import ErrorState from "@/components/common/ErrorState";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import { Skeleton } from "@/components/ui/skeleton";

function ProblemDetailSkeleton() {
  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4 border-b border-gray-100 dark:border-gray-800 pb-5">
        <div className="space-y-3 flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
          <Skeleton className="h-7 w-2/3 rounded-lg" />
          <Skeleton className="h-8 w-28 rounded-xl" />
        </div>
      </div>
      <div className="space-y-3">
        <Skeleton className="h-4 w-full rounded-md" />
        <Skeleton className="h-4 w-5/6 rounded-md" />
        <Skeleton className="h-4 w-4/5 rounded-md" />
        <Skeleton className="h-4 w-2/3 rounded-md" />
        <Skeleton className="h-4 w-3/4 rounded-md" />
      </div>
      <div className="pt-4 border-t border-gray-100 dark:border-gray-800 space-y-4">
        <div className="flex flex-wrap gap-4">
          <div className="space-y-2">
            <Skeleton className="h-3 w-14 rounded" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-14 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProblemDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [problem, setProblem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    const getProblemDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchProblemDetail(slug); 
        setProblem(data);
      } catch (err: any) {
        console.error("Error fetching problem detail:", err);
        setError(err.message || "Something went wrong while loading the problem.");
      } finally {
        setLoading(false);
      }
    };

    getProblemDetail();
  }, [slug]);

  const breadcrumbItems = [
    { title: "Practice", href: "/practice" },
    { title: "Problems" },
  ];

  if (error || (!loading && !problem)) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-8 space-y-4 select-none">
        <Breadcrumbs
          listClassName="text-xs font-medium"
          items={breadcrumbItems}
        />
        <ErrorState
          title="Error Loading Problem"
          message={error || "The requested problem is not available."}
          backLink="/practice"
          backLabel="Back to Practice Ground"
        />
      </div>
    );
  }

  if (problem?.title) {
    breadcrumbItems.push({ title: problem.title });
  } else if (loading) {
    breadcrumbItems.push({ title: "..." });
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-8 space-y-4 select-none">
      <Breadcrumbs
        listClassName="text-xs font-medium"
        items={breadcrumbItems}
      />

      {/* Card shell wraps everything */}
      <div className="rounded-2xl sm:rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
        {loading ? (
          <ProblemDetailSkeleton />
        ) : (
          <ProblemViewer slug={slug} problemData={problem} />
        )}
      </div>
    </div>
  );
}
