"use client";

import { BACKEND_URL } from "@/config/api";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { getStoredToken } from "@/functions/auth";
import { DataTable } from "@/components/ui/data-table";
import { Card, CardContent } from "@/components/ui/card";
import { ColumnDef } from "@tanstack/react-table";
import { 
  Lock, 
  Plus, 
  Edit3, 
  Trash2, 
  Users, 
  Loader2,
  AlertCircle
} from "lucide-react";
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
  
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const backendUrl = BACKEND_URL;

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
        throw new Error(`Failed to load instructors: ${res.statusText}`);
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

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to soft-delete ${name}?`)) {
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

  // Define Columns for TanStack Table
  const columns = useMemo<ColumnDef<Instructor>[]>(() => [
    {
      accessorKey: "name",
      header: "Instructor",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-bold border border-gray-200 dark:border-gray-700">
              <Users size={16} />
            </div>
            <div className="space-y-0.5">
              <Link 
                href={`/admin/instructors/${item.id}`}
                className="font-bold text-sm text-gray-900 dark:text-white hover:text-brand-500 transition-colors"
              >
                {item.name}
              </Link>
              {item.sub_title && (
                <div className="text-xs text-gray-400 dark:text-gray-500 line-clamp-1">
                  {item.sub_title}
                </div>
              )}
            </div>
          </div>
        );
      }
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => (
        <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
          {row.getValue("role")}
        </span>
      )
    },
    {
      accessorKey: "is_active",
      header: "Status",
      cell: ({ row }) => {
        const isActive = row.getValue("is_active") as boolean;
        return (
          <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
            isActive
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/10"
              : "bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/10"
          }`}>
            {isActive ? "Active" : "Inactive"}
          </span>
        );
      }
    },
    {
      accessorKey: "created_at",
      header: "Joined On",
      cell: ({ row }) => (
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {new Date(row.getValue("created_at")).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
        </span>
      )
    },
    {
      id: "actions",
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="flex items-center gap-2 justify-end">
            <Link
              href={`/admin/instructors/${item.id}`}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700 transition-colors"
            >
              <Edit3 size={13} />
              Edit
            </Link>
            <button
              onClick={() => handleDelete(item.id, item.name)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 border border-transparent transition-colors cursor-pointer"
            >
              <Trash2 size={13} />
              Delete
            </button>
          </div>
        );
      }
    }
  ], [backendUrl]);

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
    <div className="max-w-6xl mx-auto space-y-8 pb-20 px-4">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-950 dark:text-white tracking-tight">
            Course Instructors
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-semibold mt-1">
            Manage course instructors, profiles, and assignment configurations.
          </p>
        </div>
        <button 
          onClick={() => router.push("/admin/instructors/add")}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-gray-200 text-white dark:text-gray-900 font-bold text-sm shadow-sm transition-colors cursor-pointer"
        >
          <Plus size={16} />
          Add Instructor
        </button>
      </div>

      {/* Main Database Content */}
      {loading ? (
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-8 space-y-4 animate-pulse">
          <div className="h-6 w-1/4 bg-gray-100 dark:bg-gray-800 rounded-lg" />
          <div className="space-y-3 pt-2">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-16 w-full bg-gray-50 dark:bg-gray-900 rounded-xl" />
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
      ) : (
        <Card>
          <CardContent className="pt-6">
            <DataTable 
              columns={columns} 
              data={instructors} 
              searchKey="name" 
              searchPlaceholder="Search instructors by name..." 
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
