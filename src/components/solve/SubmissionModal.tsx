"use client";

import React from "react";
import { CheckCircle2, Zap, Database, X, Sparkles, Award } from "lucide-react";

interface SubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: {
    status: "Accepted" | "Wrong Answer";
    runtime: string;
    beatsRuntime: string;
    memory: string;
    beatsMemory: string;
    testcasesPassed: string;
    language: string;
  };
}

export const SubmissionModal: React.FC<SubmissionModalProps> = ({
  isOpen,
  onClose,
  result,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#262626] border border-[#383838] rounded-2xl p-6 shadow-2xl relative text-neutral-200 space-y-5 animate-in zoom-in-95 duration-200">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg hover:bg-[#333333] text-neutral-400 hover:text-white transition-colors"
        >
          <X size={18} />
        </button>

        {/* Header Icon + Status */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shadow-lg shadow-emerald-950/40">
            <CheckCircle2 size={32} />
          </div>
          <h2 className="text-2xl font-black text-emerald-400 tracking-tight">
            {result.status}
          </h2>
          <p className="text-xs text-neutral-400">
            {result.testcasesPassed} testcases passed · Language:{" "}
            <span className="text-neutral-200 uppercase font-mono">
              {result.language}
            </span>
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          {/* Runtime */}
          <div className="p-3.5 bg-[#1e1e1e] rounded-xl border border-[#333333] space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-semibold">
              <Zap size={14} className="text-amber-400" />
              <span>Runtime</span>
            </div>
            <div className="text-lg font-bold text-white font-mono">
              {result.runtime}
            </div>
            <div className="text-[11px] text-emerald-400">
              Beats {result.beatsRuntime}
            </div>
          </div>

          {/* Memory */}
          <div className="p-3.5 bg-[#1e1e1e] rounded-xl border border-[#333333] space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-semibold">
              <Database size={14} className="text-blue-400" />
              <span>Memory</span>
            </div>
            <div className="text-lg font-bold text-white font-mono">
              {result.memory}
            </div>
            <div className="text-[11px] text-emerald-400">
              Beats {result.beatsMemory}
            </div>
          </div>
        </div>

        {/* Visual Percentile Bar */}
        <div className="space-y-1.5 pt-1">
          <div className="flex justify-between text-[11px] text-neutral-400">
            <span>Runtime Distribution</span>
            <span className="text-emerald-400 font-bold">Top 10%</span>
          </div>
          <div className="h-2 w-full bg-[#1b1b1b] rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 w-[91%]" />
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-white text-xs transition-colors shadow-lg shadow-emerald-900/40"
        >
          Continue Solving
        </button>
      </div>
    </div>
  );
};
