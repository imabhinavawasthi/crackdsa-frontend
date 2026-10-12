import { Check } from 'lucide-react';

const WhatWillYouLearn = ({ outcomes }: { outcomes: string[] }) => {
  if (outcomes.length === 0) return null;

  return (
    <section>
      <h2 className="text-2xl font-bold text-gray-900">What you&apos;ll learn</h2>
      <ul className="mt-5 grid gap-x-8 gap-y-3 sm:grid-cols-2">
        {outcomes.map((outcome) => (
          <li key={outcome} className="flex gap-3 text-sm text-gray-700">
            <Check className="mt-0.5 size-4 shrink-0 text-brand-500" />
            {outcome}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default WhatWillYouLearn;
