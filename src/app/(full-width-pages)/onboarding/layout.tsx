import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Welcome to crackDSA - Set Up Your Profile | crackDSA",
  description: "Complete your profile setup to personalize your tech learning journey on crackDSA.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
