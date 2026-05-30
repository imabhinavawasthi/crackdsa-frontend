"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Search, 
  Sparkles, 
  ArrowRight, 
  Map, 
  BookOpen, 
  TrendingUp, 
  Clock,
  Layers,
  Code2
} from "lucide-react";
import { SidebarCategory } from "@/utils/mdxLoader";

interface DsaDocsHomeClientProps {
  syllabus: SidebarCategory[];
}

export default function DsaDocsHomeClient({ syllabus }: DsaDocsHomeClientProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Calculate statistics
  const totalCategories = syllabus.length;
  const totalArticles = syllabus.reduce((acc, curr) => acc + curr.items.length, 0);

  // Filter categories and articles based on search query
  const filteredCategories = syllabus.map((cat) => {
    const matchedItems = cat.items.filter((item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return {
      ...cat,
      items: matchedItems
    };
  }).filter((cat) => cat.items.length > 0);

  // Popular topics and recently added lists
  const popularTopics = [
    { title: "Time Complexity & Big-O", slug: "introduction/time-complexity", readTime: "8 min read", difficulty: "Beginner" },
    { title: "Mastering Prefix Sum", slug: "arrays/prefix-sum", readTime: "7 min read", difficulty: "Easy" },
    { title: "Breadth First Search (BFS)", slug: "graphs/bfs", readTime: "9 min read", difficulty: "Medium" }
  ];

  return (
    <div className="max-w-4xl mx-auto p-5 sm:p-7 md:p-9 space-y-12">
      
      {/* 1. Hero Welcome Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-brand-500 dark:text-brand-400 bg-brand-500/10 border border-brand-500/10 px-2.5 py-1 rounded-md w-fit">
          <Code2 size={11} />
          <span>Complete DSA Reference</span>
        </div>
        
        <h1 className="text-2xl sm:text-3.5xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">
          Data Structures & Algorithms Syllabus
        </h1>
        
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed max-w-2xl">
          Conquer programming challenges by learning standard data layouts, structural traversals, and algorithmic precomputation patterns. Everything is mapped from absolute basics to advanced recruiter expectations.
        </p>

        {/* Quick status counter badge block */}
        <div className="flex flex-wrap gap-4 pt-2">
          <div className="flex items-center gap-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-150 dark:border-gray-700 px-3.5 py-2">
            <Layers size={14} className="text-brand-500" />
            <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {totalCategories} Categories
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-150 dark:border-gray-700 px-3.5 py-2">
            <BookOpen size={14} className="text-emerald-500" />
            <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {totalArticles} Articles
            </span>
          </div>
        </div>
      </div>

      {/* 2. Interactive Search Box */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
          <Search size={16} />
        </div>
        <input
          type="text"
          placeholder="Search documentation, time complexities, code patterns..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full text-xs font-bold pl-11 pr-4 py-3.5 rounded-2xl bg-gray-50/50 hover:bg-gray-50 dark:bg-gray-800/20 dark:hover:bg-gray-800/30 border border-gray-200 dark:border-gray-800 focus:border-brand-500 dark:focus:border-brand-400 focus:bg-white dark:focus:bg-gray-900 outline-none text-gray-800 dark:text-gray-200 transition-all shadow-inner"
        />
      </div>

      {/* 3. Search Results or Main Syllabus Grid */}
      <div className="space-y-6">
        <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider border-l-2 border-brand-500 pl-2">
          {searchQuery ? "Search Results" : "Core Categories Grid"}
        </h2>

        {filteredCategories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredCategories.map((cat, idx) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="p-5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/40 shadow-sm hover:shadow-md transition-shadow group flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white tracking-tight flex items-center justify-between">
                    <span>{cat.title}</span>
                    <span className="text-[9px] text-gray-400 font-bold bg-gray-50 dark:bg-gray-800 px-2 py-0.5 rounded border border-gray-100 dark:border-gray-800/80">
                      {cat.items.length} {cat.items.length === 1 ? "article" : "articles"}
                    </span>
                  </h3>
                  
                  {/* Article Quick links */}
                  <div className="mt-3.5 space-y-1.5">
                    {cat.items.slice(0, 3).map((item) => (
                      <Link
                        key={item.slug}
                        href={`/learn/dsa/${cat.id}/${item.slug}`}
                        className="block text-[11px] font-bold text-gray-500 hover:text-brand-500 dark:text-gray-400 dark:hover:text-brand-400 transition-colors truncate"
                      >
                        • {item.title}
                      </Link>
                    ))}
                    {cat.items.length > 3 && (
                      <p className="text-[10px] text-gray-400 font-bold italic pt-1 pl-1">
                        + {cat.items.length - 3} more articles
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-gray-50 dark:border-gray-800/80 flex items-center justify-between">
                  {cat.items.length > 0 ? (
                    <Link
                      href={`/learn/dsa/${cat.id}/${cat.items[0]?.slug}`}
                      className="inline-flex items-center gap-1.5 text-[10px] font-bold text-brand-500 dark:text-brand-400 hover:underline"
                    >
                      <span>Enter Module</span>
                      <ArrowRight size={10} />
                    </Link>
                  ) : (
                    <span className="text-[10px] text-gray-400 font-bold">No articles</span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 rounded-2xl bg-gray-50 dark:bg-gray-800/10 border border-gray-150 dark:border-gray-800">
            <p className="text-xs text-gray-500 dark:text-gray-400 font-bold">No articles matched your search query. Try another term!</p>
          </div>
        )}
      </div>

      {/* 4. Visual DSA Learning Roadmap */}
      {!searchQuery && (
        <div className="p-6 rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm space-y-6">
          <div className="flex items-center gap-2">
            <Map size={18} className="text-brand-500" />
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
              DSA Core Learning Roadmap
            </h3>
          </div>
          
          <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
            Follow this recommended study sequence to build computational mastery sequentially. Avoid skipping modules!
          </p>

          {/* Simple timeline tree mapping */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2">
            {[
              { level: "1. Basics", title: "Big-O Analysis", desc: "Complexity metrics", color: "border-blue-500/20 text-blue-500" },
              { level: "2. Linear", title: "Prefix Sum & Window", desc: "Scan optimization", color: "border-emerald-500/20 text-emerald-500" },
              { level: "3. Hierarchical", title: "Trees & BSTs", desc: "Node traversals", color: "border-purple-500/20 text-purple-500" },
              { level: "4. Advanced", title: "Dynamic Programming", desc: "Memoized grids", color: "border-orange-500/20 text-orange-500" }
            ].map((node, idx) => (
              <div 
                key={idx}
                className={`p-4 rounded-2xl border bg-gray-50/30 dark:bg-gray-900/30 flex flex-col justify-between ${node.color}`}
              >
                <div className="space-y-1">
                  <span className="text-[8px] font-bold uppercase tracking-widest block opacity-75">
                    {node.level}
                  </span>
                  <h4 className="text-xs font-bold text-gray-800 dark:text-white tracking-tight leading-snug">
                    {node.title}
                  </h4>
                </div>
                <p className="text-[9px] text-gray-400 font-bold uppercase mt-3 tracking-wider">
                  {node.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Recently Added & Popular Articles */}
      {!searchQuery && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Popular Topics List */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-brand-500" />
              <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                Popular Topics
              </h3>
            </div>
            
            <div className="space-y-3">
              {popularTopics.map((topic, idx) => (
                <Link
                  key={idx}
                  href={`/learn/dsa/${topic.slug}`}
                  className="flex items-center justify-between p-4 rounded-xl border border-gray-150 dark:border-gray-800/80 bg-white hover:bg-gray-50/50 dark:bg-gray-900/20 dark:hover:bg-gray-800/20 transition-all group"
                >
                  <div className="space-y-1 pr-4">
                    <h4 className="text-xs font-bold text-gray-900 dark:text-white leading-tight group-hover:text-brand-500 transition-colors">
                      {topic.title}
                    </h4>
                    <span className="text-[8px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest block">
                      {topic.readTime}
                    </span>
                  </div>
                  <span className="text-[8px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/10 uppercase tracking-widest">
                    {topic.difficulty}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Study Checklist */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-brand-500" />
              <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                Interview Prep Advice
              </h3>
            </div>

            <div className="p-5 rounded-2xl border border-gray-150 dark:border-gray-800 bg-gray-50/20 dark:bg-gray-900/10 space-y-4">
              <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                To maximize your coding interview pass rates, focus on understanding standard complexity patterns. 
              </p>
              
              <ul className="space-y-2.5 text-[10px] font-bold text-gray-600 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="h-4 w-4 shrink-0 rounded bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center text-[8px]">✓</span>
                  <span>Practice converting recursive O(2^N) steps to memoized O(N) runtimes.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="h-4 w-4 shrink-0 rounded bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center text-[8px]">✓</span>
                  <span>Explain execution stack frame constraints clearly on graphs traversals.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="h-4 w-4 shrink-0 rounded bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center text-[8px]">✓</span>
                  <span>Locate coding challenge references in LeetCode directly from pages!</span>
                </li>
              </ul>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
