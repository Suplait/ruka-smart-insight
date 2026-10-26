export type SupplierIndexEntry = {
  slug: string;
  name: string;
  legalName: string;
  rut: string;
  aliases: string[];
  category: string;
};

export type SupplierProfile = SupplierIndexEntry & {
  summary: string;
  identityNote: string;
  website: string;
  channel: { label: string; url: string; note: string };
  checks: { title: string; text: string }[];
  sources: { label: string; url: string; supports: string }[];
  reviewedAt: string;
};
