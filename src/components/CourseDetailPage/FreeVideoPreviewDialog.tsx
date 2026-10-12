'use client';

import { AlertCircle, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

import { fetchVideoDetails } from '@/api/videos';
import VideoPlayer from '@/components/learning/VideoPlayer';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import type { CourseSectionItem, VideoLectureDetail } from '@/types/course';

type Props = {
  item: CourseSectionItem | null;
  onClose: () => void;
};

const FreeVideoPreviewDialog = ({ item, onClose }: Props) => {
  const [video, setVideo] = useState<VideoLectureDetail | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!item) return;
    let active = true;
    setVideo(null);
    setError(false);
    fetchVideoDetails(item.asset_id)
      .then((data) => active && setVideo(data))
      .catch(() => active && setError(true));
    return () => {
      active = false;
    };
  }, [item]);

  return (
    <Dialog open={!!item} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl gap-3 p-4 sm:p-5">
        <DialogTitle className="pr-6 text-base font-semibold text-gray-900 dark:text-white">
          {item?.title}
        </DialogTitle>
        <DialogDescription className="sr-only">Free preview of this lecture</DialogDescription>
        {error ? (
          <div className="flex aspect-video flex-col items-center justify-center gap-2 rounded-xl bg-gray-50 text-sm text-gray-500 dark:bg-gray-900">
            <AlertCircle className="size-5 text-red-500" />
            Could not load this preview.
          </div>
        ) : video ? (
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
