"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { AlertCircle, Sparkles } from "lucide-react";
import { useRoadmap } from "@/hooks/useRoadmap";
import Button from "@/components/ui/button/Button";
import { fadeInUp } from "@/utils/animations";

import RoadmapLanding from "@/components/roadmap/RoadmapLanding";
import ActiveRoadmapCard from "@/components/roadmap/ActiveRoadmapCard";
import PausedRoadmapList from "@/components/roadmap/PausedRoadmapList";

export default function RoadmapDashboard() {
  const router = useRouter();
  const { isLoggedIn, user, isLoading: isAuthLoading } = useAuth();
  const {
    activeRoadmap,
    allRoadmaps,
    isLoading: isRoadmapLoading,
    fetchActiveRoadmap,
    fetchAllRoadmaps,
    activateRoadmap,
    deleteRoadmap
  } = useRoadmap();

  useEffect(() => {
    if (isLoggedIn) {
      fetchActiveRoadmap();
      fetchAllRoadmaps();
    }
  }, [isLoggedIn, fetchActiveRoadmap, fetchAllRoadmaps]);

  if (isAuthLoading || (isLoggedIn && isRoadmapLoading)) {
    return (
      <div className="space-y-10 max-w-6xl mx-auto py-8 px-4 animate-pulse">
        <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4">
          <div className="space-y-3 w-full sm:w-1/3">
            <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded-lg w-3/4"></div>
            <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded-lg w-1/2"></div>
          </div>
          <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded-full w-48"></div>
        </div>
        <div className="h-20 bg-gray-200 dark:bg-gray-800 rounded-xl w-full"></div>
        <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-3xl w-full"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-40 bg-gray-200 dark:bg-gray-800 rounded-2xl"></div>
          <div className="h-40 bg-gray-200 dark:bg-gray-800 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  // --- EMPTY STATE / PREMIUM LANDING ---
  if (!isLoggedIn || (!activeRoadmap && allRoadmaps.length === 0)) {
    return <RoadmapLanding isLoggedIn={isLoggedIn} />;
  }

  const inactiveRoadmaps = allRoadmaps.filter(r => r.id !== activeRoadmap?.id);
  const totalRoadmaps = allRoadmaps.length;

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-8 px-4 relative">
      
      {/* Soft background mesh */}
      <div className="absolute top-0 right-1/4 w-[350px] h-[350px] bg-gradient-to-tr from-brand-500/5 to-indigo-500/5 rounded-full blur-[90px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[250px] h-[250px] bg-brand-500/5 rounded-full blur-[80px] pointer-events-none" />

      {/* Greeting Header */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-2"
      >
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white">
            Your Roadmaps
          </h1>
          <p className="mt-1 text-sm font-medium text-gray-500 dark:text-gray-400">
            Track metrics and switch study plans from your personalized cockpit.
          </p>
        </div>

        <Button 
          className="bg-brand-600 hover:bg-brand-500 text-white rounded-xl px-6 py-3 h-auto text-sm font-bold shadow-md flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
          onClick={() => router.push("/roadmap/onboarding")}
        >
          <Sparkles size={18} />
          Create New Path
        </Button>
      </motion.div>

      {/* Active Roadmap Showcase */}
      {activeRoadmap && <ActiveRoadmapCard roadmap={activeRoadmap} />}

      {/* Paused Roadmaps Grid */}
      <PausedRoadmapList 
        roadmaps={inactiveRoadmaps} 
        onDelete={deleteRoadmap} 
        onActivate={activateRoadmap} 
      />

    </div>
  );
}
