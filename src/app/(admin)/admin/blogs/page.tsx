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
  Clock
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Article = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  cover_image: string | null;
  category: string;
  difficulty: string | null;
  read_time_minutes: number;
  author_name: string | null;
  author_avatar: string | null;
  resources: {
    related_problems?: string[];
    related_videos?: string[];
    external_links?: string[];
    [key: string]: unknown;
  };
  attributes: {
    tags?: string[];
    series?: string;
    featured?: boolean;
    [key: string]: unknown;
  };
  is_published: boolean;
  is_active: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export default function AdminBlogsPage() {
  const { user, isLoggedIn } = useAuth();
  const router = useRouter();
  
  const [articles, setArticles] = useState<Article[]>([]);
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
    document.title = "Articles & Blogs Catalog | CrackDSA";
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to soft-delete this article? It will no longer be visible to readers.")) {
      return;
    }

    const token = getStoredToken();
    if (!token) return;

    try {
      const res = await fetch(`${backendUrl}/api/v1/admin/articles/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!res.ok) {
        throw new Error("Failed to delete the article.");
      }

      fetchArticles();
    } catch (err: unknown) {
      const errMessage = err instanceof Error ? err.message : String(err);
      alert(errMessage || "Delete transaction failed.");
    }
  };

  const getCategoryStyles = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes("dsa") || cat.includes("concept")) {
      return "bg-blue-500/5 text-blue-500 border border-blue-500/15";
    } else if (cat.includes("system design")) {
      return "bg-purple-500/5 text-purple-500 border border-purple-500/15";
    } else if (cat.includes("company")) {
      return "bg-amber-500/5 text-amber-500 border border-amber-500/15";
    } else if (cat.includes("tips") || cat.includes("tricks")) {
      return "bg-emerald-500/5 text-emerald-500 border border-emerald-500/15";
    } else if (cat.includes("announcement")) {
      return "bg-rose-500/5 text-rose-500 border border-rose-500/15";
    } else {
      return "bg-brand-500/5 text-brand-500 border border-brand-500/15";
    }
  };

  const columns = useMemo<ColumnDef<Article>[]>(() => [
    {
      accessorKey: "title",
      header: "Article Info",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-500/10 text-brand-650 dark:text-brand-400 font-bold border border-brand-500/10">
              <FileText size={16} />
            </div>
            <div className="space-y-1">
              <Link 
                href={`/admin/blogs/${item.id}`}
                className="font-bold text-sm text-gray-900 dark:text-white leading-tight hover:text-brand-500 dark:hover:text-brand-400 transition-colors"
              >
                {item.title}
              </Link>
              <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                {item.subtitle && (
                  <span className="text-[10px] text-gray-450 dark:text-gray-500 font-medium line-clamp-1 max-w-[200px]">
                    {item.subtitle}
                  </span>
                )}
                <span className="text-[10px] text-gray-450 dark:text-gray-500 font-mono">
                  /{item.slug}
                </span>
              </div>
            </div>
          </div>
        );
      }
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => {
        const category = row.getValue("category") as string;
        return (
          <span className={`inline-flex items-center px-2.5 py-1 rounded-xl text-xs font-bold capitalize ${getCategoryStyles(category)}`}>
            {category}
          </span>
        );
      }
    },
    {
      accessorKey: "read_time_minutes",
      header: "Read Time",
      cell: ({ row }) => {
        const readTime = row.getValue("read_time_minutes") as number;
        return (
          <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400">
            <Clock size={12} className="text-gray-400" />
            <span>{readTime} min</span>
          </div>
        );
      }
    },
    {
      accessorKey: "is_published",
      header: "Status",
      cell: ({ row }) => {
        const item = row.original;
        if (!item.is_active) {
          return (
            <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-500/10 text-red-655 border border-red-500/10">
              Deleted
            </span>
          );
        }
        return (
          <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
            item.is_published
              ? "bg-emerald-500/10 text-emerald-650 dark:text-emerald-400 border-emerald-500/10"
              : "bg-amber-500/10 text-amber-650 dark:text-amber-400 border-amber-500/10"
          }`}>
            {item.is_published ? "Published" : "Draft"}
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
              href={`/admin/blogs/${item.id}`}
              className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
              title="Preview article detail"
            >
              <Eye size={15} />
            </Link>
            <button 
              onClick={() => router.push(`/admin/blogs/${item.id}/edit`)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700 transition-colors"
              title="Edit article settings"
            >
              <Edit3 size={13} />
              Edit
            </button>
            {item.is_active && (
              <button 
                onClick={() => handleDelete(item.id)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold text-red-650 hover:bg-red-50 dark:hover:bg-red-950/20 border border-transparent transition-colors cursor-pointer"
                title="Soft delete article"
              >
                <Trash2 size={13} />
                Delete
              </button>
            )}
          </div>
        );
      }
    }
  ], [router]);

  if (loading && articles.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 size={32} className="animate-spin text-brand-500" />
        <p className="text-gray-500 dark:text-gray-400 text-sm font-semibold">Loading articles parameters...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 px-4">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-955 dark:text-white tracking-tight">
            Articles & Blogs
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-semibold mt-1">
            Manage concept articles, blog posts, publication workflows, and metadata tags.
          </p>
        </div>
        <button 
          onClick={() => router.push("/admin/blogs/add")}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-gray-200 text-white dark:text-gray-900 font-bold text-sm shadow-sm transition-colors cursor-pointer"
        >
          <Plus size={16} />
          Add Article
        </button>
      </div>

      {/* Main Database Content */}
      {error ? (
        <div className="bg-red-500/5 border border-red-500/10 rounded-2xl p-6 flex items-start gap-3">
          <AlertCircle size={20} className="text-red-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-black text-red-655">Database Connection Failure</h4>
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
