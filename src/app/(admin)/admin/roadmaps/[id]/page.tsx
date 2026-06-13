"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Save, Activity, ExternalLink, Plus, Trash2, ChevronDown, ChevronRight, AlertCircle, Info, BookOpen, Layers } from "lucide-react";
import Link from "next/link";
import { fetchAdminRoadmapByIdApi, updateAdminRoadmapApi } from "@/api/roadmap";

// Type definitions matching backend Roadmap models
interface RoadmapItem {
  id: string;
  title: string;
  type: "video" | "problem" | "article";
  difficulty?: "Easy" | "Medium" | "Hard" | string;
  timeEstimate?: string;
  url?: string;
}

interface Topic {
  id: string;
  title: string;
  description: string;
  items: RoadmapItem[];
  icon?: string;
  iconColor?: string;
  iconBg?: string;
}

interface Phase {
  id: string;
  title: string;
  subtitle: string;
  color?: "blue" | "emerald" | "purple" | string;
  topics: Topic[];
}

interface RoadmapStructure {
  phases: Phase[];
}

interface UserInfo {
  email: string;
  full_name: string;
}

interface UserInput {
  primary_goal?: string;
  target_role?: string;
  target_company_tier?: string;
  urgency_level?: string;
  duration_weeks?: number;
  time_per_week_hours?: number;
  experience_level?: string;
  problems_solved_count?: number;
  strong_topics?: string[];
  weak_topics?: string[];
  learning_style?: string;
  programming_language?: string;
}

interface RoadmapDBRecord {
  id: string;
  title: string;
  user_id: string;
  is_active: boolean;
  user: UserInfo;
  user_input?: UserInput;
  structure: RoadmapStructure;
}

const generateId = (prefix: string) => `${prefix}-${Math.random().toString(36).substring(2, 9)}`;

