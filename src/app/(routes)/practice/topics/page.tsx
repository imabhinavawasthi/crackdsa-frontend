"use client";

import { BookOpen } from "lucide-react";
import TagSummaryPageLayout from "@/components/practice/TagSummaryPageLayout";
import { fetchTopicsSummary } from "@/api/problems";

const CARD_PALETTE = [
  { gradient: "from-blue-500/10 to-indigo-600/5",   ring: "hover:ring-blue-400/30",   icon: "bg-blue-500/10 text-blue-600 dark:text-blue-400"     },
  { gradient: "from-violet-500/10 to-purple-600/5", ring: "hover:ring-violet-400/30", icon: "bg-violet-500/10 text-violet-600 dark:text-violet-400" },
  { gradient: "from-emerald-500/10 to-teal-600/5",  ring: "hover:ring-emerald-400/30",icon: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"},
  { gradient: "from-amber-500/10 to-orange-600/5",  ring: "hover:ring-amber-400/30",  icon: "bg-amber-500/10 text-amber-600 dark:text-amber-400"   },
];

export default function PracticeTopicsListPage() {
  return (
    <TagSummaryPageLayout
      breadcrumbItems={[
        { title: "Practice", href: "/practice" },
        { title: "Topics" },
      ]}
      title={
        <>
          Topic-wise{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-brand-400">
            Practice Sheets
          </span>
        </>
      }
      subtitle="Navigate DSA sheets category by category. Pick a featured domain or browse the full index below."
      fetchFn={fetchTopicsSummary}
      basePath="/practice/topics"
      nameLabel="Topic"
      entityLabel="topic"
      featuredSectionLabel="Most Solved Topics"
      featuredSectionSub="Interview Favorites"
      indexSectionLabel="Complete Topic Index"
      cardIcon={BookOpen}
      cardPalette={CARD_PALETTE}
      cardFooterLabel="Practice Sheet"
    />
  );
}
