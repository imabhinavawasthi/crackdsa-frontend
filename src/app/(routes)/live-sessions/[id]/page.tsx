"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, 
  Clock, 
  ArrowLeft, 
  Video, 
  FileText, 
  ExternalLink, 
  BookOpen,
  Activity,
  FolderDown,
  Lock,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { LiveClass } from "@/types/live-class";
import { fetchLiveClassDetail } from "@/api/live-classes";
import { formatClassDateTime, createGoogleCalendarUrl } from "@/components/live-classes/calendarUtils";
import VideoPlayer from "@/components/learning/VideoPlayer";
import StatusSelector from "@/components/learning/StatusSelector";
import BookmarkButton from "@/components/learning/BookmarkButton";
import NotesTab from "@/components/learning/NotesTab";
import { decryptMediaUrl } from "@/functions/mediaSecurity";

function formatDuration(mins?: number | null): string {
  if (!mins || mins <= 0) return "60 mins";
  const hours = Math.floor(mins / 60);
  const remaining = mins % 60;
  if (hours > 0 && remaining > 0) return `${hours}h ${remaining}m`;
  if (hours > 0) return `${hours} hr${hours > 1 ? "s" : ""}`;
  return `${mins} mins`;
}

type StudyTabType = "overview" | "notes" | "resources";

