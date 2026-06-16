"use client"

import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import LoadingScreen from '@/components/common/LoadingScreen';
import NextTopLoader from 'nextjs-toploader';
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
              var supportDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches === true;
              if (!theme && supportDarkMode) theme = 'dark';
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

function AppContent({ children }: { children: React.ReactNode }) {
  const { isLoading } = useTheme();

  return (
    <>
      <LoadingScreen isLoading={isLoading} />
      <div className={isLoading ? "invisible" : "visible"}>
        <SidebarProvider>{children}</SidebarProvider>
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
