"use client";

import React, { useMemo } from "react";
import { Sparkles, Calendar, Zap, Award } from "lucide-react";
import { motion, Variants } from "framer-motion";

interface ActivityHeatmapProps {
  calendarDays: Date[];
  heatmapActivity: Record<string, number>;
  selectedYear: number;
  setSelectedYear: (year: number) => void;
  selectedMonth: number;
  setSelectedMonth: (month: number) => void;
}

const formatDateKey = (date: Date): string => {
  return date.toLocaleDateString("en-CA"); // YYYY-MM-DD
};

// Motion variants for springy entry animation
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03
    }
  }
};

const columnVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 14
    }
  }
};

export default function ActivityHeatmap({
  calendarDays,
  heatmapActivity,
  selectedYear,
  setSelectedYear,
  selectedMonth,
  setSelectedMonth,
}: ActivityHeatmapProps) {
  
  // Group the days into week chunks (7 days per week)
  const weeks = useMemo(() => {
    const w: { monthLabel: string | null; days: Date[] }[] = [];
    let currentMonth = -1;

    for (let i = 0; i < calendarDays.length; i += 7) {
      const weekDays = calendarDays.slice(i, i + 7);
      if (weekDays.length === 0) continue;
      
      const sunday = weekDays[0];
      const m = sunday.getMonth();
      let monthLabel = null;

      if (m !== currentMonth) {
        currentMonth = m;
        monthLabel = sunday.toLocaleDateString("en-US", { month: "short" });
      }

      w.push({ monthLabel, days: weekDays });
    }
    return w;
  }, [calendarDays]);

  const yearsRange = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return [currentYear, currentYear - 1, currentYear - 2];
  }, []);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Calculate month-specific insights
  const insights = useMemo(() => {
    let activeDays = 0;
    let totalInteractions = 0;
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();

    calendarDays.forEach((day) => {
      if (day.getMonth() === selectedMonth) {
        const key = formatDateKey(day);
        const count = heatmapActivity[key] || 0;
        if (count > 0) {
          activeDays++;
          totalInteractions += count;
        }
      }
    });

    const activePercentage = Math.round((activeDays / daysInMonth) * 100);

    return { activeDays, totalInteractions, activePercentage, daysInMonth };
  }, [calendarDays, heatmapActivity, selectedMonth, selectedYear]);

  return (
    <div className="w-full rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-6 shadow-sm flex flex-col md:flex-row gap-8 items-stretch">
      {/* Left: Heatmap Grid */}
      <div className="flex-1 flex flex-col gap-6">
        {/* Header & Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
              <Sparkles size={14} className="text-brand-500" />
              <span>Contribution Activity Heatmap</span>
            </h3>
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
              Daily interactions for {months[selectedMonth]} {selectedYear}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Month Select */}
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="appearance-none bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-xs font-bold text-gray-700 dark:text-gray-300 rounded-xl px-3.5 py-1.5 focus:outline-hidden cursor-pointer"
            >
              {months.map((m, idx) => (
                <option key={idx} value={idx}>
                  {m.slice(0, 3)}
                </option>
              ))}
            </select>

            {/* Year Select */}
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="appearance-none bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-xs font-bold text-gray-700 dark:text-gray-300 rounded-xl px-3.5 py-1.5 focus:outline-hidden cursor-pointer"
            >
              {yearsRange.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Contribution Grid */}
        <div className="w-full py-2 overflow-x-auto select-none no-scrollbar">
          <div className="flex gap-3 w-full items-start">
            {/* Day Labels Column */}
            <div className="grid grid-rows-7 gap-1.5 text-[10px] font-bold text-gray-400 dark:text-gray-550 justify-items-end select-none pr-1.5 pt-6 shrink-0">
              <span className="h-10 sm:h-12 md:h-14 lg:h-16 flex items-center justify-end"></span>
              <span className="h-10 sm:h-12 md:h-14 lg:h-16 flex items-center justify-end">Mon</span>
              <span className="h-10 sm:h-12 md:h-14 lg:h-16 flex items-center justify-end"></span>
              <span className="h-10 sm:h-12 md:h-14 lg:h-16 flex items-center justify-end">Wed</span>
              <span className="h-10 sm:h-12 md:h-14 lg:h-16 flex items-center justify-end"></span>
              <span className="h-10 sm:h-12 md:h-14 lg:h-16 flex items-center justify-end">Fri</span>
              <span className="h-10 sm:h-12 md:h-14 lg:h-16 flex items-center justify-end"></span>
            </div>

            {/* Weekly Columns Grid */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="flex-1 flex gap-1.5"
            >
              {weeks.map((week, weekIdx) => (
                <motion.div
                  key={weekIdx}
                  variants={columnVariants}
                  className="flex-1 flex flex-col gap-1.5 items-start"
                >
                  {/* Month Label Row */}
                  <div className="h-5 relative w-full mb-1">
                    {week.monthLabel && (
                      <span className="absolute left-0 top-0 text-[10px] font-extrabold text-gray-400 dark:text-gray-550 whitespace-nowrap uppercase tracking-wider">
                        {week.monthLabel}
                      </span>
                    )}
                  </div>

                  {/* 7 Day Cells */}
                  {week.days.map((day, dayIdx) => {
                    const key = formatDateKey(day);
                    const count = heatmapActivity[key] || 0;
                    const isCurrentMonth = day.getMonth() === selectedMonth;

                    let colorClass =
                      "bg-gray-50 dark:bg-gray-900 border border-gray-150 dark:border-gray-800 text-gray-400 dark:text-gray-650 hover:bg-gray-100 dark:hover:bg-gray-850 hover:border-gray-300 dark:hover:border-gray-700";
                    
                    if (!isCurrentMonth) {
                      colorClass =
                        "bg-transparent border border-dashed border-gray-200 dark:border-gray-850 opacity-15 pointer-events-none text-transparent";
                    } else if (count === 1) {
                      colorClass =
                        "bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-300 hover:bg-brand-500/20 hover:border-brand-500/35";
                    } else if (count === 2) {
                      colorClass =
                        "bg-brand-500/40 border border-brand-500/30 text-white hover:bg-brand-500/55";
                    } else if (count >= 3) {
                      colorClass =
                        "bg-brand-500 border border-brand-600 text-white shadow-xs shadow-brand-500/20 hover:bg-brand-600";
                    }

                    const dateFormatted = day.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });

                    return (
                      <div
                        key={dayIdx}
                        className={`relative group/cell w-full h-10 sm:h-12 md:h-14 lg:h-16 rounded-xl flex flex-col justify-between p-1.5 sm:p-2.5 transition-all hover:scale-[1.03] hover:shadow-md cursor-pointer duration-200 ${colorClass}`}
                      >
                        {isCurrentMonth ? (
                          <>
                            <span className="text-[10px] sm:text-xs font-black self-start">
                              {day.getDate()}
                            </span>
                            {count > 0 && (
                              <span className="hidden sm:block text-[8px] font-black uppercase tracking-wider mt-auto text-left leading-none">
                                {count} {count === 1 ? "solved" : "solved"}
                              </span>
                            )}
                          </>
                        ) : null}
                        
                        {/* Fixed Tooltip */}
                        {isCurrentMonth && (
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 hidden group-hover/cell:flex flex-col items-center z-50 pointer-events-none w-max">
                            <div className="bg-gray-950 text-white text-[9px] font-bold uppercase tracking-wider rounded-lg px-2.5 py-1.5 shadow-xl border border-gray-800">
                              {count === 0 ? "No" : count}{" "}
                              {count === 1 ? "activity" : "activities"} on{" "}
                              {dateFormatted}
                            </div>
                            <div className="w-2 h-2 bg-gray-950 rotate-45 -mt-1 border-r border-b border-gray-800" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between text-[9px] font-bold text-gray-400 uppercase tracking-wider pt-4 mt-auto border-t border-gray-100 dark:border-gray-900 shrink-0">
          <span>
            {calendarDays[0]?.toLocaleDateString("en-US", { month: "short" }) || ""}{" "}
            –{" "}
            {calendarDays[calendarDays.length - 1]?.toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            }) || ""}
          </span>
          <div className="flex items-center gap-1.5">
            <span>Less</span>
            <div className="w-3.5 h-3.5 rounded-md bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800" />
            <div className="w-3.5 h-3.5 rounded-md bg-brand-500/10 border border-brand-500/20" />
            <div className="w-3.5 h-3.5 rounded-md bg-brand-500/40" />
            <div className="w-3.5 h-3.5 rounded-md bg-brand-500" />
            <span>More</span>
          </div>
        </div>
      </div>

      {/* Vertical Divider */}
      <div className="hidden md:block w-px bg-gray-150 dark:bg-gray-850 self-stretch" />

      {/* Right: Monthly Insights Panel */}
      <div className="md:w-60 shrink-0 flex flex-col justify-between gap-5 py-1.5">
        <div className="space-y-4">
          <div className="space-y-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
              <Award size={14} className="text-brand-500" />
              <span>Month Insights</span>
            </h4>
            <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest">Selected Period Analysis</p>
          </div>

          <div className="space-y-3">
            {/* Metric 1 */}
            <div className="p-3.5 rounded-2xl border border-gray-100 dark:border-gray-900 bg-gray-50/50 dark:bg-gray-900/10 space-y-1">
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Active Days</span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-black text-gray-900 dark:text-white leading-none">{insights.activeDays}</span>
                <span className="text-[10px] font-bold text-gray-400">/ {insights.daysInMonth} Days</span>
              </div>
            </div>

            {/* Metric 2 */}
            <div className="p-3.5 rounded-2xl border border-gray-100 dark:border-gray-900 bg-gray-50/50 dark:bg-gray-900/10 space-y-1">
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Total Interactions</span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-black text-gray-900 dark:text-white leading-none">{insights.totalInteractions}</span>
                <span className="text-[10px] font-bold text-gray-400">activities</span>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
            <span className="text-gray-400">Monthly Consistency</span>
            <span className="text-brand-500">{insights.activePercentage}%</span>
          </div>
          <div className="w-full bg-gray-100 dark:bg-gray-900 h-2 rounded-full overflow-hidden border border-gray-200/50 dark:border-gray-800/50 p-[1px]">
            <div
              className="bg-brand-500 h-full rounded-full transition-all duration-700"
              style={{ width: `${insights.activePercentage}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
