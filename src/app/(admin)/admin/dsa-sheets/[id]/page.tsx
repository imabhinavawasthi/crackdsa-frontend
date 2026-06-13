"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Save, Activity, ExternalLink } from "lucide-react";
import Link from "next/link";
import { updateSheet, fetchSheetDetail } from "@/api/sheets";
import SheetJSONEditor from "@/components/admin/SheetJSONEditor";
import { DSASheet, SheetJSON } from "@/types/dsa-sheet";

export default function EditSheetPage() {
  const router = useRouter();
  const params = useParams();
  const sheetId = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState<Partial<DSASheet>>({
    title: "",
    description: "",
    level: "intermediate",
    estimated_hours: 0,
    tags: [],
    is_public: true,
    sheet_json: { topics: [] }
  });

  const [tagsInput, setTagsInput] = useState("");

  useEffect(() => {
    if (!sheetId) return;
    const loadData = async () => {
      try {
        setLoading(true);
        // Need to use an admin fetch detail ideally, but fetchSheetDetail works for active sheets. 
        // If inactive, it might fail unless we made fetchSheetDetail pass admin token.
        // For now we'll just use the generic detail fetch since we are the admin.
        const data = await fetchSheetDetail(sheetId);
        setFormData({
          title: data.title,
          description: data.description || "",
          level: data.level || "intermediate",
          estimated_hours: data.estimated_hours || 0,
          is_public: data.is_public !== false,
          sheet_json: data.sheet_json || { topics: [] }
        });
        setTagsInput(data.tags ? data.tags.join(", ") : "");
      } catch (err: any) {
        alert("Failed to load sheet details");
        router.push("/admin/dsa-sheets");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [sheetId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) {
      alert("Title is required.");
      return;
    }
    
    // Process tags
    const processedTags = tagsInput.split(",").map(t => t.trim()).filter(Boolean);
    const finalData = { ...formData, tags: processedTags };

    try {
      setSaving(true);
      await updateSheet(sheetId, finalData);
      alert("Sheet updated successfully!");
      router.push("/admin/dsa-sheets");
    } catch (err: any) {
      alert(err.message || "Failed to update sheet");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Activity size={32} className="animate-spin text-brand-500" />
        <p className="text-gray-500">Loading sheet details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/dsa-sheets" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
          <ArrowLeft size={20} className="text-gray-600 dark:text-gray-400" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Sheet</h1>
            <Link
              href={`/dsa-sheet/${sheetId}`}
              target="_blank"
              className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs font-semibold rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              View Public <ExternalLink size={12} />
            </Link>
          </div>
          <p className="text-sm text-gray-500">Editing <span className="font-mono">{sheetId}</span></p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 space-y-5">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-3">Basic Information</h2>
          
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Title *</label>
            <input
              required
              type="text"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Level</label>
              <select
                value={formData.level}
                onChange={e => setFormData({ ...formData, level: e.target.value as any })}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Est. Hours</label>
              <input
                type="number"
                value={formData.estimated_hours || ''}
                onChange={e => setFormData({ ...formData, estimated_hours: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Visibility</label>
              <select
                value={formData.is_public ? "public" : "private"}
                onChange={e => setFormData({ ...formData, is_public: e.target.value === "public" })}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all"
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tags (Comma separated)</label>
            <input
              type="text"
              value={tagsInput}
              onChange={e => setTagsInput(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all"
            />
          </div>
        </div>

        {/* JSON Schema Builder */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 space-y-5">
          <div className="border-b border-gray-100 dark:border-gray-800 pb-3">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Sheet Content</h2>
            <p className="text-xs text-gray-500 mt-1">Modify the topic structure and attach problems.</p>
          </div>
          
          <SheetJSONEditor 
            value={formData.sheet_json as SheetJSON} 
            onChange={newJson => setFormData({ ...formData, sheet_json: newJson })} 
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <Link
            href="/admin/dsa-sheets"
            className="px-6 py-2.5 rounded-xl font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl font-semibold text-white bg-brand-600 hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {saving ? <Activity size={18} className="animate-spin" /> : <Save size={18} />}
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
