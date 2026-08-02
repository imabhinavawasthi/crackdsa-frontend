"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Clock, Loader2 } from "lucide-react";
import { dsaModules } from "@/config/dsa-catalog";
import { fetchCourseCurriculum } from "@/api/courses";
import { CourseSection } from "@/types/course";
import { deriveSectionStats } from "@/utils/courseCatalogSync";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import { DSATopicHeader } from "@/components/dsa/DSATopicHeader";
import { DSATopicRoadmapSection } from "@/components/dsa/DSATopicRoadmapSection";

const DSA_COURSE_SLUG =
  process.env.NEXT_PUBLIC_DSA_COURSE_SLUG ||
  "data-structures-algorithms-mastery-program";

export default function DSATopicDetailPage() {
  const params = useParams();
  const slug = (params?.slug as string) || "";

  const [curriculum, setCurriculum] = useState<CourseSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Find local module by slug or ID
  const localModule = useMemo(() => {
    return dsaModules.find(
      (m) => m.id.toLowerCase() === slug.toLowerCase() || (m.slug && m.slug.toLowerCase() === slug.toLowerCase())
    );
  }, [slug]);

  // Fetch full course curriculum from backend
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const sections = await fetchCourseCurriculum(DSA_COURSE_SLUG);
        setCurriculum(sections);
      } catch (err) {
        console.warn("Unable to fetch course curriculum for topic page:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // Match topic section from course curriculum by ID/title (ignoring symbols and replacing - with spaces)
  const matchedSection = useMemo(() => {
    if (!curriculum || curriculum.length === 0 || !localModule) return null;

    const normalizeKey = (str: string) =>
      (str || "").replace(/-/g, " ").replace(/[^a-zA-Z0-9\s]/g, "").toLowerCase().trim();

    const targetIdKey = normalizeKey(localModule.id);
    const targetTitleKey = normalizeKey(localModule.title);

    return curriculum.find((sec) => {
      const secIdKey = normalizeKey(sec.id || "");
      const secTitleKey = normalizeKey(sec.title || "");

      return (
        secIdKey === targetIdKey ||
        secTitleKey === targetIdKey ||
        secTitleKey === targetTitleKey ||
        secTitleKey.includes(targetIdKey) ||
        targetIdKey.includes(secTitleKey)
      );
    });
  }, [curriculum, localModule]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[65vh] space-y-3">
        <Loader2 className="animate-spin text-brand-500" size={42} />
        <p className="text-xs font-bold text-gray-500 dark:text-gray-400">
          Loading topic curriculum & lectures...
        </p>
      </div>
    );
  }

  if (!localModule) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center space-y-4">
        <h1 className="text-2xl font-black text-gray-900 dark:text-white">
          Topic Not Found
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          The requested DSA topic &quot;{slug}&quot; could not be located in our catalog.
        </p>
        <Link
          href="/dsa"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-500 text-white text-xs font-bold shadow-sm hover:bg-brand-600 transition-colors"
        >
          Back to DSA Catalog
        </Link>
      </div>
    );
  }

  const sectionStats = matchedSection ? deriveSectionStats(matchedSection) : null;
  const isUpcoming = !matchedSection || (sectionStats && sectionStats.itemsCount === 0);

  const subsections = matchedSection?.subsections || [];
  const rootItems = matchedSection?.items || [];

  // Breadcrumbs items definition
  const breadcrumbItems = [
    { title: "Dashboard", href: "/dashboard" },
    { title: "DSA", href: "/dsa" },
    { title: localModule.title },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 pt-4 space-y-6">
      {/* Reusable Breadcrumb Navigation Component */}
      <Breadcrumbs items={breadcrumbItems} />

      {/* Extracted Header Component */}
      <DSATopicHeader
        module={localModule}
        sectionStats={sectionStats}
        isUpcoming={Boolean(isUpcoming)}
      />

      {/* Main Content View */}
      {isUpcoming ? (
        /* Upcoming State Banner */
        <div className="py-16 px-6 text-center rounded-2xl border border-dashed border-gray-300 dark:border-gray-800 bg-white/60 dark:bg-[#121722]/60 backdrop-blur-md space-y-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500 mx-auto">
            <Clock size={28} />
          </div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Content Coming Soon
          </h2>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 max-w-md mx-auto leading-relaxed">
            The video lectures and practice problems for &quot;{localModule.title}&quot; are currently being recorded and curated by our SDE mentors.
          </p>
          <Link
            href="/dsa"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-bold shadow-md hover:scale-105 transition-all"
          >
            Explore Available Topics
          </Link>
        </div>
      ) : (
        /* Unified Phase Timeline Section */
        <DSATopicRoadmapSection
          topicTitle={localModule.title}
          topicSubtitle={localModule.description}
          subsections={subsections}
          rootItems={rootItems}
        />
      )}
    </div>
  );
}
