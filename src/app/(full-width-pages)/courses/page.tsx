"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CourseSummary } from "@/types/course";
import { fetchCourses } from "@/api/courses";
import AppHeader from "@/layout/AppHeader";
import AppFooter from "@/layout/AppFooter";
import { CoursesHeroBanner } from "@/components/courses/CoursesHeroBanner";
import { ProMembershipPromoCard } from "@/components/courses/ProMembershipPromoCard";
import { 
  CoursesToolbar, 
  SortOption, 
  CategoryOption 
} from "@/components/courses/CoursesToolbar";
import { CoursesGrid } from "@/components/courses/CoursesGrid";

export default function CoursesPage() {
  const [courses, setCourses] = useState<CourseSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Filter & Sort states
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState<SortOption>("popularity");

  const loadCourses = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await fetchCourses();
      setCourses(data || []);
    } catch (err) {
      console.error("[CoursesPage] Error loading courses from API:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  // Dynamic categories computed directly from real courses API response
  const categories = useMemo<CategoryOption[]>(() => {
    const counts: Record<string, number> = {};

    courses.forEach((c) => {
      const cat = (c.category || "general").toLowerCase();
      counts[cat] = (counts[cat] || 0) + 1;
    });

    const formatCategoryLabel = (key: string): string => {
      if (key === "core-dsa" || key === "dsa") return "DSA";
      if (key === "interview-prep") return "Interview Prep";
      if (key === "programming") return "Programming";
      if (key === "system-design") return "System Design";
      if (key === "cs-fundamentals") return "CS Fundamentals";
      return key.charAt(0).toUpperCase() + key.slice(1).replace(/-/g, " ");
    };

    const dynamicOptions: CategoryOption[] = Object.keys(counts).map((key) => ({
      id: key,
      label: formatCategoryLabel(key),
      count: counts[key],
    }));

    // Prioritize DSA category first, then others alphabetically
    dynamicOptions.sort((a, b) => {
      if (a.id.includes("dsa")) return -1;
      if (b.id.includes("dsa")) return 1;
      return a.label.localeCompare(b.label);
    });

    return [
      { id: "all", label: "All Courses", count: courses.length },
      ...dynamicOptions,
    ];
  }, [courses]);

  // Real data filtering and sorting
  const filteredCourses = useMemo(() => {
    let result = [...courses];

    // 1. Filter by category
    if (activeCategory !== "all") {
      result = result.filter(
        (c) => (c.category || "").toLowerCase() === activeCategory.toLowerCase()
      );
    }

    // 2. Sort courses
    result.sort((a, b) => {
      if (sortBy === "popularity") {
        // DSA primary program first
        const aIsDsa = (a.slug || "").includes("data-structure") || (a.slug || "").includes("dsa");
        const bIsDsa = (b.slug || "").includes("data-structure") || (b.slug || "").includes("dsa");
        if (aIsDsa && !bIsDsa) return -1;
        if (!aIsDsa && bIsDsa) return 1;

        // Bestseller / popular first
        if (a.is_popular && !b.is_popular) return -1;
        if (!a.is_popular && b.is_popular) return 1;

        // Active first over upcoming
        if (a.status === "active" && b.status !== "active") return -1;
        if (a.status !== "active" && b.status === "active") return 1;

        return 0;
      }

      if (sortBy === "price-asc") {
        return (a.price || 0) - (b.price || 0);
      }

      if (sortBy === "price-desc") {
        return (b.price || 0) - (a.price || 0);
      }

      if (sortBy === "title") {
        return (a.title || "").localeCompare(b.title || "");
      }

      return 0;
    });

    return result;
  }, [courses, activeCategory, sortBy]);

  const handleResetFilters = () => {
    setActiveCategory("all");
    setSortBy("popularity");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#0B0F19]">
      {/* Top Header with no sidebar toggle */}
      <AppHeader hideSidebarToggle={true} />

      {/* Main Full-Width Content Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-7">
        {/* Navigation: Back to Dashboard */}
        <div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-gray-900 border border-slate-200/90 dark:border-gray-800 hover:border-blue-500/50 hover:text-blue-600 dark:hover:text-blue-400 shadow-2xs transition-all duration-200 cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>Back to Dashboard</span>
          </Link>
        </div>

        {/* 1. Deep Navy Hero Banner with Glass Card and Floating Pills */}
        <CoursesHeroBanner />

        {/* 2. Filter Pills and Sort By Dropdown (Pure Real Data) */}
        <CoursesToolbar
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        {/* 3. Responsive 3-Column Course Grid */}
        <CoursesGrid
          courses={filteredCourses}
          loading={loading}
          error={error}
          onRetry={loadCourses}
          onResetFilters={handleResetFilters}
        />

        {/* 4. Horizontal Pro Membership Card matching page design at the bottom */}
        <div className="pt-2 pb-2">
          <ProMembershipPromoCard />
        </div>
      </main>

      {/* Footer */}
      <AppFooter />
    </div>
  );
}
