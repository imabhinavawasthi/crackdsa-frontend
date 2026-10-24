"use client";

import React from "react";
import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export function ProMembershipPromoCard() {
  const { isPro, isLoading } = useAuth();

  // Hide the promo card if the user already has an active Pro subscription,
  // or while the central auth state is initially loading.
  if (isLoading || isPro) {
    return null;
  }

  const perks = [
    "All Video Courses & Roadmaps",
    "All Live Classes & Archive Recordings",
    "Complete DSA Problem Solutions",
    "1-on-1 Mentor Support",
  ];

  return (
    <div className="w-full rounded-2xl sm:rounded-3xl bg-white dark:bg-gray-900 border border-slate-200/90 dark:border-gray-800 p-6 sm:p-7 shadow-2xs">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        {/* Left Side: Badge, Title, Description & Perks */}
        <div className="space-y-3 flex-1 min-w-0">
          <div className="space-y-1">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Unlock All Courses, Live Classes &amp; Complete DSA Resources
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
              Subscribe to Pro to get all-inclusive access to all existing and future video courses, weekly live problem solving, problem editorials, and complete interview preparation resources.
            </p>
          </div>

          {/* Horizontal Perks Row */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
            {perks.map((perk, idx) => (
              <span key={idx} className="inline-flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                <span>{perk}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Right Side: Primary Action Button */}
        <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-2 w-full sm:w-auto">
          <Link
            href="/pro"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-[#2563eb] hover:bg-[#1d4ed8] shadow-xs transition-all duration-150 cursor-pointer"
          >
            <span>Subscribe to Pro</span>
            <ArrowRight size={14} />
          </Link>
          <Link
            href="/pro"
            className="text-[11px] font-semibold text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 text-center transition-colors"
          >
            Compare Plans &amp; Benefits
          </Link>
        </div>
      </div>
    </div>
  );
}
