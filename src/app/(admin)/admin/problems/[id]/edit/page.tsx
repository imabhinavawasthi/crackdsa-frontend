"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getStoredToken } from "@/functions/auth";
import Button from "@/components/ui/button/Button";
import { 
  ArrowLeft, 
  Save, 
  HelpCircle,
  FileText,
  Link as LinkIcon,
  Loader2,
  AlertCircle,
  Sparkles,
  Trash2,
  Plus,
  Code as CodeIcon,
  Tag
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import RichTextEditor from "@/components/ui/editor/RichTextEditor";

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

  // Primary form inputs state
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">("Easy");
  const [platform, setPlatform] = useState("Internal");
  const [problemUrl, setProblemUrl] = useState("");

  // Dynamic Solutions state
  const [solutions, setSolutions] = useState<SolutionRow[]>([]);

  // Primary resource inputs state
  const [videoLecturesStr, setVideoLecturesStr] = useState("");
  const [officialEditorialUrl, setOfficialEditorialUrl] = useState("");
  const [customResources, setCustomResources] = useState<CustomResourceRow[]>([]);

  // Attributes / Metadata state
  const [difficultyLevel, setDifficultyLevel] = useState<number>(5);
  const [pattern, setPattern] = useState("");
  const [tagsStr, setTagsStr] = useState("");
  const [customJsonStr, setCustomJsonStr] = useState("{}");
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
      
      setTitle(data.title);
      setSlug(data.slug);
      setDescription(data.description || "");
      setDifficulty(data.difficulty);
      setPlatform(data.platform);
      setProblemUrl(data.problem_url || "");

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
        setDifficultyLevel(data.attributes.difficulty_level ?? 5);
        setPattern(data.attributes.pattern || "");
        
        if (Array.isArray(data.attributes.tags)) {
          setTagsStr(data.attributes.tags.join(", "));
        }

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
  }, [id, backendUrl]);

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
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getStoredToken();
    if (!token || !id) return;

    if (!title.trim() || !slug.trim()) {
      setSubmitError("Title and URL Slug are required fields.");
      return;
    }

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
    parsedAttributes.difficulty_level = Number(difficultyLevel) || 5;
    if (pattern.trim()) {
      parsedAttributes.pattern = pattern.trim();
    }
    
    const tags = tagsStr.split(",").map(s => s.trim()).filter(Boolean);
    if (tags.length > 0) {
      parsedAttributes.tags = tags;
    }

    const payload = {
      title: title.trim(),
      slug: slug.trim(),
      description: description.trim() || null,
      difficulty,
      platform,
      problem_url: problemUrl.trim() || null,
      solutions: solutionsPayload,
      resources: resourcesPayload,
      attributes: parsedAttributes
    };

    try {
      setSubmitting(true);
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
    } finally {
      setSubmitting(false);
    }
  };

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
      {/* Top Navigation */}
      <div className="mb-6 flex items-center justify-between">
        <Link 
          href="/admin/problems"
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white uppercase tracking-wider transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Problems List
        </Link>
      </div>

      {/* Main Card container */}
      <div className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800/80 rounded-3xl p-6 sm:p-8 shadow-theme-xs space-y-8">
        
        {/* Title bar info */}
        <div className="border-b border-gray-100 dark:border-gray-800 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-500/10 text-brand-500 border border-brand-500/10 flex items-center justify-center">
              <Sparkles size={20} className="text-brand-500" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-gray-950 dark:text-white tracking-tight">
                Edit Practice Problem
              </h1>
              <p className="text-xs text-gray-400 font-semibold mt-0.5">
                Update challenge parameters, solution code blocks, and tags.
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
                  Problem Title <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Valid Palindrome"
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
                  placeholder="e.g. valid-palindrome"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, "-"))}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-transparent text-sm text-gray-950 dark:text-white font-mono focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4.5">
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
                  Difficulty Level <span className="text-red-500">*</span>
                </label>
                <select 
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as "Easy" | "Medium" | "Hard")}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-sm text-gray-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500 font-medium"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
                  Platform <span className="text-red-500">*</span>
                </label>
                <select 
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-sm text-gray-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500 font-medium"
                >
                  <option value="Internal">Internal</option>
                  <option value="LeetCode">LeetCode</option>
                  <option value="Codeforces">Codeforces</option>
                  <option value="HackerRank">HackerRank</option>
                  <option value="GeeksforGeeks">GeeksforGeeks</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
                  External URL Link
                </label>
                <input 
                  type="url"
                  placeholder="e.g. https://leetcode.com/problems/..."
                  value={problemUrl}
                  onChange={(e) => setProblemUrl(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-transparent text-sm text-gray-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500 font-medium"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: Description text editor */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-black uppercase text-gray-400 tracking-widest border-l-2 border-brand-500 pl-2">
                Problem Description & Constraints
              </label>
              <p className="text-[11px] text-gray-400 font-semibold mt-1 mb-2">
                Draft a beautiful problem description detailing formatting constraints, expected input-output cases, and time limits.
              </p>
            </div>
            
            <div className="border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden bg-gray-50/20 dark:bg-gray-900/50">
              <RichTextEditor 
                value={description}
                onChange={setDescription}
                placeholder="Write clear constraints, sample input/output examples, and algorithmic guidelines..."
              />
            </div>
          </div>

          {/* SECTION 3: Code Solutions */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-gray-150 dark:border-gray-800 pb-2">
              <h3 className="text-xs font-black uppercase text-gray-400 tracking-widest border-l-2 border-brand-500 pl-2">
                Coding Solutions
              </h3>
              <button 
                type="button"
                onClick={addSolutionRow}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-500 hover:text-brand-600 transition-colors uppercase tracking-wider"
              >
                <Plus size={14} />
                Add Language
              </button>
            </div>

            <div className="space-y-4">
              {solutions.map((sol, index) => (
                <div 
                  key={index}
                  className="border border-gray-150 dark:border-gray-800 p-4.5 rounded-2xl bg-gray-50/20 dark:bg-gray-800/10 space-y-4.5 relative"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-1">
                      <CodeIcon size={14} className="text-brand-500" />
                      Solution #{index + 1}
                    </span>
                    {solutions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSolutionRow(index)}
                        className="text-xs font-bold text-red-500 hover:text-red-600 flex items-center gap-1 uppercase tracking-wider transition-colors"
                      >
                        <Trash2 size={13} />
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                        Language Selector
                      </label>
                      <select 
                        value={sol.language}
                        onChange={(e) => handleSolutionChange(index, "language", e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-xs text-gray-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500 font-medium"
                      >
                        <option value="cpp">C++ (GCC)</option>
                        <option value="python">Python 3</option>
                        <option value="java">Java (JDK)</option>
                        <option value="javascript">JavaScript (Node)</option>
                        <option value="typescript">TypeScript</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                        Time Complexity
                      </label>
                      <input 
                        type="text"
                        placeholder="e.g. O(N log N)"
                        value={sol.timeComplexity}
                        onChange={(e) => handleSolutionChange(index, "timeComplexity", e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-transparent text-xs text-gray-950 dark:text-white font-mono focus:outline-none focus:ring-1 focus:ring-brand-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                        Space Complexity
                      </label>
                      <input 
                        type="text"
                        placeholder="e.g. O(1)"
                        value={sol.spaceComplexity}
                        onChange={(e) => handleSolutionChange(index, "spaceComplexity", e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-transparent text-xs text-gray-950 dark:text-white font-mono focus:outline-none focus:ring-1 focus:ring-brand-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                      Code Implementation
                    </label>
                    <textarea 
                      rows={6}
                      placeholder="// Write code here..."
                      value={sol.code}
                      onChange={(e) => handleSolutionChange(index, "code", e.target.value)}
                      className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-transparent text-xs text-gray-950 dark:text-white font-mono focus:outline-none focus:ring-1 focus:ring-brand-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                      Solution Explanation
                    </label>
                    <textarea 
                      rows={2}
                      placeholder="Briefly describe the algorithmic core of this solution..."
                      value={sol.explanation}
                      onChange={(e) => handleSolutionChange(index, "explanation", e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-transparent text-xs text-gray-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500 font-medium"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 4: Linked Resources */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase text-gray-400 tracking-widest border-l-2 border-brand-500 pl-2">
              Connected Learning Resources
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide flex items-center gap-1">
                  Video Lectures References
                  <span title="Comma-separated UUID keys of platform video lectures">
                    <HelpCircle size={12} className="text-gray-400 cursor-help" />
                  </span>
                </label>
                <input 
                  type="text"
                  placeholder="e.g. 550e8400-e29b-41d4-a716-446655440000, ..."
                  value={videoLecturesStr}
                  onChange={(e) => setVideoLecturesStr(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-transparent text-sm text-gray-950 dark:text-white font-mono focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
                  Official Editorial URL
                </label>
                <input 
                  type="url"
                  placeholder="e.g. https://leetcode.com/problems/.../editorial/"
                  value={officialEditorialUrl}
                  onChange={(e) => setOfficialEditorialUrl(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-transparent text-sm text-gray-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500 font-medium"
                />
              </div>
            </div>

            {/* Dynamic Custom Resources Key-Value rows */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide flex items-center gap-1">
                  Custom Platform Links
                  <span title="Link blogs, cheatsheets, or external worksheets dynamically">
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
                        placeholder="Key (e.g. blogs)"
                        required
                        value={row.key}
                        onChange={(e) => handleCustomResourceChange(index, "key", e.target.value)}
                        className="w-1/3 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-850 bg-white dark:bg-gray-900 text-xs text-gray-950 dark:text-white font-mono focus:outline-none focus:ring-1 focus:ring-brand-500"
                      />
                      <input 
                        type="text"
                        placeholder="Comma-separated URLs"
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
              Advanced Attributes & Sorting Metadata
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4.5">
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
                  Difficulty Level Weight (1-10)
                </label>
                <input 
                  type="number"
                  min={1}
                  max={10}
                  required
                  value={difficultyLevel}
                  onChange={(e) => setDifficultyLevel(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-transparent text-sm text-gray-950 dark:text-white font-mono focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
                  Pattern Classification
                </label>
                <input 
                  type="text"
                  placeholder="e.g. Two Pointers"
                  value={pattern}
                  onChange={(e) => setPattern(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-transparent text-sm text-gray-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide flex items-center gap-1">
                  Tag Classification
                  <span title="Comma-separated categorization tags">
                    <HelpCircle size={12} className="text-gray-400 cursor-help" />
                  </span>
                </label>
                <input 
                  type="text"
                  placeholder="e.g. Two Pointers, Strings, Arrays"
                  value={tagsStr}
                  onChange={(e) => setTagsStr(e.target.value)}
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
                Practice Problem updated successfully! Redirecting back to catalog catalog...
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3.5 border-t border-gray-100 dark:border-gray-800 pt-5">
            <Button 
              type="button"
              variant="outline"
              size="sm"
              onClick={() => router.push("/admin/problems")}
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
              {submitting ? "Saving Changes..." : "Save Changes"}
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
}
