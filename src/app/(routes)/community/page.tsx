"use client";

import { SOCIALS, EMAILS } from "@/constants/contact";
import {
  MonitorPlay,
  MessageCircle,
  Briefcase,
  Mail,
  GraduationCap,
  ExternalLink,
  Send,
  Gift,
  Award,
  Users,
  BadgeCheck,
  Sparkles,
  Heart,
} from "lucide-react";
import { motion } from "framer-motion";

const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};

export default function CommunityPage() {
  return (
    <div className="min-h-screen">
      {/* ── Hero ── */}
      <div className="relative -mx-4 md:-mx-6 -mt-4 md:-mt-6 mb-8 overflow-hidden bg-gradient-to-r from-brand-600 via-brand-500 to-brand-400 dark:from-brand-700 dark:via-brand-600 dark:to-brand-500">
        <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23fff\' fill-opacity=\'1\'%3E%3Cpath d=\'M20 20.5V18H0v-2h20v-2l2 3.5-2 3zM0 20.5V18h20v-2H0v-2l-2 3.5 2 3z\'/%3E%3C/g%3E%3C/svg%3E")' }} />
        <div className="relative z-10 px-4 md:px-6 py-8 md:py-10 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Heart size={18} className="text-white/70" />
            <span className="text-white/70 text-sm font-medium uppercase tracking-wider">Community</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Join the CrackDSA Community
          </h1>
          <p className="text-white/60 text-sm md:text-base max-w-lg mx-auto mb-6">
            Connect with thousands of learners, get help, share your progress, and stay updated.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 mb-5">
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-extrabold text-white">50k+</p>
              <p className="text-[11px] text-white/50 uppercase tracking-wider font-medium">Followers</p>
            </div>
            <div className="w-px h-8 bg-white/15 hidden md:block" />
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-extrabold text-white">20k+</p>
              <p className="text-[11px] text-white/50 uppercase tracking-wider font-medium">YouTube Subscribers</p>
            </div>
            <div className="w-px h-8 bg-white/15 hidden md:block" />
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-extrabold text-white">100+</p>
              <p className="text-[11px] text-white/50 uppercase tracking-wider font-medium">Colleges</p>
            </div>
          </div>

          {/* Mentor Companies */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="text-[10px] uppercase tracking-wider text-white/40 font-semibold mr-1">Mentors from</span>
            {["Google", "Amazon", "LinkedIn", "Microsoft", "Zeta"].map((company) => (
              <span key={company} className="px-2.5 py-0.5 rounded bg-white/10 text-[11px] font-semibold text-white/80 tracking-wide">
                {company}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Social Platforms ── */}
      <motion.section {...fadeUp} transition={{ delay: 0.05 }} className="mb-10">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Follow Us</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">Stay connected on your favourite platforms.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* YouTube – CrackDSA */}
          <SocialCard
            href={SOCIALS.youtube.crackdsa}
            icon={<MonitorPlay size={20} />}
            iconBg="bg-red-100 dark:bg-red-500/15 text-red-600 dark:text-red-400"
            title="CrackDSA"
            subtitle="YouTube Channel"
          />
          {/* YouTube – Abhinav */}
          <SocialCard
            href={SOCIALS.youtube.abhinav}
            icon={<MonitorPlay size={20} />}
            iconBg="bg-red-100 dark:bg-red-500/15 text-red-600 dark:text-red-400"
            title="Abhinav Awasthi"
            subtitle="YouTube Channel"
          />
          {/* Telegram */}
          <SocialCard
            href={SOCIALS.telegram}
            icon={<Send size={20} />}
            iconBg="bg-blue-light-100 dark:bg-blue-light-500/15 text-blue-light-600 dark:text-blue-light-400"
            title="Telegram Community"
            subtitle="Daily updates & discussions"
          />
          {/* WhatsApp */}
          <SocialCard
            href={SOCIALS.whatsapp.channel}
            icon={<MessageCircle size={20} />}
            iconBg="bg-success-100 dark:bg-success-500/15 text-success-600 dark:text-success-400"
            title="WhatsApp Channel"
            subtitle="Announcements & resources"
          />
          {/* LinkedIn – CrackDSA */}
          <SocialCard
            href={SOCIALS.linkedin.crackdsa}
            icon={<Briefcase size={20} />}
            iconBg="bg-brand-100 dark:bg-brand-500/15 text-brand-600 dark:text-brand-400"
            title="CrackDSA"
            subtitle="LinkedIn Page"
          />
          {/* LinkedIn – Abhinav */}
          <SocialCard
            href={SOCIALS.linkedin.abhinav}
            icon={<Briefcase size={20} />}
            iconBg="bg-brand-100 dark:bg-brand-500/15 text-brand-600 dark:text-brand-400"
            title="Abhinav Awasthi"
            subtitle="LinkedIn Profile"
          />
        </div>
      </motion.section>

      {/* ── Contact / Email Support ── */}
      <motion.section {...fadeUp} transition={{ delay: 0.1 }} className="mb-10">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Get In Touch</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">Reach out to us for support, business, or campus partnerships.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <EmailCard
            email={EMAILS.support}
            icon={<Mail size={20} />}
            title="Support"
            description="Technical help, bugs, or account issues"
          />
          <EmailCard
            email={EMAILS.business}
            icon={<Sparkles size={20} />}
            title="Promotions & Enquiries"
            description="Sponsorships, collaborations, or general enquiries"
          />
          <EmailCard
            email={EMAILS.colleges}
            icon={<GraduationCap size={20} />}
            title="Campus Partnerships"
            description="Organise a DSA webinar or training session at your college"
          />
        </div>
      </motion.section>

      {/* ── College Ambassador Program ── */}
      <motion.section {...fadeUp} transition={{ delay: 0.15 }} className="mb-10">
        <div className="rounded-xl border border-brand-200 dark:border-brand-500/25 bg-gradient-to-br from-brand-50 to-white dark:from-brand-500/[0.06] dark:to-gray-800/50 p-6 md:p-8 overflow-hidden relative">
          <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-brand-100/50 dark:bg-brand-500/10" />

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-1">
              <BadgeCheck size={20} className="text-brand-500" />
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                College Ambassador Program
              </h2>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 max-w-xl">
              Want to represent CrackDSA at your campus? Lead the coding culture, earn exclusive perks, and build your network.
            </p>

            {/* Perks grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              <PerkItem
                icon={<Gift size={16} />}
                text="Free Pro / Paid subscription of CrackDSA"
              />
              <PerkItem
                icon={<Award size={16} />}
                text="Goodies & merchandise for top performers"
              />
              <PerkItem
                icon={<BadgeCheck size={16} />}
                text="Official certificate of recognition"
              />
              <PerkItem
                icon={<Users size={16} />}
                text="1:1 mentorship sessions & referrals"
              />
            </div>

            {/* CTA */}
            <a
              href={SOCIALS.whatsapp.ambassador}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-brand-500 text-white font-semibold text-sm px-5 py-2.5 rounded-lg hover:bg-brand-600 transition-colors shadow-sm"
            >
              <MessageCircle size={16} />
              Apply on WhatsApp
              <ExternalLink size={13} className="opacity-60" />
            </a>
          </div>
        </div>
      </motion.section>
    </div>
  );
}

/* ── Reusable sub-components ────────────────────────────────────────────────── */

function SocialCard({
  href,
  icon,
  iconBg,
  title,
  subtitle,
}: {
  href: string;
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  subtitle: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-3.5 p-4 rounded-xl border border-gray-200 dark:border-white/8 bg-white dark:bg-gray-800/50 hover:border-brand-300 dark:hover:border-brand-500/40 hover:shadow-sm transition-all"
    >
      <div className={`flex items-center justify-center h-10 w-10 rounded-lg shrink-0 ${iconBg}`}>
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors truncate">
          {title}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>
      </div>
      <ExternalLink size={14} className="text-gray-300 dark:text-gray-600 group-hover:text-brand-500 transition-colors shrink-0" />
    </a>
  );
}

function EmailCard({
  email,
  icon,
  title,
  description,
}: {
  email: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <a
      href={`mailto:${email}`}
      className="group flex items-start gap-3.5 p-4 rounded-xl border border-gray-200 dark:border-white/8 bg-white dark:bg-gray-800/50 hover:border-brand-300 dark:hover:border-brand-500/40 hover:shadow-sm transition-all"
    >
      <div className="flex items-center justify-center h-10 w-10 rounded-lg shrink-0 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
          {title}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1.5">{description}</p>
        <p className="text-xs font-medium text-brand-600 dark:text-brand-400">{email}</p>
      </div>
    </a>
  );
}

function PerkItem({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-start gap-2.5 p-3 rounded-lg bg-white dark:bg-gray-800/80 border border-gray-100 dark:border-white/5">
      <div className="text-brand-500 mt-0.5 shrink-0">{icon}</div>
      <span className="text-sm text-gray-700 dark:text-gray-300">{text}</span>
    </div>
  );
}
