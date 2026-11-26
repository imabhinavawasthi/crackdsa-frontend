"use client";

import React, { useState, useEffect, useRef } from "react";
import { SolveNavbar } from "./SolveNavbar";
import { ProblemPanel } from "./ProblemPanel";
import { CodeEditorPanel } from "./CodeEditorPanel";
import { TestcasePanel } from "./TestcasePanel";
import { SubmissionModal } from "./SubmissionModal";
import {
  ProblemSolveData,
  TestCase,
  getProblemData,
} from "./solveProblemsData";

interface SolveWorkspaceProps {
  initialSlug: string;
}

export const SolveWorkspace: React.FC<SolveWorkspaceProps> = ({ initialSlug }) => {
  const [currentProblem, setCurrentProblem] = useState<ProblemSolveData>(() =>
    getProblemData(initialSlug)
  );

  const [language, setLanguage] = useState<
    "java" | "python3" | "cpp" | "javascript" | "typescript"
  >("java");

  const [code, setCode] = useState<string>(
    () => currentProblem.starterCode.java
  );

  const [leftTab, setLeftTab] = useState<
    "description" | "editorial" | "solutions" | "submissions"
  >("description");

  const [rightBottomTab, setRightBottomTab] = useState<"testcase" | "result">(
    "testcase"
  );

  const [testcases, setTestcases] = useState<TestCase[]>(
    () => currentProblem.testcases
  );

  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [runResult, setRunResult] = useState<any>(null);
  const [submissionModalOpen, setSubmissionModalOpen] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<any>(null);

  const [submissionsList, setSubmissionsList] = useState<any[]>([
    {
      id: "sub-1",
      status: "Accepted",
      runtime: "48 ms",
      memory: "44.6 MB",
      language: "java",
      timestamp: "10 mins ago",
    },
  ]);

  // Split pane resizing state
  const [leftWidthPercent, setLeftWidthPercent] = useState(48); // 48% left, 52% right
  const [editorHeightPercent, setEditorHeightPercent] = useState(62); // 62% editor, 38% testcases

  const isDraggingHRef = useRef(false);
  const isDraggingVRef = useRef(false);

  // Update state when slug changes
  useEffect(() => {
    const data = getProblemData(initialSlug);
    setCurrentProblem(data);
    setCode(data.starterCode[language] || data.starterCode.java);
    setTestcases(data.testcases);
  }, [initialSlug, language]);

  const handleLanguageChange = (
    newLang: "java" | "python3" | "cpp" | "javascript" | "typescript"
  ) => {
    setLanguage(newLang);
    setCode(currentProblem.starterCode[newLang] || "");
  };

  const handleRun = () => {
    setIsRunning(true);
    setRightBottomTab("result");

    setTimeout(() => {
      setIsRunning(false);
      setRunResult({
        status: "Accepted",
        runtime: "48 ms",
        beatsRuntime: "89.4%",
        memory: "44.6 MB",
        beatsMemory: "76.5%",
        cases: testcases.map((c) => ({
          id: c.id,
          input: Object.entries(c.inputs)
            .map(([k, v]) => `${k} = ${v}`)
            .join(", "),
          output: c.expectedOutput,
          expected: c.expectedOutput,
          passed: true,
        })),
      });
    }, 600);
  };

  const handleSubmit = () => {
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      const sub = {
        id: `sub-${Date.now()}`,
        status: "Accepted" as const,
        runtime: "42 ms",
        beatsRuntime: "92.1%",
        memory: "43.8 MB",
        beatsMemory: "81.0%",
        testcasesPassed: "57/57",
        language,
        timestamp: "Just now",
      };

      setSubmissionResult(sub);
      setSubmissionModalOpen(true);
      setSubmissionsList((prev) => [sub, ...prev]);
    }, 850);
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        if (e.shiftKey) {
          handleSubmit();
        } else {
          handleRun();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [code, testcases]);

  // Resizing mouse events
  const handleMouseDownH = () => {
    isDraggingHRef.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  };

  const handleMouseDownV = () => {
    isDraggingVRef.current = true;
    document.body.style.cursor = "row-resize";
    document.body.style.userSelect = "none";
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingHRef.current) {
        const newPercent = (e.clientX / window.innerWidth) * 100;
        if (newPercent > 20 && newPercent < 80) {
          setLeftWidthPercent(newPercent);
        }
      }
      if (isDraggingVRef.current) {
        const topOffset = 48; // navbar height
        const availableHeight = window.innerHeight - topOffset;
        const currentY = e.clientY - topOffset;
        const newPercent = (currentY / availableHeight) * 100;
        if (newPercent > 20 && newPercent < 85) {
          setEditorHeightPercent(newPercent);
        }
      }
    };

    const handleMouseUp = () => {
      if (isDraggingHRef.current || isDraggingVRef.current) {
        isDraggingHRef.current = false;
        isDraggingVRef.current = false;
        document.body.style.cursor = "default";
        document.body.style.userSelect = "auto";
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-[#1a1a1a] text-neutral-200">
      {/* Top Navbar */}
      <SolveNavbar
        currentProblem={currentProblem}
        onRun={handleRun}
        onSubmit={handleSubmit}
        isRunning={isRunning}
        isSubmitting={isSubmitting}
        onSelectProblem={(slug) => {
          const data = getProblemData(slug);
          setCurrentProblem(data);
          setCode(data.starterCode[language] || data.starterCode.java);
          setTestcases(data.testcases);
        }}
      />

      {/* Main Workspace: Left / Right Split */}
      <div className="flex-1 flex overflow-hidden p-2 gap-1.5 select-text">
        {/* Left Column: Problem Panel */}
        <div
          style={{ width: `${leftWidthPercent}%` }}
          className="h-full min-w-[280px] max-w-[80%] flex flex-col"
        >
          <ProblemPanel
            problem={currentProblem}
            activeTab={leftTab}
            onTabChange={setLeftTab}
            submissionsList={submissionsList}
          />
        </div>

        {/* Horizontal Divider Handle */}
        <div
          onMouseDown={handleMouseDownH}
          className="w-1.5 hover:w-2 hover:bg-neutral-600 bg-transparent cursor-col-resize flex items-center justify-center transition-all group shrink-0 rounded"
        >
          <div className="w-0.5 h-8 bg-neutral-600 group-hover:bg-amber-400 rounded-full" />
        </div>

        {/* Right Column: Code Editor + Testcase Panel */}
        <div
          style={{ width: `${100 - leftWidthPercent}%` }}
          className="h-full min-w-[320px] flex flex-col gap-1.5 overflow-hidden"
        >
          {/* Top: Code Editor */}
          <div
            style={{ height: `${editorHeightPercent}%` }}
            className="min-h-[160px] max-h-[85%]"
          >
            <CodeEditorPanel
              problem={currentProblem}
              language={language}
              onLanguageChange={handleLanguageChange}
              code={code}
              onCodeChange={setCode}
            />
          </div>

          {/* Vertical Divider Handle */}
          <div
            onMouseDown={handleMouseDownV}
            className="h-1.5 hover:h-2 hover:bg-neutral-600 bg-transparent cursor-row-resize flex items-center justify-center transition-all group shrink-0 rounded"
          >
            <div className="h-0.5 w-8 bg-neutral-600 group-hover:bg-amber-400 rounded-full" />
          </div>

          {/* Bottom: Testcase & Results */}
          <div
            style={{ height: `${100 - editorHeightPercent}%` }}
            className="min-h-[140px] flex-1 overflow-hidden"
          >
            <TestcasePanel
              problem={currentProblem}
              activeTab={rightBottomTab}
              onTabChange={setRightBottomTab}
              testcases={testcases}
              onTestcasesChange={setTestcases}
              runResult={runResult}
              isRunning={isRunning}
            />
          </div>
        </div>
      </div>

      {/* Submission Celebratory Modal */}
      {submissionResult && (
        <SubmissionModal
          isOpen={submissionModalOpen}
          onClose={() => setSubmissionModalOpen(false)}
          result={submissionResult}
        />
      )}
    </div>
  );
};
