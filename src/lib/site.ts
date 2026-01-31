export const site = {
  name: "TrustEdge Tax Services",
  personName: "Archana Kumari",
  phone: "306-555-0123",
  email: "contact@trustedgetax.ca",
  locationShort: "Saskatoon, SK",
  province: "Saskatchewan",
  country: "Canada",
  hours: "Mon–Sat 09:30–17:30 (CST)",
  serviceLines: [
    {
      title: "Personal Tax",
      href: "/services/personal-tax",
      description:
        "T1 preparation with a clear checklist, clean documentation, and a smooth filing experience built for Saskatchewan clients.",
    },
    {
      title: "Corporate Tax",
      href: "/services/corporate-tax",
      description:
        "Practical corporate filing support and year-end readiness with a process designed to keep you organized and CRA-ready.",
    },
    {
      title: "Estate Management",
      href: "/services/estate-management",
      description:
        "Guidance and coordination for estate-related tax needs with a calm, structured approach and careful attention to detail.",
    },
  ],
  nav: [
    { title: "Home", href: "/" },
    { title: "Services", href: "/services" },
    { title: "About", href: "/about" },
    { title: "FAQ", href: "/faq" },
    { title: "Contact", href: "/contact" },
  ],
} as const;
