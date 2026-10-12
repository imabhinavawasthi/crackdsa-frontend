'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Clock, Code2, FileText, Info, Infinity as InfinityIcon, Layers, Share2, Tag, Video } from 'lucide-react';

import type { CourseSummary } from '@/types/course';
import { formatPrice, getDiscountPercent } from '../courseDetailUtils';

type Plan = 'pro' | 'individual';

const Radio = ({ checked }: { checked: boolean }) => (
  <span
    className={`mt-1 flex size-5 shrink-0 items-center justify-center rounded-full border-2 ${
      checked ? 'border-gray-900' : 'border-gray-400'
    }`}
  >
    {checked && <span className="size-2.5 rounded-full bg-brand-500" />}
  </span>
);

const CourseDetailCardBody = ({ course }: { course: CourseSummary }) => {
  const [plan, setPlan] = useState<Plan>('pro');
  const discount = getDiscountPercent(course.price, course.original_price);
  const hours = course.metadata?.duration_hours;

  const includes = [
    hours ? { icon: Clock, label: `${hours} hours of learning` } : null,
    course.total_videos ? { icon: Video, label: `${course.total_videos} video lectures` } : null,
    course.total_problems ? { icon: Code2, label: `${course.total_problems} practice problems` } : null,
    course.total_articles ? { icon: FileText, label: `${course.total_articles} articles` } : null,
  ].filter((i): i is NonNullable<typeof i> => i !== null);

  const share = () => {
    const url = window.location.href;
    if (navigator.share) navigator.share({ title: course.title, url }).catch(() => {});
    else navigator.clipboard?.writeText(url);
  };

  return (
    <div className="divide-y divide-gray-200">
      {/* Individual course */}
      <div className="p-6">
        <button type="button" onClick={() => setPlan('individual')} className="flex w-full items-start gap-3 text-left">
          <Radio checked={plan === 'individual'} />
          <span>
            <span className="block text-sm text-gray-600">Buy individual course</span>
            <span className="flex items-baseline gap-3">
              <span className="text-2xl font-bold text-gray-900">{formatPrice(course.price)}</span>
              {discount > 0 && (
                <>
                  <span className="text-sm text-gray-500 line-through">{formatPrice(course.original_price)}</span>
                  <span className="text-sm font-medium text-brand-600">{discount}% off</span>
                </>
              )}
            </span>
          </span>
        </button>

        {plan === 'individual' && (
          <div className="mt-5 space-y-4">
            {includes.length > 0 && (
              <ul className="space-y-2.5">
                {includes.map(({ icon: Icon, label }) => (
                  <li key={label} className="flex items-center gap-3 text-sm text-gray-600">
                    <Icon className="size-4 text-brand-500" /> {label}
                  </li>
                ))}
              </ul>
            )}
            <button className="w-full rounded-lg border-2 border-brand-500 py-3 text-sm font-bold text-brand-600 hover:bg-brand-25">
              Buy this course
            </button>
          </div>
        )}
      </div>

      {/* Pro plan */}
      <div className="p-4">
       <div className="relative overflow-hidden rounded-xl border-2 border-brand-500 bg-linear-to-br from-brand-25 to-white p-5 shadow-md">
        <span className="absolute right-0 top-0 rounded-bl-lg bg-brand-500 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
          Best value
        </span>
        <button type="button" onClick={() => setPlan('pro')} className="flex w-full items-start gap-3 text-left">
          <Radio checked={plan === 'pro'} />
          <span className="flex-1">
            <span className="block text-sm text-gray-600">Subscribe to</span>
            <span className="block text-xl font-bold text-gray-900">CrackDSA Pro</span>
            <span className="mt-1 block text-sm text-gray-600">
              One subscription for every course, live sessions, masterclasses and roadmaps to crack your next interview.
            </span>
          </span>
        </button>

        {plan === 'pro' && (
          <div className="mt-5 space-y-4">
            <div className="flex gap-2.5 rounded-lg border border-brand-100 bg-white p-4 text-sm text-gray-700">
              <Info className="mt-0.5 size-4 shrink-0 text-brand-600" />
              <p>
                <span className="font-semibold text-gray-900">Pro members don&apos;t pay per course.</span>{' '}
                Get this course and every other course with a single subscription.
              </p>
            </div>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex gap-3">
                <Layers className="mt-0.5 size-4 shrink-0 text-gray-700" /> Get this course and many more with access to all courses
              </li>
              <li className="flex gap-3">
                <InfinityIcon className="mt-0.5 size-4 shrink-0 text-gray-700" /> Live sessions, masterclasses and roadmaps
              </li>
              <li className="flex gap-3">
                <Tag className="mt-0.5 size-4 shrink-0 text-gray-700" /> Cancel anytime
              </li>
            </ul>
            <Link
              href="/pro"
              className="block w-full rounded-lg bg-brand-500 py-3 text-center text-sm font-bold text-white hover:bg-brand-600"
            >
              Start subscription
            </Link>
          </div>
        )}
       </div>
      </div>

      <div className="p-4">
        <button
          type="button"
          onClick={share}
          className="flex w-full items-center justify-center gap-2 rounded-md py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <Share2 className="size-4" /> Share
        </button>
      </div>
    </div>
  );
};

export default CourseDetailCardBody;
