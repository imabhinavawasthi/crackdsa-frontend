"use client";

import { BACKEND_URL } from "@/config/api";
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
  CheckCircle2,
  X,
  Video,
  FileText,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Sparkles,
  Link as LinkIcon
} from "lucide-react";
import Link from "next/link";
import RichTextEditor from "@/components/ui/editor/RichTextEditor";

const problemSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  difficulty: z.enum(["Easy", "Medium", "Hard"]),
  platform: z.string().min(1, "Platform is required"),
  problem_url: z.string().url("Must be a valid URL").or(z.literal("")).nullable().optional(),
  tags: z.string().nullable().optional(),
  company_tags: z.string().nullable().optional(),
  is_active: z.boolean(),
});

type ProblemFormValues = z.infer<typeof problemSchema>;

type LanguageSolution = {
  enabled: boolean;
  code: string;
  explanation: string;
  timeComplexity: string;
  spaceComplexity: string;
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
    related_articles?: Array<{ id: string; title: string; slug: string }>;
    blogs?: Array<{ id: string; title: string; slug: string }>;
    [key: string]: any;
  };
  attributes: {
    tags?: string[];
    company_tags?: string[];
    hints?: string[];
    [key: string]: any;
  };
  is_active: boolean;
};

function detectPlatformFromUrl(url: string): string | null {
  if (!url) return null;
  const lower = url.toLowerCase();
  if (lower.includes("leetcode.com")) return "LeetCode";
  if (lower.includes("geeksforgeeks.org") || lower.includes("gfg.org")) return "GeeksforGeeks";
  if (lower.includes("codeforces.com")) return "Codeforces";
  if (lower.includes("codechef.com")) return "CodeChef";
  if (lower.includes("hackerrank.com")) return "HackerRank";
  if (lower.includes("interviewbit.com")) return "InterviewBit";
  if (lower.includes("cses.fi")) return "CSES";
  if (lower.includes("atcoder.jp")) return "AtCoder";
  if (lower.includes("lintcode.com")) return "LintCode";
  if (lower.includes("hackerearth.com")) return "HackerEarth";
  return null;
}

const LANGUAGES = [
  { key: "cpp", label: "C++" },
  { key: "python", label: "Python" },
  { key: "java", label: "Java" },
  { key: "javascript", label: "JavaScript" }
];

