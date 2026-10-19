import { Play, PlayIcon } from 'lucide-react';
import Image from 'next/image';

import type { CourseSummary } from '@/types/course';

interface CourseDetailCardHeaderProps {
  course: CourseSummary;
  onPreview?: () => void;
}

const CourseDetailCardHeader = ({ course, onPreview }: CourseDetailCardHeaderProps) => {
  const thumbnailUrl = course.metadata?.thumbnail_url || `/images/course/${course.slug}.png`;

  return (
    <div 
      onClick={onPreview}
      className={`relative aspect-video w-full overflow-hidden bg-gradient-to-br from-[#071330] via-[#081B4B] to-black group/header flex items-center justify-center select-none ${onPreview ? 'cursor-pointer' : ''}`}
    >
      {thumbnailUrl ? (
        <Image
          src={thumbnailUrl}
          alt={course.title}
          fill
          sizes="(max-width: 1024px) 100vw, 420px"
          className="object-cover transition-transform duration-500 group-hover/header:scale-105"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-950" />
      )}
      
      {/* Dark overlay for contrast */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[0.5px] transition-colors duration-300 group-hover/header:bg-black/20" />

      {/* Dead-center Glowing Play Button */}
      <div className="relative z-10 flex size-14 sm:size-16 shrink-0 items-center justify-center rounded-full bg-white text-blue-600 shadow-[0_0_25px_rgba(37,99,235,0.4)] transition-all duration-300 group-hover/header:scale-110 group-hover/header:shadow-[0_0_35px_rgba(255,255,255,0.6)]">
        <Play className="size-6 sm:size-7 fill-blue-600 text-blue-600 translate-x-0.5" />
      </div>

      {/* Bottom pill matching mockup */}
      <div className="absolute inset-x-0 bottom-0 z-10 p-3 sm:p-4 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-center justify-start pointer-events-none">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md border border-white/20 shadow-sm">
          <PlayIcon className="size-3 fill-white text-white" />
          <span>Preview this course</span>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailCardHeader;

