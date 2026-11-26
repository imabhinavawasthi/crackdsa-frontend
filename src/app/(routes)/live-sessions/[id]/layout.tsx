import { Metadata } from "next";
import { BACKEND_URL } from "@/config/api";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/live-classes/${params.id}`);
    if (res.ok) {
      const data = await res.json();
      if (data?.class_name) {
        return {
          title: `${data.class_name} | crackDSA`,
          description: data.class_topic ? `Live Class: ${data.class_name} - ${data.class_topic}` : data.class_name,
        };
      }
    }
  } catch {}
  return {
    title: "Live Class Details | crackDSA",
    description: "Interactive live class and mentorship session on crackDSA.",
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
