"use client";

import { BACKEND_URL } from "@/config/api";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { 
  Save, 
  BookOpen, 
  Loader2,
  Users,
  Settings,
  DollarSign,
  Briefcase,
  Plus,
  Trash2,
  ChevronDown,
  Layers,
  Star,
  MessageSquare,
  TrendingUp
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import RichTextEditor from "@/components/ui/editor/RichTextEditor";
import SearchableComboBox from "@/components/common/SearchableComboBox";
import { getStoredToken } from "@/functions/auth";

type Instructor = {
  id: string;
  name: string;
  role: string;
  profile_image_url?: string;
  metadata: { color?: string; company?: string; };
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

const courseSchema = z.object({
  title: z.string().min(1, "Course title is required"),
  slug: z.string().min(1, "SEO URL slug is required"),
  category: z.enum(["interview-prep", "core-dsa", "system-design", "advanced"]),
  price: z.number().min(0, "Price must be non-negative"),
  original_price: z.number().min(0, "Original price must be non-negative"),
  is_pro: z.boolean(),
  is_popular: z.boolean(),
  status: z.enum(["draft", "active", "upcoming"]),
  tags: z.string().nullable().optional(),
  difficulty: z.enum(["Beginner", "Intermediate", "Advanced"]),
  duration_weeks: z.number().min(0),
  duration_hours: z.number().min(0),
  total_projects: z.number().min(0),
  rating: z.number().min(0).max(5),
  reviews: z.number().min(0),
  number_of_students: z.number().min(0),
  thumbnail_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

type CourseFormValues = z.infer<typeof courseSchema>;

interface CourseEditorProps {
  mode: "create" | "edit";
  initialData?: any;
}

export default function CourseEditor({ mode, initialData }: CourseEditorProps) {
  const router = useRouter();
  const backendUrl = BACKEND_URL;

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: initialData?.title || "",
      slug: initialData?.slug || "",
      category: initialData?.category || "interview-prep",
      price: initialData?.price || 0,
      original_price: initialData?.original_price || 0,
      is_pro: initialData?.is_pro ?? true,
      is_popular: initialData?.is_popular ?? false,
      status: initialData?.status || "draft",
      tags: initialData?.tags?.join(", ") || "",
      difficulty: initialData?.metadata?.difficulty || "Beginner",
      duration_weeks: initialData?.metadata?.duration_weeks || 0,
      duration_hours: initialData?.metadata?.duration_hours || 0,
      total_projects: initialData?.metadata?.total_projects || 0,
      rating: initialData?.metadata?.rating || 5.0,
      reviews: initialData?.metadata?.reviews || 0,
      number_of_students: initialData?.metadata?.number_of_students || 0,
      thumbnail_url: initialData?.metadata?.thumbnail_url || "",
    }
  });

  const titleWatch = watch("title");
  const slugWatch = watch("slug");

  const [prerequisites, setPrerequisites] = useState<string[]>(initialData?.metadata?.prerequisites || []);
  const [learningOutcomes, setLearningOutcomes] = useState<string[]>(initialData?.metadata?.learning_outcomes || []);
  const [marketingSyllabus, setMarketingSyllabus] = useState<string[]>(initialData?.metadata?.marketing_syllabus || []);
  const [newPrereq, setNewPrereq] = useState("");
  const [newOutcome, setNewOutcome] = useState("");
  const [newSyllabus, setNewSyllabus] = useState("");
  const [feedbacks, setFeedbacks] = useState<any[]>(initialData?.metadata?.feedbacks || []);
  const [description, setDescription] = useState(initialData?.description || "");
  
  const [instructorsList, setInstructorsList] = useState<Instructor[]>([]);
  const [selectedInstructorIds, setSelectedInstructorIds] = useState<string[]>(
    initialData?.instructor_ids || []
  );

  const [curriculum, setCurriculum] = useState<CourseSection[]>(initialData?.curriculum || initialData?.sections || []);
  const [expandedSectionIds, setExpandedSectionIds] = useState<Record<string, boolean>>({});
  
  const [availableVideos, setAvailableVideos] = useState<any[]>([]);
  const [availableProblems, setAvailableProblems] = useState<any[]>([]);
  const [availableArticles, setAvailableArticles] = useState<any[]>([]);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  const toggleSection = (sec: string) => setExpandedSections(p => ({ ...p, [sec]: !p[sec] }));

  useEffect(() => {
    if (mode === "create" && titleWatch && !slugWatch) {
      const cleanSlug = titleWatch.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim();
      setValue("slug", cleanSlug, { shouldValidate: true });
    }
  }, [titleWatch, slugWatch, setValue, mode]);

  useEffect(() => {
    const fetchData = async () => {
      const token = getStoredToken();
      const headers = token ? { "Authorization": `Bearer ${token}` } : undefined;
      
      try {
        const [instRes, vidRes, probRes, artRes] = await Promise.all([
          fetch(`${backendUrl}/api/v1/instructors/`),
          fetch(`${backendUrl}/api/v1/video-lectures`, { headers }),
          fetch(`${backendUrl}/api/v1/practice-problems`, { headers }),
          fetch(`${backendUrl}/api/v1/articles`, { headers })
        ]);
        
        if (instRes.ok) setInstructorsList((await instRes.json()).items || []);
        if (vidRes.ok) setAvailableVideos(await vidRes.json() || []);
        if (probRes.ok) setAvailableProblems(await probRes.json() || []);
        if (artRes.ok) setAvailableArticles(await artRes.json() || []);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, [backendUrl]);

  const handleAddString = (val: string, setVal: any, list: string[], setList: any) => {
    if (val.trim()) { setList([...list, val.trim()]); setVal(""); }
  };
  const handleRemoveString = (idx: number, list: string[], setList: any) => {
    setList(list.filter((_, i) => i !== idx));
  };

  const getComboboxOptions = (itemType: "video" | "problem" | "article") => {
    if (itemType === "video") return availableVideos.map(v => ({ id: v.id, title: v.title, extra: v.video_url }));
    if (itemType === "problem") return availableProblems.map(p => ({ id: p.id, title: p.title, extra: `[${p.platform || "DSA"}] ${p.slug}` }));
    if (itemType === "article") return availableArticles.map(a => ({ id: a.id, title: a.title, extra: a.slug }));
    return [];
  };

  const addFeedback = () => {
    setFeedbacks([...feedbacks, { name: "John Doe", role: "SDE", company: "Google", content: "Great course!", avatar: "https://i.pravatar.cc/150?u=1", rating: 5 }]);
  };

  const updateFeedback = (idx: number, field: string, val: any) => {
    const updated = [...feedbacks];
    updated[idx][field] = val;
    setFeedbacks(updated);
  };

  const removeFeedback = (idx: number) => {
    setFeedbacks(feedbacks.filter((_, i) => i !== idx));
  };

  // Visual Curriculum Handlers
  const addSection = () => {
    const id = `sec-${Date.now()}`;
    setCurriculum([...curriculum, { id, title: `Section ${curriculum.length + 1}`, items: [], subsections: [] }]);
    setExpandedSectionIds(prev => ({ ...prev, [id]: true }));
  };

  const updateSectionField = (sIdx: number, field: "title" | "description", val: string) => {
    const updated = [...curriculum];
    updated[sIdx][field] = val;
    setCurriculum(updated);
  };

  const removeSection = (sIdx: number) => {
    if (!confirm("Delete section?")) return;
    setCurriculum(curriculum.filter((_, idx) => idx !== sIdx));
  };

  const addSubsection = (sIdx: number) => {
    const updated = [...curriculum];
    const newSub = { id: `sub-${Date.now()}`, title: `Subsection ${(updated[sIdx].subsections?.length || 0) + 1}`, items: [] };
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
    if (updated[sIdx].subsections) { updated[sIdx].subsections![subIdx][field] = val; }
    setCurriculum(updated);
  };

  const addCurriculumItem = (sIdx: number, subIdx: number | null) => {
    const updated = [...curriculum];
    const newItem: CourseSectionItem = { id: `item-${Date.now()}`, title: "New Item", type: "video", asset_id: "", is_free: false, duration_label: "" };
    if (subIdx !== null) {
      if (updated[sIdx].subsections) updated[sIdx].subsections![subIdx].items.push(newItem);
    } else {
      updated[sIdx].items = [...(updated[sIdx].items || []), newItem];
    }
    setCurriculum(updated);
  };

  const removeCurriculumItem = (sIdx: number, subIdx: number | null, itemIdx: number) => {
    const updated = [...curriculum];
    if (subIdx !== null && updated[sIdx].subsections) {
      updated[sIdx].subsections![subIdx].items = updated[sIdx].subsections![subIdx].items.filter((_, idx) => idx !== itemIdx);
    } else {
      updated[sIdx].items = updated[sIdx].items?.filter((_, idx) => idx !== itemIdx) || [];
    }
    setCurriculum(updated);
  };

  const updateCurriculumItemField = (sIdx: number, subIdx: number | null, itemIdx: number, field: keyof CourseSectionItem, val: any) => {
    const updated = [...curriculum];
    if (subIdx !== null && updated[sIdx].subsections) {
      updated[sIdx].subsections![subIdx].items[itemIdx] = { ...updated[sIdx].subsections![subIdx].items[itemIdx], [field]: val };
    } else if (updated[sIdx].items) {
      updated[sIdx].items![itemIdx] = { ...updated[sIdx].items![itemIdx], [field]: val };
    }
    setCurriculum(updated);
  };

  const toggleExpandSection = (id: string) => setExpandedSectionIds(prev => ({ ...prev, [id]: !prev[id] }));

  const onSubmit = async (values: CourseFormValues) => {
    const token = getStoredToken();
    if (!token) return;

    for (let s = 0; s < curriculum.length; s++) {
      const sec = curriculum[s];
      for (const item of sec.items || []) {
        if (!item.asset_id.trim()) return setSubmitError(`Missing asset ID in section ${sec.title}`);
      }
      for (const sub of sec.subsections || []) {
        for (const item of sub.items) {
          if (!item.asset_id.trim()) return setSubmitError(`Missing asset ID in subsection ${sub.title}`);
        }
      }
    }

    const tags = values.tags ? values.tags.split(",").map(s => s.trim()).filter(Boolean) : [];

    const payload = {
      title: values.title.trim(),
      slug: values.slug.trim(),
      description: description.trim(),
      category: values.category,
      price: Number(values.price) || 0,
      original_price: Number(values.original_price) || 0,
      is_pro: values.is_pro,
      is_popular: values.is_popular,
      status: values.status,
      instructor_ids: selectedInstructorIds,
      tags,
      curriculum,
      metadata: {
        difficulty: values.difficulty,
        duration_weeks: Number(values.duration_weeks) || 0,
        duration_hours: Number(values.duration_hours) || 0,
        total_projects: Number(values.total_projects) || 0,
        thumbnail_url: values.thumbnail_url?.trim() || null,
        prerequisites: prerequisites,
        learning_outcomes: learningOutcomes,
        marketing_syllabus: marketingSyllabus,
        rating: Number(values.rating) || 5.0,
        reviews: Number(values.reviews) || 0,
        number_of_students: Number(values.number_of_students) || 0,
        feedbacks: feedbacks
      }
    };

    try {
      setSubmitting(true);
      setSubmitError(null);

      const url = mode === "create" ? `${backendUrl}/api/v1/admin/courses/` : `${backendUrl}/api/v1/admin/courses/${initialData?.id}`;
      const res = await fetch(url, {
        method: mode === "create" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Unable to save course.");
      }

      const resData = await res.json();
      setSubmitSuccess("Course saved successfully!");
      setTimeout(() => setSubmitSuccess(null), 3000);
      
      if (mode === "create") {
        router.push(`/admin/courses/${resData.id}/edit`);
      }
    } catch (err: any) {
      setSubmitError(err.message || "An unexpected error occurred while saving.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-12 w-full max-w-7xl pb-24">
      {/* Sticky Save Bar */}
      <div className="flex items-center justify-between sticky top-4 z-40 bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl p-4 md:px-6 md:py-4 border border-gray-200 dark:border-gray-800 rounded-3xl shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
          <h2 className="text-sm sm:text-lg font-black text-gray-900 dark:text-white uppercase tracking-wider">
            {mode === "create" ? "New Course Draft" : "Course Editor"}
          </h2>
          <div className="hidden md:block h-6 w-px bg-gray-200 dark:bg-gray-800" />
          <div className="flex items-center gap-2">
            <Label className="font-bold text-gray-500 uppercase tracking-widest text-[10px]">Status:</Label>
            <Select id="status" {...register("status")} className="w-[140px] bg-gray-100 dark:bg-gray-900 border-none font-black uppercase text-xs">
              <option value="draft">DRAFT</option>
              <option value="active">ACTIVE</option>
              <option value="upcoming">UPCOMING</option>
            </Select>
          </div>
        </div>
        <button type="submit" disabled={submitting} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-sm font-black shadow-md shadow-brand-500/20 transition-all disabled:opacity-50">
          {submitting ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          <span>{mode === "create" ? "Publish" : "Save Course"}</span>
        </button>
      </div>

      {submitError && <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-sm font-bold text-red-600">{submitError}</div>}
      {submitSuccess && <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-sm font-bold text-green-600 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
        {submitSuccess}
      </div>}

      {/* Basic Identity */}
      <Card className="border-gray-200 dark:border-gray-800 shadow-sm rounded-3xl overflow-hidden">
        <div onClick={() => toggleSection("identity")}><CardHeader className=" flex flex-row items-center justify-between cursor-pointer group select-nonebg-gray-50/50 dark:bg-gray-900/20 border-b border-gray-100 dark:border-gray-850 p-6">

            <div className="flex-1">
          <CardTitle className="text-xl font-black flex items-center gap-3"><BookOpen className="text-brand-500" size={24}/> Identity & Overview</CardTitle>
          <CardDescription className="text-sm font-semibold">Title, descriptions, and category placement.</CardDescription>
            </div>
            <div className="shrink-0 ml-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <ChevronDown className={`transition-transform duration-300 ${expandedSections.identity ? "rotate-180" : ""}`} size={20} />
            </div>

</CardHeader></div>
        
{expandedSections.identity && (
<CardContent className="p-6 md:p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="md:col-span-2 space-y-2">
              <Label className="text-sm font-black uppercase tracking-wider text-gray-700 dark:text-gray-300">Course Title</Label>
              <Input {...register("title")} className="text-lg font-bold py-6 px-4" placeholder="e.g., Complete DSA Mastery" />
              {errors.title && <p className="text-sm font-bold text-red-500">{errors.title.message}</p>}
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-black uppercase tracking-wider text-gray-700 dark:text-gray-300">URL Slug</Label>
              <Input {...register("slug")} className="font-mono text-sm py-5" placeholder="complete-dsa-mastery" />
              {errors.slug && <p className="text-sm font-bold text-red-500">{errors.slug.message}</p>}
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-black uppercase tracking-wider text-gray-700 dark:text-gray-300">Category</Label>
              <Select {...register("category")} className="h-12 text-sm font-bold">
                <option value="interview-prep">Interview Preparation</option>
                <option value="core-dsa">Core DSA</option>
                <option value="system-design">System Design (HLD/LLD)</option>
                <option value="advanced">Advanced Computer Science</option>
              </Select>
            </div>
            <div className="md:col-span-2 space-y-3 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
              <Label className="text-sm font-black uppercase tracking-wider text-gray-700 dark:text-gray-300">Course Thumbnail URL</Label>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 space-y-2">
                  <Input {...register("thumbnail_url")} className="h-12 text-sm font-bold bg-white dark:bg-gray-950" placeholder="https://example.com/thumbnail.png" />
                  {errors.thumbnail_url && <p className="text-sm font-bold text-red-500">{errors.thumbnail_url.message}</p>}
                  <p className="text-xs text-gray-500 font-semibold">Provide a valid image URL for the course thumbnail. Recommended aspect ratio is 16:9 or 4:3.</p>
                </div>
                {watch("thumbnail_url") && (
                  <div className="w-full md:w-48 h-28 shrink-0 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-950 flex items-center justify-center">
                    <img src={watch("thumbnail_url")!} alt="Thumbnail preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
                  </div>
                )}
              </div>
            </div>
            <div className="md:col-span-2 space-y-2">
              <Label className="text-sm font-black uppercase tracking-wider text-gray-700 dark:text-gray-300">Prospectus Description</Label>
              <div className="border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden min-h-[350px] shadow-inner bg-white dark:bg-gray-950">
                <RichTextEditor value={description} onChange={setDescription} placeholder="Course prospectus..." />
              </div>
            </div>
          </div>
        </CardContent>
          )}
        </Card>

      {/* Instructors */}
      <Card className="border-gray-200 dark:border-gray-800 shadow-sm rounded-3xl overflow-hidden">
        <div onClick={() => toggleSection("instructors")}><CardHeader className=" flex flex-row items-center justify-between cursor-pointer group select-nonebg-gray-50/50 dark:bg-gray-900/20 border-b border-gray-100 dark:border-gray-850 p-6">

            <div className="flex-1">
          <CardTitle className="text-xl font-black flex items-center gap-3"><Users className="text-brand-500" size={24}/> Co-Instructors</CardTitle>
          <CardDescription className="text-sm font-semibold">Select all instructors teaching this cohort.</CardDescription>
            </div>
            <div className="shrink-0 ml-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <ChevronDown className={`transition-transform duration-300 ${expandedSections.instructors ? "rotate-180" : ""}`} size={20} />
            </div>

</CardHeader></div>
        
{expandedSections.instructors && (
<CardContent className="p-6 md:p-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {instructorsList.map((inst) => (
              <div
                key={inst.id}
                onClick={() => {
                  if (selectedInstructorIds.includes(inst.id)) setSelectedInstructorIds(selectedInstructorIds.filter(id => id !== inst.id));
                  else setSelectedInstructorIds([...selectedInstructorIds, inst.id]);
                }}
                className={`flex items-center p-4 rounded-2xl border-2 cursor-pointer select-none transition-all ${
                  selectedInstructorIds.includes(inst.id) ? "border-brand-500 bg-brand-50/50 dark:bg-brand-500/10 shadow-sm" : "border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 hover:border-gray-200 dark:hover:border-gray-700"
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-black text-gray-900 dark:text-white truncate">{inst.name}</div>
                  <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5 truncate">{inst.role}</div>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ml-3 ${
                  selectedInstructorIds.includes(inst.id) ? "border-brand-500 bg-brand-500" : "border-gray-300 dark:border-gray-700"
                }`}>
                  {selectedInstructorIds.includes(inst.id) && <div className="w-2 h-2 bg-white rounded-full" />}
                </div>
              </div>
            ))}
            {instructorsList.length === 0 && <p className="text-sm text-gray-400 col-span-full font-semibold italic">No instructors found in database. Add them in the Instructors panel.</p>}
          </div>
        </CardContent>
          )}
        </Card>

      {/* Metadata & Pricing */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
        <Card className="border-gray-200 dark:border-gray-800 shadow-sm rounded-3xl overflow-hidden h-fit">
          <div onClick={() => toggleSection("metadata")}><CardHeader className=" flex flex-row items-center justify-between cursor-pointer group select-nonebg-gray-50/50 dark:bg-gray-900/20 border-b border-gray-100 dark:border-gray-850 p-6">

            <div className="flex-1">
            <CardTitle className="text-xl font-black flex items-center gap-3"><Settings className="text-brand-500" size={24}/> Metadata</CardTitle>
            <CardDescription className="text-sm font-semibold">Stats, tags, and outcomes for the landing page.</CardDescription>
            </div>
            <div className="shrink-0 ml-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <ChevronDown className={`transition-transform duration-300 ${expandedSections.metadata ? "rotate-180" : ""}`} size={20} />
            </div>

</CardHeader></div>
          
{expandedSections.metadata && (
<CardContent className="p-6 md:p-8 space-y-8">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase text-gray-500">Difficulty</Label>
                <Select {...register("difficulty")} className="h-10 font-bold">
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase text-gray-500">Duration (wks)</Label>
                <Input type="number" {...register("duration_weeks", { valueAsNumber: true })} className="h-10 font-bold" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase text-gray-500">Duration (hrs)</Label>
                <Input type="number" {...register("duration_hours", { valueAsNumber: true })} className="h-10 font-bold" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase text-gray-500">Projects</Label>
                <Input type="number" {...register("total_projects", { valueAsNumber: true })} className="h-10 font-bold" />
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <Label className="text-xs font-black uppercase tracking-wider text-brand-500">Prerequisites</Label>
                <div className="flex gap-2">
                  <Input value={newPrereq} onChange={(e) => setNewPrereq(e.target.value)} placeholder="e.g. Basic programming knowledge" onKeyDown={(e) => { if(e.key==='Enter') { e.preventDefault(); handleAddString(newPrereq, setNewPrereq, prerequisites, setPrerequisites); }}} className="h-10" />
                  <button type="button" onClick={() => handleAddString(newPrereq, setNewPrereq, prerequisites, setPrerequisites)} className="bg-brand-500 hover:bg-brand-600 text-white px-4 rounded-xl font-black transition-colors">+</button>
                </div>
                <ul className="space-y-2">
                  {prerequisites.map((p, idx) => (
                    <li key={idx} className="flex justify-between items-center text-sm bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 px-4 py-2.5 rounded-xl font-medium">
                      <span>{p}</span>
                      <button type="button" onClick={() => handleRemoveString(idx, prerequisites, setPrerequisites)} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 p-1.5 rounded-lg transition-colors"><Trash2 size={16}/></button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3">
                <Label className="text-xs font-black uppercase tracking-wider text-brand-500">Learning Outcomes</Label>
                <div className="flex gap-2">
                  <Input value={newOutcome} onChange={(e) => setNewOutcome(e.target.value)} placeholder="What will they learn?" onKeyDown={(e) => { if(e.key==='Enter') { e.preventDefault(); handleAddString(newOutcome, setNewOutcome, learningOutcomes, setLearningOutcomes); }}} className="h-10" />
                  <button type="button" onClick={() => handleAddString(newOutcome, setNewOutcome, learningOutcomes, setLearningOutcomes)} className="bg-brand-500 hover:bg-brand-600 text-white px-4 rounded-xl font-black transition-colors">+</button>
                </div>
                <ul className="space-y-2">
                  {learningOutcomes.map((p, idx) => (
                    <li key={idx} className="flex justify-between items-center text-sm bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 px-4 py-2.5 rounded-xl font-medium">
                      <span>{p}</span>
                      <button type="button" onClick={() => handleRemoveString(idx, learningOutcomes, setLearningOutcomes)} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 p-1.5 rounded-lg transition-colors"><Trash2 size={16}/></button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3">
                <Label className="text-xs font-black uppercase tracking-wider text-brand-500">Marketing Syllabus (Short Week-by-Week format)</Label>
                <div className="flex gap-2">
                  <Input value={newSyllabus} onChange={(e) => setNewSyllabus(e.target.value)} placeholder="e.g. Week 1: Arrays & Strings" onKeyDown={(e) => { if(e.key==='Enter') { e.preventDefault(); handleAddString(newSyllabus, setNewSyllabus, marketingSyllabus, setMarketingSyllabus); }}} className="h-10" />
                  <button type="button" onClick={() => handleAddString(newSyllabus, setNewSyllabus, marketingSyllabus, setMarketingSyllabus)} className="bg-brand-500 hover:bg-brand-600 text-white px-4 rounded-xl font-black transition-colors">+</button>
                </div>
                <ul className="space-y-2">
                  {marketingSyllabus.map((p, idx) => (
                    <li key={idx} className="flex justify-between items-center text-sm bg-brand-50/50 dark:bg-brand-500/10 border border-brand-100 dark:border-brand-500/20 px-4 py-3 rounded-xl font-bold text-brand-900 dark:text-brand-300">
                      <span>{p}</span>
                      <button type="button" onClick={() => handleRemoveString(idx, marketingSyllabus, setMarketingSyllabus)} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 p-1.5 rounded-lg transition-colors"><Trash2 size={16}/></button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
          )}
        </Card>

        <Card className="border-gray-200 dark:border-gray-800 shadow-sm rounded-3xl overflow-hidden h-fit">
          <div onClick={() => toggleSection("pricing")}><CardHeader className=" flex flex-row items-center justify-between cursor-pointer group select-nonebg-gray-50/50 dark:bg-gray-900/20 border-b border-gray-100 dark:border-gray-850 p-6">

            <div className="flex-1">
            <CardTitle className="text-xl font-black flex items-center gap-3"><DollarSign className="text-emerald-500" size={24}/> Pricing Strategy</CardTitle>
            <CardDescription className="text-sm font-semibold">Define access and pricing rules.</CardDescription>
            </div>
            <div className="shrink-0 ml-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <ChevronDown className={`transition-transform duration-300 ${expandedSections.pricing ? "rotate-180" : ""}`} size={20} />
            </div>

</CardHeader></div>
          
{expandedSections.pricing && (
<CardContent className="p-6 md:p-8 space-y-8">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase text-gray-500">Discounted Price (₹)</Label>
                <Input type="number" {...register("price", { valueAsNumber: true })} className="font-mono font-bold h-12 text-lg" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase text-gray-500">Original Price (₹)</Label>
                <Input type="number" {...register("original_price", { valueAsNumber: true })} className="font-mono font-bold h-12 text-lg text-gray-400 line-through" />
              </div>
            </div>
            
            <div className="space-y-4">
              <label className="flex items-center gap-4 p-5 rounded-2xl border-2 border-amber-100 bg-amber-50/30 dark:border-amber-900/30 dark:bg-amber-900/10 cursor-pointer hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors">
                <input type="checkbox" {...register("is_pro")} className="w-5 h-5 rounded text-amber-500 focus:ring-amber-500" />
                <div>
                  <div className="font-black text-amber-700 dark:text-amber-500">Included in PRO</div>
                  <div className="text-xs font-semibold text-amber-600/70 dark:text-amber-500/70">Users with a PRO subscription get full access instantly.</div>
                </div>
              </label>

              <label className="flex items-center gap-4 p-5 rounded-2xl border-2 border-brand-100 bg-brand-50/30 dark:border-brand-900/30 dark:bg-brand-900/10 cursor-pointer hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors">
                <input type="checkbox" {...register("is_popular")} className="w-5 h-5 rounded text-brand-500 focus:ring-brand-500" />
                <div>
                  <div className="font-black text-brand-700 dark:text-brand-500">Mark as Popular</div>
                  <div className="text-xs font-semibold text-brand-600/70 dark:text-brand-500/70">Displays a "Most Popular" badge on the landing page.</div>
                </div>
              </label>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-black uppercase text-gray-500">Search Keywords / Tags</Label>
              <Input {...register("tags")} placeholder="e.g. system design, lld, java" className="h-12 font-bold" />
              <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Separate with commas</div>
            </div>
          </CardContent>
          )}
        </Card>

        {/* Statistics & Feedbacks */}
        <Card className="border-gray-200 dark:border-gray-800 shadow-sm rounded-3xl overflow-hidden h-fit md:col-span-2 xl:col-span-2">
          <div onClick={() => toggleSection("stats")}><CardHeader className=" flex flex-row items-center justify-between cursor-pointer group select-nonebg-gray-50/50 dark:bg-gray-900/20 border-b border-gray-100 dark:border-gray-850 p-6">

            <div className="flex-1">
            <CardTitle className="text-xl font-black flex items-center gap-3"><TrendingUp className="text-blue-500" size={24}/> Statistics & Student Feedback</CardTitle>
            <CardDescription className="text-sm font-semibold">Dynamic metrics shown on the course landing page.</CardDescription>
            </div>
            <div className="shrink-0 ml-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <ChevronDown className={`transition-transform duration-300 ${expandedSections.stats ? "rotate-180" : ""}`} size={20} />
            </div>

</CardHeader></div>
          
{expandedSections.stats && (
<CardContent className="p-6 md:p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase text-gray-500 flex items-center gap-2"><Star size={14} className="text-amber-500"/> Rating (out of 5)</Label>
                <Input type="number" step="0.1" {...register("rating", { valueAsNumber: true })} className="font-bold h-12" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase text-gray-500 flex items-center gap-2"><MessageSquare size={14} className="text-blue-500"/> Total Reviews</Label>
                <Input type="number" {...register("reviews", { valueAsNumber: true })} className="font-bold h-12" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase text-gray-500 flex items-center gap-2"><Users size={14} className="text-brand-500"/> Total Students Enrolled</Label>
                <Input type="number" {...register("number_of_students", { valueAsNumber: true })} className="font-bold h-12" />
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-gray-100 dark:border-gray-850">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-black uppercase tracking-wider text-brand-500">Student Testimonials</Label>
                <button type="button" onClick={addFeedback} className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-2 rounded-xl text-xs font-black hover:scale-105 transition-transform">+ Add Feedback</button>
              </div>
              
              {feedbacks.length === 0 && (
                <div className="text-center py-8 border border-dashed border-gray-200 dark:border-gray-800 rounded-2xl">
                  <p className="text-sm text-gray-400 font-semibold italic">No feedback added yet. This section will be hidden on the landing page.</p>
                </div>
              )}

              <div className="space-y-4">
                {feedbacks.map((fb, idx) => (
                  <div key={idx} className="p-5 border border-gray-200 dark:border-gray-800 rounded-2xl bg-gray-50/50 dark:bg-gray-900/30 space-y-4 relative">
                    <button type="button" onClick={() => removeFeedback(idx)} className="absolute top-4 right-4 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg transition-colors"><Trash2 size={16}/></button>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-10">
                      <div className="space-y-1">
                        <Label className="text-[10px] uppercase font-bold text-gray-500">Student Name</Label>
                        <Input value={fb.name} onChange={e => updateFeedback(idx, "name", e.target.value)} className="h-9 text-sm" />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] uppercase font-bold text-gray-500">Job Role</Label>
                        <Input value={fb.role} onChange={e => updateFeedback(idx, "role", e.target.value)} className="h-9 text-sm" placeholder="e.g. SDE-1" />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] uppercase font-bold text-gray-500">Company</Label>
                        <Input value={fb.company} onChange={e => updateFeedback(idx, "company", e.target.value)} className="h-9 text-sm" placeholder="e.g. Amazon" />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] uppercase font-bold text-gray-500">Avatar URL</Label>
                        <Input value={fb.avatar} onChange={e => updateFeedback(idx, "avatar", e.target.value)} className="h-9 text-sm" placeholder="https://..." />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] uppercase font-bold text-gray-500">Star Rating</Label>
                        <Input type="number" min="1" max="5" value={fb.rating} onChange={e => updateFeedback(idx, "rating", Number(e.target.value))} className="h-9 text-sm" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] uppercase font-bold text-gray-500">Review Content</Label>
                      <textarea 
                        value={fb.content} 
                        onChange={e => updateFeedback(idx, "content", e.target.value)} 
                        className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition-shadow"
                        rows={3}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
          )}
        </Card>
      </div>

      {/* Curriculum Builder */}
      <Card className="border-gray-200 dark:border-gray-800 shadow-sm rounded-3xl overflow-hidden">
        <div onClick={() => toggleSection("curriculum")}><CardHeader className=" cursor-pointer group select-nonebg-gray-50/50 dark:bg-gray-900/20 border-b border-gray-100 dark:border-gray-850 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">

            <div className="flex-1">
          <div>
            <CardTitle className="text-xl font-black flex items-center gap-3"><Briefcase className="text-brand-500" size={24}/> Curriculum Builder</CardTitle>
            <CardDescription className="text-sm font-semibold">Organize the entire syllabus and link database assets.</CardDescription>
          </div>
          <button type="button" onClick={addSection} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-black shadow-sm hover:scale-105 active:scale-95 transition-all">
            <Plus size={16} /> Add Module Section
          </button>
            </div>
            <div className="shrink-0 ml-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <ChevronDown className={`transition-transform duration-300 ${expandedSections.curriculum ? "rotate-180" : ""}`} size={20} />
            </div>

</CardHeader></div>
        
{expandedSections.curriculum && (
<CardContent className="p-6 md:p-8">
          {curriculum.length === 0 ? (
            <div className="p-16 text-center border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-3xl bg-gray-50/50 dark:bg-gray-900/20">
              <Layers size={48} className="mx-auto text-gray-300 dark:text-gray-700 mb-4" />
              <h3 className="text-xl font-black text-gray-900 dark:text-white">Curriculum is empty</h3>
              <p className="text-sm font-semibold text-gray-500 mb-8 mt-2 max-w-sm mx-auto">Start building the syllabus by adding your first module. You can drag and drop videos, problems, and articles inside.</p>
              <button type="button" onClick={addSection} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-500 text-white text-sm font-black shadow-md shadow-brand-500/20 hover:bg-brand-600 transition-colors">
                <Plus size={18} /> Create First Module
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {curriculum.map((section, sIdx) => {
                const isExpanded = expandedSectionIds[section.id];
                return (
                  <div key={section.id} className="border-2 border-gray-200 dark:border-gray-800 rounded-2xl bg-white dark:bg-gray-950 shadow-sm overflow-hidden transition-colors hover:border-gray-300 dark:hover:border-gray-700 focus-within:border-brand-500 dark:focus-within:border-brand-500">
                    <div className="flex flex-col md:flex-row md:items-center gap-4 p-4 md:p-5 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-800">
                      <div className="flex items-center gap-3 flex-1">
                        <button type="button" onClick={() => toggleExpandSection(section.id)} className="p-2 hover:bg-white dark:hover:bg-gray-800 rounded-lg text-gray-500 transition-all shadow-sm">
                          <ChevronDown size={20} className={`transition-transform duration-200 ${isExpanded ? "" : "-rotate-90"}`} />
                        </button>
                        <div className="flex-1">
                          <input
                            value={section.title}
                            onChange={e => updateSectionField(sIdx, "title", e.target.value)}
                            className="w-full bg-transparent text-base font-black text-gray-900 dark:text-white focus:outline-none placeholder-gray-400"
                            placeholder="Section Title (e.g. Module 1: Introduction)"
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-2 md:pl-4 pl-12 border-t md:border-t-0 md:border-l border-gray-200 dark:border-gray-800 pt-3 md:pt-0">
                        <button type="button" onClick={() => addSubsection(sIdx)} className="px-3 py-2 rounded-lg bg-gray-200 dark:bg-gray-800 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors shadow-sm">
                          + Subsection
                        </button>
                        <button type="button" onClick={() => addCurriculumItem(sIdx, null)} className="px-3 py-2 rounded-lg bg-brand-500 text-white text-xs font-bold shadow-sm hover:bg-brand-600 transition-colors">
                          + Add Item
                        </button>
                        <button type="button" onClick={() => removeSection(sIdx)} className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors ml-1">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                          <div className="p-4 md:p-6 space-y-6 bg-gray-50/30 dark:bg-gray-950">
                            
                            {/* Direct Items */}
                            {section.items && section.items.length > 0 && (
                              <div className="space-y-3">
                                {section.items.map((item, iIdx) => (
                                  <div key={item.id} className="flex flex-col xl:flex-row xl:items-center gap-4 p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm hover:border-gray-300 dark:hover:border-gray-700 transition-colors group">
                                    <div className="flex items-center gap-3 w-full xl:w-auto xl:flex-1">
                                      <Select value={item.type} onChange={(e: any) => updateCurriculumItemField(sIdx, null, iIdx, "type", e.target.value)} className="w-32 h-10 text-xs font-bold bg-gray-50 dark:bg-gray-950 border-gray-200 dark:border-gray-800 rounded-lg">
                                        <option value="video">🎥 Video</option>
                                        <option value="problem">💻 Problem</option>
                                        <option value="article">📄 Article</option>
                                      </Select>
                                      <input value={item.title} onChange={e => updateCurriculumItemField(sIdx, null, iIdx, "title", e.target.value)} className="flex-1 h-10 px-3 bg-transparent text-sm font-bold border-b-2 border-transparent focus:border-brand-500 outline-none placeholder-gray-400 transition-colors" placeholder="Lesson / Item Title" />
                                    </div>
                                    <div className="flex items-center gap-3 w-full xl:w-auto xl:pl-4">
                                      <div className="w-full xl:w-[350px]">
                                        <SearchableComboBox type={item.type} value={item.asset_id} options={getComboboxOptions(item.type)} onChange={val => updateCurriculumItemField(sIdx, null, iIdx, "asset_id", val)} placeholder="Search and attach an asset..." />
                                      </div>
                                      <button type="button" onClick={() => removeCurriculumItem(sIdx, null, iIdx)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"><Trash2 size={16} /></button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Subsections */}
                            {section.subsections && section.subsections.length > 0 && (
                              <div className="space-y-4">
                                {section.subsections.map((sub, subIdx) => (
                                  <div key={sub.id} className="border-2 border-brand-500/20 dark:border-brand-500/30 rounded-2xl bg-brand-50/20 dark:bg-brand-950/10 overflow-hidden ml-0 md:ml-6">
                                    <div className="flex items-center gap-3 p-4 bg-brand-50/50 dark:bg-brand-950/30 border-b border-brand-500/10">
                                      <input value={sub.title} onChange={e => updateSubsectionField(sIdx, subIdx, "title", e.target.value)} className="flex-1 bg-transparent text-sm font-black text-brand-900 dark:text-brand-300 focus:outline-none placeholder-brand-500/50" placeholder="Subsection Title" />
                                      <button type="button" onClick={() => addCurriculumItem(sIdx, subIdx)} className="px-3 py-1.5 rounded-lg bg-white dark:bg-gray-900 text-xs font-bold shadow-sm border border-brand-500/20 text-brand-600 hover:bg-brand-50 transition-colors">+ Nested Item</button>
                                      <button type="button" onClick={() => removeSubsection(sIdx, subIdx)} className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg"><Trash2 size={16}/></button>
                                    </div>
                                    <div className="p-4 space-y-3">
                                      {sub.items?.map((item, iIdx) => (
                                        <div key={item.id} className="flex flex-col lg:flex-row lg:items-center gap-4 p-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm group">
                                          <div className="flex items-center gap-3 flex-1">
                                            <Select value={item.type} onChange={(e: any) => updateCurriculumItemField(sIdx, subIdx, iIdx, "type", e.target.value)} className="w-28 h-9 text-xs font-bold bg-gray-50 dark:bg-gray-950 border-gray-200 dark:border-gray-800 rounded-lg">
                                              <option value="video">Video</option>
                                              <option value="problem">Problem</option>
                                              <option value="article">Article</option>
                                            </Select>
                                            <input value={item.title} onChange={e => updateCurriculumItemField(sIdx, subIdx, iIdx, "title", e.target.value)} className="flex-1 bg-transparent text-sm font-bold border-b-2 border-transparent focus:border-brand-500 outline-none transition-colors" placeholder="Nested Lesson Name" />
                                          </div>
                                          <div className="flex items-center gap-3 w-full lg:w-auto">
                                            <div className="w-full lg:w-[320px]">
                                              <SearchableComboBox type={item.type} value={item.asset_id} options={getComboboxOptions(item.type)} onChange={val => updateCurriculumItemField(sIdx, subIdx, iIdx, "asset_id", val)} placeholder="Search asset..." />
                                            </div>
                                            <button type="button" onClick={() => removeCurriculumItem(sIdx, subIdx, iIdx)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"><Trash2 size={16} /></button>
                                          </div>
                                        </div>
                                      ))}
                                      {(!sub.items || sub.items.length === 0) && <div className="text-sm font-semibold text-gray-400 italic text-center py-4 bg-white/50 dark:bg-gray-900/50 rounded-xl border border-dashed border-gray-200 dark:border-gray-800">No items inside this subsection.</div>}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {(!section.items || section.items.length === 0) && (!section.subsections || section.subsections.length === 0) && (
                              <div className="text-sm font-semibold text-gray-400 italic text-center py-8">Section is empty. Add a subsection or item.</div>
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
        </CardContent>
          )}
        </Card>
    </form>
  );
}
