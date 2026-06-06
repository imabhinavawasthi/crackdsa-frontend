"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getStoredToken } from "@/functions/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { 
  ArrowLeft, 
  Plus, 
  Loader2,
  AlertCircle,
  Trash2,
  Lock,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  FileText,
  Link as LinkIcon,
  Tag
} from "lucide-react";
import Link from "next/link";
import RichTextEditor from "@/components/ui/editor/RichTextEditor";

const articleSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  subtitle: z.string().nullable().optional(),
  category: z.string().min(1, "Category is required"),
  difficulty: z.string().nullable().optional(),
  read_time_minutes: z.number().min(1),
  cover_image: z.string().nullable().optional(),
  author_name: z.string().nullable().optional(),
  author_avatar: z.string().nullable().optional(),
  is_published: z.boolean(),
});

type ArticleFormValues = z.infer<typeof articleSchema>;

type CustomResourceRow = {
  key: string;
  value: string;
};

export default function AddArticlePage() {
  const { user, isLoading: authLoading, isLoggedIn } = useAuth();
  const router = useRouter();

  // HTML content for description notes
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

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<ArticleFormValues>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: "",
      slug: "",
      subtitle: "",
      category: "DSA Concepts",
      difficulty: "",
      read_time_minutes: 5,
      cover_image: "",
      author_name: "CrackDSA Team",
      author_avatar: "",
      is_published: false
    }
  });

  const titleWatch = watch("title");
  const slugWatch = watch("slug");

  // Auto-generate slug from title
  useEffect(() => {
    if (titleWatch && !slugWatch) {
      const autoSlug = titleWatch
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setValue("slug", autoSlug);
    }
  }, [titleWatch, slugWatch, setValue]);

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
  const onSubmit = async (values: ArticleFormValues) => {
    setSubmitError(null);
    const token = getStoredToken();
    if (!token) return;

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
      title: values.title.trim(),
      slug: values.slug.trim(),
      subtitle: values.subtitle?.trim() || null,
      description: description.trim() || null,
      cover_image: values.cover_image?.trim() || null,
      category: values.category,
      difficulty: values.difficulty || null,
      read_time_minutes: Number(values.read_time_minutes) || 5,
      author_name: values.author_name?.trim() || null,
      author_avatar: values.author_avatar?.trim() || null,
      resources: resourcesPayload,
      attributes: parsedAttributes,
      is_published: values.is_published
    };

    try {
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
        <div className="max-w-md w-full bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-3xl p-8 shadow-lg text-center space-y-6">
          <div className="w-16 h-16 bg-red-500/10 text-red-500 border border-red-500/10 rounded-2xl flex items-center justify-center mx-auto">
            <Lock size={30} />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-black text-gray-955 dark:text-white tracking-tight">Access Prohibited</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
              This environment is strictly reserved for CrackDSA Administrators.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-24 px-4">
      {/* Header back button */}
      <div className="mb-6 flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-5">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-150 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors"
            title="Go Back"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-955 dark:text-white tracking-tight">
              Add New Article
            </h1>
            <p className="text-xs text-gray-500 font-semibold mt-0.5">
              Compose a new blog post or concept article with rich content.
            </p>
          </div>
        </div>
      </div>

      {/* State Alerts */}
      {submitError && (
        <div className="bg-red-500/5 border border-red-500/10 rounded-2xl p-4 flex items-start gap-2.5 mb-6">
          <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
          <div className="text-xs font-semibold text-red-500 leading-normal">
            {submitError}
          </div>
        </div>
      )}

      {submitSuccess && (
        <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-4 flex items-start gap-2.5 mb-6">
          <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
          <div className="text-xs font-bold text-emerald-600">
            Article created successfully! Redirecting...
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>1. Primary Specifications</CardTitle>
            <CardDescription>Setup basic article settings, slugs, categories, and covers.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="title">Article Title *</Label>
                <Input id="title" {...register("title")} placeholder="e.g. Understanding Binary Search Trees" />
                {errors.title && (
                  <p className="text-xs text-red-500 font-semibold">{errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug Handle *</Label>
                <Input id="slug" {...register("slug")} placeholder="e.g. understanding-binary-search-trees" />
                {errors.slug && (
                  <p className="text-xs text-red-500 font-semibold">{errors.slug.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subtitle">Subtitle</Label>
              <Input id="subtitle" {...register("subtitle")} placeholder="e.g. A deep dive into BST operations and complexity." />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select id="category" {...register("category")}>
                  <option value="General">General</option>
                  <option value="DSA Concepts">DSA Concepts</option>
                  <option value="System Design">System Design</option>
                  <option value="Company Insights">Company Insights</option>
                  <option value="Tips & Tricks">Tips & Tricks</option>
                  <option value="Announcements">Announcements</option>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty</Label>
                <Select id="difficulty" {...register("difficulty")}>
                  <option value="">- None -</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="read_time_minutes">Read Time (Minutes)</Label>
                <Input id="read_time_minutes" type="number" min={1} {...register("read_time_minutes", { valueAsNumber: true })} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cover_image">Cover Image URL</Label>
              <Input id="cover_image" {...register("cover_image")} placeholder="e.g. https://cdn.crackdsa.com/images/..." />
            </div>

          </CardContent>
        </Card>

        {/* SECTION 2: Author info */}
        <Card>
          <CardHeader>
            <CardTitle>2. Author Information</CardTitle>
            <CardDescription>Setup author profile credentials for publication headers.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="author_name">Author Name</Label>
              <Input id="author_name" {...register("author_name")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="author_avatar">Author Avatar URL</Label>
              <Input id="author_avatar" {...register("author_avatar")} placeholder="e.g. https://cdn.crackdsa.com/avatars/..." />
            </div>
          </CardContent>
        </Card>

        {/* SECTION 3: Content Body */}
        <Card>
          <CardHeader>
            <CardTitle>3. Article Content</CardTitle>
            <CardDescription>Draft the full text body using rich markdown/HTML elements.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <RichTextEditor value={description} onChange={setDescription} />
          </CardContent>
        </Card>

        {/* SECTION 4: Resources */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>4. Linked Resources</CardTitle>
                <CardDescription>Connect internal tables, problems, video arrays, or links.</CardDescription>
              </div>
              <button
                type="button"
                onClick={addCustomResourceRow}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-50 hover:bg-gray-100 dark:bg-gray-800/80 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 text-xs font-bold transition-all cursor-pointer"
              >
                <Plus size={13} />
                <span>Add Custom Key</span>
              </button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label className="flex items-center gap-1.5">
                  <HelpCircle size={14} className="text-gray-455" />
                  Related Coding Problems (Comma separated UUIDs)
                </Label>
                <Input value={relatedProblemsStr} onChange={(e) => setRelatedProblemsStr(e.target.value)} placeholder="uuid-1, uuid-2" />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-1.5">
                  <FileText size={14} className="text-gray-455" />
                  Related Video Lectures (Comma separated UUIDs)
                </Label>
                <Input value={relatedVideosStr} onChange={(e) => setRelatedVideosStr(e.target.value)} placeholder="uuid-1, uuid-2" />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-1.5">
                <LinkIcon size={14} className="text-gray-455" />
                External Reference Links (Comma separated URLs)
              </Label>
              <Input value={externalLinksStr} onChange={(e) => setExternalLinksStr(e.target.value)} placeholder="https://example.com/ref1" />
            </div>

            {customResources.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-gray-250 dark:border-gray-850">
                <Label className="text-xs font-bold uppercase tracking-wider block">Custom Resource Buckets</Label>
                <div className="space-y-3">
                  {customResources.map((row, index) => (
                    <div key={index} className="flex gap-3 items-end bg-gray-50/50 dark:bg-gray-900/40 p-3 rounded-xl border border-gray-200 dark:border-gray-850">
                      <div className="flex-1 space-y-1.5">
                        <Label className="text-[10px]">Resource Key</Label>
                        <Input value={row.key} onChange={(e) => handleCustomResourceChange(index, "key", e.target.value)} placeholder="e.g. cheat_sheet" className="h-9 font-mono" />
                      </div>
                      <div className="flex-[2] space-y-1.5">
                        <Label className="text-[10px]">Values (Comma separated)</Label>
                        <Input value={row.value} onChange={(e) => handleCustomResourceChange(index, "value", e.target.value)} placeholder="e.g. url-1" className="h-9" />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeCustomResourceRow(index)}
                        className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-500/10 text-red-650 hover:bg-red-500/20 transition-colors shrink-0 cursor-pointer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </CardContent>
        </Card>

        {/* SECTION 5: Attributes & Metadata */}
        <Card>
          <CardHeader>
            <CardTitle>5. Advanced Metadata & Settings</CardTitle>
            <CardDescription>Setup tags, series mappings, and extra JSON metrics.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="tags">Tags (Comma separated)</Label>
                <Input id="tags" placeholder="e.g. Trees, BST" value={tagsStr} onChange={(e) => setTagsStr(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="series">Series Name</Label>
                <Input id="series" placeholder="e.g. BST Deep Dives" value={seriesName} onChange={(e) => setSeriesName(e.target.value)} />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="custom_json">Custom Attributes JSON</Label>
                <span className={`text-[10px] font-bold uppercase ${isJsonValid ? "text-emerald-500" : "text-rose-505 animate-pulse"}`}>
                  {isJsonValid ? "Syntax Valid" : "Syntax Invalid"}
                </span>
              </div>
              <Textarea 
                id="custom_json"
                rows={5}
                value={customJsonStr}
                onChange={(e) => setCustomJsonStr(e.target.value)}
                className={`font-mono text-xs ${!isJsonValid && "border-red-500 bg-red-50/10 focus-visible:ring-red-550"}`}
              />
            </div>

            <div className="flex items-center gap-3 select-none py-2">
              <input 
                id="is_published"
                type="checkbox"
                {...register("is_published")}
                className="h-4 w-4 rounded border-gray-300 dark:border-gray-700 text-brand-500 focus:ring-brand-500 focus:ring-offset-0"
              />
              <Label htmlFor="is_published" className="font-bold text-gray-800 dark:text-gray-200">Publish immediately (will be visible to readers)</Label>
            </div>

            {/* Save Buttons */}
            <div className="flex items-center gap-3 border-t border-gray-200 dark:border-gray-800 pt-6 justify-end">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-4 py-2 text-xs font-bold text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !isJsonValid}
                className="inline-flex items-center justify-center px-4 py-2 text-xs font-bold text-white bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-gray-200 dark:text-gray-900 rounded-lg shadow-sm disabled:opacity-50 transition-colors cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={13} className="animate-spin mr-1.5" />
                    Saving...
                  </>
                ) : (
                  "Create Article"
                )}
              </button>
            </div>

          </CardContent>
        </Card>
      </form>
    </div>
  );
}
