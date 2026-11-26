import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Live Classes & Mentorship | crackDSA",
  description: "Join interactive live classes, code walkthroughs, and mentorship sessions with top engineers.",
  alternates: {
    canonical: "https://crackdsa.com/live-classes",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
