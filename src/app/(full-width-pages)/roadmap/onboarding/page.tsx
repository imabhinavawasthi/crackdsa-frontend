"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Target, Clock, Brain, Compass, Sparkles, AlertCircle,
  ChevronRight, ChevronLeft, Award, Layers, Terminal, BookOpen,
  ArrowRight, Flame, Calendar, Lightbulb, Coffee, Zap, TrendingUp, Star
} from "lucide-react";

import { useRoadmap } from "@/hooks/useRoadmap";
import { RoadmapUserInput } from "@/components/roadmap/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import Button from "@/components/ui/button/Button";
import RoadmapProcessAnimation from "@/components/roadmap/RoadmapProcessAnimation";

// --- Options Constants ---
const GOALS = ["Internship", "Placement", "Job Switch", "Promotion", "Competitive Programming"];
const ROLES = ["Software Engineer", "Frontend Developer", "Backend Developer", "Full Stack Developer", "Data Engineer", "Mobile Developer"];
const TIERS = ["Tier 1 (FAANG)", "Tier 2 Product Companies", "Tier 3 Companies", "Service-Based Companies"];
const URGENCY_LEVELS = ["Casual", "Serious", "Critical"];
const EXP_LEVELS = ["Beginner", "Intermediate", "Advanced"];
const LEARNING_STYLES = ["Theory First", "Problems First", "Balanced"];
const LANGUAGES = ["C++", "Java", "Python", "JavaScript", "Other"];

const STEPS = [
  { id: 'goal', title: 'Goal & Target', icon: Target },
  { id: 'timeline', title: 'Commitment', icon: Calendar },
  { id: 'experience', title: 'DSA Experience', icon: Brain },
  { id: 'topics', title: 'Focus Areas', icon: Compass },
  { id: 'learning', title: 'Learning Style', icon: Lightbulb }
];

