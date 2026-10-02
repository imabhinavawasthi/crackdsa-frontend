import type { CourseSummary } from '@/types/course';

export const stripHtml = (html: string) =>
  html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

export const formatPrice = (amount: number) => `₹${amount.toLocaleString('en-IN')}`;

export const getDiscountPercent = (price: number, original: number) =>
  original > price ? Math.round(((original - price) / original) * 100) : 0;

export const formatDate = (iso?: string) =>
  iso ? new Date(iso).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : null;

// The API may return a list or a single string for these fields; anything else is ignored.
export const toStringList = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.filter((v): v is string => typeof v === 'string' && v.length > 0);
  }
  if (typeof value === 'string' && value.trim()) return [value.trim()];
  return [];
};

export const getCourseIncludes = (course: CourseSummary) => {
  const items: { title: string; subtitle: string }[] = [];
  const hours = course.metadata?.duration_hours;
  if (hours) items.push({ title: `${hours} hours of learning`, subtitle: 'Structured, self-paced content' });
  if (course.total_videos) items.push({ title: `${course.total_videos} video lectures`, subtitle: 'Short, focused lessons' });
  if (course.total_problems) items.push({ title: `${course.total_problems} practice problems`, subtitle: 'Curated interview questions' });
  if (course.total_articles) items.push({ title: `${course.total_articles} articles`, subtitle: 'Read and revise quickly' });
  items.push({ title: 'Certificate of completion', subtitle: 'Shareable when you finish' });
  return items;
};
