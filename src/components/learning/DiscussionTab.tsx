"use client";

import React, { useState, useEffect } from "react";
import { MessageSquare, Send, CheckCircle2, Award, User, Search } from "lucide-react";

interface Reply {
  id: string;
  authorName: string;
  authorRole: string;
  authorAvatar?: string;
  text: string;
  isInstructor: boolean;
  createdAt: string;
}

interface Thread {
  id: string;
  title: string;
  authorName: string;
  authorAvatar?: string;
  text: string;
  lectureTitle: string;
  replies: Reply[];
  createdAt: string;
}

interface DiscussionTabProps {
  courseId: string;
  itemId: string;
  lectureTitle: string;
}

const DEFAULT_THREADS: Record<string, Thread[]> = {
  "item-1": [
    {
      id: "thread-1",
      title: "Why does Java handle primitive array allocation differently in heap memory?",
      authorName: "Rohan Sharma",
      text: "In the lecture, we discussed how array indexes compile to simple address offsets. Does Java instantiate primitive arrays (like int[]) as pure objects, and does that add substantial header overhead?",
      lectureTitle: "1.1 Language Basics & Memory Layout",
      createdAt: "3 days ago",
      replies: [
        {
          id: "reply-1",
          authorName: "Abhinav Awasthi",
          authorRole: "Founder, CrackDSA • Ex-Google",
          text: "Yes, exactly! In Java, arrays are indeed treated as objects on the heap. An `int[]` array carries a 12-byte object header (16-byte on 64-bit systems with CompressedOOPs) containing metadata plus length. So unlike C++, Java has a small object overhead, but it gives you bounds-safety checks automatically!",
          isInstructor: true,
          createdAt: "2 days ago"
        }
      ]
    }
  ],
  "item-8": [
    {
      id: "thread-2",
      title: "Kadane's algorithm boundary limits for all-negative arrays",
      authorName: "Pooja Patel",
      text: "If the input array contains only negative numbers, e.g. [-5, -2, -8, -1], does Kadane's algorithm return 0 or the largest negative value (which would be -1)? Is there a tweak in initialization?",
      lectureTitle: "2.4 Maximum Subarray (Kadane's)",
      createdAt: "1 day ago",
      replies: [
        {
          id: "reply-2",
          authorName: "Abhinav Awasthi",
          authorRole: "Founder, CrackDSA • Ex-Google",
          text: "Excellent catch Pooja. In the standard implementation shown in our C++/Python tabs, `currMax` and `maxSoFar` are initialized to `nums[0]` rather than 0. This correctly handles all-negative inputs, returning `-1` instead of `0`. Always clarify this edge case with interviewer!",
          isInstructor: true,
          createdAt: "18 hours ago"
        }
      ]
    }
  ]
};

