'use client';

import Image from 'next/image';
import type { Instructor } from '@/types/course';
import { AbhinavAwasthiCard } from '@/components/instructors/AbhinavAwasthiCard';

const initials = (name: string) =>
  name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

interface CourseInstructorsProps {
  instructors: Instructor[];
}

export default function CourseInstructors({ instructors }: CourseInstructorsProps) {
  if (!instructors || instructors.length === 0) {
    return null;
  }

  const hasAbhinav = instructors.some((i) => {
    const name = (i.name || '').toLowerCase();
    return name.includes('abhinav') || name.includes('awasthi');
  });

  const otherInstructors = instructors.filter((i) => {
    const name = (i.name || '').toLowerCase();
    return !name.includes('abhinav') && !name.includes('awasthi');
  });

  return (
    <section className="space-y-6">
      {/* Abhinav Awasthi Card - ONLY shown if Abhinav Awasthi is in the course instructors list */}
      {hasAbhinav && <AbhinavAwasthiCard showTitle={true} />}

      {/* Other Instructors / Mentors from API */}
      {otherInstructors.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            {hasAbhinav ? "Co-Instructors & Mentors" : "Meet your instructor"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {otherInstructors.map((instructor) => {
              const avatar = instructor.avatar_url ?? instructor.profile_image_url;
              return (
                <div 
                  key={instructor.id || instructor.name} 
                  className="flex items-start gap-4 rounded-2xl border border-gray-200/80 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-xs transition-colors"
                >
                  {avatar ? (
                    <Image
                      src={avatar}
                      alt={instructor.name}
                      width={64}
                      height={64}
                      className="size-16 shrink-0 rounded-2xl object-cover border border-gray-100 dark:border-gray-800"
                    />
                  ) : (
                    <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 text-lg font-bold text-blue-600 dark:text-blue-400">
                      {initials(instructor.name || 'Instructor')}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{instructor.name}</p>
                    {(instructor.role || instructor.company) && (
                      <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mt-0.5">
                        {[instructor.role, instructor.company].filter(Boolean).join(' @ ')}
                      </p>
                    )}
                    {instructor.bio && (
                      <p className="mt-2 text-xs text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-3">
                        {instructor.bio}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
