"use client";

import React, { useState, useEffect } from "react";
import { Bookmark } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { fetchUserAssetStates, updateUserAssetState } from "@/api/user";

interface BookmarkButtonProps {
  assetId: string;
  assetType: "problem" | "video" | "article";
  onStateChange?: (state: { is_bookmarked: boolean }) => void;
  title?: string;
  disabledTitle?: string;
}

const BookmarkButton: React.FC<BookmarkButtonProps> = ({
  assetId,
  assetType,
  onStateChange,
  title,
  disabledTitle = "Log in to bookmark items",
}) => {
  const { isLoggedIn } = useAuth();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchState = async () => {
      if (!isLoggedIn || !assetId) {
        setIsBookmarked(false);
        return;
      }
      try {
        setLoading(true);
        const states = await fetchUserAssetStates();
        const current = states.find((s) => s.asset_id === assetId && s.asset_type === assetType);
        if (current) {
          setIsBookmarked(!!current.is_bookmarked);
        } else {
          setIsBookmarked(false);
        }
      } catch (err) {
        console.error("Failed to fetch bookmark state:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchState();
  }, [isLoggedIn, assetId, assetType]);

  const handleToggle = async () => {
    if (!isLoggedIn || !assetId || loading) return;
    const nextVal = !isBookmarked;
    try {
      setLoading(true);
      setIsBookmarked(nextVal); // Optimistic UI update
      if (onStateChange) {
        onStateChange({ is_bookmarked: nextVal });
      }
      const updated = await updateUserAssetState(assetType, assetId, { is_bookmarked: nextVal });
      setIsBookmarked(!!updated.is_bookmarked);
    } catch (err) {
      console.error("Failed to update bookmark state:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={!isLoggedIn || loading}
      title={!isLoggedIn ? disabledTitle : title || (isBookmarked ? "Remove Bookmark" : "Bookmark Item")}
      className={`p-2 h-10 w-10 rounded-2xl border transition-all duration-200 flex items-center justify-center ${
        !isLoggedIn
          ? "opacity-50 cursor-not-allowed bg-gray-5/50 dark:bg-gray-900/40 border-gray-200 dark:border-gray-800 text-gray-400"
          : loading
          ? "opacity-50 cursor-wait bg-gray-50/50 dark:bg-gray-900/40 border-gray-200 dark:border-gray-800 text-gray-400"
          : isBookmarked 
          ? "bg-amber-500/10 border-amber-500/20 text-amber-500 hover:bg-amber-500/20 shadow-sm scale-105 cursor-pointer"
          : "bg-gray-50/50 dark:bg-gray-900/40 border-gray-200 dark:border-gray-800 text-gray-400 hover:text-gray-655 dark:hover:text-gray-305 cursor-pointer"
      }`}
    >
      {loading ? (
        <div className="w-3.5 h-3.5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
      ) : (
        <Bookmark size={14} className={isBookmarked ? "fill-amber-500 text-amber-500" : ""} />
      )}
    </button>
  );
};

export default BookmarkButton;
