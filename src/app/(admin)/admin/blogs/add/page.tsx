"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getStoredToken } from "@/functions/auth";
import Button from "@/components/ui/button/Button";
import { 
  ArrowLeft, 
  Plus, 
  HelpCircle,
  FileText,
  Loader2,
  Sparkles,
  Trash2,
  Tag,
  BookOpen,
  User,
  Image as ImageIcon
} from "lucide-react";
import Link from "next/link";
import RichTextEditor from "@/components/ui/editor/RichTextEditor";

type CustomResourceRow = {
  key: string;
  value: string;
};

export default function AddArticlePage() {
  const { user, isLoading: authLoading, isLoggedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    document.title = "Add Article | CrackDSA";
  }, []);

  // Primary form inputs state
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [category, setCategory] = useState("General");
  const [difficulty, setDifficulty] = useState("");
  const [readTimeMinutes, setReadTimeMinutes] = useState<number>(5);
  const [coverImage, setCoverImage] = useState("");

  // Author info
  const [authorName, setAuthorName] = useState("");
  const [authorAvatar, setAuthorAvatar] = useState("");

  // Description / Content
  const [description, setDescription] = useState("");

  // Resources
  const [relatedProblemsStr, setRelatedProblemsStr] = useState("");
  const [relatedVideosStr, setRelatedVideosStr] = useState("");
  const [externalLinksStr, setExternalLinksStr] = useState("");
  const [customResources, setCustomResources] = useState<CustomResourceRow[]>([]);

  // Attributes / Metadata state
  const [tagsStr, setTagsStr] = useState("");
  const [seriesName, setSeriesName] = useState("");
  const [customJsonStr, setCustomJsonStr] = useState("{\n  \"featured\": false\n}");
  const [isJsonValid, setIsJsonValid] = useState(true);

  // Publishing
  const [isPublished, setIsPublished] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

  // Auto-generate slug from title
  useEffect(() => {
    if (title && !slug) {
      const autoSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setSlug(autoSlug);
    }
  }, [title, slug]);

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

    if (!title.trim() || !slug.trim()) {
      setSubmitError("Title and URL Slug are required fields.");
      return;
    }

    if (!isJsonValid) {
      setSubmitError("Please correct the invalid Custom JSON Attributes syntax before saving.");
      return;
    }

    // 1. Build resources payload
    const related_problems = relatedProblemsStr.split(",").map(s => s.trim()).filter(Boolean);
    const related_videos = relatedVideosStr.split(",").map(s => s.trim()).filter(Boolean);
    const external_links = externalLinksStr.split(",").map(s => s.trim()).filter(Boolean);
    const resourcesPayload: Record<string, unknown> = {
      related_problems,
      related_videos,
      external_links
    };

    // Append dynamic custom resources
    customResources.forEach((row) => {
      const cleanKey = row.key.trim();
      if (cleanKey) {
        const valArray = row.value.split(",").map(s => s.trim()).filter(Boolean);
        resourcesPayload[cleanKey] = valArray;
      }
    });

    // 2. Build attributes payload
    let parsedAttributes: Record<string, unknown> = {};
    if (customJsonStr.trim()) {
      try {
        parsedAttributes = JSON.parse(customJsonStr);
      } catch {
        setSubmitError("Invalid JSON structure detected in Custom Attributes.");
        return;
      }
    }

    const tags = tagsStr.split(",").map(s => s.trim()).filter(Boolean);
    if (tags.length > 0) {
      parsedAttributes.tags = tags;
    }
    if (seriesName.trim()) {
      parsedAttributes.series = seriesName.trim();
    }

    const payload = {
      title: title.trim(),
      slug: slug.trim(),
      subtitle: subtitle.trim() || null,
      description: description.trim() || null,
      cover_image: coverImage.trim() || null,
      category,
      difficulty: difficulty || null,
      read_time_minutes: Number(readTimeMinutes) || 5,
      author_name: authorName.trim() || null,
      author_avatar: authorAvatar.trim() || null,
      resources: resourcesPayload,
      attributes: parsedAttributes,
      is_published: isPublished
    };

    try {
      setSubmitting(true);
      setSubmitError(null);
      setSubmitSuccess(false);

      const res = await fetch(`${backendUrl}/api/v1/admin/articles`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Unable to create article.");
      }

      setSubmitSuccess(true);
      setTimeout(() => {
        router.push("/admin/blogs");
      }, 1500);

    } catch (err: unknown) {
      console.error("Submission failed:", err);
      const errMessage = err instanceof Error ? err.message : String(err);
      setSubmitError(errMessage || "An unexpected error occurred while saving.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-24 px-4">
      {/* Top Navigation */}
      <div className="mb-6 flex items-center justify-between">
        <Link 
          href="/admin/blogs"
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white uppercase tracking-wider transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Articles List
        </Link>
      </div>

      {/* Main Card container */}
      <div className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800/80 rounded-3xl p-6 sm:p-8 shadow-theme-xs space-y-8">
        
        {/* Title bar info */}
        <div className="border-b border-gray-100 dark:border-gray-800 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-500/10 text-brand-500 border border-brand-500/10 flex items-center justify-center">
              <Sparkles size={20} className="animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-gray-950 dark:text-white tracking-tight">
                Add Article
              </h1>
              <p className="text-xs text-gray-400 font-semibold mt-0.5">
                Compose a new blog post or concept article with rich content, author info, and classification metadata.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* SECTION 1: Primary Parameters */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase text-gray-400 tracking-widest border-l-2 border-brand-500 pl-2">
              Primary Specifications
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4.5">
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
                  Article Title <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Understanding Binary Search Trees"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-transparent text-sm text-gray-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
                  URL Slug Handle <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. understanding-binary-search-trees"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, "-"))}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-transparent text-sm text-gray-950 dark:text-white font-mono focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
                Subtitle
              </label>
              <input 
                type="text"
                placeholder="e.g. A deep dive into BST operations and use cases"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-transparent text-sm text-gray-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500 font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4.5">
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
                  Category <span className="text-red-500">*</span>
                </label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-sm text-gray-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500 font-medium"
                >
                  <option value="General">General</option>
                  <option value="DSA Concepts">DSA Concepts</option>
                  <option value="System Design">System Design</option>
                  <option value="Company Insights">Company Insights</option>
                  <option value="Tips & Tricks">Tips & Tricks</option>
                  <option value="Announcements">Announcements</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
                  Difficulty
                </label>
                <select 
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-sm text-gray-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500 font-medium"
                >
                  <option value="">— None —</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
                  Read Time (minutes)
                </label>
                <input 
                  type="number"
                  min={1}
                  max={120}
                  value={readTimeMinutes}
                  onChange={(e) => setReadTimeMinutes(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-transparent text-sm text-gray-950 dark:text-white font-mono focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
                Cover Image URL
              </label>
              <input 
                type="url"
                placeholder="e.g. https://cdn.example.com/images/cover.jpg"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-transparent text-sm text-gray-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500 font-medium"
              />
            </div>
          </div>

          {/* SECTION 2: Author Info */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase text-gray-400 tracking-widest border-l-2 border-brand-500 pl-2">
              Author Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4.5">
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
                  Author Name
                </label>
                <input 
                  type="text"
                  placeholder="e.g. John Doe"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-transparent text-sm text-gray-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
                  Author Avatar URL
                </label>
                <input 
                  type="url"
                  placeholder="e.g. https://cdn.example.com/avatars/author.jpg"
                  value={authorAvatar}
                  onChange={(e) => setAuthorAvatar(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-transparent text-sm text-gray-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500 font-medium"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: Description text editor */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-black uppercase text-gray-400 tracking-widest border-l-2 border-brand-500 pl-2">
                Article Content & Description
              </label>
              <p className="text-[11px] text-gray-400 font-semibold mt-1 mb-2">
                Draft the full article body with rich formatting, embedded examples, and code snippets.
              </p>
            </div>
            
            <div className="border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden bg-gray-50/20 dark:bg-gray-900/50">
              <RichTextEditor 
                value={description}
                onChange={setDescription}
                placeholder="Write your article content here with rich formatting..."
              />
            </div>
          </div>

          {/* SECTION 4: Linked Resources */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase text-gray-400 tracking-widest border-l-2 border-brand-500 pl-2">
              Connected Resources
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide flex items-center gap-1">
                  Related Problems
                  <span title="Comma-separated UUID keys of related practice problems">
                    <HelpCircle size={12} className="text-gray-400 cursor-help" />
                  </span>
                </label>
                <input 
                  type="text"
                  placeholder="e.g. 550e8400-e29b-41d4-a716-446655440000, ..."
                  value={relatedProblemsStr}
                  onChange={(e) => setRelatedProblemsStr(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-transparent text-sm text-gray-950 dark:text-white font-mono focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide flex items-center gap-1">
                  Related Videos
                  <span title="Comma-separated UUID keys of related video lectures">
                    <HelpCircle size={12} className="text-gray-400 cursor-help" />
                  </span>
                </label>
                <input 
                  type="text"
                  placeholder="e.g. 550e8400-e29b-41d4-a716-446655440000, ..."
                  value={relatedVideosStr}
                  onChange={(e) => setRelatedVideosStr(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-transparent text-sm text-gray-950 dark:text-white font-mono focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide flex items-center gap-1">
                External Links
                <span title="Comma-separated external reference URLs">
                  <HelpCircle size={12} className="text-gray-400 cursor-help" />
                </span>
              </label>
              <input 
                type="text"
                placeholder="e.g. https://example.com/ref1, https://example.com/ref2"
                value={externalLinksStr}
                onChange={(e) => setExternalLinksStr(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-transparent text-sm text-gray-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500 font-medium"
              />
            </div>

            {/* Dynamic Custom Resources Key-Value rows */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide flex items-center gap-1">
                  Custom Resource Links
                  <span title="Link additional resources dynamically">
                    <HelpCircle size={12} className="text-gray-400 cursor-help" />
                  </span>
                </label>
                <button 
                  type="button"
                  onClick={addCustomResourceRow}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-brand-500 hover:text-brand-600 transition-colors"
                >
                  <Plus size={12} />
                  Add Field
                </button>
              </div>

              {customResources.length > 0 && (
                <div className="space-y-3 p-3 rounded-2xl border border-gray-150 dark:border-gray-800/80 bg-gray-50/10">
                  {customResources.map((row, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input 
                        type="text"
                        placeholder="Key (e.g. cheatsheets)"
                        required
                        value={row.key}
                        onChange={(e) => handleCustomResourceChange(index, "key", e.target.value)}
                        className="w-1/3 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-850 bg-white dark:bg-gray-900 text-xs text-gray-950 dark:text-white font-mono focus:outline-none focus:ring-1 focus:ring-brand-500"
                      />
                      <input 
                        type="text"
                        placeholder="Comma-separated values"
                        required
                        value={row.value}
                        onChange={(e) => handleCustomResourceChange(index, "value", e.target.value)}
                        className="flex-1 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-850 bg-white dark:bg-gray-900 text-xs text-gray-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
                      />
                      <button 
                        type="button" 
                        onClick={() => removeCustomResourceRow(index)}
                        className="p-2 text-red-500 hover:bg-red-500/5 rounded-lg transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* SECTION 5: Attributes and Metadata */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase text-gray-400 tracking-widest border-l-2 border-brand-500 pl-2">
              Advanced Attributes & Classification
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4.5">
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide flex items-center gap-1">
                  Tag Classification
                  <span title="Comma-separated categorization tags">
                    <HelpCircle size={12} className="text-gray-400 cursor-help" />
                  </span>
                </label>
                <input 
                  type="text"
                  placeholder="e.g. Trees, Binary Search, Algorithms"
                  value={tagsStr}
                  onChange={(e) => setTagsStr(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-transparent text-sm text-gray-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
                  Series Name
                </label>
                <input 
                  type="text"
                  placeholder="e.g. DSA Deep Dives"
                  value={seriesName}
                  onChange={(e) => setSeriesName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-transparent text-sm text-gray-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500 font-medium"
                />
              </div>
            </div>

            {/* Custom JSON editor for remaining metadata */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide flex items-center gap-1.5">
                Custom JSON Metadata Bucket
                {!isJsonValid ? (
                  <span className="inline-flex items-center gap-0.5 text-[10px] font-black text-rose-500 uppercase tracking-wider animate-pulse">
                    <Trash2 size={10} /> Invalid JSON Syntax
                  </span>
                ) : (
                  <span className="inline-flex items-center text-[10px] font-bold text-emerald-500 uppercase tracking-wider">
                    Syntax OK
                  </span>
                )}
              </label>
              
              <textarea 
                rows={5}
                value={customJsonStr}
                onChange={(e) => setCustomJsonStr(e.target.value)}
                className={`w-full p-4 rounded-2xl border font-mono text-xs focus:outline-none focus:ring-1 transition-all ${
                  isJsonValid 
                    ? "border-gray-200 dark:border-gray-800 bg-transparent focus:ring-brand-500" 
                    : "border-rose-500/50 bg-rose-500/5 text-rose-600 focus:ring-rose-500"
                }`}
              />
            </div>
          </div>

          {/* SECTION 6: Publishing Toggle */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase text-gray-400 tracking-widest border-l-2 border-brand-500 pl-2">
              Publishing Status
            </h3>

            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input 
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 dark:border-gray-700 text-brand-500 focus:ring-brand-500 focus:ring-offset-0"
              />
              <span className="text-sm font-bold text-gray-800 dark:text-gray-200">
                Publish immediately
              </span>
              <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
                {isPublished ? "Article will be visible to readers" : "Saved as draft"}
              </span>
            </label>
          </div>

          {/* Submission and error overlays */}
          {submitError && (
            <div className="bg-red-500/5 border border-red-500/10 rounded-2xl p-4.5 flex items-start gap-2.5">
              <Trash2 size={16} className="text-red-500 shrink-0 mt-0.5" />
              <div className="text-xs font-semibold text-red-500 leading-normal">
                {submitError}
              </div>
            </div>
          )}

          {submitSuccess && (
            <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-4.5 flex items-start gap-2.5">
              <Sparkles size={16} className="text-emerald-500 shrink-0 mt-0.5" />
              <div className="text-xs font-bold text-emerald-600">
                Article created successfully! Redirecting back to catalog...
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3.5 border-t border-gray-100 dark:border-gray-800 pt-5">
            <Button 
              type="button"
              variant="outline"
              size="sm"
              onClick={() => router.push("/admin/blogs")}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              variant="primary"
              size="sm"
              disabled={submitting || !isJsonValid}
              startIcon={submitting ? <Loader2 size={14} className="animate-spin" /> : undefined}
            >
              {submitting ? "Saving Article..." : "Save Article"}
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
}
