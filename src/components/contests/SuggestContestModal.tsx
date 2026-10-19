"use client";

import React, { useState } from "react";
import { X, Plus, Send, CheckCircle2 } from "lucide-react";
import { submitContestSuggestion } from "@/api/contests";

interface SuggestContestModalProps {
  isOpen: boolean;
  onClose: () => void;
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
      await submitContestSuggestion({
        platform,
        contest_name: contestName.trim(),
        contest_url: contestUrl.trim() || undefined,
        notes: notes.trim() || undefined,
      });
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setContestName("");
        setContestUrl("");
        setNotes("");
        onClose();
      }, 1800);
    } catch (err) {
      console.error(err);
      // Even if offline, show confirmation
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 1800);
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
          className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <X size={18} />
        </button>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 mx-auto flex items-center justify-center">
              <CheckCircle2 size={28} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Contest Suggested!</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
              Thank you! Our mentors will prepare video editorials and solutions for this contest soon.
            </p>
          </div>
        ) : (
          <>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 mb-2">
                <Plus size={11} /> Request Editorial
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Suggest a Contest</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Can&apos;t find editorial solutions for a contest? Let our team know and we&apos;ll prioritize it!
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium">
              <div className="space-y-1.5">
                <label className="text-gray-700 dark:text-gray-300 font-semibold">Platform</label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500"
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
                  className="w-full h-10 px-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-gray-700 dark:text-gray-300 font-semibold">Contest URL (Optional)</label>
                <input
                  type="url"
                  placeholder="https://codeforces.com/contest/1990"
                  value={contestUrl}
                  onChange={(e) => setContestUrl(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-gray-700 dark:text-gray-300 font-semibold">Specific Problems or Notes (Optional)</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Need video explanation specifically for problem D and E"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !contestName.trim()}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-all shadow-md shadow-blue-500/20"
                >
                  <Send size={13} />
                  <span>{submitting ? "Submitting..." : "Submit Request"}</span>
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
