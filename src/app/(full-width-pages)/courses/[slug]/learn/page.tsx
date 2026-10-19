import { redirect } from "next/navigation";

export default async function LearnRedirectPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ item?: string }>;
}) {
  const { slug } = await params;
  const sParams = await searchParams;
  const targetSlug = slug === "data-structures-algorithms-mastery-program" ? "dsa" : slug;
  const query = sParams?.item ? `?item=${encodeURIComponent(sParams.item)}` : "";
  redirect(`/course/${targetSlug}/learn${query}`);
}