const DiscussionTab: React.FC<DiscussionTabProps> = ({
  courseId,
  itemId,
  lectureTitle
}) => {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newText, setNewText] = useState("");
  const [showForm, setShowForm] = useState(false);

  const storageKey = `discussions-${courseId}-${itemId}`;

  // Load threads
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        setThreads(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load threads:", e);
      }
    } else {
      // Load seeded defaults or empty
      setThreads(DEFAULT_THREADS[itemId] || []);
    }
  }, [storageKey, itemId]);

  const saveThreads = (updated: Thread[]) => {
    setThreads(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
  };

  const handleCreateThread = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newText.trim()) return;

    const newThread: Thread = {
      id: `thread-${Date.now()}`,
      title: newTitle,
      authorName: "Student (You)",
      text: newText,
      lectureTitle,
      replies: [],
      createdAt: "Just now"
    };

    const updated = [newThread, ...threads];
    saveThreads(updated);
    setNewTitle("");
    setNewText("");
    setShowForm(false);
  };

  const handleAddReply = (threadId: string, replyText: string) => {
    if (!replyText.trim()) return;

    const updated = threads.map((t) => {
      if (t.id === threadId) {
        const newReply: Reply = {
          id: `reply-${Date.now()}`,
          authorName: "Student (You)",
          authorRole: "Student",
          text: replyText,
          isInstructor: false,
          createdAt: "Just now"
        };
        return {
          ...t,
          replies: [...t.replies, newReply]
        };
      }
      return t;
    });

    saveThreads(updated);
  };

  const filteredThreads = threads.filter(
    (t) =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Search and Ask Button Row */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
        
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-4 top-3.5 text-gray-400 dark:text-gray-600" />
          <input
            type="text"
            placeholder="Search discussion threads..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-xs sm:text-sm font-medium outline-none focus:border-brand-500 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-600"
          />
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-xl bg-brand-500 hover:bg-brand-600 text-white px-5 py-3.5 text-xs font-bold shadow-md shadow-brand-500/15 hover:shadow-lg hover:shadow-brand-500/20 transition-all active:scale-[0.98] shrink-0"
        >
          {showForm ? "Close Form" : "Ask a New Question"}
        </button>
      </div>

      {/* Ask Question Form */}
      {showForm && (
        <form onSubmit={handleCreateThread} className="space-y-4 bg-gray-50 dark:bg-gray-800/10 rounded-2xl p-5 border border-gray-200/60 dark:border-gray-800 animate-fadeIn">
          <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">New Forum Topic</h4>
          
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Question Title (e.g. Help with time complexity calculation)"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-3.5 text-xs sm:text-sm font-bold outline-none focus:border-brand-500 text-gray-900 dark:text-gray-100"
            />
            <textarea
              placeholder="Provide a detailed description of your question or paste your code snippet..."
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              rows={4}
              className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-3.5 text-xs sm:text-sm font-medium outline-none focus:border-brand-500 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-600 resize-none"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!newTitle.trim() || !newText.trim()}
              className="flex items-center justify-center gap-1.5 rounded-xl bg-brand-500 hover:bg-brand-600 disabled:opacity-50 disabled:hover:bg-brand-500 text-white px-5 py-2.5 text-xs font-bold shadow-md shadow-brand-500/15"
            >
              <Send size={13} />
              <span>Submit Thread</span>
            </button>
          </div>
        </form>
      )}

      {/* Threads list */}
      <div className="space-y-5">
        <h3 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
          <MessageSquare size={15} className="text-brand-500" />
          <span>Forum Threads ({filteredThreads.length})</span>
        </h3>

        {filteredThreads.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl">
            <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-500 font-medium">No discussion threads found. Be the first to ask!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filteredThreads.map((thread) => (
              <div 
                key={thread.id}
                className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm hover:shadow-md transition-all p-5 space-y-4"
              >
                {/* Thread Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 font-bold text-xs">
                      <User size={16} />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white leading-none">
                        {thread.authorName}
                      </h4>
                      <p className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-1.5 flex items-center gap-1.5">
                        <span>{thread.createdAt}</span>
                        <span>•</span>
                        <span>{thread.lectureTitle}</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Question body */}
                <div className="space-y-1.5 border-l-2 border-brand-500/25 pl-4.5">
                  <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white leading-snug">
                    {thread.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-medium whitespace-pre-wrap">
                    {thread.text}
                  </p>
                </div>

                {/* Replies container */}
                {thread.replies.length > 0 && (
                  <div className="mt-4 bg-gray-50/50 dark:bg-gray-800/10 rounded-2xl p-4 border border-gray-100 dark:border-gray-800/60 divide-y divide-gray-100 dark:divide-gray-800/40 space-y-4">
                    {thread.replies.map((rep) => (
                      <div key={rep.id} className="pt-3.5 first:pt-0">
                        <div className="flex items-center gap-3.5 mb-2.5">
                          <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-bold text-xs ${
                            rep.isInstructor 
                              ? "bg-brand-500 text-white shadow-sm"
                              : "bg-gray-200 dark:bg-gray-800 text-gray-500"
                          }`}>
                            {rep.isInstructor ? "AA" : <User size={13} />}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h5 className="text-xs font-bold text-gray-900 dark:text-white">
                                {rep.authorName}
                              </h5>
                              {rep.isInstructor && (
                                <span className="inline-flex items-center gap-1 rounded-md bg-brand-500 px-1.5 py-0.5 text-[8px] font-bold uppercase text-white shadow-sm shadow-brand-500/20">
                                  <Award size={9} fill="white" />
                                  <span>Instructor</span>
                                </span>
                              )}
                            </div>
                            <p className="text-[9px] text-gray-400 dark:text-gray-500 mt-1 font-bold">{rep.authorRole} • {rep.createdAt}</p>
                          </div>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed pl-11.5 font-medium whitespace-pre-wrap">
                          {rep.text}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Reply Form */}
                <ThreadReplyForm onSubmit={(text) => handleAddReply(thread.id, text)} />

              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

// Thread Reply helper subcomponent
const ThreadReplyForm: React.FC<{ onSubmit: (text: string) => void }> = ({ onSubmit }) => {
  const [replyText, setReplyText] = useState("");
  
  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    onSubmit(replyText);
    setReplyText("");
  };

  return (
    <form onSubmit={handleReplySubmit} className="flex gap-3 pt-3 border-t border-gray-100 dark:border-gray-800/50">
      <input
        type="text"
        placeholder="Type a helpful reply to this thread..."
        value={replyText}
        onChange={(e) => setReplyText(e.target.value)}
        className="flex-1 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 px-3.5 py-2 text-xs font-medium outline-none focus:border-brand-500 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-600"
      />
      <button
        type="submit"
        disabled={!replyText.trim()}
        className="rounded-xl bg-brand-500/10 hover:bg-brand-500 hover:text-white disabled:opacity-40 disabled:hover:bg-brand-500/10 disabled:hover:text-brand-500 text-brand-600 dark:text-brand-400 px-4.5 py-2 text-xs font-bold transition-all"
      >
        Reply
      </button>
    </form>
  );
};

export default DiscussionTab;
