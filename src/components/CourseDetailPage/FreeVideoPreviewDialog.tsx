'use client';

import { AlertCircle, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

import { fetchVideoDetails } from '@/api/videos';
import VideoPlayer from '@/components/learning/VideoPlayer';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import type { CourseSectionItem, VideoLectureDetail } from '@/types/course';

type Props = {
  item: CourseSectionItem | null;
  courseSlug?: string;
  promoVideoUrl?: string | null;
  courseTitle?: string;
  onClose: () => void;
};

const FreeVideoPreviewDialog = ({ item, courseSlug, promoVideoUrl, courseTitle, onClose }: Props) => {
  const [video, setVideo] = useState<VideoLectureDetail | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const isPromoDirect = !item && Boolean(promoVideoUrl);
  const isOpen = Boolean(item || promoVideoUrl);

  useEffect(() => {
    if (!isOpen) return;

    if (item) {
      let active = true;
      setVideo(null);
      setError(false);
      setLoading(true);
      fetchVideoDetails(item.asset_id, { itemId: item.id, courseSlug })
        .then((data) => {
          if (active) {
            setVideo(data);
            setLoading(false);
          }
        })
        .catch(() => {
          if (active) {
            // If fetching lecture details fails and there is a promo video, fall back to promo video
            if (promoVideoUrl) {
              setVideo({
                id: 'promo',
                title: courseTitle ? `${courseTitle} - Course Preview` : 'Course Preview',
                video_url: promoVideoUrl,
              });
              setLoading(false);
            } else {
              setError(true);
              setLoading(false);
            }
          }
        });
      return () => {
        active = false;
      };
    } else if (promoVideoUrl) {
      setVideo({
        id: 'promo',
        title: courseTitle ? `${courseTitle} - Course Preview` : 'Course Preview',
        video_url: promoVideoUrl,
      });
      setError(false);
      setLoading(false);
    }
  }, [item, courseSlug, promoVideoUrl, courseTitle, isOpen]);

  const dialogTitle = item?.title || (courseTitle ? `${courseTitle} • Preview` : 'Course Preview');

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl gap-3 p-4 sm:p-5">
        <DialogTitle className="pr-6 text-base font-bold text-gray-900 dark:text-white">
          {dialogTitle}
        </DialogTitle>
        <DialogDescription className="sr-only">Free preview of this course</DialogDescription>
        {error ? (
          <div className="flex aspect-video flex-col items-center justify-center gap-2 rounded-xl bg-gray-50 text-sm text-gray-500 dark:bg-gray-900">
            <AlertCircle className="size-5 text-red-500" />
            Could not load this preview video.
          </div>
        ) : loading ? (
          <div className="flex aspect-video items-center justify-center rounded-xl bg-gray-50 dark:bg-gray-900">
            <Loader2 className="size-6 animate-spin text-gray-400" />
          </div>
        ) : video?.video_url ? (
          <VideoPlayer url={video.video_url} title={video.title} thumbnailUrl={video.thumbnail_url} />
        ) : (
          <div className="flex aspect-video items-center justify-center rounded-xl bg-gray-50 dark:bg-gray-900">
            <Loader2 className="size-6 animate-spin text-gray-400" />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default FreeVideoPreviewDialog;
