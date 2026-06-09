import React from "react";
import Link from "next/link";
import { ShieldAlert, ArrowLeft, RotateCcw } from "lucide-react";

interface ErrorStateProps {
  title?: string;
  message?: string | null;
  backLink?: string;
  backLabel?: string;
  onRetry?: () => void;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
}

export default function ErrorState({
  title = "Error Loading Content",
  message = "Something went wrong while loading the page details.",
  backLink,
  backLabel = "Go Back",
  onRetry,
  icon: Icon = ShieldAlert,
}: ErrorStateProps) {
  return (
    <div className="max-w-xl mx-auto my-16 p-8 rounded-3xl border border-red-200 dark:border-red-900/30 bg-red-50/50 dark:bg-red-950/10 text-center space-y-4 animate-in fade-in zoom-in-95 duration-300 select-none">
      <div className="w-12 h-12 mx-auto rounded-full bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 flex items-center justify-center">
        <Icon size={22} className="stroke-[2.5]" />
      </div>
      <div className="space-y-1">
        <h3 className="text-base font-bold text-gray-900 dark:text-white">
          {title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
          {message}
        </p>
      </div>
      {(backLink || onRetry) && (
        <div className="pt-2 flex items-center justify-center gap-3">
          {onRetry && (
            <button
              onClick={onRetry}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:opacity-90 transition-all shadow-sm cursor-pointer"
            >
              <RotateCcw size={16} />
              <span>Retry</span>
            </button>
          )}
          {backLink && (
            <Link
              href={backLink}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm cursor-pointer"
            >
              <ArrowLeft size={16} />
              <span>{backLabel}</span>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
