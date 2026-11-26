"use client";

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Copy,
  Check,
  Terminal,
  Lightbulb,
  AlertTriangle,
  Info,
  AlertCircle,
} from "lucide-react";

interface ArticleMarkdownRendererProps {
  content: string;
}

// ─── Code Block Component with Copy & Terminal Output styling ────────────────
function CodeBlock({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode }) {
  const [copied, setCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || "");
  const lang = match ? match[1].toLowerCase() : "";
  const codeString = String(children || "").replace(/\n$/, "");

  const handleCopy = () => {
    navigator.clipboard.writeText(codeString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Special handling for Output / Terminal blocks
  if (lang === "output" || lang === "terminal" || lang === "console") {
    return (
      <div className="my-5 rounded-2xl overflow-hidden border border-gray-800 bg-[#121214] shadow-md">
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-4 py-2 bg-[#1c1c1f] border-b border-gray-800 select-none">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
            </div>
            <span className="text-[11px] font-mono font-bold tracking-wider text-gray-400 uppercase ml-2 flex items-center gap-1.5">
              <Terminal size={12} className="text-emerald-400" />
              Output
            </span>
          </div>
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1 text-[11px] font-medium text-gray-400 hover:text-white transition-colors"
            title="Copy Output"
          >
            {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>
        </div>
        {/* Output Text */}
        <pre className="p-4 font-mono text-[13px] leading-relaxed text-emerald-400 overflow-x-auto selection:bg-emerald-500/20">
          <code>{codeString}</code>
        </pre>
      </div>
    );
  }

  // Standard Syntax Code Box
  if (lang) {
    const displayLang =
      lang === "cpp"
        ? "C++"
        : lang === "javascript"
        ? "JavaScript"
        : lang === "typescript"
        ? "TypeScript"
        : lang === "python" || lang === "python3"
        ? "Python"
        : lang.charAt(0).toUpperCase() + lang.slice(1);

    return (
      <div className="my-5 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-[#18181b] shadow-md">
        {/* Code Header Bar */}
        <div className="flex items-center justify-between px-4 py-2 bg-[#202024] border-b border-gray-800 select-none">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-white/10 text-white font-mono text-[11px] font-bold">
              {displayLang}
            </span>
          </div>
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
            title="Copy Code"
          >
            {copied ? (
              <>
                <Check size={13} className="text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy size={13} />
                <span>Copy Code</span>
              </>
            )}
          </button>
        </div>

        {/* Code Content */}
        <pre className="p-4 font-mono text-[13px] leading-relaxed text-gray-100 overflow-x-auto custom-scrollbar">
          <code>{codeString}</code>
        </pre>
      </div>
    );
  }

  // Inline code snippet
  return (
    <code
      className="px-1.5 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-brand-600 dark:text-amber-400 font-mono text-[12.5px] font-semibold border border-gray-200/80 dark:border-gray-700/80"
      {...props}
    >
      {children}
    </code>
  );
}

// ─── Alert Callout Block (Blockquote with [!NOTE], [!TIP], [!WARNING]) ────────
function CalloutBlock({ children }: { children?: React.ReactNode }) {
  const textContent = React.Children.toArray(children)
    .map((c: any) => (typeof c === "string" ? c : c?.props?.children || ""))
    .join(" ");

  const isNote = textContent.includes("[!NOTE]");
  const isTip = textContent.includes("[!TIP]");
  const isWarning = textContent.includes("[!WARNING]");
  const isCaution = textContent.includes("[!CAUTION]") || textContent.includes("[!IMPORTANT]");

  if (isNote || isTip || isWarning || isCaution) {
    const badge = isTip
      ? "TIP"
      : isWarning
      ? "WARNING"
      : isCaution
      ? "IMPORTANT"
      : "NOTE";

    const style = isTip
      ? {
          bg: "bg-emerald-500/10 border-emerald-500/30 text-emerald-900 dark:text-emerald-200",
          iconBg: "text-emerald-500",
          icon: Lightbulb,
        }
      : isWarning
      ? {
          bg: "bg-amber-500/10 border-amber-500/30 text-amber-950 dark:text-amber-200",
          iconBg: "text-amber-500",
          icon: AlertTriangle,
        }
      : isCaution
      ? {
          bg: "bg-rose-500/10 border-rose-500/30 text-rose-950 dark:text-rose-200",
          iconBg: "text-rose-500",
          icon: AlertCircle,
        }
      : {
          bg: "bg-blue-500/10 border-blue-500/30 text-blue-950 dark:text-blue-200",
          iconBg: "text-blue-500",
          icon: Info,
        };

    const Icon = style.icon;

    return (
      <div className={`my-5 p-4 sm:p-5 rounded-2xl border ${style.bg} space-y-2`}>
        <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider">
          <Icon size={16} className={style.iconBg} />
          <span>{badge}</span>
        </div>
        <div className="text-xs sm:text-[13.5px] leading-relaxed font-normal opacity-95 pl-6 [&>p]:my-1">
          {children}
        </div>
      </div>
    );
  }

  // Standard blockquote
  return (
    <blockquote className="my-4 border-l-4 border-brand-500 pl-4 italic text-gray-600 dark:text-gray-400 text-sm">
      {children}
    </blockquote>
  );
}

// ─── Main Article Markdown Renderer ──────────────────────────────────────────
export default function ArticleMarkdownRenderer({ content }: ArticleMarkdownRendererProps) {
  if (!content) return null;

  // If content is pure HTML (contains `<p>` or `<div` or `<h2`), render HTML directly
  const isHtml = /<\/?(p|div|h[1-6]|ul|ol|table|pre|span)[^>]*>/i.test(content);

  if (isHtml) {
    return (
      <div
        className="problem-description prose prose-slate dark:prose-invert max-w-none text-[14.5px] leading-relaxed"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }

  return (
    <div className="article-content text-gray-800 dark:text-gray-200 leading-relaxed font-sans space-y-4">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code: CodeBlock as any,
          blockquote: CalloutBlock as any,
          h1: ({ children }) => (
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mt-8 mb-4 border-b border-gray-100 dark:border-gray-800 pb-2">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white tracking-tight mt-7 mb-3">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white tracking-tight mt-6 mb-2">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="text-[14.5px] sm:text-[15px] leading-7 text-gray-700 dark:text-gray-300 my-3">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-inside space-y-1.5 my-3 pl-2 text-[14.5px] text-gray-700 dark:text-gray-300">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside space-y-1.5 my-3 pl-2 text-[14.5px] text-gray-700 dark:text-gray-300">
              {children}
            </ol>
          ),
          table: ({ children }) => (
            <div className="my-6 overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-800 shadow-2xs">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-gray-100/80 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-800 font-bold text-gray-900 dark:text-white uppercase tracking-wider text-[11px]">
              {children}
            </thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60 bg-white dark:bg-gray-900/60 font-medium text-gray-700 dark:text-gray-300">
              {children}
            </tbody>
          ),
          tr: ({ children }) => (
            <tr className="hover:bg-gray-50/60 dark:hover:bg-gray-800/40 transition-colors">
              {children}
            </tr>
          ),
          th: ({ children }) => <th className="p-3.5 sm:p-4">{children}</th>,
          td: ({ children }) => <td className="p-3.5 sm:p-4">{children}</td>,
          hr: () => <hr className="my-8 border-gray-200 dark:border-gray-800" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
