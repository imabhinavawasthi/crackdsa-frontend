import { CourseSummary, CourseSection } from '@/types/course';
import CourseDetailCard from './CourseDetailCard/CourseDetailCard';
import CourseCertificate from './CourseCertificate';
import CourseCurriculum from './CourseCurriculum';
import CourseDetailHero from './CourseDetailHero';
import CourseInstructors from './CourseInstructors';
import WhatWillYouLearn from './WhatWillYouLearn';
import AboutThisCourse from './AboutThisCourse';
import CoursePrerequisites from './CoursePrerequisites';
import { getCourseIncludes, toStringList } from './courseDetailUtils';

interface CourseDetailPageProps {
  course: CourseSummary;
  curriculum: CourseSection[];
}

const Divider = () => <hr className="border-gray-200 dark:border-gray-800" />;

export default function CourseDetailPage({ course, curriculum }: CourseDetailPageProps) {
  const outcomes = toStringList(course.metadata?.learning_outcomes);
  const includes = getCourseIncludes(course);

  return (
    <div className="relative bg-white dark:bg-[#070B14] min-h-screen text-gray-900 dark:text-gray-100 transition-colors">
      {/* 1. Hero Section with perfectly aligned desktop floating card */}
      <CourseDetailHero 
        course={course} 
        curriculum={curriculum} 
        card={<CourseDetailCard course={course} curriculum={curriculum} />}
      />

      {/* Mobile: Card rendered right below hero */}
      <div className="px-4 py-6 lg:hidden">
        <CourseDetailCard course={course} curriculum={curriculum} />
      </div>

      {/* 2. Top Sales Section: Features on Left alongside the floating card */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Left Column Area: What you'll learn & This course includes */}
        <div className="lg:max-w-[calc(100%-420px)] xl:max-w-[calc(100%-450px)] space-y-10">
          <WhatWillYouLearn outcomes={outcomes} />

          {outcomes.length > 0 && <Divider />}

          {includes.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">This course includes</h2>
              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {includes.map(({ title, subtitle, icon: Icon }) => (
                  <div
                    key={title}
                    className="flex items-center gap-3.5 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900/80 p-4 shadow-xs"
                  >
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                      <Icon className="size-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">{title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{subtitle}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Divider />
      </div>

      {/* 3. Main 2-Column Section (About + Prerequisites on Left, Curriculum on Right) */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left Column: About this course + Prerequisites */}
          <div className="space-y-8">
            <AboutThisCourse course={course} />
            <CoursePrerequisites course={course} />
          </div>

          {/* Right Column: Course Curriculum */}
          <div>
            <CourseCurriculum curriculum={curriculum} />
          </div>
        </div>
      </div>

      {/* 4. Bottom Section: Certificate & Instructors */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16 space-y-10">
        <Divider />
        <CourseCertificate />

        <Divider />
        <CourseInstructors instructors={course.instructors || []} />
      </div>
    </div>
  );
}
