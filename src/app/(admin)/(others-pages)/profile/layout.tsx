import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile | CrackDSA",
  description: "View and manage your CrackDSA account profile.",
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
