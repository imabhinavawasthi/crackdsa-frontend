"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
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
  Code as CodeIcon,
  Lock,
  CheckCircle2
} from "lucide-react";
import Link from "next/link";
import RichTextEditor from "@/components/ui/editor/RichTextEditor";

const problemSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  difficulty: z.enum(["Easy", "Medium", "Hard"]),
  platform: z.string().min(1, "Platform is required"),
  problem_url: z.string().nullable().optional(),
  difficulty_level: z.number().min(1).max(10),
  pattern: z.string().nullable().optional(),
  tags: z.string().nullable().optional(),
});

type ProblemFormValues = z.infer<typeof problemSchema>;

type SolutionRow = {
  language: string;
  code: string;
  explanation: string;
  timeComplexity: string;
  spaceComplexity: string;
};

type CustomResourceRow = {
  key: string;
  value: string;
};

type PracticeProblem = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  difficulty: "Easy" | "Medium" | "Hard";
  platform: string;
  problem_url: string | null;
  solutions: Record<string, {
    code: string;
    explanation?: string;
    time_complexity?: string;
    space_complexity?: string;
  }>;
  resources: {
    video_lectures?: string[];
    official_editorial_url?: string;
    [key: string]: unknown;
  };
  attributes: {
    difficulty_level?: number;
    pattern?: string;
    tags?: string[];
    [key: string]: unknown;
  };
  is_active: boolean;
};

