import { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> | { slug: string } };

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const titleFallback = params.slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
    
  return {
    title: `${titleFallback} | CrackDSA`,
    description: `Solve ${titleFallback} on CrackDSA's interactive coding workspace.`,
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
