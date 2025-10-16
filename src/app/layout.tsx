import type { Metadata } from "next";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Travel Guide – Personalized Tour Planner",
  description: "Build personalized itineraries and explore suggested trips.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[var(--background)] text-[var(--foreground)]`}
      >
        <header className="border-b border-black/[.08] dark:border-white/[.145] bg-white/60 dark:bg-black/40 backdrop-blur supports-backdrop-blur:backdrop-blur-md sticky top-0 z-40">
          <nav className="mx-auto max-w-5xl px-6 py-4 flex items-center justify-between">
            <Link href="/" className="text-lg font-semibold">
              AI Travel Guide
            </Link>
            <div className="flex items-center gap-6 text-sm">
              <Link href="/" className="hover:underline">
                Itinerary Builder
              </Link>
              <Link href="/suggested-trips" className="hover:underline">
                Suggested Trips
              </Link>
              <ThemeToggle />
            </div>
          </nav>
        </header>
        <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>
      </body>
    </html>
  );
}
