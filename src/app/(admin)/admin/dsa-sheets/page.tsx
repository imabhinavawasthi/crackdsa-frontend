"use client";

import React, { useState, useEffect } from "react";
import { Plus, Search, Edit2, Trash2, LayoutTemplate, Activity, ExternalLink } from "lucide-react";
import Link from "next/link";
import { fetchAdminSheets, deleteSheet } from "@/api/sheets";
import { DSASheet } from "@/types/dsa-sheet";

export default function AdminDSASheetsList() {
  const [sheets, setSheets] = useState<DSASheet[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const loadSheets = async () => {
    try {
      setLoading(true);
      const data = await fetchAdminSheets();
      setSheets(data || []);
    } catch (err: any) {
      alert(err.message || "Failed to load sheets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSheets();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this sheet? This will hide it from public view.")) return;
    try {
      await deleteSheet(id);
      alert("Sheet deleted successfully");
      loadSheets(); // Reload to show updated status
    } catch (err: any) {
      alert(err.message || "Failed to delete sheet");
    }
  };

  const filteredSheets = sheets.filter(sheet => 
    sheet.title.toLowerCase().includes(search.toLowerCase()) || 
    sheet.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">DSA Sheets</h1>
          <p className="text-sm text-gray-500">Manage preparation tracks, pattern-wise lists, and problem collections.</p>
        </div>
        <Link 
          href="/admin/dsa-sheets/add"
          className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
        >
          <Plus size={18} /> Add New Sheet
        </Link>
      </div>

      {/* Toolbar */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search sheets by title or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all"
          />
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-gray-800/30 text-xs uppercase tracking-wider font-semibold text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800">
                <th className="px-6 py-4">Sheet Info</th>
                <th className="px-6 py-4">Level & Tag</th>
                <th className="px-6 py-4">Topics / Problems</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500 text-sm">
                    <div className="flex items-center justify-center gap-2">
                      <Activity className="animate-spin text-brand-500" size={18} />
                      Loading sheets...
                    </div>
                  </td>
                </tr>
              ) : filteredSheets.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500 text-sm">
                    No sheets found matching "{search}"
                  </td>
                </tr>
              ) : (
                filteredSheets.map((sheet) => {
                  const numTopics = sheet.total_topics ?? (sheet.sheet_json?.topics?.length || 0);
                  const numProblems = sheet.total_problems ?? (sheet.sheet_json?.topics?.reduce((acc, topic) => 
                    acc + topic.steps.reduce((sAcc, step) => sAcc + (step.problems?.length || 0), 0)
                  , 0) || 0);

                  return (
                    <tr key={sheet.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/20 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-violet-500/10 text-violet-600 flex items-center justify-center shrink-0">
                            <LayoutTemplate size={20} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{sheet.title}</p>
                            <p className="text-xs text-gray-500 font-mono mt-0.5">{sheet.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span className="text-xs font-medium px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md w-max">
                            {sheet.level || "Any"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{numTopics} Topics</p>
                        <p className="text-xs text-gray-500">{numProblems} Problems</p>
                      </td>
                      <td className="px-6 py-4">
                        {sheet.is_active ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-400">
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-500/10 dark:text-red-400">
                            Inactive
                          </span>
                        )}
                        {!sheet.is_public && (
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400">
                            Private
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/dsa-sheet/${sheet.id}`}
                            target="_blank"
                            className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors"
                            title="View Public Sheet"
                          >
                            <ExternalLink size={16} />
                          </Link>
                          <Link
                            href={`/admin/dsa-sheets/${sheet.id}`}
                            className="p-2 text-gray-400 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10 rounded-lg transition-colors"
                            title="Edit Sheet"
                          >
                            <Edit2 size={16} />
                          </Link>
                          {sheet.is_active && (
                            <button
                              onClick={() => handleDelete(sheet.id)}
                              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                              title="Delete Sheet"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
