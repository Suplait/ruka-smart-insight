// Explicit offline editorial import, never called by build or connected to Rails.
// Input must be the reviewed, public-source SII enrichment (not a tenant export).
import fs from "node:fs";
import path from "node:path";
import { auditDirectory, supplierDigest } from "./validate-directory.mjs";

const input = process.argv[2];
if (!input || !process.argv.includes("--write-reviewed")) throw new Error("Pass a reviewed SII enrichment file and --write-reviewed");
const enriched = JSON.parse(fs.readFileSync(input, "utf8"));
const quality = JSON.parse(fs.readFileSync(path.join(path.dirname(input), "sii-enrichment-quality.json"), "utf8"));
if (quality.identityConflicts || quality.eligibleProfiles !== enriched.length || enriched.length < 1000) throw new Error("SII source quality gate failed");
const root = process.cwd();
const old = JSON.parse(fs.readFileSync(path.join(root, "config/supplier-profiles.json"), "utf8"));
if (old.length !== 20) throw new Error("Import is for the reviewed 20-profile baseline only; review subsequent releases separately");
const oldByRut = new Map(old.map(row => [row.rut.replace(/[.-]/g, ""), row]));
const date = value => {
  if (!value) return null;
  const parts = value.split("-");
  const normalized = parts[0].length === 4 ? value : parts.reverse().join("-");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(normalized) || !Number.isFinite(Date.parse(normalized)) || new Date(normalized).toISOString().slice(0,10) !== normalized) throw new Error(`Invalid source date ${value}`);
  return normalized;
};
const sentence = value => { const clean = value.trim().replace(/\s+/g, " ").toLocaleLowerCase("es"); return clean.charAt(0).toLocaleUpperCase("es") + clean.slice(1); };
const displayName = value => value.trim().split(/\s+/).map(word => ["SPA", "S.A.", "S.A", "EIRL", "E.I.R.L.", "LTDA.", "LTDA", "ICB", "PF"].includes(word) ? word : word.charAt(0) + word.slice(1).toLocaleLowerCase("es")).join(" ");
const rutFormat = value => `${Number(value.slice(0,-1)).toLocaleString("es-CL")}-${value.slice(-1)}`;
const category = code => {
  const group = Number(code.slice(0,2));
  if (group >= 10 && group <= 12) return "Alimentos y bebidas";
  if (group <= 3) return "Agricultura, ganadería y pesca";
  if (group === 46 || group === 47) return "Comercio y distribución";
  if (group === 35 || group === 36) return "Energía y servicios básicos";
  if (group >= 49 && group <= 53) return "Transporte y logística";
  if (group === 55 || group === 56) return "Hotelería y gastronomía";
  if (group >= 58 && group <= 63) return "Tecnología y comunicaciones";
  if (group >= 64 && group <= 66) return "Servicios financieros";
  if (group === 68) return "Servicios inmobiliarios";
  if (group >= 69 && group <= 75) return "Servicios profesionales";
  if (group >= 77 && group <= 82) return "Servicios para empresas";
  if (group >= 41 && group <= 43) return "Construcción";
  if (group >= 13 && group <= 33) return "Industria y manufactura";
  return "Otros servicios y actividades";
};
const selected = [...enriched.filter(row => oldByRut.has(row.rutKey)), ...enriched.filter(row => !oldByRut.has(row.rutKey))];
const rows = selected.slice(0, 1000).map(source => {
  const existing = oldByRut.get(source.rutKey);
  const name = existing?.name ?? displayName(source.legalName);
  const rut = rutFormat(source.rutKey);
  const activities = [...new Map(source.activities.map(row => [row.code, { code: row.code, description: sentence(row.description), registeredAt: date(row.registeredAt) }])).values()].sort((a,b) => a.code.localeCompare(b.code));
  const sourceAnnual = source.historical2024;
  const annual = sourceAnnual && [sourceAnnual.region, sourceAnnual.province, sourceAnnual.commune, sourceAnnual.sector, sourceAnnual.subsector, sourceAnnual.mainActivity].every(value => value?.trim()) ? {
    year: 2024, region: sentence(sourceAnnual.region), province: sentence(sourceAnnual.province), commune: sentence(sourceAnnual.commune), sector: sentence(sourceAnnual.sector), subsector: sentence(sourceAnnual.subsector), mainActivity: sentence(sourceAnnual.mainActivity), employees: /^\d+$/.test(sourceAnnual.employees) ? Number(sourceAnnual.employees) : null,
  } : null;
  const registry = { sourceDate: "2026-08", legalType: source.type, legalSubtype: sentence(source.subtype), startedAt: date(source.startedAt), activities, annual };
  const shortName = name.length > 42 ? `${name.slice(0,39).replace(/\s+\S*$/, "")}…` : name;
  const summary = `${shortName}, RUT ${rut}. Consulta razón social, actividades registradas y antecedentes empresariales publicados por el SII.`;
  const newSources = [
    { label: "SII: personas jurídicas y empresas", url: "https://www.sii.cl/sobre_el_sii/nominapersonasjuridicas.html", supports: "identity" },
    { label: "Nómina oficial de actividades (ZIP)", url: "https://www.sii.cl/estadisticas/nominas/PUB_NOM_ACTECOS.zip", supports: "activity" },
    ...(annual ? [{ label: "Registro empresarial 2020–2024 (ZIP)", url: "https://www.sii.cl/estadisticas/nominas/PUB_EMPRESAS_PJ_2020_A_2024.zip", supports: "activity" }] : []),
  ];
  return {
    slug: existing?.slug ?? `${source.legalName.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0,72).replace(/-$/, "")}-${source.rutKey.toLowerCase()}`,
    name, legalName: source.legalName, rut, aliases: existing?.aliases ?? [], category: existing?.category ?? category(activities[0].code),
    summary: existing?.summary ?? summary,
    identityNote: existing?.identityNote ?? `Esta razón social corresponde al RUT ${rut} en la nómina de personas jurídicas del SII de agosto de 2026. El nombre comercial puede ser distinto; identifica al emisor de la factura por su RUT.`,
    website: existing?.website ?? null, channel: existing?.channel ?? null,
    checks: existing?.checks ?? [
      { title: "Identifica al emisor", text: `Compara el RUT ${rut} y la razón social con los de tu factura. Un nombre parecido no basta para unir proveedores ni atribuirles el mismo documento.` },
      { title: "Revisa la compra, no solo el total", text: "Conserva el detalle de lo comprado, sus cantidades y unidades. Así podrás comparar precios y detectar diferencias al recibir productos o contratar un servicio." },
      { title: "Confirma las condiciones directamente", text: "Cotizaciones, stock, plazos y datos de pago deben confirmarse con el proveedor por un canal independiente. Esta ficha no verifica cuentas bancarias ni disponibilidad." },
    ],
    sources: [...(existing?.sources ?? []), ...newSources], reviewedAt: "2026-10-26", registry,
  };
});
for (const previous of old) if (!rows.some(row => row.slug === previous.slug)) throw new Error(`Existing profile needs separate review: ${previous.slug}`);
const approvals = rows.map(row => ({ slug: row.slug, status: "approved", entityType: "legal", basis: "public-primary-sources", reviewedBy: "Cruce programático por RUT con nóminas públicas SII, validación de identidad, esquema y fechas; revisión editorial de las plantillas. Sin certificación tributaria actual.", sha256: supplierDigest(row) }));
const audit = auditDirectory(rows, approvals);
if (audit.quarantine.length) throw new Error(JSON.stringify(audit.quarantine));
const write = (file, value) => fs.writeFileSync(path.join(root, file), `${JSON.stringify(value, null, 2)}\n`);
write("config/supplier-profiles.json", rows);
write("config/supplier-approvals.json", approvals);
write("config/supplier-release.json", { version: 1, id: "2026-10-26-sii-1000", previous: "2026-10-26-public-pilot", reviewedAt: "2026-10-26", review: "Public SII identity/activity join, all 20 existing URLs preserved; dated registry data; no private invoice metrics, contacts or bank data.", count: rows.length, datasetSha256: supplierDigest([...rows].sort((a,b) => a.slug.localeCompare(b.slug))), sourceHashes: quality.sourceHashes, records: approvals.map(({ slug, sha256 }) => ({ slug, sha256 })) });
const editorial = JSON.parse(fs.readFileSync(path.join(root, "config/editorial-publications.json"), "utf8"));
const template = editorial.publications.find(row => row.path === "/proveedores");
editorial.publications = editorial.publications.filter(row => !row.path.startsWith("/proveedores/"));
for (const row of rows) editorial.publications.push({ ...template, path: `/proveedores/${row.slug}`, kind: "supplier", intent: `Identificar a ${row.legalName} por su RUT y consultar antecedentes empresariales públicos`, sources: row.sources.map(source => source.url), legalEntityVerified: true, publicationBasis: "public-primary-sources" });
for (let page = 2; page <= Math.ceil(rows.length/25); page++) editorial.publications.push({ ...template, path: `/proveedores/pagina/${page}`, intent: `Explorar la página ${page} del directorio de proveedores` });
write("config/editorial-publications.json", editorial);
console.log(`Reviewed import: ${rows.length} public profiles; ${old.length} existing URLs preserved; private candidate rankings excluded.`);
