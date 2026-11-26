import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bookmarked Problems | crackDSA",
  description: "Review all your saved problems and coding challenges on crackDSA.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
