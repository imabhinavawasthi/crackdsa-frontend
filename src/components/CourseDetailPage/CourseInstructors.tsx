import Image from 'next/image';

import type { Instructor } from '@/types/course';

const initials = (name: string) =>
  name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

const CourseInstructors = ({ instructors }: { instructors: Instructor[] }) => {
  if (instructors.length === 0) return null;

  return (
    <section>
      <h2 className="text-2xl font-bold text-gray-900">
        {instructors.length > 1 ? 'Meet your instructors' : 'Meet your instructor'}
      </h2>
      <div className="mt-5 space-y-6">
        {instructors.map((instructor) => {
          const avatar = instructor.avatar_url ?? instructor.profile_image_url;
          return (
            <div key={instructor.id} className="flex gap-4">
              {avatar ? (
                <Image
                  src={avatar}
                  alt={instructor.name}
                  width={64}
                  height={64}
                  className="size-16 shrink-0 rounded-full object-cover"
                />
              ) : (
                <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-brand-100 text-lg font-semibold text-brand-600">
                  {initials(instructor.name)}
                </div>
              )}
              <div>
                <p className="text-lg font-bold text-gray-900">{instructor.name}</p>
                {instructor.company && (
                  <p className="text-sm font-medium text-brand-600">{instructor.company}</p>
                )}
                {instructor.bio && <p className="mt-2 text-sm leading-6 text-gray-600">{instructor.bio}</p>}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default CourseInstructors;
