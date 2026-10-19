import { Check } from 'lucide-react';

const WhatWillYouLearn = ({ outcomes }: { outcomes: string[] }) => {
  if (outcomes.length === 0) return null;

  return (
    <section>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">What you&apos;ll learn</h2>
      <ul className="mt-5 grid gap-x-8 gap-y-3.5 sm:grid-cols-2">
        {outcomes.map((outcome) => (
          <li key={outcome} className="flex items-start gap-3 text-sm font-medium text-gray-700 dark:text-gray-300">
            <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 mt-0.5">
              <Check className="size-3 stroke-[3]" />
            </div>
            <span className="leading-snug">{outcome}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default WhatWillYouLearn;


