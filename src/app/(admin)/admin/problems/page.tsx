"use client";

import { BACKEND_URL } from "@/config/api";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { getStoredToken } from "@/functions/auth";
import { DataTable } from "@/components/ui/data-table";
import { Card, CardContent } from "@/components/ui/card";
import { ColumnDef } from "@tanstack/react-table";
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Code2, 
  Loader2,
  AlertCircle,
  ExternalLink,
  Eye
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type PracticeProblem = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  difficulty: "Easy" | "Medium" | "Hard";
  platform: string;
  problem_url: string | null;
  solutions: Record<string, unknown>;
  resources: {
    video_lectures?: string[];
    blogs?: Array<{ title: string; url: string }>;
    official_editorial_url?: string;
  };
  attributes: {
    difficulty_level?: number;
    pattern?: string;
    importance_score?: number;
    frequency_score?: number;
    tags?: string[];
    company_tags?: string[];
  };
  is_active: boolean;
  created_at: string;
};

export default function AdminProblemsPage() {
  const { user, isLoggedIn } = useAuth();
  const router = useRouter();
  
  const [problems, setProblems] = useState<PracticeProblem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const backendUrl = BACKEND_URL;

  const fetchProblems = useCallback(async () => {
    const token = getStoredToken();
    if (!token) return;

    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${backendUrl}/api/v1/admin/practice-problems`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!res.ok) {
        throw new Error(`Failed to load problems: ${res.statusText}`);
      }

      const data = await res.json();
      setProblems(data || []);
    } catch (err: unknown) {
      console.error("Failed to load admin problems:", err);
      const errMessage = err instanceof Error ? err.message : String(err);
      setError(errMessage || "Failed to load practice problems catalog.");
    } finally {
      setLoading(false);
    }
  }, [backendUrl]);

  useEffect(() => {
    if (isLoggedIn && user?.roles?.includes("admin")) {
      fetchProblems();
    }
  }, [isLoggedIn, user, fetchProblems]);

  useEffect(() => {
    document.title = "Practice Problems Catalog | CrackDSA";
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to soft-delete this practice problem?")) {
      return;
    }

    const token = getStoredToken();
    if (!token) return;

    try {
      const res = await fetch(`${backendUrl}/api/v1/admin/practice-problems/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!res.ok) {
        throw new Error("Failed to delete the practice problem.");
      }

      fetchProblems();
    } catch (err: unknown) {
      const errMessage = err instanceof Error ? err.message : String(err);
      alert(errMessage || "Delete transaction failed.");
    }
  };

  const getDifficultyStyles = (difficulty: "Easy" | "Medium" | "Hard") => {
    switch (difficulty) {
      case "Easy":
        return "bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 border border-emerald-500/10";
      case "Medium":
        return "bg-amber-500/5 text-amber-600 dark:text-amber-400 border border-amber-500/10";
      case "Hard":
        return "bg-rose-500/5 text-rose-600 dark:text-rose-400 border border-rose-500/10";
    }
  };

  const getPlatformStyles = (platform: string) => {
    const cleanPlatform = platform.toLowerCase();
    if (cleanPlatform.includes("leetcode")) {
      return "bg-amber-500/5 text-amber-600 dark:text-amber-400 border border-amber-500/10";
    } else if (cleanPlatform.includes("codeforces")) {
      return "bg-blue-500/5 text-blue-600 dark:text-blue-400 border border-blue-500/10";
    } else if (cleanPlatform.includes("hackerrank")) {
      return "bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 border border-emerald-500/10";
    } else if (cleanPlatform.includes("gfg") || cleanPlatform.includes("geeks")) {
      return "bg-green-500/5 text-green-650 dark:text-green-400 border border-green-500/10";
    } else {
      return "bg-gray-500/5 text-gray-650 dark:text-gray-400 border border-gray-500/10";
    }
  };

  // Define Columns for TanStack Table
  const columns = useMemo<ColumnDef<PracticeProblem>[]>(() => [
    {
      accessorKey: "title",
      header: "Problem",
      cell: ({ row }) => {
        const item = row.original;
        const pattern = item.attributes?.pattern;
        return (
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gray-55 dark:bg-gray-900 text-gray-500 dark:text-gray-450 border border-gray-150 dark:border-gray-800">
              <Code2 size={15} />
            </div>
            <div className="space-y-0.5">
              <Link 
                href={`/admin/problems/${item.id}`}
                className="font-medium text-sm text-gray-900 dark:text-white hover:text-brand-500 transition-colors"
              >
                {item.title}
              </Link>
              <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                <span className="text-[10px] text-gray-400 dark:text-gray-500 font-mono">
                  /{item.slug}
                </span>
                {pattern && (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-medium tracking-wide uppercase bg-brand-500/5 text-brand-500 dark:text-brand-400 border border-brand-500/10">
                    {pattern}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      }
    },
    {
      accessorKey: "platform",
      header: "Platform",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-medium ${getPlatformStyles(item.platform)}`}>
              {item.platform}
            </span>
            {item.problem_url && (
              <a 
                href={item.problem_url}
                target="_blank"
                rel="noreferrer"
                className="text-gray-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors"
                title="Go to problem platform"
              >
                <ExternalLink size={12} />
              </a>
            )}
          </div>
        );
      }
    },
    {
      accessorKey: "difficulty",
      header: "Difficulty",
      cell: ({ row }) => {
        const difficulty = row.getValue("difficulty") as "Easy" | "Medium" | "Hard";
        return (
          <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-medium tracking-wide ${getDifficultyStyles(difficulty)}`}>
            {difficulty}
          </span>
        );
      }
    },
    {
      accessorKey: "solutions",
      header: "Solutions",
      cell: ({ row }) => {
        const item = row.original;
        const solutionCount = Object.keys(item.solutions || {}).length;
        return (
          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
            {solutionCount} Language{solutionCount !== 1 ? "s" : ""}
          </span>
        );
      }
    },
    {
      accessorKey: "is_active",
      header: "Status",
      cell: ({ row }) => {
        const isActive = row.getValue("is_active") as boolean;
        return (
          <span className={`inline-flex px-2 py-0.5 rounded-lg text-[9px] font-medium uppercase tracking-wider border ${
            isActive
              ? "bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 border-emerald-500/10"
              : "bg-gray-500/5 text-gray-500 dark:text-gray-400 border-gray-500/10"
          }`}>
            {isActive ? "Active" : "Inactive"}
          </span>
        );
      }
    },
    {
      id: "actions",
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="flex items-center gap-2 justify-end">
            <Link
              href={`/admin/problems/${item.id}`}
              className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
              title="Preview problem"
            >
              <Eye size={14} />
            </Link>
            <button
              onClick={() => router.push(`/admin/problems/${item.id}/edit`)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium text-gray-750 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-900 border border-gray-200 dark:border-gray-800 transition-colors"
            >
              <Edit3 size={12} />
              Edit
            </button>
            {item.is_active && (
              <button
                onClick={() => handleDelete(item.id)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium text-red-500 hover:bg-red-500/5 transition-colors cursor-pointer"
              >
                <Trash2 size={12} />
                Delete
              </button>
            )}
          </div>
        );
      }
    }
  ], [backendUrl]);

  if (loading && problems.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 size={32} className="animate-spin text-brand-500" />
        <p className="text-gray-500 dark:text-gray-400 text-sm font-semibold">Loading practice catalog parameters...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20 px-4 select-none">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">
            Practice Problems
          </h1>
          <p className="text-gray-400 dark:text-gray-500 text-xs font-medium mt-1">
            Configure coding challenges, solution code, and external links.
          </p>
        </div>
        <button 
          onClick={() => router.push("/admin/problems/add")}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-gray-200 text-white dark:text-gray-900 font-medium text-xs shadow-sm transition-colors cursor-pointer"
        >
          <Plus size={14} />
          Add Problem
        </button>
      </div>

      {/* Main Database Content */}
      {error ? (
        <div className="bg-red-500/5 border border-red-500/10 rounded-2xl p-6 flex items-start gap-3">
          <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-red-600">Database Connection Failure</h4>
            <p className="text-xs text-red-500/80 mt-1 font-medium">{error}</p>
          </div>
        </div>
      ) : (
        <Card className="border border-gray-150 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden bg-white dark:bg-gray-950">
          <CardContent className="p-6">
            <DataTable 
              columns={columns} 
              data={problems} 
              searchKey="title" 
              searchPlaceholder="Search problems by title..." 
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