export default function EditRoadmapPage() {
  const params = useParams();
  const router = useRouter();
  const roadmapId = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [userInput, setUserInput] = useState<UserInput | undefined>(undefined);
  const [user, setUser] = useState<UserInfo | undefined>(undefined);

  // Roadmap structure
  const [structure, setStructure] = useState<RoadmapStructure>({ phases: [] });
  const [editorMode, setEditorMode] = useState<"visual" | "json">("visual");
  const [rawJsonStr, setRawJsonStr] = useState("{}");
  const [isJsonValid, setIsJsonValid] = useState(true);
  const [jsonError, setJsonError] = useState<string | null>(null);

  // Collapsible accordion states
  const [expandedPhases, setExpandedPhases] = useState<Record<string, boolean>>({});
  const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!roadmapId) return;

    const loadRoadmap = async () => {
      try {
        setLoading(true);
        const data: RoadmapDBRecord = await fetchAdminRoadmapByIdApi(roadmapId);
        setTitle(data.title);
        setIsActive(data.is_active);
        setUserInput(data.user_input);
        setUser(data.user);

        const struct = data.structure || { phases: [] };
        setStructure(struct);
        setRawJsonStr(JSON.stringify(struct, null, 2));

        // Auto-expand first phase by default
        if (struct.phases && struct.phases.length > 0) {
          setExpandedPhases({ [struct.phases[0].id]: true });
        }
      } catch (err: any) {
        alert("Failed to load roadmap details: " + err.message);
        router.push("/admin/roadmaps");
      } finally {
        setLoading(false);
      }
    };

    loadRoadmap();
  }, [roadmapId, router]);

  // Sync JSON text when visual editor makes changes
  useEffect(() => {
    if (editorMode === "visual") {
      setRawJsonStr(JSON.stringify(structure, null, 2));
    }
  }, [structure, editorMode]);

  // Schema Validator Function
  const validateStructure = (json: any): { valid: boolean; error: string | null } => {
    if (!json || typeof json !== "object") return { valid: false, error: "Root roadmap structure must be a JSON object." };
    if (!Array.isArray(json.phases)) return { valid: false, error: "Root must contain a 'phases' array." };

    for (let pIdx = 0; pIdx < json.phases.length; pIdx++) {
      const phase = json.phases[pIdx];
      if (!phase || typeof phase !== "object") return { valid: false, error: `Phase at index ${pIdx} must be a JSON object.` };
      if (!phase.id || typeof phase.id !== "string") return { valid: false, error: `Phase at index ${pIdx} is missing 'id' string.` };
      if (!phase.title || typeof phase.title !== "string") return { valid: false, error: `Phase at index ${pIdx} is missing 'title' string.` };
      if (phase.subtitle !== undefined && typeof phase.subtitle !== "string") return { valid: false, error: `Phase at index ${pIdx} 'subtitle' must be a string.` };
      if (phase.color !== undefined && typeof phase.color !== "string") return { valid: false, error: `Phase at index ${pIdx} 'color' must be a string.` };

      if (!Array.isArray(phase.topics)) return { valid: false, error: `Phase "${phase.title}" must contain a 'topics' array.` };
      for (let tIdx = 0; tIdx < phase.topics.length; tIdx++) {
        const topic = phase.topics[tIdx];
        if (!topic || typeof topic !== "object") return { valid: false, error: `Topic at index ${tIdx} in phase "${phase.title}" must be an object.` };
        if (!topic.id || typeof topic.id !== "string") return { valid: false, error: `Topic at index ${tIdx} in phase "${phase.title}" is missing 'id' string.` };
        if (!topic.title || typeof topic.title !== "string") return { valid: false, error: `Topic at index ${tIdx} in phase "${phase.title}" is missing 'title' string.` };
        if (topic.description !== undefined && typeof topic.description !== "string") return { valid: false, error: `Topic at index ${tIdx} in phase "${phase.title}" 'description' must be a string.` };

        if (!Array.isArray(topic.items)) return { valid: false, error: `Topic "${topic.title}" in phase "${phase.title}" must contain an 'items' array.` };
        for (let iIdx = 0; iIdx < topic.items.length; iIdx++) {
          const item = topic.items[iIdx];
          if (!item || typeof item !== "object") return { valid: false, error: `Item at index ${iIdx} in topic "${topic.title}" must be an object.` };
          if (!item.id || typeof item.id !== "string") return { valid: false, error: `Item at index ${iIdx} in topic "${topic.title}" is missing 'id' string.` };
          if (!item.title || typeof item.title !== "string") return { valid: false, error: `Item at index ${iIdx} in topic "${topic.title}" is missing 'title' string.` };
          if (!["video", "problem", "article"].includes(item.type)) {
            return { valid: false, error: `Item at index ${iIdx} in topic "${topic.title}" 'type' must be one of: video, problem, article.` };
          }
        }
      }
    }
    return { valid: true, error: null };
  };

  const handleJsonStringChange = (text: string) => {
    setRawJsonStr(text);
    if (!text.trim()) {
      setIsJsonValid(false);
      setJsonError("JSON cannot be empty.");
      return;
    }

    try {
      const parsed = JSON.parse(text);
      const res = validateStructure(parsed);
      if (res.valid) {
        setIsJsonValid(true);
        setJsonError(null);
        setStructure(parsed);
      } else {
        setIsJsonValid(false);
        setJsonError(res.error);
      }
    } catch (e: any) {
      setIsJsonValid(false);
      setJsonError(`JSON Syntax Error: ${e.message}`);
    }
  };

  // Visual Editor Updates
  const addPhase = () => {
    const newPhase: Phase = {
      id: generateId("phase"),
      title: `Phase ${structure.phases.length + 1}`,
      subtitle: "Detailed description of phase objectives",
      color: "blue",
      topics: [],
    };
    setStructure({
      ...structure,
      phases: [...structure.phases, newPhase],
    });
    setExpandedPhases((prev) => ({ ...prev, [newPhase.id]: true }));
  };

  const removePhase = (phaseId: string) => {
    if (!confirm("Are you sure you want to delete this phase and all nested topics?")) return;
    setStructure({
      ...structure,
      phases: structure.phases.filter((p) => p.id !== phaseId),
    });
  };

  const updatePhase = (phaseId: string, updates: Partial<Phase>) => {
    setStructure({
      ...structure,
      phases: structure.phases.map((p) => (p.id === phaseId ? { ...p, ...updates } : p)),
    });
  };

  const addTopic = (phaseId: string) => {
    const newTopic: Topic = {
      id: generateId("topic"),
      title: "New Topic",
      description: "Brief overview of topic targets",
      icon: "Code2",
      iconColor: "text-blue-500",
      iconBg: "bg-blue-50 dark:bg-blue-500/10",
      items: [],
    };
    setStructure({
      ...structure,
      phases: structure.phases.map((p) => {
        if (p.id === phaseId) {
          return { ...p, topics: [...p.topics, newTopic] };
        }
        return p;
      }),
    });
    setExpandedTopics((prev) => ({ ...prev, [newTopic.id]: true }));
  };

  const removeTopic = (phaseId: string, topicId: string) => {
    setStructure({
      ...structure,
      phases: structure.phases.map((p) => {
        if (p.id === phaseId) {
          return { ...p, topics: p.topics.filter((t) => t.id !== topicId) };
        }
        return p;
      }),
    });
  };

  const updateTopic = (phaseId: string, topicId: string, updates: Partial<Topic>) => {
    setStructure({
      ...structure,
      phases: structure.phases.map((p) => {
        if (p.id === phaseId) {
          return {
            ...p,
            topics: p.topics.map((t) => (t.id === topicId ? { ...t, ...updates } : t)),
          };
        }
        return p;
      }),
    });
  };

  const addItem = (phaseId: string, topicId: string) => {
    const newItem: RoadmapItem = {
      id: generateId("item"),
      title: "New Resource",
      type: "problem",
      difficulty: "Easy",
      timeEstimate: "15 min",
      url: "",
    };
    setStructure({
      ...structure,
      phases: structure.phases.map((p) => {
        if (p.id === phaseId) {
          return {
            ...p,
            topics: p.topics.map((t) => {
              if (t.id === topicId) {
                return { ...t, items: [...t.items, newItem] };
              }
              return t;
            }),
          };
        }
        return p;
      }),
    });
  };

  const removeItem = (phaseId: string, topicId: string, itemId: string) => {
    setStructure({
      ...structure,
      phases: structure.phases.map((p) => {
        if (p.id === phaseId) {
          return {
            ...p,
            topics: p.topics.map((t) => {
              if (t.id === topicId) {
                return { ...t, items: t.items.filter((i) => i.id !== itemId) };
              }
              return t;
            }),
          };
        }
        return p;
      }),
    });
  };

  const updateItem = (phaseId: string, topicId: string, itemId: string, updates: Partial<RoadmapItem>) => {
    setStructure({
      ...structure,
      phases: structure.phases.map((p) => {
        if (p.id === phaseId) {
          return {
            ...p,
            topics: p.topics.map((t) => {
              if (t.id === topicId) {
                return {
                  ...t,
                  items: t.items.map((i) => (i.id === itemId ? { ...i, ...updates } : i)),
                };
              }
              return t;
            }),
          };
        }
        return p;
      }),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Title is required.");
      return;
    }
    if (!isJsonValid) {
      alert("Cannot save: Roadmap structure JSON is invalid. Please fix errors on the JSON tab first.");
      return;
    }

    try {
      setSaving(true);
      setSaveError(null);
      setSaveSuccess(false);

      const payload = {
        title: title.trim(),
        is_active: isActive,
        structure,
        user_input: userInput,
      };

      await updateAdminRoadmapApi(roadmapId, payload);
      setSaveSuccess(true);
      setTimeout(() => {
        router.push("/admin/roadmaps");
      }, 1500);
    } catch (err: any) {
      setSaveError(err.message || "Failed to update roadmap");
    } finally {
      setSaving(false);
    }
  };

  const togglePhase = (phaseId: string) => {
    setExpandedPhases((prev) => ({ ...prev, [phaseId]: !prev[phaseId] }));
  };

  const toggleTopic = (topicId: string) => {
    setExpandedTopics((prev) => ({ ...prev, [topicId]: !prev[topicId] }));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <Activity size={32} className="animate-spin text-brand-500" />
        <p className="text-gray-500">Loading roadmap specifications...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20 px-4">
      {/* Header */}
      <div className="flex items-center gap-4 mb-4">
        <Link
          href="/admin/roadmaps"
          className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:text-gray-950 dark:hover:text-white bg-white dark:bg-gray-950 transition-all shadow-sm"
        >
          <ArrowLeft size={16} />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-black text-gray-950 dark:text-white tracking-tight">Edit Roadmap</h1>
            <Link
              href={`/roadmap/${roadmapId}`}
              target="_blank"
              className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs font-semibold rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              Public View <ExternalLink size={12} />
            </Link>
          </div>
          <p className="text-xs text-gray-500">Editing roadmap <span className="font-mono">{roadmapId}</span></p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {saveError && (
          <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/10 text-xs font-bold text-red-600">
            {saveError}
          </div>
        )}

        {saveSuccess && (
          <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-xs font-bold text-emerald-600">
            Roadmap updated successfully! Redirecting...
          </div>
        )}

        {/* Basic specifications card */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-base font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-3">Basic Information</h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Roadmap Title *</label>
              <input
                required
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all font-semibold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Roadmap Status</label>
              <div className="flex items-center h-11 px-4 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 rounded text-brand-500 focus:ring-brand-400 accent-brand-500 cursor-pointer"
                />
                <label htmlFor="is_active" className="ml-2 text-xs font-bold text-gray-700 dark:text-gray-300 cursor-pointer select-none uppercase tracking-wider">
                  Set Active
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* User parameters questionnaire info card */}
        {userInput && (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-base font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-3 flex items-center gap-1.5">
              <Layers size={18} className="text-brand-500" />
              Generated Inputs & Preferences
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="p-3 bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800/40 rounded-xl">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Primary Goal</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200 mt-0.5 block">{userInput.primary_goal || "N/A"}</span>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800/40 rounded-xl">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Target Role</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200 mt-0.5 block">{userInput.target_role || "N/A"}</span>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800/40 rounded-xl">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Company Tier</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200 mt-0.5 block">{userInput.target_company_tier || "N/A"}</span>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800/40 rounded-xl">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Urgency Level</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200 mt-0.5 block">{userInput.urgency_level || "N/A"}</span>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800/40 rounded-xl">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Duration</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200 mt-0.5 block">{userInput.duration_weeks ? `${userInput.duration_weeks} weeks` : "N/A"}</span>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800/40 rounded-xl">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Hours / Week</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200 mt-0.5 block">{userInput.time_per_week_hours ? `${userInput.time_per_week_hours}h` : "N/A"}</span>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800/40 rounded-xl">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">DSA Level</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200 mt-0.5 block">{userInput.experience_level || "N/A"}</span>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800/40 rounded-xl">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Problems Solved</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200 mt-0.5 block">{userInput.problems_solved_count !== undefined ? userInput.problems_solved_count : "N/A"}</span>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800/40 rounded-xl">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Learning Style</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200 mt-0.5 block">{userInput.learning_style || "N/A"}</span>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800/40 rounded-xl">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Language</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200 mt-0.5 block">{userInput.programming_language || "N/A"}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs mt-3">
              <div className="p-3 bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800/40 rounded-xl">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Strong Topics</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200 mt-1 block">
                  {userInput.strong_topics && userInput.strong_topics.length > 0
                    ? userInput.strong_topics.join(", ")
                    : "None specified"}
                </span>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800/40 rounded-xl">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Weak Topics</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200 mt-1 block">
                  {userInput.weak_topics && userInput.weak_topics.length > 0
                    ? userInput.weak_topics.join(", ")
                    : "None specified"}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Double-tab roadmap structural editor */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-150 dark:border-gray-800 pb-4 gap-3">
            <div>
              <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                <BookOpen size={18} className="text-brand-500" />
                Roadmap Syllabus Structure
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">Edit phases, topic groups, and linked assets visually or directly in JSON.</p>
            </div>

            {/* Tab buttons */}
            <div className="flex bg-gray-100 dark:bg-gray-950 p-1 rounded-xl w-fit">
              <button
                type="button"
                onClick={() => setEditorMode("visual")}
                className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  editorMode === "visual"
                    ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Visual Builder
              </button>
              <button
                type="button"
                onClick={() => setEditorMode("json")}
                className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                  editorMode === "json"
                    ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Raw JSON Schema
                {!isJsonValid && <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />}
              </button>
            </div>
          </div>

          {editorMode === "visual" ? (
            /* VISUAL BUILDER VIEW */
            <div className="space-y-4">
              {structure.phases && structure.phases.length === 0 ? (
                <div className="py-12 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl text-center space-y-2">
                  <p className="text-sm text-gray-500">No phases added to the roadmap yet.</p>
                  <button
                    type="button"
                    onClick={addPhase}
                    className="px-4 py-2 bg-brand-500 text-white rounded-xl text-xs font-semibold hover:bg-brand-600 transition-colors"
                  >
                    Add Phase 1
                  </button>
                </div>
              ) : (
                structure.phases?.map((phase, pIdx) => (
                  <div key={phase.id} className="border border-gray-200 dark:border-gray-800 rounded-xl bg-gray-50/50 dark:bg-gray-950/20 overflow-hidden">
                    {/* Phase Header */}
                    <div className="flex items-center gap-2 p-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                      <button type="button" onClick={() => togglePhase(phase.id)} className="p-1 text-gray-400 hover:text-gray-600">
                        {expandedPhases[phase.id] ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                      </button>
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <div className="flex items-center gap-2 sm:col-span-2">
                          <span className="text-xs font-black text-gray-400 shrink-0">Phase {pIdx + 1}:</span>
                          <input
                            type="text"
                            value={phase.title}
                            onChange={(e) => updatePhase(phase.id, { title: e.target.value })}
                            className="w-full bg-transparent border-none text-sm font-bold text-gray-900 dark:text-white focus:ring-0 p-0"
                            placeholder="Phase Title"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-gray-400 uppercase">Color:</span>
                          <select
                            value={phase.color || "blue"}
                            onChange={(e) => updatePhase(phase.id, { color: e.target.value })}
                            className="bg-transparent border-none text-xs font-semibold text-gray-600 dark:text-gray-400 focus:ring-0 p-0 outline-none cursor-pointer"
                          >
                            <option value="blue">Blue theme</option>
                            <option value="emerald">Emerald theme</option>
                            <option value="purple">Purple theme</option>
                          </select>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removePhase(phase.id)}
                        className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Delete Phase"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    {/* Phase body */}
                    {expandedPhases[phase.id] && (
                      <div className="p-4 space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Phase Subtitle</label>
                          <input
                            type="text"
                            value={phase.subtitle}
                            onChange={(e) => updatePhase(phase.id, { subtitle: e.target.value })}
                            className="w-full px-3 py-1.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-xs focus:ring-1 focus:ring-brand-500 outline-none transition-all font-medium text-gray-700 dark:text-gray-300"
                            placeholder="Write a subtitle explaining this phase..."
                          />
                        </div>

                        {/* Topics List */}
                        <div className="space-y-3 pl-2 sm:pl-4 border-l-2 border-gray-200 dark:border-gray-800">
                          {phase.topics.map((topic, tIdx) => (
                            <div key={topic.id} className="border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
                              {/* Topic Header */}
                              <div className="flex items-center gap-2 p-2 bg-gray-55/60 dark:bg-gray-950/40 border-b border-gray-100 dark:border-gray-800">
                                <button type="button" onClick={() => toggleTopic(topic.id)} className="p-1 text-gray-400 hover:text-gray-600">
                                  {expandedTopics[topic.id] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                                </button>
                                <div className="flex-1 flex items-center gap-2">
                                  <span className="text-[10px] font-bold text-gray-400 shrink-0">Topic {tIdx + 1}:</span>
                                  <input
                                    type="text"
                                    value={topic.title}
                                    onChange={(e) => updateTopic(phase.id, topic.id, { title: e.target.value })}
                                    className="w-full bg-transparent border-none text-xs font-bold text-gray-800 dark:text-gray-200 focus:ring-0 p-0"
                                    placeholder="Topic Name"
                                  />
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeTopic(phase.id, topic.id)}
                                  className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                                  title="Delete Topic"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>

                              {/* Topic Body */}
                              {expandedTopics[topic.id] && (
                                <div className="p-3 space-y-3">
                                  <div className="space-y-1">
                                    <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Topic Description</label>
                                    <textarea
                                      rows={2}
                                      value={topic.description}
                                      onChange={(e) => updateTopic(phase.id, topic.id, { description: e.target.value })}
                                      className="w-full px-3 py-1.5 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg text-xs focus:ring-1 focus:ring-brand-500 outline-none transition-all resize-none font-medium text-gray-600 dark:text-gray-400"
                                      placeholder="Brief overview of topic targets"
                                    />
                                  </div>

                                  {/* Items Table */}
                                  <div className="space-y-2">
                                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Resources / Items</span>
                                    {topic.items.length === 0 ? (
                                      <p className="text-[11px] text-gray-400 italic text-center py-2 bg-gray-50 dark:bg-gray-950 rounded border border-dashed border-gray-150 dark:border-gray-850">
                                        No items linked. Add problems, videos, or article slugs.
                                      </p>
                                    ) : (
                                      <div className="space-y-2">
                                        {topic.items.map((item, iIdx) => (
                                          <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-2 p-2 bg-gray-50 dark:bg-gray-950 border border-gray-150 dark:border-gray-850 rounded-lg group text-xs">
                                            <span className="font-bold text-gray-400 w-4 text-[10px] shrink-0 mt-1 sm:mt-0">{iIdx + 1}.</span>
                                            
                                            {/* Item Title */}
                                            <input
                                              type="text"
                                              value={item.title}
                                              onChange={(e) => updateItem(phase.id, topic.id, item.id, { title: e.target.value })}
                                              className="flex-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 px-2 py-1 rounded outline-none font-semibold text-gray-800 dark:text-gray-200 min-w-[150px]"
                                              placeholder="Item Title"
                                            />

                                            {/* Item Asset slug/ID */}
                                            <input
                                              type="text"
                                              value={item.id}
                                              onChange={(e) => updateItem(phase.id, topic.id, item.id, { id: e.target.value })}
                                              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 px-2 py-1 rounded outline-none font-mono text-[10px] text-gray-600 dark:text-gray-400 w-32 shrink-0"
                                              placeholder="ID (e.g. two-sum)"
                                            />

                                            {/* Item Type */}
                                            <select
                                              value={item.type}
                                              onChange={(e) => updateItem(phase.id, topic.id, item.id, { type: e.target.value as any })}
                                              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 px-2 py-1 rounded outline-none font-medium text-gray-700 dark:text-gray-300 w-24 shrink-0"
                                            >
                                              <option value="problem">Problem</option>
                                              <option value="video">Video</option>
                                              <option value="article">Article</option>
                                            </select>

                                            {/* Difficulty */}
                                            <select
                                              value={item.difficulty || "Easy"}
                                              onChange={(e) => updateItem(phase.id, topic.id, item.id, { difficulty: e.target.value })}
                                              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 px-2 py-1 rounded outline-none font-medium text-gray-700 dark:text-gray-300 w-20 shrink-0"
                                            >
                                              <option value="Easy">Easy</option>
                                              <option value="Medium">Medium</option>
                                              <option value="Hard">Hard</option>
                                            </select>

                                            {/* Time Estimate */}
                                            <input
                                              type="text"
                                              value={item.timeEstimate || "15 min"}
                                              onChange={(e) => updateItem(phase.id, topic.id, item.id, { timeEstimate: e.target.value })}
                                              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 px-2 py-1 rounded outline-none font-medium text-gray-600 dark:text-gray-400 w-20 shrink-0 text-center"
                                              placeholder="15 min"
                                            />

                                            <button
                                              type="button"
                                              onClick={() => removeItem(phase.id, topic.id, item.id)}
                                              className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded transition-colors self-end sm:self-auto"
                                            >
                                              <Trash2 size={14} />
                                            </button>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                    <button
                                      type="button"
                                      onClick={() => addItem(phase.id, topic.id)}
                                      className="py-1 px-3 border border-dashed border-gray-200 dark:border-gray-800 rounded-lg text-xs font-semibold text-gray-500 hover:text-brand-500 hover:border-brand-500 hover:bg-brand-50/50 transition-colors flex items-center justify-center gap-1 mt-2 w-max"
                                    >
                                      <Plus size={14} /> Add Item
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => addTopic(phase.id)}
                            className="w-full py-2 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl text-xs font-bold text-gray-500 hover:text-brand-500 hover:border-brand-500 hover:bg-brand-50 transition-colors flex items-center justify-center gap-1 shadow-sm bg-white dark:bg-gray-900"
                          >
                            <Plus size={14} /> Add Topic Group
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}

              <button
                type="button"
                onClick={addPhase}
                className="w-full py-3 bg-gray-100 dark:bg-gray-850/60 rounded-xl text-xs font-black text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors flex items-center justify-center gap-1.5 border border-gray-200 dark:border-gray-800 shadow-sm"
              >
                <Plus size={16} /> Create New Phase
              </button>
            </div>
          ) : (
            /* RAW JSON EDITOR VIEW */
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-bold text-gray-400 uppercase tracking-wider">
                <span>Structure JSON Payload</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded font-black ${
                    isJsonValid
                      ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/10"
                      : "bg-red-500/10 text-red-600 border border-red-500/10 animate-pulse"
                  }`}
                >
                  {isJsonValid ? "Valid structure Schema" : "Invalid structure Schema"}
                </span>
              </div>

              {jsonError && (
                <div className="p-3.5 rounded-xl bg-red-500/5 border border-red-500/10 text-xs font-mono text-red-500 whitespace-pre-wrap leading-relaxed select-text flex gap-1.5">
                  <AlertCircle size={14} className="shrink-0 mt-0.5" />
                  <span>{jsonError}</span>
                </div>
              )}

              <textarea
                value={rawJsonStr}
                onChange={(e) => handleJsonStringChange(e.target.value)}
                rows={18}
                className={`w-full px-4 py-3 rounded-xl border bg-transparent text-xs text-gray-950 dark:text-white focus:outline-none font-mono resize-y leading-relaxed ${
                  isJsonValid
                    ? "border-gray-200 dark:border-gray-800 focus:ring-1 focus:ring-brand-500"
                    : "border-red-500 focus:ring-1 focus:ring-red-500"
                }`}
                placeholder="Paste structure JSON here..."
              />

              <div className="bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 p-4.5 rounded-2xl space-y-2">
                <span className="text-[10px] font-black text-blue-700 dark:text-blue-400 uppercase tracking-widest block leading-none flex items-center gap-1">
                  <Info size={12} />
                  Structure schema rules
                </span>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-relaxed font-semibold">
                  Every phase must contain string fields: <code className="text-brand-500">"id"</code>, <code className="text-brand-500">"title"</code>, and an array of <code className="text-brand-500">"topics"</code>.
                  Every topic must contain string fields: <code className="text-brand-500">"id"</code>, <code className="text-brand-500">"title"</code>, and an array of <code className="text-brand-500">"items"</code>.
                  Topic items must contain string fields: <code className="text-brand-500">"id"</code> (matches catalog slug), <code className="text-brand-500">"title"</code>, and <code className="text-brand-500">"type"</code> (one of: video, problem, article).
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Actions panel */}
        <div className="flex justify-end gap-3.5 pt-4">
          <Link
            href="/admin/roadmaps"
            className="px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
          >
            Discard Changes
          </Link>
          <button
            type="submit"
            disabled={saving || !isJsonValid}
            className="px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-gray-200 dark:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {saving ? <Activity size={14} className="animate-spin" /> : <Save size={14} />}
            {saving ? "Saving Changes..." : "Save Specifications"}
          </button>
        </div>
      </form>
    </div>
  );
}
