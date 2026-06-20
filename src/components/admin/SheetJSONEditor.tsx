"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Plus, Trash2, ChevronDown, ChevronRight, Search, Check, GripVertical } from "lucide-react";
import { fetchProblems } from "@/api/problems";
import { PracticeProblem } from "@/types/practice";

import type {
  SheetJSONProblem,
  SheetJSONStep,
  SheetJSONTopic,
  SheetJSON
} from "@/types/admin";
export type {
  SheetJSONProblem,
  SheetJSONStep,
  SheetJSONTopic,
  SheetJSON
} from "@/types/admin";

interface SheetJSONEditorProps {
  value: SheetJSON;
  onChange: (value: SheetJSON) => void;
}

// Generates a simple ID like "topic-xyz"
const generateId = (prefix: string) => `${prefix}-${Math.random().toString(36).substring(2, 9)}`;

export default function SheetJSONEditor({ value, onChange }: SheetJSONEditorProps) {
  const [allProblems, setAllProblems] = useState<PracticeProblem[]>([]);
  const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>({});
  const [expandedSteps, setExpandedSteps] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchProblems().then(data => setAllProblems(data)).catch(err => console.error("Failed to load problems for editor:", err));
  }, []);

  // Ensure value has topics array
  const topics = value?.topics || [];

  const updateTopics = (newTopics: SheetJSONTopic[]) => {
    onChange({ ...value, topics: newTopics });
  };

  const addTopic = () => {
    const newTopic: SheetJSONTopic = {
      id: generateId("topic"),
      title: "New Topic",
      steps: []
    };
    updateTopics([...topics, newTopic]);
    setExpandedTopics({ ...expandedTopics, [newTopic.id]: true });
  };

  const removeTopic = (topicId: string) => {
    updateTopics(topics.filter(t => t.id !== topicId));
  };

  const updateTopic = (topicId: string, updates: Partial<SheetJSONTopic>) => {
    updateTopics(topics.map(t => t.id === topicId ? { ...t, ...updates } : t));
  };

  const addStep = (topicId: string) => {
    const newStep: SheetJSONStep = {
      id: generateId("step"),
      title: "New Step",
      pattern_id: "general",
      problems: []
    };
    updateTopics(topics.map(t => {
      if (t.id === topicId) {
        return { ...t, steps: [...t.steps, newStep] };
      }
      return t;
    }));
    setExpandedSteps({ ...expandedSteps, [newStep.id]: true });
  };

  const removeStep = (topicId: string, stepId: string) => {
    updateTopics(topics.map(t => {
      if (t.id === topicId) {
        return { ...t, steps: t.steps.filter(s => s.id !== stepId) };
      }
      return t;
    }));
  };

  const updateStep = (topicId: string, stepId: string, updates: Partial<SheetJSONStep>) => {
    updateTopics(topics.map(t => {
      if (t.id === topicId) {
        return { ...t, steps: t.steps.map(s => s.id === stepId ? { ...s, ...updates } : s) };
      }
      return t;
    }));
  };

  const addProblem = (topicId: string, stepId: string, problemSlug: string) => {
    updateTopics(topics.map(t => {
      if (t.id === topicId) {
        return {
          ...t,
          steps: t.steps.map(s => {
            if (s.id === stepId) {
              // Avoid duplicates
              if (s.problems.some(p => p.problem_id === problemSlug)) return s;
              return { ...s, problems: [...s.problems, { problem_id: problemSlug }] };
            }
            return s;
          })
        };
      }
      return t;
    }));
  };

  const removeProblem = (topicId: string, stepId: string, problemIndex: number) => {
    updateTopics(topics.map(t => {
      if (t.id === topicId) {
        return {
          ...t,
          steps: t.steps.map(s => {
            if (s.id === stepId) {
              const newProblems = [...s.problems];
              newProblems.splice(problemIndex, 1);
              return { ...s, problems: newProblems };
            }
            return s;
          })
        };
      }
      return t;
    }));
  };

  const toggleTopic = (topicId: string) => {
    setExpandedTopics(prev => ({ ...prev, [topicId]: !prev[topicId] }));
  };

  const toggleStep = (stepId: string) => {
    setExpandedSteps(prev => ({ ...prev, [stepId]: !prev[stepId] }));
  };

  // Helper component for Problem Selector
  const ProblemSelector = ({ topicId, stepId, currentProblems }: { topicId: string, stepId: string, currentProblems: SheetJSONProblem[] }) => {
    const [search, setSearch] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    const filteredProblems = useMemo(() => {
      if (!search) return allProblems.slice(0, 10); // Show top 10 initially
      return allProblems.filter(p => p.title.toLowerCase().includes(search.toLowerCase()) || p.slug.toLowerCase().includes(search.toLowerCase())).slice(0, 10);
    }, [search, allProblems]);

    const currentSlugs = currentProblems.map(p => p.problem_id);

    return (
      <div className="relative mt-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
            <input 
              type="text"
              value={search}
              onChange={e => {
                setSearch(e.target.value);
                setIsOpen(true);
              }}
              onFocus={() => setIsOpen(true)}
              placeholder="Search problems to add..."
              className="w-full h-9 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 pl-9 pr-3 text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all"
            />
          </div>
          <button 
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            Browse
          </button>
        </div>

        {isOpen && (
          <div className="absolute z-20 mt-1 w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-xl max-h-60 overflow-y-auto">
            {filteredProblems.length === 0 ? (
              <div className="p-3 text-sm text-gray-500 text-center">No problems found.</div>
            ) : (
              <div className="p-1">
                {filteredProblems.map(p => {
                  const isSelected = currentSlugs.includes(p.slug);
                  return (
                    <button
                      key={p.id}
                      type="button"
                      disabled={isSelected}
                      onClick={() => {
                        addProblem(topicId, stepId, p.slug);
                        setIsOpen(false);
                        setSearch("");
                      }}
                      className={`w-full flex items-center justify-between p-2 text-left rounded-md text-sm transition-colors ${
                        isSelected 
                          ? "bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 cursor-not-allowed" 
                          : "hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200"
                      }`}
                    >
                      <span className="truncate pr-2">{p.title}</span>
                      {isSelected ? <Check size={14} className="shrink-0" /> : <Plus size={14} className="shrink-0 text-gray-400" />}
                    </button>
                  );
                })}
              </div>
            )}
            <div className="p-2 border-t border-gray-100 dark:border-gray-800 flex justify-end">
              <button 
                type="button" 
                onClick={() => setIsOpen(false)}
                className="text-xs font-medium text-gray-500 hover:text-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {topics.map((topic, tIdx) => (
        <div key={topic.id} className="border border-gray-200 dark:border-gray-800 rounded-xl bg-gray-50 dark:bg-gray-900/30 overflow-hidden">
          {/* Topic Header */}
          <div className="flex items-center gap-2 p-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
            <button type="button" onClick={() => toggleTopic(topic.id)} className="p-1 text-gray-400 hover:text-gray-600">
              {expandedTopics[topic.id] ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
            </button>
            <div className="flex-1 flex gap-2 items-center">
              <span className="text-sm font-bold text-gray-500 shrink-0">Topic {tIdx + 1}:</span>
              <input
                type="text"
                value={topic.title}
                onChange={e => updateTopic(topic.id, { title: e.target.value })}
                className="flex-1 bg-transparent border-none text-sm font-semibold text-gray-900 dark:text-white focus:ring-0 p-0"
                placeholder="Topic Title (e.g. Arrays)"
              />
            </div>
            <button type="button" onClick={() => removeTopic(topic.id)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
              <Trash2 size={16} />
            </button>
          </div>

          {/* Topic Body (Steps) */}
          {expandedTopics[topic.id] && (
            <div className="p-3 sm:p-5 space-y-4">
              {topic.steps.map((step, sIdx) => (
                <div key={step.id} className="border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 shadow-sm">
                  {/* Step Header */}
                  <div className="flex items-center gap-2 p-2.5 border-b border-gray-100 dark:border-gray-800/60 bg-gray-50/50 dark:bg-gray-900/50">
                    <button type="button" onClick={() => toggleStep(step.id)} className="p-1 text-gray-400 hover:text-gray-600">
                      {expandedSteps[step.id] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </button>
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2 items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-500 shrink-0">Step {sIdx + 1}:</span>
                        <input
                          type="text"
                          value={step.title}
                          onChange={e => updateStep(topic.id, step.id, { title: e.target.value })}
                          className="w-full bg-transparent border-none text-sm font-medium text-gray-800 dark:text-gray-200 focus:ring-0 p-0"
                          placeholder="Step Title (e.g. Easy)"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400 shrink-0">Pattern:</span>
                        <input
                          type="text"
                          value={step.pattern_id}
                          onChange={e => updateStep(topic.id, step.id, { pattern_id: e.target.value })}
                          className="w-full bg-transparent border-none text-xs text-gray-600 dark:text-gray-400 focus:ring-0 p-0"
                          placeholder="Pattern ID (optional)"
                        />
                      </div>
                    </div>
                    <button type="button" onClick={() => removeStep(topic.id, step.id)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>

                  {/* Step Body (Problems) */}
                  {expandedSteps[step.id] && (
                    <div className="p-3">
                      <div className="space-y-2">
                        {step.problems.length === 0 ? (
                          <p className="text-xs text-gray-400 italic text-center py-2">No problems added yet.</p>
                        ) : (
                          step.problems.map((prob, pIdx) => {
                            const problemDetail = allProblems.find(p => p.slug === prob.problem_id);
                            return (
                              <div key={`${prob.problem_id}-${pIdx}`} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 rounded-lg group">
                                <GripVertical size={14} className="text-gray-300 cursor-move" />
                                <span className="text-xs font-bold text-gray-400 w-4">{pIdx + 1}.</span>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                                    {problemDetail ? problemDetail.title : prob.problem_id}
                                  </p>
                                  {!problemDetail && <p className="text-[10px] text-red-400">Warning: Problem not found in catalog</p>}
                                </div>
                                <button type="button" onClick={() => removeProblem(topic.id, step.id, pIdx)} className="p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            );
                          })
                        )}
                      </div>

                      {/* Add Problem Selector */}
                      <ProblemSelector topicId={topic.id} stepId={step.id} currentProblems={step.problems} />
                    </div>
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={() => addStep(topic.id)}
                className="w-full py-2 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-lg text-sm font-medium text-gray-500 hover:text-brand-500 hover:border-brand-500 hover:bg-brand-50 transition-colors flex items-center justify-center gap-1"
              >
                <Plus size={16} /> Add Step
              </button>
            </div>
          )}
        </div>
      ))}

      <button
        type="button"
        onClick={addTopic}
        className="w-full py-3 bg-gray-100 dark:bg-gray-800/50 rounded-xl text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors flex items-center justify-center gap-1 border border-gray-200 dark:border-gray-800 shadow-sm"
      >
        <Plus size={18} /> Add New Topic
      </button>

      <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 p-3 rounded-lg text-xs text-blue-700 dark:text-blue-300">
        <strong>Note:</strong> The nested JSON structure (Topics → Steps → Problems) will be automatically compiled and validated when you save the sheet.
      </div>
    </div>
  );
}
