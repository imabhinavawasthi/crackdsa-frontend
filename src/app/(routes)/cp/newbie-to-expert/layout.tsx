import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Newbie to Expert CP Sheet | crackDSA",
  description: "Curated 175 Competitive Programming problem sheet from Newbie to Expert with video editorials by ICPC AIR 57 Abhinav Awasthi.",
  alternates: {
    canonical: "https://crackdsa.com/cp/newbie-to-expert",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
