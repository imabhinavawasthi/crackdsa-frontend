import { PlayIcon } from 'lucide-react';
import Image from 'next/image';

import type { CourseSummary } from '@/types/course';

interface CourseDetailCardHeaderProps {
  course: CourseSummary;
}

const CourseDetailCardHeader = ({ course }: CourseDetailCardHeaderProps) => {
  const thumbnailUrl = course.metadata?.thumbnail_url;

  return (
    <div className="relative aspect-video w-full overflow-hidden bg-linear-to-br from-brand-900 to-brand-950">
      {thumbnailUrl && (
        <Image
          src={thumbnailUrl}
          alt={course.title}
          fill
          sizes="(max-width: 1024px) 100vw, 360px"
          className="object-cover"
        />
      )}
      <div className="absolute inset-0 flex flex-col-reverse items-center justify-center gap-2 bg-black/30 p-4 lg:inset-x-0 lg:top-auto lg:bottom-0 lg:flex-row lg:items-end lg:justify-between lg:gap-3 lg:bg-linear-to-t lg:from-black/60 lg:to-transparent">
        <p className="font-semibold text-white lg:text-lg">Preview this course</p>
        <span className="flex size-16 shrink-0 lg:size-11 items-center justify-center rounded-full bg-white text-brand-600">
          <PlayIcon className="size-6 fill-current lg:size-5" />
        </span>
      </div>
    </div>
  );
};

export default CourseDetailCardHeader;
