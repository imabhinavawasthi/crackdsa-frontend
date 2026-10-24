import { Metadata } from "next";
import { BACKEND_URL } from "@/config/api";

type Props = {
  params: Promise<{ platform: string; contestSlug: string; problemSlug: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { platform, contestSlug, problemSlug } = await props.params;
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/contests/${platform}/${contestSlug}/${problemSlug}`);
    if (res.ok) {
      const data = await res.json();
      const problemTitle = data?.problem?.title;
      const contestTitle = data?.contest?.contest;
      if (problemTitle) {
        return {
          title: `${problemTitle} - ${contestTitle || "Contest"} | crackDSA`,
          description: `Problem editorial, video walkthrough, and code solution for ${problemTitle}.`,
        };
      }
    }
  } catch {}

  const formattedProblem = (problemSlug || "")
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return {
    title: `${formattedProblem} Editorial | crackDSA`,
    description: `Problem solution and editorial for ${formattedProblem}.`,
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
