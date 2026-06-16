"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Info as InfoIcon, 
  AlertTriangle, 
  Lightbulb, 
  Copy, 
  Check, 
  ArrowRight, 
  ArrowLeft,
  ExternalLink,
  Zap
} from "lucide-react";

// Helper to parse inline styles: bold (**text**), inline code (`code`), and text
export const parseInlineStyles = (content: string): React.ReactNode[] => {
  if (!content) return [];
  // We want to parse **bold** and `code` tags.
  const parts = content.split(/(\*\*.*?\*\*|`.*?`)/g);
  return parts.map((part, idx) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={idx} className="font-extrabold text-gray-900 dark:text-white">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={idx} className="px-1.5 py-0.5 mx-0.5 rounded bg-gray-100 dark:bg-gray-800 text-[13px] font-mono text-brand-500 dark:text-brand-400 font-bold border border-gray-200 dark:border-gray-800/80">
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
};

// 1. Note Component
export const Note: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex gap-3 p-4 rounded-xl bg-blue-500/2 border-l-2 border-blue-500 text-gray-600 dark:text-gray-300 my-5 shadow-sm border border-gray-200 dark:border-gray-800/20">
    <span className="p-1 rounded-md bg-blue-500/10 text-blue-500 h-fit shrink-0">
      <InfoIcon size={12} />
    </span>
    <div className="text-sm sm:text-[14.5px] leading-relaxed font-medium text-gray-700 dark:text-gray-300">
      <strong className="text-blue-600 dark:text-blue-400 font-bold block mb-0.5">Key Note</strong>
      {typeof children === 'string' ? parseInlineStyles(children) : children}
    </div>
  </div>
);

// 2. Warning Component
export const Warning: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex gap-3 p-4 rounded-xl bg-amber-500/2 border-l-2 border-amber-500 text-gray-600 dark:text-gray-300 my-5 shadow-sm border border-gray-200 dark:border-gray-800/20">
    <span className="p-1 rounded-md bg-amber-500/10 text-amber-500 h-fit shrink-0">
      <AlertTriangle size={12} />
    </span>
    <div className="text-sm sm:text-[14.5px] leading-relaxed font-medium text-gray-700 dark:text-gray-300">
      <strong className="text-amber-600 dark:text-amber-500 font-bold block mb-0.5">Warning / Caution</strong>
      {typeof children === 'string' ? parseInlineStyles(children) : children}
    </div>
  </div>
);

// 3. Tip Component
export const Tip: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex gap-3 p-4 rounded-xl bg-amber-500/2 border-l-2 border-emerald-500 text-gray-600 dark:text-gray-300 my-5 shadow-sm border border-gray-200 dark:border-gray-800/20">
    <span className="p-1 rounded-md bg-emerald-500/10 text-emerald-500 h-fit shrink-0">
      <Lightbulb size={12} />
    </span>
    <div className="text-sm sm:text-[14.5px] leading-relaxed font-medium text-gray-700 dark:text-gray-300">
      <strong className="text-emerald-600 dark:text-emerald-400 font-bold block mb-0.5">Expert Tip</strong>
      {typeof children === 'string' ? parseInlineStyles(children) : children}
    </div>
  </div>
);

// 4. Info Component
export const Info: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex gap-3 p-4 rounded-xl bg-amber-500/2 border-l-2 border-indigo-500 text-gray-600 dark:text-gray-300 my-5 shadow-sm border border-gray-200 dark:border-gray-800/20">
    <span className="p-1 rounded-md bg-indigo-500/10 text-indigo-500 h-fit shrink-0">
      <InfoIcon size={12} />
    </span>
    <div className="text-sm sm:text-[14.5px] leading-relaxed font-medium text-gray-700 dark:text-gray-300">
      <strong className="text-indigo-600 dark:text-indigo-400 font-bold block mb-0.5">Deep Dive Info</strong>
      {typeof children === 'string' ? parseInlineStyles(children) : children}
    </div>
  </div>
);

