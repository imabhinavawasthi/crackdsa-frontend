import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Progress | CrackDSA",
  description: "Track your learning journey and view detailed statistics on your performance.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
