"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getStoredToken } from "@/functions/auth";
import Button from "@/components/ui/button/Button";
import { 
  Lock, 
  ArrowLeft, 
  Plus, 
  Video, 
  HelpCircle,
  FileText,
  Link as LinkIcon,
  Loader2,
  Sparkles,
  Trash2,
  Code as CodeIcon,
  Tag
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import RichTextEditor from "@/components/ui/editor/RichTextEditor";

type CustomResourceRow = {
  key: string;
  value: string;
};

export default function AddVideoLecturePage() {
  const { user, isLoading: authLoading, isLoggedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    document.title = "Add Video Lecture | CrackDSA";
  }, []);

  // Primary form inputs state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [durationSec, setDurationSec] = useState<number>(0);
  const [thumbnailUrl, setThumbnailUrl] = useState("");

  // Primary resource inputs state
  const [problemsStr, setProblemsStr] = useState("");
  const [blogsStr, setBlogsStr] = useState("");
  const [assignmentsStr, setAssignmentsStr] = useState("");

  // Dynamic Custom Resource Key-Value pairs
  const [customResources, setCustomResources] = useState<CustomResourceRow[]>([]);

  // Attributes / Metadata state
  const [tagsStr, setTagsStr] = useState("");
  const [customJsonStr, setCustomJsonStr] = useState("{\n  \"cohort\": \"dsa-bootcamp-2026\"\n}");
  const [isJsonValid, setIsJsonValid] = useState(true);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";


  // Validate JSON string on change
  useEffect(() => {
    if (!customJsonStr.trim()) {
      setIsJsonValid(true);
      return;
    }
    try {
      JSON.parse(customJsonStr);
      setIsJsonValid(true);
    } catch {
      setIsJsonValid(false);
    }
  }, [customJsonStr]);


  // Handle adding custom resource row
  const addCustomResourceRow = () => {
    setCustomResources([...customResources, { key: "", value: "" }]);
  };

  // Handle removing custom resource row
  const removeCustomResourceRow = (index: number) => {
    setCustomResources(customResources.filter((_, i) => i !== index));
  };

  // Handle changing custom resource row
  const handleCustomResourceChange = (index: number, field: "key" | "value", val: string) => {
    const updated = [...customResources];
    updated[index][field] = val;
    setCustomResources(updated);
  };

  // Handle Save submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getStoredToken();
    if (!token) return;

    if (!title.trim() || !videoUrl.trim()) {
      setSubmitError("Title and Video Stream URL are required fields.");
      return;
    }

    if (!isJsonValid) {
      setSubmitError("Please correct the invalid Custom JSON Attributes syntax before saving.");
      return;
    }

    // 1. Build initial resources payload with the 3 main lists
    const problems = problemsStr.split(",").map(s => s.trim()).filter(Boolean);
    const blogs = blogsStr.split(",").map(s => s.trim()).filter(Boolean);
    const assignments = assignmentsStr.split(",").map(s => s.trim()).filter(Boolean);

    const resourcesPayload: Record<string, string[]> = {
      problems,
      blogs,
      assignments
    };

    // 2. Append all dynamic custom resource pairs
    customResources.forEach((row) => {
      const cleanKey = row.key.trim();
      if (cleanKey) {
        // Parse comma-separated custom values as array of clean strings
        const valArray = row.value.split(",").map(s => s.trim()).filter(Boolean);
        resourcesPayload[cleanKey] = valArray;
      }
    });

    // 3. Build attributes payload: combine tags and parsed custom JSON metadata
    let parsedAttributes: Record<string, unknown> = {};
    if (customJsonStr.trim()) {
      try {
        parsedAttributes = JSON.parse(customJsonStr);
      } catch {
        setSubmitError("Invalid JSON structure detected in Custom Attributes.");
        return;
      }
    }

    // Inject tags if specified
    const tags = tagsStr.split(",").map(s => s.trim()).filter(Boolean);
    if (tags.length > 0) {
      parsedAttributes.tags = tags;
    }

    const payload = {
      title: title.trim(),
      description: description.trim() || null, // saved exactly as HTML in database!
      video_url: videoUrl.trim(),
      duration_seconds: Number(durationSec) || 0,
      thumbnail_url: thumbnailUrl.trim() || null,
      resources: resourcesPayload,
      attributes: parsedAttributes
    };

    try {
      setSubmitting(true);
      setSubmitError(null);
      setSubmitSuccess(false);

      const res = await fetch(`${backendUrl}/api/v1/admin/video-lectures`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Unable to create reusable video lecture.");
      }

      setSubmitSuccess(true);
      setTimeout(() => {
        router.push("/admin/videos");
      }, 1500);

    } catch (err: unknown) {
      console.error("Submission failed:", err);
      const errMessage = err instanceof Error ? err.message : String(err);
      setSubmitError(errMessage || "An unexpected error occurred while saving.");
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 size={32} className="animate-spin text-brand-500" />
        <p className="text-gray-500 dark:text-gray-400 text-sm font-semibold">Verifying secure admin parameters...</p>
      </div>
    );
  }

  if (!isLoggedIn || !user?.roles?.includes("admin")) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-8 shadow-lg text-center space-y-6"
        >
          <div className="w-16 h-16 bg-red-500/10 text-red-500 border border-red-500/10 rounded-2xl flex items-center justify-center mx-auto">
            <Lock size={30} />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-black text-gray-950 dark:text-white tracking-tight">Access Prohibited</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
              This environment is strictly reserved for CrackDSA Administrators. You do not possess the required RBAC credentials to view this page.
            </p>
          </div>
          <div className="pt-2">
            <Link href="/dashboard" className="inline-flex w-full items-center justify-center px-5 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold transition-all shadow-md shadow-brand-500/15">
              Return to Student Site
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 px-4">
      
      {/* Back button header */}
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/videos" 
          className="p-2.5 rounded-xl border border-gray-250 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:text-gray-950 dark:hover:text-white bg-white dark:bg-gray-900 transition-all shadow-sm"
        >
          <ArrowLeft size={16} />
        </Link>
        <div>
          <span className="text-[10px] font-black text-brand-500 uppercase tracking-widest block leading-none mb-1">Creation Cockpit</span>
          <h1 className="text-xl sm:text-2xl font-black text-gray-950 dark:text-white tracking-tight">
            Add New Video Lecture
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Main Attributes Panel */}
        <div className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800/80 rounded-3xl p-6 sm:p-8 space-y-6">
          
          <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-800/85 pb-4">
            <Video className="text-brand-500" size={18} />
            <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">Asset Configuration</h3>
          </div>

          {submitError && (
            <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/10 text-xs font-semibold text-red-600">
              {submitError}
            </div>
          )}

          {submitSuccess && (
            <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-xs font-semibold text-emerald-600 flex items-center gap-2">
              <Sparkles size={14} className="animate-pulse" />
              <span>Asset created successfully! Redirecting back to catalog...</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Lecture Title */}
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-black text-gray-400 uppercase tracking-wider">Lecture Title *</label>
              <input 
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Sliding Window Strategy: Variable Length Patterns"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-transparent text-sm text-gray-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500 dark:focus:ring-brand-400 font-medium"
              />
            </div>

            {/* Premium Rich Text HTML Description Notes */}
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-black text-gray-400 uppercase tracking-wider">Description Notes (Premium HTML Editor)</label>
              <RichTextEditor 
                value={description}
                onChange={setDescription}
                placeholder="Write description notes, headers, lists, code samples here..."
              />
            </div>

            {/* Video URL */}
            <div className="space-y-1.5">
              <label className="text-xs font-black text-gray-400 uppercase tracking-wider">Video Stream URL *</label>
              <input 
                type="text"
                required
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="e.g., https://stream.cloudflare.com/..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-transparent text-sm text-gray-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500 dark:focus:ring-brand-400 font-medium font-mono"
              />
            </div>

            {/* Duration seconds */}
            <div className="space-y-1.5">
              <label className="text-xs font-black text-gray-400 uppercase tracking-wider">Duration (Seconds)</label>
              <input 
                type="number"
                min={0}
                value={durationSec}
                onChange={(e) => setDurationSec(Number(e.target.value))}
                placeholder="e.g., 2700 (45 minutes)"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-transparent text-sm text-gray-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500 dark:focus:ring-brand-400 font-medium"
              />
            </div>

            {/* Thumbnail URL */}
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-black text-gray-400 uppercase tracking-wider">Thumbnail Image URL</label>
              <input 
                type="text"
                value={thumbnailUrl}
                onChange={(e) => setThumbnailUrl(e.target.value)}
                placeholder="e.g., https://cdn.crackdsa.com/thumbnails/lecture-1.jpg"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-transparent text-sm text-gray-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500 dark:focus:ring-brand-400 font-medium"
              />
            </div>

          </div>

        </div>

        {/* Dynamic Resources Panel */}
        <div className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800/80 rounded-3xl p-6 sm:p-8 space-y-6">
          
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800/85 pb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="text-brand-500" size={18} />
              <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">Curated Resources</h3>
            </div>
            <button
              type="button"
              onClick={addCustomResourceRow}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-dashed border-brand-500/30 hover:border-brand-500/80 bg-brand-500/5 hover:bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-bold transition-all"
            >
              <Plus size={13} />
              <span>Add Custom Resource Key</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Connected Problems */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-black text-gray-400 uppercase tracking-wider">
                <HelpCircle size={13} />
                <span>Linked Coding Problems (Comma Separated)</span>
              </div>
              <input 
                type="text"
                value={problemsStr}
                onChange={(e) => setProblemsStr(e.target.value)}
                placeholder="leetcode-3, leetcode-76"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-transparent text-sm text-gray-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500 font-medium"
              />
            </div>

            {/* Connected Blogs */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-black text-gray-400 uppercase tracking-wider">
                <FileText size={13} />
                <span>Linked Concept Blogs (Comma Separated)</span>
              </div>
              <input 
                type="text"
                value={blogsStr}
                onChange={(e) => setBlogsStr(e.target.value)}
                placeholder="sliding-window-article, big-o-guide"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-transparent text-sm text-gray-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500 font-medium"
              />
            </div>

            {/* Connected Assignments */}
            <div className="sm:col-span-2 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-black text-gray-400 uppercase tracking-wider">
                <LinkIcon size={13} />
                <span>Linked Assignments (Comma Separated)</span>
              </div>
              <input 
                type="text"
                value={assignmentsStr}
                onChange={(e) => setAssignmentsStr(e.target.value)}
                placeholder="https://github.com/crackdsa/sliding-window-hw"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-transparent text-sm text-gray-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500 font-medium"
              />
            </div>

          </div>

          {/* Dynamic Extra resource lists */}
          {customResources.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800/80">
              <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Custom Resource Arrays</h4>
              <div className="space-y-4">
                {customResources.map((row, index) => (
                  <div key={index} className="flex flex-col sm:flex-row gap-4 items-end bg-gray-50/50 dark:bg-gray-800/20 p-4 rounded-2xl border border-gray-100 dark:border-gray-850">
                    <div className="flex-1 space-y-1.5 w-full">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Custom Resource Key *</label>
                      <input 
                        type="text"
                        required
                        value={row.key}
                        onChange={(e) => handleCustomResourceChange(index, "key", e.target.value)}
                        placeholder="e.g., slides_pdf, quiz_link"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-transparent text-sm text-gray-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500 font-medium font-mono"
                      />
                    </div>
                    <div className="flex-2 space-y-1.5 w-full">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Values (Comma Separated)</label>
                      <input 
                        type="text"
                        value={row.value}
                        onChange={(e) => handleCustomResourceChange(index, "value", e.target.value)}
                        placeholder="e.g., https://crackdsa.com/slides/intro.pdf"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-transparent text-sm text-gray-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500 font-medium"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeCustomResourceRow(index)}
                      className="p-2.5 rounded-xl bg-red-500/5 hover:bg-red-500/10 text-red-500 border border-red-500/10 transition-colors shrink-0 mb-0.5"
                      title="Remove row"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Dynamic Attributes & Metadata JSON Panel */}
        <div className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800/80 rounded-3xl p-6 sm:p-8 space-y-6">
          
          <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-800/85 pb-4">
            <Tag className="text-brand-500" size={18} />
            <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">Metadata & Attributes</h3>
          </div>

          <div className="space-y-6">
            
            {/* Tags Comma list */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-black text-gray-400 uppercase tracking-wider">
                <Tag size={13} />
                <span>Search & Filtering Tags (Comma Separated)</span>
              </div>
              <input 
                type="text"
                value={tagsStr}
                onChange={(e) => setTagsStr(e.target.value)}
                placeholder="sliding-window, variable-size, hard"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-transparent text-sm text-gray-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500 font-medium"
              />
            </div>

            {/* JSON Schema text area */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-black text-gray-400 uppercase tracking-wider">
                <div className="flex items-center gap-1.5">
                  <CodeIcon size={13} />
                  <span>Custom Attributes JSON</span>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded font-black ${
                  isJsonValid 
                    ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/10" 
                    : "bg-red-500/10 text-red-600 border border-red-500/10"
                }`}>
                  {isJsonValid ? "Valid JSON Schema" : "Invalid JSON Syntax"}
                </span>
              </div>
              <textarea 
                value={customJsonStr}
                onChange={(e) => setCustomJsonStr(e.target.value)}
                rows={6}
                placeholder={'{\n  "cohort": "dsa-bootcamp-2026"\n}'}
                className={`w-full px-4 py-3 rounded-xl border bg-transparent text-sm text-gray-950 dark:text-white focus:outline-none font-mono resize-none leading-relaxed ${
                  isJsonValid 
                    ? "border-gray-200 dark:border-gray-800 focus:ring-1 focus:ring-brand-500" 
                    : "border-red-500 focus:ring-1 focus:ring-red-500"
                }`}
              />
              <p className="text-[10px] text-gray-400 font-semibold leading-relaxed">
                Add any other key-values. This is fully stored in the database attributes column and parsed during API deliveries.
              </p>
            </div>

          </div>

        </div>

        {/* Bottom Actions Row */}
        <div className="flex items-center justify-end gap-3.5 border-t border-gray-150 dark:border-gray-800/80 pt-6">
          <Link 
            href="/admin/videos" 
            className="px-5 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-gray-955 dark:hover:text-white uppercase tracking-wider transition-colors"
          >
            Discard Asset
          </Link>
          <Button 
            type="submit" 
            disabled={submitting || !isJsonValid}
            variant="primary"
            size="sm"
            startIcon={submitting ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
          >
            {submitting ? "Creating Asset..." : "Create Video Asset"}
          </Button>
        </div>

      </form>

    </div>
  );
}
