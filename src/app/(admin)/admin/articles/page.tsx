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
  FileText,
  Loader2,
  AlertCircle,
  Eye,
  Clock,
  BookOpen
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArticleItem } from "@/api/articles";

export default function AdminArticlesPage() {
  const { user, isLoggedIn } = useAuth();
  const router = useRouter();
  
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const backendUrl = BACKEND_URL;

  const fetchArticles = useCallback(async () => {
    const token = getStoredToken();
    if (!token) return;

    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${backendUrl}/api/v1/admin/articles`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!res.ok) {
        throw new Error(`Failed to load: ${res.statusText}`);
      }

      const data = await res.json();
      setArticles(data || []);
    } catch (err: unknown) {
      console.error("Failed to load admin articles:", err);
      const errMessage = err instanceof Error ? err.message : String(err);
      setError(errMessage || "Failed to load articles catalog.");
    } finally {
      setLoading(false);
    }
  }, [backendUrl]);

  useEffect(() => {
    if (isLoggedIn && user?.roles?.includes("admin")) {
      fetchArticles();
    }
  }, [isLoggedIn, user, fetchArticles]);

  useEffect(() => {
    document.title = "Articles & Course Notes Catalog | CrackDSA Admin";
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete the article "${title}"?`)) return;

    const token = getStoredToken();
    try {
      const res = await fetch(`${backendUrl}/api/v1/admin/articles/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!res.ok) {
        throw new Error("Failed to delete article");
      }

      setArticles(prev => prev.filter(a => a.id !== id));
    } catch (err: unknown) {
      const errMessage = err instanceof Error ? err.message : String(err);
      alert(errMessage || "Error deleting article.");
    }
  };

  const columns: ColumnDef<ArticleItem>[] = useMemo(() => [
    {
      accessorKey: "title",
      header: "Article Title",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="flex items-center gap-3 py-1">
            <div className="w-9 h-9 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center shrink-0 border border-brand-500/20">
              <FileText size={18} />
            </div>
            <div className="flex flex-col min-w-0">
              <Link 
                href={`/admin/articles/${item.id}`} 
                className="font-bold text-gray-900 dark:text-white hover:text-brand-500 transition-colors text-sm truncate"
              >
                {item.title}
              </Link>
              <span className="text-[11px] font-mono text-gray-400 dark:text-gray-500 truncate">
                /{item.slug}
              </span>
            </div>
          </div>
        );
      }
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => {
        const cat = row.getValue("category") as string;
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
            {cat || "General"}
          </span>
        );
      }
    },
    {
      accessorKey: "read_time_minutes",
      header: "Reading Time",
      cell: ({ row }) => {
        const mins = row.getValue("read_time_minutes") as number;
        return (
          <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
            <Clock size={13} className="text-gray-400" />
            <span>{mins || 5} min read</span>
          </div>
        );
      }
    },
    {
      accessorKey: "is_published",
      header: "Status",
      cell: ({ row }) => {
        const isPub = row.getValue("is_published") as boolean;
        return (
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
            isPub 
              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800" 
              : "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200 dark:border-amber-800"
          }`}>
            {isPub ? "Published" : "Draft"}
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
          <div className="flex items-center justify-end gap-1.5">
            <button
              onClick={() => router.push(`/admin/articles/${item.id}`)}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              title="View Article"
            >
              <Eye size={15} />
            </button>
            <button
              onClick={() => router.push(`/admin/articles/${item.id}/edit`)}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              title="Edit Article"
            >
              <Edit3 size={15} />
            </button>
            <button
              onClick={() => handleDelete(item.id, item.title)}
              className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 text-gray-400 hover:text-rose-600 transition-colors"
              title="Delete Article"
            >
              <Trash2 size={15} />
            </button>
          </div>
        );
      }
    }
  ], [router, backendUrl]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
          Loading articles catalog...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 px-4">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
            Articles & Course Notes
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-semibold mt-1">
            Create, publish, and manage concept articles and syllabus reading modules for your courses.
          </p>
        </div>
        <button 
          onClick={() => router.push("/admin/articles/add")}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-sm transition-colors cursor-pointer"
        >
          <Plus size={16} />
          Create New Article
        </button>
      </div>

      {/* Main Database Content */}
      {error ? (
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
              data={articles} 
              searchKey="title" 
              searchPlaceholder="Search articles by title..." 
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