// --- Tag Input Component ---
function TagInput({ tags, setTags, placeholder, colorClass }: { tags: string[], setTags: (tags: string[]) => void, placeholder: string, colorClass: string }) {
  const [val, setVal] = useState("");

  const handleAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && val.trim()) {
      e.preventDefault();
      if (!tags.includes(val.trim())) {
        setTags([...tags, val.trim()]);
      }
      setVal("");
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        {tags.map((t) => (
          <motion.span 
            initial={{ scale: 0.8, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }}
            key={t} 
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${colorClass}`}
          >
            {t}
            <button type="button" onClick={() => setTags(tags.filter(x => x !== t))} className="hover:opacity-70 focus:outline-none">
              ×
            </button>
          </motion.span>
        ))}
      </div>
      <div className="relative">
        <Input
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onKeyDown={handleAdd}
          placeholder={placeholder}
          className="h-12 w-full text-sm bg-gray-50/50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 focus:ring-1 focus:ring-brand-500 focus:border-brand-500 outline-none rounded-xl transition-all"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[10px] font-bold text-gray-400 border border-gray-200 dark:border-gray-700 rounded px-1.5 py-0.5 pointer-events-none">
          <span>↵</span> Enter
        </div>
      </div>
    </div>
  );
}

export default function RoadmapOnboardingPage() {
  const router = useRouter();
  const { generateRoadmap, isGenerating } = useRoadmap();
  
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [loadingText, setLoadingText] = useState("Analyzing your profile...");

  // Form State
  const [primaryGoal, setPrimaryGoal] = useState("");
  const [role, setRole] = useState("");
  const [tier, setTier] = useState("");
  const [urgency, setUrgency] = useState("");
  const [duration, setDuration] = useState("12");
  const [hours, setHours] = useState("10");
  const [exp, setExp] = useState("");
  const [solvedCount, setSolvedCount] = useState("");
  const [strongTags, setStrongTags] = useState<string[]>([]);
  const [weakTags, setWeakTags] = useState<string[]>([]);
  const [learningStyle, setLearningStyle] = useState("");
  const [lang, setLang] = useState("");

  // Loading text cycler
  useEffect(() => {
    if (!isGenerating) return;
    
    const messages = [
      "Analyzing your profile constraints...",
      `Synthesizing custom topic nodes for ${role}...`,
      `Curating problem-solving paths in ${lang}...`,
      `Structuring ${duration}-week pacing syllabus...`,
      "Assembling roadmap cockpit..."
    ];
    
    let msgIndex = 0;
    const interval = setInterval(() => {
      msgIndex = (msgIndex + 1) % messages.length;
      setLoadingText(messages[msgIndex]);
    }, 2500);
    
    return () => clearInterval(interval);
  }, [isGenerating, role, lang, duration]);

  const isStepValid = () => {
    switch (step) {
      case 0: return primaryGoal !== "" && role !== "" && tier !== "";
      case 1: return urgency !== "";
      case 2: return exp !== "" && lang !== "" && solvedCount !== "";
      case 3: return true; // Topics are optional
      case 4: return learningStyle !== "";
      default: return true;
    }
  };

  const handleNext = () => {
    if (step < STEPS.length - 1 && isStepValid()) {
      setDirection(1);
      setStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setDirection(-1);
      setStep(prev => prev - 1);
    } else {
      router.push("/roadmap");
    }
  };

  const handleSubmit = async () => {
    const data: RoadmapUserInput = {
      primary_goal: primaryGoal,
      target_role: role,
      target_company_tier: tier,
      urgency_level: urgency,
      duration_weeks: parseInt(duration) || 12,
      time_per_week_hours: parseInt(hours) || 12,
      experience_level: exp,
      problems_solved_count: parseInt(solvedCount) || 0,
      strong_topics: strongTags,
      weak_topics: weakTags,
      learning_style: learningStyle,
      programming_language: lang,
    };
    
    const success = await generateRoadmap(data);
    if (success) {
      router.push("/roadmap");
    }
  };

  const slideVariants: any = {
    hidden: (dir: number) => ({
      x: dir > 0 ? 40 : -40,
      opacity: 0,
      position: 'absolute' as const,
    }),
    visible: {
      x: 0,
      opacity: 1,
      position: 'relative' as const,
      transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -40 : 40,
      opacity: 0,
      position: 'absolute' as const,
      transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
    })
  };

  // Full Screen Assembly Loader
  if (isGenerating) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white dark:bg-gray-950 overflow-hidden px-4">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-brand-500/20 via-indigo-500/10 to-transparent rounded-[100%] blur-[120px] pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 w-full max-w-4xl flex flex-col items-center"
        >
          <RoadmapProcessAnimation />
          
          <div className="mt-8 text-center space-y-4 w-full max-w-md">
            <h2 className="text-2xl font-black text-gray-950 dark:text-white flex items-center justify-center gap-2">
              <Sparkles className="w-6 h-6 text-brand-500 animate-pulse" />
              Building Your Blueprint
            </h2>
            <div className="h-6 overflow-hidden relative border border-gray-200 dark:border-gray-800 rounded-lg bg-gray-50 dark:bg-gray-900/50 flex items-center px-4">
              <motion.p 
                key={loadingText}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="text-xs font-mono font-bold text-gray-500 dark:text-gray-400 w-full text-center"
              >
                {loadingText}
              </motion.p>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Generate simulated preview topics based on inputs
  const simulatedTopics = [
    { title: "Time Complexity", status: "completed" },
    { title: "Arrays & Strings", status: exp === "Beginner" || exp === "" ? "current" : "completed" },
    { title: "Hash Maps & Sets", status: "current" },
    { title: "Two Pointers", status: "locked" },
    { title: weakTags.length > 0 ? weakTags[0] : "Dynamic Programming", status: "locked", highlight: weakTags.length > 0 }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0A0A0A] text-gray-900 dark:text-gray-100 flex overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-brand-500/10 blur-[120px] mix-blend-screen opacity-50" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-indigo-500/10 blur-[100px] mix-blend-screen opacity-50" />
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.03] dark:opacity-[0.02] bg-repeat" />
      </div>

      <div className="flex-1 max-w-[1440px] mx-auto w-full flex flex-col lg:flex-row relative z-10 h-screen">
        
        {/* Left Sidebar: Progress & Preview Card (Sticky) */}
        <div className="hidden lg:flex flex-col w-[450px] shrink-0 border-r border-gray-200 dark:border-gray-800/60 p-10 h-full relative overflow-y-auto">
          <button onClick={() => router.push("/roadmap")} className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-12 w-fit">
            <ArrowLeftIcon />
          </button>

          <div className="space-y-1 mb-8">
            <h1 className="text-2xl font-black tracking-tight">Design Your Curriculum</h1>
            <p className="text-sm text-gray-500 font-medium">Personalize your learning trajectory with AI.</p>
          </div>

          {/* Stepper */}
          <div className="space-y-6 relative mb-12">
            <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-gray-200 dark:bg-gray-800 rounded-full" />
            <motion.div 
              className="absolute left-4 top-4 w-0.5 bg-brand-500 rounded-full transition-all duration-500 ease-out origin-top"
              style={{ height: `${(step / (STEPS.length - 1)) * 100}%` }}
            />
            
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              const isActive = i === step;
              const isPast = i < step;
              return (
                <div key={s.id} className="relative flex items-center gap-4 group cursor-pointer" onClick={() => { if (isPast) setStep(i); }}>
                  <div className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-300 ${
                    isActive ? "border-brand-500 bg-brand-50 dark:bg-brand-500/20 text-brand-500" :
                    isPast ? "border-brand-500 bg-brand-500 text-white" : "border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-gray-400"
                  }`}>
                    {isPast ? <CheckIcon /> : <Icon size={14} strokeWidth={isActive ? 3 : 2} />}
                  </div>
                  <div className="flex flex-col">
                    <span className={`text-[10px] font-black uppercase tracking-wider ${isActive ? "text-brand-500" : isPast ? "text-gray-500" : "text-gray-400"}`}>
                      Step 0{i + 1}
                    </span>
                    <span className={`text-sm font-bold transition-colors ${isActive ? "text-gray-950 dark:text-white" : isPast ? "text-gray-700 dark:text-gray-300" : "text-gray-500"}`}>
                      {s.title}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Dynamic Real-time Preview Card */}
          <motion.div 
            className="mt-auto rounded-3xl border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl overflow-hidden shadow-xl"
            initial={false}
            animate={{ borderColor: "rgba(99, 102, 241, 0.3)" }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-gradient-to-r from-brand-500 to-indigo-600 p-4">
              <div className="flex justify-between items-center text-white/90 mb-1">
                <span className="text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5"><Sparkles size={12} className="animate-pulse" /> Live Preview</span>
                <span className="text-[10px] font-bold opacity-80">{lang || "Select Language"}</span>
              </div>
              <h3 className="text-lg font-black text-white">{role ? `${role} Prep` : "Your Custom Path"}</h3>
            </div>
            
            <div className="p-4 space-y-4">
              <div className="flex gap-2.5">
                <div className="flex-1 bg-gray-100 dark:bg-gray-950 rounded-xl p-2.5 flex flex-col items-center justify-center border border-gray-200 dark:border-gray-800">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Duration</span>
                  <span className="text-sm font-black text-gray-950 dark:text-white">{duration}w</span>
                </div>
                <div className="flex-1 bg-gray-100 dark:bg-gray-950 rounded-xl p-2.5 flex flex-col items-center justify-center border border-gray-200 dark:border-gray-800">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Pacing</span>
                  <span className="text-sm font-black text-gray-950 dark:text-white">{hours}h/w</span>
                </div>
              </div>
              
              <div className="space-y-2 relative before:absolute before:inset-0 before:bg-gradient-to-t before:from-white/80 before:via-transparent before:dark:from-gray-900/80 before:z-10 before:pointer-events-none">
                {simulatedTopics.map((topic, i) => (
                  <div key={i} className={`flex items-center gap-3 p-2 rounded-lg border ${topic.highlight ? "border-brand-500/30 bg-brand-50 dark:bg-brand-500/10" : "border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950"}`}>
                    <div className={`w-2 h-2 rounded-full ${topic.status === "completed" ? "bg-emerald-500" : topic.status === "current" ? "bg-brand-500" : "bg-gray-300 dark:bg-gray-700"}`} />
                    <span className={`text-xs font-bold ${topic.highlight ? "text-brand-600 dark:text-brand-400" : "text-gray-700 dark:text-gray-300"}`}>{topic.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Side: Form Wizard */}
        <div className="flex-1 flex flex-col h-full overflow-y-auto custom-scrollbar">
          {/* Mobile Header */}
          <div className="lg:hidden p-4 sm:p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between bg-white/50 dark:bg-gray-950/50 backdrop-blur-md sticky top-0 z-20">
            <button onClick={handleBack} className="text-gray-400 hover:text-gray-900 dark:hover:text-white"><ArrowLeftIcon /></button>
            <span className="text-xs font-black uppercase tracking-wider text-gray-500">Step {step + 1} of {STEPS.length}</span>
            <div className="w-6" /> {/* Spacer */}
          </div>

          <div className="flex-1 flex items-center justify-center p-6 sm:p-12 lg:p-16">
            <div className="w-full max-w-xl relative min-h-[400px]">
              <AnimatePresence initial={false} custom={direction} mode="wait">
                {step === 0 && (
                  <motion.div key="step0" custom={direction} variants={slideVariants} initial="hidden" animate="visible" exit="exit" className="w-full space-y-8">
                    <div>
                      <h2 className="text-3xl font-black tracking-tight mb-2">What is your primary goal?</h2>
                      <p className="text-sm text-gray-500 font-medium">This helps us structure the depth and rigor of your roadmap.</p>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-3">
                        <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Select Primary Goal</Label>
                        <div className="grid grid-cols-2 gap-3">
                          {GOALS.map(g => (
                            <button
                              key={g} type="button" onClick={() => setPrimaryGoal(g)}
                              className={`p-4 rounded-2xl text-sm font-bold border-2 transition-all flex items-center justify-between group ${
                                primaryGoal === g ? 'bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 border-brand-500 shadow-sm' : 'bg-white dark:bg-gray-900/50 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
                              }`}
                            >
                              {g}
                              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${primaryGoal === g ? "border-brand-500" : "border-gray-300 dark:border-gray-700"}`}>
                                {primaryGoal === g && <div className="w-2 h-2 rounded-full bg-brand-500" />}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Target Role & Tier</Label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <Select value={role} onChange={(e) => setRole(e.target.value)} className="h-14 rounded-xl bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 text-sm font-semibold focus:ring-brand-500 focus:border-brand-500 outline-none">
                            <option value="" disabled>Select Target Role</option>
                            {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                          </Select>
                          <Select value={tier} onChange={(e) => setTier(e.target.value)} className="h-14 rounded-xl bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 text-sm font-semibold focus:ring-brand-500 focus:border-brand-500 outline-none">
                            <option value="" disabled>Select Company Tier</option>
                            {TIERS.map(t => <option key={t} value={t}>{t}</option>)}
                          </Select>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 1 && (
                  <motion.div key="step1" custom={direction} variants={slideVariants} initial="hidden" animate="visible" exit="exit" className="w-full space-y-8">
                    <div>
                      <h2 className="text-3xl font-black tracking-tight mb-2">Timeline & Commitment</h2>
                      <p className="text-sm text-gray-500 font-medium">How much time can you dedicate to your preparation?</p>
                    </div>

                    <div className="space-y-8">
                      <div className="space-y-3">
                        <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Urgency Level</Label>
                        <div className="grid grid-cols-3 gap-3">
                          {URGENCY_LEVELS.map(u => (
                            <button
                              key={u} type="button" onClick={() => setUrgency(u)}
                              className={`p-4 rounded-2xl text-sm font-bold border-2 transition-all flex flex-col items-center gap-2 ${
                                urgency === u ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500 shadow-sm' : 'bg-white dark:bg-gray-900/50 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
                              }`}
                            >
                              {u === "Casual" && <Coffee size={20} className={urgency === u ? "text-amber-500" : "text-gray-400"} />}
                              {u === "Serious" && <Clock size={20} className={urgency === u ? "text-amber-500" : "text-gray-400"} />}
                              {u === "Critical" && <Zap size={20} className={urgency === u ? "text-amber-500" : "text-gray-400"} />}
                              {u}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="p-6 rounded-2xl border-2 border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 space-y-6 shadow-sm">
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <Label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Duration</Label>
                            <span className="text-lg font-black text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-500/10 px-3 py-1 rounded-xl">{duration} Weeks</span>
                          </div>
                          <Input type="range" min="2" max="24" value={duration} onChange={(e) => setDuration(e.target.value)} className="w-full accent-brand-500 h-2 bg-gray-200 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer" />
                        </div>
                        
                        <div className="h-px w-full bg-gray-200 dark:bg-gray-800" />
                        
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <Label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Hours Per Week</Label>
                            <span className="text-lg font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-3 py-1 rounded-xl">{hours} Hours</span>
                          </div>
                          <Input type="range" min="2" max="40" value={hours} onChange={(e) => setHours(e.target.value)} className="w-full accent-indigo-500 h-2 bg-gray-200 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div key="step2" custom={direction} variants={slideVariants} initial="hidden" animate="visible" exit="exit" className="w-full space-y-8">
                    <div>
                      <h2 className="text-3xl font-black tracking-tight mb-2">Current DSA Experience</h2>
                      <p className="text-sm text-gray-500 font-medium">Tell us where you stand so we can calibrate the difficulty.</p>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-3">
                        <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Experience Level</Label>
                        <div className="grid grid-cols-3 gap-3">
                          {EXP_LEVELS.map(e => (
                            <button
                              key={e} type="button" onClick={() => setExp(e)}
                              className={`p-4 rounded-2xl text-sm font-bold border-2 transition-all flex flex-col items-center gap-2 ${
                                exp === e ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500 shadow-sm' : 'bg-white dark:bg-gray-900/50 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
                              }`}
                            >
                              {e === "Beginner" && <Star size={20} className={exp === e ? "text-blue-500" : "text-gray-400"} />}
                              {e === "Intermediate" && <TrendingUp size={20} className={exp === e ? "text-blue-500" : "text-gray-400"} />}
                              {e === "Advanced" && <Award size={20} className={exp === e ? "text-blue-500" : "text-gray-400"} />}
                              {e}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Approximate Problems Solved</Label>
                        <Input
                          type="number"
                          value={solvedCount}
                          onChange={(e) => setSolvedCount(e.target.value)}
                          placeholder="e.g. 50"
                          className="h-14 rounded-xl bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 text-lg font-black focus:ring-brand-500 focus:border-brand-500 outline-none"
                        />
                      </div>
                      
                      <div className="space-y-3 pt-2">
                        <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Preferred Programming Language</Label>
                        <div className="flex flex-wrap gap-2">
                          {LANGUAGES.map(l => (
                            <button
                              key={l} type="button" onClick={() => setLang(l)}
                              className={`px-4 py-2.5 rounded-xl text-xs font-bold border-2 transition-all ${
                                lang === l ? 'bg-gray-950 text-white dark:bg-white dark:text-gray-950 border-gray-950 dark:border-white shadow-md' : 'bg-white dark:bg-gray-900/50 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
                              }`}
                            >
                              {l}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div key="step3" custom={direction} variants={slideVariants} initial="hidden" animate="visible" exit="exit" className="w-full space-y-8">
                    <div>
                      <h2 className="text-3xl font-black tracking-tight mb-2">Focus Areas</h2>
                      <p className="text-sm text-gray-500 font-medium">Highlight areas you excel in and areas that need intense focus.</p>
                    </div>

                    <div className="space-y-8">
                      <div className="space-y-3 bg-white dark:bg-gray-900/40 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-2 h-2 rounded-full bg-emerald-500" />
                          <Label className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider m-0">Strong Topics</Label>
                        </div>
                        <p className="text-xs text-gray-500 mb-4">Topics you already understand well. We will include fewer problems here.</p>
                        <TagInput tags={strongTags} setTags={setStrongTags} placeholder="e.g. Arrays, Two Pointers" colorClass="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20" />
                      </div>

                      <div className="space-y-3 bg-white dark:bg-gray-900/40 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-2 h-2 rounded-full bg-red-500" />
                          <Label className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider m-0">Weak Topics</Label>
                        </div>
                        <p className="text-xs text-gray-500 mb-4">Topics you struggle with. We will prioritize foundational learning for these.</p>
                        <TagInput tags={weakTags} setTags={setWeakTags} placeholder="e.g. Dynamic Programming, Graphs" colorClass="bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20" />
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 4 && (
                  <motion.div key="step4" custom={direction} variants={slideVariants} initial="hidden" animate="visible" exit="exit" className="w-full space-y-8">
                    <div>
                      <h2 className="text-3xl font-black tracking-tight mb-2">Learning Style</h2>
                      <p className="text-sm text-gray-500 font-medium">How do you prefer to absorb new concepts?</p>
                    </div>

                    <div className="space-y-6">
                      <div className="grid grid-cols-1 gap-4">
                        <button
                          type="button" onClick={() => setLearningStyle("Theory First")}
                          className={`p-5 rounded-2xl text-left border-2 transition-all flex gap-4 items-start ${
                            learningStyle === "Theory First" ? 'bg-purple-50 dark:bg-purple-500/10 border-purple-500 shadow-sm' : 'bg-white dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
                          }`}
                        >
                          <div className={`p-3 rounded-xl shrink-0 ${learningStyle === "Theory First" ? "bg-purple-500 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-500"}`}>
                            <BookOpen size={20} />
                          </div>
                          <div>
                            <h3 className={`text-base font-bold mb-1 ${learningStyle === "Theory First" ? "text-purple-700 dark:text-purple-400" : "text-gray-900 dark:text-white"}`}>Theory First</h3>
                            <p className="text-xs text-gray-500 font-medium leading-relaxed">Prioritize articles and video lectures to build a strong foundation before jumping into coding problems.</p>
                          </div>
                        </button>

                        <button
                          type="button" onClick={() => setLearningStyle("Problems First")}
                          className={`p-5 rounded-2xl text-left border-2 transition-all flex gap-4 items-start ${
                            learningStyle === "Problems First" ? 'bg-brand-50 dark:bg-brand-500/10 border-brand-500 shadow-sm' : 'bg-white dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
                          }`}
                        >
                          <div className={`p-3 rounded-xl shrink-0 ${learningStyle === "Problems First" ? "bg-brand-500 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-500"}`}>
                            <Terminal size={20} />
                          </div>
                          <div>
                            <h3 className={`text-base font-bold mb-1 ${learningStyle === "Problems First" ? "text-brand-700 dark:text-brand-400" : "text-gray-900 dark:text-white"}`}>Problems First</h3>
                            <p className="text-xs text-gray-500 font-medium leading-relaxed">Jump straight into hands-on problem solving. Learn by doing and debugging code.</p>
                          </div>
                        </button>

                        <button
                          type="button" onClick={() => setLearningStyle("Balanced")}
                          className={`p-5 rounded-2xl text-left border-2 transition-all flex gap-4 items-start ${
                            learningStyle === "Balanced" ? 'bg-indigo-50 dark:bg-indigo-500/10 border-indigo-500 shadow-sm' : 'bg-white dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
                          }`}
                        >
                          <div className={`p-3 rounded-xl shrink-0 ${learningStyle === "Balanced" ? "bg-indigo-500 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-500"}`}>
                            <Layers size={20} />
                          </div>
                          <div>
                            <h3 className={`text-base font-bold mb-1 ${learningStyle === "Balanced" ? "text-indigo-700 dark:text-indigo-400" : "text-gray-900 dark:text-white"}`}>Balanced</h3>
                            <p className="text-xs text-gray-500 font-medium leading-relaxed">A steady mix of theory and practice. The standard and recommended way to prepare.</p>
                          </div>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Footer Navigation */}
          <div className="sticky bottom-0 left-0 right-0 p-6 sm:p-8 bg-white/80 dark:bg-[#0A0A0A]/80 backdrop-blur-xl border-t border-gray-200 dark:border-gray-800/60 flex items-center justify-between z-20">
            <Button 
              variant="outline" 
              onClick={handleBack} 
              className="px-6 py-4 rounded-xl text-sm font-bold border-2 border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900"
            >
              {step === 0 ? "Cancel" : <><ChevronLeft size={16} className="mr-2" /> Back</>}
            </Button>
            
            {step === STEPS.length - 1 ? (
              <Button 
                onClick={handleSubmit} 
                disabled={!isStepValid()}
                className="px-8 py-4 rounded-xl text-sm font-black bg-brand-600 hover:bg-brand-700 text-white shadow-xl shadow-brand-500/20 active:scale-95 transition-all flex items-center gap-2 group disabled:opacity-50 disabled:active:scale-100"
              >
                Assemble My Roadmap
                <Sparkles size={16} className="group-hover:animate-pulse" />
              </Button>
            ) : (
              <Button 
                onClick={handleNext} 
                disabled={!isStepValid()}
                className="px-8 py-4 rounded-xl text-sm font-black bg-gray-950 dark:bg-white text-white dark:text-gray-950 hover:bg-gray-800 dark:hover:bg-gray-100 active:scale-95 transition-all flex items-center gap-2 group shadow-xl disabled:opacity-50 disabled:active:scale-100"
              >
                Continue
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ArrowLeftIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
  );
}

function CheckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
  );
}
