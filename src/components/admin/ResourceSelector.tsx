"use client";

import { BACKEND_URL } from "@/config/api";
import React, { useState, useEffect } from "react";
import { getStoredToken } from "@/functions/auth";
import { Loader2, Search, Check, FileText, HelpCircle } from "lucide-react";

type ResourceType = "problems" | "articles";

interface ResourceSelectorProps {
  type: ResourceType;
  selectedSlugs: string[];
  onChange: (slugs: string[]) => void;
  label?: string;
  description?: string;
}

type ResourceItem = {
  id: string;
  title: string;
  slug?: string;
};

export default function ResourceSelector({
  type,
  selectedSlugs,
  onChange,
  label,
  description
}: ResourceSelectorProps) {
  const [items, setItems] = useState<ResourceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchItems = async () => {
      const token = getStoredToken();
      if (!token) return;

      const backendUrl = BACKEND_URL;
      const endpoint = type === "problems" 
        ? `${backendUrl}/api/v1/admin/practice-problems`
        : `${backendUrl}/api/v1/admin/articles`;

      try {
        setLoading(true);
        const res = await fetch(endpoint, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (!res.ok) throw new Error("Failed to load resources");

        const data = await res.json();
        // Fallback for different response formats (items array or directly array)
        const list = Array.isArray(data) ? data : (data.items || []);
        
        // Ensure slug is available, some endpoints might only return id (which is slug)
        const formattedList = list.map((item: any) => ({
          id: item.id || item.slug,
          title: item.title || item.name || item.id,
          slug: item.id || item.slug
        }));
        
        setItems(formattedList);
      } catch (err: unknown) {
        console.error(err);
        setError("Unable to load items");
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [type]);

  const toggleSelection = (slug: string) => {
    if (selectedSlugs.includes(slug)) {
      onChange(selectedSlugs.filter(s => s !== slug));
    } else {
      onChange([...selectedSlugs, slug]);
    }
  };

  const filteredItems = items.filter(item => 
    item.title.toLowerCase().includes(search.toLowerCase()) || 
    (item.slug && item.slug.toLowerCase().includes(search.toLowerCase()))
  );

  const Icon = type === "problems" ? HelpCircle : FileText;

  return (
    <div className="space-y-3">
      {label && (
        <div>
          <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-900 dark:text-gray-100">
            <Icon size={14} className="text-gray-450" />
            {label}
            <span className="ml-2 px-1.5 py-0.5 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 text-[10px] font-black">
              {selectedSlugs.length} SELECTED
            </span>
          </label>
          {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
        </div>
      )}

      <div className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden bg-white dark:bg-gray-900">
        <div className="flex items-center border-b border-gray-100 dark:border-gray-850 bg-gray-50/50 dark:bg-gray-900/50 px-3 py-2">
          <Search size={14} className="text-gray-400 mr-2 shrink-0" />
          <input 
            type="text" 
            placeholder={`Search ${type}...`}
            className="flex-1 bg-transparent border-none outline-none text-xs text-gray-900 dark:text-white placeholder:text-gray-400"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="max-h-48 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-850/60 custom-scrollbar">
          {loading ? (
            <div className="flex justify-center p-6">
              <Loader2 size={18} className="animate-spin text-brand-500" />
            </div>
          ) : error ? (
            <div className="p-4 text-xs text-red-500 font-semibold text-center">{error}</div>
          ) : filteredItems.length === 0 ? (
            <div className="p-4 text-xs text-gray-500 text-center font-medium">No items found matching your search.</div>
          ) : (
            filteredItems.map((item) => {
              const isSelected = selectedSlugs.includes(item.slug!);
              return (
                <div 
                  key={item.id}
                  onClick={() => toggleSelection(item.slug!)}
                  className={`flex items-start gap-3 p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${isSelected ? "bg-brand-50/30 dark:bg-brand-900/10" : ""}`}
                >
                  <div className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${isSelected ? "bg-brand-500 border-brand-500 text-white" : "border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950"}`}>
                    {isSelected && <Check size={10} strokeWidth={4} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-semibold truncate ${isSelected ? "text-brand-700 dark:text-brand-300" : "text-gray-700 dark:text-gray-200"}`}>
                      {item.title}
                    </p>
                    <p className="text-[10px] text-gray-400 font-mono truncate mt-0.5">
                      {item.slug}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
