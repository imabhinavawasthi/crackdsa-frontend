"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  ArrowRight, 
  Map, 
  BookOpen, 
  TrendingUp, 
  Clock,
  Layers,
  Code2,
  FileText,
  PlayCircle,
  Terminal,
  Zap
} from "lucide-react";
import { SidebarCategory } from "@/utils/mdxLoader";

interface DsaDocsHomeClientProps {
  syllabus: SidebarCategory[];
}

export default function DsaDocsHomeClient({ syllabus }: DsaDocsHomeClientProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const totalCategories = syllabus.length;
  const totalArticles = syllabus.reduce((acc, curr) => acc + curr.items.length, 0);

  const normalizedSearchQuery = searchQuery.trim().toLowerCase();
  const filteredCategories = syllabus.map((cat) => {
    const matchesCategory =
      normalizedSearchQuery === "" ||
      cat.title.toLowerCase().includes(normalizedSearchQuery) ||
      cat.description?.toLowerCase().includes(normalizedSearchQuery);
    const matchedItems =
      normalizedSearchQuery === "" || matchesCategory
        ? cat.items
        : cat.items.filter((item) =>
            item.title.toLowerCase().includes(normalizedSearchQuery)
          );
    return {
      ...cat,
      items: matchedItems
    };
  }).filter((cat) =>
    normalizedSearchQuery === "" ||
    cat.items.length > 0 ||
    cat.title.toLowerCase().includes(normalizedSearchQuery) ||
    cat.description?.toLowerCase().includes(normalizedSearchQuery)
  );

  const popularTopics = [
    { title: "Time Complexity & Big-O", slug: "introduction/introduction-to-time-complexity", readTime: "8 min read", difficulty: "Beginner", icon: Clock },
    { title: "Mastering Prefix Sum", slug: "arrays/prefix-sum", readTime: "7 min read", difficulty: "Easy", icon: Zap },
    { title: "Breadth First Search (BFS)", slug: "graphs/bfs", readTime: "9 min read", difficulty: "Medium", icon: Map },
    { title: "Dynamic Programming Patterns", slug: "dynamic-programming/1d-dp", readTime: "12 min read", difficulty: "Hard", icon: Layers }
  ];

  const quickResources = [
    { title: "Pattern Cheat Sheets", desc: "Quick reference guides for interviews", icon: FileText, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" },
    { title: "Video Explanations", desc: "Animated algorithmic walkthroughs", icon: PlayCircle, color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/20" },
    { title: "Code Templates", desc: "Standard templates for all patterns", icon: Terminal, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    { title: "Interview Roadmap", desc: "Step-by-step preparation plan", icon: Map, color: "text-brand-500", bg: "bg-brand-500/10", border: "border-brand-500/20" },
  ];

  return (
    <div className="relative min-h-screen">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-brand-500/10 dark:bg-brand-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto p-6 sm:p-8 md:p-12 space-y-16">
        
        {/* 1. Hero Welcome Section */}
        <div className="text-center space-y-6 pt-4">
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight leading-tight"
          >
            Complete DSA <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-emerald-400">
             Syllabus for Interviews.
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-gray-600 dark:text-gray-400 font-medium leading-relaxed max-w-2xl mx-auto"
          >
            A comprehensive, interactive syllabus taking you from absolute basics to advanced algorithmic patterns used at top tech companies.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center gap-6 pt-4"
          >
            <div className="flex flex-col items-center">
              <span className="text-3xl font-black text-gray-900 dark:text-white">{totalCategories}</span>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">Modules</span>
            </div>
            <div className="h-10 w-px bg-gray-200 dark:bg-gray-800" />
            <div className="flex flex-col items-center">
              <span className="text-3xl font-black text-gray-900 dark:text-white">{totalArticles}</span>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">Articles</span>
            </div>
          </motion.div>
        </div>

        {/* 2. Interactive Search Box */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="relative max-w-2xl mx-auto"
        >
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-400">
            <Search size={20} className="text-brand-500" />
          </div>
          <input
            type="text"
            placeholder="Search for topics, algorithms, or problems..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-base font-semibold pl-14 pr-6 py-4 sm:py-5 rounded-2xl bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 focus:border-brand-500 dark:focus:border-brand-500 outline-none text-gray-900 dark:text-white transition-all shadow-lg hover:shadow-xl dark:shadow-none placeholder-gray-400 dark:placeholder-gray-600"
          />
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
            <span className="hidden sm:flex items-center justify-center px-2 py-1 text-xs font-bold text-gray-400 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
              ⌘ K
            </span>
          </div>
        </motion.div>

        {/* 3. Quick Resources Grid */}
        {/* {!searchQuery && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {quickResources.map((resource, idx) => {
              const Icon = resource.icon;
              return (
                <div key={idx} className={`p-5 rounded-2xl border ${resource.border} ${resource.bg} backdrop-blur-sm cursor-pointer hover:scale-[1.02] transition-transform duration-300`}>
                  <Icon size={24} className={`${resource.color} mb-3`} />
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">{resource.title}</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">{resource.desc}</p>
                </div>
              );
            })}
          </motion.div>
        )} */}

        {/* 4. Main Syllabus Grid */}
        <div className="space-y-8">
          <div className="flex items-center gap-3 border-b border-gray-200 dark:border-gray-800 pb-4">
            <BookOpen size={24} className="text-brand-500" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
              {searchQuery ? "Search Results" : "Core Syllabus"}
            </h2>
          </div>

          {filteredCategories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AnimatePresence>
                {filteredCategories.map((cat, idx) => (
                  <motion.div
                    layout
                    key={cat.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group relative p-6 rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-brand-500/50 dark:hover:border-brand-500/50 hover:shadow-2xl dark:hover:shadow-[0_0_30px_rgba(16,185,129,0.1)] transition-all duration-300 flex flex-col justify-between overflow-hidden"
                  >
                    {/* Subtle gradient hover effect inside card */}
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                    <div className="relative z-10">
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <h3 className="text-lg font-black text-gray-900 dark:text-white tracking-tight group-hover:text-brand-500 transition-colors">
                          {cat.title}
                        </h3>
                        <span className="text-xs font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-500/10 px-2.5 py-1 rounded-md border border-brand-200 dark:border-brand-500/20 whitespace-nowrap">
                          {cat.items.length} Topics
                        </span>
                      </div>
                      
                      {cat.description && (
                         <p className="text-sm text-gray-600 dark:text-gray-400 font-medium leading-relaxed mb-6">
                           {cat.description}
                         </p>
                      )}
                      
                      <div className="space-y-2.5">
                        {cat.items.slice(0, 4).map((item) => (
                          <Link
                            key={item.slug}
                            href={`/learn/dsa/${cat.id}/${item.slug}`}
                            className="flex items-center gap-3 text-sm font-semibold text-gray-600 hover:text-brand-500 dark:text-gray-400 dark:hover:text-brand-400 transition-colors group/link"
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-gray-300 dark:bg-gray-700 group-hover/link:bg-brand-500 transition-colors" />
                            <span className="truncate">{item.title}</span>
                          </Link>
                        ))}
                        {cat.items.length > 4 && (
                          <div className="flex items-center gap-3 text-sm font-semibold text-gray-400 dark:text-gray-500 pt-2 pl-4">
                            + {cat.items.length - 4} more advanced topics
                          </div>
                        )}
                        {cat.items.length === 0 && (
                          <div className="text-sm font-semibold text-gray-400 dark:text-gray-500 italic">
                            Modules are currently being developed.
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="relative z-10 mt-8 pt-4 border-t border-gray-100 dark:border-gray-800">
                      {cat.items.length > 0 ? (
                        <Link
                          href={`/learn/dsa/${cat.id}/${cat.items[0]?.slug}`}
                          className="inline-flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white group-hover:text-brand-500 dark:group-hover:text-brand-400 transition-colors"
                        >
                          <span>Start Learning</span>
                          <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
                        </Link>
                      ) : (
                        <span className="text-sm font-bold text-gray-400">Coming Soon</span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="text-center py-16 px-4 rounded-3xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 border-dashed">
              <Search size={48} className="mx-auto text-gray-300 dark:text-gray-700 mb-4" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No results found</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium max-w-md mx-auto">
                We couldn't find any articles matching "{searchQuery}". Try searching for standard algorithmic terms like "Graph", "DP", or "Sliding Window".
              </p>
            </div>
          )}
        </div>

        {/* 5. Popular Topics Section */}
        {!searchQuery && (
          <div className="pt-8 border-t border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <TrendingUp size={24} className="text-brand-500" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
                  Trending Topics
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {popularTopics.map((topic, idx) => {
                const Icon = topic.icon;
                return (
                  <Link
                    key={idx}
                    href={`/learn/dsa/${topic.slug}`}
                    className="p-5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white hover:bg-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800/50 transition-all group flex flex-col justify-between min-h-[140px]"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <Icon size={20} className="text-brand-500 dark:text-brand-400 opacity-80" />
                      <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                        {topic.difficulty}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 dark:text-white leading-tight mb-2 group-hover:text-brand-500 transition-colors">
                        {topic.title}
                      </h4>
                      <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                        <Clock size={12} />
                        {topic.readTime}
                      </span>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
