"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import Button from "@/components/ui/button/Button";
import { RoadmapDBRecord } from "./types";
import { Map, Trash2, Edit2, PlayCircle } from "lucide-react";
import { Input } from "@/components/ui/input";

interface RoadmapManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  roadmaps: RoadmapDBRecord[];
  activeId?: string;
  onActivate: (id: string) => Promise<boolean>;
  onRename: (id: string, newTitle: string) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
  onCreateNew: () => void;
}

export default function RoadmapManagerModal({
  isOpen,
  onClose,
  roadmaps,
  activeId,
  onActivate,
  onRename,
  onDelete,
  onCreateNew,
}: RoadmapManagerModalProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  const handleRenameSubmit = async (id: string) => {
    if (editTitle.trim()) {
      await onRename(id, editTitle.trim());
    }
    setEditingId(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Map className="w-5 h-5 text-brand-500" />
            My Roadmaps
          </DialogTitle>
          <DialogDescription>
            Manage your AI-generated roadmaps. You can only have one active at a time.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-3 max-h-[60vh] overflow-y-auto pr-2">
          {roadmaps.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">No roadmaps generated yet.</p>
          ) : (
            roadmaps.map((rm) => (
              <div
                key={rm.id}
                className={`p-3 rounded-xl border flex flex-col gap-2 transition-all ${
                  rm.id === activeId
                    ? "border-brand-500 bg-brand-50/50 dark:bg-brand-500/10 shadow-sm shadow-brand-500/10"
                    : "border-gray-200 dark:border-gray-800"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    {editingId === rm.id ? (
                      <Input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onBlur={() => handleRenameSubmit(rm.id)}
                        onKeyDown={(e) => e.key === "Enter" && handleRenameSubmit(rm.id)}
                        autoFocus
                        className="h-7 text-sm px-2 w-full max-w-[200px]"
                      />
                    ) : (
                      <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100 flex items-center gap-2">
                        {rm.title}
                        {rm.id === activeId && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-brand-100 text-brand-700 dark:bg-brand-500/20 dark:text-brand-300 text-[10px] uppercase tracking-wider font-bold">
                            Active
                          </span>
                        )}
                      </h4>
                    )}
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      {new Date(rm.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-1">
                    {rm.id !== activeId && (
                      <button
                        onClick={() => onActivate(rm.id)}
                        className="p-1.5 text-gray-500 hover:text-brand-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                        title="Set Active"
                      >
                        <PlayCircle className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setEditingId(rm.id);
                        setEditTitle(rm.title);
                      }}
                      className="p-1.5 text-gray-500 hover:text-gray-900 dark:hover:text-white rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                      title="Rename"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(rm.id)}
                      className="p-1.5 text-gray-500 hover:text-red-600 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
          <Button
            className="w-full"
            variant="outline"
            onClick={() => {
              onClose();
              onCreateNew();
            }}
          >
            Create New Roadmap
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
