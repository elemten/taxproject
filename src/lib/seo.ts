import type { Metadata } from "next";
import { site } from "@/lib/site";

const defaultSocialImage = {
  url: "/images/site/hero-saskatoon.webp",
  width: 1200,
  height: 630,
  alt: "TrustEdge Tax Services in Saskatoon, Saskatchewan",
};

type BuildPageMetadataInput = {
  title: string;
  description: string;
  path: `/${string}`;
};

export function buildPageMetadata({
  title,
  description,
  path,
}: BuildPageMetadataInput): Metadata {
  const socialTitle = `${title} | ${site.name}`;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "en_CA",
      siteName: site.name,
      url: path,
      title: socialTitle,
      description,
      images: [defaultSocialImage],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [defaultSocialImage.url],
    },
  };
}
