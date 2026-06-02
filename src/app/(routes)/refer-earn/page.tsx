import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ReferEarnPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-500">Refer & Earn</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Share CrackDSA and earn rewards
          </h1>
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to home
        </Link>
      </div>

      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <div className="space-y-4">
          <p className="text-base text-gray-700 dark:text-gray-300">
            Invite friends to CrackDSA using your unique referral link. When they sign up and begin learning, you earn rewards that help you level up faster.
          </p>
          <div className="rounded-3xl border border-dashed border-brand-200 bg-brand-50 p-5 dark:border-brand-500/20 dark:bg-brand-500/10">
            <p className="text-xs uppercase tracking-[0.2em] text-brand-600 dark:text-brand-300">Your referral link</p>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <span className="break-all rounded-2xl bg-white px-4 py-3 text-sm text-gray-900 shadow-sm dark:bg-gray-950 dark:text-gray-100">
                https://crackdsa.com/refer?code=YOURCODE
              </span>
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600 transition"
              >
                Copy link
              </button>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-3xl border border-gray-150 bg-gray-50 p-5 dark:border-gray-800 dark:bg-gray-950">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">Share</p>
              <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-400">
                Send your referral link to friends, classmates, or online communities.
              </p>
            </div>
            <div className="rounded-3xl border border-gray-150 bg-gray-50 p-5 dark:border-gray-800 dark:bg-gray-950">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">Sign up</p>
              <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-400">
                They sign up through your link and start exploring the roadmap content.
              </p>
            </div>
            <div className="rounded-3xl border border-gray-150 bg-gray-50 p-5 dark:border-gray-800 dark:bg-gray-950">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">Earn rewards</p>
              <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-400">
                You earn points, badges, or credits as soon as they complete their first activity.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
