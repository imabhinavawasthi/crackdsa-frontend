'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Award, Crown, Search, Video } from 'lucide-react';
import { Plus_Jakarta_Sans, Space_Grotesk } from 'next/font/google';
import { CourseSummary } from '@/types/course';
import { fetchCourses } from '@/api/courses';
import { CourseCard } from '@/components/courses/CourseCard';

const plusJakarta = Plus_Jakarta_Sans({ subsets: ['latin'] });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk' });

const PERKS = [
  { icon: Award, label: 'Certificate included with every course' },
  { icon: Video, label: 'Free video previews' },
  { icon: Crown, label: 'Pro unlocks every course' },
];

const GRID = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';
const EMPTY =
  'py-20 text-center text-gray-500 dark:text-gray-400 font-medium rounded-3xl border border-dashed border-gray-200 dark:border-gray-800';

export default function CourseListingPage() {
  const [courses, setCourses] = useState<CourseSummary[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [query, setQuery] = useState('');

  useEffect(() => {
    fetchCourses()
      .then(setCourses)
      .catch((err) => {
        console.error('Failed to fetch courses', err);
        setError(true);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return courses;
    return courses.filter((c) => [c.title, c.category, ...(c.tags ?? [])].some((v) => v?.toLowerCase().includes(q)));
  }, [courses, query]);

  return (
    <div
      className={`${plusJakarta.className} ${spaceGrotesk.variable} min-h-screen bg-gray-50 dark:bg-gray-950 [&_h1]:font-(family-name:--font-space-grotesk) [&_h2]:font-(family-name:--font-space-grotesk)`}
    >
      {/* Banner */}
      <section className="relative overflow-hidden bg-[#0B1950] text-white">
        <div className="pointer-events-none absolute -top-32 -right-32 size-130 rounded-full bg-sky-400/20 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="mb-5 flex items-center gap-2">
              <span className="size-2 bg-sky-300" />
              <span className="text-xs font-bold tracking-[0.18em] text-sky-300 uppercase">Browse with intent</span>
            </div>
            <h1 className="max-w-3xl text-4xl leading-[1.05] font-medium tracking-tight sm:text-6xl">
              Learn the part that moves you forward.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-blue-100/80 sm:text-lg">
              Practical courses for developers and career switchers. Find your pace, and choose a next step you can
              actually finish.
            </p>
            <Link
              href="/pro"
              className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-sky-300 px-6 py-3 text-sm font-bold text-[#0B1950] transition-colors hover:bg-sky-200"
            >
              <Crown size={16} />
              Get Pro subscription
            </Link>
          </div>

          {/* Perks showcase */}
          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="rotate-2 rounded-2xl bg-white p-2 shadow-2xl shadow-black/40 transition-transform hover:rotate-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/certificate.svg" alt="Sample course certificate" className="w-full rounded-xl" />
            </div>
            <ul className="relative -mt-8 ml-auto w-[88%] space-y-3 rounded-2xl border border-white/15 bg-[#0B1950]/80 p-5 backdrop-blur">
              {PERKS.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-3 text-sm font-medium text-blue-50">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-sky-300/15">
                    <Icon size={16} className="text-sky-300" />
                  </span>
                  {label}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Listing */}
      <main className="mx-auto max-w-7xl space-y-8 px-4 py-12 sm:px-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            All courses
            {!loading && !error && <span className="ml-2 text-base font-medium text-gray-400">{courses.length}</span>}
          </h2>
          <div className="relative w-full sm:w-80">
            <Search
              size={16}
              className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-gray-400"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search courses"
              className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pr-4 pl-10 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-[#0B1950] focus:ring-2 focus:ring-[#0B1950]/15 dark:border-gray-800 dark:bg-gray-900 dark:text-white dark:focus:border-sky-300 dark:focus:ring-sky-300/20"
            />
          </div>
        </div>

        {loading ? (
          <div className={GRID}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-[360px] animate-pulse rounded-3xl bg-gray-200/70 dark:bg-gray-800/50" />
            ))}
          </div>
        ) : error ? (
          <div className={EMPTY}>Unable to load courses right now. Please try again later.</div>
        ) : filtered.length === 0 ? (
          <div className={EMPTY}>
            {courses.length === 0 ? 'No courses available yet.' : 'No courses match your search.'}
          </div>
        ) : (
          <div className={GRID}>
            {filtered.map((course, idx) => (
              <CourseCard key={course.id} course={course} index={idx} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
