"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Play,
  CloudUpload,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  Settings,
  Bell,
  Flame,
  Clock,
  RotateCcw,
  Sparkles,
  LayoutGrid,
  Bug,
  ListFilter,
  Check,
  Search,
  ExternalLink,
  Crown,
  Pause,
} from "lucide-react";
import { ALL_SOLVE_PROBLEMS_LIST, ProblemSolveData } from "./solveProblemsData";

interface SolveNavbarProps {
  currentProblem: ProblemSolveData;
  onRun: () => void;
  onSubmit: () => void;
  isRunning?: boolean;
  isSubmitting?: boolean;
  onSelectProblem?: (slug: string) => void;
}

export const SolveNavbar: React.FC<SolveNavbarProps> = ({
  currentProblem,
  onRun,
  onSubmit,
  isRunning = false,
  isSubmitting = false,
  onSelectProblem,
}) => {
  const router = useRouter();

  // Problem list modal state
  const [showProblemList, setShowProblemList] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Timer state
  const [seconds, setSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  // Settings modal
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTimer = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handlePrevProblem = () => {
    const currentIndex = ALL_SOLVE_PROBLEMS_LIST.findIndex(
      (p) => p.slug === currentProblem.slug
    );
    if (currentIndex > 0) {
      const prevSlug = ALL_SOLVE_PROBLEMS_LIST[currentIndex - 1].slug;
      if (onSelectProblem) onSelectProblem(prevSlug);
      else router.push(`/solve/${prevSlug}`);
    }
  };

  const handleNextProblem = () => {
    const currentIndex = ALL_SOLVE_PROBLEMS_LIST.findIndex(
      (p) => p.slug === currentProblem.slug
    );
    if (currentIndex >= 0 && currentIndex < ALL_SOLVE_PROBLEMS_LIST.length - 1) {
      const nextSlug = ALL_SOLVE_PROBLEMS_LIST[currentIndex + 1].slug;
      if (onSelectProblem) onSelectProblem(nextSlug);
      else router.push(`/solve/${nextSlug}`);
    }
  };

  const handleRandomProblem = () => {
    const others = ALL_SOLVE_PROBLEMS_LIST.filter(
      (p) => p.slug !== currentProblem.slug
    );
    if (others.length > 0) {
      const random = others[Math.floor(Math.random() * others.length)];
      if (onSelectProblem) onSelectProblem(random.slug);
      else router.push(`/solve/${random.slug}`);
    }
  };

  const filteredProblems = ALL_SOLVE_PROBLEMS_LIST.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <header className="h-12 bg-[#1a1a1a] border-b border-[#2e2e2e] text-neutral-200 px-3 flex items-center justify-between select-none z-40 relative">
      {/* Left side: Brand + Problem List + Navigation */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 group mr-1 text-white hover:opacity-90 transition-opacity"
          title="Back to crackDSA Dashboard"
        >
          {/* Logo mark matching LeetCode style */}
          <div className="w-7 h-7 rounded-md bg-gradient-to-tr from-amber-500 to-orange-400 flex items-center justify-center shadow-xs font-black text-black text-sm">
            C
          </div>
        </Link>

        {/* Problem List dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowProblemList(!showProblemList)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md hover:bg-[#2e2e2e] text-neutral-300 hover:text-white text-xs font-medium transition-colors"
          >
            <ListFilter size={14} className="text-neutral-400" />
            <span className="hidden sm:inline">Problem List</span>
          </button>

          {/* Dropdown Menu */}
          {showProblemList && (
            <div className="absolute top-full left-0 mt-1 w-72 sm:w-80 bg-[#262626] border border-[#383838] rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="p-2 border-b border-[#383838]">
                <div className="flex items-center gap-2 px-2 py-1.5 bg-[#1e1e1e] rounded-lg border border-[#383838]">
                  <Search size={14} className="text-neutral-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search problems..."
                    className="w-full bg-transparent text-xs text-white placeholder-neutral-500 focus:outline-none"
                    autoFocus
                  />
                </div>
              </div>

              <div className="max-h-64 overflow-y-auto divide-y divide-[#333333]">
                {filteredProblems.map((prob) => {
                  const isCurrent = prob.slug === currentProblem.slug;
                  return (
                    <button
                      key={prob.slug}
                      type="button"
                      onClick={() => {
                        setShowProblemList(false);
                        if (onSelectProblem) onSelectProblem(prob.slug);
                        else router.push(`/solve/${prob.slug}`);
                      }}
                      className={`w-full text-left px-3 py-2 flex items-center justify-between text-xs hover:bg-[#333333] transition-colors ${
                        isCurrent ? "bg-[#333333] text-amber-400 font-semibold" : "text-neutral-300"
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        {prob.solved ? (
                          <Check size={12} className="text-emerald-400 shrink-0" />
                        ) : (
                          <div className="w-3 h-3 rounded-full border border-neutral-600 shrink-0" />
                        )}
                        <span className="truncate">{prob.title}</span>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase shrink-0 ${
                          prob.difficulty === "Easy"
                            ? "text-emerald-400 bg-emerald-500/10"
                            : prob.difficulty === "Medium"
                            ? "text-amber-400 bg-amber-500/10"
                            : "text-rose-400 bg-rose-500/10"
                        }`}
                      >
                        {prob.difficulty}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Prev / Next / Shuffle */}
        <div className="flex items-center gap-0.5 text-neutral-400">
          <button
            type="button"
            onClick={handlePrevProblem}
            className="p-1.5 rounded-md hover:bg-[#2e2e2e] hover:text-white transition-colors"
            title="Previous Problem"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={handleNextProblem}
            className="p-1.5 rounded-md hover:bg-[#2e2e2e] hover:text-white transition-colors"
            title="Next Problem"
          >
            <ChevronRight size={16} />
          </button>
          <button
            type="button"
            onClick={handleRandomProblem}
            className="p-1.5 rounded-md hover:bg-[#2e2e2e] hover:text-white transition-colors ml-0.5"
            title="Pick Random Problem"
          >
            <Shuffle size={14} />
          </button>
        </div>
      </div>

      {/* Center: Run & Submit Buttons */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onRun}
          disabled={isRunning}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2e2e2e] hover:bg-[#383838] active:scale-95 text-neutral-200 hover:text-white text-xs font-semibold transition-all border border-[#3e3e3e]"
          title="Run Code (Ctrl + ')"
        >
          <Play
            size={12}
            className={`fill-neutral-300 text-neutral-300 ${isRunning ? "animate-spin" : ""}`}
          />
          <span className="hidden sm:inline">Run</span>
        </button>

        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-xs font-semibold transition-all shadow-xs shadow-emerald-900/30"
          title="Submit Solution"
        >
          <CloudUpload size={14} className={isSubmitting ? "animate-bounce" : ""} />
          <span>{isSubmitting ? "Submitting..." : "Submit"}</span>
        </button>

        {/* Debug & AI hints */}
        <button
          type="button"
          className="hidden md:flex p-1.5 rounded-md hover:bg-[#2e2e2e] text-neutral-400 hover:text-white transition-colors"
          title="Debugger"
        >
          <Bug size={14} />
        </button>
        <button
          type="button"
          className="hidden md:flex p-1.5 rounded-md hover:bg-[#2e2e2e] text-purple-400 hover:text-purple-300 transition-colors"
          title="crackDSA AI Tutor"
        >
          <Sparkles size={14} />
        </button>
      </div>

      {/* Right side: Layout, Settings, Streak, Timer, Profile */}
      <div className="flex items-center gap-1 sm:gap-2">
        <button
          type="button"
          className="hidden lg:flex p-1.5 rounded-md hover:bg-[#2e2e2e] text-neutral-400 hover:text-white transition-colors"
          title="Customize Layout"
        >
          <LayoutGrid size={15} />
        </button>

        <button
          type="button"
          onClick={() => setShowSettings(!showSettings)}
          className="p-1.5 rounded-md hover:bg-[#2e2e2e] text-neutral-400 hover:text-white transition-colors"
          title="Editor Settings"
        >
          <Settings size={15} />
        </button>

        <button
          type="button"
          className="hidden sm:flex p-1.5 rounded-md hover:bg-[#2e2e2e] text-neutral-400 hover:text-white transition-colors relative"
          title="Notifications"
        >
          <Bell size={15} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-amber-400 rounded-full" />
        </button>

        {/* Streak Counter */}
        <div
          className="hidden md:flex items-center gap-1 px-2 py-1 rounded-md bg-[#262626] text-amber-400 text-xs font-bold border border-[#383838]"
          title="Daily Streak"
        >
          <Flame size={14} className="fill-amber-400 text-amber-500" />
          <span>0</span>
        </div>

        {/* Timer / Stopwatch */}
        <div className="flex items-center gap-1 bg-[#262626] border border-[#383838] px-2 py-1 rounded-md text-xs font-mono text-neutral-300">
          <button
            type="button"
            onClick={() => setIsTimerRunning(!isTimerRunning)}
            className="hover:text-white"
            title={isTimerRunning ? "Pause Timer" : "Resume Timer"}
          >
            {isTimerRunning ? <Pause size={12} /> : <Play size={12} className="fill-current" />}
          </button>
          <span className="tracking-wider">{formatTimer(seconds)}</span>
          <button
            type="button"
            onClick={() => setSeconds(0)}
            className="hover:text-white ml-0.5 opacity-60 hover:opacity-100"
            title="Reset Timer"
          >
            <RotateCcw size={11} />
          </button>
        </div>

        {/* User avatar */}
        <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white text-[11px] font-bold shadow-xs">
          A
        </div>

        {/* Premium button */}
        <Link
          href="/pro"
          className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-md bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border border-amber-500/30 hover:border-amber-500/50 text-[11px] font-bold transition-all"
        >
          <Crown size={12} className="text-amber-400" />
          <span>Premium</span>
        </Link>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="absolute top-12 right-6 w-64 bg-[#262626] border border-[#383838] rounded-xl shadow-2xl p-3 z-50 text-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#383838] font-bold text-white">
            <span>Editor Settings</span>
            <button onClick={() => setShowSettings(false)} className="text-neutral-400 hover:text-white">✕</button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-neutral-400">Tab Size</span>
            <span className="bg-[#1e1e1e] px-2 py-0.5 rounded border border-[#383838] text-white">4 spaces</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-neutral-400">Font Size</span>
            <span className="bg-[#1e1e1e] px-2 py-0.5 rounded border border-[#383838] text-white">13px</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-neutral-400">Key Binding</span>
            <span className="bg-[#1e1e1e] px-2 py-0.5 rounded border border-[#383838] text-white">Standard</span>
          </div>
        </div>
      )}
    </header>
  );
};
