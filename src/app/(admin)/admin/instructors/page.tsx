"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { getStoredToken } from "@/functions/auth";
import Button from "@/components/ui/button/Button";
import { 
  Lock, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Users, 
  Loader2,
  AlertCircle,
  Eye,
  Building2
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
};

export default function AdminInstructorsPage() {
  const { user, isLoading: authLoading, isLoggedIn } = useAuth();
  const router = useRouter();
  
  // State for instructors list
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "active" | "inactive">("all");

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

  // Fetch all admin instructors
  const fetchInstructors = useCallback(async () => {
    const token = getStoredToken();
    if (!token) return;

    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${backendUrl}/api/v1/admin/instructors/`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!res.ok) {
        throw new Error(`Failed to load: ${res.statusText}`);
      }

      const data = await res.json();
      setInstructors(data.items || []);
    } catch (err: unknown) {
      console.error("Failed to load admin instructors:", err);
      const errMessage = err instanceof Error ? err.message : String(err);
      setError(errMessage || "Failed to load admin instructors catalog.");
    } finally {
      setLoading(false);
    }
  }, [backendUrl]);

  useEffect(() => {
    if (isLoggedIn && user?.roles?.includes("admin")) {
      fetchInstructors();
    }
  }, [isLoggedIn, user, fetchInstructors]);

  useEffect(() => {
    document.title = "Instructors Management | CrackDSA";
  }, []);

  // Handle soft delete
  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to soft-delete ${name}? Instructors will no longer be assigned to courses.`)) {
      return;
    }

    const token = getStoredToken();
    if (!token) return;

    try {
      const res = await fetch(`${backendUrl}/api/v1/admin/instructors/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!res.ok) {
        throw new Error("Failed to delete the instructor.");
      }

      fetchInstructors();
    } catch (err: unknown) {
      const errMessage = err instanceof Error ? err.message : String(err);
      alert(errMessage || "Delete transaction failed.");
    }
  };

  // Filter & Search computation
  const filteredInstructors = instructors.filter((instructor) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      instructor.name.toLowerCase().includes(query) || 
      instructor.role.toLowerCase().includes(query) ||
      (instructor.sub_title && instructor.sub_title.toLowerCase().includes(query));

    const matchesStatus = 
      activeFilter === "all" ||
      (activeFilter === "active" && instructor.is_active) ||
      (activeFilter === "inactive" && !instructor.is_active);

    return matchesSearch && matchesStatus;
  });

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
    <div className="max-w-6xl mx-auto space-y-8 pb-20 px-4">
      
      {/* Header Dashboard */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-100 dark:border-gray-800/80 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-950 dark:text-white tracking-tight">
            Course Instructors
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-semibold mt-1">
            Manage course instructors, their profiles, and metadata for course assignments.
          </p>
        </div>
        <Button 
          onClick={() => router.push("/admin/instructors/add")}
          startIcon={<Plus size={16} />}
          variant="primary"
          size="sm"
          className="self-start sm:self-center"
        >
          Add New Instructor
        </Button>
      </div>

      {/* Filtering Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/70 p-4.5 rounded-2xl">
        
        {/* Search Input bar */}
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text"
            placeholder="Search by name, role, or subtitle..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-transparent text-sm text-gray-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500 dark:focus:ring-brand-400 placeholder:text-gray-400 font-medium"
          />
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-gray-100 dark:bg-gray-800 self-start md:self-auto">
          {(["all", "active", "inactive"] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                activeFilter === filter 
                  ? "bg-white dark:bg-gray-900 text-gray-950 dark:text-white shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-950 dark:hover:text-gray-200"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Main Table Content */}
      {loading ? (
        <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-8 space-y-4 animate-pulse">
          <div className="h-6 w-1/4 bg-gray-100 dark:bg-gray-800 rounded-lg" />
          <div className="space-y-3 pt-2">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-16 w-full bg-gray-50 dark:bg-gray-800/40 rounded-xl" />
            ))}
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-500/5 border border-red-500/10 rounded-2xl p-6 flex items-start gap-3">
          <AlertCircle size={20} className="text-red-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-black text-red-600">Database Connection Failure</h4>
            <p className="text-xs text-red-500/80 mt-1 font-semibold">{error}</p>
          </div>
        </div>
      ) : filteredInstructors.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl space-y-4">
          <Users size={40} className="mx-auto text-gray-300 dark:text-gray-700" />
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-gray-950 dark:text-white">No Instructors Found</h3>
            <p className="text-xs text-gray-400 max-w-sm mx-auto">
              No assets matched your active search query or filter selection tags.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-2xl overflow-hidden shadow-theme-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-800/30">
                  <th className="px-6 py-4.5 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Instructor Details</th>
                  <th className="px-6 py-4.5 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Role</th>
                  <th className="px-6 py-4.5 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Metadata</th>
                  <th className="px-6 py-4.5 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4.5 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60">
                {filteredInstructors.map((instructor) => {
                  return (
                    <tr 
                      key={instructor.id}
                      className="hover:bg-gray-50/40 dark:hover:bg-gray-800/10 transition-all group"
                    >
                      {/* Instructor Info column */}
                      <td className="px-6 py-4.5 max-w-sm">
                        <div className="flex items-start gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 font-bold border border-brand-500/10">
                            <Users size={16} />
                          </div>
                          <div className="space-y-1">
                            <Link 
                              href={`/admin/instructors/${instructor.id}`}
                              className="font-bold text-sm text-gray-900 dark:text-white leading-tight hover:text-brand-500 dark:hover:text-brand-400 transition-colors"
                            >
                              {instructor.name}
                            </Link>
                            {instructor.sub_title && (
                              <div className="text-xs text-gray-400 line-clamp-1">
                                {instructor.sub_title}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Role column */}
                      <td className="px-6 py-4.5">
                        <div className="flex items-center gap-1.5">
                          <Building2 size={14} className="text-gray-400" />
                          <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">{instructor.role}</span>
                        </div>
                      </td>

                      {/* Metadata column */}
                      <td className="px-6 py-4.5">
                        <div className="flex flex-wrap gap-1.5">
                          {instructor.metadata?.color ? (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold uppercase bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/10">
                              Custom Color
                            </span>
                          ) : null}
                          {Object.keys(instructor.metadata || {}).length > (instructor.metadata?.color ? 1 : 0) ? (
                            <span className="text-xs text-gray-400">
                              +{Object.keys(instructor.metadata || {}).length} fields
                            </span>
                          ) : (
                            <span className="text-xs text-gray-400">No metadata</span>
                          )}
                        </div>
                      </td>

                      {/* Status column */}
                      <td className="px-6 py-4.5">
                        <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                          instructor.is_active
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/10"
                            : "bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/10"
                        }`}>
                          {instructor.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>

                      {/* Actions column */}
                      <td className="px-6 py-4.5">
                        <div className="flex items-center gap-2 justify-end">
                          <Link
                            href={`/admin/instructors/${instructor.id}`}
                            className="inline-flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-bold text-brand-600 dark:text-brand-400 bg-brand-500/5 hover:bg-brand-500/10 transition-all border border-brand-500/10 group-hover:opacity-100 opacity-0"
                            title="View & Edit"
                          >
                            <Eye size={14} />
                            View
                          </Link>
                          <button
                            onClick={() => handleDelete(instructor.id, instructor.name)}
                            className="inline-flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-bold text-red-600 dark:text-red-400 bg-red-500/5 hover:bg-red-500/10 transition-all border border-red-500/10 group-hover:opacity-100 opacity-0"
                            title="Soft Delete"
                          >
                            <Trash2 size={14} />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
