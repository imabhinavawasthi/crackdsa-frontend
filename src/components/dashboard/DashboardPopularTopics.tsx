"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Code2, Network, Cpu, Database, Binary, GitFork } from "lucide-react";

export default function DashboardPopularTopics() {
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
              className="group rounded-2xl border border-gray-200/90 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-xs hover:border-blue-500/40 dark:hover:border-blue-500/40 hover:shadow-sm transition-all flex flex-col justify-between"
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
  );
}