export default function LiveClassDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [classItem, setClassItem] = useState<LiveClass | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeTab, setActiveTab] = useState<StudyTabType>("overview");
  const [decryptedClassLink, setDecryptedClassLink] = useState("");

  useEffect(() => {
    let active = true;
    if (classItem?.class_link && classItem.class_link.startsWith("enc:v1:")) {
      decryptMediaUrl(classItem.class_link).then((dec) => {
        if (active) setDecryptedClassLink(dec);
      });
    }
    return () => {
      active = false;
    };
  }, [classItem?.class_link]);

  const activeClassLink = decryptedClassLink || (classItem?.class_link && !classItem.class_link.startsWith("enc:v1:") ? classItem.class_link : "");

  useEffect(() => {
    if (!id) return;
    let isMounted = true;

    fetchLiveClassDetail(id)
      .then((data) => {
        if (isMounted) {
          setClassItem(data);
          if (data?.class_name) {
            document.title = `${data.class_name} | crackDSA`;
          }
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Error loading live class detail:", err);
        if (isMounted) {
          setError(true);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="w-full max-w-5xl mx-auto py-8 space-y-6">
        <div className="w-32 h-6 bg-slate-200 dark:bg-slate-800 rounded-md animate-pulse" />
        <div className="w-full h-16 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl animate-pulse" />
        <div className="w-full aspect-video bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-3xl animate-pulse" />
      </div>
    );
  }

  if (error || !classItem) {
    return (
      <div className="w-full max-w-xl mx-auto py-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
          <BookOpen size={24} />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Lecture Not Found</h2>
        <p className="text-sm text-slate-500">
          The requested live session could not be found or is not currently available.
        </p>
        <Link
          href="/live-sessions"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 cursor-pointer"
        >
          <ArrowLeft size={14} />
          <span>Back to Live Sessions</span>
        </Link>
      </div>
    );
  }

  const { dateLabel, timeRangeLabel } = formatClassDateTime(
    classItem.class_time_epoch ?? undefined,
    classItem.class_duration ?? 60
  );

  const googleCalUrl = createGoogleCalendarUrl(
    classItem.class_name,
    classItem.class_time_epoch ?? undefined,
    classItem.class_duration ?? 60,
    classItem.class_name,
    activeClassLink || "CrackDSA Live"
  );

  const isLive = classItem.status === "live";
  const isUpcoming = classItem.status === "upcoming";
  const isCompleted = classItem.status === "completed";
  const isLocked = Boolean(classItem.is_locked);
  const isFree = classItem.visibility === "free";
  const subtopics = classItem.class_subtopics || [];

  return (
    <div className="w-full max-w-5xl mx-auto py-6 space-y-5">
      {/* 1. Breadcrumb / Back button */}
      <div>
        <Link
          href="/live-sessions"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors uppercase tracking-wider"
        >
          <ArrowLeft size={14} />
          <span>Back to Live Sessions</span>
        </Link>
      </div>

      {/* 2. Video Action Bar (Directly matching Course Classroom UI) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-2xl p-4 shadow-xs z-20 relative">
        <div className="flex items-center gap-3">
          <StatusSelector
            assetId={classItem.id}
            assetType="video"
            disabledTitle="Log in to track progress"
          />
          <BookmarkButton
            assetId={classItem.id}
            assetType="video"
            disabledTitle="Log in to bookmark"
          />
        </div>

        {/* Live session status badge & title */}
        <div className="flex items-center gap-2 flex-wrap">
          {isFree ? (
            <span className="px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60 text-[10px] font-black uppercase tracking-wider">
              FREE SESSION
            </span>
          ) : isLocked ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/60 text-[10px] font-black uppercase tracking-wider">
              <Lock size={10} />
              PRO REQUIRED
            </span>
          ) : null}

          {isLive && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-600 text-white text-[10px] font-black uppercase tracking-wider shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
              LIVE NOW
            </span>
          )}
          {isUpcoming && (
            <span className="px-2.5 py-1 rounded-md bg-blue-600 text-white text-[10px] font-black uppercase tracking-wider">
              UPCOMING
            </span>
          )}
          {isCompleted && (
            <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-black uppercase tracking-wider">
              COMPLETED
            </span>
          )}

          {classItem.class_topic && (
            <span className="px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-wider">
              {classItem.class_topic}
            </span>
          )}

          <div className="text-xs text-slate-600 dark:text-slate-300 font-bold truncate max-w-xs sm:max-w-sm hidden md:block">
            {classItem.class_name}
          </div>
        </div>
      </div>

      {/* 3. Main Visual Media Player Stage (Course VideoPlayer Container) */}
      <div className="relative rounded-3xl overflow-hidden bg-gray-50 dark:bg-gray-800/10 p-0 sm:p-2 border border-gray-200 dark:border-gray-800/60 shadow-inner">
        {isLocked ? (
          <div className="w-full aspect-video rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 border border-amber-500/20 flex flex-col items-center justify-center p-6 sm:p-10 space-y-4 text-center relative overflow-hidden shadow-2xl">
            {/* Ambient glows */}
            <div className="absolute -top-16 -right-16 size-48 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 size-48 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

            <div className="relative size-14 sm:size-16 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/10">
              <Lock size={28} />
            </div>

            <div className="space-y-1.5 max-w-md relative z-10">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 text-[10px] font-black tracking-wider uppercase">
                <Sparkles size={11} />
                <span>CrackDSA Pro Exclusive</span>
              </div>
              <h3 className="text-lg sm:text-2xl font-black text-white tracking-tight">
                Pro Membership Required
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                This session recording, source code, and comprehensive lecture notes are reserved for CrackDSA Pro members.
              </p>
            </div>

            <div className="pt-2 relative z-10 flex flex-col sm:flex-row items-center gap-3">
              <Link
                href="/pro"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs sm:text-sm font-black shadow-lg shadow-amber-500/25 hover:shadow-amber-500/35 transition-all cursor-pointer"
              >
                <Lock size={14} />
                <span>Unlock Recording with Pro</span>
                <ArrowRight size={14} />
              </Link>
              <span className="text-[11px] text-slate-400 font-medium">
                Less than ₹10/day • 1-click cancel
              </span>
            </div>
          </div>
        ) : classItem.class_recording ? (
          <VideoPlayer
            url={classItem.class_recording}
            title={classItem.class_name}
            thumbnailUrl={classItem.thumbnail_url || classItem.class_image || undefined}
          />
        ) : (
          <div className="w-full aspect-video rounded-2xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center p-8 space-y-3 text-center text-slate-400">
            <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-400 flex items-center justify-center">
              <Video size={24} />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm sm:text-base font-bold text-white">
                Recording Processing
              </h4>
              <p className="text-xs text-slate-400 max-w-sm">
                The recording for this session is being uploaded and will be available to watch here once ready.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 4. Actionable Bottom Study Tabs Panel (Course Classroom Tabs UI) */}
      <div className="space-y-5">
        {/* Tab switcher buttons */}
        <div className="flex bg-gray-50/50 dark:bg-gray-900/40 p-1.5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xs shrink-0 relative">
          {([
            { id: "overview", label: "Lecture Details", icon: <Activity size={14} /> },
            { id: "notes", label: "Notes", icon: <FileText size={14} /> },
            { id: "resources", label: "Resources", icon: <FolderDown size={14} /> }
          ] as const).map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold uppercase tracking-wider transition-colors duration-200 select-none cursor-pointer relative z-10 ${
                  isActive 
                    ? "text-white" 
                    : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeLiveTab"
                    className="absolute inset-0 bg-blue-600 rounded-xl shadow-xs"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{tab.icon}</span>
                <span className="relative z-10">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab content viewer */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 sm:p-7 min-h-[220px] shadow-xs">
          <AnimatePresence mode="wait">
            {/* Tab 1: Lecture Details Overview */}
            {activeTab === "overview" && (
              <motion.div
                key="tab-overview"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="space-y-6"
              >
                {/* Title & Topic description */}
                <div className="space-y-2">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    {classItem.class_name}
                  </h2>
                  {subtopics.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">
                        Topics Covered:
                      </span>
                      {subtopics.map((t) => (
                        <span
                          key={t}
                          className="px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="h-[1px] bg-slate-100 dark:bg-gray-800/80" />

                {/* Instructor & Metadata Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  {/* Instructor Spotlight */}
                  <div className="flex items-center gap-3.5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-black text-xs shadow-xs">
                      {(classItem.instructor_name || "Lead Instructor")
                        .split(" ")
                        .map((w) => w[0])
                        .join("")
                        .substring(0, 2)}
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                        Instructor
                      </span>
                      <h5 className="text-sm font-bold text-slate-900 dark:text-white leading-none">
                        {classItem.instructor_name || "Lead Instructor"}
                      </h5>
                    </div>
                  </div>

                  {/* Scheduled Date & Time */}
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center shrink-0">
                      <Calendar size={18} />
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                        Date &amp; Time
                      </span>
                      <h5 className="text-sm font-bold text-slate-900 dark:text-white leading-none">
                        {dateLabel}
                      </h5>
                      <p className="text-[11px] text-slate-500 font-medium">
                        {timeRangeLabel}
                      </p>
                    </div>
                  </div>

                  {/* Duration */}
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center shrink-0">
                      <Clock size={18} />
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                        Session Length
                      </span>
                      <h5 className="text-sm font-bold text-slate-900 dark:text-white leading-none">
                        {formatDuration(classItem.class_duration)}
                      </h5>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Tab 2: Notes (Directly reusing unified NotesTab from courses) */}
            {activeTab === "notes" && (
              <motion.div
                key="tab-notes"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
              >
                <NotesTab
                  courseId="live-sessions"
                  itemId={classItem.id}
                  assetType="video"
                />
              </motion.div>
            )}

            {/* Tab 3: Official Resources & Live Join (NEVER direct video links) */}
            {activeTab === "resources" && (
              <motion.div
                key="tab-resources"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Official Notes / Docs */}
                  {isLocked ? (
                    <div className="p-5 rounded-2xl bg-slate-50 dark:bg-gray-800/40 border border-slate-150 dark:border-gray-800 flex flex-col justify-between space-y-3">
                      <div className="space-y-1.5">
                        <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center">
                          <Lock size={18} />
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                          Official Class Notes &amp; Code
                        </h4>
                        <p className="text-xs text-slate-500">
                          Handout notes, problem lists, and code templates are exclusively available for CrackDSA Pro members.
                        </p>
                      </div>

                      <Link
                        href="/pro"
                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 transition-colors shadow-xs cursor-pointer"
                      >
                        <Lock size={13} />
                        <span>Unlock Notes with Pro</span>
                      </Link>
                    </div>
                  ) : classItem.class_notes ? (
                    <div className="p-5 rounded-2xl bg-slate-50 dark:bg-gray-800/40 border border-slate-150 dark:border-gray-800 flex flex-col justify-between space-y-3">
                      <div className="space-y-1.5">
                        <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center">
                          <FileText size={18} />
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                          Official Class Notes &amp; Code
                        </h4>
                        <p className="text-xs text-slate-500">
                          Handout notes, problem lists, and code templates from the session.
                        </p>
                      </div>

                      <a
                        href={classItem.class_notes}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 hover:bg-slate-100 transition-colors cursor-pointer"
                      >
                        <span>Open Document</span>
                        <ExternalLink size={13} />
                      </a>
                    </div>
                  ) : null}

                  {/* Live Join Link / Calendar (for upcoming or live) */}
                  {!isCompleted && (
                    <div className="p-5 rounded-2xl bg-slate-50 dark:bg-gray-800/40 border border-slate-150 dark:border-gray-800 flex flex-col justify-between space-y-3">
                      <div className="space-y-1.5">
                        <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center">
                          <Calendar size={18} />
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                          {isLive ? "Live Meeting" : "Join & Calendar"}
                        </h4>
                        <p className="text-xs text-slate-500">
                          {isLive
                            ? "Session is active. Join live to ask questions."
                            : "Add to your Google Calendar to get notified."}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {isLocked ? (
                          <Link
                            href="/pro"
                            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 transition-colors shadow-xs cursor-pointer"
                          >
                            <Lock size={12} />
                            <span>Join Live (Pro Only)</span>
                          </Link>
                        ) : activeClassLink ? (
                          <a
                            href={activeClassLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-xs cursor-pointer"
                          >
                            <span>Join Meeting</span>
                            <ExternalLink size={12} />
                          </a>
                        ) : null}
                        <a
                          href={googleCalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 transition-colors cursor-pointer"
                        >
                          <span>Add to Calendar</span>
                        </a>
                      </div>
                    </div>
                  )}

                  {!classItem.class_notes && !isLocked && isCompleted && (
                    <div className="col-span-full py-8 text-center text-xs text-slate-400">
                      No additional downloadable resources attached to this recorded session.
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
