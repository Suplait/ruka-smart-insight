import type { SupplierProfile } from "@/types/supplier";

const regions: Record<string, string> = {
  i: "Tarapacá", ii: "Antofagasta", iii: "Atacama", iv: "Coquimbo", v: "Valparaíso",
  vi: "O’Higgins", vii: "Maule", viii: "Biobío", ix: "La Araucanía", x: "Los Lagos",
  xi: "Aysén", xii: "Magallanes", xiii: "Metropolitana", xiv: "Los Ríos",
  xv: "Arica y Parinacota", xvi: "Ñuble",
};
// Display labels only: the source value remains intact in the public record.
export const supplierRegionLabel = (value: string) => regions[value.split(" ")[0].toLowerCase()] ?? value;

export function supplierDate(value: string): string {
  return new Date(`${value}T12:00:00Z`).toLocaleDateString("es-CL", {
    day: "numeric", month: "long", year: "numeric", timeZone: "UTC",
  });
}

export function supplierSourceMonth(value: string): string {
  return new Date(`${value}-01T12:00:00Z`).toLocaleDateString("es-CL", { month: "long", year: "numeric", timeZone: "UTC" });
}

export function supplierIdentityText(profile: SupplierProfile): string {
  return `${profile.legalName}\nRUT: ${profile.rut}`;
}

export function supplierFaqs(profile: SupplierProfile) {
  const answers = [
    { question: `¿Cuál es el RUT de ${profile.name}?`, answer: `El RUT es ${profile.rut}. La razón social asociada es ${profile.legalName}. Comprueba que ambos coincidan con el documento de tu compra.` },
  ];
  if (profile.registry?.activities.length) answers.push({
    question: `¿A qué se dedica ${profile.name}?`,
    answer: `En la nómina del SII de ${supplierSourceMonth(profile.registry.sourceDate)} figuran estas actividades: ${profile.registry.activities.slice(0,3).map(activity => activity.description).join("; ")}. Son actividades registradas, no un catálogo de productos ni una confirmación de disponibilidad.`,
  });
  if (profile.registry?.annual?.commune) answers.push({
    question: `¿Dónde está registrada ${profile.name}?`,
    answer: `El registro del año comercial ${profile.registry.annual.year} sitúa su domicilio tributario en ${profile.registry.annual.commune}, ${profile.registry.annual.region}. Esta ubicación histórica no indica sus zonas de despacho ni todos sus locales.`,
  });
  if (profile.registry?.startedAt) answers.push({
    question: `¿Qué fecha registra el SII para ${profile.name}?`,
    answer: `La nómina de razones sociales informa el ${supplierDate(profile.registry.startedAt)} en su campo de inicio de vigencia. Esa fecha no permite afirmar cuándo se fundó la marca ni cuándo inició actividades tributarias.`,
  });
  if (profile.channel) answers.push({ question: `¿Cómo contacto a ${profile.name}?`, answer: `${profile.channel.note} Usa el enlace «${profile.channel.label}» de esta ficha. Ruka no recibe pedidos por cuenta del proveedor.` });
  else answers.push({ question: `¿Dónde puedo cotizar con ${profile.name}?`, answer: profile.website ? `Consulta el sitio oficial enlazado en esta ficha para confirmar sus canales de atención y las condiciones de compra. Ruka no recibe pedidos por cuenta de esta empresa.` : `No hay un canal comercial verificado en esta ficha. Confirma el contacto directamente con la empresa. El RUT ${profile.rut} te ayuda a distinguirla de otras con nombres parecidos, pero no verifica quién te está cobrando ni su cuenta bancaria.` });
  answers.push({ question: "¿Esta ficha confirma que puedo pagar al proveedor?", answer: "No. Estos antecedentes públicos sirven para consultar la identidad y la actividad registrada. Antes de pagar, confirma por un canal independiente la cuenta bancaria, el beneficiario y las condiciones acordadas. Ruka no certifica la solvencia ni la vigencia tributaria del proveedor." });
  return answers;
}

export { supplierPageTitle } from "./supplierMetadata.mjs";

export function supplierPagination(current: number, total: number): (number | "gap")[] {
  const pages = Array.from(new Set([1, current - 1, current, current + 1, total])).filter(page => page > 0 && page <= total).sort((a, b) => a - b);
  return pages.flatMap((page, index) => index && page - pages[index - 1] > 1 ? ["gap" as const, page] : [page]);
}
