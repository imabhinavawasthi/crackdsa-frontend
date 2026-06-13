import { Phase, Topic } from "@/components/roadmap/types";

export function getPhaseProgress(phase: Phase) {
  const total = phase.topics.reduce((acc, t) => acc + t.items.length, 0);
  const done = phase.topics.reduce(
    (acc, t) => acc + t.items.filter((p) => p.status === "completed").length,
    0
  );
  return { total, done, percent: total > 0 ? Math.round((done / total) * 100) : 0 };
}

export function getTopicProgress(topic: Topic) {
  const total = topic.items.length;
  const done = topic.items.filter((p) => p.status === "completed").length;
  return { total, done, percent: total > 0 ? Math.round((done / total) * 100) : 0 };
}

export function getOverallProgress(phases: Phase[]) {
  const total = phases.reduce(
    (acc, phase) => acc + phase.topics.reduce((a, t) => a + t.items.length, 0),
    0
  );
  const done = phases.reduce(
    (acc, phase) =>
      acc + phase.topics.reduce((a, t) => a + t.items.filter((p) => p.status === "completed").length, 0),
    0
  );
  return { total, done, percent: total > 0 ? Math.round((done / total) * 100) : 0 };
}

export function getCurrentTopic(phases: Phase[]): Topic | null {
  for (const phase of phases) {
    for (const topic of phase.topics) {
      if (topic.status === "in-progress") return topic;
      if (topic.items.some((i) => i.status === "current")) return topic;
    }
  }
  return null;
}

export const phaseColorMap: Record<
  string,
  { gradient: string; ring: string; bg: string; text: string; badge: string; progressBar: string }
> = {
  emerald: {
    gradient: "from-emerald-500 to-teal-500",
    ring: "ring-emerald-500/20",
    bg: "bg-emerald-50 dark:bg-emerald-500/10",
    text: "text-emerald-600 dark:text-emerald-400",
    badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
    progressBar: "bg-emerald-500",
  },
  blue: {
    gradient: "from-blue-500 to-indigo-500",
    ring: "ring-blue-500/20",
    bg: "bg-blue-50 dark:bg-blue-500/10",
    text: "text-blue-600 dark:text-blue-400",
    badge: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300",
    progressBar: "bg-blue-500",
  },
  purple: {
    gradient: "from-purple-500 to-pink-500",
    ring: "ring-purple-500/20",
    bg: "bg-purple-50 dark:bg-purple-500/10",
    text: "text-purple-600 dark:text-purple-400",
    badge: "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300",
    progressBar: "bg-purple-500",
  },
};
