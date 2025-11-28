import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/providers/ToastProvider";
import ErrorBoundary from "@/components/ErrorBoundary";
import NavigationLoader from "@/components/NavigationLoader";

export const metadata: Metadata = {
  title: "Dashboard - Maglo",
  description: "Modern dashboard application",
  icons: {
    icon: "/images/favicon.png",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    viewportFit: "cover",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ErrorBoundary>
          <Suspense fallback>
            <NavigationLoader />
          </Suspense>
          <AuthProvider>
            <ToastProvider />
            {children}
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
