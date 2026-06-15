"use client";

import { useState, useEffect, useMemo } from "react";
import { Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PageHeader from "@/components/common/PageHeader";
import ErrorState from "@/components/common/ErrorState";
import EmptyState from "@/components/common/EmptyState";
import SuggestionCard from "@/components/common/SuggestionCard";
import DSASheetCard from "@/components/dsa/DSASheetCard";
import { Skeleton } from "@/components/ui/skeleton";
import { dsaSheetHeaderSlides } from "@/config/dsa-sheets";
import { fetchSheets } from "@/api/sheets";
import { DSASheet } from "@/types/dsa-sheet";

export default function DSASheetsPage() {
  const [sheets, setSheets] = useState<DSASheet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filtering
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("All");

  useEffect(() => {
    const loadSheets = async () => {
      try {
        setLoading(true);
        const data = await fetchSheets();
        setSheets(data || []);
      } catch (err: any) {
        console.error("Error loading sheets:", err);
        setError(err.message || "Failed to load DSA Sheets");
      } finally {
        setLoading(false);
      }
    };
    loadSheets();
  }, []);



  // Extract all unique tags across all sheets
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    sheets.forEach(sheet => {
      if (sheet.tags) {
        sheet.tags.forEach(tag => tags.add(tag));
      }
    });
    return ["All", ...Array.from(tags).sort()];
  }, [sheets]);

  // Filter sheets
  const filteredSheets = useMemo(() => {
    return sheets.filter(sheet => {
      const matchSearch = sheet.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (sheet.description && sheet.description.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchTag = selectedTag === "All" || (sheet.tags && sheet.tags.includes(selectedTag));
      return matchSearch && matchTag;
    });
  }, [sheets, searchQuery, selectedTag]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-8 sm:space-y-10 pb-20 select-none">
      {/* Header Section */}
      <PageHeader
        title={
          <>
            DSA Sheets{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-400">
              Library
            </span>
          </>
        }
        subtitle="No need to hover between platforms, all at one place. Organised sheets with tracking, solutions, and video editorials—everything you need for your preparation."
        accent="violet"
        rotatorItems={["crackDSA Sprint 75", "0 to Hero DSA", "Abhinav's DSA Sheet", "Pattern Mastery", "30-Day Sprint"]}
        rotatorPrefix="Prepare with popular collections like "
        rotatorSuffix="."
        tickerItems={["Arrays", "Strings", "Linked Lists", "Stacks & Queues", "Binary Trees", "Graphs", "DP", "Greedy"]}
        tickerLabel="Core DSA sheet topics:"
        slides={dsaSheetHeaderSlides}
      />

      {/* Controls: Search and Tags */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white dark:bg-gray-900/50 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 backdrop-blur-xl">
        <div className="relative w-full md:w-96 shrink-0">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search sheets by title or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 pl-10 pr-4 text-sm font-medium text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all focus:outline-none"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto w-full hide-scrollbar pb-2 md:pb-0">
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                selectedTag === tag 
                ? "bg-violet-500 text-white shadow-lg shadow-violet-500/20" 
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              {tag === "All" ? "All Sheets" : tag}
            </button>
          ))}
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex flex-col h-72 rounded-[2rem] border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/40 p-8 space-y-4">
              <Skeleton className="h-8 w-3/4 rounded-lg" />
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-5/6 rounded" />
              <div className="flex-grow" />
              <div className="grid grid-cols-2 gap-4 border-t border-gray-100 dark:border-gray-800 pt-6">
                <Skeleton className="h-8 w-20 rounded" />
                <Skeleton className="h-8 w-20 rounded" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <ErrorState 
          title="Failed to load sheets" 
          message={error} 
          onRetry={() => window.location.reload()} 
        />
      )}

      {/* Empty State */}
      {!loading && !error && filteredSheets.length === 0 && (
        <EmptyState 
          icon={Search}
          title="No sheets found"
          description="We couldn't find any DSA sheets matching your current search or tag filters."
          action={
            <button 
              onClick={() => { setSearchQuery(""); setSelectedTag("All"); }}
              className="px-6 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-brand-500/20"
            >
              Clear Filters
            </button>
          }
        />
      )}

      {/* Grid of Sheets */}
      {!loading && !error && filteredSheets.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredSheets.map((sheet, idx) => (
              <motion.div
                key={sheet.id}
                layout
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
              >
                <DSASheetCard sheet={sheet} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Footer Suggestion */}
      {!loading && !error && (
        <SuggestionCard 
          title="Didn't find what you're looking for?"
          description="We are constantly curating new preparation collections based on community feedback and latest interview trends."
          buttonText="Suggest via WhatsApp"
          href={`https://wa.me/918949826359?text=${encodeURIComponent("Hey CrackDSA! I'd like to suggest a new DSA sheet for the platform. Here are the details:")}`}
        />
      )}
    </div>
  );
}
