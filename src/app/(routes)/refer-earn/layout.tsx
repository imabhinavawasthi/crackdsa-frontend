import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refer & Earn | CrackDSA",
  description: "Invite your friends to CrackDSA and earn rewards.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
