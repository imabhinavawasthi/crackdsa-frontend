import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Zap, ShieldCheck, TrendingUp, Users, Target } from "lucide-react";

const features = [
  {
    title: "Learning Approach",
    other: "Endless 450+ problem sheets that cause burnout",
    crackdsa: "Pattern-first mastery with hyper-personalized roadmaps",
    icon: <Target className="w-5 h-5" />,
  },
  {
    title: "Mentorship",
    other: "Non-existent or taught by teaching assistants",
    crackdsa: "1:1 mentorship from FAANG / Product-based engineers",
    icon: <Users className="w-5 h-5" />,
  },
  {
    title: "Doubt Resolution",
    other: "Slow community forums with days of waiting",
    crackdsa: "Live doubt sessions & dedicated 1:1 support",
    icon: <Zap className="w-5 h-5" />,
  },
  {
    title: "Curriculum Updates",
    other: "Outdated recorded lectures from years ago",
    crackdsa: "Constantly evolving with current industry trends",
    icon: <TrendingUp className="w-5 h-5" />,
  },
  {
    title: "Job Readiness",
    other: "Generic certificates of completion",
    crackdsa: "Industry-validated mock interviews & referrals",
    icon: <ShieldCheck className="w-5 h-5" />,
  },
];

export function CompareSection() {
  return (
    <section className="py-24 px-4 relative overflow-hidden">
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-brand-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-16 space-y-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-black uppercase tracking-widest border border-brand-500/20"
          >
            Why Choose Us?
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight"
          >
            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-indigo-500">CrackDSA</span> Advantage
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 dark:text-gray-400 font-medium max-w-2xl mx-auto"
          >
            Don't waste time on endless problem solving without direction. See why top candidates prefer our engineered learning approach.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-gray-200 dark:border-gray-800 rounded-[2.5rem] overflow-hidden bg-white dark:bg-gray-900 shadow-2xl">
          
          {/* Other Platforms Column */}
          <div className="p-8 md:p-12 bg-gray-50/50 dark:bg-gray-900/50">
            <h3 className="text-2xl font-black text-gray-400 dark:text-gray-500 mb-8 flex items-center justify-center gap-3 border-b border-gray-200 dark:border-gray-800 pb-6">
              Other Platforms
            </h3>
            <div className="space-y-8">
              {features.map((feature, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <XCircle className="w-6 h-6 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-1">{feature.title}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed">{feature.other}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* CrackDSA Column */}
          <div className="p-8 md:p-12 bg-gradient-to-br from-brand-50 to-indigo-50 dark:from-brand-900/20 dark:to-indigo-900/20 relative">
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-brand-500 to-indigo-500 hidden md:block" />
            <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-indigo-600 dark:from-brand-400 dark:to-indigo-400 mb-8 flex items-center justify-center gap-3 border-b border-brand-200 dark:border-brand-800/30 pb-6">
              CrackDSA
            </h3>
            <div className="space-y-8">
              {features.map((feature, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div className="p-1 rounded-full bg-brand-100 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400 shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-1">{feature.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 font-medium leading-relaxed">{feature.crackdsa}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
