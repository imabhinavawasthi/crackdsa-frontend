import type { Masterclass } from "@/types/masterclass";

const initials = (name: string) =>
  name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

export default function PlacementsSection({ placements }: { placements: Masterclass["placements"] }) {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">{placements.heading}</h2>
      <p className="mt-2 text-lg text-gray-500 dark:text-gray-400">{placements.subheading}</p>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {placements.students.map((student) => (
          <article
            key={student.name}
            className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-white/3"
          >
            <div className="aspect-[4/5] w-full overflow-hidden rounded-lg border border-gray-200 bg-gradient-to-br from-blue-100 to-blue-200 dark:border-gray-800 dark:from-blue-500/20 dark:to-[#0B1F3F]">
              {student.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={student.photo} alt={student.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-3xl font-semibold text-blue-600 dark:text-blue-300">
                  {initials(student.name)}
                </div>
              )}
            </div>
            <h3 className="mt-3 text-sm font-semibold text-gray-900 dark:text-white">{student.name}</h3>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {student.role} at {student.company}
            </p>
            <p className="mt-2 inline-block rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              {student.package}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
