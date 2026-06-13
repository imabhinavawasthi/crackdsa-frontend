"use client";

import { useParams } from "next/navigation";
import TagDetailPageLayout from "@/components/practice/TagDetailPageLayout";
import { fetchTopicProblems } from "@/api/problems";

export default function PracticeTopicDynamicPage() {
  const params = useParams();
  const slug = params.slug as string;

  return (
    <TagDetailPageLayout
      slug={slug}
      fetchFn={fetchTopicProblems}
      breadcrumbParent={{ title: "Topics", href: "/practice/topics" }}
      titleSuffix="Problems"
      subtitleTemplate={(title) =>
        `Master coding questions on ${title}. Solve interactive exercises, explore complexity profiles, and prepare for interviews.`
      }
    />
  );
}
