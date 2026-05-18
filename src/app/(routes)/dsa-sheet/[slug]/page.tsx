"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { DSASheet } from "@/types/dsa-sheet";
import { SheetContentView } from "@/components/dsa/SheetContentView";
import { motion } from "framer-motion";

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
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-sm"
        >
          <div className="w-16 h-16 rounded-2xl bg-error-50 dark:bg-error-500/10 flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📭</span>
          </div>
          <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
            Sheet Not Found
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            We couldn&apos;t load &quot;{titleFallback}&quot;. It may not exist
            or the server might be unavailable.
          </p>
          <a
            href="/dsa-sheet"
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600 transition-colors"
          >
            ← Browse Sheets
          </a>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <SheetContentView sheet={sheetData} />
    </div>
  );
}
