"use client";

import { Building } from "lucide-react";
import TagSummaryPageLayout from "@/components/practice/TagSummaryPageLayout";
import { fetchCompaniesSummary } from "@/api/problems";

const CARD_PALETTE = [
  { gradient: "from-orange-500/10 to-amber-600/5",  ring: "hover:ring-orange-400/30",  icon: "bg-orange-500/10 text-orange-600 dark:text-orange-400" },
  { gradient: "from-blue-500/10 to-cyan-600/5",     ring: "hover:ring-blue-400/30",    icon: "bg-blue-500/10 text-blue-600 dark:text-blue-400"       },
  { gradient: "from-violet-500/10 to-indigo-600/5", ring: "hover:ring-violet-400/30",  icon: "bg-violet-500/10 text-violet-600 dark:text-violet-400"  },
  { gradient: "from-rose-500/10 to-pink-600/5",     ring: "hover:ring-rose-400/30",    icon: "bg-rose-500/10 text-rose-600 dark:text-rose-400"        },
];

export default function PracticeCompaniesListPage() {
  return (
    <TagSummaryPageLayout
      breadcrumbItems={[
        { title: "Practice", href: "/practice" },
        { title: "Companies" },
      ]}
      title={
        <>
          Company-wise{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-brand-400">
            Interview Prep
          </span>
        </>
      }
      subtitle="Target specific tech firms by practicing their most-asked DSA questions. Pick a company or browse the full directory."
      fetchFn={fetchCompaniesSummary}
      basePath="/practice/companies"
      nameLabel="Company"
      entityLabel="company"
      featuredSectionLabel="Top Employers"
      featuredSectionSub="Most Asked Questions"
      indexSectionLabel="All Companies"
      cardIcon={Building}
      cardPalette={CARD_PALETTE}
      cardFooterLabel="Interview Prep"
    />
  );
}
