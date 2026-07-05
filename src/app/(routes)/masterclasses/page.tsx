"use client";


import { motion, Variants } from "framer-motion";
import { Target, Compass, Code2, Mail, ArrowRight } from "lucide-react";

export default function MasterclassesPage() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
  };

  const features = [
    {
      title: "Interview Preparation",
      description: "Structured interview strategies, resume reviews, and behavioral prep by top tech veterans.",
      icon: Target,
      color: "from-emerald-500 to-teal-500",
      bgLight: "bg-emerald-50",
      bgDark: "dark:bg-emerald-500/10",
      iconColor: "text-emerald-600 dark:text-emerald-400"
    },
    {
      title: "Expert Guidance",
      description: "1:1 mentorship sessions to clear roadblocks and set your personalized tech career trajectory.",
      icon: Compass,
      color: "from-blue-500 to-indigo-500",
      bgLight: "bg-blue-50",
      bgDark: "dark:bg-blue-500/10",
      iconColor: "text-blue-600 dark:text-blue-400"
    },
    {
      title: "Interactive Practice",
      description: "Live coding workshops where you learn pattern-based problem solving in real-time.",
      icon: Code2,
      color: "from-purple-500 to-pink-500",
      bgLight: "bg-purple-50",
      bgDark: "dark:bg-purple-500/10",
      iconColor: "text-purple-600 dark:text-purple-400"
    }
  ];

  return (
    <div className="min-h-[calc(100vh-80px)] w-full flex items-center justify-center p-4 sm:p-6 md:p-10 relative overflow-hidden bg-gray-50/50 dark:bg-[#0B0F19]">
      
      {/* Premium Animated Background Elements */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-brand-500/10 dark:bg-brand-500/5 rounded-full blur-[100px] opacity-70 animate-pulse mix-blend-multiply dark:mix-blend-lighten pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-[100px] opacity-70 animate-pulse mix-blend-multiply dark:mix-blend-lighten pointer-events-none" style={{ animationDelay: "2s" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[800px] h-[400px] bg-gradient-to-r from-transparent via-brand-500/5 dark:via-brand-500/5 to-transparent blur-3xl pointer-events-none transform -rotate-12" />

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] dark:bg-[url('/grid-dark.svg')] opacity-20 pointer-events-none" />

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center"
      >
        {/* Coming Soon Badge */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-900 border border-brand-200 dark:border-brand-500/20 shadow-sm shadow-brand-500/10">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
            </span>
            <span className="text-[10px] sm:text-xs font-black text-brand-600 dark:text-brand-400 uppercase tracking-[0.2em]">
              Coming Soon
            </span>
          </div>
        </motion.div>

        {/* Hero Section */}
        <motion.div variants={itemVariants} className="text-center max-w-3xl mb-16 space-y-6">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight text-gray-900 dark:text-white leading-[1.1]">
            Upcoming <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-brand-600 via-brand-500 to-indigo-600 dark:from-brand-400 dark:via-brand-500 dark:to-indigo-400">
              Masterclasses
            </span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl font-medium text-gray-500 dark:text-gray-400 leading-relaxed max-w-2xl mx-auto">
            Interview preparation, expert guidance, specialized learning, and interactive practice - all seamlessly integrated in one place. Stay tuned as we build the future of tech education.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-16">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div 
                key={idx}
                className="group relative rounded-3xl bg-white dark:bg-gray-900/80 border border-gray-200 dark:border-gray-800 p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
              >
                {/* Glow Effect on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 dark:group-hover:opacity-10 transition-opacity duration-300 pointer-events-none ${feature.color}`} />
                
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${feature.bgLight} ${feature.bgDark}`}>
                  <Icon size={24} className={feature.iconColor} />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </motion.div>

      </motion.div>
    </div>
  );
}
