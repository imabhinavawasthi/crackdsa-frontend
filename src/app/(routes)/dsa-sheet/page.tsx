"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  Search, 
  ArrowRight,
  MessageSquare,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchSheets } from "@/api/sheets";
import { DSASheet } from "@/types/dsa-sheet";
import DSASheetCard from "@/components/dsa/DSASheetCard";
import DSASheetLibraryHero from "@/components/dsa/DSASheetLibraryHero";

// ─── WhatsApp SVG Icon ─────────────────────────────────────────────────────────
function WhatsAppIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="#25D366">
      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm0 18.15c-1.49 0-2.94-.4-4.21-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c.02 4.54-3.68 8.23-8.22 8.23zm4.52-6.16c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43s-.56-1.34-.76-1.84c-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.84-.86 2.05s.88 2.38 1 2.55c.12.17 1.74 2.65 4.21 3.72.59.25 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.07-.1-.23-.17-.48-.29z"/>
    </svg>
  );
}

// ─── Default Reference Sheets Preset ──────────────────────────────────────────
const STATIC_DIRECTORY_SHEETS = [
  {
    id: "company-wise-sheet",
    title: "CompanyWise Sheet",
    description: "Topic-wise questions asked by top product and service companies.",
    total_topics: 15,
    total_problems: 300,
    tags: ["Interview Preparation", "FAANG", "Top Product Companies"],
    level: "all levels",
    href: "/practice/companies",
  },
  {
    id: "topic-wise-sheet",
    title: "TopicWise Sheet",
    description: "Focused sheets for each DSA topic with progressive difficulty.",
    total_topics: 20,
    total_problems: 500,
    tags: ["Basics to Advanced", "DSA Fundamentals", "Interview Preparation"],
    level: "beginner",
    href: "/practice/topics",
  },
  {
    id: "cp-problem-sheet",
    title: "CP Problem Sheet",
    description: "Handpicked problems to improve your competitive programming skills.",
    total_topics: 12,
    total_problems: 200,
    tags: ["Contest Prep", "Advanced", "Implementation"],
    level: "intermediate",
    href: "/cp/newbie-to-expert",
  },
];

const CATEGORY_TABS = [
  "All Sheets",
  "Basics to Advanced",
  "FAANG",
  "Interview Preparation",
  "Last Minute Revision",
];

