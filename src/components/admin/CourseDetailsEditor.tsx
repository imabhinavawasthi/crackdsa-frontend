"use client";

import { BACKEND_URL } from "@/config/api";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Save, 
  BookOpen, 
  Loader2,
  Users,
  Settings,
  DollarSign,
  Plus,
  Trash2,
  Layers,
  Sparkles,
  Image as ImageIcon,
  Video as VideoIcon,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Tag,
  ArrowRight
} from "lucide-react";
import { getStoredToken } from "@/functions/auth";

type Instructor = {
  id: string;
  name: string;
  role?: string;
  company?: string;
  avatar_url?: string;
  profile_image_url?: string;
};

interface CourseDetailsEditorProps {
  mode: "create" | "edit";
  initialData?: any;
}

export default function CourseDetailsEditor({ mode, initialData }: CourseDetailsEditorProps) {
  const router = useRouter();
  const backendUrl = BACKEND_URL;

  // Basic Details State
  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [category, setCategory] = useState(initialData?.category || "core-dsa");
  const [difficulty, setDifficulty] = useState(initialData?.metadata?.difficulty || "Intermediate");
  const [language, setLanguage] = useState(initialData?.language || "English / Hinglish");
  const [status, setStatus] = useState<"draft" | "active" | "upcoming">(initialData?.status || "draft");

  // Pricing & Pro state
  const [price, setPrice] = useState<number>(initialData?.price ?? 2999);
  const [originalPrice, setOriginalPrice] = useState<number>(initialData?.original_price ?? 5999);
  const [isPro, setIsPro] = useState<boolean>(initialData?.is_pro ?? true);
  const [isPopular, setIsPopular] = useState<boolean>(initialData?.is_popular ?? false);

  // Descriptions & Media
  const [shortDescription, setShortDescription] = useState(initialData?.short_description || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [thumbnailUrl, setThumbnailUrl] = useState(initialData?.metadata?.thumbnail_url || initialData?.thumbnail_url || "");
  const [coverImageUrl, setCoverImageUrl] = useState(initialData?.cover_image_url || "");
  const [promoVideoUrl, setPromoVideoUrl] = useState(initialData?.promo_video_url || "");

  // Tags & Bullets
  const [tagsInput, setTagsInput] = useState<string>(
    Array.isArray(initialData?.tags) ? initialData.tags.join(", ") : ""
  );
  const [features, setFeatures] = useState<string[]>(
    Array.isArray(initialData?.features) && initialData.features.length > 0 
      ? initialData.features 
      : ["Complete Syllabus with Live Sessions", "150+ Curated Interview Problems", "Lifetime Access & Certificate"]
  );
  const [requirements, setRequirements] = useState<string[]>(
    Array.isArray(initialData?.requirements) && initialData.requirements.length > 0 
      ? initialData.requirements 
      : ["Basic syntax in C++, Java, or Python"]
  );

  // Instructors Multi-select
  const [availableInstructors, setAvailableInstructors] = useState<Instructor[]>([]);
  const [selectedInstructorIds, setSelectedInstructorIds] = useState<string[]>(
    initialData?.instructor_ids || []
  );
  const [instructorsLoading, setInstructorsLoading] = useState(true);

  // Saving & Status
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Fetch available instructors
  useEffect(() => {
    const fetchInstructors = async () => {
      const token = getStoredToken();
      try {
        setInstructorsLoading(true);
        const res = await fetch(`${backendUrl}/api/v1/instructors/`, {
          headers: token ? { "Authorization": `Bearer ${token}` } : {}
        });
        if (res.ok) {
          const data = await res.json();
          const items = Array.isArray(data) ? data : data.items || [];
          setAvailableInstructors(items);
        }
      } catch (err) {
        console.error("Failed to load instructors:", err);
      } finally {
        setInstructorsLoading(false);
      }
    };
    fetchInstructors();
  }, [backendUrl]);

  // Auto-slug generator helper
  const handleAutoSlug = () => {
    if (!title) return;
    const auto = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setSlug(auto);
  };

  const toggleInstructor = (id: string) => {
    setSelectedInstructorIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleAddFeature = () => setFeatures([...features, ""]);
  const handleUpdateFeature = (idx: number, val: string) => {
    const next = [...features];
    next[idx] = val;
    setFeatures(next);
  };
  const handleRemoveFeature = (idx: number) => {
    setFeatures(features.filter((_, i) => i !== idx));
  };

  const handleAddRequirement = () => setRequirements([...requirements, ""]);
  const handleUpdateRequirement = (idx: number, val: string) => {
    const next = [...requirements];
    next[idx] = val;
    setRequirements(next);
  };
  const handleRemoveRequirement = (idx: number) => {
    setRequirements(requirements.filter((_, i) => i !== idx));
  };

  // Submit Handler
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!title.trim()) {
      setErrorMsg("Course title is required.");
      return;
    }
    if (!slug.trim()) {
      setErrorMsg("SEO slug is required.");
      return;
    }

    const token = getStoredToken();
    if (!token) {
      setErrorMsg("Authentication token not found. Please log in again.");
      return;
    }

    const parsedTags = tagsInput
      .split(",")
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const payload: Record<string, any> = {
      title: title.trim(),
      slug: slug.trim().toLowerCase(),
      description: description.trim(),
      short_description: shortDescription.trim(),
      category: category,
      price: Number(price) || 0,
      original_price: Number(originalPrice) || 0,
      is_pro: Boolean(isPro),
      is_popular: Boolean(isPopular),
      status: status,
      tags: parsedTags,
      instructor_ids: selectedInstructorIds,
      metadata: {
        ...(initialData?.metadata || {}),
        difficulty: difficulty,
        language: language,
        thumbnail_url: thumbnailUrl.trim() || undefined,
        cover_image_url: coverImageUrl.trim() || undefined,
        promo_video_url: promoVideoUrl.trim() || undefined,
        features: features.filter(f => f.trim().length > 0),
        requirements: requirements.filter(r => r.trim().length > 0),
      }
    };

    try {
      setSaving(true);
      if (mode === "create") {
        const res = await fetch(`${backendUrl}/api/v1/admin/courses/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.detail || "Failed to create course.");
        }

        const newCourse = await res.json();
        setSuccessMsg("Course created successfully! Redirecting to Curriculum Builder...");
        setTimeout(() => {
          router.push(`/admin/courses/${newCourse.id}/curriculum`);
        }, 800);
      } else {
        const courseId = initialData?.id;
        const res = await fetch(`${backendUrl}/api/v1/admin/courses/${courseId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.detail || "Failed to update course.");
        }

        setSuccessMsg("Course details saved successfully!");
      }
    } catch (err: any) {
      console.error("Error saving course details:", err);
      setErrorMsg(err.message || "Failed to save course.");
    } finally {
      setSaving(false);
    }
  };

  const discountPercent = originalPrice > price 
    ? Math.round(((originalPrice - price) / originalPrice) * 100) 
    : 0;

  return (
    <form onSubmit={handleSave} className="space-y-8">
      {/* Alert Notices */}
      {errorMsg && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 p-4 rounded-2xl flex items-center gap-3">
          <AlertCircle size={20} className="shrink-0" />
          <span className="text-sm font-semibold">{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 p-4 rounded-2xl flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <CheckCircle2 size={20} className="shrink-0" />
            <span className="text-sm font-semibold">{successMsg}</span>
          </div>
          {mode === "edit" && (
            <button
              type="button"
              onClick={() => router.push(`/admin/courses/${initialData?.id}/curriculum`)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 text-white text-xs font-bold hover:bg-emerald-600 transition-colors"
            >
              <span>Go to Curriculum Builder</span>
              <ArrowRight size={13} />
            </button>
          )}
        </div>
      )}

      {/* Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (2 Cols): Core Info, Pricing, Descriptions */}
        <div className="lg:col-span-2 space-y-6">

          {/* 1. Identity & Classification */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <BookOpen size={18} className="text-brand-500" />
                Course Identity & Classification
              </CardTitle>
              <CardDescription>
                Define the primary title, SEO URL slug, category, and target difficulty.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title" className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Course Title *
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Data Structures & Algorithms Mastery Program"
                  className="mt-1 font-semibold"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="slug" className="text-xs font-bold uppercase tracking-wider text-gray-500">
                      SEO Slug *
                    </Label>
                    <button
                      type="button"
                      onClick={handleAutoSlug}
                      className="text-[11px] text-brand-500 hover:underline font-bold"
                    >
                      Generate from title
                    </button>
                  </div>
                  <Input
                    id="slug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="e.g. dsa-mastery-program"
                    className="mt-1 font-mono text-xs"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="category" className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    Category *
                  </Label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="mt-1 flex h-10 w-full rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-3 py-2 text-sm text-gray-900 dark:text-white"
                  >
                    <option value="core-dsa">Core DSA</option>
                    <option value="interview-prep">Interview Preparation</option>
                    <option value="system-design">System Design (HLD/LLD)</option>
                    <option value="advanced">Advanced Topics</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                <div>
                  <Label htmlFor="difficulty" className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    Difficulty Level
                  </Label>
                  <select
                    id="difficulty"
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="mt-1 flex h-10 w-full rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-3 py-2 text-sm text-gray-900 dark:text-white"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="language" className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    Language
                  </Label>
                  <Input
                    id="language"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    placeholder="English / Hinglish"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="status" className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    Course Status *
                  </Label>
                  <select
                    id="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="mt-1 flex h-10 w-full rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-3 py-2 text-sm font-bold text-gray-900 dark:text-white"
                  >
                    <option value="active">Active (Published)</option>
                    <option value="upcoming">Upcoming (Coming Soon)</option>
                    <option value="draft">Draft (Admin Only)</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 2. Pricing & Pro Membership */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <DollarSign size={18} className="text-emerald-500" />
                Pricing & Entitlements
              </CardTitle>
              <CardDescription>
                Configure individual purchase price and inclusion in the CrackDSA Pro pass.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price" className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    Selling Price (₹) *
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="mt-1 text-lg font-bold"
                  />
                  <span className="text-[11px] text-gray-400 mt-1 block">Set 0 for a 100% Free Course</span>
                </div>

                <div>
                  <Label htmlFor="original_price" className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    Original MRP (₹)
                  </Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input
                      id="original_price"
                      type="number"
                      min="0"
                      value={originalPrice}
                      onChange={(e) => setOriginalPrice(Number(e.target.value))}
                      className="text-lg font-bold"
                    />
                    {discountPercent > 0 && (
                      <span className="px-2.5 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 font-bold text-xs shrink-0 border border-emerald-500/20">
                        {discountPercent}% OFF
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-gray-400 mt-1 block">Used for strike-through list price</span>
                </div>
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <label className="flex items-start gap-3 p-3.5 rounded-xl border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={isPro}
                    onChange={(e) => setIsPro(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                  />
                  <div>
                    <div className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                      Included in CrackDSA Pro
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 font-black">PRO</span>
                    </div>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                      Active Pro subscription holders unlock this course automatically.
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3.5 rounded-xl border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={isPopular}
                    onChange={(e) => setIsPopular(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                  />
                  <div>
                    <div className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                      Popular / Trending Badge
                      <Sparkles size={12} className="text-amber-500" />
                    </div>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                      Highlights course card with a "Trending" badge in student catalogs.
                    </p>
                  </div>
                </label>
              </div>
            </CardContent>
          </Card>

          {/* 3. Detailed Descriptions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Settings size={18} className="text-brand-500" />
                Descriptions & Overview
              </CardTitle>
              <CardDescription>
                Detailed copy displayed on the course landing page and catalog cards.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="short_desc" className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Short Description (Card Summary)
                </Label>
                <textarea
                  id="short_desc"
                  rows={2}
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  placeholder="One or two sentences summarizing the course for search cards and hero banners..."
                  className="mt-1 flex w-full rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-3 py-2 text-sm text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <Label htmlFor="long_desc" className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Full Course Overview
                </Label>
                <textarea
                  id="long_desc"
                  rows={6}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Comprehensive breakdown of what students will learn, weekly milestones, mentoring details, and outcomes..."
                  className="mt-1 flex w-full rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-3 py-2 text-sm text-gray-900 dark:text-white font-mono leading-relaxed"
                />
              </div>

              <div>
                <Label htmlFor="tags" className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Tags (Comma separated)
                </Label>
                <Input
                  id="tags"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="DSA, LeetCode, Dynamic Programming, Placement Prep"
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          {/* 4. Features & Highlights */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles size={18} className="text-amber-500" />
                Key Highlights & Prerequisites
              </CardTitle>
              <CardDescription>
                Bullet points shown in the syllabus feature box and landing page.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Features List */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    Course Features (Bullets)
                  </Label>
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="text-xs text-brand-500 font-bold hover:underline inline-flex items-center gap-1"
                  >
                    <Plus size={13} /> Add Feature
                  </button>
                </div>
                {features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Input
                      value={feat}
                      onChange={(e) => handleUpdateFeature(idx, e.target.value)}
                      placeholder="e.g. 150+ Curated Interview Problems"
                      className="text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(idx)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Prerequisites List */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    Prerequisites (Requirements)
                  </Label>
                  <button
                    type="button"
                    onClick={handleAddRequirement}
                    className="text-xs text-brand-500 font-bold hover:underline inline-flex items-center gap-1"
                  >
                    <Plus size={13} /> Add Requirement
                  </button>
                </div>
                {requirements.map((req, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Input
                      value={req}
                      onChange={(e) => handleUpdateRequirement(idx, e.target.value)}
                      placeholder="e.g. Basic understanding of conditionals and loops in any language"
                      className="text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveRequirement(idx)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column (1 Col): Media Previews & Instructors */}
        <div className="space-y-6">

          {/* Media Links & Visual Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <ImageIcon size={18} className="text-blue-500" />
                Media & Visual Assets
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="thumbnail" className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Thumbnail Image URL (16:9)
                </Label>
                <Input
                  id="thumbnail"
                  value={thumbnailUrl}
                  onChange={(e) => setThumbnailUrl(e.target.value)}
                  placeholder="https://cdn.crackdsa.com/..."
                  className="mt-1 text-xs"
                />
                {/* Live Preview */}
                {thumbnailUrl && (
                  <div className="mt-2 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 aspect-video relative bg-gray-100 dark:bg-gray-900">
                    <img 
                      src={thumbnailUrl} 
                      alt="Thumbnail Preview" 
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.target as any).style.display = 'none'; }}
                    />
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="cover" className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Cover Banner URL (Wide)
                </Label>
                <Input
                  id="cover"
                  value={coverImageUrl}
                  onChange={(e) => setCoverImageUrl(e.target.value)}
                  placeholder="https://cdn.crackdsa.com/banner.jpg"
                  className="mt-1 text-xs"
                />
              </div>

              <div>
                <Label htmlFor="promo" className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Promo Teaser Video URL
                </Label>
                <Input
                  id="promo"
                  value={promoVideoUrl}
                  onChange={(e) => setPromoVideoUrl(e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                  className="mt-1 text-xs"
                />
              </div>
            </CardContent>
          </Card>

          {/* Instructors Multi-select */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Users size={18} className="text-brand-500" />
                Assigned Instructors
              </CardTitle>
              <CardDescription>
                Select instructors teaching this course.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {instructorsLoading ? (
                <div className="py-6 flex items-center justify-center gap-2 text-gray-400 text-xs">
                  <Loader2 size={16} className="animate-spin text-brand-500" />
                  <span>Loading instructors list...</span>
                </div>
              ) : availableInstructors.length === 0 ? (
                <div className="text-xs text-gray-400 py-3 text-center">
                  No instructors found in database. Create instructors in the Instructors console.
                </div>
              ) : (
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {availableInstructors.map((inst) => {
                    const isSelected = selectedInstructorIds.includes(inst.id);
                    return (
                      <div
                        key={inst.id}
                        onClick={() => toggleInstructor(inst.id)}
                        className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-brand-500/10 border-brand-500/30 text-gray-900 dark:text-white"
                            : "border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 text-gray-600 dark:text-gray-400"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-brand-500/20 text-brand-600 font-bold flex items-center justify-center text-xs overflow-hidden">
                            {inst.avatar_url || inst.profile_image_url ? (
                              <img src={inst.avatar_url || inst.profile_image_url} alt="" className="w-full h-full object-cover" />
                            ) : (
                              inst.name.charAt(0)
                            )}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-gray-900 dark:text-white">{inst.name}</div>
                            <div className="text-[10px] text-gray-400">{inst.role || inst.company || "Instructor"}</div>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}}
                          className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Sticky Action Footer Box */}
          <div className="p-5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-sm space-y-3 sticky top-6">
            <button
              type="submit"
              disabled={saving}
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm shadow-md shadow-brand-500/20 transition-all cursor-pointer disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Saving Details...</span>
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span>{mode === "create" ? "Create Course" : "Save Course Details"}</span>
                </>
              )}
            </button>

            {mode === "edit" && (
              <button
                type="button"
                onClick={() => router.push(`/admin/courses/${initialData?.id}/curriculum`)}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 font-bold text-xs hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
              >
                <span>Go to Curriculum Builder</span>
                <ArrowRight size={14} />
              </button>
            )}
          </div>
        </div>

      </div>
    </form>
  );
}
