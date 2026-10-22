'use client';

import Image from 'next/image';
import { 
  Award, 
  CheckCircle2, 
  Download, 
  ExternalLink, 
  FileCheck, 
  QrCode, 
  Share2,
  ShieldCheck, 
  Sparkles 
} from 'lucide-react';
import { SocialIcon } from '@/components/common/SocialIcons';

export default function CourseCertificate() {
  const benefits = [
    {
      icon: ShieldCheck,
      title: 'Verifiable Online Credential',
      desc: 'Each certificate features a unique credential ID and instant URL for tech recruiters to verify authenticity.',
    },
    {
      icon: Share2,
      title: 'LinkedIn 1-Click Integration',
      desc: 'Seamlessly add your verified badge to your LinkedIn Licenses & Certifications section with one click.',
    },
    {
      icon: Download,
      title: 'Resume & Portfolio Ready',
      desc: 'Download high-resolution vector PDF and digital badge assets to attach to your resume and GitHub profile.',
    },
    {
      icon: FileCheck,
      title: 'Lifetime Validity',
      desc: 'Zero renewal fees or expiration. Permanent proof of your dedicated DSA preparation and problem solving.',
    },
  ];

  return (
    <section className="rounded-2xl border border-gray-200/90 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 sm:p-10 shadow-xs transition-colors">
      {/* Header */}
      <div className="mb-8">
        <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2">
          OFFICIAL CERTIFICATION
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Earn an Industry-Recognized Certificate
        </h2>
        <p className="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl">
          Stand out in technical screening rounds. Complete all curriculum modules and problem-solving benchmarks to receive your official CrackDSA certificate.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
        {/* Left Column: 4 Value Pillars */}
        <div className="lg:col-span-6 space-y-5">
          {benefits.map((b) => {
            const Icon = b.icon;
            return (
              <div key={b.title} className="flex items-start gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 mt-0.5">
                  <Icon className="size-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                    {b.title}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                    {b.desc}
                  </p>
                </div>
              </div>
            );
          })}

          <div className="pt-2">
            <div className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 px-3.5 py-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              <CheckCircle2 className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span>Awarded automatically upon 100% curriculum completion</span>
            </div>
          </div>
        </div>

        {/* Right Column: High-End Framed Certificate Preview */}
        <div className="lg:col-span-6">
          <div className="relative group mx-auto max-w-lg lg:max-w-none">
            {/* Ambient Glow */}
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-600/20 to-sky-400/20 blur-xl opacity-75 group-hover:opacity-100 transition duration-500" />

            {/* Framed Certificate Card */}
            <div className="relative rounded-2xl border border-gray-200 dark:border-gray-700/80 bg-gray-50 dark:bg-gray-800/90 p-2.5 sm:p-3 shadow-xl transition-all duration-300 group-hover:scale-[1.01]">
              <div className="relative aspect-[1200/850] w-full overflow-hidden rounded-xl bg-white shadow-inner">
                <Image
                  src="/images/certificate.svg"
                  alt="CrackDSA Course Completion Certificate"
                  width={1200}
                  height={850}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
