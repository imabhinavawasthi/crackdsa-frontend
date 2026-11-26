"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Code2, Cpu, Database, Binary, Building2, Sparkles } from "lucide-react";
import { fetchCompaniesSummary } from "@/api/problems";
import { CompanySummary } from "@/types/practice";

// ─── Company Logos ─────────────────────────────────────────────────────────────
function GoogleLogo({ className = "size-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-label="Google">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
      />
    </svg>
  );
}

function AmazonLogo({ className = "size-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 448 512" aria-label="Amazon">
      {/* Upper glyph 'a' */}
      <path
        fill="currentColor"
        d="M257.2 162.7c-48.7 1.8-169.5 15.5-169.5 117.5c0 109.5 138.3 114 183.5 43.2c6.5 10.2 35.4 37.5 45.3 46.8l56.8-56S341 288.9 341 261.4V114.3C341 89 316.5 32 228.7 32C140.7 32 94 87 94 136.3l73.5 6.8c16.3-49.5 54.2-49.5 54.2-49.5c40.7-.1 35.5 29.8 35.5 69.1m0 86.8c0 80-84.2 68-84.2 17.2c0-47.2 50.5-56.7 84.2-57.8z"
      />
      {/* Signature curved smile arrow in Amazon orange */}
      <path
        fill="#FF9900"
        d="m393.2 413c-7.7 10-70 67-174.5 67S34.2 408.5 9.7 379c-6.8-7.7 1-11.3 5.5-8.3C88.5 415.2 203 488.5 387.7 401c7.5-3.7 13.3 2 5.5 12m39.8 2.2c-6.5 15.8-16 26.8-21.2 31c-5.5 4.5-9.5 2.7-6.5-3.8s19.3-46.5 12.7-55c-6.5-8.3-37-4.3-48-3.2c-10.8 1-13 2-14-.3c-2.3-5.7 21.7-15.5 37.5-17.5c15.7-1.8 41-.8 46 5.7c3.7 5.1 0 27.1-6.5 43.1"
      />
    </svg>
  );
}

function MicrosoftLogo({ className = "size-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-label="Microsoft" fill="none">
      <rect x="2" y="2" width="9.5" height="9.5" rx="1.5" fill="#F25022" />
      <rect x="12.5" y="2" width="9.5" height="9.5" rx="1.5" fill="#7FBA00" />
      <rect x="2" y="12.5" width="9.5" height="9.5" rx="1.5" fill="#00A4EF" />
      <rect x="12.5" y="12.5" width="9.5" height="9.5" rx="1.5" fill="#FFB900" />
    </svg>
  );
}

function UberLogo({ className = "size-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-label="Uber" fill="currentColor">
      <path d="M0 7.97v4.958c0 1.867 1.302 3.101 3 3.101.826 0 1.562-.316 2.094-.87v.736H6.27V7.97H5.082v4.888c0 1.257-.85 2.106-1.947 2.106-1.11 0-1.946-.827-1.946-2.106V7.971H0zm7.44 0v7.925h1.13v-.725c.521.532 1.257.86 2.06.86a3.006 3.006 0 0 0 3.034-3.01 3.01 3.01 0 0 0-3.033-3.024 2.86 2.86 0 0 0-2.049.861V7.971H7.439zm9.869 2.038c-1.687 0-2.965 1.37-2.965 3 0 1.72 1.334 3.01 3.066 3.01 1.053 0 1.913-.463 2.49-1.233l-.826-.611c-.43.577-.996.847-1.664.847-.973 0-1.753-.7-1.912-1.64h4.697v-.373c0-1.72-1.222-3-2.886-3zm6.295.068c-.634 0-1.098.294-1.381.758v-.713h-1.131v5.774h1.142V12.61c0-.894.544-1.47 1.291-1.47H24v-1.065h-.396zm-6.319.928c.85 0 1.564.588 1.756 1.47H15.52c.203-.882.916-1.47 1.765-1.47zm-6.732.012c1.086 0 1.98.883 1.98 2.004a1.993 1.993 0 0 1-1.98 2.001A1.989 1.989 0 0 1 8.56 13.02a1.99 1.99 0 0 1 1.992-2.004z" />
    </svg>
  );
}

// ─── Initial Company Presets ──────────────────────────────────────────────────
interface CompanyCardData {
  slug: string;
  name: string;
  desc: string;
  badge: string;
  count: number;
  easyCount: number;
  medCount: number;
  hardCount: number;
  logo: React.ReactNode;
  iconBg: string;
  iconBorder: string;
  accentBorder: string;
}

