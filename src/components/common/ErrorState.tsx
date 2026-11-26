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
    <div className="max-w-xl mx-auto my-12 p-8 sm:p-10 rounded-[2.5rem] border border-red-200/80 dark:border-red-900/30 bg-red-50/40 dark:bg-red-950/20 backdrop-blur-xl text-center space-y-5 animate-in fade-in zoom-in-95 duration-300 select-none shadow-xl shadow-red-500/5 relative overflow-hidden">
      {/* Background soft ambient blur */}
      <div className="absolute -top-12 -right-12 w-36 h-36 bg-red-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="w-14 h-14 mx-auto rounded-2xl bg-red-100/80 dark:bg-red-900/40 text-red-600 dark:text-red-400 flex items-center justify-center shadow-inner border border-red-200/60 dark:border-red-800/40">
        <Icon size={24} className="stroke-[2.2]" />
      </div>
      <div className="space-y-1.5 max-w-md mx-auto">
        <h3 className="text-lg font-black text-gray-900 dark:text-white tracking-tight">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
          {message}
        </p>
      </div>
      {(backLink || onRetry) && (
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          {onRetry && (
            <button
              onClick={onRetry}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-extrabold bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:opacity-90 active:scale-95 transition-all shadow-md cursor-pointer"
            >
              <RotateCcw size={15} />
              <span>Retry</span>
            </button>
          )}
          {backLink && (
            <Link
              href={backLink}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-extrabold bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/80 active:scale-95 transition-all shadow-xs cursor-pointer"
            >
              <ArrowLeft size={15} />
              <span>{backLabel}</span>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
