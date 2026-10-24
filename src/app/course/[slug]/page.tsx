import { Plus_Jakarta_Sans, Space_Grotesk } from 'next/font/google';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import CourseDetailPage from '@/components/CourseDetailPage/CourseDetailPage';
import { fetchCourseDetail, fetchCourseCurriculum } from '@/api/courses';
import PublicPageShell from '@/layout/PublicPageShell';
import JsonLd from '@/components/common/JsonLd';

const plusJakarta = Plus_Jakarta_Sans({ subsets: ['latin'] });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk' });

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const course = await fetchCourseDetail(slug);
    if (course?.title) {
      return {
        title: `${course.title} | crackDSA`,
        description: course.description || `Master ${course.title} with crackDSA.`,
      };
    }
  } catch {}
  const fallback = (slug || "").split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  return { title: `${fallback} | crackDSA` };
}

const page = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;

  const [course, curriculum] = await Promise.all([
    fetchCourseDetail(slug).catch(() => null),
    fetchCourseCurriculum(slug).catch(() => []),
  ]);

  if (!course) notFound();

  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title,
    description: course.description || `Master ${course.title} with CrackDSA.`,
    provider: {
      "@type": "Organization",
      name: "CrackDSA",
      sameAs: "https://crackdsa.com",
    },
    offers: {
      "@type": "Offer",
      category: "Paid",
      price: course.price ?? "0",
      priceCurrency: "INR",
    },
  };

  return (
    <PublicPageShell>
      <JsonLd schema={courseSchema} />
      <div
        className={`min-h-screen bg-white dark:bg-[#070B14] text-gray-900 dark:text-white ${plusJakarta.className} ${spaceGrotesk.variable} [&_h1]:font-(family-name:--font-space-grotesk) [&_h2]:font-(family-name:--font-space-grotesk) [&_h3]:font-(family-name:--font-space-grotesk)`}
      >
        <CourseDetailPage course={course} curriculum={curriculum} />
      </div>
    </PublicPageShell>
  );
};

export default page;
