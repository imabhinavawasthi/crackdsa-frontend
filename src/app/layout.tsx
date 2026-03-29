"use client"

import { Outfit } from 'next/font/google';
import './globals.css';
import "flatpickr/dist/flatpickr.css";
import NextTopLoader from 'nextjs-toploader';
import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import LoadingScreen from '@/components/common/LoadingScreen';

const outfit = Outfit({
  subsets: ["latin"],
});

// This script will run as early as possible to prevent theme flicker
const ThemeScript = () => {
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className={`${outfit.className} dark:bg-gray-900 transition-colors duration-300`}>
        <NextTopLoader color="#465FFF" showSpinner={false} zIndex={100000} />
        <ThemeProvider>
          <AuthProvider>
            <AppContent>{children}</AppContent>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
