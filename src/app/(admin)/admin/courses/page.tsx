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
  BookOpen, 
  HelpCircle,
  FileText,
  Video,
  Loader2,
  AlertCircle,
  Eye,
  Layers,
  DollarSign
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type InstructorSchema = {
  name: string;
  role: string;
  company: string;
  color: string;
};

type Course = {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: "interview-prep" | "core-dsa" | "system-design" | "advanced";
  instructors: InstructorSchema[];
  tags: string[];
  is_pro: boolean;
  is_popular: boolean;
  status: "active" | "upcoming" | "draft";
  price: number;
  original_price: number;
  total_problems: number;
  total_articles: number;
  total_videos: number;
  created_at?: string;
};

export default function AdminCoursesPage() {
  const { user, isLoggedIn } = useAuth();
  const router = useRouter();

  const [courses, setCourses] = useState<Course[]>([]);
  const [instructorsMap, setInstructorsMap] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const backendUrl = BACKEND_URL;

  const fetchCourses = useCallback(async () => {
    const token = getStoredToken();
    if (!token) return;

    try {
      setLoading(true);
      setError(null);
      
      const [res, instRes] = await Promise.all([
        fetch(`${backendUrl}/api/v1/admin/courses/`, {
          headers: { "Authorization": `Bearer ${token}` }
        }),
        fetch(`${backendUrl}/api/v1/instructors/`, {
          headers: { "Authorization": `Bearer ${token}` }
        })
      ]);

      if (!res.ok) {
        throw new Error(`Failed to load courses: ${res.statusText}`);
      }

      const data = await res.json();
      setCourses(data || []);

      if (instRes.ok) {
        const instData = await instRes.json();
        const instList = instData.items || [];
        const map: Record<string, any> = {};
        instList.forEach((inst: any) => { map[inst.id] = inst; });
        setInstructorsMap(map);
      }
    } catch (err: unknown) {
      console.error("Failed to load admin courses:", err);
      const errMessage = err instanceof Error ? err.message : String(err);
      setError(errMessage || "Failed to load admin courses catalog.");
    } finally {
      setLoading(false);
    }
  }, [backendUrl]);

  useEffect(() => {
    if (isLoggedIn && user?.roles?.includes("admin")) {
      fetchCourses();
    }
  }, [isLoggedIn, user, fetchCourses]);

  useEffect(() => {
    document.title = "Courses & Syllabus Catalog | CrackDSA Admin";
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to soft-delete the course "${title}"? Students will no longer see it, and it will be hidden from this list.`)) {
      return;
    }

    const token = getStoredToken();
    if (!token) return;

    try {
      const res = await fetch(`${backendUrl}/api/v1/admin/courses/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!res.ok) {
        throw new Error("Failed to delete the course.");
      }

      fetchCourses();
    } catch (err: unknown) {
      const errMessage = err instanceof Error ? err.message : String(err);
      alert(errMessage || "Delete transaction failed.");
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "interview-prep": return "Interview Prep";
      case "core-dsa": return "Core DSA";
      case "system-design": return "System Design";
      case "advanced": return "Advanced Topics";
      default: return category;
    }
  };

  const columns = useMemo<ColumnDef<Course>[]>(() => [
    {
      accessorKey: "title",
      header: "Course & Slug",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 font-bold border border-brand-500/10">
              <BookOpen size={16} />
            </div>
            <div className="space-y-1">
              <Link 
                href={`/admin/courses/${item.id}`}
                className="font-bold text-sm text-gray-900 dark:text-white leading-tight hover:text-brand-500 dark:hover:text-brand-400 transition-colors"
              >
                {item.title}
              </Link>
              <div className="flex items-center gap-1.5 pt-0.5">
                <span className="text-[10px] font-mono bg-gray-50 dark:bg-gray-800/40 text-gray-400 px-2 py-0.5 rounded border border-gray-100 dark:border-gray-800 font-semibold">
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
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-brand-500/10 text-brand-650 dark:text-brand-400 border border-brand-500/10">
            <Layers size={10} />
            {getCategoryLabel(category)}
          </span>
        );
      }
    },
    {
      id: "instructors",
      header: "Instructors",
      cell: ({ row, table }) => {
        const item = row.original;
        // The page component stores global instructors in table meta, or we can just access it from the component scope
        // Wait, cell has access to `item.instructor_ids`
        // Let's implement global state in the component. We can just use the component scope variables since `columns` is wrapped in `useMemo`.
        const instructorsMap = (table.options.meta as any)?.instructorsMap || {};
        
        const matchedInsts = (item as any).instructor_ids?.map((id: string) => instructorsMap[id]).filter(Boolean) || [];

        return (
          <div className="flex flex-wrap gap-1.5 max-w-[180px]">
            {matchedInsts && matchedInsts.length > 0 ? (
              matchedInsts.map((inst: any, index: number) => (
                <span 
                  key={index}
                  className={`inline-flex items-center px-2 py-0.75 rounded-md text-[10px] font-bold border leading-none bg-gradient-to-r ${inst.color || "from-gray-500 to-slate-500"} text-white border-transparent`}
                >
                  {inst.name}
                </span>
              ))
            ) : (
              <span className="text-[10px] font-semibold text-gray-400 italic">Unallocated</span>
            )}
          </div>
        );
      }
    },
    {
      id: "syllabus",
      header: "Syllabus Stats",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-gray-600 dark:text-gray-305">
              <Video size={12} className="text-brand-500" />
              {item.total_videos}
            </span>
            <span className="text-gray-300 dark:text-gray-700">|</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-gray-600 dark:text-gray-305">
              <HelpCircle size={12} className="text-purple-500" />
              {item.total_problems}
            </span>
            <span className="text-gray-300 dark:text-gray-700">|</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-gray-600 dark:text-gray-305">
              <FileText size={12} className="text-orange-500" />
              {item.total_articles}
            </span>
          </div>
        );
      }
    },
    {
      accessorKey: "price",
      header: "Pricing",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="space-y-0.5">
            <div className="flex items-center gap-1 text-xs font-black text-gray-900 dark:text-white">
              <DollarSign size={12} className="text-emerald-505 shrink-0" />
              <span>{item.price === 0 ? "FREE" : `₹${item.price}`}</span>
            </div>
            {item.original_price > item.price && (
              <div className="text-[10px] text-gray-400 line-through pl-3.5 font-bold">
                ₹{item.original_price}
              </div>
            )}
            <div>
              <span className={`inline-block text-[8px] font-black uppercase tracking-wider px-1 rounded ${
                item.is_pro 
                  ? "bg-amber-500/10 text-amber-600 border border-amber-500/10" 
                  : "bg-gray-100 dark:bg-gray-800 text-gray-450"
              }`}>
                {item.is_pro ? "PRO" : "FREE MODULE"}
              </span>
            </div>
          </div>
        );
      }
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
            status === "active"
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/10"
              : status === "upcoming"
              ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/10"
              : "bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/10"
          }`}>
            {status}
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
              onClick={() => router.push(`/admin/courses/${item.id}`)}
              className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
              title="View syllabus tree details"
            >
              <Eye size={15} />
            </button>
            <button
              onClick={() => router.push(`/admin/courses/${item.id}/edit`)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700 transition-colors"
              title="Edit course metadata & builder"
            >
              <Edit3 size={13} />
              Edit
            </button>
            <button
              onClick={() => handleDelete(item.id, item.title)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 border border-transparent transition-colors cursor-pointer"
              title="Soft delete course"
            >
              <Trash2 size={13} />
              Delete
            </button>
          </div>
        );
      }
    }
  ], [router]);

  if (loading && courses.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 size={32} className="animate-spin text-brand-500" />
        <p className="text-gray-500 dark:text-gray-400 text-sm font-semibold">Loading courses parameters...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 px-4">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-955 dark:text-white tracking-tight flex items-center gap-2.5">
            <BookOpen className="text-brand-500" size={28} />
            Academy Courses
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-semibold mt-1">
            Build learning cohorts, define co-instructors team, customize dynamic pricing, and build curriculum syllabus outlines.
          </p>
        </div>
        <button 
          onClick={() => router.push("/admin/courses/add")}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-gray-200 text-white dark:text-gray-900 font-bold text-sm shadow-sm transition-colors cursor-pointer"
        >
          <Plus size={16} />
          Add Course
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
              data={courses} 
              searchKey="title" 
              searchPlaceholder="Search courses by title..." 
              meta={{ instructorsMap }}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
