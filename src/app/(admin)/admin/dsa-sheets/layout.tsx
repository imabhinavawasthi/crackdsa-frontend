import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DSA Sheets | CrackDSA Admin",
  description: "Manage DSA preparation sheets, configure patterns, and attach problems.",
};

export default function DSASheetsAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
