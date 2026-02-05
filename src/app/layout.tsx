import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { StructuredData } from "@/components/structured-data";
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
    title: "TrustEdge Tax Services",
    description:
      "Tax services in Saskatoon, Saskatchewan focused on personal tax, corporate tax, and estate planning services.",
    images: [{ url: "/assets/newlogo.png", width: 499, height: 539 }],
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
        <div className="min-h-dvh bg-background">
          <SiteHeader />
          <main>{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
