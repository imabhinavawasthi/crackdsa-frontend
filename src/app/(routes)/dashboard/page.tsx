import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | CrackDSA",
  description: "Your personalized DSA learning dashboard — track progress, view your roadmap, and tackle today's problems.",
};

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Dashboard
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Welcome back! Here&apos;s your DSA progress overview.
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Problems Solved", value: "0", icon: "✅" },
          { label: "Current Streak", value: "0 days", icon: "🔥" },
          { label: "Topics Covered", value: "0 / 20", icon: "📚" },
          { label: "Roadmap Progress", value: "0%", icon: "🗺️" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 flex items-center gap-4 shadow-sm"
          >
            <span className="text-3xl">{stat.icon}</span>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                {stat.label}
              </p>
              <p className="text-xl font-bold text-gray-800 dark:text-white mt-0.5">
                {stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Placeholder Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Focus */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
          <h2 className="text-base font-semibold text-gray-700 dark:text-gray-200 mb-4">
            Today&apos;s Focus
          </h2>
          <div className="flex flex-col items-center justify-center h-40 text-gray-400 dark:text-gray-600">
            <span className="text-4xl mb-2">🎯</span>
            <p className="text-sm">Your roadmap isn&apos;t generated yet.</p>
            <p className="text-xs mt-1">Complete onboarding to get started.</p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
          <h2 className="text-base font-semibold text-gray-700 dark:text-gray-200 mb-4">
            Quick Links
          </h2>
          <ul className="space-y-3">
            {[
              { label: "View Roadmap", href: "/roadmap" },
              { label: "Problem Set", href: "/problems" },
              { label: "My Progress", href: "/progress" },
              { label: "Settings", href: "/settings" },
            ].map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="flex items-center justify-between text-sm text-blue-500 hover:text-blue-400 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                >
                  <span>{link.label}</span>
                  <span>→</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
