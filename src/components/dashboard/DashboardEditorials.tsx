"use client";

import React from "react";
import { Trophy } from "lucide-react";
import { ContestSummary } from "@/types/contest";
import { PlatformLogo } from "@/components/contests/PlatformLogo";
import DashboardListCard, { DashboardListItem } from "./DashboardListCard";

interface DashboardEditorialsProps {
  contests: ContestSummary[];
  loading?: boolean;
}

export default function DashboardEditorials({
  contests,
  loading = false,
}: DashboardEditorialsProps) {
  const displayContests = contests.slice(0, 3);

  const items: DashboardListItem[] = displayContests.map((c) => {
    const platformCapitalized =
      c.platform.charAt(0).toUpperCase() + c.platform.slice(1);

    return {
      id: c.id,
      href: `/contests/editorials/${c.platform}/${c.id}`,
      title: c.contest,
      subtitle: (
        <span className="text-[11px] text-gray-500 dark:text-gray-400 font-medium truncate">
          {platformCapitalized} • {c.date}
        </span>
      ),
      icon: <PlatformLogo platform={c.platform} size={22} className="shrink-0" />,
      iconBgClass: "bg-white dark:bg-gray-900",
      iconBorderClass: "border-gray-100 dark:border-gray-800",
      hoverBorderClass: "hover:border-amber-200 dark:hover:border-amber-900/50",
      hoverTextClass: "group-hover:text-amber-600 dark:group-hover:text-amber-400",
      rightElement: (
        <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-gray-900/90 border border-gray-200/90 dark:border-gray-700/80 text-[11px] font-bold text-gray-700 dark:text-gray-300 shadow-2xs group-hover:border-amber-300 dark:group-hover:border-amber-600/50 transition-colors">
          {c.total_problems} Qs
        </span>
      ),
    };
  });

  return (
    <DashboardListCard
      title="Contest Editorials"
      headerIcon={<Trophy size={15} />}
      headerIconClass="bg-amber-500/10 text-amber-600 dark:text-amber-400"
      viewAllHref="/contests/editorials"
      items={items}
      loading={loading}
      emptyText="No contest editorials available."
      ambientGlowClass="bg-amber-500/5 dark:bg-amber-400/5"
    />
  );
}
