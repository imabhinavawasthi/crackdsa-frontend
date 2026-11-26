'use client';

import { useState } from 'react';
import type { CourseSection, CourseSectionItem, CourseSummary } from '@/types/course';
import CourseDetailCardBody from './CourseDetailCardBody';
import CourseDetailCardHeader from './CourseDetailCardHeader';
import FreeVideoPreviewDialog from '../FreeVideoPreviewDialog';

interface CourseDetailCardProps {
  course: CourseSummary;
  curriculum?: CourseSection[];
}

export default function CourseDetailCard({ course, curriculum = [] }: CourseDetailCardProps) {
  const [previewItem, setPreviewItem] = useState<CourseSectionItem | null>(null);
  const [showPromoPreview, setShowPromoPreview] = useState(false);

  // Check if course has a promo/teaser video URL (YouTube, Drive, etc.)
  const promoVideoUrl = course.metadata?.promo_video_url || (course as any).promo_video_url || null;

  // Find the first free video in curriculum for course preview
  const firstFreeVideo = curriculum
    .flatMap((section) => [
      ...(section.items ?? []),
      ...(section.subsections ?? []).flatMap((sub) => sub.items ?? []),
    ])
    .find((item) => item.type === 'video' && item.is_free);

  const canPreview = Boolean(promoVideoUrl || firstFreeVideo);

  const handlePreview = () => {
    if (promoVideoUrl) {
      setShowPromoPreview(true);
    } else if (firstFreeVideo) {
      setPreviewItem(firstFreeVideo);
    }
  };

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-gray-200/90 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-2xl dark:shadow-black/60 transition-colors">
        <CourseDetailCardHeader 
          course={course} 
          onPreview={canPreview ? handlePreview : undefined} 
        />
        <CourseDetailCardBody course={course} />
      </div>

      <FreeVideoPreviewDialog 
        item={previewItem} 
        promoVideoUrl={showPromoPreview ? promoVideoUrl : null}
        courseTitle={course.title}
        courseSlug={course.slug} 
        onClose={() => {
          setPreviewItem(null);
          setShowPromoPreview(false);
        }} 
      />
    </>
  );
}