// 5. CodeBlock Tabbed Component (C++, Java, Python)
interface CodeBlockProps {
  cpp: string;
  java: string;
  python: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ cpp, java, python }) => {
  const [activeTab, setActiveTab] = useState<"cpp" | "java" | "python">("cpp");
  const [copied, setCopied] = useState(false);

  const getActiveCode = () => {
    switch (activeTab) {
      case "cpp": return cpp;
      case "java": return java;
      case "python": return python;
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(getActiveCode());
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  return (
    <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950 my-6 shadow-inner">
      {/* Code Header Bar */}
      <div className="h-11 bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 flex items-center justify-between">
        <div className="flex gap-1.5 p-1 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          {(["cpp", "java", "python"] as const).map((lang) => (
            <button
              key={lang}
              onClick={() => setActiveTab(lang)}
              className={`px-3 py-1 rounded text-xs font-bold uppercase transition-all ${
                activeTab === lang
                  ? "bg-white dark:bg-gray-900 text-brand-500 dark:text-brand-400 shadow-sm border border-gray-200/50 dark:border-gray-700/50"
                  : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              }`}
            >
              {lang === "cpp" ? "C++" : lang === "java" ? "Java" : "Python"}
            </button>
          ))}
        </div>

        {/* Copy Button */}
        <button
          onClick={handleCopyCode}
          className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors uppercase"
          title="Copy Code"
        >
          {copied ? (
            <>
              <Check size={11} className="text-emerald-500" />
              <span className="text-emerald-500 font-extrabold">Copied</span>
            </>
          ) : (
            <>
              <Copy size={11} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Area */}
      <pre className="p-5 overflow-x-auto text-xs sm:text-[13.5px] font-mono text-gray-700 dark:text-gray-300 leading-relaxed custom-scrollbar max-h-87.5 bg-white dark:bg-gray-900/40">
        <code>{getActiveCode()}</code>
      </pre>
    </div>
  );
};

// 6. ComplexityTable Component
interface ComplexityTableProps {
  best?: string;
  average?: string;
  worst?: string;
  space?: string;
  description?: string;
}

export const ComplexityTable: React.FC<ComplexityTableProps> = ({
  best = "O(1)",
  average = "O(N)",
  worst = "O(N)",
  space = "O(1)",
  description
}) => (
  <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/20 overflow-hidden shadow-sm my-6">
    <table className="w-full text-sm font-bold text-left border-collapse">
      <thead>
        <tr className="bg-gray-50 dark:bg-gray-900 text-gray-400 uppercase text-[11px] tracking-widest border-b border-gray-200 dark:border-gray-800/80">
          <th className="px-5 py-3">Best Time</th>
          <th className="px-5 py-3">Average Time</th>
          <th className="px-5 py-3">Worst Time</th>
          <th className="px-5 py-3">Auxiliary Space</th>
        </tr>
      </thead>
      <tbody>
        <tr className="divide-x divide-gray-100 dark:divide-gray-800/40 text-gray-700 dark:text-gray-200">
          <td className="px-5 py-4 font-mono font-extrabold text-emerald-600 dark:text-emerald-400">
            {best}
          </td>
          <td className="px-5 py-4 font-mono font-extrabold text-brand-600 dark:text-brand-400">
            {average}
          </td>
          <td className="px-5 py-4 font-mono font-extrabold text-orange-600 dark:text-orange-400">
            {worst}
          </td>
          <td className="px-5 py-4 font-mono font-extrabold text-purple-600 dark:text-purple-400">
            {space}
          </td>
        </tr>
      </tbody>
    </table>
    {description && (
      <div className="p-4 bg-gray-50/30 dark:bg-gray-900/10 border-t border-gray-100 dark:border-gray-800/60 text-xs text-gray-400 font-medium italic">
        * {description}
      </div>
    )}
  </div>
);

// 7. PracticeProblems Component
interface Problem {
  name: string;
  difficulty: "Easy" | "Medium" | "Hard";
  url: string;
}

