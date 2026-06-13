"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { DSASheet, DetailedProblem } from "@/types/dsa-sheet";
import { SheetContentView } from "@/components/dsa/SheetContentView";
import ErrorState from "@/components/common/ErrorState";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchSheetDetail, fetchSheetProblems } from "@/api/sheets";
import { fetchUserAssetStates, updateUserAssetState } from "@/api/user";
import { useAuth } from "@/context/AuthContext";

export default function DSASheetDynamicPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [sheetData, setSheetData] = useState<DSASheet | null>(null);
  const [sheetProblems, setSheetProblems] = useState<DetailedProblem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const { isLoggedIn } = useAuth();
  const [userProblemStates, setUserProblemStates] = useState<Record<string, string>>({});
  const [bookmarkedProblemIds, setBookmarkedProblemIds] = useState<string[]>([]);

  // Format slug for title fallback
  const titleFallback = slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        setLoading(true);
        setError(false);

        // Fetch sheet details, sheet problems, and user state concurrently
        const [sheetResult, problemsResult, userStatesResult] = await Promise.allSettled([
          fetchSheetDetail(slug),
          fetchSheetProblems(slug),
          fetchUserAssetStates()
        ]);

        if (sheetResult.status === "rejected") {
          throw new Error("Failed to load sheet details");
        }

        if (isMounted) {
          setSheetData(sheetResult.value);
          
          const fetchedProblems = problemsResult.status === "fulfilled" ? problemsResult.value : [];
          setSheetProblems(fetchedProblems);

          // Process user states if successful (fail gracefully if not logged in)
          if (userStatesResult.status === "fulfilled" && userStatesResult.value) {
            const problemStates: Record<string, string> = {};
            const stateMap = new Map<string, string>(); // id -> status
            const bookmarkedIds: string[] = [];
            
            userStatesResult.value.forEach(state => {
              if (state.asset_type === "problem") {
                stateMap.set(state.asset_id, state.status);
                if (state.is_bookmarked) bookmarkedIds.push(state.asset_id);
              }
            });
            
            // Map the frontend slugs to their actual status using the problems mapping
            fetchedProblems.forEach(p => {
              const status = stateMap.get(p.id);
              if (status) {
                problemStates[p.slug] = status;
              }
            });
            
            setUserProblemStates(problemStates);
            setBookmarkedProblemIds(bookmarkedIds);
          }
        }
      } catch (err) {
        console.error("Failed to load data:", err);
        if (isMounted) setError(true);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (slug) {
      loadData();
    }

    return () => {
      isMounted = false;
    };
  }, [slug]);

  const handleToggleSolved = async (id: string, problemSlug: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isLoggedIn) return;

    const currentStatus = userProblemStates[problemSlug] || "pending";
    const newStatus = (currentStatus === "done" || currentStatus === "revision") ? "pending" : "done";

    setUserProblemStates(prev => ({ ...prev, [problemSlug]: newStatus }));

    try {
      await updateUserAssetState("problem", id, { status: newStatus });
    } catch (err) {
      console.error("Failed to update status in DB:", err);
    }
  };

  const handleToggleBookmark = async (id: string, problemSlug: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isLoggedIn) return;

    const isCurrentlyBookmarked = bookmarkedProblemIds.includes(id);
    const newBookmarks = isCurrentlyBookmarked
      ? bookmarkedProblemIds.filter(pid => pid !== id)
      : [...bookmarkedProblemIds, id];

    setBookmarkedProblemIds(newBookmarks);

    try {
      await updateUserAssetState("problem", id, { is_bookmarked: !isCurrentlyBookmarked });
    } catch (err) {
      console.error("Failed to update bookmark in DB:", err);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-6">
        {/* Header + Progress Skeleton */}
        <div className="rounded-[2rem] border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 md:p-8 space-y-6 shadow-sm">
          <div className="space-y-4">
            <Skeleton className="h-4 w-32 rounded-full" />
            <Skeleton className="h-10 w-2/3 md:w-1/2 rounded-xl" />
            <Skeleton className="h-5 w-4/5 md:w-2/3 rounded-lg" />
            <div className="flex gap-2 pt-1">
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
          </div>
          <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950 p-5 flex flex-col md:flex-row gap-6 items-center">
            <Skeleton className="h-16 w-16 rounded-full shrink-0" />
            <div className="space-y-3 flex-1 w-full">
              <Skeleton className="h-5 w-40 rounded" />
              <Skeleton className="h-3 w-full rounded-full" />
              <Skeleton className="h-4 w-1/3 rounded" />
            </div>
          </div>
        </div>
        <div className="flex gap-4">
          <Skeleton className="h-10 w-full md:w-96 rounded-xl" />
          <Skeleton className="h-10 w-32 rounded-xl" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-20 w-full rounded-xl" />
          <Skeleton className="h-20 w-full rounded-xl" />
          <Skeleton className="h-20 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (error || !sheetData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <ErrorState
          title="Sheet Not Found"
          message={`We couldn't load "${titleFallback}". It may not exist or the server might be unavailable.`}
          backLink="/dsa-sheet"
          backLabel="Browse Sheets"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <SheetContentView 
        sheet={sheetData} 
        sheetProblems={sheetProblems}
        userProblemStates={userProblemStates}
        bookmarkedProblemIds={bookmarkedProblemIds}
        isLoggedIn={isLoggedIn}
        onToggleSolved={handleToggleSolved}
        onToggleBookmark={handleToggleBookmark}
      />
    </div>
  );
}
