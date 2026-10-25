import { SolveWorkspace } from "@/components/solve/SolveWorkspace";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const formatted = slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return {
    title: `${formatted} - Solve | crackDSA`,
    description: `Solve ${formatted} with testcases, code editor, and complete editorial walkthrough.`,
  };
}

export default async function SolveSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <SolveWorkspace initialSlug={slug} />;
}
