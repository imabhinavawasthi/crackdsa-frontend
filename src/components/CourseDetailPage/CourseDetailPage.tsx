import { CourseSummary, CourseSection } from '@/types/course';
import CourseDetailCard from './CourseDetailCard/CourseDetailCard';
import CourseDetailCardBody from './CourseDetailCard/CourseDetailCardBody';
import CourseDetailCardHeader from './CourseDetailCard/CourseDetailCardHeader';
import CourseCurriculum from './CourseCurriculum';
import CourseDetailHero from './CourseDetailHero';
import CourseInstructors from './CourseInstructors';
import WhatWillYouLearn from './WhatWillYouLearn';
import { getCourseIncludes, stripHtml, toStringList } from './courseDetailUtils';

interface CourseDetailPageProps {
  course: CourseSummary;
  curriculum: CourseSection[];
}

const Divider = () => <hr className="border-gray-200" />;

const CourseDetailPage = ({ course, curriculum }: CourseDetailPageProps) => {
  console.log('curriculum', curriculum[1]?.items);
  console.log('curriculum', curriculum[1]?.subsections);
  const outcomes = toStringList(course.metadata?.learning_outcomes);
  const prerequisites = toStringList(course.metadata?.prerequisites);
  const includes = getCourseIncludes(course);
  const tags = course.tags ?? [];

  return (
    <div className="bg-brand-25/40 relative">
      {/* Mobile: thumbnail first, then title block, then purchase options */}
      <div className="lg:hidden">
        <CourseDetailCardHeader course={course} />
      </div>

      <CourseDetailHero course={course} />

      <div className="px-4 pt-2 pb-2 lg:hidden">
        <h2 className="text-xl font-bold text-gray-900">Purchase options</h2>
        <div className="mt-3 rounded-lg border border-gray-200 bg-white">
          <CourseDetailCardBody course={course} />
        </div>
      </div>

      {/* Desktop: card floats over the hero */}
      <div className="hidden lg:pointer-events-none lg:absolute lg:inset-x-0 lg:top-0 lg:z-10 lg:block lg:pt-28">
        <div className="mx-auto flex max-w-6xl justify-end">
          <div className="pointer-events-auto w-full lg:w-90">
            <CourseDetailCard course={course} />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl space-y-10 px-4 py-10 lg:pr-104">
        <WhatWillYouLearn outcomes={outcomes} />
        {outcomes.length > 0 && <Divider />}

        {/* {tags.length > 0 && (
          <>
            <section>
              <h2 className="text-2xl font-bold text-gray-900">Explore the toolkit</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="border-brand-200 bg-brand-50 text-brand-700 rounded-full border px-4 py-1.5 text-xs font-medium capitalize"
                  >
                    {tag.replace(/-/g, ' ')}
                  </span>
                ))}
              </div>
            </section>
            <Divider />
          </>
        )} */}

        <section>
          <h2 className="text-2xl font-bold text-gray-900">This course includes</h2>
          <ul className="mt-5 grid gap-5 sm:grid-cols-2">
            {includes.map(({ title, subtitle }) => (
              <li key={title}>
                <p className="text-sm font-semibold text-gray-900">{title}</p>
                <p className="text-xs text-gray-500">{subtitle}</p>
              </li>
            ))}
          </ul>
        </section>
        <Divider />

        <section>
          <h2 className="text-2xl font-bold text-gray-900">About this course</h2>
          <p className="mt-3 text-sm leading-7 text-gray-600">{stripHtml(course.description)}</p>
        </section>

        {prerequisites.length > 0 && (
          <>
            <Divider />
            <section>
              <h2 className="text-2xl font-bold text-gray-900">Prerequisites</h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-7 text-gray-600 marker:text-gray-400">
                {prerequisites.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </section>
          </>
        )}

        {curriculum.length > 0 && (
          <>
            <Divider />
            <CourseCurriculum curriculum={curriculum} />
          </>
        )}

        {course.instructors && course.instructors.length > 0 && (
          <>
            <Divider />
            <CourseInstructors instructors={course.instructors} />
          </>
        )}
      </div>
    </div>
  );
};

export default CourseDetailPage;