const INITIAL_COMPANIES: CompanyCardData[] = [
  {
    slug: "google",
    name: "Google",
    desc: "Algorithms, Dynamic Programming, Graphs & Scale",
    badge: "FAANG",
    count: 178,
    easyCount: 45,
    medCount: 111,
    hardCount: 22,
    logo: <GoogleLogo className="size-5 shrink-0" />,
    iconBg: "bg-blue-50/80 dark:bg-blue-950/40",
    iconBorder: "border-blue-200/60 dark:border-blue-800/50",
    accentBorder: "hover:border-blue-500/50 dark:hover:border-blue-500/50 hover:shadow-blue-500/5",
  },
  {
    slug: "amazon",
    name: "Amazon",
    desc: "Trees, Graphs, Sliding Window & Scenarios",
    badge: "FAANG",
    count: 186,
    easyCount: 47,
    medCount: 116,
    hardCount: 23,
    logo: <AmazonLogo className="size-5 shrink-0 text-gray-900 dark:text-white" />,
    iconBg: "bg-amber-50/80 dark:bg-amber-950/40",
    iconBorder: "border-amber-200/60 dark:border-amber-800/50",
    accentBorder: "hover:border-amber-500/50 dark:hover:border-amber-500/50 hover:shadow-amber-500/5",
  },
  {
    slug: "microsoft",
    name: "Microsoft",
    desc: "Arrays, Strings, Linked Lists & Core Structures",
    badge: "Top Tech",
    count: 173,
    easyCount: 43,
    medCount: 108,
    hardCount: 22,
    logo: <MicrosoftLogo className="size-5 shrink-0" />,
    iconBg: "bg-sky-50/80 dark:bg-sky-950/40",
    iconBorder: "border-sky-200/60 dark:border-sky-800/50",
    accentBorder: "hover:border-cyan-500/50 dark:hover:border-cyan-500/50 hover:shadow-cyan-500/5",
  },
  {
    slug: "uber",
    name: "Uber",
    desc: "System Scale, Geospatial, Graphs & Concurrency",
    badge: "Tier-1",
    count: 42,
    easyCount: 5,
    medCount: 27,
    hardCount: 10,
    logo: <UberLogo className="size-5 shrink-0 text-gray-900 dark:text-white" />,
    iconBg: "bg-zinc-100/90 dark:bg-zinc-800/60",
    iconBorder: "border-zinc-200/80 dark:border-zinc-700/60",
    accentBorder: "hover:border-zinc-500/50 dark:hover:border-zinc-500/50 hover:shadow-zinc-500/5",
  },
];

export default function DashboardPopularTopics() {
  const [companies, setCompanies] = useState<CompanyCardData[]>(INITIAL_COMPANIES);

  // Sync with live problem counts from backend summary
  useEffect(() => {
    fetchCompaniesSummary()
      .then((data: CompanySummary[]) => {
        if (!Array.isArray(data)) return;
        const countMap = new Map<string, CompanySummary>();
        data.forEach((c) => countMap.set(c.slug.toLowerCase(), c));

        setCompanies((prev) =>
          prev.map((item) => {
            const live = countMap.get(item.slug.toLowerCase());
            if (!live) return item;
            return {
              ...item,
              count: live.count ?? item.count,
              easyCount: live.easy_count ?? item.easyCount,
              medCount: live.medium_count ?? item.medCount,
              hardCount: live.hard_count ?? item.hardCount,
            };
          })
        );
      })
      .catch(() => {});
  }, []);

  const topics = [
    {
      name: "Array & Two Pointers",
      slug: "array",
      desc: "Continuous memory and sliding window patterns",
      count: "97 problems",
      icon: Code2,
    },
    {
      name: "Binary Search",
      slug: "binary-search",
      desc: "Monotonic search spaces and answer optimization",
      count: "12 problems",
      icon: Binary,
    },
    {
      name: "Dynamic Programming",
      slug: "dynamic-programming",
      desc: "Optimal substructure and state memoization",
      count: "33 problems",
      icon: Cpu,
    },
    {
      name: "Hash Table",
      slug: "hash-table",
      desc: "Constant time lookups and frequency counting",
      count: "33 problems",
      icon: Database,
    },
  ];

  return (
    <div className="space-y-8">
      {/* ─── 1. PREPARE BY COMPANY ───────────────────────────────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
              <span>Prepare by Company</span>
            </h2>
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              <Sparkles size={11} />
              Top Recruiters
            </span>
          </div>

          <Link
            href="/practice/companies"
            className="group inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          >
            <span>View all companies</span>
            <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {companies.map((c) => (
            <Link
              key={c.slug}
              href={`/practice/companies/${c.slug}`}
              className={`group rounded-2xl border border-gray-200/90 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-xs ${c.accentBorder} hover:shadow-sm hover:-translate-y-0.5 transition-all flex flex-col justify-between`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div
                    className={`flex size-10 items-center justify-center rounded-xl ${c.iconBg} border ${c.iconBorder} transition-transform group-hover:scale-105`}
                  >
                    {c.logo}
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200/60 dark:border-gray-700/60 font-mono">
                    {c.badge}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-black text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {c.name}
                  </h3>
                  <p className="mt-1 text-[11px] text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                    {c.desc}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-[11px] font-bold">
                <div className="flex items-center gap-1 text-gray-400 font-medium">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">{c.count}</span>
                  <span>probs</span>
                  <span className="text-gray-300 dark:text-gray-700">•</span>
                  <span className="text-emerald-600 dark:text-emerald-400 text-[10px] font-semibold">{c.easyCount}E</span>
                  <span className="text-amber-600 dark:text-amber-400 text-[10px] font-semibold">{c.medCount}M</span>
                  <span className="text-rose-600 dark:text-rose-400 text-[10px] font-semibold">{c.hardCount}H</span>
                </div>
                <span className="text-blue-600 dark:text-blue-400 flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                  Practice <ArrowRight size={11} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ─── 2. POPULAR TOPICS ───────────────────────────────────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
            <span>Popular Topics</span>
          </h2>
          <Link
            href="/practice/topics"
            className="group inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          >
            <span>View all topics</span>
            <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {topics.map((t) => {
            const Icon = t.icon;
            return (
              <Link
                key={t.slug}
                href={`/practice/topics/${t.slug}`}
                className="group rounded-2xl border border-gray-200/90 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-xs hover:border-blue-500/40 dark:hover:border-blue-500/40 hover:shadow-sm hover:-translate-y-0.5 transition-all flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="flex size-9 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-800/50">
                    <Icon size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {t.name}
                    </h3>
                    <p className="mt-1 text-[11px] text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                      {t.desc}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-[11px] font-bold">
                  <span className="text-gray-400">{t.count}</span>
                  <span className="text-blue-600 dark:text-blue-400 flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                    Solve <ArrowRight size={11} />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
