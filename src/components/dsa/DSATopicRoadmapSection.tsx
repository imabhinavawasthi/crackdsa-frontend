"use client";

import React from "react";
import UnifiedPhaseTimeline, { TopicPhaseData, ChapterData, PhaseItemData } from "@/components/common/UnifiedPhaseTimeline";
import { CourseSubsection, CourseSectionItem } from "@/types/course";

const DSA_COURSE_SLUG =
  process.env.NEXT_PUBLIC_DSA_COURSE_SLUG ||
  "data-structures-algorithms-mastery-program";

interface DSATopicRoadmapSectionProps {
  topicTitle: string;
  topicSubtitle?: string;
  subsections: CourseSubsection[];
  rootItems?: CourseSectionItem[];
}

export function DSATopicRoadmapSection({
  topicTitle,
  topicSubtitle,
  subsections,
  rootItems,
}: DSATopicRoadmapSectionProps) {
  // Helper function to build destination URL for all items (problems, videos, articles)
  const getItemHref = (item: CourseSectionItem): string => {
    return `/courses/dsa/learn?item=${item.id}`;
  };

  // Convert subsections into ChapterData[]
  const chapters: ChapterData[] = subsections.map((sub, index) => {
    const items: PhaseItemData[] = (sub.items || []).map((item) => ({
      id: item.id,
      title: item.title,
      type: item.type,
      status: "available",
      difficulty: item.type === "problem" ? "Medium" : undefined,
      timeEstimate: item.duration_label,
      isFree: item.is_free,
      assetId: item.asset_id,
      slug: item.slug,
      href: getItemHref(item),
    }));

    return {
      id: sub.id || `chapter-${index + 1}`,
      title: sub.title,
      description: sub.description,
      items,
    };
  });

  // Prepend root overview items as Getting Started chapter if present
  if (rootItems && rootItems.length > 0) {
    const rootItemsData: PhaseItemData[] = rootItems.map((item) => ({
      id: item.id,
      title: item.title,
      type: item.type,
      status: "available",
      timeEstimate: item.duration_label,
      isFree: item.is_free,
      assetId: item.asset_id,
      slug: item.slug,
      href: getItemHref(item),
    }));

    chapters.unshift({
      id: "chapter-getting-started",
      title: "Getting Started & Prerequisites",
      description: "Overview & foundational concepts",
      items: rootItemsData,
    });
  }

  const topicPhase: TopicPhaseData = {
    id: "phase-1",
    title: topicTitle,
    subtitle: topicSubtitle,
    chapters,
  };

  return <UnifiedPhaseTimeline topicPhase={topicPhase} />;
}
