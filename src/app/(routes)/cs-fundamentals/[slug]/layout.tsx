import { Metadata } from "next";
import JsonLd from "@/components/common/JsonLd";
import { CS_FUNDAMENTALS_TOPICS } from "@/config/cs-fundamentals.config";

export async function generateStaticParams() {
  return CS_FUNDAMENTALS_TOPICS.map((topic) => ({
    slug: topic.slug,
  }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { slug } = await props.params;
  const title = (slug || "")
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return {
    title: `${title} - CS Fundamentals | crackDSA`,
    description: `Complete guide, downloadable PDF notes, and interview questions for ${title} on CrackDSA.`,
    alternates: {
      canonical: `https://crackdsa.com/cs-fundamentals/${slug}`,
    },
  };
}

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const title = (slug || "")
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
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
        name: "CS Fundamentals",
        item: "https://crackdsa.com/cs-fundamentals",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: title,
        item: `https://crackdsa.com/cs-fundamentals/${slug}`,
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
