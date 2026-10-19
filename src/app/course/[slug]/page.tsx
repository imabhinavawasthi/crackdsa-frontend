import { Plus_Jakarta_Sans, Space_Grotesk } from 'next/font/google';
import { notFound } from 'next/navigation';
import CourseDetailPage from '@/components/CourseDetailPage/CourseDetailPage';
import { fetchCourseDetail, fetchCourseCurriculum } from '@/api/courses';
import PublicPageShell from '@/layout/PublicPageShell';

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
    <PublicPageShell>
      <div
        className={`min-h-screen bg-white dark:bg-[#070B14] text-gray-900 dark:text-white ${plusJakarta.className} ${spaceGrotesk.variable} [&_h1]:font-(family-name:--font-space-grotesk) [&_h2]:font-(family-name:--font-space-grotesk) [&_h3]:font-(family-name:--font-space-grotesk)`}
      >
        <CourseDetailPage course={course} curriculum={curriculum} />
      </div>
    </PublicPageShell>
  );
};

export default page;
