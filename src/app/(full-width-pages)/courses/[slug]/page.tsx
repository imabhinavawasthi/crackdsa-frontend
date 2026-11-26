import { redirect } from 'next/navigation';

export default async function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  redirect(`/course/${slug}`);
}
