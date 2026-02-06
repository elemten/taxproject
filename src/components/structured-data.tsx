import { site } from "@/lib/site";
import { getSiteUrl } from "@/lib/site-url";

export function StructuredData() {
  const baseUrl = getSiteUrl();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AccountingService",
    "@id": new URL("/#organization", baseUrl).toString(),
    name: site.name,
    url: baseUrl.toString(),
    description:
      "Saskatchewan-focused tax services for personal tax, corporate tax, and estate planning.",
    logo: new URL("/assets/newlogo.png", baseUrl).toString(),
    image: new URL("/assets/newlogo.png", baseUrl).toString(),
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
    telephone: site.phoneHref,
    email: site.email,
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: site.phoneHref,
        email: site.email,
        contactType: "customer service",
        areaServed: "CA",
        availableLanguage: ["en"],
      },
    ],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        opens: "09:30",
        closes: "17:30",
      },
    ],
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
    priceRange: "$$",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
