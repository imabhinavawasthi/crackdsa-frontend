"use client";

import Link from "next/link";
import React, { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Global Root Error Caught]:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex flex-col items-center justify-center min-h-screen p-6 font-sans">
        <div className="text-center max-w-md mx-auto">
          <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-500/10 text-red-500">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-black mb-3">System Critical Error</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm leading-relaxed">
            A critical unexpected exception was encountered. Please reload the application or return to home.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => reset()}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Reload Application
            </button>
            <Link
              href="/"
              className="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 text-xs font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
