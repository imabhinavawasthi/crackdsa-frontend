"use client";

import { useState, useEffect } from "react";
import {
  Target,
  CheckCircle2,
  Zap,
  Sparkles,
  Trophy,
  Brain,
  Layers,
  ChevronRight,
  Activity,
  Flame,
  ShieldCheck,
  Rocket,
} from "lucide-react";

export default function AnimatedRoadmapVisual() {
  const [activeNode, setActiveNode] = useState(2);

  // Auto-cycle through roadmap nodes
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveNode((prev) => (prev % 4) + 1);
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  const nodes = [
    {
      id: 1,
      title: "Arrays & Two Pointers",
      desc: "12 Core Pattern Blueprints",
      status: "Completed",
      count: "12/12 Solved",
      color: "emerald",
      icon: CheckCircle2,
      badge: "Mastered",
    },
    {
      id: 2,
      title: "Sliding Window & Binary Search",
      desc: "High-Frequency FAANG Questions",
      status: "In Progress",
      count: "8/10 Solved",
      color: "brand",
      icon: Zap,
      badge: "Active Module",
    },
    {
      id: 3,
      title: "Tree & Dynamic Programming",
      desc: "Advanced Pattern Formulations",
      status: "Up Next",
      count: "15 Patterns",
      color: "purple",
      icon: Layers,
      badge: "Upcoming",
    },
    {
      id: 4,
      title: "Amazon SDE-1 Interview",
      desc: "Final Milestone • 88% Match",
      status: "Final Target",
      count: "Interview Ready",
      color: "amber",
      icon: Trophy,
      badge: "Target Goal",
    },
  ];

  return (
    <div className="relative group select-none">
      {/* Multi-layered Soft Ambient Lighting */}
      <div className="absolute -inset-4 bg-gradient-to-tr from-brand-500/25 via-purple-500/15 to-emerald-500/20 rounded-3xl blur-3xl opacity-75 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      {/* Outer Card Container */}
      <div className="relative rounded-2xl border border-gray-200/80 dark:border-gray-800 bg-white/95 dark:bg-[#090D16]/95 backdrop-blur-xl shadow-2xl dark:shadow-[0_25px_60px_rgba(0,0,0,0.7)] overflow-hidden transition-all duration-300">
        
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

        {/* ── Top Header Bar ─────────────────────────────────────────── */}
        {/* <div className="relative z-10 px-5 py-4 bg-gray-50/80 dark:bg-[#0E1320]/80 backdrop-blur-md border-b border-gray-200/80 dark:border-gray-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-indigo-600 text-white shadow-md shadow-brand-500/25">
              <Rocket size={18} />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white dark:border-gray-900 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-bold text-gray-900 dark:text-white tracking-tight">
                  Your Personalised Roadmap
                </h3>
              </div>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium mt-0.5">
                Adapts to your solving speed &amp; target
              </p>
            </div>
          </div>
        </div> */}

        {/* ── Main Node Graph Content ─────────────────────────────────── */}
        <div className="relative z-10 p-6 space-y-4">
          
          {/* Vertical Connecting Line with Traveling Pulse */}
          <div className="absolute left-[39px] top-9 bottom-16 w-0.5 bg-gray-200 dark:bg-gray-800/80">
            {/* Progress Fill Line */}
            <div
              className="w-full bg-gradient-to-b from-emerald-500 via-brand-500 to-amber-500 transition-all duration-700 ease-out shadow-[0_0_8px_rgba(70,95,255,0.6)]"
              style={{
                height: `${((activeNode - 1) / 3) * 100}%`,
              }}
            />
          </div>

          {/* Nodes List */}
          <div className="space-y-3.5 relative">
            {nodes.map((node) => {
              const Icon = node.icon;
              const isActive = activeNode === node.id;
              const isPast = activeNode > node.id;

              return (
                <div
                  key={node.id}
                  onClick={() => setActiveNode(node.id)}
                  className={`group relative flex items-start gap-4 p-3.5 rounded-2xl border transition-all duration-300 cursor-pointer ${
                    isActive
                      ? "bg-gradient-to-r from-brand-50/90 via-white to-brand-50/50 dark:from-brand-500/15 dark:via-gray-900/90 dark:to-brand-500/5 border-brand-400/80 dark:border-brand-500/50 shadow-lg shadow-brand-500/10 dark:shadow-[0_8px_25px_rgba(70,95,255,0.15)] translate-x-1.5"
                      : isPast
                      ? "bg-gray-50/90 dark:bg-gray-900/60 border-gray-200/80 dark:border-gray-800/80 hover:border-gray-300 dark:hover:border-gray-700"
                      : "bg-gray-50/40 dark:bg-gray-900/30 border-gray-200/40 dark:border-gray-800/40 opacity-55 hover:opacity-85"
                  }`}
                >
                  {/* Node Circle Icon */}
                  <div
                    className={`relative z-10 w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ${
                      isActive
                        ? "bg-gradient-to-br from-brand-500 to-indigo-600 text-white shadow-md shadow-brand-500/30 ring-4 ring-brand-500/20 dark:ring-brand-500/15 scale-110"
                        : isPast
                        ? "bg-emerald-500 text-white shadow-xs"
                        : "bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-500"
                    }`}
                  >
                    <Icon size={15} />
                  </div>

                  {/* Node Main Details */}
                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="flex items-center justify-between gap-2">
                      <h4
                        className={`text-xs font-bold tracking-tight transition-colors ${
                          isActive
                            ? "text-brand-600 dark:text-brand-300"
                            : "text-gray-900 dark:text-white"
                        }`}
                      >
                        {node.title}
                      </h4>

                      <span
                        className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider transition-all ${
                          node.id === 4
                            ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30"
                            : isPast
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                            : isActive
                            ? "bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/30 animate-pulse"
                            : "bg-gray-200/80 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                        }`}
                      >
                        {node.badge}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                      <span>{node.desc}</span>
                      <span className="font-semibold text-gray-700 dark:text-gray-300 shrink-0 ml-2">{node.count}</span>
                    </div>

                    {/* Active Expanded Details */}
                    {isActive && (
                      <div className="mt-2.5 pt-2 border-t border-brand-200/60 dark:border-brand-500/20 flex items-center justify-between text-[10px] animate-fade-in">
                        <span className="text-brand-600 dark:text-brand-300 font-bold flex items-center gap-1">
                          <Activity size={11} className="animate-bounce" /> AI Velocity: 14 problems/week
                        </span>
                        <span className="text-gray-400 font-mono">Milestone {node.id} of 4</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Bottom Readiness Meter ─────────────────────────────────── */}
          <div className="mt-5 p-4 rounded-2xl bg-gray-50/90 dark:bg-[#0E1320]/90 border border-gray-200/80 dark:border-gray-800/80 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-emerald-500" />
                <span className="text-xs font-bold text-gray-800 dark:text-gray-200">Progress</span>
              </div>
              <span className="text-sm font-black text-brand-600 dark:text-brand-400 font-mono tracking-tight">
                {Math.round((activeNode / 4) * 100)}%
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden p-0.5">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 via-brand-500 to-indigo-500 rounded-full transition-all duration-700 ease-out shadow-xs"
                style={{ width: `${(activeNode / 4) * 100}%` }}
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
