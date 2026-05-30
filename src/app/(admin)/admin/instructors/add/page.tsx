"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getStoredToken } from "@/functions/auth";
import Button from "@/components/ui/button/Button";
import { 
  Lock, 
  ArrowLeft, 
  Users, 
  Loader2,
  AlertCircle,
  Plus,
  Trash2,
  Tag
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

type MetadataField = {
  key: string;
  value: string;
};

export default function AddInstructorPage() {
  const { user, isLoading: authLoading, isLoggedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    document.title = "Add Instructor | CrackDSA";
  }, []);

  // Form state
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [bio, setBio] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState("");

  // Metadata state
  const [metadataFields, setMetadataFields] = useState<MetadataField[]>([]);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

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

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!name.trim() || !role.trim()) {
      setSubmitError("Name and Role are required fields.");
      return;
    }

    const token = getStoredToken();
    if (!token) {
      setSubmitError("Authentication token not found. Please log in again.");
      return;
    }

    try {
      setSubmitting(true);

      // Build metadata object from fields
      const metadata: Record<string, string> = {};
      metadataFields.forEach((field) => {
        if (field.key.trim()) {
          metadata[field.key.trim()] = field.value.trim();
        }
      });

      const payload = {
        name: name.trim(),
        role: role.trim(),
        sub_title: subTitle.trim() || null,
        bio: bio.trim() || null,
        profile_image_url: profileImageUrl.trim() || null,
        metadata: metadata
      };

      const res = await fetch(`${backendUrl}/api/v1/instructors`, {
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
      
      // Redirect after success
      setTimeout(() => {
        router.push("/admin/instructors");
      }, 1500);
    } catch (err: unknown) {
      const errMessage = err instanceof Error ? err.message : String(err);
      setSubmitError(errMessage || "An error occurred while creating the instructor.");
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
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-20 px-4">
      
      {/* Header with Back Button */}
      <div className="flex items-center gap-3 border-b border-gray-100 dark:border-gray-800/80 pb-6">
        <button
          onClick={() => router.back()}
          className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors"
          title="Go Back"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-950 dark:text-white tracking-tight">
            Create New Instructor
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-semibold mt-1">
            Add a new course instructor to the system
          </p>
        </div>
      </div>

      {/* Success Alert */}
      {submitSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 flex items-start gap-3"
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5">
            ✓
          </div>
          <div>
            <h4 className="text-sm font-bold text-emerald-600 dark:text-emerald-400">Instructor Created Successfully!</h4>
            <p className="text-xs text-emerald-500/80 mt-1">Redirecting to instructors list...</p>
          </div>
        </motion.div>
      )}

      {/* Error Alert */}
      {submitError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/5 border border-red-500/10 rounded-2xl p-4 flex items-start gap-3"
        >
          <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-red-600 dark:text-red-400">Creation Failed</h4>
            <p className="text-xs text-red-500/80 mt-1">{submitError}</p>
          </div>
        </motion.div>
      )}

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 sm:p-8">
        
        {/* Required Fields Section */}
        <div className="space-y-5">
          <h2 className="text-sm font-bold text-gray-950 dark:text-white uppercase tracking-wider">Required Information</h2>
          
          {/* Name Field */}
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Abhinav Awasthi"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800/50 text-gray-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50 dark:focus:ring-brand-400/50 placeholder:text-gray-400 text-sm"
            />
          </div>

          {/* Role Field */}
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
              Role <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g., Founder, CrackDSA"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800/50 text-gray-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50 dark:focus:ring-brand-400/50 placeholder:text-gray-400 text-sm"
            />
          </div>
        </div>

        {/* Optional Fields Section */}
        <div className="space-y-5 border-t border-gray-100 dark:border-gray-800 pt-6">
          <h2 className="text-sm font-bold text-gray-950 dark:text-white uppercase tracking-wider">Optional Information</h2>
          
          {/* Subtitle Field */}
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
              Subtitle / Tagline
            </label>
            <input
              type="text"
              value={subTitle}
              onChange={(e) => setSubTitle(e.target.value)}
              placeholder="e.g., Ex-Google SDE"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800/50 text-gray-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50 dark:focus:ring-brand-400/50 placeholder:text-gray-400 text-sm"
            />
          </div>

          {/* Bio Field */}
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
              Biography
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Extended biography and professional experience..."
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800/50 text-gray-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50 dark:focus:ring-brand-400/50 placeholder:text-gray-400 text-sm resize-none"
            />
          </div>

          {/* Profile Image URL */}
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
              Profile Image URL
            </label>
            <input
              type="url"
              value={profileImageUrl}
              onChange={(e) => setProfileImageUrl(e.target.value)}
              placeholder="https://example.com/avatar.jpg"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800/50 text-gray-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50 dark:focus:ring-brand-400/50 placeholder:text-gray-400 text-sm"
            />
          </div>
        </div>

        {/* Metadata Section */}
        <div className="space-y-5 border-t border-gray-100 dark:border-gray-800 pt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-950 dark:text-white uppercase tracking-wider">Custom Metadata</h2>
            <button
              type="button"
              onClick={addMetadataField}
              className="flex items-center gap-1 text-xs font-bold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition-colors"
            >
              <Plus size={14} />
              Add Field
            </button>
          </div>

          {metadataFields.length === 0 ? (
            <p className="text-xs text-gray-400 italic">No metadata fields added. You can add fields like color, social links, experience years, etc.</p>
          ) : (
            <div className="space-y-3">
              {metadataFields.map((field, index) => (
                <div key={index} className="flex gap-3 items-end">
                  <input
                    type="text"
                    value={field.key}
                    onChange={(e) => updateMetadataField(index, "key", e.target.value)}
                    placeholder="Key (e.g., 'color', 'twitter')"
                    className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800/50 text-gray-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50 placeholder:text-gray-400 text-xs"
                  />
                  <input
                    type="text"
                    value={field.value}
                    onChange={(e) => updateMetadataField(index, "value", e.target.value)}
                    placeholder="Value"
                    className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800/50 text-gray-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50 placeholder:text-gray-400 text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => removeMetadataField(index)}
                    className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 transition-colors shrink-0"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="bg-brand-500/5 border border-brand-500/10 rounded-xl p-3 text-xs text-brand-600 dark:text-brand-400">
            💡 <span className="font-semibold">Tip:</span> Use metadata to store UI colors, social links, experience years, specialties array, etc.
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center gap-3 border-t border-gray-100 dark:border-gray-800 pt-6 justify-end">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-5 py-2.5 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-950 dark:text-white font-bold text-xs hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
          >
            Cancel
          </button>
          <Button
            type="submit"
            disabled={submitting || submitSuccess}
            variant="primary"
            className="flex items-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Creating...
              </>
            ) : submitSuccess ? (
              <>✓ Created!</>
            ) : (
              <>
                <Plus size={14} />
                Create Instructor
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
