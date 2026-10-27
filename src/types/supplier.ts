export type SupplierIndexEntry = {
  slug: string;
  name: string;
  legalName: string;
  rut: string;
  aliases: string[];
  category: string;
  region?: string;
  commune?: string;
};

export type SupplierProfile = SupplierIndexEntry & {
  summary: string;
  identityNote: string;
  website: string | null;
  channel: { label: string; url: string; note: string } | null;
  checks: { title: string; text: string }[];
  sources: { label: string; url: string; supports: string }[];
  reviewedAt: string;
  registry?: {
    sourceDate: string;
    legalType: string;
    legalSubtype: string;
    startedAt: string | null;
    activities: { code: string; description: string; registeredAt: string | null }[];
    annual: {
      year: number;
      region: string;
      province: string;
      commune: string;
      sector: string;
      subsector: string;
      mainActivity: string;
      employees: number | null;
    } | null;
  };
};
