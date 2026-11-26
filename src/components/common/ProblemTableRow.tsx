import React from "react";
import Image from "next/image";
import { Check, Bookmark, ExternalLink, ChevronRight, Target, Flame, Sparkles } from "lucide-react";
import { formatTag } from "@/utils/string";

export interface ProblemTableRowProps {
  prob: any;
  isSolved: boolean;
  isBookmarked: boolean;
  status: "pending" | "done" | "revision" | string;
  isLoggedIn: boolean;
  onToggleSolved: (id: string, slug: string, e: React.MouseEvent) => void;
  onToggleBookmark: (id: string, slug: string, e: React.MouseEvent) => void;
  onOpenProblem: (slug: string) => void;
  hideTopics?: boolean;
}

export const getDifficultyConfig = (diff: "Easy" | "Medium" | "Hard" | string) => {
  switch (diff) {
    case "Easy": return { color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500/8 border-emerald-500/15", barColor: "bg-emerald-500", icon: <Target size={13} /> };
    case "Medium": return { color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-500/8 border-amber-500/15", barColor: "bg-amber-500", icon: <Flame size={13} /> };
    case "Hard": return { color: "text-rose-600 dark:text-rose-400", bg: "bg-rose-500/8 border-rose-500/15", barColor: "bg-rose-500", icon: <Sparkles size={13} /> };
    default: return { color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-500/8 border-amber-500/15", barColor: "bg-amber-500", icon: <Flame size={13} /> };
  }
};

export const ProblemTableRow: React.FC<ProblemTableRowProps> = ({
  prob,
  isSolved,
  isBookmarked,
  status,
  isLoggedIn,
  onToggleSolved,
  onToggleBookmark,
  onOpenProblem,
  hideTopics = false,
}) => {
  const getPlatformConfig = (platform: string) => {
    if (!platform) return "bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-800";
    const p = platform.toLowerCase();
    if (p.includes("leetcode")) {
      return "bg-gradient-to-r from-amber-500/10 to-orange-500/10 text-amber-600 dark:text-orange-400 border border-orange-500/15";
    }
    if (p.includes("geeksforgeeks") || p === "gfg") {
      return "bg-gradient-to-r from-emerald-500/10 to-teal-500/10 text-emerald-600 dark:text-teal-400 border border-teal-500/15";
    }
    if (p.includes("codeforces")) {
      return "bg-gradient-to-r from-blue-500/10 to-indigo-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/15";
    }
    if (p.includes("codechef")) {
      return "bg-gradient-to-r from-amber-700/10 to-yellow-600/10 text-amber-700 dark:text-amber-500 border border-amber-600/15";
    }
    return "bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-800";
  };

  const diffConfig = getDifficultyConfig(prob.difficulty);
  const platformClass = getPlatformConfig(prob.platform);

  // Check prob.problem_id if prob.id is not available (for dsa-sheet compat)
  const id = prob.id || prob.problem_id;
  const slug = prob.slug || prob.problem_id;

  const formattedTitle =
    prob.title ||
    (prob.problem_id
      ? prob.problem_id
          .split(/[-_]/)
          .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")
      : "Unknown Problem");

  const platformLower = (prob.platform || "").toLowerCase();
  const isLeetCode = platformLower.includes("leetcode") || !prob.platform || platformLower === "internal";
  const isCodeforces = platformLower.includes("codeforces") || platformLower === "cf";
  const isCodechef = platformLower.includes("codechef") || platformLower === "cc";
  const isGfg = platformLower.includes("geeksforgeeks") || platformLower === "gfg";

  const externalUrl = prob.problem_url || (isLeetCode ? `https://leetcode.com/problems/${slug}/` : null);

  const handleRowClick = () => {
    if (externalUrl) {
      window.open(externalUrl, "_blank", "noopener,noreferrer");
    } else {
      onOpenProblem(slug);
    }
  };

  return (
    <tr
      onClick={handleRowClick}
      className="group hover:bg-gray-50/45 dark:hover:bg-gray-900/30 cursor-pointer transition-all duration-200 border-l-2 border-l-transparent hover:border-l-brand-500"
    >
      <td className="py-3 px-2 sm:px-3 text-center w-14" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          onClick={(e) => isLoggedIn && onToggleSolved(id, slug, e)}
          disabled={!isLoggedIn}
          className={`focus:outline-none flex items-center justify-center mx-auto ${
            !isLoggedIn ? "opacity-50 cursor-not-allowed" : ""
          }`}
          title={
            !isLoggedIn
              ? "Log in to track progress"
              : status === "done"
              ? "Mark as unsolved"
              : status === "revision"
              ? "Revision required - click to mark as unsolved"
              : "Mark as solved"
          }
        >
          {status === "done" ? (
            <div className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500 text-white shadow-sm shadow-emerald-500/20 scale-100 transition-all hover:scale-110 active:scale-95">
              <Check size={11} strokeWidth={3.5} />
            </div>
          ) : status === "revision" ? (
            <div className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-500 text-white shadow-sm shadow-amber-500/20 scale-100 transition-all hover:scale-110 active:scale-95">
              <Check size={11} strokeWidth={3.5} />
            </div>
          ) : (
            <div className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-gray-300 dark:border-gray-700 text-transparent transition-all hover:border-emerald-500 hover:text-emerald-500 hover:bg-emerald-500/5 hover:scale-110 active:scale-95">
              <Check size={9} strokeWidth={3.5} />
            </div>
          )}
        </button>
      </td>
      <td className="py-3 px-1 sm:px-2 text-center w-10" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          onClick={(e) => isLoggedIn && onToggleBookmark(id, slug, e)}
          disabled={!isLoggedIn}
          className={`focus:outline-none flex items-center justify-center mx-auto ${
            !isLoggedIn ? "opacity-50 cursor-not-allowed" : ""
          }`}
          title={
            !isLoggedIn
              ? "Log in to bookmark problems"
              : isBookmarked
              ? "Remove bookmark"
              : "Bookmark problem"
          }
        >
          <Bookmark
            size={14}
            className={`transition-all ${
              !isLoggedIn
                ? "text-gray-300 dark:text-gray-700"
                : `hover:scale-125 active:scale-95 ${
                    isBookmarked
                      ? "text-amber-500 fill-amber-500"
                      : "text-gray-300 dark:text-gray-700 hover:text-amber-500/80"
                  }`
            }`}
          />
        </button>
      </td>
      <td className="py-3 px-3 sm:px-4 w-auto">
        <span
          className={`text-[13px] font-medium transition-colors ${
            isSolved
              ? "text-gray-400 dark:text-gray-500 font-normal italic animate-fade-in"
              : "text-gray-800 dark:text-gray-100 font-semibold group-hover:text-brand-500"
          }`}
        >
          {formattedTitle}
        </span>
      </td>
      <td className="py-3 px-2 sm:px-3 w-28 sm:w-32 text-center">
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[10px] font-bold tracking-wide border uppercase ${diffConfig.bg} ${diffConfig.color}`}
        >
          {diffConfig.icon}
          {prob.difficulty || "Medium"}
        </span>
      </td>
      <td className="py-3 px-2 sm:px-3 w-44 sm:w-48 text-center">
        {externalUrl ? (
          <a
            href={externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/20 hover:border-amber-500/40 transition-all shadow-2xs group/btn shrink-0"
            title={`Solve ${formattedTitle} on ${isLeetCode ? "LeetCode" : prob.platform || "Platform"}`}
          >
            {isLeetCode ? (
              <Image
                src="/logos/leetcode.png"
                alt="LeetCode"
                width={13}
                height={13}
                className="w-3.5 h-3.5 object-contain shrink-0"
              />
            ) : isCodeforces ? (
              <Image
                src="/logos/codeforces.svg"
                alt="Codeforces"
                width={13}
                height={13}
                className="w-3.5 h-3.5 object-contain shrink-0"
              />
            ) : isCodechef ? (
              <Image
                src="/logos/codechef.png"
                alt="CodeChef"
                width={13}
                height={13}
                className="w-3.5 h-3.5 object-contain shrink-0"
              />
            ) : (
              <ExternalLink size={12} className="shrink-0" />
            )}
            <span>{isLeetCode ? "Solve on LeetCode" : `Solve on ${isGfg ? "GFG" : prob.platform || "Platform"}`}</span>
            <ExternalLink size={10} className="opacity-60 group-hover/btn:opacity-100 transition-opacity shrink-0" />
          </a>
        ) : (
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider ${platformClass}`}
          >
            {prob.platform || "Internal"}
          </span>
        )}
      </td>
      {!hideTopics && (
        <td className="py-3 px-3 sm:px-5 w-32 sm:w-48 hidden md:table-cell">
          <div className="flex flex-wrap gap-1">
            {(prob.attributes?.tags || prob.attributes?.topicTags || [])
              .slice(0, 3)
              .map((t: string) => (
                <span
                  key={t}
                  className="px-2 py-0.5 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400 text-[10px] font-medium border border-gray-100 dark:border-gray-800/80"
                >
                  {formatTag(t)}
                </span>
              ))}
            {(prob.attributes?.tags || prob.attributes?.topicTags || []).length >
              3 && (
              <span className="text-[10px] text-gray-400 dark:text-gray-500 font-semibold pl-1 self-center">
                +
                {
                  (prob.attributes?.tags || prob.attributes?.topicTags || [])
                    .length - 3
                }
              </span>
            )}
          </div>
        </td>
      )}
      <td className="py-3 px-3 sm:px-4 text-right w-36 sm:w-44" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          onClick={() => onOpenProblem(slug)}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-gray-500 hover:text-brand-600 dark:text-gray-400 dark:hover:text-brand-400 hover:bg-gray-100 dark:hover:bg-gray-800/60 border border-transparent hover:border-gray-200 dark:hover:border-gray-700/60 transition-all group/notes shrink-0"
          title="View crackDSA Notes & Editorial"
        >
          <span>Notes / Editorial</span>
          <ChevronRight size={13} className="text-gray-400 dark:text-gray-500 group-hover/notes:text-brand-500 transform group-hover/notes:translate-x-0.5 transition-transform" />
        </button>
      </td>
    </tr>
  );
};
