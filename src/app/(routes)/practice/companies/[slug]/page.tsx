"use client";

import { useParams } from "next/navigation";
import TagDetailPageLayout from "@/components/practice/TagDetailPageLayout";
import { fetchCompanyProblems } from "@/api/problems";

export default function PracticeCompaniesDynamicPage() {
  const params = useParams();
  const slug = params.slug as string;

  return (
    <TagDetailPageLayout
      slug={slug}
      fetchFn={fetchCompanyProblems}
      breadcrumbParent={{ title: "Companies", href: "/practice/companies" }}
      titleSuffix="Interview Problems"
      subtitleTemplate={(title) =>
        `Master coding questions frequently asked at ${title}. Solve actual interview problems and review complexity configurations.`
      }
    />
  );
}
