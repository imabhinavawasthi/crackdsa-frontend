"use client";

import React, { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { fetchUserAssetStates, updateUserAssetState } from "@/api/user";

interface StatusSelectorProps {
  assetId: string;
  assetType: "problem" | "video" | "article";
  onStateChange?: (state: { status: "pending" | "done" | "revision" }) => void;
  title?: string;
  disabledTitle?: string;
}

const StatusSelector: React.FC<StatusSelectorProps> = ({
  assetId,
  assetType,
  onStateChange,
  title,
  disabledTitle = "Log in to track progress",
}) => {
  const { isLoggedIn } = useAuth();
  const [status, setStatus] = useState<"pending" | "done" | "revision">("pending");
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchState = async () => {
      if (!isLoggedIn || !assetId) {
        setStatus("pending");
        return;
      }
      try {
        setLoading(true);
        const states = await fetchUserAssetStates();
        const current = states.find((s) => s.asset_id === assetId && s.asset_type === assetType);
        if (current) {
          setStatus(current.status || "pending");
        } else {
          setStatus("pending");
        }
      } catch (err) {
        console.error("Failed to fetch status:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchState();
  }, [isLoggedIn, assetId, assetType]);

  const handleStatusChange = async (newStatus: "pending" | "done" | "revision") => {
    if (!isLoggedIn || !assetId || loading) return;
    try {
      setLoading(true);
      setStatus(newStatus); // Optimistic UI update
      if (onStateChange) {
        onStateChange({ status: newStatus });
      }
      const updated = await updateUserAssetState(assetType, assetId, { status: newStatus });
      setStatus(updated.status || "pending");
    } catch (err) {
      console.error("Failed to update status:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => {
          if (isLoggedIn && !loading) {
            setStatusDropdownOpen(!statusDropdownOpen);
          }
        }}
        disabled={!isLoggedIn || loading}
        title={!isLoggedIn ? disabledTitle : title || "Update status"}
        className={`h-10 px-4.5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/40 text-[10px] font-semibold uppercase tracking-wider transition-all shadow-sm flex items-center gap-2.5 duration-200 ${
          !isLoggedIn 
            ? "opacity-50 cursor-not-allowed text-gray-400" 
            : loading
            ? "opacity-70 cursor-wait text-gray-405"
            : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer"
        }`}
      >
        {loading ? (
          <div className="w-3 h-3 border-2 border-brand-500 border-t-transparent rounded-full animate-spin shrink-0" />
        ) : (
          <span className={`w-2 h-2 rounded-full shrink-0 ${
            status === "done" ? "bg-emerald-500 animate-pulse" :
            status === "revision" ? "bg-amber-500 animate-pulse" : "bg-gray-400 dark:bg-gray-500"
          }`} />
        )}
        <span>Status: {loading ? "Loading..." : status}</span>
        <ChevronDown size={12} className={`text-gray-400 transition-transform duration-200 ${statusDropdownOpen ? "rotate-180" : ""}`} />
      </button>

      {isLoggedIn && statusDropdownOpen && !loading && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setStatusDropdownOpen(false)} />
          <div className="absolute right-0 mt-2 w-36 rounded-2xl border border-gray-200 dark:border-gray-855 bg-white dark:bg-gray-950 shadow-xl p-1.5 z-20 space-y-1 animate-in fade-in slide-in-from-top-2 duration-150">
            {([
              { id: "pending", label: "Pending", colorClass: "text-gray-500 dark:text-gray-400 hover:bg-gray-55 dark:hover:bg-gray-900/60" },
              { id: "revision", label: "Revision", colorClass: "text-amber-500 hover:bg-amber-500/10" },
              { id: "done", label: "Done", colorClass: "text-emerald-500 hover:bg-emerald-500/10" }
            ] as const).map((opt) => (
              <button
                key={opt.id}
                onClick={() => {
                  handleStatusChange(opt.id);
                  setStatusDropdownOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-xl text-[10px] font-semibold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${opt.colorClass} ${
                  status === opt.id ? "bg-gray-100 dark:bg-gray-900" : ""
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${
                  opt.id === "done" ? "bg-emerald-500" :
                  opt.id === "revision" ? "bg-amber-500" : "bg-gray-400"
                }`} />
                {opt.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default StatusSelector;
