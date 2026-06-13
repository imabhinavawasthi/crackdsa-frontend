import PageHeader from "@/components/common/PageHeader";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import { Gift } from "lucide-react";

export default function ReferEarnPage() {
  const breadcrumbItems = [
    { title: "Dashboard", href: "/dashboard" },
    { title: "Refer & Earn" }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 select-none">
      
      {/* Breadcrumbs */}
      <Breadcrumbs items={breadcrumbItems} listClassName="text-xs font-medium" />

      {/* Page Header */}
      <PageHeader
        title={
          <>
            Refer & {" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-brand-400">
              Earn Rewards
            </span>
          </>
        }
        subtitle="Invite friends to join the CrackDSA learning platform, track your invitations, and unlock premium rewards."
        accent="brand"
      />

      {/* Referral Program Coming Soon Banner */}
      <div className="relative overflow-hidden rounded-[1.5rem] border border-amber-500/25 bg-amber-500/[0.04] p-5 shadow-sm dark:border-amber-500/30 dark:bg-amber-500/[0.06]">
        {/* Subtle background glow */}
        <div className="absolute -right-10 -bottom-10 h-28 w-28 rounded-full bg-amber-500/10 blur-xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
              <Gift size={22} />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-black text-gray-900 dark:text-white">
                Referral Program Coming Soon
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                We are launching a rewards program shortly! Invite your friends to unlock free PRO access, exclusive notes, and visual DSA sheets.
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 text-[10px] font-black text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-md uppercase tracking-wider border border-amber-500/10 self-start sm:self-auto">
            Coming Soon
          </span>
        </div>
      </div>

      {/* Locked Referral Details Card */}
      <div className="relative rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950 opacity-60 pointer-events-none select-none">
        <div className="space-y-4">
          <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
            Invite friends to CrackDSA using your unique referral link. When they sign up and begin learning, you earn rewards that help you level up faster.
          </p>
          
          <div className="rounded-[1.5rem] border border-dashed border-brand-200 bg-brand-50 p-5 dark:border-brand-500/20 dark:bg-brand-500/10">
            <p className="text-xs uppercase tracking-[0.2em] text-brand-600 dark:text-brand-300 font-bold">Your referral link</p>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <span className="break-all rounded-xl bg-white px-4 py-3 text-xs text-gray-900 shadow-sm dark:bg-gray-950 dark:text-gray-100 font-mono">
                https://crackdsa.com/refer?code=YOURCODE
              </span>
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-xl bg-brand-500 px-4 py-2.5 text-xs font-bold text-white hover:bg-brand-600 transition"
              >
                Copy link
              </button>
            </div>
          </div>
          
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-gray-150 bg-gray-50 p-5 dark:border-gray-800 dark:bg-gray-950">
              <p className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider">1. Share</p>
              <p className="mt-2 text-xs leading-relaxed text-gray-500 dark:text-gray-400 font-medium">
                Send your referral link to friends, classmates, or online communities.
              </p>
            </div>
            <div className="rounded-2xl border border-gray-150 bg-gray-50 p-5 dark:border-gray-800 dark:bg-gray-950">
              <p className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider">2. Sign up</p>
              <p className="mt-2 text-xs leading-relaxed text-gray-500 dark:text-gray-400 font-medium">
                They sign up through your link and start exploring the roadmap content.
              </p>
            </div>
            <div className="rounded-2xl border border-gray-150 bg-gray-50 p-5 dark:border-gray-800 dark:bg-gray-950">
              <p className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider">3. Earn rewards</p>
              <p className="mt-2 text-xs leading-relaxed text-gray-500 dark:text-gray-400 font-medium">
                You earn points, badges, or credits as soon as they complete their first activity.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
