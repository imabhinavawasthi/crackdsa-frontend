"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { getStoredToken } from "@/functions/auth";
import Button from "@/components/ui/button/Button";
import { 
  Plus, 
  Search, 
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
  
  // State for articles list
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "drafts" | "inactive">("all");

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

  // Fetch all admin articles
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
      setArticles(data);
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

  // Handle soft delete
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

  // Filter & Search computation
  const filteredArticles = articles.filter((article) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      article.title.toLowerCase().includes(query) || 
      (article.subtitle && article.subtitle.toLowerCase().includes(query)) ||
      article.slug.toLowerCase().includes(query);

    const matchesStatus = 
      statusFilter === "all" ||
      (statusFilter === "published" && article.is_published && article.is_active) ||
      (statusFilter === "drafts" && !article.is_published && article.is_active) ||
      (statusFilter === "inactive" && !article.is_active);

    return matchesSearch && matchesStatus;
  });

  // Get color for category badge
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

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 px-4">
      
      {/* Header Dashboard */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-100 dark:border-gray-800/80 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-950 dark:text-white tracking-tight">
            Articles & Blogs
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-semibold mt-1">
            Manage concept articles, blog posts, publication workflows, and metadata tags.
          </p>
        </div>
        <Button 
          onClick={() => router.push("/admin/blogs/add")}
          startIcon={<Plus size={16} />}
          variant="primary"
          size="sm"
          className="self-start sm:self-center"
        >
          Add New Article
        </Button>
      </div>

      {/* Filtering Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/70 p-4.5 rounded-2xl">
        
        {/* Search Input bar */}
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text"
            placeholder="Search by title, subtitle, slug..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-transparent text-sm text-gray-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500 dark:focus:ring-brand-400 placeholder:text-gray-400 font-medium"
          />
        </div>

        {/* Filters Grid */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Status Filter */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-gray-100 dark:bg-gray-800">
            {(["all", "published", "drafts", "inactive"] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setStatusFilter(filter)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                  statusFilter === filter 
                    ? "bg-white dark:bg-gray-900 text-gray-950 dark:text-white shadow-sm"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-950 dark:hover:text-gray-200"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
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
      ) : filteredArticles.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl space-y-4">
          <FileText size={40} className="mx-auto text-gray-300 dark:text-gray-700 animate-pulse" />
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-gray-950 dark:text-white">No Articles Found</h3>
            <p className="text-xs text-gray-400 max-w-sm mx-auto">
              No article assets matched your active search query or status filters.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-2xl overflow-hidden shadow-theme-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-800/30">
                  <th className="px-6 py-4.5 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Article Info</th>
                  <th className="px-6 py-4.5 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Category</th>
                  <th className="px-6 py-4.5 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Read Time</th>
                  <th className="px-6 py-4.5 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4.5 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60">
                {filteredArticles.map((article) => {
                  return (
                    <tr 
                      key={article.id}
                      className="hover:bg-gray-50/40 dark:hover:bg-gray-800/10 transition-all group"
                    >
                      {/* Article Info column */}
                      <td className="px-6 py-4.5 max-w-sm">
                        <div className="flex items-start gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 font-bold border border-brand-500/10">
                            <FileText size={16} />
                          </div>
                          <div className="space-y-1">
                            <Link 
                              href={`/admin/blogs/${article.id}`}
                              className="font-bold text-sm text-gray-900 dark:text-white leading-tight hover:text-brand-500 dark:hover:text-brand-400 transition-colors"
                            >
                              {article.title}
                            </Link>
                            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                              {article.subtitle && (
                                <span className="text-[10px] text-gray-450 dark:text-gray-500 font-medium line-clamp-1">
                                  {article.subtitle}
                                </span>
                              )}
                              <span className="text-[10px] text-gray-450 dark:text-gray-500 font-mono">
                                /{article.slug}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category Badge column */}
                      <td className="px-6 py-4.5">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-xl text-xs font-bold capitalize ${getCategoryStyles(article.category)}`}>
                          {article.category}
                        </span>
                      </td>

                      {/* Read Time column */}
                      <td className="px-6 py-4.5">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400">
                          <Clock size={12} className="text-gray-400" />
                          <span>{article.read_time_minutes} min</span>
                        </div>
                      </td>

                      {/* Status Badge column */}
                      <td className="px-6 py-4.5">
                        {!article.is_active ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-500/10 text-red-500">
                            <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                            Deleted
                          </span>
                        ) : article.is_published ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            Published
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400">
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                            Draft
                          </span>
                        )}
                      </td>

                      {/* Action buttons column */}
                      <td className="px-6 py-4.5 text-right">
                        <div className="flex items-center justify-end gap-2.5 opacity-80 group-hover:opacity-100 transition-opacity">
                          <Link 
                            href={`/admin/blogs/${article.id}`}
                            className="p-2 rounded-xl text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
                            title="Preview article detail"
                          >
                            <Eye size={15} />
                          </Link>
                          <button 
                            onClick={() => router.push(`/admin/blogs/${article.id}/edit`)}
                            className="p-2 rounded-xl text-gray-400 hover:text-brand-500 dark:hover:text-brand-400 hover:bg-brand-500/5 transition-all border border-transparent hover:border-brand-500/10"
                            title="Edit article settings"
                          >
                            <Edit3 size={15} />
                          </button>
                          {article.is_active && (
                            <button 
                              onClick={() => handleDelete(article.id)}
                              className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-500/5 transition-all border border-transparent hover:border-red-500/10"
                              title="Soft delete article"
                            >
                              <Trash2 size={15} />
                            </button>
                          )}
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
