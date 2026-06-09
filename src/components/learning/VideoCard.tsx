"use client";

import React from "react";
import { Clock, Video } from "lucide-react";
import VideoPlayer from "./VideoPlayer";
import { VideoLectureDetail } from "@/api/videos";

interface VideoCardProps {
  video: VideoLectureDetail;
}

const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
  return (
    <div className="space-y-5 w-full">

      {/* 1. Video Embed — thumbnail shown until user clicks play */}
      <div className="rounded-2xl overflow-hidden aspect-video border border-gray-200 dark:border-gray-800 shadow-inner bg-black">
        <VideoPlayer
          url={video.video_url}
          title={video.title}
          thumbnailUrl={video.thumbnail_url}
        />
      </div>

      {/* 2. Title + Duration row */}
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
          <Video size={16} className="text-brand-500 shrink-0 mt-0.5" />
          <span>{video.title}</span>
        </h3>

        {video.duration_label && (
          <span className="shrink-0 text-[10px] font-bold text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-2.5 py-1 rounded-lg flex items-center gap-1.5 mt-0.5">
            <Clock size={11} />
            {video.duration_label}
          </span>
        )}
      </div>

      {/* 3. Description — rendered as HTML */}
      {video.description && (
        <div
          className="
            text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-medium
            prose prose-sm dark:prose-invert max-w-none
            prose-p:my-2
            prose-ul:my-2 prose-ul:pl-5 prose-ul:list-disc
            prose-ol:my-2 prose-ol:pl-5 prose-ol:list-decimal
            prose-li:my-0.5
            prose-strong:text-gray-800 dark:prose-strong:text-gray-200 prose-strong:font-bold
            prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-[12px] prose-code:font-mono prose-code:text-brand-600 dark:prose-code:text-brand-400 prose-code:before:content-none prose-code:after:content-none
            prose-a:text-brand-600 dark:prose-a:text-brand-400 prose-a:font-semibold prose-a:no-underline hover:prose-a:underline
            prose-h1:text-base prose-h1:font-bold prose-h1:text-gray-900 dark:prose-h1:text-white
            prose-h2:text-sm prose-h2:font-bold prose-h2:text-gray-900 dark:prose-h2:text-white
            prose-h3:text-xs prose-h3:font-bold prose-h3:text-gray-800 dark:prose-h3:text-gray-200
            prose-blockquote:border-l-4 prose-blockquote:border-brand-500/40 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-500
          "
          dangerouslySetInnerHTML={{ __html: video.description }}
        />
      )}
    </div>
  );
};

export default VideoCard;
