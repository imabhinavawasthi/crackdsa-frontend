"use client";

import { BACKEND_URL } from "@/config/api";
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
import { 
  ArrowLeft, 
  Plus, 
  Loader2,
  AlertCircle,
  Trash2,
  Code as CodeIcon,
  Lock,
  CheckCircle2,
  Video,
  Sparkles,
  HelpCircle,
  FileText,
  Link as LinkIcon,
  Tag
} from "lucide-react";
import Link from "next/link";
import RichTextEditor from "@/components/ui/editor/RichTextEditor";
import ResourceSelector from "@/components/admin/ResourceSelector";
import ExternalLinksEditor, { ExternalLink } from "@/components/admin/ExternalLinksEditor";

const videoSchema = z.object({
  title: z.string().min(1, "Title is required"),
  video_url: z.string().min(1, "Video Stream URL is required"),
  duration_seconds: z.number().min(0),
  thumbnail_url: z.string().nullable().optional(),
});

type VideoFormValues = z.infer<typeof videoSchema>;

type CustomResourceRow = {
  key: string;
  value: string;
};

export default function AddVideoLecturePage() {
  const { user, isLoading: authLoading, isLoggedIn } = useAuth();
  const router = useRouter();

  // HTML content for description (handled outside react-hook-form for RichText compatibility)
  const [description, setDescription] = useState("");

  // Curated resource inputs state
  const [selectedProblems, setSelectedProblems] = useState<string[]>([]);
  const [selectedBlogs, setSelectedBlogs] = useState<string[]>([]);
  const [externalLinks, setExternalLinks] = useState<ExternalLink[]>([]);

  // Dynamic Custom Resource Key-Value pairs
  const [customResources, setCustomResources] = useState<CustomResourceRow[]>([]);

  // Instructors list
  const [instructorsList, setInstructorsList] = useState<any[]>([]);
  const [selectedInstructorId, setSelectedInstructorId] = useState<string>("");

  // Attributes / Metadata state
  const [tagsStr, setTagsStr] = useState("");
  const [customJsonStr, setCustomJsonStr] = useState("{\n  \"cohort\": \"dsa-bootcamp-2026\"\n}");
  const [isJsonValid, setIsJsonValid] = useState(true);

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const backendUrl = BACKEND_URL;

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<VideoFormValues>({
    resolver: zodResolver(videoSchema),
    defaultValues: {
      title: "",
      video_url: "",
      duration_seconds: 0,
      thumbnail_url: ""
    }
  });

  useEffect(() => {
    document.title = "Add Video Lecture | CrackDSA";
    const fetchInstructors = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/v1/instructors/`);
        if (res.ok) {
          const data = await res.json();
          setInstructorsList(data.items || []);
        }
      } catch (err) {
        console.error("Failed to fetch instructors", err);
      }
    };
    fetchInstructors();
  }, [backendUrl]);

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
  const onSubmit = async (values: VideoFormValues) => {
    setSubmitError(null);
    const token = getStoredToken();
    if (!token) return;

    if (!isJsonValid) {
      setSubmitError("Please correct the invalid Custom JSON Attributes syntax before saving.");
      return;
    }

    // 1. Build initial resources payload with the 3 main lists
    const resourcesPayload: Record<string, any> = {
      problems: selectedProblems,
      blogs: selectedBlogs,
      external_links: externalLinks
    };

    // 2. Append all dynamic custom resource pairs
    customResources.forEach((row) => {
      const cleanKey = row.key.trim();
      if (cleanKey) {
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
    
    // Inject instructor ID
    if (selectedInstructorId) {
      parsedAttributes.instructor_id = selectedInstructorId;
    }

    const payload = {
      title: values.title.trim(),
      description: description.trim() || null, // saved exactly as HTML in database!
      video_url: values.video_url.trim(),
      duration_seconds: Number(values.duration_seconds) || 0,
      thumbnail_url: values.thumbnail_url || null,
      resources: resourcesPayload,
      attributes: parsedAttributes
    };

    try {
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
              Add New Video Lecture
            </h1>
            <p className="text-xs text-gray-500 font-semibold mt-0.5">
              Register a new video lecture asset and associate connected files.
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
            Video lecture created successfully! Redirecting...
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>1. Lecture Information</CardTitle>
            <CardDescription>Configure core video settings, streams, and descriptions.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            
            <div className="space-y-2">
              <Label htmlFor="title">Lecture Title *</Label>
              <Input id="title" {...register("title")} placeholder="e.g. Sliding Window Strategy: Variable Length Patterns" />
              {errors.title && (
                <p className="text-xs text-red-500 font-semibold">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Description Notes</Label>
              <div className="border border-gray-250 dark:border-gray-800 rounded-xl overflow-hidden bg-white dark:bg-gray-900">
                <RichTextEditor value={description} onChange={setDescription} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="video_url">Video Stream URL *</Label>
                <Input id="video_url" {...register("video_url")} placeholder="e.g. https://stream.cloudflare.com/..." className="font-mono" />
                {errors.video_url && (
                  <p className="text-xs text-red-500 font-semibold">{errors.video_url.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration_seconds">Duration (Seconds)</Label>
                <Input id="duration_seconds" type="number" min={0} {...register("duration_seconds", { valueAsNumber: true })} placeholder="e.g. 2700" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="thumbnail_url">Thumbnail Image URL</Label>
              <Input id="thumbnail_url" {...register("thumbnail_url")} placeholder="e.g. https://cdn.crackdsa.com/thumbnails/..." />
            </div>

          </CardContent>
        </Card>

        {/* Dynamic Resources Panel */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>2. Linked Resources</CardTitle>
                <CardDescription>Attach standard list items and dynamic worksheet arrays.</CardDescription>
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
              <ResourceSelector 
                type="problems"
                selectedSlugs={selectedProblems}
                onChange={setSelectedProblems}
                label="Coding Problems"
                description="Select practice problems mapped to this lecture."
              />
              <ResourceSelector 
                type="articles"
                selectedSlugs={selectedBlogs}
                onChange={setSelectedBlogs}
                label="Concept Articles/Blogs"
                description="Attach reading material to support this video."
              />
            </div>
            <div className="pt-2">
              <ExternalLinksEditor 
                links={externalLinks}
                onChange={setExternalLinks}
                label="External Resources & Assignments"
                description="Link to Github repos, external assignments, or any other web resource."
              />
            </div>

            {customResources.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-850">
                <Label className="text-xs font-bold uppercase tracking-wider block">Custom Resource Buckets</Label>
                <div className="space-y-3">
                  {customResources.map((row, index) => (
                    <div key={index} className="flex gap-3 items-end bg-gray-50/50 dark:bg-gray-900/40 p-3 rounded-xl border border-gray-200 dark:border-gray-850">
                      <div className="flex-1 space-y-1.5">
                        <Label className="text-[10px]">Resource Key</Label>
                        <Input value={row.key} onChange={(e) => handleCustomResourceChange(index, "key", e.target.value)} placeholder="e.g. slides_pdf" className="h-9 font-mono" />
                      </div>
                      <div className="flex-[2] space-y-1.5">
                        <Label className="text-[10px]">Values (Comma separated)</Label>
                        <Input value={row.value} onChange={(e) => handleCustomResourceChange(index, "value", e.target.value)} placeholder="e.g. url-1, url-2" className="h-9" />
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

        {/* Dynamic Attributes & Metadata Panel */}
        <Card>
          <CardHeader>
            <CardTitle>3. Advanced Attributes & Tags</CardTitle>
            <CardDescription>Setup filtering tags and extra JSON key-values.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="tags">Tags (Comma separated)</Label>
                <Input id="tags" placeholder="e.g. Sliding Window, Hard" value={tagsStr} onChange={(e) => setTagsStr(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="instructor">Instructor / Mentor</Label>
                <select 
                  id="instructor"
                  value={selectedInstructorId}
                  onChange={(e) => setSelectedInstructorId(e.target.value)}
                  className="flex h-10 w-full items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:ring-offset-gray-950 dark:placeholder:text-gray-400 dark:focus:ring-gray-300"
                >
                  <option value="">-- No Instructor Assigned --</option>
                  {instructorsList.map((inst: any) => (
                    <option key={inst.id} value={inst.id}>
                      {inst.name} ({inst.role})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="custom_json">Custom JSON Attributes</Label>
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
                  "Create Lecture"
                )}
              </button>
            </div>

          </CardContent>
        </Card>
      </form>
    </div>
  );
}
