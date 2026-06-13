import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Community | CrackDSA",
  description: "Connect with fellow learners, discuss approaches, and share experiences.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
