import { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchMasterclass, fetchMasterclassSlugs } from "@/api/masterclasses";
import MasterclassDetail from "@/components/masterclass/MasterclassDetail";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = await fetchMasterclassSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const masterclass = await fetchMasterclass(slug);
  if (!masterclass) return {};
  return {
    title: `${masterclass.title} | CrackDSA`,
    description: masterclass.description,
  };
}

export default async function MasterclassPage({ params }: Props) {
  const { slug } = await params;
  const masterclass = await fetchMasterclass(slug);
  if (!masterclass) notFound();
  return <MasterclassDetail masterclass={masterclass} />;
}