export default function EditPracticeProblemPage() {
  const { user, isLoading: authLoading, isLoggedIn } = useAuth();
  const params = useParams();
  const router = useRouter();
  
  const id = params?.id as string;
  const backendUrl = BACKEND_URL;

  // Loading states
  const [fetching, setFetching] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Form setup
  const { register, handleSubmit, reset, watch, setValue, formState: { errors, isSubmitting } } = useForm<ProblemFormValues>({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      title: "",
      slug: "",
      difficulty: "Easy",
      platform: "Internal",
      problem_url: "",
      tags: "",
      company_tags: "",
      is_active: true
    }
  });

  // Watch variables for slug generation & platform auto-detection
  const titleWatch = watch("title");
  const urlWatch = watch("problem_url");

  // State management
  const [slugSync, setSlugSync] = useState(false); // Default to false on edit to avoid overwriting existing slug
  const [description, setDescription] = useState("");
  const [isPlatformManuallyChanged, setIsPlatformManuallyChanged] = useState(false);

  // Solutions Accordion State
  const [solutionsState, setSolutionsState] = useState<Record<string, LanguageSolution>>({
    cpp: { enabled: false, code: "", explanation: "", timeComplexity: "O(N)", spaceComplexity: "O(1)" },
    python: { enabled: false, code: "", explanation: "", timeComplexity: "O(N)", spaceComplexity: "O(1)" },
    java: { enabled: false, code: "", explanation: "", timeComplexity: "O(N)", spaceComplexity: "O(1)" },
    javascript: { enabled: false, code: "", explanation: "", timeComplexity: "O(N)", spaceComplexity: "O(1)" }
  });
  const [activeAccordion, setActiveAccordion] = useState<string>("cpp");

  // Hints State
  const [hints, setHints] = useState<string[]>([]);

  // Resources Assets States
  const [availableVideos, setAvailableVideos] = useState<any[]>([]);
  const [availableArticles, setAvailableArticles] = useState<any[]>([]);
  const [loadingAssets, setLoadingAssets] = useState(false);
  const [selectedVideoIds, setSelectedVideoIds] = useState<string[]>([]);
  const [selectedArticleIds, setSelectedArticleIds] = useState<string[]>([]);

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Auto-generate slug from title (if sync is enabled)
  useEffect(() => {
    if (slugSync && titleWatch) {
      const cleanSlug = titleWatch
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setValue("slug", cleanSlug, { shouldValidate: true });
    }
  }, [titleWatch, slugSync, setValue]);

  // Auto-detect platform from problem URL
  useEffect(() => {
    if (!isPlatformManuallyChanged && urlWatch) {
      const detected = detectPlatformFromUrl(urlWatch);
      if (detected) {
        setValue("platform", detected);
      }
    }
  }, [urlWatch, isPlatformManuallyChanged, setValue]);

  // Fetch Available Assets for Dropdowns
  const fetchAssetsCatalog = useCallback(async () => {
    const token = getStoredToken();
    const headers = token ? { "Authorization": `Bearer ${token}` } : undefined;
    setLoadingAssets(true);
    try {
      const [videosRes, articlesRes] = await Promise.all([
        fetch(`${backendUrl}/api/v1/admin/video-lectures`, { headers }),
        fetch(`${backendUrl}/api/v1/admin/articles`, { headers })
      ]);
      if (videosRes.ok) {
        const vData = await videosRes.json();
        setAvailableVideos(vData || []);
      }
      if (articlesRes.ok) {
        const aData = await articlesRes.json();
        setAvailableArticles(aData || []);
      }
    } catch (err) {
      console.error("Failed to fetch assets catalog:", err);
    } finally {
      setLoadingAssets(false);
    }
  }, [backendUrl]);

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
        tags: Array.isArray(data.attributes?.tags) ? data.attributes.tags.join(", ") : "",
        company_tags: Array.isArray(data.attributes?.company_tags) ? data.attributes.company_tags.join(", ") : "",
        is_active: data.is_active ?? true
      });

      setDescription(data.description || "");

      // Load Solutions Accordion State
      const initialSols: Record<string, LanguageSolution> = {
        cpp: { enabled: false, code: "", explanation: "", timeComplexity: "O(N)", spaceComplexity: "O(1)" },
        python: { enabled: false, code: "", explanation: "", timeComplexity: "O(N)", spaceComplexity: "O(1)" },
        java: { enabled: false, code: "", explanation: "", timeComplexity: "O(N)", spaceComplexity: "O(1)" },
        javascript: { enabled: false, code: "", explanation: "", timeComplexity: "O(N)", spaceComplexity: "O(1)" }
      };

      if (data.solutions) {
        Object.entries(data.solutions).forEach(([lang, val]) => {
          if (initialSols[lang]) {
            initialSols[lang] = {
              enabled: true,
              code: val.code || "",
              explanation: val.explanation || "",
              timeComplexity: val.time_complexity || "O(N)",
              spaceComplexity: val.space_complexity || "O(1)"
            };
          }
        });
      }
      setSolutionsState(initialSols);

      // Set active tab to the first enabled language, or default to cpp
      const firstEnabled = Object.keys(initialSols).find(l => initialSols[l].enabled);
      if (firstEnabled) {
        setActiveAccordion(firstEnabled);
      }

      // Load Hints State
      if (data.attributes && Array.isArray(data.attributes.hints)) {
        setHints(data.attributes.hints);
      } else {
        setHints([]);
      }

      // Load Resources Assets
      if (data.resources) {
        if (Array.isArray(data.resources.video_lectures)) {
          setSelectedVideoIds(data.resources.video_lectures);
        }
        
        let loadedArticleIds: string[] = [];
        if (Array.isArray(data.resources.related_articles)) {
          loadedArticleIds = data.resources.related_articles.map((a: any) => a.id || a.slug || a);
        } else if (Array.isArray(data.resources.blogs)) {
          loadedArticleIds = data.resources.blogs.map((b: any) => b.id || b.slug || b);
        }
        setSelectedArticleIds(loadedArticleIds);
      }

    } catch (err: unknown) {
      console.error("Failed to fetch practice problem detail:", err);
      const errMessage = err instanceof Error ? err.message : String(err);
      setFetchError(errMessage || "Unable to retrieve practice problem metadata.");
    } finally {
      setFetching(false);
    }
  }, [id, backendUrl, reset]);

  // Initial Data Fetch
  useEffect(() => {
    if (isLoggedIn && user?.roles?.includes("admin")) {
      fetchAssetsCatalog().then(() => {
        loadProblemDetails();
      });
    }
  }, [isLoggedIn, user, fetchAssetsCatalog, loadProblemDetails]);

  // Solutions Accordion handlers
  const handleSolutionFieldChange = (lang: string, field: keyof LanguageSolution, val: any) => {
    setSolutionsState(prev => ({
      ...prev,
      [lang]: {
        ...prev[lang],
        [field]: val
      }
    }));
  };

  // Hints Handlers
  const handleAddHint = () => setHints(prev => [...prev, ""]);
  const handleRemoveHint = (index: number) => setHints(prev => prev.filter((_, i) => i !== index));
  const handleHintChange = (index: number, val: string) => {
    const updated = [...hints];
    updated[index] = val;
    setHints(updated);
  };

  const onSubmit = async (values: ProblemFormValues) => {
    setSubmitError(null);
    const token = getStoredToken();
    if (!token || !id) return;

    // 1. Build solutions payload
    const solutionsPayload: Record<string, any> = {};
    Object.entries(solutionsState).forEach(([lang, data]) => {
      if (data.enabled && data.code.trim()) {
        solutionsPayload[lang] = {
          code: data.code.trim(),
          explanation: data.explanation.trim() || null,
          time_complexity: data.timeComplexity.trim() || null,
          space_complexity: data.spaceComplexity.trim() || null
        };
      }
    });

    // 2. Build resources payload
    const related_articles = selectedArticleIds.map(artId => {
      const art = availableArticles.find(a => a.id === artId);
      return art ? { id: art.id, title: art.title, slug: art.slug } : null;
    }).filter(Boolean);

    const resourcesPayload = {
      video_lectures: selectedVideoIds,
      related_articles: related_articles
    };

    // 3. Build attributes payload
    const tagsArray = values.tags ? values.tags.split(",").map(s => s.trim()).filter(Boolean) : [];
    const companyTagsArray = values.company_tags ? values.company_tags.split(",").map(s => s.trim()).filter(Boolean) : [];
    const filteredHints = hints.map(h => h.trim()).filter(Boolean);

    const attributesPayload = {
      tags: tagsArray,
      company_tags: companyTagsArray,
      hints: filteredHints
    };

    const payload = {
      title: values.title.trim(),
      slug: values.slug.trim(),
      description: description.trim() || null,
      difficulty: values.difficulty,
      platform: values.platform,
      problem_url: values.problem_url || null,
      solutions: solutionsPayload,
      resources: resourcesPayload,
      attributes: attributesPayload,
      is_active: values.is_active
    };

    try {
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
      console.error("Submission failed:", err);
      const errMessage = err instanceof Error ? err.message : String(err);
      setSubmitError(errMessage || "An unexpected error occurred while saving.");
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 size={32} className="animate-spin text-brand-500" />
        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Verifying secure admin parameters...</p>
      </div>
    );
  }

  if (!isLoggedIn || !user?.roles?.includes("admin")) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-900 border border-gray-250 dark:border-gray-800 rounded-3xl p-8 shadow-lg text-center space-y-6">
          <div className="w-16 h-16 bg-red-500/10 text-red-500 border border-red-500/10 rounded-2xl flex items-center justify-center mx-auto">
            <Lock size={30} />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">Access Prohibited</h1>
            <p className="text-sm text-gray-505 dark:text-gray-400 leading-relaxed font-medium">
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
        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Loading practice problem metadata...</p>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-white dark:bg-gray-900 border border-gray-250 dark:border-gray-800 rounded-3xl text-center space-y-5">
        <div className="w-14 h-14 bg-red-500/10 text-red-500 border border-red-500/10 rounded-2xl flex items-center justify-center mx-auto">
          <AlertCircle size={28} />
        </div>
        <div className="space-y-1.5">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Failed to Load Asset</h2>
          <p className="text-xs text-gray-450 dark:text-gray-400 leading-relaxed font-medium">{fetchError}</p>
        </div>
        <Link 
          href="/admin/problems" 
          className="inline-flex w-full items-center justify-center px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 text-xs font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
        >
          Return to Problems List
        </Link>
      </div>
    );
  }

  // Multi-select helpers
  const unselectedVideos = availableVideos.filter(v => !selectedVideoIds.includes(v.id));
  const unselectedArticles = availableArticles.filter(a => !selectedArticleIds.includes(a.id));

  return (
    <div className="max-w-5xl mx-auto pb-24 px-4 select-none">
      {/* Top Breadcrumb Header */}
      <div className="mb-8 flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-5">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-650 dark:text-gray-400 hover:bg-gray-55 dark:hover:bg-gray-800 transition-all shadow-sm"
            title="Go Back"
          >
            <ArrowLeft size={16} className="stroke-[2.5]" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">
              Edit Practice Problem
            </h1>
            <p className="text-xs text-gray-450 dark:text-gray-505 font-medium mt-0.5">
              Update challenge parameters, solution code blocks, and tags.
            </p>
          </div>
        </div>
      </div>

      {/* State Alerts */}
      {submitError && (
        <div className="bg-red-500/5 border border-red-500/10 rounded-2xl p-4 flex items-start gap-3 mb-6">
          <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
          <div className="text-xs font-medium text-red-650 leading-relaxed">
            {submitError}
          </div>
        </div>
      )}

      {submitSuccess && (
        <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-4 flex items-start gap-3 mb-6">
          <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" />
          <div className="text-xs font-semibold text-emerald-650">
            Practice Problem updated successfully! Redirecting...
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Primary Specifications */}
        <div className="lg:col-span-2 space-y-8">
          
          <Card className="border border-gray-205 dark:border-gray-800 shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-gray-100 dark:border-gray-855 bg-gray-50/20 dark:bg-gray-900/10 py-5">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-gray-850 dark:text-gray-300">
                1. Core Specifications
              </CardTitle>
              <CardDescription className="text-xs font-medium text-gray-450 dark:text-gray-500">
                Setup titles, slugs, and the challenge statement.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-xs font-medium text-gray-700 dark:text-gray-300">Problem Title *</Label>
                  <Input 
                    id="title" 
                    placeholder="e.g. Valid Palindrome" 
                    className="h-10 text-xs font-medium rounded-xl border-gray-200 dark:border-gray-800 focus:ring-brand-500 focus:border-brand-500" 
                    {...register("title")} 
                  />
                  {errors.title && (
                    <p className="text-xs text-red-500 font-medium mt-1">{errors.title.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="slug" className="text-xs font-medium text-gray-700 dark:text-gray-300">URL Slug *</Label>
                    <button
                      type="button"
                      onClick={() => setSlugSync(prev => !prev)}
                      className={`text-[9px] font-medium px-2 py-0.5 rounded-full border transition-all ${
                        slugSync 
                          ? "bg-brand-500/10 text-brand-500 border-brand-500/10" 
                          : "bg-gray-100 text-gray-500 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700"
                      }`}
                    >
                      {slugSync ? "Auto-Sync" : "Manual Edit"}
                    </button>
                  </div>
                  <Input 
                    id="slug" 
                    placeholder="e.g. valid-palindrome" 
                    className="h-10 text-xs font-medium rounded-xl border-gray-200 dark:border-gray-800 focus:ring-brand-500 focus:border-brand-500" 
                    {...register("slug")} 
                    readOnly={slugSync}
                  />
                  {errors.slug && (
                    <p className="text-xs text-red-500 font-medium mt-1">{errors.slug.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="space-y-2 sm:col-span-2">
                  <div className="flex items-center gap-1.5">
                    <Label htmlFor="problem_url" className="text-xs font-medium text-gray-700 dark:text-gray-300">Problem URL</Label>
                    <Sparkles size={11} className="text-brand-500" />
                    <span className="text-[9px] font-medium text-brand-500 dark:text-brand-400 uppercase tracking-widest">Platform Auto-Detects</span>
                  </div>
                  <div className="relative">
                    <Input 
                      id="problem_url" 
                      type="url"
                      placeholder="https://leetcode.com/problems/valid-palindrome/" 
                      className="h-10 text-xs font-medium rounded-xl pl-8 border-gray-200 dark:border-gray-800 focus:ring-brand-500 focus:border-brand-500" 
                      {...register("problem_url")} 
                    />
                    <LinkIcon size={12} className="absolute left-3 top-3.5 text-gray-400" />
                  </div>
                  {errors.problem_url && (
                    <p className="text-xs text-red-500 font-medium mt-1">{errors.problem_url.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="platform" className="text-xs font-medium text-gray-700 dark:text-gray-300">Platform *</Label>
                  <Select 
                    id="platform" 
                    className="h-10 text-xs font-medium rounded-xl"
                    {...register("platform", {
                      onChange: () => setIsPlatformManuallyChanged(true)
                    })}
                  >
                    <option value="Internal">Internal</option>
                    <option value="LeetCode">LeetCode</option>
                    <option value="GeeksforGeeks">GeeksforGeeks</option>
                    <option value="Codeforces">Codeforces</option>
                    <option value="CodeChef">CodeChef</option>
                    <option value="HackerRank">HackerRank</option>
                    <option value="InterviewBit">InterviewBit</option>
                    <option value="CSES">CSES</option>
                    <option value="AtCoder">AtCoder</option>
                    <option value="LintCode">LintCode</option>
                    <option value="HackerEarth">HackerEarth</option>
                    <option value="Other">Other</option>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-medium text-gray-700 dark:text-gray-300">Description</Label>
                <div className="border border-gray-250 dark:border-gray-800 rounded-xl overflow-hidden bg-white dark:bg-gray-900">
                  <RichTextEditor value={description} onChange={setDescription} />
                </div>
              </div>

            </CardContent>
          </Card>

          {/* Solutions Accordion Section */}
          <Card className="border border-gray-205 dark:border-gray-800 shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-gray-100 dark:border-gray-855 bg-gray-50/20 dark:bg-gray-900/10 py-5">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-gray-850 dark:text-gray-300">
                2. Programmatic Solutions
              </CardTitle>
              <CardDescription className="text-xs font-medium text-gray-450 dark:text-gray-500">
                Setup clean, language-specific code templates and time/space complexity metadata.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              
              {LANGUAGES.map((lang) => {
                const solution = solutionsState[lang.key];
                const isOpen = activeAccordion === lang.key;
                
                return (
                  <div 
                    key={lang.key} 
                    className={`border rounded-xl overflow-hidden transition-all ${
                      solution.enabled 
                        ? "border-brand-500/20 bg-brand-500/[0.01]" 
                        : "border-gray-250 dark:border-gray-800"
                    }`}
                  >
                    {/* Accordion Trigger Header */}
                    <div 
                      onClick={() => setActiveAccordion(isOpen ? "" : lang.key)}
                      className="flex items-center justify-between px-4 py-3 bg-gray-55/40 dark:bg-gray-905/30 hover:bg-gray-55 dark:hover:bg-gray-800/50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={solution.enabled}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleSolutionFieldChange(lang.key, "enabled", e.target.checked);
                          }}
                          className="h-3.5 w-3.5 rounded border-gray-200 dark:border-gray-700 text-brand-500 focus:ring-brand-500"
                        />
                        <span className={`text-xs font-medium tracking-wide ${solution.enabled ? "text-gray-800 dark:text-white" : "text-gray-450"}`}>
                          {lang.label} Solution
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {solution.enabled && (
                          <span className="text-[8px] font-semibold px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/10">
                            Active
                          </span>
                        )}
                        {isOpen ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
                      </div>
                    </div>

                    {/* Accordion Expandable Content */}
                    {isOpen && (
                      <div className="p-4 border-t border-gray-100 dark:border-gray-855 space-y-4 bg-white dark:bg-gray-900/20">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <Label className="text-[10px] font-medium text-gray-405 dark:text-gray-500">Time Complexity</Label>
                            <Input 
                              placeholder="e.g. O(N)" 
                              value={solution.timeComplexity}
                              onChange={(e) => handleSolutionFieldChange(lang.key, "timeComplexity", e.target.value)}
                              className="h-9 text-xs font-medium rounded-lg"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-[10px] font-medium text-gray-405 dark:text-gray-500">Space Complexity</Label>
                            <Input 
                              placeholder="e.g. O(1)" 
                              value={solution.spaceComplexity}
                              onChange={(e) => handleSolutionFieldChange(lang.key, "spaceComplexity", e.target.value)}
                              className="h-9 text-xs font-medium rounded-lg"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <Label className="text-[10px] font-medium text-gray-450 dark:text-gray-500 font-mono">Code Implementation</Label>
                          <Textarea 
                            rows={8} 
                            placeholder={`// Write clean ${lang.label} solution code...`}
                            value={solution.code}
                            onChange={(e) => handleSolutionFieldChange(lang.key, "code", e.target.value)}
                            className="font-mono text-xs p-3 rounded-lg border-gray-250 dark:border-gray-800 bg-gray-950 text-gray-200"
                          />
                        </div>

                        <div className="space-y-1">
                          <Label className="text-[10px] font-medium text-gray-450 dark:text-gray-500">Explanation</Label>
                          <Textarea 
                            rows={3} 
                            placeholder="Explain the intuition, algorithms, and key steps..."
                            value={solution.explanation}
                            onChange={(e) => handleSolutionFieldChange(lang.key, "explanation", e.target.value)}
                            className="text-xs font-medium rounded-lg"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

            </CardContent>
          </Card>

        </div>

        {/* Right Column: Difficulty, Metadata & Resources */}
        <div className="space-y-8">
          
          {/* Difficulty & Attributes Card */}
          <Card className="border border-gray-255 dark:border-gray-800 shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-gray-100 dark:border-gray-855 bg-gray-50/20 dark:bg-gray-900/10 py-5">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-gray-850 dark:text-gray-300">
                3. Metadata & Tags
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-5">
              
              <div className="space-y-2">
                <Label htmlFor="difficulty" className="text-xs font-medium text-gray-700 dark:text-gray-300">Difficulty Level *</Label>
                <Select id="difficulty" className="h-10 text-xs font-medium rounded-xl" {...register("difficulty")}>
                  <option value="Easy">🟢 Easy</option>
                  <option value="Medium">🟡 Medium</option>
                  <option value="Hard">🔴 Hard</option>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags" className="text-xs font-medium text-gray-700 dark:text-gray-300">Topic Tags (Comma separated)</Label>
                <Input 
                  id="tags" 
                  placeholder="e.g. Arrays, Two Pointers, Hashing" 
                  className="h-10 text-xs font-medium rounded-xl"
                  {...register("tags")} 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company_tags" className="text-xs font-medium text-gray-700 dark:text-gray-300">Company Tags (Comma separated)</Label>
                <Input 
                  id="company_tags" 
                  placeholder="e.g. Google, Amazon, Facebook" 
                  className="h-10 text-xs font-medium rounded-xl"
                  {...register("company_tags")} 
                />
              </div>

              {/* is_active checkbox */}
              <div className="flex items-center gap-2.5 bg-gray-50/40 dark:bg-gray-900/10 p-3 rounded-xl border border-gray-100 dark:border-gray-855">
                <input
                  id="is_active"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-200 dark:border-gray-700 text-brand-500 focus:ring-brand-500"
                  {...register("is_active")}
                />
                <div>
                  <Label htmlFor="is_active" className="text-xs font-medium text-gray-800 dark:text-gray-200 cursor-pointer">
                    Publish Problem
                  </Label>
                  <p className="text-[10px] text-gray-400 font-medium mt-0.5">
                    Make this problem immediately visible to students.
                  </p>
                </div>
              </div>

            </CardContent>
          </Card>

          {/* Interactive Hints Card */}
          <Card className="border border-gray-255 dark:border-gray-800 shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-gray-100 dark:border-gray-855 bg-gray-50/20 dark:bg-gray-900/10 py-5">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xs font-semibold uppercase tracking-wider text-gray-850 dark:text-gray-300">
                    4. Hints & Clues
                  </CardTitle>
                </div>
                <button
                  type="button"
                  onClick={handleAddHint}
                  className="inline-flex items-center gap-1 text-[10px] font-medium uppercase px-2.5 py-1 rounded-lg bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:opacity-90 transition-opacity cursor-pointer"
                >
                  <Plus size={12} />
                  Add Hint
                </button>
              </div>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              
              {hints.map((hint, index) => (
                <div key={index} className="flex gap-2 items-start bg-gray-50/30 dark:bg-gray-900/10 border border-gray-100 dark:border-gray-800 p-3 rounded-xl relative">
                  <div className="flex-1 space-y-1">
                    <Label className="text-[9px] font-medium text-gray-405 uppercase tracking-widest">
                      Hint #{index + 1}
                    </Label>
                    <Textarea
                      rows={2}
                      placeholder="e.g. Try sorting the array first..."
                      value={hint}
                      onChange={(e) => handleHintChange(index, e.target.value)}
                      className="text-xs font-medium rounded-lg"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveHint(index)}
                    className="text-gray-400 hover:text-red-500 p-1.5 transition-colors shrink-0 mt-3"
                    title="Remove Hint"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}

              {hints.length === 0 && (
                <div className="text-center py-6 border-2 border-dashed border-gray-200 dark:border-gray-855 rounded-xl">
                  <Lightbulb size={22} className="text-gray-300 dark:text-gray-650 mx-auto mb-1.5" />
                  <p className="text-xs text-gray-400 font-medium">No Hints configured</p>
                  <p className="text-[10px] text-gray-450 mt-0.5">Click "Add Hint" to provide hints for students.</p>
                </div>
              )}

            </CardContent>
          </Card>

          {/* Connected Resources Card */}
          <Card className="border border-gray-255 dark:border-gray-800 shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-gray-100 dark:border-gray-855 bg-gray-50/20 dark:bg-gray-900/10 py-5">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-gray-850 dark:text-gray-300">
                5. Related Assets
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-6">
              
              {/* Videos select */}
              <div className="space-y-2">
                <Label className="text-xs font-medium text-gray-700 dark:text-gray-300">Link Video Lectures</Label>
                <Select
                  value=""
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val) {
                      setSelectedVideoIds(prev => [...prev, val]);
                    }
                  }}
                  className="h-10 text-xs font-medium rounded-xl"
                  disabled={loadingAssets}
                >
                  <option value="">-- Choose video lectures --</option>
                  {unselectedVideos.map(v => (
                    <option key={v.id} value={v.id}>🎥 {v.title}</option>
                  ))}
                </Select>

                {/* Video list */}
                <div className="space-y-2 mt-3">
                  {selectedVideoIds.map(id => {
                    const video = availableVideos.find(v => v.id === id);
                    if (!video) return null;
                    return (
                      <div key={id} className="flex items-center justify-between bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-2.5 rounded-xl text-xs font-semibold">
                        <div className="flex items-center gap-2 text-gray-800 dark:text-gray-200 truncate pr-2">
                          <Video size={13} className="text-brand-500 shrink-0" />
                          <span className="truncate">{video.title}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setSelectedVideoIds(prev => prev.filter(vid => vid !== id))}
                          className="text-gray-400 hover:text-red-500 transition-colors p-1 shrink-0"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    );
                  })}
                  {selectedVideoIds.length === 0 && (
                    <p className="text-[10px] text-gray-450 italic font-semibold">No video lectures linked.</p>
                  )}
                </div>
              </div>

              {/* Articles select */}
              <div className="space-y-2">
                <Label className="text-xs font-medium text-gray-700 dark:text-gray-300">Link Editorials & Articles</Label>
                <Select
                  value=""
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val) {
                      setSelectedArticleIds(prev => [...prev, val]);
                    }
                  }}
                  className="h-10 text-xs font-medium rounded-xl"
                  disabled={loadingAssets}
                >
                  <option value="">-- Choose related articles --</option>
                  {unselectedArticles.map(a => (
                    <option key={a.id} value={a.id}>📄 {a.title}</option>
                  ))}
                </Select>

                {/* Articles list */}
                <div className="space-y-2 mt-3">
                  {selectedArticleIds.map(id => {
                    const article = availableArticles.find(a => a.id === id);
                    if (!article) return null;
                    return (
                      <div key={id} className="flex items-center justify-between bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-2.5 rounded-xl text-xs font-semibold">
                        <div className="flex items-center gap-2 text-gray-800 dark:text-gray-200 truncate pr-2">
                          <FileText size={13} className="text-orange-500 shrink-0" />
                          <span className="truncate">{article.title}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setSelectedArticleIds(prev => prev.filter(artId => artId !== id))}
                          className="text-gray-400 hover:text-red-500 transition-colors p-1 shrink-0"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    );
                  })}
                  {selectedArticleIds.length === 0 && (
                    <p className="text-[10px] text-gray-450 italic font-semibold">No conceptual articles linked.</p>
                  )}
                </div>
              </div>

            </CardContent>
          </Card>

          {/* Form Action buttons */}
          <div className="flex items-center gap-3 pt-2 justify-end">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 px-4 py-2.5 text-xs font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-xl transition-all shadow-sm cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 inline-flex items-center justify-center px-4 py-2.5 text-xs font-medium text-white bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-gray-200 dark:text-gray-900 rounded-xl shadow-md disabled:opacity-50 transition-all cursor-pointer"
            >
              {isSubmitting ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                "Save Changes"
              )}
            </button>
          </div>

        </div>

      </form>
    </div>
  );
}
