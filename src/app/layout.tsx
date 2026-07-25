import type { Metadata } from "next";
import { Geist, Geist_Mono, Manrope } from "next/font/google";
import "mapbox-gl/dist/mapbox-gl.css";
import "./globals.css";
import { AuthProvider } from "@/contexts/auth-context";

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
  metadataBase: new URL(process.env.APP_URL ?? "http://localhost:3000"),
  title: {
    default: "Beacon — Civic Infrastructure Intelligence",
    template: "%s · Beacon",
  },
  description:
    "Beacon lets citizens report public infrastructure problems and helps government teams triage, map, and resolve them — an AI-powered civic operations platform.",
  openGraph: {
    type: "website",
    locale: "en_BD",
    title: "Beacon — Civic Infrastructure Intelligence",
    description:
      "Your street sends a signal. The right team gets to work.",
    images: [
      {
        url: "/og.png",
        width: 1730,
        height: 909,
        alt: "Beacon civic signal network",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Beacon — Civic Infrastructure Intelligence",
    description:
      "Your street sends a signal. The right team gets to work.",
    images: ["/og.png"],
  },
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
      <body className="min-h-full flex flex-col"><AuthProvider>{children}</AuthProvider></body>
    </html>
  );
}
