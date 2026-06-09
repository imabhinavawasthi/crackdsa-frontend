"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Building2, ArrowLeft, Search, Building, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/common/PageHeader";
import { getStoredToken } from "@/functions/auth";
import { formatTag } from "@/utils/string";
import ErrorState from "@/components/common/ErrorState";
import { Skeleton } from "@/components/ui/skeleton";

export default function PracticeCompaniesListPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [companies, setCompanies] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

  useEffect(() => {
    const fetchCompaniesSummary = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = getStoredToken();
        const headers = token ? { "Authorization": `Bearer ${token}` } : undefined;

        const res = await fetch(`${backendUrl}/api/v1/practice-problems/companies-summary`, { headers });
        if (!res.ok) {
          throw new Error("Unable to fetch companies summary data.");
        }
        const data = await res.json();
        setCompanies(data || []);
      } catch (err: any) {
        console.error("Error loading companies summary:", err);
        setError(err.message || "Failed to load companies.");
      } finally {
        setLoading(false);
      }
    };

    fetchCompaniesSummary();
  }, [backendUrl]);

  // Filter companies by search query
  const filteredCompanies = useMemo(() => {
    return companies.filter(c => {
      const formattedName = formatTag(c.name).toLowerCase();
      const query = searchQuery.toLowerCase();
      return (
        formattedName.includes(query) ||
        c.name.toLowerCase().includes(query) ||
        c.slug.toLowerCase().includes(query)
      );
    });
  }, [companies, searchQuery]);

  // Major/Featured companies (top 4 by count)
  const featuredCompanies = useMemo(() => {
    return filteredCompanies.slice(0, 4);
  }, [filteredCompanies]);

  // Rest of the companies for the index table (or all if searching)
  const displayCompanies = useMemo(() => {
    return searchQuery ? filteredCompanies : filteredCompanies.slice(4);
  }, [filteredCompanies, searchQuery]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-0 sm:px-4 py-2 sm:py-8 space-y-8 select-none animate-in fade-in duration-300">
        {/* Header Skeleton */}
        <div className="rounded-3xl bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 p-6 sm:p-8 flex flex-col md:flex-row gap-6 items-start justify-between">
          <div className="space-y-4 flex-1">
            <Skeleton className="h-6 w-24 bg-gray-100 dark:bg-gray-900/50 rounded-lg" />
            <Skeleton className="h-10 w-2/3 rounded-xl" />
            <Skeleton className="h-4 w-4/5" />
          </div>
          <Skeleton className="w-full md:w-80 h-32 bg-gray-100 dark:bg-gray-900/50 rounded-2xl" />
        </div>

        {/* Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="h-44 bg-white dark:bg-gray-955 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 space-y-4">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-8 w-40" />
              <Skeleton className="h-3 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-0 sm:px-4 py-2 sm:py-8 select-none">
        <ErrorState
          title="Error Loading Companies"
          message={error}
          backLink="/practice"
          backLabel="Back to Practice Ground"
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-0 sm:px-4 py-2 sm:py-8 select-none">
      {/* Back link */}
      <div className="mb-4 flex items-center justify-between px-1">
        <Link
          href="/practice"
          className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-brand-500 font-semibold transition-colors"
        >
          <ArrowLeft size={13} />
          <span>Back to Practice Ground</span>
        </Link>
      </div>

      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <PageHeader
          badge="Company Directory"
          badgeIcon={Building2}
          title={
            <>
              Company-wise {" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-brand-400">
                DSA Prep
              </span>
            </>
          }
          subtitle="Target specific tech firms by solving questions frequently asked in their coding interviews. Explore cards and tables below."
          accent="brand"
        />
      </div>

      {/* Search Bar */}
      <div className="relative mb-8 max-w-md">
        <input
          type="text"
          placeholder="Search companies by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-11 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-4 pl-10 text-xs font-normal placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 text-gray-800 dark:text-gray-200 transition-all shadow-sm"
        />
        <Search size={15} className="absolute left-3.5 top-3.5 text-gray-400" />
      </div>

      {/* Featured Companies Section (Only shown when not searching) */}
      {!searchQuery && featuredCompanies.length > 0 && (
        <div className="space-y-4 mb-10">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles size={14} className="text-brand-500" />
              Top Target Tech Employers
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCompanies.map((company, index) => {
              const gradients = [
                "from-orange-600/10 to-amber-600/10 hover:border-orange-500/30 text-orange-500",
                "from-blue-600/10 to-cyan-600/10 hover:border-blue-500/30 text-blue-500",
                "from-violet-600/10 to-indigo-600/10 hover:border-violet-500/30 text-violet-500",
                "from-rose-600/10 to-pink-600/10 hover:border-rose-500/30 text-rose-500"
              ];
              const gradClass = gradients[index % gradients.length];
              
              return (
                <Link
                  key={company.slug}
                  href={`/practice/companies/${company.slug}`}
                  className={`group relative overflow-hidden bg-gradient-to-br ${gradClass} bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between h-44`}
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="w-8 h-8 rounded-lg bg-white/80 dark:bg-gray-900/60 border border-gray-100 dark:border-gray-800 flex items-center justify-center">
                        <Building size={14} className="text-current" />
                      </div>
                      <span className="text-[10px] font-bold uppercase bg-white/80 dark:bg-gray-900/60 px-2 py-0.5 rounded border border-gray-100 dark:border-gray-800">
                        {company.count} Problems
                      </span>
                    </div>
                    
                    <h3 className="text-base font-bold text-gray-800 dark:text-white group-hover:text-brand-500 dark:group-hover:text-brand-400 transition-colors truncate">
                      {formatTag(company.name)}
                    </h3>
                  </div>

                  <div className="space-y-2.5">
                    {/* Progress representation */}
                    <div className="grid grid-cols-3 gap-1.5 text-[9px] text-center font-bold">
                      <div className="bg-emerald-500/8 text-emerald-600 dark:text-emerald-400 py-0.5 rounded border border-emerald-500/10">
                        {company.easy_count} Easy
                      </div>
                      <div className="bg-amber-500/8 text-amber-600 dark:text-amber-400 py-0.5 rounded border border-amber-500/10">
                        {company.medium_count} Med
                      </div>
                      <div className="bg-rose-500/8 text-rose-600 dark:text-rose-400 py-0.5 rounded border border-rose-500/10">
                        {company.hard_count} Hard
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs font-semibold text-gray-500 dark:text-gray-400 group-hover:text-brand-500 transition-colors pt-1 border-t border-gray-100/50 dark:border-gray-900/50">
                      <span>Practice Sheet</span>
                      <ArrowRight size={13} className="transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Directory Table */}
      <div className="space-y-4">
        <div className="px-1 flex items-center justify-between">
          <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Building2 size={14} className="text-brand-500" />
            {searchQuery ? "Search Results" : "Complete Companies Index"}
          </h2>
          <p className="text-xs text-gray-400">
            Showing <span className="font-semibold text-gray-700 dark:text-gray-300">{displayCompanies.length}</span> employers
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden bg-white dark:bg-gray-950 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50/50 dark:bg-gray-900/30 border-b border-gray-100 dark:border-gray-800/80">
                  <th className="py-3.5 px-5 font-bold text-gray-400 dark:text-gray-500 text-[9px] uppercase tracking-widest">Company Name</th>
                  <th className="py-3.5 px-5 font-bold text-gray-400 dark:text-gray-500 text-[9px] uppercase tracking-widest text-center w-28">Total Problems</th>
                  <th className="py-3.5 px-5 font-bold text-gray-400 dark:text-gray-500 text-[9px] uppercase tracking-widest text-center w-24">🟢 Easy</th>
                  <th className="py-3.5 px-5 font-bold text-gray-400 dark:text-gray-500 text-[9px] uppercase tracking-widest text-center w-24">🟡 Medium</th>
                  <th className="py-3.5 px-5 font-bold text-gray-400 dark:text-gray-500 text-[9px] uppercase tracking-widest text-center w-24">🔴 Hard</th>
                  <th className="py-3.5 px-5 font-bold text-gray-400 dark:text-gray-500 text-[9px] uppercase tracking-widest text-right w-16"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-900 bg-transparent">
                {displayCompanies.map((company) => (
                  <tr
                    key={company.slug}
                    className="group hover:bg-gray-50/45 dark:hover:bg-gray-900/30 cursor-pointer transition-all duration-200 border-l-2 border-l-transparent hover:border-l-brand-500"
                    onClick={() => router.push(`/practice/companies/${company.slug}`)}
                  >
                    <td className="py-3.5 px-5">
                      <span className="text-[13px] font-semibold text-gray-800 dark:text-gray-100 group-hover:text-brand-500 transition-colors">
                        {formatTag(company.name)}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-center">
                      <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400 font-bold text-[10px]">
                        {company.count} Problems
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-center text-gray-650 dark:text-gray-300 font-semibold">{company.easy_count}</td>
                    <td className="py-3.5 px-5 text-center text-gray-650 dark:text-gray-300 font-semibold">{company.medium_count}</td>
                    <td className="py-3.5 px-5 text-center text-gray-650 dark:text-gray-300 font-semibold">{company.hard_count}</td>
                    <td className="py-3.5 px-5 text-right">
                      <ArrowRight size={14} className="inline-block text-gray-300 dark:text-gray-700 group-hover:text-brand-500 transform group-hover:translate-x-1 transition-all duration-300" />
                    </td>
                  </tr>
                ))}

                {displayCompanies.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-16 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                          <Search size={20} className="text-gray-300 dark:text-gray-700" />
                        </div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">No companies match your search</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
