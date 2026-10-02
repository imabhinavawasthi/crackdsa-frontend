import { Plus_Jakarta_Sans, Space_Grotesk } from 'next/font/google';
import { notFound } from 'next/navigation';
import CourseDetailPage from '@/components/CourseDetailPage/CourseDetailPage';
import { fetchCourseDetail, fetchCourseCurriculum } from '@/api/courses';

const plusJakarta = Plus_Jakarta_Sans({ subsets: ['latin'] });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk' });

const page = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;

  const [course, curriculum] = await Promise.all([
    fetchCourseDetail(slug).catch(() => null),
    fetchCourseCurriculum(slug),
  ]);

  if (!course) notFound();

  return (
    <div
      className={`${plusJakarta.className} ${spaceGrotesk.variable} [&_h1]:font-(family-name:--font-space-grotesk) [&_h2]:font-(family-name:--font-space-grotesk) [&_h3]:font-(family-name:--font-space-grotesk)`}
    >
      <CourseDetailPage course={course} curriculum={curriculum} />
    </div>
  );
};

export default page;
