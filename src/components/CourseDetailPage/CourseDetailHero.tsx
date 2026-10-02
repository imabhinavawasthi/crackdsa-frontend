import { ChevronRight, Star } from 'lucide-react';
import Link from 'next/link';

import type { CourseSummary } from '@/types/course';
import { formatDate, stripHtml } from './courseDetailUtils';

const CourseDetailHero = ({ course }: { course: CourseSummary }) => {
  const rating = course.metadata?.rating;
  const reviews = course.metadata?.reviews as number | undefined;
  const students = course.metadata?.number_of_students;
  const updated = formatDate(course.updated_at);
  const instructors = course.instructors ?? [];

  return (
    <div className="lg:bg-brand-950 bg-white text-gray-900 lg:text-white">
      <div className="mx-auto max-w-6xl px-4 py-6 lg:py-10 lg:pr-104 lg:pb-14">
        <h1 className="mt-4 text-2xl leading-tight font-bold sm:text-3xl lg:text-4xl">{course.title}</h1>
        <p className="lg:text-brand-100 mt-4 line-clamp-3 text-base text-gray-600 lg:text-lg">
          {stripHtml(course.description)}
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
          {rating != null && (
            <span className="flex items-center gap-1.5">
              <span className="lg:text-blue-light-300 font-semibold text-amber-700">{rating}</span>
              <span className="flex">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    className={`size-4 ${i < Math.round(rating) ? 'lg:fill-blue-light-300 lg:text-blue-light-300 fill-amber-400 text-amber-400' : 'lg:text-brand-700 text-gray-300'}`}
                  />
                ))}
              </span>
              {reviews != null && (
                <span className="lg:text-brand-200 text-gray-600 underline">{reviews.toLocaleString()} ratings</span>
              )}
            </span>
          )}
          {students != null && (
            <span className="lg:text-brand-200 text-gray-600">{students.toLocaleString()} learners</span>
          )}
        </div>

        <p className="lg:text-brand-200 mt-3 flex flex-wrap gap-x-3 text-sm text-gray-600">
          {instructors.length > 0 && (
            <span>
              Created by <span className="underline">{instructors.map((i) => i.name).join(', ')}</span>
            </span>
          )}
          {updated && <span>Last updated {updated}</span>}
          <span>English</span>
        </p>
      </div>
    </div>
  );
};

export default CourseDetailHero;
