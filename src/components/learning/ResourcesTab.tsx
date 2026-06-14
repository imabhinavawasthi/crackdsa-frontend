"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ExternalLink, Dumbbell, BookOpen, Link2, Loader2 } from "lucide-react";

const sectionContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.05 },
  },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1, y: 0,
    transition: { type: "spring" as const, stiffness: 300, damping: 30 },
  },
};

const headerVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1, x: 0,
    transition: { type: "spring" as const, stiffness: 350, damping: 28 },
  },
};

const cardContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 14, scale: 0.97 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { type: "spring" as const, stiffness: 340, damping: 26 },
  },
};

interface ResourcesTabProps {
  itemId: string;
  backendResources?: any;
}

const ResourcesTab: React.FC<ResourcesTabProps> = ({ itemId, backendResources }) => {
  const [loading, setLoading] = useState(true);
  const [problemsData, setProblemsData] = useState<any[]>([]);
  const [articlesData, setArticlesData] = useState<any[]>([]);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        setLoading(true);
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
        const [probsRes, artsRes] = await Promise.all([
          fetch(`${backendUrl}/api/v1/practice-problems`),
          fetch(`${backendUrl}/api/v1/articles`)
        ]);

        if (probsRes.ok) {
          const data = await probsRes.json();
          setProblemsData(Array.isArray(data) ? data : data.items || []);
        }
        if (artsRes.ok) {
          const data = await artsRes.json();
          setArticlesData(Array.isArray(data) ? data : data.items || []);
        }
      } catch (e) {
        console.error("Error fetching assets for resources tab", e);
      } finally {
        setLoading(false);
      }
    };
    fetchAssets();
  }, []);

  const resources = backendResources || {};
  const problemsSlugs: string[] = resources.problems || [];
  const articlesSlugs: string[] = resources.articles || resources.blogs || [];
  const externalLinks: { title: string; url: string }[] = resources.external_links || [];

  const mappedProblems = problemsSlugs.map(slug => problemsData.find(p => p.slug === slug || p.id === slug)).filter(Boolean);
  const mappedArticles = articlesSlugs.map(slug => articlesData.find(a => a.slug === slug || a.id === slug)).filter(Boolean);

  const hasAnyResources = mappedProblems.length > 0 || mappedArticles.length > 0 || externalLinks.length > 0;

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="animate-spin text-brand-500" size={24} />
      </div>
    );
  }

  if (!hasAnyResources) {
    return (
      <motion.div
        className="text-center py-10 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-500 font-medium">No external resources or practice material attached to this lecture yet.</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="space-y-8 select-none"
      variants={sectionContainerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* 1. Related Problems */}
      {mappedProblems.length > 0 && (
        <motion.div className="space-y-3.5" variants={sectionVariants}>
          <motion.h4
            className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center gap-2"
            variants={headerVariants}
          >
            <Dumbbell size={14} className="text-brand-500" />
            <span>Practice Problems ({mappedProblems.length})</span>
          </motion.h4>
          <motion.div className="grid grid-cols-1 sm:grid-cols-2 gap-4" variants={cardContainerVariants}>
            {mappedProblems.map((prob: any, idx) => (
              <motion.div key={idx} variants={cardVariants} whileHover={{ y: -2 }}>
                <Link
                  href={`/problem/${prob.slug}`}
                  className="flex items-center justify-between p-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50/20 hover:bg-gray-50 dark:bg-gray-900/10 dark:hover:bg-gray-900/35 hover:border-brand-500/30 dark:hover:border-brand-500/30 hover:shadow-[0_0_15px_-5px_rgba(var(--color-brand-500),0.15)] transition-all duration-300 group cursor-pointer"
                >
                  <div className="space-y-1 pr-3 truncate">
                    <h5 className="text-xs sm:text-sm font-bold text-gray-800 dark:text-gray-200 group-hover:text-brand-500 dark:group-hover:text-brand-400 transition-colors truncate">
                      {prob.title}
                    </h5>
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">CrackDSA Platform</span>
                  </div>
                  <span className={`shrink-0 px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider border transition-all duration-300 group-hover:scale-110 ${
                    prob.difficulty === "Easy"
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/10 hover:bg-emerald-500/20 hover:shadow-[0_0_8px_-2px_rgba(16,185,129,0.4)]"
                      : prob.difficulty === "Medium"
                      ? "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/10 hover:bg-yellow-500/20 hover:shadow-[0_0_8px_-2px_rgba(234,179,8,0.4)]"
                      : "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/10 hover:bg-red-500/20 hover:shadow-[0_0_8px_-2px_rgba(239,68,68,0.4)]"
                  }`}>
                    {prob.difficulty || "Medium"}
                  </span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      )}

      {/* 2. Related Articles */}
      {mappedArticles.length > 0 && (
        <motion.div className="space-y-3.5" variants={sectionVariants}>
          <motion.h4
            className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center gap-2"
            variants={headerVariants}
          >
            <BookOpen size={14} className="text-brand-500" />
            <span>Articles & Notes ({mappedArticles.length})</span>
          </motion.h4>
          <motion.div className="grid grid-cols-1 sm:grid-cols-2 gap-4" variants={cardContainerVariants}>
            {mappedArticles.map((art: any, idx) => (
              <motion.div key={idx} variants={cardVariants} whileHover={{ y: -2 }}>
                <Link
                  href={`/article/${art.slug}`}
                  className="flex items-center justify-between p-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50/20 hover:bg-gray-50 dark:bg-gray-900/10 dark:hover:bg-gray-900/35 hover:border-brand-500/30 dark:hover:border-brand-500/30 hover:shadow-[0_0_15px_-5px_rgba(var(--color-brand-500),0.15)] transition-all duration-300 group cursor-pointer"
                >
                  <div className="space-y-1 pr-3 truncate">
                    <h5 className="text-xs sm:text-sm font-bold text-gray-800 dark:text-gray-200 group-hover:text-brand-500 dark:group-hover:text-brand-400 transition-colors truncate">
                      {art.title}
                    </h5>
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Concept Documentation</span>
                  </div>
                  <span className="shrink-0 p-1.5 rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/10">
                    <ExternalLink size={10} className="stroke-[2.5]" />
                  </span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      )}

      {/* 3. External Links */}
      {externalLinks.length > 0 && (
        <motion.div className="space-y-3.5" variants={sectionVariants}>
          <motion.h4
            className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center gap-2"
            variants={headerVariants}
          >
            <Link2 size={14} className="text-brand-500" />
            <span>External References ({externalLinks.length})</span>
          </motion.h4>
          <motion.div className="grid grid-cols-1 sm:grid-cols-2 gap-4" variants={cardContainerVariants}>
            {externalLinks.map((link: any, idx) => (
              <motion.a
                key={idx}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col justify-between p-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm group hover:shadow-md hover:border-brand-500/30 dark:hover:border-brand-500/30 hover:shadow-brand-500/5 transition-all duration-300"
                variants={cardVariants}
                whileHover={{ y: -2 }}
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded-xl bg-gray-900/10 dark:bg-white/10 text-gray-900 dark:text-white border border-gray-900/10 dark:border-white/10">
                      <Link2 size={15} />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h5 className="text-xs sm:text-sm font-bold text-gray-800 dark:text-gray-200 leading-snug tracking-tight">
                      {link.title}
                    </h5>
                    <p className="text-[11px] text-gray-500 leading-relaxed font-medium truncate">
                      {link.url}
                    </p>
                  </div>
                </div>
                <div className="mt-4 pt-3.5 border-t border-gray-50 dark:border-gray-800/50">
                  <div className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-gray-50 hover:bg-brand-500 hover:text-white dark:bg-gray-800 dark:hover:bg-brand-500 text-gray-700 dark:text-gray-300 font-bold py-2 text-xs transition-colors duration-200">
                    <span>Visit Link</span>
                    <ExternalLink size={11} className="stroke-[2.5]" />
                  </div>
                </div>
              </motion.a>
            ))}
          </motion.div>
        </motion.div>
      )}

    </motion.div>
  );
};

export default ResourcesTab;
