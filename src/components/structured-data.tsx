import { site } from "@/lib/site";
import { getSiteUrl } from "@/lib/site-url";

export function StructuredData() {
  const baseUrl = getSiteUrl();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AccountingService",
    name: site.name,
    url: baseUrl.toString(),
    logo: new URL("/assets/logo.png", baseUrl).toString(),
    image: new URL("/assets/navbar.png", baseUrl).toString(),
    areaServed: [
      {
        "@type": "AdministrativeArea",
        name: site.province,
      },
      {
        "@type": "City",
        name: "Saskatoon",
      },
    ],
    telephone: site.phone,
    email: site.email,
    founder: {
      "@type": "Person",
      name: site.personName,
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Saskatoon",
      addressRegion: "SK",
      addressCountry: "CA",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
