import type { Masterclass } from "@/types/masterclass";
import dsaRoadmap from "@/data/masterclasses/dsa-roadmap.json";

// Dummy data source. Replace the bodies below with real API calls later;
// callers only depend on these signatures.
const MASTERCLASSES: Record<string, Masterclass> = {
  "dsa-roadmap": dsaRoadmap as Masterclass,
};

export async function fetchMasterclass(slug: string): Promise<Masterclass | null> {
  return MASTERCLASSES[slug] ?? null;
}

export async function fetchMasterclassSlugs(): Promise<string[]> {
  return Object.keys(MASTERCLASSES);
}
