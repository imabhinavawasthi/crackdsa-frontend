"use client";

import React, { useState, useEffect } from "react";
import { Search, Edit2, Trash2, Route, Activity, ExternalLink, Calendar, User } from "lucide-react";
import Link from "next/link";
import { fetchAdminRoadmapsApi, deleteAdminRoadmapApi } from "@/api/roadmap";

interface UserInfo {
  email: string;
  full_name: string;
}

interface RoadmapRecord {
  id: string;
  title: string;
  user_id: string;
  is_active: boolean;
  created_at: string;
  user: UserInfo;
  user_input?: {
    target_role?: string;
    target_company_tier?: string;
    experience_level?: string;
  };
}

export default function AdminRoadmapsList() {
  const [roadmaps, setRoadmaps] = useState<RoadmapRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");

  const loadRoadmaps = async () => {
    try {
      setLoading(true);
      const data = await fetchAdminRoadmapsApi();
      setRoadmaps(data || []);
    } catch (err: any) {
      alert(err.message || "Failed to load roadmaps");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoadmaps();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this roadmap? This will hide/deactivate it for the user.")) return;
    try {
      const ok = await deleteAdminRoadmapApi(id);
      if (ok) {
        alert("Roadmap deleted successfully");
        loadRoadmaps();
      } else {
        alert("Failed to delete roadmap");
      }
    } catch (err: any) {
      alert(err.message || "Failed to delete roadmap");
    }
  };

  const filteredRoadmaps = roadmaps.filter((r) => {
    // 1. Search Query filter
    const searchLower = search.toLowerCase();
    const matchesSearch =
      r.title.toLowerCase().includes(searchLower) ||
      r.id.toLowerCase().includes(searchLower) ||
      r.user?.email.toLowerCase().includes(searchLower) ||
      r.user?.full_name.toLowerCase().includes(searchLower) ||
      (r.user_input?.target_role || "").toLowerCase().includes(searchLower) ||
      (r.user_input?.target_company_tier || "").toLowerCase().includes(searchLower);

    // 2. Active Status filter
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && r.is_active) ||
      (statusFilter === "inactive" && !r.is_active);

    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Roadmaps</h1>
          <p className="text-sm text-gray-500">Manage user-specific AI roadmaps, structures, and preferences.</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 flex flex-col md:flex-row justify-between gap-4">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search roadmaps by title, user email, name, role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider shrink-0">Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all"
          >
            <option value="all">All Roadmaps</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-gray-800/30 text-xs uppercase tracking-wider font-semibold text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800">
                <th className="px-6 py-4">Roadmap</th>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Target / Goal</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Created At</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500 text-sm">
                    <div className="flex items-center justify-center gap-2">
                      <Activity className="animate-spin text-brand-500" size={18} />
                      Loading roadmaps catalog...
                    </div>
                  </td>
                </tr>
              ) : filteredRoadmaps.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500 text-sm">
                    No roadmaps found matching current filters
                  </td>
                </tr>
              ) : (
                filteredRoadmaps.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-500 flex items-center justify-center shrink-0">
                          <Route size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900 dark:text-gray-100 line-clamp-1">{r.title}</p>
                          <p className="text-[10px] text-gray-400 font-mono mt-0.5">{r.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 flex items-center justify-center shrink-0">
                          <User size={12} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-800 dark:text-gray-200">{r.user?.full_name || "Unknown User"}</p>
                          <p className="text-[10px] text-gray-400 font-medium">{r.user?.email || "unknown@crackdsa.com"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-0.5">
                        <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                          {r.user_input?.target_role || "SDE Prep"}
                        </p>
                        <p className="text-[10px] text-gray-500">
                          {r.user_input?.target_company_tier || "Tier 1"} • {r.user_input?.experience_level || "Any Exp"}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {r.is_active ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-400">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-850 dark:text-gray-400">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <Calendar size={13} />
                        <span>{formatDate(r.created_at)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/roadmap/${r.id}`}
                          target="_blank"
                          className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors"
                          title="View Public Roadmap"
                        >
                          <ExternalLink size={16} />
                        </Link>
                        <Link
                          href={`/admin/roadmaps/${r.id}`}
                          className="p-2 text-gray-400 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10 rounded-lg transition-colors"
                          title="Edit Roadmap Details"
                        >
                          <Edit2 size={16} />
                        </Link>
                        <button
                          onClick={() => handleDelete(r.id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Delete Roadmap"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
