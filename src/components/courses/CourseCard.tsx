import React from 'react';
import Link from 'next/link';
import { ArrowRight, Calendar, Clock, Star } from 'lucide-react';
import { CourseSummary } from '@/types/course';
import AspectFallbackImage from '@/components/common/AspectFallbackImage';

function formatDuration(meta: CourseSummary['metadata']): string | null {
  if (meta?.duration_hours) return `${meta.duration_hours}h`;
  if (meta?.duration_weeks) return `${meta.duration_weeks} weeks`;
  return null;
}

export function CourseCard({ course, index }: { course: CourseSummary; index: number }) {
  console.log('course card', course);
  const upcoming = course.status === 'upcoming';
  const meta = course.metadata;
  const duration = formatDuration(meta);
  const instructorNames = course.instructors?.map((i) => i.name).join(', ');
  const discount =
    course.original_price > course.price
      ? Math.round(((course.original_price - course.price) / course.original_price) * 100)
      : 0;

  const badge = upcoming ? 'Upcoming' : course.is_popular ? 'Bestseller' : course.is_pro ? 'Pro' : null;

  const cardContent = (
    <div
      className={`group flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white font-(family-name:--font-space-grotesk) shadow-sm transition-all duration-300 dark:border-gray-800 dark:bg-gray-900 ${
        upcoming ? '' : 'hover:shadow-brand-500/10 hover:border-brand-500/30 cursor-pointer hover:shadow-xl'
      }`}
    >
      {/* Thumbnail */}
      <div className="relative">
        <AspectFallbackImage
          src={meta?.thumbnail_url}
          localSrc={`/images/course/${course.slug}.png`}
          alt={`${course.title} thumbnail`}
          title={course.title}
        />
        {badge && (
          <span className="text-brand-700 absolute top-3 left-3 z-20 rounded-md bg-white px-3 py-1.5 text-[11px] font-extrabold tracking-wider uppercase shadow-sm">
            {badge}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col px-5 pt-4 pb-5">
        {course.category && (
          <span className="text-brand-600 dark:text-brand-400 mb-2 text-xs font-extrabold tracking-wider uppercase">
            {course.category}
          </span>
        )}

        <h4 className="mb-1.5 text-lg leading-snug text-gray-900 dark:text-white">{course.title}</h4>

        <div
          className="prose prose-sm prose-gray dark:prose-invert line-clamp-2 max-w-none text-sm leading-relaxed text-neutral-500 dark:text-gray-400"
          dangerouslySetInnerHTML={{ __html: course.description }}
        />

        {instructorNames && <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">By {instructorNames}</p>}

        {/* Meta row */}
        <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-gray-500 dark:text-gray-400">
          {!upcoming && meta?.rating ? (
            <>
              <span className="flex items-center gap-1 font-bold text-amber-600">
                <Star size={14} className="fill-amber-500 text-amber-500" />
                {meta.rating}
              </span>
              {meta.number_of_students ? <span>({meta.number_of_students.toLocaleString()})</span> : null}
            </>
          ) : null}
          {duration && (
            <>
              {!upcoming && meta?.rating ? <span className="text-gray-300 dark:text-gray-700">·</span> : null}
              <span className="flex items-center gap-1">
                <Clock size={14} /> {duration}
              </span>
            </>
          )}
          {meta?.difficulty && (
            <>
              <span className="text-gray-300 dark:text-gray-700">·</span>
              <span className="capitalize">{meta.difficulty}</span>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="mt-auto flex items-end justify-between gap-3 border-t border-gray-100 pt-4 dark:border-gray-800">
          <div className="flex flex-col pt-4">
            <div className="flex items-baseline gap-2">
              {course.price === 0 ? (
                <span className="text-2xl font-extrabold text-emerald-500">Free</span>
              ) : (
                <>
                  <span className="text-2xl font-extrabold text-gray-900 dark:text-white">₹{course.price}</span>
                  {discount > 0 && <span className="text-sm text-gray-400 line-through">₹{course.original_price}</span>}
                </>
              )}
            </div>
            {discount > 0 && (
              <span className="text-brand-600 dark:text-brand-400 mt-1 text-xs font-bold">{discount}% off</span>
            )}
          </div>

          {upcoming ? (
            <span className="flex items-center gap-2 rounded-lg bg-gray-50 px-5 py-3 text-sm font-semibold text-gray-400 select-none dark:bg-gray-800">
              <Calendar size={16} /> Coming soon
            </span>
          ) : (
            <span className="bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 group-hover:bg-brand-500 flex items-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold transition-colors group-hover:text-white">
              View course
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
            </span>
          )}
        </div>
      </div>
    </div>
  );

  if (upcoming) {
    return <div className="block h-full select-none">{cardContent}</div>;
  }

  return (
    <Link href={`/course/${course.slug}`} className="block h-full focus:outline-none">
      {cardContent}
    </Link>
  );
}
