import { Metadata } from "next";
import JsonLd from "@/components/common/JsonLd";

type Props = { params: Promise<{ slug: string }> | { slug: string } };

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const titleFallback = params.slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  return {
    title: `${titleFallback} | CrackDSA`,
    description: `Solve problems from the ${titleFallback} sheet on CrackDSA with interactive tracking and detailed solutions.`,
    alternates: {
      canonical: `https://crackdsa.com/dsa-sheet/${params.slug}`,
    },
  };
}

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }> | { slug: string };
}) {
  const resolvedParams = await params;
  const titleFallback = resolvedParams.slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://crackdsa.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "DSA Sheets",
        item: "https://crackdsa.com/dsa-sheet",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: titleFallback,
        item: `https://crackdsa.com/dsa-sheet/${resolvedParams.slug}`,
      },
    ],
  };

  return (
    <>
      <JsonLd schema={breadcrumbSchema} />
      {children}
    </>
  );
}
