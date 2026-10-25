"use client";

import { BACKEND_URL } from "@/config/api";
import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Save, 
  Plus, 
  Trash2, 
  ChevronDown, 
  ChevronUp, 
  Video, 
  HelpCircle, 
  FileText, 
  BookOpen, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Unlock, 
  Lock, 
  Code, 
  MoveUp, 
  MoveDown,
  Layers,
  Sparkles,
  Edit2,
  X,
  ExternalLink
} from "lucide-react";
import { getStoredToken } from "@/functions/auth";

type CourseSectionItem = {
  id: string;
  title: string;
  type: "video" | "problem" | "article";
  asset_id: string;
  is_free: boolean;
  duration_label?: string | null;
  duration_seconds?: number | null;
};

type CourseSubsection = {
  id: string;
  title: string;
  description?: string | null;
  items: CourseSectionItem[];
};

type CourseSection = {
  id: string;
  title: string;
  description?: string | null;
  order?: number;
  items?: CourseSectionItem[] | null;
  subsections?: CourseSubsection[] | null;
};

interface CourseCurriculumBuilderProps {
  courseId: string;
  courseTitle: string;
  initialCurriculum?: CourseSection[];
}

export default function CourseCurriculumBuilder({
  courseId,
  courseTitle,
  initialCurriculum = []
}: CourseCurriculumBuilderProps) {
  const router = useRouter();
  const backendUrl = BACKEND_URL;

  const [sections, setSections] = useState<CourseSection[]>(initialCurriculum);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    initialCurriculum.forEach(s => { init[s.id] = true; });
    return init;
  });

  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  // Modal State for Adding / Editing Items
  const [itemModalOpen, setItemModalOpen] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  const [itemFormType, setItemFormType] = useState<"video" | "problem" | "article">("video");
  const [itemFormTitle, setItemFormTitle] = useState("");
  const [itemFormAssetId, setItemFormAssetId] = useState("");
  const [itemFormDuration, setItemFormDuration] = useState("");
  const [itemFormIsFree, setItemFormIsFree] = useState(false);

  // Available articles for quick picker
  const [availableArticles, setAvailableArticles] = useState<any[]>([]);
  const [loadingArticles, setLoadingArticles] = useState(false);

  React.useEffect(() => {
    if (itemModalOpen && itemFormType === "article" && availableArticles.length === 0) {
      setLoadingArticles(true);
      fetch(`${backendUrl}/api/v1/articles`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) setAvailableArticles(data);
          else if (data && Array.isArray(data.items)) setAvailableArticles(data.items);
        })
        .catch(() => {})
        .finally(() => setLoadingArticles(false));
    }
  }, [itemModalOpen, itemFormType, availableArticles.length, backendUrl]);

  // Modal State for Raw JSON
  const [jsonModalOpen, setJsonModalOpen] = useState(false);
  const [rawJsonText, setRawJsonText] = useState("");

  // Statistics calculation
  const stats = useMemo(() => {
    let videos = 0;
    let problems = 0;
    let articles = 0;
    let freeItems = 0;

    sections.forEach(sec => {
      (sec.items || []).forEach(itm => {
        if (itm.type === "video") videos++;
        else if (itm.type === "problem") problems++;
        else if (itm.type === "article") articles++;

        if (itm.is_free) freeItems++;
      });
      (sec.subsections || []).forEach(sub => {
        (sub.items || []).forEach(itm => {
          if (itm.type === "video") videos++;
          else if (itm.type === "problem") problems++;
          else if (itm.type === "article") articles++;

          if (itm.is_free) freeItems++;
        });
      });
    });

    return {
      totalSections: sections.length,
      videos,
      problems,
      articles,
      freeItems,
      totalItems: videos + problems + articles
    };
  }, [sections]);

  // Section Accordion Toggle
  const toggleSection = (secId: string) => {
    setExpandedSections(prev => ({ ...prev, [secId]: !prev[secId] }));
  };

  const expandAll = () => {
    const all: Record<string, boolean> = {};
    sections.forEach(s => { all[s.id] = true; });
    setExpandedSections(all);
  };

  const collapseAll = () => {
    setExpandedSections({});
  };

  // Section Operations
  const handleAddSection = () => {
    const newSec: CourseSection = {
      id: `sec-${Date.now()}`,
      title: `Module ${sections.length + 1}: New Topic`,
      description: "Comprehensive lessons and practice problems for this module.",
      order: sections.length + 1,
      items: []
    };
    setSections([...sections, newSec]);
    setExpandedSections(prev => ({ ...prev, [newSec.id]: true }));
    setIsDirty(true);
  };

  const handleUpdateSectionTitle = (secId: string, title: string) => {
    setSections(sections.map(s => s.id === secId ? { ...s, title } : s));
    setIsDirty(true);
  };

  const handleUpdateSectionDesc = (secId: string, description: string) => {
    setSections(sections.map(s => s.id === secId ? { ...s, description } : s));
    setIsDirty(true);
  };

  const handleDeleteSection = (secId: string, title: string) => {
    if (!confirm(`Are you sure you want to remove section "${title}" and all its contents?`)) return;
    setSections(sections.filter(s => s.id !== secId));
    setIsDirty(true);
  };

  const handleMoveSection = (idx: number, direction: "up" | "down") => {
    if (direction === "up" && idx === 0) return;
    if (direction === "down" && idx === sections.length - 1) return;

    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    const next = [...sections];
    const temp = next[idx];
    next[idx] = next[targetIdx];
    next[targetIdx] = temp;
    setSections(next);
    setIsDirty(true);
  };

  // Item Operations
  const openAddItemModal = (secId: string) => {
    setActiveSectionId(secId);
    setEditingItemId(null);
    setItemFormType("video");
    setItemFormTitle("");
    setItemFormAssetId("");
    setItemFormDuration("");
    setItemFormIsFree(false);
    setItemModalOpen(true);
  };

  const openEditItemModal = (secId: string, item: CourseSectionItem) => {
    setActiveSectionId(secId);
    setEditingItemId(item.id);
    setItemFormType(item.type);
    setItemFormTitle(item.title);
    setItemFormAssetId(item.asset_id || "");
    setItemFormDuration(item.duration_label || "");
    setItemFormIsFree(Boolean(item.is_free));
    setItemModalOpen(true);
  };

  const handleSaveItemModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSectionId || !itemFormTitle.trim()) return;

    const nextSections = sections.map(sec => {
      if (sec.id !== activeSectionId) return sec;

      const currentItems = sec.items || [];
      if (editingItemId) {
        // Edit existing item
        const updated = currentItems.map(itm => {
          if (itm.id !== editingItemId) return itm;
          return {
            ...itm,
            title: itemFormTitle.trim(),
            type: itemFormType,
            asset_id: itemFormAssetId.trim(),
            duration_label: itemFormDuration.trim() || null,
            is_free: itemFormIsFree
          };
        });
        return { ...sec, items: updated };
      } else {
        // Create new item
        const newItem: CourseSectionItem = {
          id: `item-${Date.now()}`,
          title: itemFormTitle.trim(),
          type: itemFormType,
          asset_id: itemFormAssetId.trim(),
          duration_label: itemFormDuration.trim() || null,
          is_free: itemFormIsFree
        };
        return { ...sec, items: [...currentItems, newItem] };
      }
    });

    setSections(nextSections);
    setIsDirty(true);
    setItemModalOpen(false);
  };

  const handleToggleItemFree = (secId: string, itemId: string) => {
    setSections(sections.map(sec => {
      if (sec.id !== secId) return sec;
      return {
        ...sec,
        items: (sec.items || []).map(itm => 
          itm.id === itemId ? { ...itm, is_free: !itm.is_free } : itm
        )
      };
    }));
    setIsDirty(true);
  };

  const handleDeleteItem = (secId: string, itemId: string) => {
    setSections(sections.map(sec => {
      if (sec.id !== secId) return sec;
      return {
        ...sec,
        items: (sec.items || []).filter(itm => itm.id !== itemId)
      };
    }));
    setIsDirty(true);
  };

  const handleMoveItem = (secId: string, itemIdx: number, direction: "up" | "down") => {
    setSections(sections.map(sec => {
      if (sec.id !== secId) return sec;
      const items = [...(sec.items || [])];
      if (direction === "up" && itemIdx === 0) return sec;
      if (direction === "down" && itemIdx === items.length - 1) return sec;

      const targetIdx = direction === "up" ? itemIdx - 1 : itemIdx + 1;
      const temp = items[itemIdx];
      items[itemIdx] = items[targetIdx];
      items[targetIdx] = temp;
      return { ...sec, items };
    }));
    setIsDirty(true);
  };

  // Raw JSON operations
  const openJsonModal = () => {
    setRawJsonText(JSON.stringify(sections, null, 2));
    setJsonModalOpen(true);
  };

  const handleApplyJson = () => {
    try {
      const parsed = JSON.parse(rawJsonText);
      if (!Array.isArray(parsed)) {
        throw new Error("Curriculum JSON must be an array of sections.");
      }
      setSections(parsed);
      setIsDirty(true);
      setJsonModalOpen(false);
    } catch (err: any) {
      alert(`Invalid JSON format: ${err.message}`);
    }
  };

  // Save Curriculum to Backend
  const handleSaveCurriculum = async () => {
    const token = getStoredToken();
    if (!token) {
      setErrorMsg("Authentication token not found. Please log in again.");
      return;
    }

    try {
      setSaving(true);
      setErrorMsg(null);
      setSuccessMsg(null);

      const res = await fetch(`${backendUrl}/api/v1/admin/courses/${courseId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ curriculum: sections })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || "Failed to update curriculum.");
      }

      setSuccessMsg("Curriculum syllabus saved and published successfully!");
      setIsDirty(false);
    } catch (err: any) {
      console.error("Error saving curriculum:", err);
      setErrorMsg(err.message || "Failed to save curriculum syllabus.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">

      {/* Stats Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4">
          <div className="text-[10px] font-black uppercase tracking-wider text-gray-400">Modules</div>
          <div className="text-xl font-black text-gray-900 dark:text-white mt-1">{stats.totalSections}</div>
        </div>
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4">
          <div className="text-[10px] font-black uppercase tracking-wider text-blue-500">Lectures (Videos)</div>
          <div className="text-xl font-black text-gray-900 dark:text-white mt-1">{stats.videos}</div>
        </div>
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4">
          <div className="text-[10px] font-black uppercase tracking-wider text-purple-500">Practice Problems</div>
          <div className="text-xl font-black text-gray-900 dark:text-white mt-1">{stats.problems}</div>
        </div>
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4">
          <div className="text-[10px] font-black uppercase tracking-wider text-amber-500">Articles / Notes</div>
          <div className="text-xl font-black text-gray-900 dark:text-white mt-1">{stats.articles}</div>
        </div>
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4">
          <div className="text-[10px] font-black uppercase tracking-wider text-emerald-500">Free Previews</div>
          <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{stats.freeItems}</div>
        </div>
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4">
          <div className="text-[10px] font-black uppercase tracking-wider text-gray-400">Total Assets</div>
          <div className="text-xl font-black text-gray-900 dark:text-white mt-1">{stats.totalItems}</div>
        </div>
      </div>

      {/* Notifications */}
      {errorMsg && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 p-4 rounded-2xl flex items-center gap-3">
          <AlertCircle size={20} className="shrink-0" />
          <span className="text-sm font-semibold">{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 p-4 rounded-2xl flex items-center gap-3">
          <CheckCircle2 size={20} className="shrink-0" />
          <span className="text-sm font-semibold">{successMsg}</span>
        </div>
      )}

      {/* Action Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleAddSection}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-sm transition-colors cursor-pointer"
          >
            <Plus size={15} />
            <span>Add Module / Section</span>
          </button>

          <button
            type="button"
            onClick={openJsonModal}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 font-bold text-xs hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
          >
            <Code size={14} />
            <span>Raw JSON Tree</span>
          </button>

          <button
            type="button"
            onClick={expandAll}
            className="px-2.5 py-2 text-xs font-semibold text-gray-500 hover:text-gray-900 dark:hover:text-white"
          >
            Expand All
          </button>
          <button
            type="button"
            onClick={collapseAll}
            className="px-2.5 py-2 text-xs font-semibold text-gray-500 hover:text-gray-900 dark:hover:text-white"
          >
            Collapse All
          </button>
        </div>

        <div className="flex items-center gap-3">
          {isDirty && (
            <span className="text-xs font-bold text-amber-500 animate-pulse flex items-center gap-1">
              <Sparkles size={13} /> Unsaved Changes
            </span>
          )}

          <button
            type="button"
            onClick={handleSaveCurriculum}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 font-bold text-xs shadow-sm transition-all disabled:opacity-50 cursor-pointer"
          >
            {saving ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                <span>Saving Curriculum...</span>
              </>
            ) : (
              <>
                <Save size={15} />
                <span>Save Curriculum</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Sections Tree */}
      {sections.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 border border-dashed border-gray-300 dark:border-gray-800 rounded-3xl p-12 text-center space-y-4">
          <BookOpen size={40} className="mx-auto text-gray-300 dark:text-gray-700" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Curriculum is Empty</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Get started by adding your first module to create lessons, practice problems, and free previews.
          </p>
          <button
            type="button"
            onClick={handleAddSection}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-500 text-white font-bold text-xs hover:bg-brand-600 transition-colors"
          >
            <Plus size={15} /> Add First Module
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {sections.map((section, secIdx) => {
            const isExpanded = Boolean(expandedSections[section.id]);
            const items = section.items || [];
            const lecturesCount = items.filter(i => i.type === "video").length;
            const problemsCount = items.filter(i => i.type === "problem").length;

            return (
              <div 
                key={section.id}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm transition-all"
              >
                {/* Section Header */}
                <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-gray-50/50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-800/80">
                  <div className="flex items-start sm:items-center gap-3 flex-grow">
                    <button
                      type="button"
                      onClick={() => toggleSection(section.id)}
                      className="p-1 rounded-md text-gray-400 hover:text-gray-700 dark:hover:text-white shrink-0 mt-0.5 sm:mt-0"
                    >
                      {isExpanded ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
                    </button>

                    <div className="space-y-1 flex-grow">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-wider text-brand-600 dark:text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded border border-brand-500/20">
                          Module {secIdx + 1}
                        </span>
                        <input
                          type="text"
                          value={section.title}
                          onChange={(e) => handleUpdateSectionTitle(section.id, e.target.value)}
                          className="font-bold text-sm sm:text-base text-gray-900 dark:text-white bg-transparent border-b border-transparent hover:border-gray-300 dark:hover:border-gray-700 focus:border-brand-500 focus:outline-none px-1 py-0.5 w-full max-w-md"
                          placeholder="Module Title..."
                        />
                      </div>
                      <input
                        type="text"
                        value={section.description || ""}
                        onChange={(e) => handleUpdateSectionDesc(section.id, e.target.value)}
                        className="text-xs text-gray-500 bg-transparent border-b border-transparent hover:border-gray-200 dark:hover:border-gray-800 focus:border-brand-500 focus:outline-none px-1 py-0.5 w-full"
                        placeholder="Optional module description..."
                      />
                    </div>
                  </div>

                  {/* Section Controls */}
                  <div className="flex items-center gap-1.5 self-end sm:self-center">
                    <span className="text-[11px] font-semibold text-gray-400 px-2">
                      {items.length} items ({lecturesCount} vids • {problemsCount} probs)
                    </span>

                    <button
                      type="button"
                      onClick={() => handleMoveSection(secIdx, "up")}
                      disabled={secIdx === 0}
                      className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-30"
                      title="Move Module Up"
                    >
                      <MoveUp size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveSection(secIdx, "down")}
                      disabled={secIdx === sections.length - 1}
                      className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-30"
                      title="Move Module Down"
                    >
                      <MoveDown size={13} />
                    </button>

                    <button
                      type="button"
                      onClick={() => openAddItemModal(section.id)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-brand-500/10 hover:bg-brand-500/20 text-brand-600 dark:text-brand-400 text-xs font-bold transition-colors ml-1"
                    >
                      <Plus size={13} /> Item
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteSection(section.id, section.title)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 transition-colors ml-1"
                      title="Delete Module"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Section Items Body */}
                {isExpanded && (
                  <div className="p-4 sm:p-5 space-y-2">
                    {items.length === 0 ? (
                      <div className="p-6 text-center border border-dashed border-gray-200 dark:border-gray-800 rounded-xl space-y-2">
                        <p className="text-xs text-gray-400">No items in this module yet.</p>
                        <button
                          type="button"
                          onClick={() => openAddItemModal(section.id)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs font-bold"
                        >
                          <Plus size={13} /> Add Video or Problem
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        {items.map((item, itemIdx) => {
                          const isVideo = item.type === "video";
                          const isProblem = item.type === "problem";

                          return (
                            <div
                              key={item.id}
                              className="flex items-center justify-between p-3 rounded-xl border border-gray-150 dark:border-gray-800/80 hover:border-gray-300 dark:hover:border-gray-700 bg-white dark:bg-gray-950 transition-all gap-3"
                            >
                              {/* Left Item Info */}
                              <div className="flex items-center gap-3 flex-grow min-w-0">
                                <div className="text-gray-300 dark:text-gray-700 text-xs font-mono font-bold w-4 text-center shrink-0">
                                  {itemIdx + 1}
                                </div>

                                <div className="shrink-0">
                                  {isVideo ? (
                                    <div className="h-7 w-7 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
                                      <Video size={14} />
                                    </div>
                                  ) : isProblem ? (
                                    <div className="h-7 w-7 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center">
                                      <HelpCircle size={14} />
                                    </div>
                                  ) : (
                                    <div className="h-7 w-7 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
                                      <FileText size={14} />
                                    </div>
                                  )}
                                </div>

                                <div className="min-w-0 flex-grow">
                                  <div className="font-bold text-xs sm:text-sm text-gray-900 dark:text-white truncate">
                                    {item.title}
                                  </div>
                                  <div className="flex items-center gap-2 text-[10px] text-gray-400 font-mono">
                                    <span>id: {item.asset_id || "none"}</span>
                                    {item.duration_label && (
                                      <span>• {item.duration_label}</span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Right: Free Preview Toggle & Action Buttons */}
                              <div className="flex items-center gap-2 shrink-0">
                                {/* Free Preview Switch Button */}
                                <button
                                  type="button"
                                  onClick={() => handleToggleItemFree(section.id, item.id)}
                                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black tracking-wider uppercase border transition-all cursor-pointer ${
                                    item.is_free
                                      ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/25"
                                      : "bg-gray-100 dark:bg-gray-800 text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700"
                                  }`}
                                  title="Click to toggle Free Preview access"
                                >
                                  {item.is_free ? (
                                    <>
                                      <Unlock size={11} className="text-emerald-500" />
                                      <span>Free Preview</span>
                                    </>
                                  ) : (
                                    <>
                                      <Lock size={11} className="text-gray-400" />
                                      <span>Pro Only</span>
                                    </>
                                  )}
                                </button>

                                {/* Move Item Buttons */}
                                <button
                                  type="button"
                                  onClick={() => handleMoveItem(section.id, itemIdx, "up")}
                                  disabled={itemIdx === 0}
                                  className="p-1 rounded text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-20"
                                  title="Move Up"
                                >
                                  <MoveUp size={12} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleMoveItem(section.id, itemIdx, "down")}
                                  disabled={itemIdx === items.length - 1}
                                  className="p-1 rounded text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-20"
                                  title="Move Down"
                                >
                                  <MoveDown size={12} />
                                </button>

                                {/* Edit Button */}
                                <button
                                  type="button"
                                  onClick={() => openEditItemModal(section.id, item)}
                                  className="p-1.5 rounded-lg text-gray-400 hover:text-brand-500 transition-colors"
                                  title="Edit Item Details"
                                >
                                  <Edit2 size={13} />
                                </button>

                                {/* Delete Button */}
                                <button
                                  type="button"
                                  onClick={() => handleDeleteItem(section.id, item.id)}
                                  className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 transition-colors"
                                  title="Delete Item"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Item Modal */}
      {itemModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
              <h3 className="font-bold text-base text-gray-900 dark:text-white">
                {editingItemId ? "Edit Curriculum Item" : "Add New Item to Module"}
              </h3>
              <button
                type="button"
                onClick={() => setItemModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-700 dark:hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveItemModal} className="space-y-4">
              <div>
                <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">Asset Type *</Label>
                <div className="grid grid-cols-3 gap-2 mt-1">
                  {(["video", "problem", "article"] as const).map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setItemFormType(type)}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold capitalize flex items-center justify-center gap-1.5 transition-all ${
                        itemFormType === type
                          ? "bg-brand-500 text-white border-brand-500 shadow-sm"
                          : "border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                      }`}
                    >
                      {type === "video" && <Video size={13} />}
                      {type === "problem" && <HelpCircle size={13} />}
                      {type === "article" && <FileText size={13} />}
                      <span>{type}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* If Article is selected, show Quick Picker from Library */}
              {itemFormType === "article" && (
                <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-bold text-purple-700 dark:text-purple-300 flex items-center gap-1.5">
                      <FileText size={13} />
                      <span>Select Article from Library</span>
                    </Label>
                    <a
                      href="/admin/articles/add"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-0.5"
                    >
                      <span>+ Create Article</span>
                      <ExternalLink size={9} />
                    </a>
                  </div>

                  {loadingArticles ? (
                    <div className="flex items-center gap-2 text-xs text-purple-500 py-1">
                      <Loader2 size={12} className="animate-spin" />
                      <span>Loading articles...</span>
                    </div>
                  ) : availableArticles.length > 0 ? (
                    <select
                      onChange={(e) => {
                        const selected = availableArticles.find(
                          (a) => a.id === e.target.value || a.slug === e.target.value
                        );
                        if (selected) {
                          setItemFormTitle(selected.title);
                          setItemFormAssetId(selected.slug || selected.id);
                          setItemFormDuration(`${selected.read_time_minutes || 5} min read`);
                        }
                      }}
                      className="w-full text-xs p-2 rounded-xl bg-white dark:bg-gray-800 border border-purple-300/80 dark:border-purple-800 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-purple-500 font-medium cursor-pointer"
                    >
                      <option value="">-- Choose an article to auto-fill --</option>
                      {availableArticles.map((art) => (
                        <option key={art.id} value={art.slug || art.id}>
                          {art.title} ({art.category} · {art.read_time_minutes || 5}m)
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="text-[11px] text-gray-500 dark:text-gray-400">
                      No published articles found yet. You can create one in the{" "}
                      <a href="/admin/articles/add" target="_blank" className="underline font-bold text-purple-500">
                        Articles Admin
                      </a>{" "}
                      or enter a custom slug below.
                    </div>
                  )}
                </div>
              )}

              <div>
                <Label htmlFor="itemTitle" className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Lecture / Problem Title *
                </Label>
                <Input
                  id="itemTitle"
                  value={itemFormTitle}
                  onChange={(e) => setItemFormTitle(e.target.value)}
                  placeholder="e.g. Asymptotic Analysis & Master Theorem"
                  className="mt-1 font-semibold"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="assetId" className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    Asset ID / Reference
                  </Label>
                  <Input
                    id="assetId"
                    value={itemFormAssetId}
                    onChange={(e) => setItemFormAssetId(e.target.value)}
                    placeholder="vid-uuid or problem-slug"
                    className="mt-1 text-xs font-mono"
                  />
                </div>

                <div>
                  <Label htmlFor="duration" className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    Duration Label
                  </Label>
                  <Input
                    id="duration"
                    value={itemFormDuration}
                    onChange={(e) => setItemFormDuration(e.target.value)}
                    placeholder="e.g. 24 mins"
                    className="mt-1 text-xs"
                  />
                </div>
              </div>

              <label className="flex items-start gap-3 p-3.5 rounded-xl border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={itemFormIsFree}
                  onChange={(e) => setItemFormIsFree(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                <div>
                  <div className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                    Free Preview Lecture
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 font-bold">FREE</span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Unauthenticated and guest users can watch this lecture without a Pro pass.
                  </p>
                </div>
              </label>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setItemModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-800 text-xs font-bold text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold shadow-sm transition-colors cursor-pointer"
                >
                  {editingItemId ? "Update Item" : "Add Item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Raw JSON Modal */}
      {jsonModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
              <h3 className="font-bold text-base text-gray-900 dark:text-white flex items-center gap-2">
                <Code size={18} className="text-brand-500" />
                Raw Curriculum JSON
              </h3>
              <button
                type="button"
                onClick={() => setJsonModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-700 dark:hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-gray-500">
              You can directly view, copy, or paste a structured curriculum array here.
            </p>

            <textarea
              rows={16}
              value={rawJsonText}
              onChange={(e) => setRawJsonText(e.target.value)}
              className="w-full font-mono text-xs p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 leading-relaxed"
            />

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
              <button
                type="button"
                onClick={() => setJsonModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-800 text-xs font-bold text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApplyJson}
                className="px-5 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold shadow-sm transition-colors cursor-pointer"
              >
                Apply Changes
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
