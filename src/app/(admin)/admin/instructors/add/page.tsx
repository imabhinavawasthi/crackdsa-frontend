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
import { 
  Lock, 
  ArrowLeft, 
  Loader2,
  AlertCircle,
  Plus,
  Trash2
} from "lucide-react";
import Link from "next/link";

// Define Validation Schema
const instructorSchema = z.object({
  name: z.string().min(1, "Name is required"),
  role: z.string().min(1, "Role is required"),
  sub_title: z.string().nullable().optional(),
  bio: z.string().nullable().optional(),
  profile_image_url: z.string().nullable().optional(),
});

type InstructorFormValues = z.infer<typeof instructorSchema>;

type MetadataField = {
  key: string;
  value: string;
};

export default function AddInstructorPage() {
  const { user, isLoading: authLoading, isLoggedIn } = useAuth();
  const router = useRouter();

  // Custom key-value fields for metadata
  const [metadataFields, setMetadataFields] = useState<MetadataField[]>([]);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<InstructorFormValues>({
    resolver: zodResolver(instructorSchema),
    defaultValues: {
      name: "",
      role: "",
      sub_title: "",
      bio: "",
      profile_image_url: "",
    }
  });

  useEffect(() => {
    document.title = "Add Instructor | CrackDSA";
  }, []);

  const addMetadataField = () => {
    setMetadataFields([...metadataFields, { key: "", value: "" }]);
  };

  const removeMetadataField = (index: number) => {
    setMetadataFields(metadataFields.filter((_, i) => i !== index));
  };

  const updateMetadataField = (index: number, key: "key" | "value", val: string) => {
    const updated = [...metadataFields];
    updated[index][key] = val;
    setMetadataFields(updated);
  };

  const onSubmit = async (values: InstructorFormValues) => {
    setSubmitError(null);
    const token = getStoredToken();
    if (!token) {
      setSubmitError("Authentication token not found. Please log in again.");
      return;
    }

    try {
      // Build metadata object from custom fields
      const metadata: Record<string, string> = {};
      metadataFields.forEach((field) => {
        if (field.key.trim()) {
          metadata[field.key.trim()] = field.value.trim();
        }
      });

      const payload = {
        ...values,
        sub_title: values.sub_title || null,
        bio: values.bio || null,
        profile_image_url: values.profile_image_url || null,
        metadata: metadata,
        is_active: true
      };

      const res = await fetch(`${backendUrl}/api/v1/admin/instructors/`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || `Failed to create instructor: ${res.statusText}`);
      }

      setSubmitSuccess(true);
      setTimeout(() => {
        router.push("/admin/instructors");
      }, 1500);
    } catch (err: unknown) {
      const errMessage = err instanceof Error ? err.message : String(err);
      setSubmitError(errMessage || "An error occurred while creating the instructor.");
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
        <div className="max-w-md w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-8 shadow-lg text-center space-y-6">
          <div className="w-16 h-16 bg-red-500/10 text-red-500 border border-red-500/10 rounded-2xl flex items-center justify-center mx-auto">
            <Lock size={30} />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-black text-gray-950 dark:text-white tracking-tight">Access Prohibited</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
              This environment is strictly reserved for CrackDSA Administrators.
            </p>
          </div>
          <div className="pt-2">
            <Link href="/dashboard" className="inline-flex w-full items-center justify-center px-5 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold transition-all shadow-md shadow-brand-500/15">
              Return to Student Site
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-20 px-4">
      {/* Header Back Link */}
      <div className="flex items-center gap-3 border-b border-gray-200 dark:border-gray-800 pb-6">
        <button
          onClick={() => router.back()}
          className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-150 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors"
          title="Go Back"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-950 dark:text-white tracking-tight">
            Create New Instructor
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-semibold mt-1">
            Add a new course instructor credentials to the catalog database.
          </p>
        </div>
      </div>

      {/* State Alerts */}
      {submitSuccess && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 flex items-start gap-3">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5 font-bold text-xs">
            ✓
          </div>
          <div>
            <h4 className="text-sm font-bold text-emerald-600 dark:text-emerald-400">Instructor Created Successfully!</h4>
            <p className="text-xs text-emerald-500/80 mt-1">Redirecting to listing...</p>
          </div>
        </div>
      )}

      {submitError && (
        <div className="bg-red-500/5 border border-red-500/10 rounded-2xl p-4 flex items-start gap-3">
          <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-red-600 dark:text-red-400">Creation Failed</h4>
            <p className="text-xs text-red-500/80 mt-1">{submitError}</p>
          </div>
        </div>
      )}

      {/* Main Form Body */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Instructor Profile Specifications</CardTitle>
            <CardDescription>Configure bio, tagline role, and custom properties.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Full Name <span className="text-red-500">*</span></Label>
                <Input 
                  id="name" 
                  placeholder="e.g. Abhinav Awasthi" 
                  {...register("name")} 
                />
                {errors.name && (
                  <p className="text-xs text-red-500 font-semibold">{errors.name.message}</p>
                )}
              </div>

              {/* Role */}
              <div className="space-y-2">
                <Label htmlFor="role">Role / Title <span className="text-red-500">*</span></Label>
                <Input 
                  id="role" 
                  placeholder="e.g. Founder, Ex-Google SDE" 
                  {...register("role")} 
                />
                {errors.role && (
                  <p className="text-xs text-red-500 font-semibold">{errors.role.message}</p>
                )}
              </div>
            </div>

            {/* Subtitle */}
            <div className="space-y-2">
              <Label htmlFor="sub_title">Tagline Subtitle</Label>
              <Input 
                id="sub_title" 
                placeholder="e.g. Mentor at CrackDSA" 
                {...register("sub_title")} 
              />
            </div>

            {/* Biography */}
            <div className="space-y-2">
              <Label htmlFor="bio">Biography Resume</Label>
              <Textarea 
                id="bio" 
                rows={4} 
                placeholder="Write a brief profile description..." 
                {...register("bio")} 
              />
            </div>

            {/* Profile Image URL */}
            <div className="space-y-2">
              <Label htmlFor="profile_image_url">Avatar Image URL</Label>
              <Input 
                id="profile_image_url" 
                type="url" 
                placeholder="https://example.com/avatar.jpg" 
                {...register("profile_image_url")} 
              />
            </div>

            {/* Metadata Fields Section */}
            <div className="space-y-4 border-t border-gray-200 dark:border-gray-800 pt-6">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-bold uppercase tracking-wider">Custom Profile Metadata</Label>
                <button
                  type="button"
                  onClick={addMetadataField}
                  className="inline-flex items-center gap-1 text-xs font-bold text-gray-700 hover:text-gray-950 dark:text-gray-300 dark:hover:text-white transition-colors cursor-pointer"
                >
                  <Plus size={14} />
                  Add Property
                </button>
              </div>

              {metadataFields.length === 0 ? (
                <p className="text-xs text-gray-400 italic">No custom metadata attributes defined.</p>
              ) : (
                <div className="space-y-3">
                  {metadataFields.map((field, idx) => (
                    <div key={idx} className="flex gap-3 items-end">
                      <Input
                        placeholder="Property name (e.g. color, experience)"
                        value={field.key}
                        onChange={(e) => updateMetadataField(idx, "key", e.target.value)}
                        className="h-9 text-xs"
                      />
                      <Input
                        placeholder="Property value"
                        value={field.value}
                        onChange={(e) => updateMetadataField(idx, "value", e.target.value)}
                        className="h-9 text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => removeMetadataField(idx)}
                        className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-500/10 text-red-600 hover:bg-red-500/20 transition-colors shrink-0 cursor-pointer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Actions Panel */}
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
                disabled={isSubmitting}
                className="inline-flex items-center justify-center px-4 py-2 text-xs font-bold text-white bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-gray-200 dark:text-gray-900 rounded-lg shadow-sm disabled:opacity-50 transition-colors cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={13} className="animate-spin mr-1.5" />
                    Saving...
                  </>
                ) : (
                  "Create Instructor"
                )}
              </button>
            </div>

          </CardContent>
        </Card>
      </form>
    </div>
  );
}
