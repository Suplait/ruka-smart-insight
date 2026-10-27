import type { SupplierProfile } from "@/types/supplier";
import { validCompanyRut } from "./supplierDirectory";

export const supplierUrl = (profile: SupplierProfile) =>
  `https://www.ruka.ai/proveedores/${profile.slug}`;

/** Normalization is for equality only, never proof of identity or account ownership. */
export function compareSupplierRut(
  value: string,
  expected: string,
): "empty" | "invalid" | "match" | "different" {
  if (!value.trim()) return "empty";
  if (!/^[\d.kK\s-]+$/.test(value)) return "invalid";
  const compact = value.replace(/[.\s-]/g, "").toUpperCase();
  if (!/^\d{7,9}[\dK]$/.test(compact)) return "invalid";
  const formatted = `${compact.slice(0, -1)}-${compact.slice(-1)}`;
  if (!validCompanyRut(formatted)) return "invalid";
  return compact === expected.replace(/[.\s-]/g, "").toUpperCase()
    ? "match"
    : "different";
}

export const supplierSearchText = (text: string) =>
  text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("es-CL");

/** All spreadsheet cells quoted; a source string must never become a formula. */
export function supplierCsv(rows: (string | number)[][]): string {
  return (
    "\uFEFF" +
    rows
      .map((row) =>
        row
          .map((value) => {
            let text = String(value);
            if (/^[\s]*[=+@-]/.test(text)) text = "'" + text;
            return `"${text.replace(/"/g, '""')}"`;
          })
          .join(";"),
      )
      .join("\r\n")
  );
}

export function supplierRecordRows(profile: SupplierProfile): string[][] {
  const registry = profile.registry,
    annual = registry?.annual;
  const rows = [
    ["Campo", "Dato", "Período / alcance"],
    ["Nombre de consulta", profile.name, "Directorio Ruka"],
    [
      "Razón social",
      profile.legalName,
      registry?.sourceDate ?? "Fuentes de la ficha",
    ],
    ["RUT", profile.rut, registry?.sourceDate ?? "Fuentes de la ficha"],
    [
      "Rubro del directorio",
      profile.category,
      "Agrupación para buscar; no catálogo",
    ],
    ["Enlace de la ficha", supplierUrl(profile), "Consulta pública"],
    [
      "Fuentes consultadas",
      profile.reviewedAt,
      "No actualiza el período de los antecedentes",
    ],
  ];
  if (registry) {
    rows.push([
      "Tipo de organización",
      registry.legalSubtype,
      registry.sourceDate,
    ]);
    if (registry.startedAt)
      rows.push([
        "Inicio de vigencia en nómina",
        registry.startedAt,
        "No es fecha de fundación",
      ]);
    registry.activities.forEach((a) =>
      rows.push([
        `Actividad ${a.code}`,
        a.description,
        `${registry.sourceDate}; fecha informada: ${a.registeredAt ?? "sin fecha"}`,
      ]),
    );
  }
  if (annual) {
    for (const [label, value] of [
      ["Comuna", annual.commune],
      ["Provincia", annual.province],
      ["Región", annual.region],
      ["Actividad principal", annual.mainActivity],
      ["Rubro SII", annual.sector],
      ["Subrubro SII", annual.subsector],
    ])
      rows.push([label, String(value), `Año comercial ${annual.year}`]);
    if (annual.employees !== null)
      rows.push([
        "Trabajadores informados",
        String(annual.employees),
        `Año comercial ${annual.year}; no dotación actual`,
      ]);
  }
  if (profile.channel || profile.website)
    rows.push([
      "Canal oficial",
      profile.channel?.url ?? profile.website!,
      "Confirmar las condiciones directamente",
    ]);
  profile.sources.forEach((s) => rows.push(["Fuente", s.url, s.label]));
  rows.push([
    "Límites",
    "No certifica vigencia, solvencia ni cuentas bancarias; no autoriza pagos",
    "Consulta informativa",
  ]);
  return rows;
}

export function supplierInquiry(profile: SupplierProfile): string {
  return `Hola, quisiera consultar las condiciones para comprar a ${profile.name}.\n\n¿Me pueden confirmar la razón social y el RUT que emitirán la factura, el catálogo o servicios disponibles, los precios con sus unidades y el tratamiento del IVA?\n\nTambién quisiera conocer el mínimo de compra, las zonas y plazos de entrega y cómo se resuelven diferencias entre el pedido y lo recibido.\n\nComo referencia encontré esta identificación: ${profile.legalName}, RUT ${profile.rut}. ¿Corresponde a la empresa con la que contrataría?\n\nGracias.`;
}

export function sourceCaption(url: string): { host: string; format: string } {
  try {
    const u = new URL(url);
    return {
      host: u.hostname.replace(/^www\./, ""),
      format: /\.zip$/i.test(u.pathname)
        ? "Archivo ZIP"
        : /\.pdf$/i.test(u.pathname)
          ? "Documento PDF"
          : "Página web",
    };
  } catch {
    return { host: "Fuente publicada", format: "Enlace" };
  }
}
