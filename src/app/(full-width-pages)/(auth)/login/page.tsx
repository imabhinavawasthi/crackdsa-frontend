import LoginForm from "@/components/auth/LoginForm";
import { Metadata } from "next";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Login | CrackDSA",
  description: "Sign in to CrackDSA to access your personalized DSA roadmap and tracking.",
};

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-10 w-10 text-brand-500 animate-spin" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
