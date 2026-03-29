"use client";

import { useParams } from "next/navigation";
import WorkInProgress from "@/components/common/WorkInProgress";

export default function DSASheetDynamicPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  // Format slug for display (e.g. "crackdsa-75" -> "CrackDSA 75")
  const title = slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return <WorkInProgress title={title} />;
}