export default function EditPracticeProblemPage() {
  const { user, isLoading: authLoading, isLoggedIn } = useAuth();
  const params = useParams();
  const router = useRouter();
  
  const id = params?.id as string;

  // Loading states
  const [fetching, setFetching] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // HTML content for description (handled outside react-hook-form for RichText compatibility)
  const [description, setDescription] = useState("");

  // Dynamic Solutions state
  const [solutions, setSolutions] = useState<SolutionRow[]>([]);

  // Primary resource inputs state
  const [videoLecturesStr, setVideoLecturesStr] = useState("");
  const [officialEditorialUrl, setOfficialEditorialUrl] = useState("");
  const [customResources, setCustomResources] = useState<CustomResourceRow[]>([]);

  // Attributes / Metadata state
  const [customJsonStr, setCustomJsonStr] = useState("{}");
  const [isJsonValid, setIsJsonValid] = useState(true);

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

  const { register, handleSubmit, reset, watch, setValue, formState: { errors, isSubmitting } } = useForm<ProblemFormValues>({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      title: "",
      slug: "",
      difficulty: "Easy",
      platform: "Internal",
      problem_url: "",
      difficulty_level: 5,
      pattern: "",
      tags: ""
    }
  });

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

  // Load problem details for prefill
  const loadProblemDetails = useCallback(async () => {
    const token = getStoredToken();
    if (!token || !id) return;

    try {
      setFetching(true);
      setFetchError(null);
      
      const res = await fetch(`${backendUrl}/api/v1/admin/practice-problems/${id}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!res.ok) {
        if (res.status === 404) {
          throw new Error("Practice problem not found.");
        }
        throw new Error(`Failed to load problem details: ${res.statusText}`);
      }

      const data: PracticeProblem = await res.json();
      
      reset({
        title: data.title,
        slug: data.slug,
        difficulty: data.difficulty,
        platform: data.platform,
        problem_url: data.problem_url || "",
        difficulty_level: data.attributes?.difficulty_level ?? 5,
        pattern: data.attributes?.pattern || "",
        tags: Array.isArray(data.attributes?.tags) ? data.attributes.tags.join(", ") : "",
      });

      setDescription(data.description || "");

      // Load Solutions
      if (data.solutions && Object.keys(data.solutions).length > 0) {
        const loadedSols: SolutionRow[] = Object.entries(data.solutions).map(([lang, val]) => ({
          language: lang,
          code: val.code || "",
          explanation: val.explanation || "",
          timeComplexity: val.time_complexity || "",
          spaceComplexity: val.space_complexity || ""
        }));
        setSolutions(loadedSols);
      } else {
        setSolutions([{ language: "cpp", code: "", explanation: "", timeComplexity: "", spaceComplexity: "" }]);
      }

      // Load Resources
      if (data.resources) {
        if (Array.isArray(data.resources.video_lectures)) {
          setVideoLecturesStr(data.resources.video_lectures.join(", "));
        }
        setOfficialEditorialUrl(data.resources.official_editorial_url || "");

        // Load custom resource key-values
        const customRows: CustomResourceRow[] = [];
        Object.entries(data.resources).forEach(([key, val]) => {
          if (key !== "video_lectures" && key !== "official_editorial_url") {
            if (Array.isArray(val)) {
              customRows.push({ key, value: val.join(", ") });
            } else if (typeof val === "string") {
              customRows.push({ key, value: val });
            }
          }
        });
        setCustomResources(customRows);
      }

      // Load Attributes
      if (data.attributes) {
        // Clean out loaded properties and serialize remaining custom attributes
        const { difficulty_level, pattern: p, tags: t, ...remainingJson } = data.attributes;
        setCustomJsonStr(JSON.stringify(remainingJson, null, 2));
      }

    } catch (err: unknown) {
      console.error("Failed to fetch practice problem detail:", err);
      const errMessage = err instanceof Error ? err.message : String(err);
      setFetchError(errMessage || "Unable to retrieve practice problem metadata.");
    } finally {
      setFetching(false);
    }
  }, [id, backendUrl, reset]);

  useEffect(() => {
    if (isLoggedIn && user?.roles?.includes("admin")) {
      loadProblemDetails();
    }
  }, [isLoggedIn, user, loadProblemDetails]);

  // Handle adding solution row
  const addSolutionRow = () => {
    setSolutions([...solutions, { language: "cpp", code: "", explanation: "", timeComplexity: "", spaceComplexity: "" }]);
  };

  // Handle removing solution row
  const removeSolutionRow = (index: number) => {
    setSolutions(solutions.filter((_, i) => i !== index));
  };

  // Handle changing solution row field
  const handleSolutionChange = (index: number, field: keyof SolutionRow, val: string) => {
    const updated = [...solutions];
    updated[index][field] = val;
    setSolutions(updated);
  };

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

  // Handle Save updates
  const onSubmit = async (values: ProblemFormValues) => {
    const token = getStoredToken();
    if (!token || !id) return;

    if (!isJsonValid) {
      setSubmitError("Please correct the invalid Custom JSON Attributes syntax before saving.");
      return;
    }

    // 1. Build solutions payload mapping language key to solution details
    const solutionsPayload: Record<string, unknown> = {};
    solutions.forEach((sol) => {
      const cleanLang = sol.language.trim().toLowerCase();
      if (cleanLang && sol.code.trim()) {
        solutionsPayload[cleanLang] = {
          code: sol.code.trim(),
          explanation: sol.explanation.trim() || null,
          time_complexity: sol.timeComplexity.trim() || null,
          space_complexity: sol.spaceComplexity.trim() || null
        };
      }
    });

    // 2. Build resources payload
    const video_lectures = videoLecturesStr.split(",").map(s => s.trim()).filter(Boolean);
    const resourcesPayload: Record<string, unknown> = {
      video_lectures,
      official_editorial_url: officialEditorialUrl.trim() || null
    };

    // Append dynamic custom resources
    customResources.forEach((row) => {
      const cleanKey = row.key.trim();
      if (cleanKey) {
        const valArray = row.value.split(",").map(s => s.trim()).filter(Boolean);
        resourcesPayload[cleanKey] = valArray;
      }
    });

    // 3. Build attributes payload: combine tags, pattern, difficulty level, and parsed custom JSON
    let parsedAttributes: Record<string, unknown> = {};
    if (customJsonStr.trim()) {
      try {
        parsedAttributes = JSON.parse(customJsonStr);
      } catch {
        setSubmitError("Invalid JSON structure detected in Custom Attributes.");
        return;
      }
    }

    // Inject core metadata fields
    parsedAttributes.difficulty_level = Number(values.difficulty_level) || 5;
    if (values.pattern?.trim()) {
      parsedAttributes.pattern = values.pattern.trim();
    }
    
    const tagsArray = values.tags ? values.tags.split(",").map(s => s.trim()).filter(Boolean) : [];
    if (tagsArray.length > 0) {
      parsedAttributes.tags = tagsArray;
    }

    const payload = {
      title: values.title.trim(),
      slug: values.slug.trim(),
      description: description.trim() || null,
      difficulty: values.difficulty,
      platform: values.platform,
      problem_url: values.problem_url || null,
      solutions: solutionsPayload,
      resources: resourcesPayload,
      attributes: parsedAttributes
    };

    try {
      setSubmitError(null);
      setSubmitSuccess(false);

      const res = await fetch(`${backendUrl}/api/v1/admin/practice-problems/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Unable to update practice problem.");
      }

      setSubmitSuccess(true);
      setTimeout(() => {
        router.push("/admin/problems");
      }, 1500);

    } catch (err: unknown) {
      console.error("Update failed:", err);
      const errMessage = err instanceof Error ? err.message : String(err);
      setSubmitError(errMessage || "An unexpected error occurred while updating.");
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
            <h1 className="text-2xl font-black text-gray-950 dark:text-white tracking-tight">Access Prohibited</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
              This environment is strictly reserved for CrackDSA Administrators.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (fetching) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 size={32} className="animate-spin text-brand-500" />
        <p className="text-gray-500 dark:text-gray-400 text-sm font-semibold">Loading practice problem metadata...</p>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-3xl text-center space-y-5">
        <div className="w-14 h-14 bg-red-500/10 text-red-500 border border-red-500/10 rounded-2xl flex items-center justify-center mx-auto">
          <AlertCircle size={28} />
        </div>
        <div className="space-y-1.5">
          <h2 className="text-lg font-black text-gray-950 dark:text-white">Failed to Load Asset</h2>
          <p className="text-xs text-gray-500 dark:text-gray-450 leading-relaxed font-semibold">{fetchError}</p>
        </div>
        <Link 
          href="/admin/problems" 
          className="inline-flex w-full items-center justify-center px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 text-xs font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
        >
          Return to Problems List
        </Link>
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
            <h1 className="text-xl sm:text-2xl font-black text-gray-950 dark:text-white tracking-tight">
              Edit Practice Problem
            </h1>
            <p className="text-xs text-gray-500 font-semibold mt-0.5">
              Update challenge parameters, solution code blocks, and tags.
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
            Practice Problem updated successfully! Redirecting...
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>1. Primary Specifications</CardTitle>
            <CardDescription>Setup basic challenge descriptions, platforms, and metadata.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="title">Problem Title *</Label>
                <Input id="title" {...register("title")} />
                {errors.title && (
                  <p className="text-xs text-red-500 font-semibold">{errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug Handle *</Label>
                <Input id="slug" {...register("slug")} />
                {errors.slug && (
                  <p className="text-xs text-red-500 font-semibold">{errors.slug.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty *</Label>
                <Select id="difficulty" {...register("difficulty")}>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="platform">Platform *</Label>
                <Select id="platform" {...register("platform")}>
                  <option value="Internal">Internal</option>
                  <option value="LeetCode">LeetCode</option>
                  <option value="Codeforces">Codeforces</option>
                  <option value="HackerRank">HackerRank</option>
                  <option value="GeeksforGeeks">GeeksforGeeks</option>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="problem_url">Problem URL</Label>
                <Input id="problem_url" type="url" {...register("problem_url")} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <div className="border border-gray-250 dark:border-gray-800 rounded-xl overflow-hidden bg-white dark:bg-gray-900">
                <RichTextEditor value={description} onChange={setDescription} />
              </div>
            </div>

          </CardContent>
        </Card>

        {/* SECTION 2: Dynamic Solutions */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>2. Code Solutions</CardTitle>
                <CardDescription>Configure language solutions, complexity metrics, and explanation logs.</CardDescription>
              </div>
              <button 
                type="button" 
                onClick={addSolutionRow}
                className="inline-flex items-center gap-1 text-xs font-bold text-gray-700 hover:text-gray-950 dark:text-gray-300 dark:hover:text-white transition-colors cursor-pointer"
              >
                <Plus size={14} />
                Add Solution
              </button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {solutions.map((sol, index) => (
              <div key={index} className="border border-gray-200 dark:border-gray-800 p-5 rounded-xl bg-gray-55 dark:bg-gray-900/30 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <CodeIcon size={14} className="text-gray-400" />
                    Solution #{index + 1}
                  </span>
                  {solutions.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => removeSolutionRow(index)}
                      className="text-xs font-bold text-red-500 hover:text-red-600 flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 size={13} /> Remove
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Language</Label>
                    <Select value={sol.language} onChange={(e) => handleSolutionChange(index, "language", e.target.value)}>
                      <option value="cpp">C++</option>
                      <option value="python">Python</option>
                      <option value="java">Java</option>
                      <option value="javascript">JavaScript</option>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs">Time Complexity</Label>
                    <Input placeholder="e.g. O(N)" value={sol.timeComplexity} onChange={(e) => handleSolutionChange(index, "timeComplexity", e.target.value)} />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs">Space Complexity</Label>
                    <Input placeholder="e.g. O(1)" value={sol.spaceComplexity} onChange={(e) => handleSolutionChange(index, "spaceComplexity", e.target.value)} />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs">Code Implementation</Label>
                  <Textarea rows={6} className="font-mono text-xs" placeholder="// Write code..." value={sol.code} onChange={(e) => handleSolutionChange(index, "code", e.target.value)} />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs">Explanation</Label>
                  <Textarea rows={2} placeholder="Explain the dynamic details of this solution..." value={sol.explanation} onChange={(e) => handleSolutionChange(index, "explanation", e.target.value)} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* SECTION 3: Resources & Attributes */}
        <Card>
          <CardHeader>
            <CardTitle>3. Resources & Advanced Metadata</CardTitle>
            <CardDescription>Setup tags, patterns, videos connection, and custom JSON fields.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="video_lectures">Video Lectures UUIDs (Comma separated)</Label>
                <Input id="video_lectures" placeholder="e.g. uuid-1, uuid-2" value={videoLecturesStr} onChange={(e) => setVideoLecturesStr(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="editorial">Official Editorial URL</Label>
                <Input id="editorial" type="url" placeholder="https://example.com/editorial" value={officialEditorialUrl} onChange={(e) => setOfficialEditorialUrl(e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="space-y-2">
                <Label htmlFor="difficulty_level">Difficulty Weight (1-10)</Label>
                 <Input id="difficulty_level" type="number" min={1} max={10} {...register("difficulty_level", { valueAsNumber: true })} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pattern">Pattern Category</Label>
                <Input id="pattern" placeholder="e.g. Sliding Window" {...register("pattern")} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags (Comma separated)</Label>
                <Input id="tags" placeholder="e.g. Arrays, Sorting" {...register("tags")} />
              </div>
            </div>

            {/* Custom attributes */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="custom_json">Custom JSON Attributes Bucket</Label>
                <span className={`text-[10px] font-bold uppercase ${isJsonValid ? "text-emerald-500" : "text-rose-500 animate-pulse"}`}>
                  {isJsonValid ? "Syntax Valid" : "Syntax Invalid"}
                </span>
              </div>
              <Textarea 
                id="custom_json"
                rows={5}
                value={customJsonStr}
                onChange={(e) => setCustomJsonStr(e.target.value)}
                className={`font-mono text-xs ${!isJsonValid && "border-red-500 bg-red-50/10 focus-visible:ring-red-500"}`}
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
                  "Save Changes"
                )}
              </button>
            </div>

          </CardContent>
        </Card>
      </form>
    </div>
  );
}
