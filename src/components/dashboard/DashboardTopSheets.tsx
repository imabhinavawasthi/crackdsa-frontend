"use client";

import React from "react";
import { 
  Code2, 
  Shapes, 
  Rocket, 
  Zap, 
  Network, 
  Workflow, 
  Award,
  CheckCircle2
} from "lucide-react";
import { DSASheet } from "@/types/dsa-sheet";
import DashboardListCard, { DashboardListItem } from "./DashboardListCard";

interface DashboardTopSheetsProps {
  sheets: DSASheet[];
  loading?: boolean;
}

function getSheetVisual(title: string, tags?: string[], slug?: string) {
  const t = `${title} ${(tags || []).join(" ")} ${slug || ""}`.toLowerCase();

  if (t.includes("pattern")) {
    return {
      icon: Shapes,
      bg: "bg-purple-500/10 dark:bg-purple-500/15",
      text: "text-purple-600 dark:text-purple-400",
      border: "border-purple-500/20 dark:border-purple-500/30",
    };
  }
  if (t.includes("hero") || t.includes("0 to") || t.includes("beginner") || t.includes("starter")) {
    return {
      icon: Rocket,
      bg: "bg-amber-500/10 dark:bg-amber-500/15",
      text: "text-amber-600 dark:text-amber-400",
      border: "border-amber-500/20 dark:border-amber-500/30",
    };
  }
  if (t.includes("sprint") || t.includes("75") || t.includes("blind") || t.includes("sde")) {
    return {
      icon: Zap,
      bg: "bg-cyan-500/10 dark:bg-cyan-500/15",
      text: "text-cyan-600 dark:text-cyan-400",
      border: "border-cyan-500/20 dark:border-cyan-500/30",
    };
  }
  if (t.includes("tree") || t.includes("graph")) {
    return {
      icon: Network,
      bg: "bg-emerald-500/10 dark:bg-emerald-500/15",
      text: "text-emerald-600 dark:text-emerald-400",
      border: "border-emerald-500/20 dark:border-emerald-500/30",
    };
  }
  if (t.includes("dp") || t.includes("dynamic")) {
    return {
      icon: Workflow,
      bg: "bg-rose-500/10 dark:bg-rose-500/15",
      text: "text-rose-600 dark:text-rose-400",
      border: "border-rose-500/20 dark:border-rose-500/30",
    };
  }
  if (t.includes("striver") || t.includes("top")) {
    return {
      icon: Award,
      bg: "bg-indigo-500/10 dark:bg-indigo-500/15",
      text: "text-indigo-600 dark:text-indigo-400",
      border: "border-indigo-500/20 dark:border-indigo-500/30",
    };
  }

  return {
    icon: Code2,
    bg: "bg-blue-500/10 dark:bg-blue-500/15",
    text: "text-blue-600 dark:text-blue-400",
    border: "border-blue-500/20 dark:border-blue-500/30",
  };
}

function getLevelBadge(level?: string) {
  const l = (level || "mixed").toLowerCase();
  if (l.includes("beg") || l.includes("easy")) {
    return {
      label: "Beginner",
      className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    };
  }
  if (l.includes("inter") || l.includes("med")) {
    return {
      label: "Intermediate",
      className: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    };
  }
  if (l.includes("adv") || l.includes("hard")) {
    return {
      label: "Advanced",
      className: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    };
  }
  return {
    label: "All Levels",
    className: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  };
}

export default function DashboardTopSheets({
  sheets,
  loading = false,
}: DashboardTopSheetsProps) {
  const displaySheets = sheets.slice(0, 3);

  const items: DashboardListItem[] = displaySheets.map((sheet) => {
    const levelInfo = getLevelBadge(sheet.level);
    const solved = sheet.solved_problems ?? 0;
    const total = sheet.total_problems ?? 0;
    const visual = getSheetVisual(sheet.title, sheet.tags, sheet.id);
    const IconComponent = visual.icon;
    const percent = total > 0 ? Math.round((solved / total) * 100) : 0;

    return {
      id: sheet.id,
      href: `/dsa-sheet/${sheet.id}`,
      title: sheet.title,
      // Only difficulty level, no extra tag
      subtitle: (
        <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border ${levelInfo.className}`}>
          {levelInfo.label}
        </span>
      ),
      icon: <IconComponent size={17} />,
      iconBgClass: `${visual.bg} ${visual.text}`,
      iconBorderClass: visual.border,
      hoverBorderClass: "hover:border-blue-200 dark:hover:border-blue-900/50",
      hoverTextClass: "group-hover:text-blue-600 dark:group-hover:text-blue-400",
      rightElement: (
        <span className="px-2 py-0.5 rounded-md bg-white dark:bg-gray-900/90 border border-gray-200/90 dark:border-gray-700/80 text-[10px] font-bold text-gray-700 dark:text-gray-300 shadow-2xs group-hover:border-blue-300 dark:group-hover:border-blue-600/50 transition-colors">
          {total} Qs
        </span>
      ),
      bottomElement: (
        <div className="mt-2.5 pt-2 border-t border-gray-100/90 dark:border-gray-800/60">
          <div className="flex items-center justify-between text-[11px] mb-1 font-medium">
            <span className="text-gray-500 dark:text-gray-400">
              <strong className="text-gray-900 dark:text-white font-bold">{solved}</strong> of {total} solved
            </span>
            <span className={`font-bold ${solved > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-gray-400 dark:text-gray-500"}`}>
              {percent}%
            </span>
          </div>
          <div className="h-1.5 w-full bg-gray-200/80 dark:bg-gray-700/60 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                percent >= 100
                  ? "bg-emerald-500"
                  : "bg-linear-to-r from-blue-500 to-indigo-600"
              }`}
              style={{ width: `${Math.min(Math.max(percent, solved > 0 ? 3 : 0), 100)}%` }}
            />
          </div>
        </div>
      ),
    };
  });

  return (
    <DashboardListCard
      title="DSA Sheets"
      headerIcon={<Code2 size={15} />}
      headerIconClass="bg-blue-500/10 text-blue-600 dark:text-blue-400"
      viewAllHref="/dsa-sheet"
      items={items}
      loading={loading}
      emptyText="No DSA sheets available."
      ambientGlowClass="bg-blue-500/5 dark:bg-blue-400/5"
    />
  );
}
