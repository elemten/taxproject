import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { StructuredData } from "@/components/structured-data";
import { SiteShell } from "@/components/site-shell";
import { getSiteUrl } from "@/lib/site-url";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  title: {
    default: "TrustEdge Tax Services | Saskatoon, Saskatchewan",
    template: "%s | TrustEdge Tax Services",
  },
  alternates: { canonical: "/" },
  description:
    "Tax services in Saskatoon, Saskatchewan focused on personal tax, corporate tax, and estate planning services.",
  applicationName: "TrustEdge Tax Services",
  authors: [{ name: "TrustEdge Tax Services" }],
  creator: "TrustEdge Tax Services",
  icons: {
    icon: [{ url: "/assets/newlogo.png", type: "image/png" }],
    apple: [{ url: "/assets/newlogo.png", type: "image/png" }],
  },
  openGraph: {
    type: "website",
    locale: "en_CA",
    siteName: "TrustEdge Tax Services",
    url: "/",
    title: "TrustEdge Tax Services",
    description:
      "Tax services in Saskatoon, Saskatchewan focused on personal tax, corporate tax, and estate planning services.",
    images: [
      {
        url: "/images/site/hero-saskatoon.webp",
        width: 1200,
        height: 630,
        alt: "TrustEdge Tax Services in Saskatoon, Saskatchewan",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TrustEdge Tax Services | Saskatoon, Saskatchewan",
    description:
      "Tax services in Saskatoon, Saskatchewan focused on personal tax, corporate tax, and estate planning services.",
    images: ["/images/site/hero-saskatoon.webp"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-CA">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <StructuredData />
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
