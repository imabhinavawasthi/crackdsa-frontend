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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Lock, 
  ArrowLeft, 
  Loader2,
  AlertCircle,
  Edit3,
  Plus,
  Trash2,
  ExternalLink,
  CheckCircle2,
  Users
} from "lucide-react";
import Link from "next/link";

// Define Validation Schema
const instructorSchema = z.object({
  name: z.string().min(1, "Name is required"),
  role: z.string().min(1, "Role is required"),
  sub_title: z.string().nullable().optional(),
  bio: z.string().nullable().optional(),
  profile_image_url: z.string().nullable().optional(),
  is_active: z.boolean(),
});

type InstructorFormValues = z.infer<typeof instructorSchema>;

type Instructor = {
  id: string;
  name: string;
  role: string;
  sub_title: string | null;
  bio: string | null;
  profile_image_url: string | null;
  metadata: Record<string, unknown>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

type MetadataField = {
  key: string;
  value: string;
};

export default function InstructorDetailPage() {
  const { user, isLoading: authLoading, isLoggedIn } = useAuth();
  const params = useParams();
  const router = useRouter();
  
  const id = params?.id as string;

  const [instructor, setInstructor] = useState<Instructor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [editSuccess, setEditSuccess] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Metadata custom fields state
  const [metadataFields, setMetadataFields] = useState<MetadataField[]>([]);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<InstructorFormValues>({
    resolver: zodResolver(instructorSchema)
  });

  const fetchInstructor = useCallback(async () => {
    if (!id) return;
    const token = getStoredToken();
    if (!token) return;

    try {
      setLoading(true);
      setError(null);
      
      const res = await fetch(`${backendUrl}/api/v1/admin/instructors/${id}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!res.ok) {
        if (res.status === 404) {
          throw new Error("Instructor could not be found.");
        }
        throw new Error(`Failed to load instructor: ${res.statusText}`);
      }

      const data = await res.json();
      setInstructor(data);

      // Reset react-hook-form default values
      reset({
        name: data.name,
        role: data.role,
        sub_title: data.sub_title || "",
        bio: data.bio || "",
        profile_image_url: data.profile_image_url || "",
        is_active: data.is_active,
      });

      // Map metadata
      const fields: MetadataField[] = Object.entries(data.metadata || {}).map(([key, value]) => ({
        key,
        value: String(value)
      }));
      setMetadataFields(fields);
    } catch (err: unknown) {
      console.error(`Failed to load instructor ${id}:`, err);
      const errMessage = err instanceof Error ? err.message : String(err);
      setError(errMessage);
    } finally {
      setLoading(false);
    }
  }, [id, backendUrl, reset]);

  useEffect(() => {
    if (isLoggedIn && user?.roles?.includes("admin")) {
      fetchInstructor();
    }
  }, [isLoggedIn, user, fetchInstructor]);

  useEffect(() => {
    document.title = instructor ? `${instructor.name} | CrackDSA Admin` : "Instructor Details | CrackDSA";
  }, [instructor]);

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
    setEditError(null);
    const token = getStoredToken();
    if (!token) {
      setEditError("Authentication token not found.");
      return;
    }

    try {
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
      };

      const res = await fetch(`${backendUrl}/api/v1/admin/instructors/${id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || `Failed to update: ${res.statusText}`);
      }

      const updatedData = await res.json();
      setInstructor(updatedData);
      setEditSuccess(true);
      setIsEditing(false);

      setTimeout(() => {
        setEditSuccess(false);
      }, 3000);
    } catch (err: unknown) {
      const errMessage = err instanceof Error ? err.message : String(err);
      setEditError(errMessage);
    }
  };

  const handleDelete = async () => {
    const token = getStoredToken();
    if (!token) return;

    try {
      setDeleting(true);
      const res = await fetch(`${backendUrl}/api/v1/admin/instructors/${id}?hard_delete=true`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!res.ok) {
        throw new Error("Failed to delete instructor.");
      }

      setIsDeleteDialogOpen(false);
      router.push("/admin/instructors");
    } catch (err: unknown) {
      const errMessage = err instanceof Error ? err.message : String(err);
      alert(errMessage);
    } finally {
      setDeleting(false);
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

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 size={32} className="animate-spin text-brand-500" />
        <p className="text-gray-500 dark:text-gray-400 text-sm font-semibold">Loading instructor details...</p>
      </div>
    );
  }

  if (error || !instructor) {
    return (
      <div className="max-w-3xl mx-auto space-y-4 pb-20 px-4 py-8">
        <button
          onClick={() => router.back()}
          className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-150 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="bg-red-500/5 border border-red-500/10 rounded-2xl p-6 flex items-start gap-3">
          <AlertCircle size={20} className="text-red-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-black text-red-600">Failed to Load Instructor</h4>
            <p className="text-xs text-red-500/80 mt-1 font-semibold">{error || "Instructor not found."}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-20 px-4">
      {/* Header Panel */}
      <div className="flex items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-150 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors"
            title="Go Back"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-950 dark:text-white tracking-tight">
              {instructor.name}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-semibold mt-1">
              {instructor.role}
            </p>
          </div>
        </div>

        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 transition-colors font-bold text-xs cursor-pointer"
          >
            <Edit3 size={14} />
            Edit Profile
          </button>
        )}
      </div>

      {/* State Alerts */}
      {editSuccess && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 flex items-start gap-3">
          <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-emerald-600 dark:text-emerald-400">Update Successful!</h4>
            <p className="text-xs text-emerald-500/80 mt-1">Instructor profile changes have been synchronized.</p>
          </div>
        </div>
      )}

      {editError && (
        <div className="bg-red-500/5 border border-red-500/10 rounded-2xl p-4 flex items-start gap-3">
          <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-red-600 dark:text-red-400">Error</h4>
            <p className="text-xs text-red-500/80 mt-1">{editError}</p>
          </div>
        </div>
      )}

      {/* View or Edit mode */}
      {isEditing ? (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle>Edit Instructor Profile</CardTitle>
              <CardDescription>Modify role, tagline details, and metadata.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name <span className="text-red-500">*</span></Label>
                  <Input 
                    id="name" 
                    {...register("name")} 
                  />
                  {errors.name && (
                    <p className="text-xs text-red-500 font-semibold">{errors.name.message}</p>
                  )}
                </div>

                {/* Role */}
                <div className="space-y-2">
                  <Label htmlFor="role">Role / Corporate Title <span className="text-red-500">*</span></Label>
                  <Input 
                    id="role" 
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
                  {...register("sub_title")} 
                />
              </div>

              {/* Biography */}
              <div className="space-y-2">
                <Label htmlFor="bio">Biography Resume</Label>
                <Textarea 
                  id="bio" 
                  rows={4} 
                  {...register("bio")} 
                />
              </div>

              {/* Profile Image URL */}
              <div className="space-y-2">
                <Label htmlFor="profile_image_url">Avatar Image URL</Label>
                <Input 
                  id="profile_image_url" 
                  type="url" 
                  {...register("profile_image_url")} 
                />
              </div>

              {/* Active Toggle Status */}
              <div className="space-y-2">
                <Label htmlFor="is_active">Visibility Status</Label>
                <Select 
                  id="is_active" 
                  defaultValue={instructor.is_active ? "true" : "false"}
                  onChange={(e) => reset({ ...instructor, is_active: e.target.value === "true" })}
                >
                  <option value="true">Active (Visible)</option>
                  <option value="false">Inactive (Hidden)</option>
                </Select>
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
                          placeholder="Property name"
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

              {/* Form Actions */}
              <div className="flex items-center gap-3 border-t border-gray-200 dark:border-gray-800 pt-6 justify-end">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
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
                    "Save Changes"
                  )}
                </button>
              </div>

            </CardContent>
          </Card>
        </form>
      ) : (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Instructor Profile Sheet</CardTitle>
                <CardDescription>General credentials configuration parameters.</CardDescription>
              </div>
              <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                instructor.is_active
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/10"
                  : "bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/10"
              }`}>
                {instructor.is_active ? "Active" : "Inactive"}
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <Label className="text-gray-400 dark:text-gray-500">Name</Label>
                <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">{instructor.name}</p>
              </div>
              <div>
                <Label className="text-gray-400 dark:text-gray-500">Role</Label>
                <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">{instructor.role}</p>
              </div>
              {instructor.sub_title && (
                <div className="sm:col-span-2">
                  <Label className="text-gray-400 dark:text-gray-500">Subtitle</Label>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">{instructor.sub_title}</p>
                </div>
              )}
            </div>

            {instructor.bio && (
              <div className="border-t border-gray-150 dark:border-gray-800 pt-4">
                <Label className="text-gray-400 dark:text-gray-500">Biography</Label>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mt-1.5 whitespace-pre-wrap">{instructor.bio}</p>
              </div>
            )}

            {instructor.profile_image_url && (
              <div className="border-t border-gray-150 dark:border-gray-800 pt-4">
                <Label className="text-gray-400 dark:text-gray-500">Avatar Image</Label>
                <div className="flex items-center gap-3 mt-1.5">
                  <img
                    src={instructor.profile_image_url}
                    alt={instructor.name}
                    className="w-16 h-16 rounded-xl object-cover border border-gray-200 dark:border-gray-800"
                  />
                  <a
                    href={instructor.profile_image_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-brand-500 hover:underline"
                  >
                    Open Link <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            )}

            {Object.keys(instructor.metadata || {}).length > 0 && (
              <div className="border-t border-gray-150 dark:border-gray-800 pt-4 space-y-3">
                <Label className="text-gray-400 dark:text-gray-500">Metadata Properties</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.entries(instructor.metadata || {}).map(([key, value]) => (
                    <div key={key} className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-3.5">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">{key}</span>
                      <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="border-t border-gray-150 dark:border-gray-800 pt-6 flex items-center justify-between select-none">
              <span className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wide">
                Last Updated: {new Date(instructor.updated_at).toLocaleString()}
              </span>
              <button
                onClick={() => setIsDeleteDialogOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 border border-transparent transition-colors cursor-pointer"
              >
                <Trash2 size={14} />
                Delete Instructor
              </button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Delete Dialog Overlay */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Instructor Deletion</DialogTitle>
            <DialogDescription>
              Are you absolutely sure you want to delete instructor &quot;{instructor?.name}&quot;? This action will permanently erase their details and metadata from the database.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <button
              onClick={() => setIsDeleteDialogOpen(false)}
              className="px-4 py-2 text-xs font-bold text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="inline-flex items-center justify-center px-4 py-2 text-xs font-bold text-white bg-red-650 hover:bg-red-700 rounded-lg disabled:opacity-50 transition-colors cursor-pointer"
            >
              {deleting ? (
                <>
                  <Loader2 size={13} className="animate-spin mr-1.5" />
                  Deleting...
                </>
              ) : (
                "Delete Permanently"
              )}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
