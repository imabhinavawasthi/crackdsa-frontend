"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Calendar, FileEdit } from "lucide-react";
import LoginRequired from "@/components/common/LoginRequired";
import { useAuth } from "@/context/AuthContext";
import { fetchUserAssetStates, updateUserAssetState } from "@/api/user";
import { Skeleton } from "@/components/ui/skeleton";

interface Note {
  id: string;
  text: string;
  createdAt: string;
}

interface NotesTabProps {
  courseId: string;
  itemId: string;
  assetType?: "problem" | "video" | "article";
  onNotesChange?: (notes: Note[]) => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const noteCardVariants = {
  hidden: { opacity: 0, y: -18, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 340, damping: 28 },
  },
  exit: {
    opacity: 0,
    x: -30,
    scale: 0.95,
    transition: { duration: 0.25, ease: "easeInOut" as const },
  },
};

const floatingVariants = {
  animate: {
    y: [0, -6, 0],
    transition: {
      duration: 3.5,
      repeat: Infinity,
      ease: "easeInOut" as const,
    },
  },
};

const NotesTab: React.FC<NotesTabProps> = ({
  courseId,
  itemId,
  assetType = "video",
  onNotesChange,
}) => {
  const { isLoggedIn } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNoteText, setNewNoteText] = useState("");
  const [loading, setLoading] = useState(true);

  // Sync loading state immediately during render if itemId changes
  const [prevItemId, setPrevItemId] = useState<string>(itemId);
  if (itemId !== prevItemId) {
    setPrevItemId(itemId);
    setLoading(true);
  }

  useEffect(() => {
    const fetchNotes = async () => {
      if (!isLoggedIn || !itemId) return;
      try {
        setLoading(true);
        const states = await fetchUserAssetStates();
        const current = states.find((s) => s.asset_id === itemId && s.asset_type === assetType);
        if (current && current.notes) {
          setNotes(current.notes);
        } else {
          setNotes([]);
        }
      } catch (err) {
        console.error("Failed to fetch notes:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, [isLoggedIn, itemId, assetType]);

  if (!isLoggedIn) {
    return (
      <LoginRequired 
        title="Personal Notes Locked"
        description="Save formulas, complexity analysis, and study notes directly to your profile by signing in."
      />
    );
  }

  const persistNotes = async (updatedNotes: Note[]) => {
    setNotes(updatedNotes);
    if (onNotesChange) {
      onNotesChange(updatedNotes);
    }

    try {
      await updateUserAssetState(assetType, itemId, { notes: updatedNotes });
    } catch (err) {
      console.error("Failed to save notes:", err);
    }
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    const newNote: Note = {
      id: `note-${Date.now()}`,
      text: newNoteText,
      createdAt: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      })
    };

    const updated = [newNote, ...notes];
    persistNotes(updated);
    setNewNoteText("");
  };

  const handleDeleteNote = (id: string) => {
    const filtered = notes.filter((n) => n.id !== id);
    persistNotes(filtered);
  };

  const hasText = newNoteText.trim().length > 0;

  return (
    <motion.div
      className="space-y-6 select-none"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      
      {/* 1. Add Note Form */}
      <motion.form
        onSubmit={handleAddNote}
        className="space-y-3.5 bg-gray-50 dark:bg-gray-800/10 rounded-2xl p-4.5 border border-gray-200/60 dark:border-gray-800"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1 }}
      >
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-brand-500 animate-pulse" />
            <span>Personal Notepad</span>
          </span>
          <span className="text-[10px] text-gray-400 font-bold">
            Synced to your profile
          </span>
        </div>

        <textarea
          value={newNoteText}
          onChange={(e) => setNewNoteText(e.target.value)}
          placeholder="Type your notes or insights about this session here..."
          rows={3}
          className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-3.5 text-xs sm:text-sm font-medium outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 focus:shadow-[0_0_15px_-3px_rgba(var(--color-brand-500),0.25)] text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-600 resize-none transition-all duration-300"
        />

        <div className="flex justify-end">
          <motion.button
            type="submit"
            disabled={!hasText || loading}
            className={`flex items-center justify-center gap-1.5 rounded-xl bg-brand-500 hover:bg-brand-600 disabled:opacity-50 disabled:hover:bg-brand-500 text-white px-4.5 py-2.5 text-xs font-bold shadow-md shadow-brand-500/15 hover:shadow-lg hover:shadow-brand-500/20 transition-all active:scale-[0.98] ${
              hasText ? "animate-pulse shadow-brand-500/40 shadow-lg" : ""
            }`}
            whileHover={hasText ? { scale: 1.03 } : {}}
            whileTap={hasText ? { scale: 0.96 } : {}}
          >
            <Plus size={14} />
            <span>Save Note</span>
          </motion.button>
        </div>
      </motion.form>

      {/* 2. Notes List */}
      <div className="space-y-4">
        <motion.h3
          className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2"
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35, delay: 0.15 }}
        >
          <FileEdit size={15} className="text-brand-500" />
          <span>My Notes ({notes.length})</span>
        </motion.h3>

        {loading ? (
          <div className="space-y-3.5 w-full animate-pulse">
            <Skeleton className="h-20 w-full rounded-2xl" />
            <Skeleton className="h-20 w-full rounded-2xl" />
          </div>
        ) : notes.length === 0 ? (
          <motion.div
            className="text-center py-10 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl"
            variants={floatingVariants}
            animate="animate"
          >
            <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-500 font-medium">No notes created for this session yet.</p>
          </motion.div>
        ) : (
          <motion.div
            className="flex flex-col gap-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence mode="popLayout">
              {notes.map((note) => (
                <motion.div 
                  key={note.id}
                  layout
                  variants={noteCardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="group flex flex-col sm:flex-row items-start justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-300"
                >
                  <div className="flex items-start gap-4 flex-1">
                    <div className="space-y-1.5 mt-0.5">
                      <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 font-medium whitespace-pre-wrap leading-relaxed">
                        {note.text}
                      </p>
                      <div className="flex items-center gap-1.5 text-[9px] font-bold text-gray-400 uppercase tracking-widest pt-1">
                        <Calendar size={10} />
                        <span>{note.createdAt}</span>
                      </div>
                    </div>
                  </div>

                  <motion.button
                    onClick={() => handleDeleteNote(note.id)}
                    className="sm:opacity-0 group-hover:opacity-100 shrink-0 p-2.5 rounded-xl bg-red-500/5 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/10 transition-all duration-200 shadow-sm cursor-pointer"
                    title="Delete Note"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Trash2 size={13} />
                  </motion.button>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

    </motion.div>
  );
};

export default NotesTab;