export const PracticeProblems: React.FC<{ problems: Problem[] }> = ({ problems }) => (
  <div className="space-y-3.5 my-6">
    <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center gap-1.5 mb-1.5">
      <Zap size={11} className="text-brand-500" />
      <span>Curated Practice Problems</span>
    </h4>
    
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {problems.map((prob, idx) => {
        const diffColor = 
          prob.difficulty === "Easy"
            ? "text-emerald-500 bg-emerald-500/10 border-emerald-500/10"
            : prob.difficulty === "Medium"
            ? "text-orange-500 bg-orange-500/10 border-orange-500/10"
            : "text-rose-500 bg-rose-500/10 border-rose-500/10";
            
        return (
          <a
            key={idx}
            href={prob.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-800/80 bg-white hover:bg-gray-50/50 dark:bg-gray-900/10 dark:hover:bg-gray-800/50 transition-all group shadow-sm hover:shadow"
          >
            <span className="text-sm font-bold text-gray-700 dark:text-gray-200 group-hover:text-brand-500 dark:group-hover:text-brand-400 transition-colors leading-tight">
              {prob.name}
            </span>
            <div className="flex items-center gap-2">
              <span className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${diffColor}`}>
                {prob.difficulty}
              </span>
              <ExternalLink size={10} className="text-gray-300 dark:text-gray-600 group-hover:text-brand-500 transition-colors" />
            </div>
          </a>
        );
      })}
    </div>
  </div>
);

// 8. InterviewTips Component
export const InterviewTips: React.FC<{ tips: string[] }> = ({ tips }) => (
  <div className="p-5 rounded-2xl bg-amber-500/3 border border-amber-500/20 text-gray-700 dark:text-gray-300 my-6 shadow-sm space-y-4">
    <div className="flex items-center gap-2 text-amber-600 dark:text-amber-500">
      <Lightbulb size={16} />
      <h4 className="text-sm font-bold uppercase tracking-wider">
        FAANG Interview Intelligence
      </h4>
    </div>
    
    <ul className="space-y-2.5 text-sm font-medium leading-relaxed pl-1.5 list-disc list-inside marker:text-amber-500">
      {tips.map((tip, idx) => (
        <li key={idx}>{parseInlineStyles(tip)}</li>
      ))}
    </ul>
  </div>
);

// 9. Previous / Next Nav Cards
interface NavCardProps {
  slug: string;
  title: string;
}

export const PreviousArticle: React.FC<NavCardProps> = ({ slug, title }) => (
  <Link
    href={slug}
    className="flex-1 flex items-center gap-4 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white hover:bg-gray-50/50 dark:bg-gray-900/10 dark:hover:bg-gray-800/50 transition-all text-left shadow-sm hover:shadow"
  >
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-500 group-hover:text-brand-500 transition-colors">
      <ArrowLeft size={14} />
    </div>
    <div className="space-y-0.5 select-none truncate">
      <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block">
        Previous Article
      </span>
      <span className="text-sm font-bold text-gray-700 dark:text-gray-200 truncate block">
        {title}
      </span>
    </div>
  </Link>
);

export const NextArticle: React.FC<NavCardProps> = ({ slug, title }) => (
  <Link
    href={slug}
    className="flex-1 flex items-center justify-between p-5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white hover:bg-gray-50/50 dark:bg-gray-900/10 dark:hover:bg-gray-800/50 transition-all text-right shadow-sm hover:shadow"
  >
    <div className="space-y-0.5 select-none text-left truncate flex-1 pr-4">
      <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block">
        Next Article
      </span>
      <span className="text-sm font-bold text-gray-700 dark:text-gray-200 truncate block">
        {title}
      </span>
    </div>
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-500 group-hover:text-brand-500 transition-colors">
      <ArrowRight size={14} />
    </div>
  </Link>
);

interface Block {
  type: "heading" | "ol" | "ul" | "paragraph" | "codeblock" | "empty";
  level?: number;
  items?: string[];
  content?: string;
}

export const CustomMarkdown: React.FC<{ text: string }> = ({ text }) => {
  if (!text) return null;

  const lines = text.split("\n");
  const blocks: Block[] = [];
  let currentBlock: Block | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed === "") {
      if (currentBlock) {
        blocks.push(currentBlock);
        currentBlock = null;
      }
      continue;
    }

    // 1. Heading check
    if (trimmed.startsWith("### ")) {
      if (currentBlock) {
        blocks.push(currentBlock);
        currentBlock = null;
      }
      blocks.push({
        type: "heading",
        level: 3,
        content: trimmed.substring(4)
      });
      continue;
    }
    if (trimmed.startsWith("## ")) {
      if (currentBlock) {
        blocks.push(currentBlock);
        currentBlock = null;
      }
      blocks.push({
        type: "heading",
        level: 2,
        content: trimmed.substring(3)
      });
      continue;
    }
    if (trimmed.startsWith("# ")) {
      if (currentBlock) {
        blocks.push(currentBlock);
        currentBlock = null;
      }
      blocks.push({
        type: "heading",
        level: 1,
        content: trimmed.substring(2)
      });
      continue;
    }

    // 2. Ordered List check: e.g. "1. " or "12. "
    const olMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
    if (olMatch) {
      const itemContent = olMatch[2];
      if (currentBlock && currentBlock.type !== "ol") {
        blocks.push(currentBlock);
        currentBlock = null;
      }
      if (!currentBlock) {
        currentBlock = { type: "ol", items: [itemContent] };
      } else {
        currentBlock.items?.push(itemContent);
      }
      continue;
    }

    // 3. Unordered List check: e.g. "- " or "* "
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      const itemContent = trimmed.substring(2);
      if (currentBlock && currentBlock.type !== "ul") {
        blocks.push(currentBlock);
        currentBlock = null;
      }
      if (!currentBlock) {
        currentBlock = { type: "ul", items: [itemContent] };
      } else {
        currentBlock.items?.push(itemContent);
      }
      continue;
    }

    // 4. Code block check (simple) or consecutive paragraph text
    if (currentBlock && currentBlock.type === "paragraph") {
      currentBlock.content += "\n" + trimmed;
    } else {
      if (currentBlock) {
        blocks.push(currentBlock);
      }
      currentBlock = { type: "paragraph", content: trimmed };
    }
  }

  if (currentBlock) {
    blocks.push(currentBlock);
  }

  // Inline styles are now parsed by the exported parseInlineStyles

  return (
    <div className="space-y-4">
      {blocks.map((block, idx) => {
        switch (block.type) {
          case "heading":
            if (block.level === 1) {
              return (
                <h1 key={idx} className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight pt-4">
                  {parseInlineStyles(block.content || "")}
                </h1>
              );
            }
            if (block.level === 2) {
              return (
                <h2 key={idx} className="text-base sm:text-lg font-bold text-gray-900 dark:text-white tracking-tight pt-3">
                  {parseInlineStyles(block.content || "")}
                </h2>
              );
            }
            return (
              <h3 key={idx} className="text-sm sm:text-base font-bold text-gray-900 dark:text-white uppercase tracking-wider border-l-2 border-brand-500 pl-2 pt-4">
                {parseInlineStyles(block.content || "")}
              </h3>
            );
          case "ol":
            return (
              <ol key={idx} className="list-decimal list-inside space-y-2 text-sm sm:text-[15px] text-gray-700 dark:text-gray-300 pl-2.5 font-medium leading-relaxed">
                {block.items?.map((item, itemIdx) => (
                  <li key={itemIdx} className="pl-1">
                    {parseInlineStyles(item)}
                  </li>
                ))}
              </ol>
            );
          case "ul":
            return (
              <ul key={idx} className="list-disc list-inside space-y-2 text-sm sm:text-[15px] text-gray-700 dark:text-gray-300 pl-2.5 font-medium leading-relaxed">
                {block.items?.map((item, itemIdx) => (
                  <li key={itemIdx} className="pl-1">
                    {parseInlineStyles(item)}
                  </li>
                ))}
              </ul>
            );
          case "paragraph":
            return (
              <p key={idx} className="text-sm sm:text-[15.5px] text-gray-700 dark:text-gray-300 font-normal leading-relaxed">
                {parseInlineStyles(block.content || "")}
              </p>
            );
          default:
            return null;
        }
      })}
    </div>
  );
};

