"use client";

import React, { useState } from "react";
import { 
  Code2, 
  Terminal, 
  FileText, 
  Columns, 
  Eye, 
  Edit3, 
  Sparkles, 
  Table, 
  AlertCircle, 
  Lightbulb, 
} from "lucide-react";
import ArticleMarkdownRenderer from "@/components/learning/ArticleMarkdownRenderer";
import RichTextEditor from "@/components/ui/editor/RichTextEditor";

interface ArticleMarkdownEditorProps {
  value: string;
  onChange: (val: string) => void;
}

export default function ArticleMarkdownEditor({
  value,
  onChange,
}: ArticleMarkdownEditorProps) {
  // Mode: "markdown" | "html"
  const [editorMode, setEditorMode] = useState<"markdown" | "html">("markdown");
  
  // View layout: "split" | "write" | "preview"
  const [viewLayout, setViewLayout] = useState<"split" | "write" | "preview">("split");

  // Helper to insert snippet at cursor or append
  const insertSnippet = (snippet: string) => {
    const textarea = document.getElementById("article-markdown-input") as HTMLTextAreaElement | null;
    if (!textarea) {
      onChange(value ? `${value}\n\n${snippet}` : snippet);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const before = value.substring(0, start);
    const after = value.substring(end);

    const newContent = `${before}${snippet}${after}`;
    onChange(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + snippet.length, start + snippet.length);
    }, 50);
  };

  return (
    <div className="space-y-4">
      {/* Top Bar: Switcher & Layout Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-gray-50 dark:bg-gray-900/60 p-2.5 rounded-2xl border border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-1.5 bg-gray-200/60 dark:bg-gray-800 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setEditorMode("markdown")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              editorMode === "markdown"
                ? "bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-xs"
                : "text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
            }`}
          >
            <Sparkles size={13} className="text-brand-500" />
            <span>Markdown Editor</span>
          </button>
          <button
            type="button"
            onClick={() => setEditorMode("html")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              editorMode === "html"
                ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-xs"
                : "text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
            }`}
          >
            <FileText size={13} />
            <span>Classic HTML Editor</span>
          </button>
        </div>

        {editorMode === "markdown" && (
          <div className="flex items-center gap-2">
            {/* View layout switches */}
            <div className="flex items-center bg-gray-200/60 dark:bg-gray-800 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setViewLayout("write")}
                className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewLayout === "write"
                    ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-xs"
                    : "text-gray-500 hover:text-gray-800 dark:hover:text-gray-300"
                }`}
                title="Write only"
              >
                <Edit3 size={14} />
              </button>
              <button
                type="button"
                onClick={() => setViewLayout("split")}
                className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewLayout === "split"
                    ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-xs"
                    : "text-gray-500 hover:text-gray-800 dark:hover:text-gray-300"
                }`}
                title="Split screen preview"
              >
                <Columns size={14} />
              </button>
              <button
                type="button"
                onClick={() => setViewLayout("preview")}
                className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewLayout === "preview"
                    ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-xs"
                    : "text-gray-500 hover:text-gray-800 dark:hover:text-gray-300"
                }`}
                title="Full preview"
              >
                <Eye size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {editorMode === "html" ? (
        <RichTextEditor value={value} onChange={onChange} />
      ) : (
        <div className="space-y-2">
          {/* Quick Insert Snippet Ribbon */}
          <div className="flex flex-wrap items-center gap-1.5 pb-1 select-none">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mr-1">Insert:</span>

            <button
              type="button"
              onClick={() => insertSnippet("\n```java\n// Your code here\npublic class Solution {\n    public static void main(String[] args) {\n        // ...\n    }\n}\n```\n")}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Code2 size={13} className="text-blue-500" />
              <span>+ Code Block</span>
            </button>

            <button
              type="button"
              onClick={() => insertSnippet("\n```output\nOutput Line 1\nOutput Line 2\n```\n")}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Terminal size={13} className="text-emerald-500" />
              <span>+ Terminal Output</span>
            </button>

            <button
              type="button"
              onClick={() => insertSnippet("\n> [!NOTE]\n> Write your informational note or background detail here.\n")}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <AlertCircle size={13} className="text-blue-500" />
              <span>+ Note Alert</span>
            </button>

            <button
              type="button"
              onClick={() => insertSnippet("\n> [!TIP]\n> Write an optimization or pro tip here.\n")}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Lightbulb size={13} className="text-amber-500" />
              <span>+ Tip Alert</span>
            </button>

            <button
              type="button"
              onClick={() => insertSnippet("\n| Iteration | Variable `i` | Condition | Action |\n| :---: | :---: | :---: | :--- |\n| **1st** | `1` | `true` | Loop body executed |\n| **2nd** | `2` | `false` | Loop terminates |\n")}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Table size={13} className="text-purple-500" />
              <span>+ Step Table</span>
            </button>
          </div>

          {/* Main Work Area */}
          <div className={`grid gap-4 ${viewLayout === "split" ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"}`}>
            {/* Editor Textarea */}
            {(viewLayout === "write" || viewLayout === "split") && (
              <div className="flex flex-col">
                <div className="flex items-center justify-between px-3 py-1.5 bg-gray-100 dark:bg-gray-800/80 rounded-t-xl border border-b-0 border-gray-250 dark:border-gray-800 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  <span>Markdown Raw Editor</span>
                  <span>{value ? `${value.length} characters` : "Empty"}</span>
                </div>
                <textarea
                  id="article-markdown-input"
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  placeholder={`Draft your article in Markdown...\n\nUse \`\`\`java for code, \`\`\`output for terminal outputs, and > [!NOTE] or > [!TIP] for callouts!`}
                  rows={20}
                  className="w-full p-4 font-mono text-sm leading-relaxed rounded-b-xl border border-gray-250 dark:border-gray-800 bg-white dark:bg-[#0f1115] text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all resize-y"
                />
              </div>
            )}

            {/* Live Preview */}
            {(viewLayout === "preview" || viewLayout === "split") && (
              <div className="flex flex-col">
                <div className="flex items-center justify-between px-3 py-1.5 bg-gray-100 dark:bg-gray-800/80 rounded-t-xl border border-b-0 border-gray-250 dark:border-gray-800 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center gap-1.5">
                    <Eye size={12} className="text-primary-500" />
                    <span>Live Preview</span>
                  </div>
                  <span className="text-[10px] text-emerald-500 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full">Interactive</span>
                </div>
                <div className="p-6 rounded-b-xl border border-gray-250 dark:border-gray-800 bg-white dark:bg-[#0d0e12] max-h-[550px] overflow-y-auto">
                  {value?.trim() ? (
                    <ArticleMarkdownRenderer content={value} />
                  ) : (
                    <div className="h-64 flex flex-col items-center justify-center text-gray-400 text-center p-6">
                      <Sparkles size={28} className="text-gray-300 dark:text-gray-700 mb-2" />
                      <p className="text-xs font-semibold">Your formatted tutorial will preview here in real time.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
