"use client";

import { useParams } from "next/navigation";
import WorkInProgress from "@/components/common/WorkInProgress";

export default function CaseStudyDynamicPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const title = slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ") + " Collection";

  return <WorkInProgress title={title} />;
}
