"use client"

import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { OnboardingRerouteGate } from '@/components/auth/OnboardingRerouteGate';
import LoadingScreen from '@/components/common/LoadingScreen';
import NextTopLoader from 'nextjs-toploader';
import { usePathname } from 'next/navigation';
import "flatpickr/dist/flatpickr.css";

// This script will run as early as possible to prevent theme flicker
export const ThemeScript = () => {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            try {
              var theme = localStorage.getItem('theme');
              // Default to light theme unless explicitly saved as 'dark'
              if (theme === 'dark') {
                document.documentElement.classList.add('dark');
              } else {
                document.documentElement.classList.remove('dark');
              }
            } catch (e) {}
          })();
        `,
      }}
    />
  );
};

const isProtectedRoute = (path: string): boolean => {
  return (
    path.startsWith("/dashboard") ||
    path.startsWith("/profile") ||
    path.startsWith("/admin") ||
    path.startsWith("/checkout") ||
    path.startsWith("/onboarding") ||
    path.startsWith("/progress") ||
    path.startsWith("/resume") ||
    path.startsWith("/roadmap/onboarding")
  );
};

function AppContent({ children }: { children: React.ReactNode }) {
  const { isLoading: isThemeLoading } = useTheme();
  const { isLoading: isAuthLoading } = useAuth();
  const pathname = usePathname();

  // For protected routes, wait for auth to finish fetching profile before showing page
  const isProtected = pathname ? isProtectedRoute(pathname) : false;
  const showLoading = isThemeLoading || (isProtected && isAuthLoading);

  return (
    <>
      <LoadingScreen isLoading={showLoading} />
      <div className={showLoading ? "invisible" : "visible"}>
        <SidebarProvider>
          <OnboardingRerouteGate>
            {children}
          </OnboardingRerouteGate>
        </SidebarProvider>
      </div>
    </>
  );
}

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NextTopLoader color="#465FFF" showSpinner={false} zIndex={100000} />
      <ThemeProvider>
        <AuthProvider>
          <AppContent>{children}</AppContent>
        </AuthProvider>
      </ThemeProvider>
    </>
  );
}
