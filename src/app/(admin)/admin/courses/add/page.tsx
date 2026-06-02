"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getStoredToken } from "@/functions/auth";
import Button from "@/components/ui/button/Button";
import { 
  Lock, 
  ArrowLeft, 
  Save, 
  BookOpen, 
  HelpCircle,
  FileText,
  Video,
  Loader2,
  AlertCircle,
  Sparkles,
  Trash2,
  Plus,
  Code as CodeIcon,
  Tag,
  Layers,
  Users,
  DollarSign,
  ChevronDown,
  ChevronRight,
  Eye
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import RichTextEditor from "@/components/ui/editor/RichTextEditor";
import SearchableComboBox from "@/components/common/SearchableComboBox";

type Instructor = {
  id: string;
  name: string;
  role: string;
  profile_image_url?: string;
  metadata: {
    color?: string;
    company?: string;
  };
};

type CourseSectionItem = {
  id: string;
  title: string;
  type: "video" | "problem" | "article";
  asset_id: string;
  is_free: boolean;
  duration_label?: string | null;
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
  items?: CourseSectionItem[] | null;
  subsections?: CourseSubsection[] | null;
};

export default function AddCoursePage() {
  const { user, isLoading: authLoading, isLoggedIn } = useAuth();
  const router = useRouter();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

  // 1. Basic Metadata States
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<"interview-prep" | "core-dsa" | "system-design" | "advanced">("interview-prep");
  const [tagsStr, setTagsStr] = useState("");
  
  // 2. Pricing Tiers States
  const [price, setPrice] = useState<number>(0);
  const [originalPrice, setOriginalPrice] = useState<number>(0);
  const [isPro, setIsPro] = useState(true);
  const [isPopular, setIsPopular] = useState(false);
  const [status, setStatus] = useState<"draft" | "active" | "upcoming">("draft");

  // 3. Reusable Instructor States
  const [instructorsList, setInstructorsList] = useState<Instructor[]>([]);
  const [selectedInstructorIds, setSelectedInstructorIds] = useState<string[]>([]);
  const [loadingInstructors, setLoadingInstructors] = useState(true);

  // 4. Curriculum Builders States
  const [curriculum, setCurriculum] = useState<CourseSection[]>([]);
  const [editorMode, setEditorMode] = useState<"visual" | "json">("visual");
  const [rawJsonStr, setRawJsonStr] = useState("[]");
  const [isJsonValid, setIsJsonValid] = useState(true);
  const [jsonError, setJsonError] = useState<string | null>(null);

  // Dropdown lists for curriculum builders
  const [availableVideos, setAvailableVideos] = useState<any[]>([]);
  const [availableProblems, setAvailableProblems] = useState<any[]>([]);
  const [availableArticles, setAvailableArticles] = useState<any[]>([]);
  const [loadingAssets, setLoadingAssets] = useState(false);
  const [customModeItems, setCustomModeItems] = useState<Record<string, boolean>>({});

  const toggleCustomMode = (itemId: string) => {
    setCustomModeItems(prev => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  const getComboboxOptions = (itemType: "video" | "problem" | "article") => {
    if (itemType === "video") {
      return availableVideos.map(v => ({
        id: v.id,
        title: v.title,
        extra: v.video_url
      }));
    }
    if (itemType === "problem") {
      return availableProblems.map(p => ({
        id: p.id,
        title: p.title,
        extra: `[${p.platform || "DSA"}] ${p.slug}`
      }));
    }
    if (itemType === "article") {
      return availableArticles.map(a => ({
        id: a.id,
        title: a.title,
        extra: a.slug
      }));
    }
    return [];
  };

  useEffect(() => {
    const fetchAllAssets = async () => {
      try {
        setLoadingAssets(true);
        const token = getStoredToken();
        const headers = token ? { "Authorization": `Bearer ${token}` } : undefined;
        
        const videosRes = await fetch(`${backendUrl}/api/v1/video-lectures`, { headers });
        if (videosRes.ok) {
          const videosData = await videosRes.json();
          setAvailableVideos(videosData || []);
        }
        
        const problemsRes = await fetch(`${backendUrl}/api/v1/practice-problems`, { headers });
        if (problemsRes.ok) {
          const problemsData = await problemsRes.json();
          setAvailableProblems(problemsData || []);
        }
        
        const articlesRes = await fetch(`${backendUrl}/api/v1/articles`, { headers });
        if (articlesRes.ok) {
          const articlesData = await articlesRes.json();
          setAvailableArticles(articlesData || []);
        }
      } catch (err) {
        console.error("Error fetching assets for dropdowns:", err);
      } finally {
        setLoadingAssets(false);
      }
    };

    if (isLoggedIn && user?.roles?.includes("admin")) {
      fetchAllAssets();
    }
  }, [isLoggedIn, user, backendUrl]);

  // Expanded Visual Accordions in Form
  const [expandedSectionIds, setExpandedSectionIds] = useState<Record<string, boolean>>({});

  // 5. Global Action States
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Auto-generate URL Slug from Title
  useEffect(() => {
    if (title) {
      const cleanSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "") // remove special chars
        .replace(/\s+/g, "-") // replace spaces with -
        .replace(/-+/g, "-") // collapse multiple -
        .trim();
      setSlug(cleanSlug);
    }
  }, [title]);

  // Synchronize curriculum JSON string when visual changes
  useEffect(() => {
    if (editorMode === "visual") {
      setRawJsonStr(JSON.stringify(curriculum, null, 2));
    }
  }, [curriculum, editorMode]);

  // Fetch Available Instructors
  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        setLoadingInstructors(true);
        const res = await fetch(`${backendUrl}/api/v1/instructors/`);
        if (!res.ok) throw new Error("Failed to load instructors");
        const data = await res.json();
        // Parse from paginated items
        setInstructorsList(data.items || []);
      } catch (err) {
        console.error("Instructors fetch error:", err);
      } finally {
        setLoadingInstructors(false);
      }
    };

    if (isLoggedIn && user?.roles?.includes("admin")) {
      fetchInstructors();
    }
  }, [isLoggedIn, user, backendUrl]);

  useEffect(() => {
    document.title = "Create New Course | CrackDSA Admin";
  }, []);

  // Strict JSON Schema Schema Validation
  const validateItem = (item: any, path: string): { valid: boolean; error: string | null } => {
    if (!item || typeof item !== "object") return { valid: false, error: `${path} must be a JSON object.` };
    if (!item.id || typeof item.id !== "string") return { valid: false, error: `${path} is missing 'id' string.` };
    if (!item.title || typeof item.title !== "string") return { valid: false, error: `${path} is missing 'title' string.` };
    if (item.type !== "video" && item.type !== "problem" && item.type !== "article") {
      return { valid: false, error: `${path} has invalid type ("${item.type}"). Must be: video, problem, article.` };
    }
    if (!item.asset_id || typeof item.asset_id !== "string" || !item.asset_id.trim()) {
      return { valid: false, error: `${path} has an empty or missing 'asset_id'.` };
    }
    return { valid: true, error: null };
  };

  const validateCurriculumStructure = (data: any): { valid: boolean; error: string | null } => {
    if (!Array.isArray(data)) return { valid: false, error: "Root curriculum must be a JSON array." };

    for (let sIdx = 0; sIdx < data.length; sIdx++) {
      const sec = data[sIdx];
      if (!sec || typeof sec !== "object") return { valid: false, error: `Section at index ${sIdx} must be an object.` };
      if (!sec.id || typeof sec.id !== "string") return { valid: false, error: `Section at index ${sIdx} is missing 'id' string.` };
      if (!sec.title || typeof sec.title !== "string") return { valid: false, error: `Section at index ${sIdx} is missing 'title' string.` };

      // Validate Section Items
      if (sec.items !== undefined && sec.items !== null) {
        if (!Array.isArray(sec.items)) return { valid: false, error: `Section "${sec.title}" direct items must be an array.` };
        for (let iIdx = 0; iIdx < sec.items.length; iIdx++) {
          const res = validateItem(sec.items[iIdx], `Section "${sec.title}" -> Item ${iIdx}`);
          if (!res.valid) return res;
        }
      }

      // Validate Section Subsections
      if (sec.subsections !== undefined && sec.subsections !== null) {
        if (!Array.isArray(sec.subsections)) return { valid: false, error: `Section "${sec.title}" subsections must be an array.` };
        for (let subIdx = 0; subIdx < sec.subsections.length; subIdx++) {
          const sub = sec.subsections[subIdx];
          if (!sub || typeof sub !== "object") return { valid: false, error: `Subsection at index ${subIdx} in "${sec.title}" must be an object.` };
          if (!sub.id || typeof sub.id !== "string") return { valid: false, error: `Subsection at index ${subIdx} in "${sec.title}" is missing 'id' string.` };
          if (!sub.title || typeof sub.title !== "string") return { valid: false, error: `Subsection at index ${subIdx} in "${sec.title}" is missing 'title' string.` };
          if (!Array.isArray(sub.items)) return { valid: false, error: `Subsection "${sub.title}" items must be an array.` };

          for (let iIdx = 0; iIdx < sub.items.length; iIdx++) {
            const res = validateItem(sub.items[iIdx], `Subsection "${sub.title}" -> Item ${iIdx}`);
            if (!res.valid) return res;
          }
        }
      }
    }
    return { valid: true, error: null };
  };

  // Raw JSON String Handler
  const handleJsonStringChange = (text: string) => {
    setRawJsonStr(text);
    if (!text.trim()) {
      setIsJsonValid(true);
      setJsonError(null);
      return;
    }

    try {
      const parsed = JSON.parse(text);
      const res = validateCurriculumStructure(parsed);
      if (res.valid) {
        setIsJsonValid(true);
        setJsonError(null);
        // Hydrate visual curriculum state
        setCurriculum(parsed);
      } else {
        setIsJsonValid(false);
        setJsonError(res.error);
      }
    } catch (e: any) {
      setIsJsonValid(false);
      setJsonError(`JSON Syntax Error: ${e.message}`);
    }
  };

  // Visual Builder Handlers
  const addSection = () => {
    const id = `sec-${Date.now()}`;
    const newSec: CourseSection = {
      id,
      title: `Syllabus Section ${curriculum.length + 1}`,
      description: "",
      items: [],
      subsections: []
    };
    setCurriculum([...curriculum, newSec]);
    setExpandedSectionIds(prev => ({ ...prev, [id]: true }));
  };

  const removeSection = (sIdx: number) => {
    if (!confirm("Are you sure you want to delete this section and all nested contents?")) return;
    setCurriculum(curriculum.filter((_, idx) => idx !== sIdx));
  };

  const updateSectionField = (sIdx: number, field: "title" | "description", val: string) => {
    const updated = [...curriculum];
    updated[sIdx][field] = val;
    setCurriculum(updated);
  };

  const addSubsection = (sIdx: number) => {
    const updated = [...curriculum];
    const newSub: CourseSubsection = {
      id: `sub-${Date.now()}`,
      title: `Subsection Module ${ (updated[sIdx].subsections?.length || 0) + 1 }`,
      description: "",
      items: []
    };
    updated[sIdx].subsections = [...(updated[sIdx].subsections || []), newSub];
    setCurriculum(updated);
  };

  const removeSubsection = (sIdx: number, subIdx: number) => {
    const updated = [...curriculum];
    updated[sIdx].subsections = updated[sIdx].subsections?.filter((_, idx) => idx !== subIdx) || [];
    setCurriculum(updated);
  };

  const updateSubsectionField = (sIdx: number, subIdx: number, field: "title" | "description", val: string) => {
    const updated = [...curriculum];
    if (updated[sIdx].subsections) {
      updated[sIdx].subsections![subIdx][field] = val;
    }
    setCurriculum(updated);
  };

  const addCurriculumItem = (sIdx: number, subIdx: number | null) => {
    const updated = [...curriculum];
    const newItem: CourseSectionItem = {
      id: `item-${Date.now()}`,
      title: "New Syllabus Lesson",
      type: "video",
      asset_id: "",
      is_free: false,
      duration_label: ""
    };

    if (subIdx !== null) {
      // Add inside subsection
      if (updated[sIdx].subsections) {
        updated[sIdx].subsections![subIdx].items = [...updated[sIdx].subsections![subIdx].items, newItem];
      }
    } else {
      // Add directly in section
      updated[sIdx].items = [...(updated[sIdx].items || []), newItem];
    }
    setCurriculum(updated);
  };

  const removeCurriculumItem = (sIdx: number, subIdx: number | null, itemIdx: number) => {
    const updated = [...curriculum];
    if (subIdx !== null) {
      if (updated[sIdx].subsections) {
        updated[sIdx].subsections![subIdx].items = updated[sIdx].subsections![subIdx].items.filter((_, idx) => idx !== itemIdx);
      }
    } else {
      updated[sIdx].items = updated[sIdx].items?.filter((_, idx) => idx !== itemIdx) || [];
    }
    setCurriculum(updated);
  };

  const updateCurriculumItemField = (sIdx: number, subIdx: number | null, itemIdx: number, field: keyof CourseSectionItem, val: any) => {
    const updated = [...curriculum];
    if (subIdx !== null) {
      if (updated[sIdx].subsections) {
        const item = updated[sIdx].subsections![subIdx].items[itemIdx];
        updated[sIdx].subsections![subIdx].items[itemIdx] = { ...item, [field]: val };
      }
    } else {
      if (updated[sIdx].items) {
        const item = updated[sIdx].items![itemIdx];
        updated[sIdx].items![itemIdx] = { ...item, [field]: val };
      }
    }
    setCurriculum(updated);
  };

  const toggleExpandSection = (id: string) => {
    setExpandedSectionIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Co-Instructor Checklist click toggler
  const toggleInstructorSelection = (id: string) => {
    if (selectedInstructorIds.includes(id)) {
      setSelectedInstructorIds(selectedInstructorIds.filter(item => item !== id));
    } else {
      setSelectedInstructorIds([...selectedInstructorIds, id]);
    }
  };

  // Form Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getStoredToken();
    if (!token) return;

    if (!title.trim() || !slug.trim()) {
      setSubmitError("Course title and URL Slug key are strictly required.");
      return;
    }

    if (!isJsonValid) {
      setSubmitError("Cannot save course listing: Invalid curriculum schema layout. Check JSON tabs.");
      return;
    }

    const tags = tagsStr.split(",").map(s => s.trim()).filter(Boolean);

    // Strict validation of empty asset_id inside curriculum before sending payload
    for (let s = 0; s < curriculum.length; s++) {
      const sec = curriculum[s];
      if (sec.items) {
        for (let i = 0; i < sec.items.length; i++) {
          if (!sec.items[i].asset_id.trim()) {
            setSubmitError(`Syllabus Error: Item "${sec.items[i].title}" in Section "${sec.title}" is missing an Asset Look-up ID.`);
            return;
          }
        }
      }
      if (sec.subsections) {
        for (let sub = 0; sub < sec.subsections.length; sub++) {
          const subsection = sec.subsections[sub];
          for (let i = 0; i < subsection.items.length; i++) {
            if (!subsection.items[i].asset_id.trim()) {
              setSubmitError(`Syllabus Error: Item "${subsection.items[i].title}" in Subsection "${subsection.title}" is missing an Asset Look-up ID.`);
              return;
            }
          }
        }
      }
    }

    const payload = {
      title: title.trim(),
      slug: slug.trim(),
      description: description.trim(),
      category,
      price: Number(price) || 0,
      original_price: Number(originalPrice) || 0,
      is_pro: isPro,
      is_popular: isPopular,
      status,
      instructor_ids: selectedInstructorIds,
      tags,
      curriculum,
      metadata: {}
    };

    try {
      setSubmitting(true);
      setSubmitError(null);
      setSubmitSuccess(false);

      const res = await fetch(`${backendUrl}/api/v1/admin/courses/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Unable to create course in Supabase.");
      }

      setSubmitSuccess(true);
      setTimeout(() => {
        router.push("/admin/courses");
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
            <h1 className="text-2xl font-black text-gray-955 dark:text-white tracking-tight">Access Prohibited</h1>
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
    <div className="max-w-5xl mx-auto space-y-8 pb-20 px-4">
      
      {/* Back button header */}
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/courses" 
          className="p-2.5 rounded-xl border border-gray-255 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:text-gray-955 dark:hover:text-white bg-white dark:bg-gray-900 transition-all shadow-sm"
        >
          <ArrowLeft size={16} />
        </Link>
        <div>
          <span className="text-[10px] font-black text-brand-500 uppercase tracking-widest block leading-none mb-1">Catalog Registry</span>
          <h1 className="text-xl sm:text-2xl font-black text-gray-955 dark:text-white tracking-tight">
            Create New Academy Course
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Specifications attributes panel */}
        <div className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-theme-xs">
          <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-4">
            <BookOpen className="text-brand-500" size={18} />
            <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">Specifications & Marketing</h3>
          </div>

          {submitError && (
            <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/10 text-xs font-bold text-red-600">
              {submitError}
            </div>
          )}

          {submitSuccess && (
            <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-xs font-bold text-emerald-600 flex items-center gap-2">
              <Sparkles size={14} className="animate-pulse" />
              <span>Course successfully added into Academy Registry! Redirecting...</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Title */}
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-black text-gray-400 uppercase tracking-wider">Course Cohort Title *</label>
              <input 
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., DSA BootCamp Recordings: Placement Crash Course"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-transparent text-sm text-gray-955 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500 dark:focus:ring-brand-400 font-medium"
              />
            </div>

            {/* Slug */}
            <div className="space-y-1.5">
              <label className="text-xs font-black text-gray-400 uppercase tracking-wider">SEO URL Slug Key *</label>
              <input 
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="e.g., dsa-bootcamp-recordings"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-transparent text-sm text-gray-955 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500 dark:focus:ring-brand-400 font-medium font-mono"
              />
              <span className="text-[10px] text-gray-400 font-semibold block">Unique URL identifier (auto-generated from title).</span>
            </div>

            {/* Category Select */}
            <div className="space-y-1.5">
              <label className="text-xs font-black text-gray-400 uppercase tracking-wider">Directory Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:focus:ring-brand-400 font-semibold"
              >
                <option value="interview-prep">Interview Preparation</option>
                <option value="core-dsa">Core DSA</option>
                <option value="system-design">System Design (HLD/LLD)</option>
                <option value="advanced">Advanced Computer Science</option>
              </select>
            </div>

            {/* Rich text editor description */}
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-black text-gray-400 uppercase tracking-wider">Cohort Prospectus Description (Premium HTML Editor)</label>
              <RichTextEditor 
                value={description}
                onChange={setDescription}
                placeholder="Describe curriculum objectives, outcomes, and syllabus highlights here..."
              />
            </div>

            {/* Pricing columns */}
            <div className="space-y-1.5">
              <label className="text-xs font-black text-gray-400 uppercase tracking-wider">Discounted Price (₹ INR) *</label>
              <input 
                type="number"
                required
                min={0}
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                placeholder="e.g., 2999"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-transparent text-sm text-gray-955 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500 font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black text-gray-400 uppercase tracking-wider">Original Price (₹ INR) *</label>
              <input 
                type="number"
                required
                min={0}
                value={originalPrice}
                onChange={(e) => setOriginalPrice(Number(e.target.value))}
                placeholder="e.g., 4999"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-transparent text-sm text-gray-955 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500 font-medium"
              />
            </div>

            {/* properties */}
            <div className="sm:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-gray-50/50 dark:bg-gray-850/30 border border-gray-100 dark:border-gray-850">
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox"
                  id="isPro"
                  checked={isPro}
                  onChange={(e) => setIsPro(e.target.checked)}
                  className="w-4 h-4 rounded text-brand-500 focus:ring-brand-400 accent-brand-500"
                />
                <label htmlFor="isPro" className="text-xs font-bold text-gray-700 dark:text-gray-300 cursor-pointer select-none">PRO MODULE</label>
              </div>

              <div className="flex items-center gap-2">
                <input 
                  type="checkbox"
                  id="isPopular"
                  checked={isPopular}
                  onChange={(e) => setIsPopular(e.target.checked)}
                  className="w-4 h-4 rounded text-brand-500 focus:ring-brand-400 accent-brand-500"
                />
                <label htmlFor="isPopular" className="text-xs font-bold text-gray-700 dark:text-gray-300 cursor-pointer select-none">POPULAR TAG</label>
              </div>

              {/* Status Selector */}
              <div className="col-span-2 flex items-center justify-end gap-2.5">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">STATUS:</span>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="px-3.5 py-1.5 rounded-xl border border-gray-250 dark:border-gray-800 bg-white dark:bg-gray-900 text-xs font-bold text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-brand-500"
                >
                  <option value="draft">DRAFT</option>
                  <option value="active">ACTIVE</option>
                  <option value="upcoming">UPCOMING</option>
                </select>
              </div>
            </div>

            {/* Tags Comma list */}
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-black text-gray-400 uppercase tracking-wider">Search Filter Tags (Comma Separated)</label>
              <input 
                type="text"
                value={tagsStr}
                onChange={(e) => setTagsStr(e.target.value)}
                placeholder="leetcode, interview-prep, core-dsa"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-transparent text-sm text-gray-955 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500 font-medium"
              />
            </div>

          </div>
        </div>

        {/* Co-Instructors Multiselector Card */}
        <div className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-theme-xs">
          <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-4">
            <Users className="text-brand-500" size={18} />
            <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">Co-Instructors lecturing Team Allocation</h3>
          </div>

          {loadingInstructors ? (
            <div className="flex items-center gap-2 py-4">
              <Loader2 size={16} className="animate-spin text-brand-500" />
              <span className="text-xs text-gray-400 font-semibold">Pulling registered instructor profiles...</span>
            </div>
          ) : instructorsList.length === 0 ? (
            <div className="text-xs text-gray-400 italic py-2">No active instructors registered. Create instructor profiles under admin directory first.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {instructorsList.map((instructor) => {
                const isSelected = selectedInstructorIds.includes(instructor.id);
                return (
                  <div
                    key={instructor.id}
                    onClick={() => toggleInstructorSelection(instructor.id)}
                    className={`flex items-center gap-3 p-3 rounded-2xl border cursor-pointer select-none transition-all ${
                      isSelected 
                        ? "bg-brand-500/5 border-brand-500 dark:border-brand-500/60 shadow-sm"
                        : "bg-transparent border-gray-200 dark:border-gray-850 hover:bg-gray-50/50 dark:hover:bg-gray-850/40"
                    }`}
                  >
                    {/* colorful avatar fallback or image */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white font-black text-xs bg-gradient-to-r ${
                      instructor.metadata?.color || "from-brand-500 to-indigo-500"
                    }`}>
                      {instructor.name.split(" ").map(w => w[0]).join("").toUpperCase()}
                    </div>
                    
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-black text-gray-900 dark:text-white leading-tight truncate">{instructor.name}</div>
                      <div className="text-[10px] text-gray-400 font-semibold truncate">{instructor.role}</div>
                    </div>
                    
                    <input 
                      type="checkbox"
                      checked={isSelected}
                      readOnly
                      className="w-3.5 h-3.5 text-brand-500 focus:ring-brand-400 accent-brand-500 shrink-0"
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Premium Curriculum Syllabus Builder */}
        <div className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-theme-xs">
          
          {/* Builder Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-100 dark:border-gray-800 pb-4">
            <div className="flex items-center gap-2">
              <CodeIcon className="text-brand-500" size={18} />
              <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">Curriculum Syllabus Builder</h3>
            </div>
            
            {/* Mode Selector */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-gray-100 dark:bg-gray-800 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setEditorMode("visual")}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                  editorMode === "visual" 
                    ? "bg-white dark:bg-gray-900 text-gray-955 dark:text-white shadow-sm"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-955"
                }`}
              >
                Visual Tree
              </button>
              <button
                type="button"
                onClick={() => setEditorMode("json")}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                  editorMode === "json" 
                    ? "bg-white dark:bg-gray-900 text-gray-955 dark:text-white shadow-sm"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-955"
                }`}
              >
                Raw JSON Schema
              </button>
            </div>
          </div>

          {/* Mode 1: Visual builder */}
          {editorMode === "visual" ? (
            <div className="space-y-6">
              
              {/* Add Section bar */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-gray-400 uppercase tracking-wider">Visual Syllabus outline ({curriculum.length} sections)</span>
                <button
                  type="button"
                  onClick={addSection}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-500/5 hover:bg-brand-500/10 border border-dashed border-brand-500/30 hover:border-brand-500/80 text-brand-600 dark:text-brand-400 text-xs font-black transition-all"
                >
                  <Plus size={14} />
                  <span>Append Syllabus Section</span>
                </button>
              </div>

              {curriculum.length === 0 ? (
                <div className="text-center py-16 bg-gray-50/50 dark:bg-gray-850/20 border border-dashed border-gray-205 dark:border-gray-800 rounded-3xl space-y-3">
                  <BookOpen size={32} className="mx-auto text-gray-300" />
                  <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Syllabus Outline Empty</h4>
                  <p className="text-[11px] text-gray-400 max-w-sm mx-auto">Create section headers to start organizing learning modules, videos, articles, and practice problems.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {curriculum.map((section, sIdx) => {
                    const isExpanded = !!expandedSectionIds[section.id];
                    return (
                      <div 
                        key={section.id}
                        className="border border-gray-150 dark:border-gray-850 rounded-2xl bg-white dark:bg-gray-900/60 overflow-hidden"
                      >
                        {/* Section Header Accordion Trigger */}
                        <div className="flex items-center justify-between p-4 bg-gray-50/50 dark:bg-gray-850/20 border-b border-gray-100 dark:border-gray-850">
                          <button
                            type="button"
                            onClick={() => toggleExpandSection(section.id)}
                            className="flex items-center gap-3 text-left min-w-0 flex-1 mr-4"
                          >
                            <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400 text-[10px] font-black shrink-0 border border-brand-500/10">
                              {sIdx + 1}
                            </span>
                            <span className="font-bold text-sm text-gray-900 dark:text-white truncate">
                              {section.title || `Section ${sIdx + 1}`}
                            </span>
                            {isExpanded ? <ChevronDown size={14} className="text-gray-400 shrink-0" /> : <ChevronRight size={14} className="text-gray-400 shrink-0" />}
                          </button>

                          <div className="flex items-center gap-2.5">
                            <button
                              type="button"
                              onClick={() => addSubsection(sIdx)}
                              className="px-2.5 py-1.5 rounded-lg border border-dashed border-gray-250 dark:border-gray-800 text-[10px] font-bold text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-850 transition-colors"
                            >
                              Add Subsection
                            </button>
                            <button
                              type="button"
                              onClick={() => addCurriculumItem(sIdx, null)}
                              className="px-2.5 py-1.5 rounded-lg border border-dashed border-gray-250 dark:border-gray-800 text-[10px] font-bold text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-850 transition-colors"
                            >
                              Add Direct Item
                            </button>
                            <button
                              type="button"
                              onClick={() => removeSection(sIdx)}
                              className="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10 border border-transparent hover:border-red-500/10 transition-all"
                              title="Delete section outline"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>

                        {/* Section Body */}
                        <AnimatePresence initial={false}>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: "auto" }}
                              exit={{ height: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="p-4.5 space-y-6 bg-transparent border-t border-transparent">
                                
                                {/* Section meta inputs */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Section Title *</label>
                                    <input 
                                      type="text"
                                      required
                                      value={section.title}
                                      onChange={(e) => updateSectionField(sIdx, "title", e.target.value)}
                                      className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-transparent text-xs font-bold text-gray-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Section Subtitle / Description</label>
                                    <input 
                                      type="text"
                                      value={section.description || ""}
                                      onChange={(e) => updateSectionField(sIdx, "description", e.target.value)}
                                      placeholder="e.g. Master the basics of arrays and pointers."
                                      className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-transparent text-xs font-semibold text-gray-955 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
                                    />
                                  </div>
                                </div>

                                {/* A. Direct Items list in Section */}
                                {section.items && section.items.length > 0 && (
                                  <div className="space-y-3.5 pt-4 border-t border-gray-100 dark:border-gray-850">
                                    <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Direct Section Items ({section.items.length})</h5>
                                    <div className="space-y-3">
                                      {section.items.map((item, itemIdx) => (
                                        <div key={item.id} className="flex flex-wrap items-center gap-3 p-3 bg-gray-50/50 dark:bg-gray-850/20 border border-gray-100 dark:border-gray-800 rounded-xl relative group">
                                          
                                          {/* Type Select */}
                                          <div className="w-[110px] shrink-0">
                                            <select
                                              value={item.type}
                                              onChange={(e) => updateCurriculumItemField(sIdx, null, itemIdx, "type", e.target.value as any)}
                                              className="w-full px-2 py-1.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-[10px] font-black uppercase text-gray-700 dark:text-gray-300 focus:outline-none"
                                            >
                                              <option value="video">VIDEO</option>
                                              <option value="problem">PROBLEM</option>
                                              <option value="article">ARTICLE</option>
                                            </select>
                                          </div>

                                          {/* Item Title */}
                                          <div className="flex-1 min-w-[200px]">
                                            <input 
                                              type="text"
                                              required
                                              value={item.title}
                                              onChange={(e) => updateCurriculumItemField(sIdx, null, itemIdx, "title", e.target.value)}
                                              placeholder="Lesson Title"
                                              className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-transparent text-xs font-bold text-gray-955 dark:text-white focus:outline-none"
                                            />
                                          </div>

                                          {/* Asset Lookup ID */}
                                          <div className="w-[200px] shrink-0 flex items-center gap-1.5">
                                            {customModeItems[item.id] || (item.type === "video" && availableVideos.length === 0) || (item.type === "problem" && availableProblems.length === 0) || (item.type === "article" && availableArticles.length === 0) ? (
                                              <input 
                                                type="text"
                                                required
                                                value={item.asset_id}
                                                onChange={(e) => updateCurriculumItemField(sIdx, null, itemIdx, "asset_id", e.target.value)}
                                                placeholder={item.type === "video" ? "YouTube/Vimeo URL or ID" : "Asset slug pointer"}
                                                className="flex-1 px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-transparent text-[10px] font-mono text-gray-955 dark:text-white focus:outline-none"
                                              />
                                            ) : (
                                              <SearchableComboBox
                                                value={item.asset_id}
                                                type={item.type}
                                                options={getComboboxOptions(item.type)}
                                                onChange={(val) => {
                                                  updateCurriculumItemField(sIdx, null, itemIdx, "asset_id", val);
                                                  
                                                  // Auto populate title
                                                  if (!item.title || item.title === "New Syllabus Lesson" || item.title === "New Lesson") {
                                                    let found = null;
                                                    if (item.type === "video") found = availableVideos.find(v => v.id === val || v.video_url === val);
                                                    else if (item.type === "problem") found = availableProblems.find(p => p.id === val || p.slug === val);
                                                    else if (item.type === "article") found = availableArticles.find(a => a.id === val || a.slug === val);
                                                    
                                                    if (found) {
                                                      updateCurriculumItemField(sIdx, null, itemIdx, "title", found.title);
                                                    }
                                                  }
                                                }}
                                                placeholder={`Choose ${item.type}...`}
                                              />
                                            )}

                                            <button
                                              type="button"
                                              onClick={() => toggleCustomMode(item.id)}
                                              className="p-1.5 rounded bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 hover:text-brand-500 border border-gray-200 dark:border-gray-700 shrink-0"
                                              title={customModeItems[item.id] ? "Select from library" : "Type manual URL/Slug"}
                                            >
                                              {customModeItems[item.id] ? <Layers size={11} /> : <FileText size={11} />}
                                            </button>
                                          </div>

                                          {/* Override label */}
                                          <div className="w-[100px] shrink-0">
                                            <input 
                                              type="text"
                                              value={item.duration_label || ""}
                                              onChange={(e) => updateCurriculumItemField(sIdx, null, itemIdx, "duration_label", e.target.value || null)}
                                              placeholder="Override label"
                                              className="w-full px-2 py-1.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-transparent text-[10px] font-semibold text-gray-500 focus:outline-none"
                                            />
                                          </div>

                                          {/* Checkbox preview free */}
                                          <div className="flex items-center gap-1 shrink-0">
                                            <input 
                                              type="checkbox"
                                              id={`direct-free-${sIdx}-${itemIdx}`}
                                              checked={item.is_free}
                                              onChange={(e) => updateCurriculumItemField(sIdx, null, itemIdx, "is_free", e.target.checked)}
                                              className="w-3.5 h-3.5 rounded text-brand-500 accent-brand-500 shrink-0 cursor-pointer"
                                            />
                                            <label htmlFor={`direct-free-${sIdx}-${itemIdx}`} className="text-[9px] font-bold text-gray-400 cursor-pointer select-none">FREE</label>
                                          </div>

                                          {/* Delete button */}
                                          <button
                                            type="button"
                                            onClick={() => removeCurriculumItem(sIdx, null, itemIdx)}
                                            className="p-1 rounded bg-red-500/5 hover:bg-red-500/10 text-red-500 border border-red-500/10 transition-colors shrink-0"
                                          >
                                            <Trash2 size={11} />
                                          </button>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* B. Subsection accordion list inside Section */}
                                {section.subsections && section.subsections.length > 0 && (
                                  <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-850">
                                    <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Subsection Modules ({section.subsections.length})</h5>
                                    
                                    <div className="space-y-4 pl-3.5 border-l-2 border-gray-150 dark:border-gray-800">
                                      {section.subsections.map((sub, subIdx) => (
                                        <div key={sub.id} className="p-4 bg-gray-50/20 dark:bg-gray-850/10 border border-gray-200 dark:border-gray-800 rounded-xl space-y-4">
                                          
                                          {/* Subsection header fields */}
                                          <div className="flex items-center justify-between gap-4">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
                                              <input 
                                                type="text"
                                                required
                                                value={sub.title}
                                                onChange={(e) => updateSubsectionField(sIdx, subIdx, "title", e.target.value)}
                                                className="px-2.5 py-1.5 rounded-lg border border-gray-250 dark:border-gray-800 bg-transparent text-xs font-bold text-gray-955 dark:text-white focus:outline-none"
                                                placeholder="Subsection Title"
                                              />
                                              <input 
                                                type="text"
                                                value={sub.description || ""}
                                                onChange={(e) => updateSubsectionField(sIdx, subIdx, "description", e.target.value)}
                                                className="px-2.5 py-1.5 rounded-lg border border-gray-250 dark:border-gray-800 bg-transparent text-xs font-semibold text-gray-955 dark:text-white focus:outline-none"
                                                placeholder="Subtitle Notes"
                                              />
                                            </div>
                                            
                                            <div className="flex items-center gap-2.5 shrink-0">
                                              <button
                                                type="button"
                                                onClick={() => addCurriculumItem(sIdx, subIdx)}
                                                className="px-2 py-1 rounded bg-brand-500/5 hover:bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/10 text-[9px] font-bold"
                                              >
                                                Add Item
                                              </button>
                                              <button
                                                type="button"
                                                onClick={() => removeSubsection(sIdx, subIdx)}
                                                className="p-1.5 rounded text-red-500 hover:bg-red-500/5 border border-transparent hover:border-red-500/10"
                                              >
                                                <Trash2 size={13} />
                                              </button>
                                            </div>
                                          </div>

                                          {/* Subsection nested items list */}
                                          {sub.items && sub.items.length > 0 && (
                                            <div className="space-y-2.5">
                                              {sub.items.map((item, itemIdx) => (
                                                <div key={item.id} className="flex flex-wrap items-center gap-3.5 p-2.5 bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-lg">
                                                  
                                                  {/* Type Select */}
                                                  <div className="w-[100px] shrink-0">
                                                    <select
                                                      value={item.type}
                                                      onChange={(e) => updateCurriculumItemField(sIdx, subIdx, itemIdx, "type", e.target.value as any)}
                                                      className="w-full px-2 py-1 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-[10px] font-black uppercase text-gray-700 dark:text-gray-300 focus:outline-none"
                                                    >
                                                      <option value="video">VIDEO</option>
                                                      <option value="problem">PROBLEM</option>
                                                      <option value="article">ARTICLE</option>
                                                    </select>
                                                  </div>

                                                  {/* Item Title */}
                                                  <div className="flex-1 min-w-[180px]">
                                                    <input 
                                                      type="text"
                                                      required
                                                      value={item.title}
                                                      onChange={(e) => updateCurriculumItemField(sIdx, subIdx, itemIdx, "title", e.target.value)}
                                                      placeholder="Lesson Title"
                                                      className="w-full px-2 py-1 rounded-lg border border-gray-200 dark:border-gray-800 bg-transparent text-xs font-bold text-gray-955 dark:text-white focus:outline-none"
                                                    />
                                                  </div>

                                                  {/* Asset Lookup ID */}
                                                  <div className="w-[190px] shrink-0 flex items-center gap-1.5">
                                                    {customModeItems[item.id] || (item.type === "video" && availableVideos.length === 0) || (item.type === "problem" && availableProblems.length === 0) || (item.type === "article" && availableArticles.length === 0) ? (
                                                      <input 
                                                        type="text"
                                                        required
                                                        value={item.asset_id}
                                                        onChange={(e) => updateCurriculumItemField(sIdx, subIdx, itemIdx, "asset_id", e.target.value)}
                                                        placeholder={item.type === "video" ? "YouTube/Vimeo URL or ID" : "Asset ID pointer"}
                                                        className="flex-1 px-2 py-1 rounded-lg border border-gray-200 dark:border-gray-800 bg-transparent text-[10px] font-mono text-gray-955 dark:text-white focus:outline-none"
                                                      />
                                                    ) : (
                                                      <SearchableComboBox
                                                        value={item.asset_id}
                                                        type={item.type}
                                                        options={getComboboxOptions(item.type)}
                                                        onChange={(val) => {
                                                          updateCurriculumItemField(sIdx, subIdx, itemIdx, "asset_id", val);
                                                          
                                                          // Auto populate title
                                                          if (!item.title || item.title === "New Syllabus Lesson" || item.title === "New Lesson") {
                                                            let found = null;
                                                            if (item.type === "video") found = availableVideos.find(v => v.id === val || v.video_url === val);
                                                            else if (item.type === "problem") found = availableProblems.find(p => p.id === val || p.slug === val);
                                                            else if (item.type === "article") found = availableArticles.find(a => a.id === val || a.slug === val);
                                                            
                                                            if (found) {
                                                              updateCurriculumItemField(sIdx, subIdx, itemIdx, "title", found.title);
                                                            }
                                                          }
                                                        }}
                                                        placeholder={`Choose ${item.type}...`}
                                                      />
                                                    )}

                                                    <button
                                                      type="button"
                                                      onClick={() => toggleCustomMode(item.id)}
                                                      className="p-1.5 rounded bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 hover:text-brand-500 border border-gray-200 dark:border-gray-700 shrink-0"
                                                      title={customModeItems[item.id] ? "Select from library" : "Type manual URL/Slug"}
                                                    >
                                                      {customModeItems[item.id] ? <Layers size={11} /> : <FileText size={11} />}
                                                    </button>
                                                  </div>

                                                  {/* Override Label */}
                                                  <div className="w-[90px] shrink-0">
                                                    <input 
                                                      type="text"
                                                      value={item.duration_label || ""}
                                                      onChange={(e) => updateCurriculumItemField(sIdx, subIdx, itemIdx, "duration_label", e.target.value || null)}
                                                      placeholder="Override label"
                                                      className="w-full px-2 py-1 rounded-lg border border-gray-200 dark:border-gray-800 bg-transparent text-[10px] font-semibold text-gray-500 focus:outline-none"
                                                    />
                                                  </div>

                                                  {/* preview checkbox */}
                                                  <div className="flex items-center gap-1 shrink-0">
                                                    <input 
                                                      type="checkbox"
                                                      id={`sub-free-${sIdx}-${subIdx}-${itemIdx}`}
                                                      checked={item.is_free}
                                                      onChange={(e) => updateCurriculumItemField(sIdx, subIdx, itemIdx, "is_free", e.target.checked)}
                                                      className="w-3.5 h-3.5 rounded text-brand-500 accent-brand-500 shrink-0 cursor-pointer"
                                                    />
                                                    <label htmlFor={`sub-free-${sIdx}-${subIdx}-${itemIdx}`} className="text-[9px] font-bold text-gray-400 cursor-pointer select-none">FREE</label>
                                                  </div>

                                                  {/* Delete button */}
                                                  <button
                                                    type="button"
                                                    onClick={() => removeCurriculumItem(sIdx, subIdx, itemIdx)}
                                                    className="p-1 rounded bg-red-500/5 hover:bg-red-500/10 text-red-500 border border-red-500/10 transition-colors shrink-0"
                                                  >
                                                    <Trash2 size={11} />
                                                  </button>
                                                </div>
                                              ))}
                                            </div>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            
            /* Mode 2: Raw JSON Editor with schema validator */
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-black text-gray-400 uppercase tracking-wider">
                <span>Direct Syllabus JSON Array</span>
                <span className={`text-[10px] px-2 py-0.5 rounded font-black ${
                  isJsonValid 
                    ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/10" 
                    : "bg-red-500/10 text-red-600 border border-red-500/10 animate-pulse"
                }`}>
                  {isJsonValid ? "Valid Curriculum Schema" : "Invalid Syllabus Layout"}
                </span>
              </div>

              {jsonError && (
                <div className="p-3.5 rounded-xl bg-red-500/5 border border-red-500/10 text-[10px] font-mono text-red-500 whitespace-pre-wrap leading-relaxed select-text">
                  <AlertCircle size={12} className="inline mr-1 shrink-0 -mt-0.5" />
                  <span>{jsonError}</span>
                </div>
              )}

              <textarea 
                value={rawJsonStr}
                onChange={(e) => handleJsonStringChange(e.target.value)}
                rows={16}
                placeholder={'[\n  {\n    "id": "sec-1",\n    "title": "Section title",\n    "items": []\n  }\n]'}
                className={`w-full px-4 py-3 rounded-xl border bg-transparent text-xs text-gray-955 dark:text-white focus:outline-none font-mono resize-y leading-relaxed ${
                  isJsonValid 
                    ? "border-gray-250 dark:border-gray-800 focus:ring-1 focus:ring-brand-500" 
                    : "border-red-500 focus:ring-1 focus:ring-red-500"
                }`}
              />

              <div className="bg-gray-50/50 dark:bg-gray-950 p-4.5 rounded-2xl border border-gray-150 dark:border-gray-850 space-y-2">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block leading-none">Curriculum JSON Schema rules</span>
                <p className="text-[10px] text-gray-400 leading-relaxed font-semibold">
                  Every section must contain string fields: <code className="text-brand-500">"id"</code>, <code className="text-brand-500">"title"</code>.
                  Section items can be placed directly inside section <code className="text-brand-500">"items"</code> array, or inside nested <code className="text-brand-500">"subsections"</code> array.
                  Curriculum item object properties: <code className="text-brand-500">"id"</code>, <code className="text-brand-500">"title"</code>, <code className="text-brand-500">"type"</code> (one of: video, problem, article), <code className="text-brand-500">"asset_id"</code> (connected item unique slug/ID), <code className="text-brand-500">"is_free"</code> (boolean).
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Bottom Actions Row */}
        <div className="flex items-center justify-end gap-3.5 border-t border-gray-150 dark:border-gray-800/80 pt-6">
          <Link 
            href="/admin/courses" 
            className="px-5 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-gray-955 dark:hover:text-white uppercase tracking-wider transition-colors"
          >
            Discard & Return
          </Link>
          <Button 
            type="submit" 
            disabled={submitting || !isJsonValid}
            variant="primary"
            size="sm"
            startIcon={submitting ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          >
            {submitting ? "Adding Course..." : "Create Course Listing"}
          </Button>
        </div>

      </form>

    </div>
  );
}
