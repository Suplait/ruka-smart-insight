import guides from "@/content/helpGuides.json";

const fold = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
export const searchHelp = (query: string) => guides.filter(guide => fold([guide.title, guide.description, guide.category].join(" ")).includes(fold(query.trim())));
