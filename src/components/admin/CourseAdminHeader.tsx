"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  BookOpen, 
  Edit3, 
  ListTree, 
  Eye, 
  ExternalLink,
  Layers,
  DollarSign
} from "lucide-react";

interface CourseAdminHeaderProps {
  course: {
    id: string;
    title: string;
    slug: string;
    category?: string;
    status?: string;
    price?: number;
    original_price?: number;
    is_pro?: boolean;
  };
}

export default function CourseAdminHeader({ course }: CourseAdminHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();

  const isOverview = pathname === `/admin/courses/${course.id}`;
  const isEditDetails = pathname === `/admin/courses/${course.id}/edit`;
  const isCurriculum = pathname === `/admin/courses/${course.id}/curriculum`;

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
      case "upcoming":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
      default:
        return "bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20";
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Bar with Course Identity and Quick Links */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-5">
        <div className="flex items-start gap-4">
          <Link
            href="/admin/courses"
            className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-800 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white bg-white dark:bg-gray-900 transition-all shadow-sm shrink-0"
            title="Back to Courses Catalog"
          >
            <ArrowLeft size={16} />
          </Link>
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-black text-brand-500 uppercase tracking-widest">
                Academy Course
              </span>
              <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusBadge(course.status)}`}>
                {course.status || "draft"}
              </span>
              {course.is_pro && (
                <span className="inline-flex px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  PRO
                </span>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
              {course.title}
            </h1>
            <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
              <span>/{course.slug}</span>
              {typeof course.price === "number" && (
                <span className="font-sans font-bold text-gray-700 dark:text-gray-300">
                  • ₹{course.price}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* View on public portal button */}
        <div className="flex items-center gap-2">
          <Link
            href={`/courses/${course.slug || course.id}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700 transition-colors"
          >
            <span>Public Landing Page</span>
            <ExternalLink size={13} />
          </Link>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-800">
        <Link
          href={`/admin/courses/${course.id}`}
          className={`inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-colors ${
            isOverview
              ? "border-brand-500 text-brand-600 dark:text-brand-400"
              : "border-transparent text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          }`}
        >
          <Eye size={15} />
          <span>Overview</span>
        </Link>

        <Link
          href={`/admin/courses/${course.id}/edit`}
          className={`inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-colors ${
            isEditDetails
              ? "border-brand-500 text-brand-600 dark:text-brand-400"
              : "border-transparent text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          }`}
        >
          <Edit3 size={15} />
          <span>Edit Details</span>
        </Link>

        <Link
          href={`/admin/courses/${course.id}/curriculum`}
          className={`inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-colors ${
            isCurriculum
              ? "border-brand-500 text-brand-600 dark:text-brand-400"
              : "border-transparent text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          }`}
        >
          <ListTree size={15} />
          <span>Curriculum Builder</span>
        </Link>
      </div>
    </div>
  );
}
