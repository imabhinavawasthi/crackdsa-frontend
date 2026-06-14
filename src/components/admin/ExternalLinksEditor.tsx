"use client";

import React, { useState } from "react";
import { Link as LinkIcon, Plus, Trash2, Globe } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type ExternalLink = {
  title: string;
  url: string;
};

interface ExternalLinksEditorProps {
  links: ExternalLink[];
  onChange: (links: ExternalLink[]) => void;
  label?: string;
  description?: string;
}

export default function ExternalLinksEditor({
  links,
  onChange,
  label = "External Links",
  description
}: ExternalLinksEditorProps) {
  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");

  const handleAdd = () => {
    if (!newTitle.trim() || !newUrl.trim()) return;
    onChange([...links, { title: newTitle.trim(), url: newUrl.trim() }]);
    setNewTitle("");
    setNewUrl("");
  };

  const handleRemove = (index: number) => {
    const newLinks = [...links];
    newLinks.splice(index, 1);
    onChange(newLinks);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-900 dark:text-gray-100">
          <LinkIcon size={14} className="text-gray-450" />
          {label}
        </label>
        {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
      </div>

      <div className="bg-gray-50/50 dark:bg-gray-900/40 border border-gray-200 dark:border-gray-800 rounded-xl p-4 space-y-4">
        {links.length > 0 ? (
          <div className="space-y-2">
            {links.map((link, idx) => (
              <div key={idx} className="flex items-center gap-3 bg-white dark:bg-gray-950 border border-gray-150 dark:border-gray-850 p-2.5 rounded-lg shadow-sm group">
                <div className="h-8 w-8 bg-brand-500/10 text-brand-500 flex items-center justify-center rounded-md shrink-0">
                  <Globe size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-gray-900 dark:text-white truncate">{link.title}</p>
                  <p className="text-[10px] text-gray-500 font-mono truncate">{link.url}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemove(idx)}
                  className="h-8 w-8 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md transition-colors"
                  title="Remove link"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-xs font-semibold text-gray-400">
            No external links attached yet.
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3 pt-2 border-t border-gray-200 dark:border-gray-800">
          <div className="flex-1 space-y-1.5">
            <Label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Link Title</Label>
            <Input 
              placeholder="e.g. Documentation" 
              value={newTitle} 
              onChange={(e) => setNewTitle(e.target.value)} 
              onKeyDown={handleKeyDown}
              className="h-9 bg-white dark:bg-gray-950" 
            />
          </div>
          <div className="flex-[2] space-y-1.5">
            <Label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">URL</Label>
            <Input 
              placeholder="https://..." 
              value={newUrl} 
              onChange={(e) => setNewUrl(e.target.value)} 
              onKeyDown={handleKeyDown}
              className="h-9 font-mono text-xs bg-white dark:bg-gray-950" 
            />
          </div>
          <button
            type="button"
            onClick={handleAdd}
            disabled={!newTitle.trim() || !newUrl.trim()}
            className="h-9 px-4 bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-white text-white dark:text-gray-900 rounded-lg text-xs font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shrink-0"
          >
            <Plus size={14} className="mr-1.5" />
            Add Link
          </button>
        </div>
      </div>
    </div>
  );
}
