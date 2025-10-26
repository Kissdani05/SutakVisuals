import type { Metadata, Viewport } from "next";
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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "SutakVisuals – Autófotózás",
    template: "%s | SutakVisuals",
  },
  description:
    "Autófotózás Debrecenben és országszerte. Mozgás közbeni (track) fotók, előre egyeztetett helyszínek, profi utómunka.",
  keywords: [
    "autófotózás",
    "autós fotó",
    "autó fotózás Debrecen",
    "track fotó",
    "gépjármű fotó",
    "SutakVisuals",
  ],
  authors: [{ name: "SutakVisuals" }],
  creator: "SutakVisuals",
  publisher: "SutakVisuals",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "hu_HU",
    url: "/",
    siteName: "SutakVisuals",
    title: "SutakVisuals – Autófotózás",
    description:
      "Autófotózás Debrecenben és országszerte. Mozgás közbeni (track) fotók, előre egyeztetett helyszínek, profi utómunka.",
    images: [
      {
        url: "/images/onedaye30.webp",
        width: 1200,
        height: 630,
        alt: "SutakVisuals portfólió – BMW E30",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SutakVisuals – Autófotózás",
    description:
      "Autófotózás Debrecenben és országszerte. Mozgás közbeni (track) fotók, előre egyeztetett helyszínek, profi utómunka.",
    images: ["/images/onedaye30.webp"],
    creator: "@sutakvisuals",
  },
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    shortcut: "/favicon.png",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0ef1a2",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hu">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
