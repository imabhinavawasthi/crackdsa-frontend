"use client";

import React, { useState } from "react";
import { X, CheckCircle2 } from "lucide-react";
import { submitContestSuggestion } from "@/api/contests";

interface SuggestContestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function WhatsAppIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm0 18.15c-1.49 0-2.94-.4-4.21-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c.02 4.54-3.68 8.23-8.22 8.23zm4.52-6.16c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43s-.56-1.34-.76-1.84c-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.84-.86 2.05s.88 2.38 1 2.55c.12.17 1.74 2.65 4.21 3.72.59.25 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.07-.1-.23-.17-.48-.29z"/>
    </svg>
  );
}

export function SuggestContestModal({ isOpen, onClose }: SuggestContestModalProps) {
  const [platform, setPlatform] = useState("codeforces");
  const [contestName, setContestName] = useState("");
  const [contestUrl, setContestUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contestName.trim()) return;

    try {
      setSubmitting(true);

      const platformLabel = {
        codeforces: "Codeforces",
        leetcode: "LeetCode",
        codechef: "CodeChef",
        atcoder: "AtCoder",
        google: "Google Kick Start",
        icpc: "ICPC",
        other: "Other Platform",
      }[platform] || platform;

      const messageLines = [
        "👋 *Hey CrackDSA! I'd like to suggest a new contest editorial:*",
        "",
        `🏆 *Platform:* ${platformLabel}`,
        `📌 *Contest:* ${contestName.trim()}`,
      ];

      if (contestUrl.trim()) {
        messageLines.push(`🔗 *Link:* ${contestUrl.trim()}`);
      }
      if (notes.trim()) {
        messageLines.push(`📝 *Notes:* ${notes.trim()}`);
      }

      const whatsappText = encodeURIComponent(messageLines.join("\n"));
      const whatsappUrl = `https://wa.me/919956217210?text=${whatsappText}`;

      // 1. Submit to backend API asynchronously (records suggestion in DB)
      submitContestSuggestion({
        platform,
        contest_name: contestName.trim(),
        contest_url: contestUrl.trim() || undefined,
        notes: notes.trim() || undefined,
      }).catch((err) => console.error("Error saving suggestion:", err));

      // 2. Open WhatsApp with formatted payload
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");

      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setContestName("");
        setContestUrl("");
        setNotes("");
        onClose();
      }, 2000);
    } catch (err) {
      console.error(err);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 2000);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none">
      <div 
        className="relative w-full max-w-lg rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-2xl p-6 sm:p-7 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 mx-auto flex items-center justify-center">
              <CheckCircle2 size={28} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Contest Requested!</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
              WhatsApp opened with your request details. Our mentors will prepare video editorials and solutions soon!
            </p>
          </div>
        ) : (
          <>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 mb-2">
                <WhatsAppIcon className="size-3 text-emerald-600 dark:text-emerald-400" /> WhatsApp Request
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Suggest a Contest</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Can&apos;t find editorial solutions for a contest? Send details directly to our team via WhatsApp and we&apos;ll prioritize it!
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium">
              <div className="space-y-1.5">
                <label className="text-gray-700 dark:text-gray-300 font-semibold">Platform</label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value="codeforces">Codeforces</option>
                  <option value="leetcode">LeetCode</option>
                  <option value="codechef">CodeChef</option>
                  <option value="atcoder">AtCoder</option>
                  <option value="google">Google Kick Start</option>
                  <option value="icpc">ICPC</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-gray-700 dark:text-gray-300 font-semibold">Contest Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Codeforces Round 960 (Div. 2)"
                  value={contestName}
                  onChange={(e) => setContestName(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-gray-700 dark:text-gray-300 font-semibold">Contest URL (Optional)</label>
                <input
                  type="url"
                  placeholder="https://codeforces.com/contest/1990"
                  value={contestUrl}
                  onChange={(e) => setContestUrl(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-gray-700 dark:text-gray-300 font-semibold">Specific Problems or Notes (Optional)</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Need video explanation specifically for problem D and E"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !contestName.trim()}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 transition-all shadow-md shadow-emerald-600/20 cursor-pointer"
                >
                  <WhatsAppIcon className="size-4 shrink-0 fill-white" />
                  <span>{submitting ? "Opening WhatsApp..." : "Send via WhatsApp"}</span>
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
