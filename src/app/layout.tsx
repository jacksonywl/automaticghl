import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Suspense } from "react";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AutomaticGHL - GHL Component Library",
  description: "Browse, preview, and copy CSS/JS components for GoHighLevel. Built for GHL students.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased bg-white`}>
        <Header />
        <div className="flex">
          <Suspense fallback={<div className="w-64 bg-gray-50" />}>
            <Sidebar />
          </Suspense>
          <main className="flex-1 min-h-[calc(100vh-73px)]">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
