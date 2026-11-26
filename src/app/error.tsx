"use client";

import GridShape from "@/components/common/GridShape";
import Link from "next/link";
import React, { useEffect } from "react";
import { RotateCcw, Home } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Application Error Boundary Caught]:", error);
  }, [error]);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen p-6 overflow-hidden z-1 bg-white dark:bg-gray-950">
      <GridShape />
      <div className="mx-auto w-full max-w-[280px] text-center sm:max-w-[480px]">
        <h1 className="mb-4 font-bold text-gray-800 text-title-md dark:text-white/90 xl:text-title-2xl">
          SOMETHING WENT WRONG
        </h1>

        <div className="my-6 inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-red-500/10 text-red-500 dark:bg-red-500/20 dark:text-red-400">
          <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>

        <p className="mb-8 text-base text-gray-700 dark:text-gray-400 sm:text-lg">
          An unexpected error occurred. Don&apos;t worry, you can retry the action or return to the home page.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white px-5 py-3 text-sm font-semibold shadow-theme-xs transition-colors cursor-pointer"
          >
            <RotateCcw size={16} />
            <span>Try Again</span>
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
          >
            <Home size={16} />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <p className="absolute text-sm text-center text-gray-500 -translate-x-1/2 bottom-6 left-1/2 dark:text-gray-400">
        &copy; {new Date().getFullYear()} - crackDSA
      </p>
    </div>
  );
}
