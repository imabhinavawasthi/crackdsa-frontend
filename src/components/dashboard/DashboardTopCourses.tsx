"use client";

import React, { useState, useEffect } from "react";
import { 
  GraduationCap, 
  Boxes, 
  Terminal, 
  Cpu, 
  Layers, 
  Database, 
  Globe, 
  BookOpen,
  Clock,
  Sparkles
} from "lucide-react";
import { CourseSummary } from "@/types/course";
import DashboardListCard, { DashboardListItem } from "./DashboardListCard";

interface DashboardTopCoursesProps {
  courses: CourseSummary[];
  loading?: boolean;
}

function getCourseVisual(title: string, category?: string, tags?: string[], slug?: string) {
  const t = `${title} ${category || ""} ${(tags || []).join(" ")} ${slug || ""}`.toLowerCase();

  if (t.includes("oops") || t.includes("object oriented") || t.includes("java") || t.includes("c++")) {
    return {
      icon: Boxes,
      bg: "bg-purple-500/10 dark:bg-purple-500/15",
      text: "text-purple-600 dark:text-purple-400",
      border: "border-purple-500/20 dark:border-purple-500/30",
    };
  }
  if (t.includes("python") || t.includes("script") || t.includes("terminal")) {
    return {
      icon: Terminal,
      bg: "bg-emerald-500/10 dark:bg-emerald-500/15",
      text: "text-emerald-600 dark:text-emerald-400",
      border: "border-emerald-500/20 dark:border-emerald-500/30",
    };
  }
  if (t.includes("operating system") || t.includes("os") || t.includes("threads") || t.includes("linux")) {
    return {
      icon: Cpu,
      bg: "bg-blue-500/10 dark:bg-blue-500/15",
      text: "text-blue-600 dark:text-blue-400",
      border: "border-blue-500/20 dark:border-blue-500/30",
    };
  }
  if (t.includes("design") || t.includes("architecture") || t.includes("distributed")) {
    return {
      icon: Layers,
      bg: "bg-cyan-500/10 dark:bg-cyan-500/15",
      text: "text-cyan-600 dark:text-cyan-400",
      border: "border-cyan-500/20 dark:border-cyan-500/30",
    };
  }
  if (t.includes("database") || t.includes("dbms") || t.includes("sql")) {
    return {
      icon: Database,
      bg: "bg-rose-500/10 dark:bg-rose-500/15",
      text: "text-rose-600 dark:text-rose-400",
      border: "border-rose-500/20 dark:border-rose-500/30",
    };
  }
  if (t.includes("web") || t.includes("frontend") || t.includes("react") || t.includes("fullstack")) {
    return {
      icon: Globe,
      bg: "bg-amber-500/10 dark:bg-amber-500/15",
      text: "text-amber-600 dark:text-amber-400",
      border: "border-amber-500/20 dark:border-amber-500/30",
    };
  }

  return {
    icon: BookOpen,
    bg: "bg-purple-500/10 dark:bg-purple-500/15",
    text: "text-purple-600 dark:text-purple-400",
    border: "border-purple-500/20 dark:border-purple-500/30",
  };
}

/**
 * Smooth rotating syllabus component that cycles through syllabus highlights
 */
function RotatingSyllabusTicker({ items }: { items: string[] }) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!items || items.length <= 1) return;

    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % items.length);
        setVisible(true);
      }, 250);
    }, 3200);

    return () => clearInterval(interval);
  }, [items]);

  if (!items || items.length === 0) return null;

  return (
    <div className="flex items-center gap-1.5 min-w-0">
      <span className="size-1.5 rounded-full bg-purple-500 dark:bg-purple-400 shrink-0 animate-pulse" />
      <span
        className={`text-[11px] font-semibold text-purple-700 dark:text-purple-300 truncate transition-all duration-250 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-0.5"
        }`}
      >
        {items[index]}
      </span>
    </div>
  );
}

export default function DashboardTopCourses({
  courses,
  loading = false,
}: DashboardTopCoursesProps) {
  const displayCourses = courses.slice(0, 3);

  const items: DashboardListItem[] = displayCourses.map((c) => {
    const durationLabel = c.metadata?.duration_weeks 
      ? `${c.metadata.duration_weeks} Weeks` 
      : c.total_videos 
      ? `${c.total_videos} Lessons` 
      : "Self-paced";
    const visual = getCourseVisual(c.title, c.category, c.tags, c.slug);
    const IconComponent = visual.icon;

    // Syllabus items from metadata
    const syllabusList = (c.metadata?.marketing_syllabus as string[]) || [];
    const tagsList = c.tags || [];

    return {
      id: c.id,
      href: `/courses/${c.slug}`,
      title: c.title,
      subtitle: (
        <span className="text-[11px] text-gray-500 dark:text-gray-400 font-medium flex items-center gap-1">
          <Clock size={11} className="text-gray-400 shrink-0" />
          <span>{durationLabel}</span>
        </span>
      ),
      icon: <IconComponent size={17} />,
      iconBgClass: `${visual.bg} ${visual.text}`,
      iconBorderClass: visual.border,
      hoverBorderClass: "hover:border-purple-200 dark:hover:border-purple-900/50",
      hoverTextClass: "group-hover:text-purple-600 dark:group-hover:text-purple-400",
      rightElement: (
        ""
      ),
      bottomElement: (
        <div className="mt-2.5 pt-2 border-t border-gray-100/90 dark:border-gray-800/60 space-y-1.5">
          {/* Rotating Syllabus Ticker */}
          {syllabusList.length > 0 ? (
            <RotatingSyllabusTicker items={syllabusList} />
          ) : (
            <div className="flex items-center gap-1.5 text-[11px] text-gray-500 dark:text-gray-400 font-medium truncate">
              <span className="size-1.5 rounded-full bg-blue-500 shrink-0" />
              <span className="truncate">Comprehensive interview-focused curriculum</span>
            </div>
          )}

          {/* Tags Chips */}
          {tagsList.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap">
              {tagsList.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-gray-100 dark:bg-gray-800/80 text-gray-600 dark:text-gray-300 border border-gray-200/60 dark:border-gray-700/60"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      ),
    };
  });

  return (
    <DashboardListCard
      title="Courses"
      headerIcon={<GraduationCap size={16} />}
      headerIconClass="bg-purple-500/10 text-purple-600 dark:text-purple-400"
      viewAllHref="/courses"
      items={items}
      loading={loading}
      emptyText="No courses available."
      ambientGlowClass="bg-purple-500/5 dark:bg-purple-400/5"
    />
  );
}
