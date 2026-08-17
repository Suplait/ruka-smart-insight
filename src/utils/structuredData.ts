import organization from "@/content/organization.json";

export const organizationId = organization.id;
export const websiteId = "https://www.ruka.ai/#website";
export const softwareId = "https://www.ruka.ai/#software";

export function createOrganizationSchema() {
  return {
    "@type": "Organization",
    "@id": organization.id,
    name: organization.name,
    legalName: organization.legalNames[0],
    alternateName: organization.legalNames[1],
    url: organization.url,
    logo: {
      "@type": "ImageObject",
      url: organization.logo,
    },
    description: organization.description,
    sameAs: organization.sameAs,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: organization.contactPoint.contactType,
      url: organization.contactPoint.url,
      availableLanguage: organization.contactPoint.availableLanguage,
    },
    address: organization.addresses.map((address) => ({
      "@type": "PostalAddress",
      streetAddress: address.streetAddress,
      addressLocality: address.addressLocality,
      addressRegion: address.addressRegion,
      ...(address.postalCode ? { postalCode: address.postalCode } : {}),
      addressCountry: address.addressCountry,
    })),
  };
}

export function createWebsiteSchema() {
  return {
    "@type": "WebSite",
    "@id": websiteId,
    url: organization.url,
    name: organization.name,
    inLanguage: "es-CL",
    publisher: { "@id": organization.id },
  };
}

export function createSoftwareSchema(description = organization.description) {
  return {
    "@type": "SoftwareApplication",
    "@id": softwareId,
    name: "Ruka",
    url: organization.url,
    description,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    inLanguage: "es-CL",
    publisher: { "@id": organization.id },
  };
}
