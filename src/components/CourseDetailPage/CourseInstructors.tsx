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
  const hasAbhinav = instructors.some((i) => 
    i.name?.toLowerCase().includes('abhinav') || i.name?.toLowerCase().includes('awasthi')
  );

  const otherInstructors = instructors.filter((i) => 
    !i.name?.toLowerCase().includes('abhinav') && !i.name?.toLowerCase().includes('awasthi')
  );

  return (
    <section className="space-y-6">
      {/* Primary Abhinav Awasthi Detailed Card */}
      <AbhinavAwasthiCard showTitle={true} />

      {/* Other Instructors if any */}
      {otherInstructors.length > 0 && (
        <div className="space-y-4 pt-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Co-Instructors & Mentors
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {otherInstructors.map((instructor) => {
              const avatar = instructor.avatar_url ?? instructor.profile_image_url;
              return (
                <div 
                  key={instructor.id || instructor.name} 
                  className="flex items-center gap-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-xs"
                >
                  {avatar ? (
                    <Image
                      src={avatar}
                      alt={instructor.name}
                      width={56}
                      height={56}
                      className="size-14 shrink-0 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 text-base font-bold text-blue-600 dark:text-blue-400">
                      {initials(instructor.name)}
                    </div>
                  )}
                  <div>
                    <p className="text-base font-bold text-gray-900 dark:text-white">{instructor.name}</p>
                    {(instructor.role || instructor.company) && (
                      <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                        {[instructor.role, instructor.company].filter(Boolean).join(' @ ')}
                      </p>
                    )}
                    {instructor.bio && <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{instructor.bio}</p>}
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
