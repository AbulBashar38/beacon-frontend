import type { Metadata } from "next";
import { Geist, Geist_Mono, Manrope } from "next/font/google";
import "mapbox-gl/dist/mapbox-gl.css";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "Beacon — Civic Infrastructure Intelligence",
    template: "%s · Beacon",
  },
  description:
    "Beacon lets citizens report public infrastructure problems and helps government teams triage, map, and resolve them — an AI-powered civic operations platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
