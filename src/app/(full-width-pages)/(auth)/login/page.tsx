import LoginForm from "@/components/auth/LoginForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | CrackDSA",
  description: "Sign in to CrackDSA to access your personalized DSA roadmap and tracking.",
};

export default function LoginPage() {
  return <LoginForm />;
}
