"use client";

import { useState, useEffect } from "react";
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  Brain,
  Zap,
  Target,
  ArrowRight,
  RefreshCw,
  Layers,
  AlertTriangle,
  Flame,
} from "lucide-react";

export default function StructuredLearningVisual() {
  const [mode, setMode] = useState<"structured" | "random">("structured");
  const [activeStep, setActiveStep] = useState(0);

  // Auto-cycle active step in structured mode
  useEffect(() => {
    if (mode !== "structured") return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, [mode]);

  return (
    <div className="relative group select-none">
      {/* Outer Ambient Glow */}
      <div className="absolute -inset-2 bg-gradient-to-r from-brand-500/20 via-indigo-500/15 to-emerald-500/20 rounded-3xl blur-2xl opacity-70 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Main Container */}
      <div className="relative rounded-2xl border border-gray-200/80 dark:border-gray-800 bg-white dark:bg-[#0E131F] shadow-2xl dark:shadow-[0_20px_50px_rgba(0,0,0,0.6)] overflow-hidden transition-all duration-300">
        
        {/* Header Switcher */}
        <div className="p-3 bg-gray-50 dark:bg-[#0B0F19] border-b border-gray-200/80 dark:border-gray-800/80 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-gray-200/60 dark:bg-gray-900 text-xs font-bold w-full sm:w-auto">
            <button
              onClick={() => setMode("structured")}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all ${
                mode === "structured"
                  ? "bg-white dark:bg-brand-600 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <Sparkles size={13} className={mode === "structured" ? "text-brand-500 dark:text-white" : ""} />
              <span>Pattern Structure</span>
              <span className="hidden sm:inline px-1.5 py-0.2 rounded text-[9px] font-black uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                CrackDSA
              </span>
            </button>

            <button
              onClick={() => setMode("random")}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all ${
                mode === "random"
                  ? "bg-red-500/10 dark:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/20 font-bold shadow-xs"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <AlertTriangle size={13} />
              <span>Random Grind</span>
            </button>
          </div>
        </div>

        {/* Dynamic Card Content */}
        <div className="p-6">
          
          {/* ── MODE 1: STRUCTURED LEARNING (CrackDSA Way) ─────────────────── */}
          {mode === "structured" && (
            <div className="space-y-6 animate-fade-in">
              {/* Highlight Metric */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-brand-500/10 via-brand-500/5 to-emerald-500/10 border border-brand-500/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center shadow-md shadow-brand-500/20 font-bold">
                    <Zap size={18} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-900 dark:text-white">Pattern-First Approach</div>
                    <div className="text-[11px] text-gray-500 dark:text-gray-400">Master 15 patterns instead of 500+ problems</div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-base sm:text-lg font-black text-brand-600 dark:text-brand-400">85% Faster</span>
                  <div className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Interview Ready</div>
                </div>
              </div>

              {/* Animated 3-Step Flow */}
              <div className="space-y-3">
                {[
                  {
                    title: "1. Spot Pattern in 30 Seconds",
                    desc: "Recognize problem type (Two Pointers, Sliding Window) immediately.",
                    icon: Brain,
                  },
                  {
                    title: "2. Solve 75 Essential Problems",
                    desc: "Target high-frequency interview questions without random fatigue.",
                    icon: Target,
                  },
                  {
                    title: "3. Confidently Solve Unseen Questions",
                    desc: "Apply learned pattern blueprints to new interview scenarios.",
                    icon: CheckCircle2,
                  },
                ].map((step, idx) => {
                  const Icon = step.icon;
                  const isActive = activeStep === idx;
                  return (
                    <div
                      key={idx}
                      onClick={() => setActiveStep(idx)}
                      className={`p-3.5 rounded-xl border transition-all duration-300 cursor-pointer ${
                        isActive
                          ? "bg-brand-50 dark:bg-brand-500/10 border-brand-300 dark:border-brand-500/40 shadow-sm translate-x-1"
                          : "bg-gray-50 dark:bg-gray-900/50 border-gray-200/70 dark:border-gray-800/80 opacity-75 hover:opacity-100"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                            isActive
                              ? "bg-brand-600 text-white shadow-xs"
                              : "bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                          }`}
                        >
                          <Icon size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className={`text-xs font-bold ${isActive ? "text-brand-600 dark:text-brand-300" : "text-gray-800 dark:text-gray-200"}`}>
                            {step.title}
                          </div>
                          <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 leading-snug">
                            {step.desc}
                          </div>
                        </div>
                        {isActive && (
                          <span className="w-2 h-2 rounded-full bg-brand-500 animate-ping mt-1.5" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Mini Pattern Mastery Meter */}
              <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-gray-900/60 border border-gray-200/60 dark:border-gray-800 space-y-2">
                <div className="flex justify-between text-[11px] font-bold">
                  <span className="text-gray-700 dark:text-gray-300">Pattern Retention Rate</span>
                  <span className="text-brand-600 dark:text-brand-400">92% High Retention</span>
                </div>
                <div className="w-full h-2 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-brand-600 to-emerald-500 rounded-full w-[92%] transition-all duration-1000" />
                </div>
              </div>
            </div>
          )}

          {/* ── MODE 2: RANDOM GRIND (The Old Way) ─────────────────────────── */}
          {mode === "random" && (
            <div className="space-y-5 animate-fade-in">
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-500 flex items-center justify-center shrink-0 font-bold">
                  <XCircle size={20} />
                </div>
                <div>
                  <div className="text-xs font-bold text-red-600 dark:text-red-400">Why Random Solving Fails</div>
                  <div className="text-[11px] text-gray-600 dark:text-gray-400">Solving 500+ random problems causes low retention and interview anxiety.</div>
                </div>
              </div>

              <div className="space-y-2.5">
                {[
                  { label: "500+ Disjointed LeetCode Problems", status: "High Burnout", icon: RefreshCw },
                  { label: "Memorizing Code Solutions", status: "0% Pattern Understanding", icon: AlertTriangle },
                  { label: "Panic on Unseen Interview Questions", status: "Failed Interviews", icon: XCircle },
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-gray-50 dark:bg-gray-900/40 border border-gray-200/60 dark:border-gray-800/80 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon size={15} className="text-red-500 shrink-0" />
                        <span className="font-semibold text-gray-700 dark:text-gray-300">{item.label}</span>
                      </div>
                      <span className="text-[10px] font-bold text-red-600 dark:text-red-400 px-2 py-0.5 rounded bg-red-500/10 border border-red-500/20">
                        {item.status}
                      </span>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() => setMode("structured")}
                className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md"
              >
                <span>Switch to Pattern-First Learning</span>
                <ArrowRight size={14} />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
