import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SystemHeader from "./components/SystemHeader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Marco Zanchin | Software Engineer",
  description: "Software engineer focused on reliability, architecture, and building systems that scale.",
  keywords: ["software engineer", "systems engineer", "architecture", "reliability", "infrastructure"],
  authors: [{ name: "Software Engineer" }],
  openGraph: {
    title: "Software Engineer | Building What Lasts",
    description: "Software engineer focused on reliability, architecture, and building systems that scale.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Background layers */}
        <div className="ambient-glow" />
        <div className="vignette" />
        <div className="scanlines" />
        <div className="chromatic-layer" />
        
        <SystemHeader />
        {children}
      </body>
    </html>
  );
}
