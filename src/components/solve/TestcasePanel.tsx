"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  Terminal,
  Plus,
  Play,
  CloudUpload,
  Code2,
  HelpCircle,
  Clock,
  Zap,
  Check,
  XCircle,
} from "lucide-react";
import { TestCase, ProblemSolveData } from "./solveProblemsData";

interface TestcasePanelProps {
  problem: ProblemSolveData;
  activeTab: "testcase" | "result";
  onTabChange: (tab: "testcase" | "result") => void;
  testcases: TestCase[];
  onTestcasesChange: (cases: TestCase[]) => void;
  runResult: {
    status: "Accepted" | "Wrong Answer" | "Runtime Error";
    runtime: string;
    memory: string;
    beatsRuntime: string;
    beatsMemory: string;
    cases: Array<{
      id: string;
      input: string;
      output: string;
      expected: string;
      passed: boolean;
    }>;
  } | null;
  isRunning?: boolean;
}

export const TestcasePanel: React.FC<TestcasePanelProps> = ({
  problem,
  activeTab,
  onTabChange,
  testcases,
  onTestcasesChange,
  runResult,
  isRunning = false,
}) => {
  const [selectedCaseIdx, setSelectedCaseIdx] = useState(0);

  const activeCase = testcases[selectedCaseIdx] || testcases[0];

  const handleInputChange = (key: string, value: string) => {
    const updated = [...testcases];
    updated[selectedCaseIdx] = {
      ...updated[selectedCaseIdx],
      inputs: {
        ...updated[selectedCaseIdx].inputs,
        [key]: value,
      },
    };
    onTestcasesChange(updated);
  };

  const handleAddCase = () => {
    const newCaseNum = testcases.length + 1;
    const newCase: TestCase = {
      id: `case-${newCaseNum}`,
      name: `Case ${newCaseNum}`,
      inputs: { ...activeCase.inputs },
      expectedOutput: activeCase.expectedOutput,
    };
    onTestcasesChange([...testcases, newCase]);
    setSelectedCaseIdx(testcases.length);
  };

  return (
    <div className="h-full flex flex-col bg-[#262626] rounded-xl border border-[#333333] overflow-hidden text-neutral-200 shadow-xl">
      {/* Header Tabs */}
      <div className="h-10 bg-[#212121] border-b border-[#333333] flex items-center justify-between px-3 shrink-0 select-none">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onTabChange("testcase")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === "testcase"
                ? "bg-[#2e2e2e] text-emerald-400 shadow-2xs"
                : "text-neutral-400 hover:text-neutral-200 hover:bg-[#282828]"
            }`}
          >
            <CheckCircle2 size={13} />
            <span>Testcase</span>
          </button>

          <button
            type="button"
            onClick={() => onTabChange("result")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === "result"
                ? "bg-[#2e2e2e] text-white shadow-2xs"
                : "text-neutral-400 hover:text-neutral-200 hover:bg-[#282828]"
            }`}
          >
            <Terminal size={13} className="text-amber-400" />
            <span>Test Result</span>
          </button>
        </div>
      </div>

      {/* Panel Body */}
      <div className="flex-1 overflow-y-auto p-3.5 sm:p-4 custom-scrollbar text-xs">
        {activeTab === "testcase" ? (
          <div className="space-y-4">
            {/* Case Selector Pills */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              {testcases.map((c, idx) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedCaseIdx(idx)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    selectedCaseIdx === idx
                      ? "bg-[#333333] text-white border border-[#444444]"
                      : "bg-[#1f1f1f] text-neutral-400 hover:text-white border border-transparent"
                  }`}
                >
                  {c.name}
                </button>
              ))}

              <button
                type="button"
                onClick={handleAddCase}
                className="p-1 rounded-lg bg-[#1f1f1f] hover:bg-[#333333] text-neutral-400 hover:text-white transition-colors"
                title="Add Testcase"
              >
                <Plus size={14} />
              </button>
            </div>

            {/* Parameter Fields */}
            {activeCase && (
              <div className="space-y-3 pt-1">
                {Object.entries(activeCase.inputs).map(([paramName, paramVal]) => (
                  <div key={paramName} className="space-y-1">
                    <label className="text-[11px] font-mono text-neutral-400">
                      {paramName} =
                    </label>
                    <input
                      type="text"
                      value={paramVal}
                      onChange={(e) => handleInputChange(paramName, e.target.value)}
                      className="w-full bg-[#1b1b1b] border border-[#333333] focus:border-amber-500 rounded-lg px-3 py-2 text-neutral-100 font-mono text-xs focus:outline-none transition-colors"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Test Result View */
          <div>
            {isRunning ? (
              <div className="py-8 flex flex-col items-center justify-center space-y-2 text-neutral-400">
                <div className="w-5 h-5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                <span className="text-xs">Running test cases...</span>
              </div>
            ) : runResult ? (
              <div className="space-y-4">
                {/* Status + Metrics */}
                <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-[#333333]">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-base font-bold ${
                        runResult.status === "Accepted"
                          ? "text-emerald-400"
                          : "text-rose-400"
                      }`}
                    >
                      {runResult.status}
                    </span>
                    <span className="text-neutral-500">·</span>
                    <span className="text-neutral-400 font-mono text-xs">
                      Runtime: {runResult.runtime}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-[11px] text-neutral-400">
                    <span>Beats {runResult.beatsRuntime}</span>
                    <span>Memory: {runResult.memory}</span>
                  </div>
                </div>

                {/* Result Cases Tabs */}
                <div className="flex items-center gap-2">
                  {runResult.cases.map((c, idx) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setSelectedCaseIdx(idx)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold ${
                        selectedCaseIdx === idx
                          ? "bg-[#333333] text-white"
                          : "bg-[#1f1f1f] text-neutral-400"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          c.passed ? "bg-emerald-400" : "bg-rose-400"
                        }`}
                      />
                      <span>Case {idx + 1}</span>
                    </button>
                  ))}
                </div>

                {/* Case Details */}
                {runResult.cases[selectedCaseIdx] && (
                  <div className="space-y-2.5 bg-[#1f1f1f] p-3 rounded-lg border border-[#333333] font-mono text-xs">
                    <div>
                      <div className="text-[10px] uppercase font-bold text-neutral-500">
                        Input
                      </div>
                      <div className="text-neutral-200 mt-0.5">
                        {runResult.cases[selectedCaseIdx].input}
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] uppercase font-bold text-neutral-500">
                        Output
                      </div>
                      <div
                        className={`mt-0.5 ${
                          runResult.cases[selectedCaseIdx].passed
                            ? "text-emerald-400"
                            : "text-rose-400"
                        }`}
                      >
                        {runResult.cases[selectedCaseIdx].output}
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] uppercase font-bold text-neutral-500">
                        Expected
                      </div>
                      <div className="text-neutral-200 mt-0.5">
                        {runResult.cases[selectedCaseIdx].expected}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-8 text-center text-neutral-500 space-y-1">
                <Terminal size={24} className="mx-auto opacity-30" />
                <p>You must run your code first.</p>
                <p className="text-[11px] text-neutral-600">
                  Click &ldquo;Run&rdquo; above to evaluate with current testcases.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Bar: </> Source + Help */}
      <div className="h-8 bg-[#212121] border-t border-[#333333] px-3 flex items-center justify-between text-xs text-neutral-400 select-none shrink-0">
        <div className="flex items-center gap-1.5 hover:text-white cursor-pointer transition-colors">
          <Code2 size={12} />
          <span className="text-[11px] font-semibold">Source</span>
        </div>

        <button
          type="button"
          className="hover:text-white transition-colors"
          title="Testcase format help"
        >
          <HelpCircle size={13} />
        </button>
      </div>
    </div>
  );
};