export default function DSASheetsPage() {
  const [apiSheets, setApiSheets] = useState<DSASheet[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Sheets");

  useEffect(() => {
    fetchSheets()
      .then((data) => {
        if (Array.isArray(data)) {
          setApiSheets(data);
        }
      })
      .catch((err) => console.error("Error fetching sheets:", err))
      .finally(() => setLoading(false));
  }, []);

  // Merge API sheets and directory sheets into full collection
  const allSheets = useMemo(() => {
    const list: any[] = [];

    // Prioritize API sheets (Pattern Mastery, 0 to Hero, Sprint 75)
    if (apiSheets.length > 0) {
      apiSheets.forEach((s) => list.push(s));
    } else {
      // Fallback initial representations of the 3 API sheets if offline or loading
      list.push(
        {
          id: "pattern-mastery",
          title: "Pattern Mastery Sheet",
          description: "Learn core algorithmic patterns to solve any problem efficiently.",
          total_topics: 29,
          total_problems: 173,
          tags: ["Interview Preparation", "FAANG"],
          level: "intermediate",
        },
        {
          id: "0-to-hero-dsa",
          title: "0 to Hero DSA",
          description: "Structured roadmap to go from basics to advanced with handpicked problems.",
          total_topics: 12,
          total_problems: 175,
          tags: ["DSA Fundamentals", "Interview Preparation", "Basics to Advanced"],
          level: "beginner",
        },
        {
          id: "crackdsa-revision-sprint",
          title: "crackDSA Sprint 75",
          description: "Must-solve 75 questions for quick interview revision.",
          total_topics: 10,
          total_problems: 75,
          tags: ["Last Minute Revision", "Top Product Companies", "Interview Preparation"],
          level: "intermediate",
        }
      );
    }

    // Append the 3 flagship directory sheets (CompanyWise, TopicWise, CP Sheet)
    STATIC_DIRECTORY_SHEETS.forEach((s) => {
      if (!list.some((existing) => existing.id === s.id)) {
        list.push(s);
      }
    });

    return list;
  }, [apiSheets]);

  // Filter sheets based on search, category tab, and selected topic
  const filteredSheets = useMemo(() => {
    return allSheets.filter((sheet) => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        sheet.title.toLowerCase().includes(q) ||
        (sheet.description && sheet.description.toLowerCase().includes(q)) ||
        (sheet.tags && sheet.tags.some((t: string) => t.toLowerCase().includes(q)));

      // Category tab filter
      let matchCategory = true;
      if (selectedCategory === "Basics to Advanced") {
        matchCategory =
          sheet.id.includes("0-to-hero") ||
          sheet.id.includes("topic") ||
          (sheet.tags && sheet.tags.some((t: string) => t.toLowerCase().includes("basic") || t.toLowerCase().includes("fundamental")));
      } else if (selectedCategory === "FAANG") {
        matchCategory =
          sheet.id.includes("pattern") ||
          sheet.id.includes("company") ||
          (sheet.tags && sheet.tags.some((t: string) => t.toLowerCase().includes("faang") || t.toLowerCase().includes("product")));
      } else if (selectedCategory === "Interview Preparation") {
        matchCategory =
          !sheet.id.includes("cp-problem") &&
          (sheet.tags?.includes("Interview Preparation") || sheet.id.includes("pattern") || sheet.id.includes("sprint") || sheet.id.includes("hero") || sheet.id.includes("company"));
      } else if (selectedCategory === "Last Minute Revision") {
        matchCategory =
          sheet.id.includes("sprint") ||
          (sheet.tags && sheet.tags.some((t: string) => t.toLowerCase().includes("revision")));
      }

      return matchSearch && matchCategory;
    });
  }, [allSheets, searchQuery, selectedCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 pb-20 select-none transition-colors">
      {/* ─── 1. HERO SECTION ──────────────────────────────────────────────── */}
      <DSASheetLibraryHero />

      {/* ─── 2. SEARCH & CATEGORY PILLS ROW ───────────────────────────────── */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full lg:max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none" />
          <input
            type="text"
            placeholder="Search sheets by title, topic or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 rounded-xl border border-gray-200/90 dark:border-gray-800 bg-white dark:bg-gray-900 pl-10 pr-9 text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all focus:outline-none shadow-2xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              aria-label="Clear sheet search"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto hide-scrollbar pb-1 lg:pb-0">
          {CATEGORY_TABS.map((tab) => {
            const isSelected = selectedCategory === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setSelectedCategory(tab)}
                className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                  isSelected
                    ? "bg-blue-600 text-white shadow-sm shadow-blue-500/25"
                    : "bg-gray-100/90 dark:bg-gray-800/80 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── 3. CARDS GRID ─────────────────────────────────────────────────── */}
      {filteredSheets.length === 0 ? (
        <div className="rounded-3xl border border-gray-200/90 dark:border-gray-800 bg-white dark:bg-gray-900 p-12 text-center space-y-3">
          <Search className="size-8 mx-auto text-gray-400" />
          <h3 className="text-base font-bold text-gray-900 dark:text-white">No sheets found</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
            We couldn't find any sheets matching your current filter. Try clearing your search query or switching categories.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("All Sheets");
            }}
            className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-sm hover:bg-blue-700 transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredSheets.map((sheet, idx) => (
              <motion.div
                key={sheet.id}
                layout
                initial={{ opacity: 0, scale: 0.98, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.25, delay: idx * 0.04 }}
              >
                <DSASheetCard sheet={sheet} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* ─── 5. BOTTOM WHATSAPP SUGGESTION BANNER ──────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl border border-purple-100 dark:border-purple-900/40 bg-gradient-to-r from-[#FAF5FF] via-[#F5F3FF] to-[#EFF6FF] dark:from-[#1e1035] dark:via-[#161233] dark:to-[#0f172a] p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
        {/* Subtle Wave Backdrop Pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-20 overflow-hidden">
          <svg viewBox="0 0 1000 200" fill="none" className="w-full h-full" preserveAspectRatio="none">
            <path
              d="M0 120 C300 180 600 40 1000 140 L1000 200 L0 200 Z"
              fill="currentColor"
              className="text-purple-200 dark:text-purple-900"
            />
          </svg>
        </div>

        {/* Left: Chat Icon, Heading & Description */}
        <div className="relative z-10 flex items-center gap-4 text-center md:text-left flex-col md:flex-row">
          <div className="flex size-13 shrink-0 items-center justify-center rounded-2xl bg-purple-600 text-white shadow-lg shadow-purple-500/25">
            <MessageSquare className="size-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base sm:text-lg font-black text-gray-900 dark:text-white tracking-tight">
              Didn&apos;t find what you&apos;re looking for?
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 max-w-xl leading-relaxed">
              We are constantly curating new preparation collections based on community feedback and latest interview trends.
            </p>
          </div>
        </div>

        {/* Right: WhatsApp CTA Button */}
        <div className="relative z-10 shrink-0">
          <a
            href={`https://wa.me/918949826359?text=${encodeURIComponent(
              "Hey CrackDSA! I'd like to suggest a new DSA sheet for the platform. Here are the details:"
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/90 dark:border-gray-800 text-xs sm:text-sm font-bold text-gray-900 dark:text-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
          >
            <WhatsAppIcon className="size-4 shrink-0" />
            <span>Suggest via WhatsApp</span>
            <ArrowRight size={14} className="text-gray-400" />
          </a>
        </div>
      </div>
    </div>
  );
}
