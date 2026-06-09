"use client";

import React from "react";
import { Lock, ArrowRight } from "lucide-react";
import Link from "next/link";

interface LoginRequiredProps {
  title?: string;
  description?: string;
  redirectPath?: string;
  className?: string;
}

const LoginRequired: React.FC<LoginRequiredProps> = ({
  title = "Authentication Required",
  description = "You must be signed in to access this feature and synchronize your progress.",
  redirectPath = "/login",
  className = "",
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-3xl shadow-sm space-y-5 select-none ${className}`}>
      <div className="flex items-center justify-center w-14 h-14 rounded-full bg-brand-500/10 text-brand-500 border border-brand-500/10 animate-pulse">
        <Lock size={22} className="stroke-[2.5]" />
      </div>

      <div className="space-y-2 max-w-sm">
        <h3 className="text-base font-bold text-gray-900 dark:text-white tracking-tight">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
          {description}
        </p>
      </div>

      <Link 
        href={redirectPath}
        className="inline-flex items-center gap-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold py-2.5 px-5 text-xs shadow-md shadow-brand-500/15 hover:shadow-lg transition-all active:scale-[0.98]"
      >
        <span>Sign In to Continue</span>
        <ArrowRight size={13} className="stroke-[2.5]" />
      </Link>
    </div>
  );
};

export default LoginRequired;
