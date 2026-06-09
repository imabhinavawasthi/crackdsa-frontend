"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { DSASheet } from "@/types/dsa-sheet";
import { SheetContentView } from "@/components/dsa/SheetContentView";
import { motion } from "framer-motion";
import ErrorState from "@/components/common/ErrorState";

export default function DSASheetDynamicPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [sheetData, setSheetData] = useState<DSASheet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Format slug for title fallback
  const titleFallback = slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  useEffect(() => {
    let isMounted = true;

    const fetchSheet = async () => {
      try {
        setLoading(true);
        setError(false);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/dsa-sheets/${slug}`
        );

        if (!res.ok) {
          throw new Error(`Failed to fetch sheet: ${res.statusText}`);
        }

        const data = await res.json();

        if (isMounted) {
          setSheetData(data);
        }
      } catch (err) {
        console.error("Failed to fetch sheet:", err);
        if (isMounted) setError(true);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (slug) {
      fetchSheet();
    }

    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          {/* Skeleton loader */}
          <div className="w-10 h-10 rounded-full border-[3px] border-brand-200 border-t-brand-500 animate-spin" />
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
              Loading Sheet
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              {titleFallback}
            </p>
          </div>
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
      <SheetContentView sheet={sheetData} />
    </div>
  );
}
