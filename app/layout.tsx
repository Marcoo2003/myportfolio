import type { Metadata } from "next";
import { Space_Grotesk, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import SystemHeader from "./components/SystemHeader";
import SpringCursor from "./components/SpringCursor";
import { Analytics } from "@vercel/analytics/next";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Marco Zanchin | Software Engineer",
  description: "Software engineer focused on reliability, architecture, and building systems that scale.",
  keywords: ["software engineer", "systems engineer", "architecture", "reliability", "infrastructure"],
  authors: [{ name: "Marco Zanchin" }],
  openGraph: {
    title: "Marco Zanchin | Building What Lasts",
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
    <html lang="it">
      <body className={`${spaceGrotesk.variable} ${ibmPlexMono.variable} antialiased`}>
        <div className="ambient-glow" />
        <div className="vignette" />
        <SystemHeader />
        <SpringCursor />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
