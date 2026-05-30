"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getStoredToken } from "@/functions/auth";
import Button from "@/components/ui/button/Button";
import { 
  Lock, 
  ArrowLeft, 
  Loader2,
  AlertCircle,
  Edit3,
  Save,
  X,
  Plus,
  Trash2,
  ExternalLink,
  CheckCircle2,
  Users,
  Building2
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

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
  const [saving, setSaving] = useState(false);

  // Edit form state
  const [editName, setEditName] = useState("");
  const [editRole, setEditRole] = useState("");
  const [editSubTitle, setEditSubTitle] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editProfileImageUrl, setEditProfileImageUrl] = useState("");
  const [editIsActive, setEditIsActive] = useState(true);
  const [metadataFields, setMetadataFields] = useState<MetadataField[]>([]);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

  // Fetch specific instructor
  const fetchInstructor = useCallback(async () => {
    if (!id) return;
    const token = getStoredToken();
    if (!token) return;

    try {
      setLoading(true);
      setError(null);
      
      const res = await fetch(`${backendUrl}/api/v1/instructors/${id}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!res.ok) {
        if (res.status === 404) {
          throw new Error("Instructor could not be found.");
        }
        throw new Error(`Failed to load: ${res.statusText}`);
      }

      const data = await res.json();
      setInstructor(data);

      // Initialize edit form with fetched data
      setEditName(data.name);
      setEditRole(data.role);
      setEditSubTitle(data.sub_title || "");
      setEditBio(data.bio || "");
      setEditProfileImageUrl(data.profile_image_url || "");
      setEditIsActive(data.is_active);

      // Convert metadata to fields
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
  }, [id, backendUrl]);

  useEffect(() => {
    if (isLoggedIn && user?.roles?.includes("admin")) {
      fetchInstructor();
    }
  }, [isLoggedIn, user, fetchInstructor]);

  useEffect(() => {
    document.title = instructor ? `${instructor.name} | CrackDSA Admin` : "Instructor Details | CrackDSA";
  }, [instructor]);

  // Handle adding new metadata field
  const addMetadataField = () => {
    setMetadataFields([...metadataFields, { key: "", value: "" }]);
  };

  // Handle removing metadata field
  const removeMetadataField = (index: number) => {
    setMetadataFields(metadataFields.filter((_, i) => i !== index));
  };

  // Handle metadata field change
  const updateMetadataField = (index: number, key: "key" | "value", val: string) => {
    const updated = [...metadataFields];
    updated[index][key] = val;
    setMetadataFields(updated);
  };

  // Handle update
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditError(null);

    if (!editName.trim() || !editRole.trim()) {
      setEditError("Name and Role are required fields.");
      return;
    }

    const token = getStoredToken();
    if (!token) {
      setEditError("Authentication token not found.");
      return;
    }

    try {
      setSaving(true);

      // Build metadata object
      const metadata: Record<string, string> = {};
      metadataFields.forEach((field) => {
        if (field.key.trim()) {
          metadata[field.key.trim()] = field.value.trim();
        }
      });

      const payload = {
        name: editName.trim(),
        role: editRole.trim(),
        sub_title: editSubTitle.trim() || null,
        bio: editBio.trim() || null,
        profile_image_url: editProfileImageUrl.trim() || null,
        metadata: metadata,
        is_active: editIsActive
      };

      const res = await fetch(`${backendUrl}/api/v1/instructors/${id}`, {
        method: "PATCH",
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
    } finally {
      setSaving(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${instructor?.name}"? This action cannot be undone.`)) {
      return;
    }

    const token = getStoredToken();
    if (!token) return;

    try {
      const res = await fetch(`${backendUrl}/api/v1/instructors/${id}?hard_delete=true`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!res.ok) {
        throw new Error("Failed to delete instructor.");
      }

      router.push("/admin/instructors");
    } catch (err: unknown) {
      const errMessage = err instanceof Error ? err.message : String(err);
      alert(errMessage);
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
            <h1 className="text-2xl font-black text-gray-950 dark:text-white tracking-tight">Access Prohibited</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
              This environment is strictly reserved for CrackDSA Administrators.
            </p>
          </div>
        </motion.div>
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
          className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-red-500/5 border border-red-500/10 rounded-2xl p-6 flex items-start gap-3"
        >
          <AlertCircle size={20} className="text-red-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-black text-red-600">Failed to Load Instructor</h4>
            <p className="text-xs text-red-500/80 mt-1 font-semibold">{error || "Instructor not found."}</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-20 px-4">
      
      {/* Header with Back Button */}
      <div className="flex items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-800/80 pb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors"
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
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400 hover:bg-brand-500/20 transition-all font-bold text-xs border border-brand-500/20"
          >
            <Edit3 size={14} />
            Edit
          </button>
        )}
      </div>

      {/* Success Alert */}
      {editSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 flex items-start gap-3"
        >
          <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-emerald-600 dark:text-emerald-400">Update Successful!</h4>
            <p className="text-xs text-emerald-500/80 mt-1">Changes have been saved.</p>
          </div>
        </motion.div>
      )}

      {/* Error Alert */}
      {editError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/5 border border-red-500/10 rounded-2xl p-4 flex items-start gap-3"
        >
          <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-red-600 dark:text-red-400">Error</h4>
            <p className="text-xs text-red-500/80 mt-1">{editError}</p>
          </div>
        </motion.div>
      )}

      {/* Details or Edit Form */}
      {isEditing ? (
        <form onSubmit={handleUpdate} className="space-y-6 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 sm:p-8">
          
          {/* Required Fields */}
          <div className="space-y-5">
            <h2 className="text-sm font-bold text-gray-950 dark:text-white uppercase tracking-wider">Required Information</h2>
            
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800/50 text-gray-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
                Role <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={editRole}
                onChange={(e) => setEditRole(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800/50 text-gray-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-sm"
              />
            </div>
          </div>

          {/* Optional Fields */}
          <div className="space-y-5 border-t border-gray-100 dark:border-gray-800 pt-6">
            <h2 className="text-sm font-bold text-gray-950 dark:text-white uppercase tracking-wider">Optional Information</h2>
            
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
                Subtitle
              </label>
              <input
                type="text"
                value={editSubTitle}
                onChange={(e) => setEditSubTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800/50 text-gray-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
                Biography
              </label>
              <textarea
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800/50 text-gray-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-sm resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
                Profile Image URL
              </label>
              <input
                type="url"
                value={editProfileImageUrl}
                onChange={(e) => setEditProfileImageUrl(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800/50 text-gray-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-sm"
              />
            </div>

            <div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editIsActive}
                  onChange={(e) => setEditIsActive(e.target.checked)}
                  className="w-4 h-4 rounded border border-gray-300 dark:border-gray-700 cursor-pointer"
                />
                <span className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Active (Visible in Courses)
                </span>
              </label>
            </div>
          </div>

          {/* Metadata Section */}
          <div className="space-y-5 border-t border-gray-100 dark:border-gray-800 pt-6">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-gray-950 dark:text-white uppercase tracking-wider">Custom Metadata</h2>
              <button
                type="button"
                onClick={addMetadataField}
                className="flex items-center gap-1 text-xs font-bold text-brand-600 dark:text-brand-400 hover:text-brand-700"
              >
                <Plus size={14} />
                Add Field
              </button>
            </div>

            {metadataFields.length === 0 ? (
              <p className="text-xs text-gray-400 italic">No metadata fields. You can add custom fields here.</p>
            ) : (
              <div className="space-y-3">
                {metadataFields.map((field, index) => (
                  <div key={index} className="flex gap-3 items-end">
                    <input
                      type="text"
                      value={field.key}
                      onChange={(e) => updateMetadataField(index, "key", e.target.value)}
                      placeholder="Key"
                      className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800/50 text-gray-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-xs"
                    />
                    <input
                      type="text"
                      value={field.value}
                      onChange={(e) => updateMetadataField(index, "value", e.target.value)}
                      placeholder="Value"
                      className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800/50 text-gray-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => removeMetadataField(index)}
                      className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10 text-red-600 hover:bg-red-500/20 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex items-center gap-3 border-t border-gray-100 dark:border-gray-800 pt-6 justify-end">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-5 py-2.5 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-950 dark:text-white font-bold text-xs hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
            >
              Cancel
            </button>
            <Button
              type="submit"
              disabled={saving}
              variant="primary"
              className="flex items-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={14} />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      ) : (
        <div className="space-y-6 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 sm:p-8">
          
          {/* View Mode - Instructor Info */}
          <div className="space-y-5">
            <h2 className="text-sm font-bold text-gray-950 dark:text-white uppercase tracking-wider">Profile Information</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  Name
                </label>
                <p className="text-sm font-semibold text-gray-950 dark:text-white">{instructor.name}</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  Role
                </label>
                <div className="flex items-center gap-1.5">
                  <Building2 size={14} className="text-gray-400" />
                  <p className="text-sm font-semibold text-gray-950 dark:text-white">{instructor.role}</p>
                </div>
              </div>

              {instructor.sub_title && (
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                    Subtitle
                  </label>
                  <p className="text-sm font-semibold text-gray-950 dark:text-white">{instructor.sub_title}</p>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  Status
                </label>
                <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                  instructor.is_active
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/10"
                    : "bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/10"
                }`}>
                  {instructor.is_active ? "Active" : "Inactive"}
                </span>
              </div>
            </div>

            {instructor.bio && (
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  Biography
                </label>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{instructor.bio}</p>
              </div>
            )}

            {instructor.profile_image_url && (
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  Profile Image
                </label>
                <div className="flex items-center gap-2">
                  <img
                    src={instructor.profile_image_url}
                    alt={instructor.name}
                    className="w-16 h-16 rounded-lg object-cover border border-gray-200 dark:border-gray-800"
                  />
                  <a
                    href={instructor.profile_image_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline"
                  >
                    View Image
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Metadata Display */}
          {Object.keys(instructor.metadata || {}).length > 0 && (
            <div className="space-y-5 border-t border-gray-100 dark:border-gray-800 pt-6">
              <h2 className="text-sm font-bold text-gray-950 dark:text-white uppercase tracking-wider">Metadata</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.entries(instructor.metadata || {}).map(([key, value]) => (
                  <div key={key} className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                      {key}
                    </p>
                    <p className="text-sm text-gray-950 dark:text-white font-semibold break-words">
                      {Array.isArray(value) ? value.join(", ") : String(value)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div className="border-t border-gray-100 dark:border-gray-800 pt-6 space-y-2">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              <span className="font-bold">Created:</span> {new Date(instructor.created_at).toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              <span className="font-bold">Updated:</span> {new Date(instructor.updated_at).toLocaleString()}
            </p>
          </div>

          {/* Delete Button */}
          <div className="border-t border-gray-100 dark:border-gray-800 pt-6 flex justify-end">
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 transition-all font-bold text-xs border border-red-500/20"
            >
              <Trash2 size={14} />
              Delete Permanently
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
