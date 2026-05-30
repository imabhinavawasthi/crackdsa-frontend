import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard | CrackDSA",
  description: "CrackDSA Admin Cockpit. Monitor course metrics and configure system parameters.",
};

export default function AdminHomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
