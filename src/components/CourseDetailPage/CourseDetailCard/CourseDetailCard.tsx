import type { CourseSummary } from '@/types/course';
import CourseDetailCardBody from './CourseDetailCardBody';
import CourseDetailCardHeader from './CourseDetailCardHeader';

const CourseDetailCard = ({ course }: { course: CourseSummary }) => {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
      <CourseDetailCardHeader course={course} />
      <CourseDetailCardBody course={course} />
    </div>
  );
};

export default CourseDetailCard;
