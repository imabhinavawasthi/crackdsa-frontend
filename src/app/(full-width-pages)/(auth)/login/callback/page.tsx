"use client";
import React, { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { setStoredToken } from "@/functions/auth";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

/**
 * Auth Callback Page Content
 * Handles the actual logic of capturing the token.
 */
function AuthCallbackPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refetch } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      // 1. Extract access_token from URL searchParams
      const accessToken = searchParams.get("access_token");
      
      // 2. Fallback: Check if it's in the hash (Supabase sometimes puts it there)
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const tokenFromHash = hashParams.get("access_token");
      
      const finalToken = accessToken || tokenFromHash;

      if (finalToken) {
        // 3. Store the token locally
        setStoredToken(finalToken);
        
        // 4. Force a profile refetch in AuthContext
        await refetch();
        
        // 5. Check localStorage for persistent redirect path
        const redirectTo = localStorage.getItem("crackdsa_login_redirect") || "/";
        localStorage.removeItem("crackdsa_login_redirect"); // Cleanup
        
        // 6. Redirect to the original page or home
        router.replace(redirectTo);
      } else {
        // No token found, redirect to login with error
        console.error("No access_token found in callback URL");
        router.replace("/login?error=missing_token");
      }
    };

    handleCallback();
  }, [router, searchParams, refetch]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-gray-900 px-6">
      <div className="flex flex-col items-center w-full max-w-sm p-8 text-center bg-gray-50 dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/10 shadow-xl shadow-gray-200/50 dark:shadow-none">
        <Loader2 className="h-10 w-10 text-brand-500 animate-spin mb-6" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 underline decoration-brand-500/30">
          Finalizing Login
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
          We're securely setting up your CrackDSA session. This will only take a moment...
        </p>
      </div>
    </div>
  );
}

/**
 * Main Auth Callback Page
 * Wraps Content in Suspense as required by Next.js for useSearchParams().
 */
export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-10 w-10 text-brand-500 animate-spin" />
      </div>
    }>
      <AuthCallbackPageContent />
    </Suspense>
  );
}
