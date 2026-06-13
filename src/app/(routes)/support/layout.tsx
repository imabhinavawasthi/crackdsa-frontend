import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Help & Support | CrackDSA",
  description: "Get technical assistance, submit feedback, or contact the CrackDSA team directly via WhatsApp or email.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
