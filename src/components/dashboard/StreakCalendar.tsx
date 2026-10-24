"use client";

import React, { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Flame, Zap, Calendar as CalendarIcon } from "lucide-react";

interface StreakCalendarProps {
  activityDates: string[]; // YYYY-MM-DD strings
  currentStreak: number;
  maxStreak: number;
  loading?: boolean;
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const WEEKDAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

export default function StreakCalendar({
  activityDates,
  currentStreak,
  maxStreak,
  loading = false,
}: StreakCalendarProps) {
  const today = useMemo(() => new Date(), []);
  const [currentMonthIndex, setCurrentMonthIndex] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const activeDaysSet = useMemo(() => new Set(activityDates), [activityDates]);

  // Compute calendar days for currentMonthIndex and currentYear
  const calendarData = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonthIndex, 1);
    // Convert Sunday=0, Monday=1... to Monday=0, Sunday=6
    const startDayIndex = (firstDay.getDay() + 6) % 7;
    const daysInMonth = new Date(currentYear, currentMonthIndex + 1, 0).getDate();
    const todayStr = today.toLocaleDateString("en-CA");

    const cells: {
      day: number | null;
      dateKey: string | null;
      isActive: boolean;
      isToday: boolean;
      isFuture: boolean;
    }[] = [];

    // Empty cells before start of month
    for (let i = 0; i < startDayIndex; i++) {
      cells.push({
        day: null,
        dateKey: null,
        isActive: false,
        isToday: false,
        isFuture: false,
      });
    }

    // Days in current month
    for (let d = 1; d <= daysInMonth; d++) {
      const dateObj = new Date(currentYear, currentMonthIndex, d);
      const dateKey = dateObj.toLocaleDateString("en-CA");
      const isToday = dateKey === todayStr;
      const isFuture = dateObj.getTime() > today.getTime() && !isToday;
      const isActive = activeDaysSet.has(dateKey);

      cells.push({
        day: d,
        dateKey,
        isActive,
        isToday,
        isFuture,
      });
    }

    return cells;
  }, [currentYear, currentMonthIndex, activeDaysSet, today]);

  const handlePrevMonth = () => {
    if (currentMonthIndex === 0) {
      setCurrentMonthIndex(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonthIndex((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonthIndex === 11) {
      setCurrentMonthIndex(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonthIndex((m) => m + 1);
    }
  };

  // Month active days count
  const monthActiveCount = useMemo(() => {
    return calendarData.filter((c) => c.isActive).length;
  }, [calendarData]);

  return (
    <div className="rounded-2xl border border-gray-200/90 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 sm:p-6 shadow-xs transition-colors select-none flex flex-col justify-between h-full">
      <div>
        {/* ─── Top Header: Daily Streak & Active Streak Badge ────────── */}
        <div className="flex items-center justify-between pb-3.5 mb-3 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-base sm:text-lg font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
            <Flame size={18} className="text-orange-500 fill-orange-500/20" />
            <span>Daily Streak</span>
          </h2>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
            <Flame size={11} className="fill-orange-500 text-orange-500" />
            {currentStreak}d Streak
          </span>
        </div>

        {loading ? (
          /* Calendar Loading Skeleton */
          <div className="space-y-3 py-1 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="h-4 w-28 rounded bg-gray-200 dark:bg-gray-800" />
              <div className="h-4 w-12 rounded bg-gray-200 dark:bg-gray-800" />
            </div>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: 28 }).map((_, i) => (
                <div key={i} className="size-6 mx-auto rounded-md bg-gray-200 dark:bg-gray-800" />
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* ─── Month & Navigation ───────────────────────────────── */}
            <div className="flex items-center justify-between pb-2 mb-2">
              <div className="flex items-center gap-1.5">
                <div className="flex size-6 items-center justify-center rounded-md bg-orange-500/10 text-orange-600 dark:text-orange-400">
                  <CalendarIcon size={12} />
                </div>
                <span className="text-[11px] font-black uppercase tracking-wider text-gray-900 dark:text-white">
                  {MONTH_NAMES[currentMonthIndex]} {currentYear}
                </span>
              </div>

              <div className="flex items-center gap-0.5">
                <button
                  type="button"
                  onClick={handlePrevMonth}
                  aria-label="Previous Month"
                  className="flex size-6 items-center justify-center rounded-md text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  <ChevronLeft size={14} />
                </button>
                <button
                  type="button"
                  onClick={handleNextMonth}
                  aria-label="Next Month"
                  className="flex size-6 items-center justify-center rounded-md text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>

            {/* ─── Weekdays Header Row ──────────────────────────────── */}
            <div className="grid grid-cols-7 gap-1 text-center mb-1">
              {WEEKDAYS.map((wd) => (
                <span
                  key={wd}
                  className="text-[9px] font-bold text-gray-400 dark:text-gray-500"
                >
                  {wd}
                </span>
              ))}
            </div>

            {/* ─── Days Grid ────────────────────────────────────────── */}
            <div className="grid grid-cols-7 gap-1 text-center">
              {calendarData.map((cell, idx) => {
                if (!cell.day) {
                  return <div key={`empty-${idx}`} className="size-6 mx-auto" />;
                }

                return (
                  <div
                    key={cell.dateKey}
                    title={cell.dateKey || undefined}
                    className={`size-6 mx-auto flex items-center justify-center rounded-md text-[11px] font-bold transition-all ${
                      cell.isActive
                        ? "bg-gradient-to-br from-amber-500/20 to-orange-500/20 text-orange-600 dark:text-orange-400 border border-orange-500/30 shadow-2xs text-[10px]"
                        : cell.isToday
                        ? "ring-2 ring-blue-600 dark:ring-blue-400 text-blue-600 dark:text-blue-400 bg-blue-50/60 dark:bg-blue-950/40 font-black"
                        : cell.isFuture
                        ? "text-gray-300 dark:text-gray-600 font-normal"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                  >
                    {cell.isActive ? (
                      <span className="text-[10px] leading-none">🔥</span>
                    ) : (
                      <span>{cell.day}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* ─── Footer: Streak Stats ───────────────────────────────────── */}
      <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">
            Streak:
          </span>
          <span className="inline-flex items-center gap-0.5 font-black text-orange-600 dark:text-orange-400">
            <Flame size={12} className="fill-orange-500 text-orange-500" />
            {currentStreak}d
          </span>
        </div>

        <div className="flex items-center gap-1">
          <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">
            Best:
          </span>
          <span className="inline-flex items-center gap-0.5 font-black text-blue-600 dark:text-blue-400">
            <Zap size={12} className="fill-blue-500 text-blue-500" />
            {maxStreak}d
          </span>
        </div>

        <div className="flex items-center gap-1">
          <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">
            Active:
          </span>
          <span className="font-black text-emerald-600 dark:text-emerald-400">
            {monthActiveCount}d
          </span>
        </div>
      </div>
    </div>
  );
}
