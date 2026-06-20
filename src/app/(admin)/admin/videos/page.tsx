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
  Video, 
  Clock, 
  HelpCircle,
  FileText,
  Loader2,
  AlertCircle,
  Eye,
  Lock,
  Link as LinkIcon
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type VideoLecture = {
  id: string;
  title: string;
  description: string;
  video_url: string;
  duration_seconds: number;
  thumbnail_url: string | null;
  resources: {
    problems?: string[];
    blogs?: string[];
    assignments?: string[];
  };
  attributes: Record<string, unknown>;
  is_active: boolean;
  created_at: string;
};

export default function AdminVideosPage() {
  const { user, isLoggedIn } = useAuth();
  const router = useRouter();
  
  const [lectures, setLectures] = useState<VideoLecture[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const backendUrl = BACKEND_URL;

  const fetchLectures = useCallback(async () => {
    const token = getStoredToken();
    if (!token) return;

    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${backendUrl}/api/v1/admin/video-lectures`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!res.ok) {
        throw new Error(`Failed to load: ${res.statusText}`);
      }

      const data = await res.json();
      setLectures(data || []);
    } catch (err: unknown) {
      console.error("Failed to load admin lectures:", err);
      const errMessage = err instanceof Error ? err.message : String(err);
      setError(errMessage || "Failed to load admin video lectures catalog.");
    } finally {
      setLoading(false);
    }
  }, [backendUrl]);

  useEffect(() => {
    if (isLoggedIn && user?.roles?.includes("admin")) {
      fetchLectures();
    }
  }, [isLoggedIn, user, fetchLectures]);

  useEffect(() => {
    document.title = "Video Lectures Catalog | CrackDSA";
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to soft-delete this video lecture? Students will no longer see it.")) {
      return;
    }

    const token = getStoredToken();
    if (!token) return;

    try {
      const res = await fetch(`${backendUrl}/api/v1/admin/video-lectures/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!res.ok) {
        throw new Error("Failed to delete the video lecture.");
      }

      fetchLectures();
    } catch (err: unknown) {
      const errMessage = err instanceof Error ? err.message : String(err);
      alert(errMessage || "Delete transaction failed.");
    }
  };

  const columns = useMemo<ColumnDef<VideoLecture>[]>(() => [
    {
      accessorKey: "title",
      header: "Video Details",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-500/10 text-brand-650 dark:text-brand-400 font-bold border border-brand-500/10">
              <Video size={16} />
            </div>
            <div className="space-y-1">
              <Link 
                href={`/admin/videos/${item.id}`}
                className="font-bold text-sm text-gray-900 dark:text-white leading-tight hover:text-brand-500 dark:hover:text-brand-400 transition-colors"
              >
                {item.title}
              </Link>
              {item.description && (
                <div className="text-xs text-gray-400 line-clamp-1 max-w-[300px]">
                  {item.description.replace(/<[^>]*>/g, "")}
                </div>
              )}
              <div className="text-[10px] font-mono text-gray-450 select-all leading-none mt-1">
                ID: {item.id}
              </div>
            </div>
          </div>
        );
      }
    },
    {
      accessorKey: "duration_seconds",
      header: "Duration",
      cell: ({ row }) => {
        const seconds = row.getValue("duration_seconds") as number;
        return (
          <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300 font-semibold">
            <Clock size={13} className="text-gray-400" />
            <span>{Math.floor(seconds / 60)}m {seconds % 60}s</span>
          </div>
        );
      }
    },
    {
      id: "resources",
      header: "Resources Linked",
      cell: ({ row }) => {
        const item = row.original;
        const probCount = item.resources?.problems?.length || 0;
        const blogCount = item.resources?.blogs?.length || 0;
        const assCount = item.resources?.assignments?.length || 0;
        return (
          <div className="flex flex-wrap gap-2">
            {probCount > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/10">
                {probCount} {probCount === 1 ? "Prob" : "Probs"}
              </span>
            )}
            {blogCount > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/10">
                {blogCount} {blogCount === 1 ? "Blog" : "Blogs"}
              </span>
            )}
            {assCount > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/10">
                {assCount} {assCount === 1 ? "Assgn" : "Assgns"}
              </span>
            )}
            {probCount === 0 && blogCount === 0 && assCount === 0 && (
              <span className="text-[10px] font-semibold text-gray-400 italic">None linked</span>
            )}
          </div>
        );
      }
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
      id: "actions",
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="flex items-center gap-2 justify-end">
            <button
              onClick={() => router.push(`/admin/videos/${item.id}`)}
              className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-150 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
              title="View video details and player"
            >
              <Eye size={15} />
            </button>
            <button
              onClick={() => router.push(`/admin/videos/${item.id}/edit`)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700 transition-colors"
            >
              <Edit3 size={13} />
              Edit
            </button>
            {item.is_active && (
              <button
                onClick={() => handleDelete(item.id)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 border border-transparent transition-colors cursor-pointer"
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

  if (loading && lectures.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 size={32} className="animate-spin text-brand-500" />
        <p className="text-gray-500 dark:text-gray-400 text-sm font-semibold">Loading video lectures parameters...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 px-4">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-955 dark:text-white tracking-tight">
            Video Lectures
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-semibold mt-1">
            Configure reusable cohort video assets and connect problems, learning blogs, or coding assignments.
          </p>
        </div>
        <button 
          onClick={() => router.push("/admin/videos/add")}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-gray-200 text-white dark:text-gray-900 font-bold text-sm shadow-sm transition-colors cursor-pointer"
        >
          <Plus size={16} />
          Add Lecture
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
              data={lectures} 
              searchKey="title" 
              searchPlaceholder="Search video lectures by title..." 
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
