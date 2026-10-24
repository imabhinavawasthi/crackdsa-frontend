import { Clock, Globe, Star, Users } from 'lucide-react';
import type { CourseSection, CourseSummary } from '@/types/course';
import { formatDate, stripHtml } from './courseDetailUtils';

interface CourseDetailHeroProps {
  course: CourseSummary;
  curriculum?: CourseSection[];
  card?: React.ReactNode;
}

export default function CourseDetailHero({ course, curriculum = [], card }: CourseDetailHeroProps) {
  const rating = course.metadata?.rating;
  const reviews = course.metadata?.reviews as number | undefined;
  const students = course.metadata?.number_of_students;
  const updated = formatDate(course.updated_at || course.created_at);
  const rawLanguage = course.metadata?.language;
  const language = rawLanguage ? (rawLanguage.includes('/') ? rawLanguage.split('/')[0].trim() : rawLanguage) : 'English (Hinglish)';

  // Format title into firstLine, secondLine (highlighted in sky-400), and subtitle
  const formatTitle = (raw: string) => {
    const bracketMatch = raw.match(/\[(.*?)\]/);
    const subtitle = bracketMatch ? `[${bracketMatch[1]}]` : null;
    const cleanTitle = raw.replace(/\[.*?\]/, '').trim();

    if (cleanTitle.includes('&')) {
      const parts = cleanTitle.split('&');
      return {
        firstLine: parts[0].trim() + ' &',
        secondLine: parts.slice(1).join('&').trim(),
        subtitle,
      };
    }

    const words = cleanTitle.split(' ');
    if (words.length > 3) {
      return {
        firstLine: words.slice(0, words.length - 2).join(' '),
        secondLine: words.slice(words.length - 2).join(' '),
        subtitle,
      };
    }

    return {
      firstLine: cleanTitle,
      secondLine: null,
      subtitle,
    };
  };

  const titleParts = formatTitle(course.title);
  const description = stripHtml(course.description);

  // Extract key topic tags from curriculum or course tags
  const extractTopics = () => {
    const rawTitles = curriculum.map((s) => s.title.trim());
    
    // Core DSA topics to prioritize if they exist in the curriculum
    const priorityNames = [
      'Arrays',
      'Linked Lists',
      'Linked List',
      'Trees',
      'Tree',
      'Graphs',
      'Graph',
      'Dynamic Programming',
      'Greedy',
      'Recursion',
      'Backtracking',
      'Stack',
      'Queue',
      'Heap',
      'Sorting',
      'Searching',
    ];

    const prioritized: string[] = [];
    const remaining: string[] = [];

    // Check priority topics first
    priorityNames.forEach((target) => {
      const found = rawTitles.find((t) => t.toLowerCase() === target.toLowerCase());
      if (found) {
        // Standardize label if singular
        let label = found;
        if (label === 'Linked List') label = 'Linked Lists';
        if (label === 'Tree') label = 'Trees';
        if (label === 'Graph') label = 'Graphs';
        if (!prioritized.includes(label)) prioritized.push(label);
      }
    });

    // Add remaining curriculum topics
    rawTitles.forEach((title) => {
      if (!prioritized.some((p) => p.toLowerCase() === title.toLowerCase())) {
        remaining.push(title);
      }
    });

    const all = [...prioritized, ...remaining];
    if (all.length === 0 && course.tags) {
      all.push(...course.tags.map((t) => t.replace(/-/g, ' ')));
    }

    const displayed = all.slice(0, 6);
    const remainingCount = Math.max(0, all.length - 6);
    return { displayed, remainingCount };
  };

  const { displayed: topics, remainingCount } = extractTopics();

  return (
    <div className="relative bg-[#060D20] text-white">
      {/* Background radial glows and curves - clipped cleanly */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="pointer-events-none absolute -top-32 right-1/4 h-[550px] w-[550px] rounded-full bg-blue-600/15 blur-[130px]" />
        <div className="pointer-events-none absolute top-1/3 -right-20 h-[450px] w-[450px] rounded-full bg-sky-500/10 blur-[120px]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_75%_50%_at_75%_35%,rgba(29,78,216,0.22),transparent)]" />
        
        {/* Elegant swooping gradient wave */}
        <div 
          className="pointer-events-none absolute inset-0 opacity-40 mix-blend-screen"
          style={{
            background: 'radial-gradient(circle at 80% 20%, rgba(56, 189, 248, 0.12) 0%, transparent 40%)'
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-12">
        {/* Desktop floating card slot - anchored right inside max-w-7xl */}
        {card && (
          <div className="hidden lg:block absolute top-8 sm:top-10 lg:top-12 right-4 sm:right-6 lg:right-8 z-30 w-[380px] xl:w-[410px]">
            {card}
          </div>
        )}

        {/* Left Hero Content */}
        <div className={card ? 'lg:max-w-[calc(100%-420px)] xl:max-w-[calc(100%-450px)]' : ''}>
          {/* Badges row */}
          <div className="mb-3.5 flex flex-wrap items-center gap-2.5">
            {course.status === 'upcoming' ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-amber-300 backdrop-blur-xs">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
                </span>
                Upcoming Course
              </span>
            ) : (
              <>
                {course.is_popular && (
                  <span className="inline-flex items-center rounded-full bg-blue-600 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-sm">
                    BESTSELLER
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-300 backdrop-blur-xs">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                  </span>
                  Live Weekly Classes Included
                </span>
              </>
            )}
          </div>

        {/* Course Title */}
        <h1 className="text-3xl font-extrabold leading-[1.18] tracking-tight sm:text-4xl lg:text-[42px]">
          <span className="text-white">{titleParts.firstLine}</span>
          {titleParts.secondLine && (
            <span className="block text-[#38BDF8] mt-1">{titleParts.secondLine}</span>
          )}
          {titleParts.subtitle && (
            <span className="block text-xl font-bold text-white/95 mt-2 sm:text-2xl tracking-normal">
              {titleParts.subtitle}
            </span>
          )}
        </h1>

        {/* Course Description from API */}
        <p className="mt-4 max-w-2xl text-sm font-normal leading-relaxed text-blue-100/85 sm:text-base line-clamp-3">
          {description}
        </p>

        {/* Rating and Metadata Row */}
        <div className="mt-6 flex flex-wrap items-center gap-x-3.5 gap-y-2 text-sm text-blue-200/80">
          {rating != null && (
            <div className="flex items-center gap-1.5">
              <Star className="size-4 fill-amber-400 text-amber-400 shrink-0" />
              <span className="font-bold text-white text-sm">{rating}</span>
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    className={`size-3.5 ${
                      i < Math.round(rating)
                        ? 'fill-[#38BDF8] text-[#38BDF8]'
                        : 'fill-slate-700 text-slate-700'
                    }`}
                  />
                ))}
              </div>
              {reviews != null && (
                <span className="text-xs text-blue-200/80 sm:text-sm">({reviews.toLocaleString()} ratings)</span>
              )}
            </div>
          )}

          {rating != null && students != null && (
            <span className="select-none text-white/20">|</span>
          )}

          {students != null && (
            <div className="flex items-center gap-1.5">
              <Users className="size-4 shrink-0 text-blue-200/80" />
              <span className="font-medium text-blue-100">{students.toLocaleString()} learners</span>
            </div>
          )}

          {updated && (
            <>
              <span className="select-none text-white/20">|</span>
              <div className="flex items-center gap-1.5">
                <Clock className="size-4 shrink-0 text-blue-200/80" />
                <span>Last updated {updated}</span>
              </div>
            </>
          )}

          <span className="select-none text-white/20">|</span>
          <div className="flex items-center gap-1.5">
            <Globe className="size-4 shrink-0 text-blue-200/80" />
            <span>{language}</span>
          </div>
        </div>

        {/* Topic Chips */}
        {topics.length > 0 && (
          <div className="mt-6 flex flex-wrap items-center gap-2">
            {topics.map((topic) => (
              <span
                key={topic}
                className="rounded-full border border-white/15 bg-white/10 px-3.5 py-1 text-xs font-medium text-blue-100/90 backdrop-blur-xs transition-colors hover:bg-white/15"
              >
                {topic}
              </span>
            ))}
            {remainingCount > 0 && (
              <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-blue-200/70 backdrop-blur-xs">
                +{remainingCount} more
              </span>
            )}
          </div>
        )}
        </div>
      </div>
    </div>
  );
}

