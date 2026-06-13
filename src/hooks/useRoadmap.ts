"use client";

import { useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { RoadmapDBRecord, RoadmapUserInput } from "@/components/roadmap/types";
import { 
  generateRoadmapApi, 
  fetchUserRoadmapsApi, 
  fetchActiveRoadmapApi, 
  activateRoadmapApi, 
  renameRoadmapApi, 
  deleteRoadmapApi 
} from "@/api/roadmap";

export function useRoadmap() {
  const { isLoggedIn } = useAuth();
  const [activeRoadmap, setActiveRoadmap] = useState<RoadmapDBRecord | null>(null);
  const [allRoadmaps, setAllRoadmaps] = useState<RoadmapDBRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchActiveRoadmap = useCallback(async () => {
    if (!isLoggedIn) {
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      const data = await fetchActiveRoadmapApi();
      setActiveRoadmap(data);
    } catch (err: any) {
      setError(err.message || "Error fetching active roadmap");
    } finally {
      setIsLoading(false);
    }
  }, [isLoggedIn]);

  const fetchAllRoadmaps = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await fetchUserRoadmapsApi();
      setAllRoadmaps(data);
    } catch (err) {
      console.error(err);
      setAllRoadmaps([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const generateRoadmap = async (input: RoadmapUserInput) => {
    try {
      setIsGenerating(true);
      setError(null);
      const newRoadmap = await generateRoadmapApi(input);
      setActiveRoadmap(newRoadmap);
      await fetchAllRoadmaps();
      return true;
    } catch (err: any) {
      setError(err.message || "Error generating roadmap");
      return false;
    } finally {
      setIsGenerating(false);
    }
  };

  const activateRoadmap = async (id: string) => {
    try {
      const success = await activateRoadmapApi(id);
      if (!success) throw new Error("Activation failed");

      await fetchActiveRoadmap();
      await fetchAllRoadmaps();
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const renameRoadmap = async (id: string, title: string) => {
    try {
      const success = await renameRoadmapApi(id, title);
      if (!success) throw new Error("Rename failed");

      await fetchAllRoadmaps();
      if (activeRoadmap?.id === id) {
        setActiveRoadmap((prev) => prev ? { ...prev, title } : null);
      }
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const deleteRoadmap = async (id: string) => {
    try {
      const success = await deleteRoadmapApi(id);
      if (!success) throw new Error("Delete failed");

      await fetchAllRoadmaps();
      if (activeRoadmap?.id === id) {
        await fetchActiveRoadmap(); 
      }
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  return {
    activeRoadmap,
    allRoadmaps,
    isLoading,
    isGenerating,
    error,
    fetchActiveRoadmap,
    fetchAllRoadmaps,
    generateRoadmap,
    activateRoadmap,
    renameRoadmap,
    deleteRoadmap,
  };
}
