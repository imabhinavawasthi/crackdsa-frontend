"use client";

import React, { use, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { 
  ArrowLeft, 
  ExternalLink, 
  Share2, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Send, 
  ChevronRight, 
  Home, 
  HelpCircle,
  Construction,
  Layers
} from "lucide-react";
import { CS_FUNDAMENTALS_TOPICS } from "@/config/cs-fundamentals.config";
import PdfUiViewer from "@/components/common/PdfUiViewer";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function CSFundamentalSubjectPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const [copied, setCopied] = useState(false);

  const topic = CS_FUNDAMENTALS_TOPICS.find((t) => t.slug === resolvedParams.slug);

  if (!topic) {
    notFound();
  }

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const isReady = topic.status === "ready";

  return (
    <div className="space-y-8 pb-16">
      {/* ─── 1. BREADCRUMB NAVIGATION ───────────────────────────────── */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-semibold text-gray-500 dark:text-gray-400">
        <Link href="/dashboard" className="flex items-center gap-1 hover:text-gray-900 dark:hover:text-white transition-colors">
          <Home size={14} />
          <span>Dashboard</span>
        </Link>
        <ChevronRight size={13} className="text-gray-300 dark:text-gray-600" />
        <Link href="/cs-fundamentals" className="hover:text-gray-900 dark:hover:text-white transition-colors">
          CS Fundamentals
        </Link>
        <ChevronRight size={13} className="text-gray-300 dark:text-gray-600" />
        <span className="text-gray-900 dark:text-white font-bold">{topic.title}</span>
      </nav>

      {/* ─── 2. READY STATE (OS, DBMS, OOPS) ────────────────────────── */}
      {isReady ? (
        <div className="space-y-8">
          {/* Header Card */}
          <div className="relative overflow-hidden rounded-3xl border border-gray-200/90 dark:border-gray-800 bg-linear-to-b from-white via-gray-50/50 to-white dark:from-gray-900 dark:via-gray-900/60 dark:to-gray-900 p-6 sm:p-10 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-3 max-w-2xl">
                <h1 className="text-2xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
                  {topic.headingPrefix}{" "}
                  <span className="text-[#27ae60] dark:text-emerald-400">
                    {topic.headingHighlight || topic.title}
                  </span>
                </h1>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 font-medium leading-relaxed">
                  {topic.description}
                </p>
              </div>

              {/* Action Buttons (No download option) */}
              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="flex items-center gap-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2.5 text-xs font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-xs"
                >
                  <Share2 size={14} />
                  <span>{copied ? "Link Copied!" : "Share"}</span>
                </button>

                {topic.topmateUrl && (
                  <a
                    href={topic.topmateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-xl border border-brand-500/30 bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 px-4 py-2.5 text-xs font-bold hover:bg-brand-100 dark:hover:bg-brand-900/50 transition-colors shadow-xs"
                  >
                    <span>Get on Topmate</span>
                    <ExternalLink size={13} />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Native UI PDF Document Viewer */}
          {topic.pdfUrl && (
            <div className="space-y-3">
              <PdfUiViewer url={topic.pdfUrl} title={topic.title} />
            </div>
          )}

          {/* Topics Covered Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-gray-200/90 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">
                <Layers size={14} />
                <span>Syllabus Covered</span>
              </div>
              <h3 className="text-lg font-black text-gray-900 dark:text-white">
                Core Concepts Inside
              </h3>
              <ul className="space-y-2.5">
                {topic.topicsCovered.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                    <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mt-0.5">
                      <CheckCircle2 size={12} className="stroke-[2.5]" />
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Key Questions Covered */}
            {topic.keyQuestions && (
              <div className="rounded-2xl border border-gray-200/90 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-xs space-y-4">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  <HelpCircle size={14} />
                  <span>Interview FAQ</span>
                </div>
                <h3 className="text-lg font-black text-gray-900 dark:text-white">
                  High-Frequency Interview Questions
                </h3>
                <ul className="space-y-2.5">
                  {topic.keyQuestions.map((q, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                      <span className="font-bold text-amber-500 shrink-0">Q{idx + 1}.</span>
                      <span className="font-medium">{q}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* ─── 3. UNDER CONSTRUCTION STATE (CN, SQL, DSA) ───────────── */
        <div className="space-y-8">
          <div className="relative overflow-hidden rounded-3xl border border-gray-200/90 dark:border-gray-800 bg-linear-to-b from-white via-gray-50/50 to-white dark:from-gray-900 dark:via-gray-900/60 dark:to-gray-900 p-8 sm:p-12 text-center shadow-xs">
            {/* Ambient Background Accent */}
            <div className="absolute top-0 right-0 size-80 bg-amber-500/10 dark:bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-2xl mx-auto space-y-5">
              {/* Construction Icon */}
              <div className="relative mx-auto size-16 sm:size-20 rounded-2xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center text-amber-600 dark:text-amber-400 shadow-md">
                <Construction size={36} />
                <span className="absolute -top-1 -right-1 flex size-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex rounded-full size-3 bg-amber-500" />
                </span>
              </div>

              {/* Status Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-400 text-xs font-bold">
                <Clock size={12} />
                <span>In Active Development</span>
              </div>

              <div className="space-y-2">
                <h1 className="text-2xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
                  {topic.title}
                </h1>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 font-medium max-w-xl mx-auto leading-relaxed">
                  Our mentors are crafting comprehensive, high-yield interview revision notes for this subject.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <Link
                  href="/cs-fundamentals"
                  className="flex items-center gap-2 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-5 py-2.5 text-xs font-bold hover:scale-105 active:scale-95 transition-all shadow-md"
                >
                  <ArrowLeft size={14} />
                  <span>Back to CS Fundamentals</span>
                </Link>

                <a
                  href="https://telegram.me/cpabhinav"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-xl border border-sky-500/30 bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 px-5 py-2.5 text-xs font-bold hover:bg-sky-100 dark:hover:bg-sky-900/40 transition-colors"
                >
                  <Send size={14} className="text-sky-500" />
                  <span>Join Telegram for Early Access</span>
                </a>
              </div>
            </div>
          </div>

          {/* Preview of Upcoming Syllabus */}
          <div className="space-y-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                WHAT WE'RE BUILDING
              </span>
              <h3 className="text-xl font-black text-gray-900 dark:text-white">
                Upcoming Modules in this Guide
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {topic.topicsCovered.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-gray-200/80 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 space-y-2 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="size-8 rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center text-xs font-black">
                      {idx + 1}
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">
                      {item}
                    </h4>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-brand-600 dark:text-brand-400">
                    <Sparkles size={11} />
                    <span>Coming Soon</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
