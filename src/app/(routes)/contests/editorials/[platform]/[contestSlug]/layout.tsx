import { Metadata } from "next";
import { BACKEND_URL } from "@/config/api";

type Props = {
  params: Promise<{ platform: string; contestSlug: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { platform, contestSlug } = await props.params;
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/contests/${platform}/${contestSlug}`);
    if (res.ok) {
      const data = await res.json();
      if (data?.contest) {
        return {
          title: `${data.contest} Editorials | crackDSA`,
          description: `Detailed problem solutions and video editorials for ${data.contest}.`,
        };
      }
    }
  } catch {}

  const platformTitle = platform ? platform.charAt(0).toUpperCase() + platform.slice(1) : "";
  const formattedSlug = (contestSlug || "")
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return {
    title: `${platformTitle} ${formattedSlug} Editorials | crackDSA`,
    description: `Problem walkthroughs and video solutions for ${platformTitle} ${formattedSlug}.`,
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
