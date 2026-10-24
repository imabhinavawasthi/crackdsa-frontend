import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Profile | crackDSA",
  description: "Update your profile details, university, and preferences on crackDSA.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
