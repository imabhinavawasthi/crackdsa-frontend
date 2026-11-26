"use client";

import { BACKEND_URL } from "@/config/api";
import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getStoredToken } from "@/functions/auth";
import { Lock, Loader2, AlertCircle, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import CourseAdminHeader from "@/components/admin/CourseAdminHeader";
import CourseCurriculumBuilder from "@/components/admin/CourseCurriculumBuilder";

export default function CourseCurriculumAdminPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params?.id as string;
  const { user, isLoading: authLoading, isLoggedIn } = useAuth();

  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const backendUrl = BACKEND_URL;

  const fetchCourse = useCallback(async () => {
    const token = getStoredToken();
    if (!token) return;

    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${backendUrl}/api/v1/admin/courses/${courseId}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!res.ok) {
        throw new Error("Failed to load course details.");
      }
      const data = await res.json();
      setCourse(data);
    } catch (err: any) {
      console.error("Error loading course:", err);
      setError(err.message || "Failed to load course for curriculum editing.");
    } finally {
      setLoading(false);
    }
  }, [backendUrl, courseId]);

  useEffect(() => {
    if (isLoggedIn && user?.roles?.includes("admin") && courseId) {
      fetchCourse();
    }
  }, [isLoggedIn, user, courseId, fetchCourse]);

  useEffect(() => {
    if (course?.title) {
      document.title = `Curriculum Builder: ${course.title} | CrackDSA Admin`;
    }
  }, [course]);

  if (authLoading || loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 size={32} className="animate-spin text-brand-500" />
        <p className="text-gray-500 dark:text-gray-400 text-sm font-semibold">
          {authLoading ? "Verifying admin access..." : "Loading course curriculum tree..."}
        </p>
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
            <h1 className="text-2xl font-black text-gray-955 dark:text-white tracking-tight">Access Prohibited</h1>
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

  if (error || !course) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4 px-4">
        <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center">
          <AlertCircle size={32} />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Failed to load course</h2>
          <p className="text-sm text-gray-500 mt-1">{error}</p>
        </div>
        <button 
          onClick={fetchCourse}
          className="inline-flex items-center gap-2 px-4 py-2 mt-4 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-bold text-sm transition-colors cursor-pointer"
        >
          <RotateCcw size={14} />
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 px-4">
      {/* Shared Admin Header with Tabs */}
      <CourseAdminHeader course={course} />

      {/* Curriculum Builder Component */}
      <CourseCurriculumBuilder
        courseId={course.id}
        courseTitle={course.title}
        initialCurriculum={course.curriculum || []}
      />
    </div>
  );
}
