"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Code2,
  ChevronDown,
  RotateCcw,
  Copy,
  Check,
  Bookmark,
  Maximize2,
  Minimize2,
  Lock,
  Braces,
} from "lucide-react";
import { ProblemSolveData } from "./solveProblemsData";

interface CodeEditorPanelProps {
  problem: ProblemSolveData;
  language: "java" | "python3" | "cpp" | "javascript" | "typescript";
  onLanguageChange: (lang: "java" | "python3" | "cpp" | "javascript" | "typescript") => void;
  code: string;
  onCodeChange: (newCode: string) => void;
}

export const CodeEditorPanel: React.FC<CodeEditorPanelProps> = ({
  problem,
  language,
  onLanguageChange,
  code,
  onCodeChange,
}) => {
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [cursorPos, setCursorPos] = useState({ line: 1, col: 1 });
  const [isSaved, setIsSaved] = useState(true);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);

  // Compute line count
  const lines = code.split("\n");
  const lineCount = lines.length;

  const handleCopyCode = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleResetCode = () => {
    const starter = problem.starterCode[language] || "";
    onCodeChange(starter);
  };

  const handleCursorMove = () => {
    if (!textareaRef.current) return;
    const { selectionStart } = textareaRef.current;
    const textBeforeCursor = code.substring(0, selectionStart);
    const cursorLines = textBeforeCursor.split("\n");
    const currentLine = cursorLines.length;
    const currentCol = cursorLines[cursorLines.length - 1].length + 1;
    setCursorPos({ line: currentLine, col: currentCol });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const spaces = "    "; // 4 spaces

      const newCode = code.substring(0, start) + spaces + code.substring(end);
      onCodeChange(newCode);

      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 4;
      }, 0);
    }
  };

  // Sync scrolling between textarea and line gutter
  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    if (gutterRef.current) {
      gutterRef.current.scrollTop = e.currentTarget.scrollTop;
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#1e1e1e] rounded-xl border border-[#333333] overflow-hidden text-neutral-200 shadow-xl">
      {/* Top Header Bar */}
      <div className="h-10 bg-[#262626] border-b border-[#333333] flex items-center justify-between px-3 shrink-0 select-none">
        {/* Left: </> Code tab + Language Selector */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#1e1e1e] text-emerald-400 text-xs font-semibold border border-[#383838]">
            <Code2 size={13} />
            <span>Code</span>
          </div>

          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#2e2e2e] hover:bg-[#383838] text-xs font-semibold text-neutral-200 border border-[#3e3e3e] transition-colors"
            >
              <span className="capitalize">
                {language === "python3" ? "Python3" : language === "cpp" ? "C++" : language}
              </span>
              <ChevronDown size={12} className="text-neutral-400" />
            </button>

            {showLangMenu && (
              <div className="absolute top-full left-0 mt-1 w-36 bg-[#262626] border border-[#383838] rounded-xl shadow-xl py-1 z-50 text-xs">
                {(["java", "python3", "cpp", "javascript", "typescript"] as const).map(
                  (lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => {
                        onLanguageChange(lang);
                        setShowLangMenu(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 hover:bg-[#333333] flex items-center justify-between capitalize ${
                        language === lang ? "text-amber-400 font-bold" : "text-neutral-300"
                      }`}
                    >
                      <span>
                        {lang === "python3" ? "Python3" : lang === "cpp" ? "C++" : lang}
                      </span>
                      {language === lang && <Check size={12} />}
                    </button>
                  )
                )}
              </div>
            )}
          </div>

          {/* Auto Format / Lock indicator */}
          <div className="hidden sm:flex items-center gap-1 text-[11px] text-neutral-500 pl-1">
            <Lock size={10} />
            <span>Auto</span>
          </div>
        </div>

        {/* Right Tools: Bookmark, Format, Reset, Copy */}
        <div className="flex items-center gap-1 text-neutral-400">
          <button
            type="button"
            onClick={handleCopyCode}
            className="p-1.5 hover:text-white hover:bg-[#333333] rounded transition-colors"
            title="Copy Code"
          >
            {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
          </button>

          <button
            type="button"
            onClick={() => setIsBookmarked(!isBookmarked)}
            className="p-1.5 hover:text-white hover:bg-[#333333] rounded transition-colors"
            title="Bookmark Problem"
          >
            <Bookmark size={13} className={isBookmarked ? "text-amber-400 fill-amber-400" : ""} />
          </button>

          <button
            type="button"
            className="p-1.5 hover:text-white hover:bg-[#333333] rounded transition-colors"
            title="Format Code"
          >
            <Braces size={13} />
          </button>

          <button
            type="button"
            onClick={handleResetCode}
            className="p-1.5 hover:text-white hover:bg-[#333333] rounded transition-colors"
            title="Reset to default starter code"
          >
            <RotateCcw size={13} />
          </button>

          <button
            type="button"
            className="p-1.5 hover:text-white hover:bg-[#333333] rounded transition-colors"
            title="Fullscreen Editor"
          >
            <Maximize2 size={13} />
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <div className="flex-1 relative flex overflow-hidden bg-[#1e1e1e]">
        {/* Line Numbers Gutter */}
        <div
          ref={gutterRef}
          className="w-11 py-3 text-right pr-3 select-none text-[12px] font-mono text-neutral-600 bg-[#1e1e1e] border-r border-[#2c2c2c] overflow-hidden shrink-0 space-y-0.5 leading-[20px]"
        >
          {Array.from({ length: Math.max(lineCount, 15) }).map((_, i) => (
            <div
              key={i}
              className={`${
                cursorPos.line === i + 1 ? "text-neutral-300 font-bold" : ""
              }`}
            >
              {i + 1}
            </div>
          ))}
        </div>

        {/* Code Input Area */}
        <div className="flex-1 relative overflow-hidden">
          <textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => {
              onCodeChange(e.target.value);
              setIsSaved(false);
              setTimeout(() => setIsSaved(true), 800);
            }}
            onKeyDown={handleKeyDown}
            onKeyUp={handleCursorMove}
            onClick={handleCursorMove}
            onScroll={handleScroll}
            spellCheck={false}
            className="w-full h-full p-3 font-mono text-[12.5px] leading-[20px] bg-transparent text-neutral-100 placeholder-neutral-600 resize-none focus:outline-none custom-scrollbar whitespace-pre tab-4"
            style={{ tabSize: 4 }}
          />
        </div>
      </div>

      {/* Bottom Status Bar */}
      <div className="h-6 bg-[#212121] border-t border-[#2e2e2e] px-3 flex items-center justify-between text-[11px] text-neutral-500 font-mono select-none shrink-0">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span className="text-neutral-400">Saved</span>
        </div>
        <div className="flex items-center gap-3">
          <span>
            Ln {cursorPos.line}, Col {cursorPos.col}
          </span>
        </div>
      </div>
    </div>
  );
};
