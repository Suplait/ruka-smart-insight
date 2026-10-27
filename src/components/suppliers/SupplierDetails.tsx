import { useEffect, useState } from "react";
import { ArrowDown, ArrowUpRight, ChevronDown, Search } from "lucide-react";
import type { SupplierProfile } from "@/types/supplier";
import {
  supplierDate,
  supplierFaqs,
  supplierSourceMonth,
} from "@/utils/supplierPresentation";
import { sourceCaption, supplierSearchText } from "@/utils/supplierWorkspace";
import {
  SupplierDownload,
  supplierButton,
  supplierInput,
} from "./SupplierActions";

export const supplierSection =
  "scroll-mt-32 border-t border-[#dce2ed] py-10 sm:py-12";
export const supplierHeading =
  "text-2xl font-semibold leading-tight tracking-[-0.025em]";
export const supplierLink =
  "inline-flex min-h-11 items-center gap-2 rounded text-sm font-medium text-[#343fad] underline decoration-[#b9c0e7] underline-offset-4 hover:decoration-current focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#424ec0]";

export function SupplierSectionNav({ profile }: { profile: SupplierProfile }) {
  const [active, setActive] = useState("identidad");
  const sections = [
    ["identidad", "Identificación"],
    ["contacto-proveedor", "Contacto"],
    ["compra", "Revisar compra"],
    ...(profile.registry ? [["actividades", "Actividades"]] : []),
    ...(profile.registry?.annual ? [["ubicacion", "Ubicación"]] : []),
    ["preguntas", "Preguntas"],
    ["fuentes", "Fuentes"],
  ];
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-120px 0px -55% 0px", threshold: 0 },
    );
    document
      .querySelectorAll("[data-supplier-section]")
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [profile.slug]);
  const navigation = (
    <nav
      aria-label="En esta ficha"
      className="grid grid-cols-2 gap-1 rounded-xl bg-[#f4f5f9] p-2 sm:grid-cols-4 lg:grid-cols-1"
    >
      {sections.map(([id, label]) => (
        <a
          key={id}
          href={`#${id}`}
          aria-current={active === id ? "location" : undefined}
          onClick={() => setActive(id)}
          className={`flex min-h-11 items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#424ec0] motion-reduce:transition-none ${active === id ? "bg-white text-[#343fad]" : "text-[#505b70] hover:bg-white"}`}
        >
          {label}
          <ArrowDown
            size={13}
            aria-hidden="true"
            className={active === id ? "" : "invisible"}
          />
        </a>
      ))}
    </nav>
  );
  return (
    <>
      <div className="hidden lg:block">{navigation}</div>
      <details className="group rounded-xl bg-[#f4f5f9] lg:hidden">
        <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 rounded-xl px-4 text-sm font-medium focus-visible:outline-primary">
          Ir a una sección{" "}
          <ChevronDown
            size={16}
            aria-hidden="true"
            className="group-open:rotate-180"
          />
        </summary>
        {navigation}
      </details>
    </>
  );
}

export function SupplierActivities({ profile }: { profile: SupplierProfile }) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("code");
  const [expanded, setExpanded] = useState(false);
  const registry = profile.registry;
  if (!registry) return null;
  const filtered = registry.activities
    .filter((a) =>
      supplierSearchText(`${a.code} ${a.description}`).includes(
        supplierSearchText(query),
      ),
    )
    .slice()
    .sort((a, b) =>
      sort === "date"
        ? (b.registeredAt ?? "").localeCompare(a.registeredAt ?? "") ||
          a.code.localeCompare(b.code)
        : a.code.localeCompare(b.code),
    );
  const source =
    profile.sources.find((s) => /ACTECOS/i.test(s.url)) ??
    profile.sources.find((s) => s.supports === "activity");
  const item = (activity: (typeof filtered)[number]) => (
    <li
      key={activity.code}
      className="grid gap-2 border-b border-[#e4e8f0] py-4 last:border-b-0 sm:grid-cols-[84px_1fr] sm:gap-5"
    >
      <span className="w-fit self-start rounded-md bg-[#f2f4fb] px-2 py-1.5 font-mono text-xs text-[#505b70]">
        {activity.code}
      </span>
      <div>
        <p className="text-sm font-medium leading-6 sm:text-base">
          {activity.description}
        </p>
        <p className="mt-1 text-xs leading-5 text-[#60687a]">
          {activity.registeredAt ? (
            <>
              Fecha informada:{" "}
              <time dateTime={activity.registeredAt}>
                {supplierDate(activity.registeredAt)}
              </time>
            </>
          ) : (
            "Sin fecha informada para esta actividad."
          )}
        </p>
      </div>
    </li>
  );
  const expandedNow = expanded;
  return (
    <section id="actividades" data-supplier-section className={supplierSection}>
      <div className="flex items-baseline justify-between gap-4">
        <h2 className={supplierHeading}>Actividades registradas</h2>
        <span className="text-sm tabular-nums text-[#505b70]">
          {registry.activities.length} en nómina
        </span>
      </div>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-[#505b70]">
        Declaradas ante el SII en la nómina de{" "}
        {supplierSourceMonth(registry.sourceDate)}. Son antecedentes
        tributarios, no un catálogo de lo que puedes comprar hoy.
      </p>
      {registry.activities.length > 3 && (
        <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_180px]">
          <div>
            <label
              htmlFor="supplier-activity-search"
              className="mb-2 block text-sm font-medium"
            >
              Buscar actividad o código
            </label>
            <div className="relative">
              <Search
                size={17}
                aria-hidden="true"
                className="pointer-events-none absolute left-3 top-4 text-[#60687a]"
              />
              <input
                id="supplier-activity-search"
                type="search"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setExpanded(true);
                }}
                className={`${supplierInput} pl-10`}
                placeholder="Ej.: bebidas o 463020"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="supplier-activity-sort"
              className="mb-2 block text-sm font-medium"
            >
              Ordenar por
            </label>
            <select
              id="supplier-activity-sort"
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setExpanded(true);
              }}
              className={supplierInput}
            >
              <option value="code">Código</option>
              <option value="date">Fecha más reciente</option>
            </select>
          </div>
        </div>
      )}
      {(query || sort !== "code") && (
        <p role="status" className="mt-3 text-sm text-[#505b70]">
          {filtered.length} de {registry.activities.length} actividades
        </p>
      )}
      {!filtered.length ? (
        <div className="mt-5 rounded-lg bg-[#f4f5f9] p-5">
          <p className="font-medium">No hay actividades con esa búsqueda.</p>
          <button
            type="button"
            className={`${supplierButton} mt-3`}
            onClick={() => setQuery("")}
          >
            Limpiar búsqueda de actividades
          </button>
        </div>
      ) : (
        <>
          <ul className="mt-4">{filtered.slice(0, 3).map(item)}</ul>
          {filtered.length > 3 && (
            <details
              open={expandedNow}
              onToggle={(e) => {
                setExpanded(e.currentTarget.open);
              }}
              className="group"
            >
              <summary
                className={`${supplierLink} cursor-pointer list-none py-2`}
              >
                {expandedNow
                  ? "Ocultar actividades adicionales"
                  : `Ver las ${filtered.length} actividades`}
                <ChevronDown
                  size={15}
                  aria-hidden="true"
                  className="transition-transform duration-150 group-open:rotate-180 motion-reduce:transition-none"
                />
              </summary>
              <ul>{filtered.slice(3).map(item)}</ul>
            </details>
          )}
        </>
      )}
      <div className="mt-5 flex flex-wrap items-start gap-x-5 gap-y-3">
        {source && (
          <a
            className={supplierLink}
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            Consultar nómina fuente
            <ArrowUpRight size={14} aria-hidden="true" />
            <span className="sr-only"> (abre otra pestaña)</span>
          </a>
        )}
        <SupplierDownload
          rows={[
            [
              "RUT",
              "Código",
              "Actividad",
              "Fecha informada",
              "Nómina",
              "Fuente",
            ],
            ...registry.activities.map((a) => [
              profile.rut,
              a.code,
              a.description,
              a.registeredAt ?? "Sin fecha",
              registry.sourceDate,
              source?.url ?? "Consultar fuentes de la ficha",
            ]),
          ]}
          filename={`ruka-${profile.rut}-actividades.csv`}
          label="Descargar actividades CSV"
        />
      </div>
    </section>
  );
}

export function SupplierQuestions({ profile }: { profile: SupplierProfile }) {
  const [query, setQuery] = useState("");
  const faqs = supplierFaqs(profile);
  const visible = faqs.filter((f) =>
    supplierSearchText(`${f.question} ${f.answer}`).includes(
      supplierSearchText(query),
    ),
  );
  return (
    <section id="preguntas" data-supplier-section className={supplierSection}>
      <h2 className={`${supplierHeading} break-words`}>
        Preguntas sobre {profile.name}
      </h2>
      <label
        htmlFor="supplier-faq-search"
        className="mb-2 mt-5 block text-sm font-medium"
      >
        Busca una respuesta en esta ficha
      </label>
      <input
        id="supplier-faq-search"
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className={supplierInput}
        placeholder="RUT, ubicación, contacto…"
      />
      {query && (
        <p role="status" className="mt-2 text-sm text-[#505b70]">
          {visible.length} {visible.length === 1 ? "respuesta" : "respuestas"}
        </p>
      )}
      <div className="mt-4 divide-y divide-[#dce2ed]">
        {visible.map((faq) => (
          <details key={faq.question} className="group py-1">
            <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-5 rounded-sm py-4 font-medium leading-6 focus-visible:outline-primary">
              {faq.question}
              <ChevronDown
                size={18}
                className="shrink-0 text-[#60687a] transition-transform duration-150 group-open:rotate-180 motion-reduce:transition-none"
                aria-hidden="true"
              />
            </summary>
            <p className="max-w-2xl pb-5 text-sm leading-7 text-[#505b70]">
              {faq.answer}
            </p>
          </details>
        ))}
      </div>
      {!visible.length && (
        <div className="mt-4 rounded-lg bg-[#f4f5f9] p-5">
          <p>No encontramos esa respuesta aquí.</p>
          <button
            type="button"
            className={`${supplierButton} mt-3`}
            onClick={() => setQuery("")}
          >
            Ver todas las preguntas
          </button>
          <a className={`${supplierLink} ml-3`} href="#contacto-proveedor">
            Consultar contacto
          </a>
        </div>
      )}
    </section>
  );
}

export function SupplierSources({ profile }: { profile: SupplierProfile }) {
  const [filter, setFilter] = useState("all");
  const labels: Record<string, string> = {
    identity: "Identificación",
    activity: "Actividad empresarial",
    channel: "Contacto",
  };
  const visible = profile.sources.filter(
    (s) => filter === "all" || s.supports === filter,
  );
  return (
    <section id="fuentes" data-supplier-section className={supplierSection}>
      <h2 className={supplierHeading}>Fuentes y fechas, a la vista</h2>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-[#505b70]">
        Fuentes consultadas el{" "}
        <time dateTime={profile.reviewedAt}>
          {supplierDate(profile.reviewedAt)}
        </time>
        . Cada antecedente conserva su período; esta fecha no convierte datos
        históricos en actuales.
      </p>
      <div
        role="group"
        aria-label="Filtrar fuentes"
        className="mt-5 flex flex-wrap gap-2"
      >
        {[
          "all",
          ...Object.keys(labels).filter((key) =>
            profile.sources.some((s) => s.supports === key),
          ),
        ].map((key) => (
          <button
            key={key}
            type="button"
            className={`${supplierButton} ${filter === key ? "border-[#424ec0] bg-[#eff1ff]" : ""}`}
            aria-pressed={filter === key}
            onClick={() => setFilter(key)}
          >
            {key === "all" ? "Todas las fuentes" : labels[key]}
          </button>
        ))}
      </div>
      <p role="status" className="mt-3 text-xs text-[#60687a]">
        {visible.length} {visible.length === 1 ? "fuente" : "fuentes"}
      </p>
      <ul className="mt-2 divide-y divide-[#e4e8f0]">
        {visible.map((source) => {
          const details = sourceCaption(source.url);
          return (
            <li
              key={`${source.url}-${source.supports}`}
              id={`fuente-${profile.sources.indexOf(source)}`}
              className="scroll-mt-32 py-5"
            >
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#60687a]">
                <span>{details.host}</span>
                <span className="rounded bg-[#f1f3f9] px-2 py-1">
                  {details.format}
                </span>
                <span>{labels[source.supports]}</span>
              </div>
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`${supplierLink} mt-2 max-w-full leading-6`}
              >
                {source.label.replace(/[–—]/g, "-")}
                <ArrowUpRight
                  size={15}
                  className="shrink-0"
                  aria-hidden="true"
                />
                <span className="sr-only"> (abre otra pestaña)</span>
              </a>
              <p className="text-xs leading-6 text-[#60687a]">
                {details.format === "Archivo ZIP"
                  ? "Descarga de datos oficiales. Puede requerir descomprimir el archivo y buscar por RUT."
                  : "Abre el documento original para comprobar el antecedente."}
              </p>
            </li>
          );
        })}
      </ul>
      <div className="mt-6 grid gap-6 border-t border-[#dce2ed] pt-6 sm:grid-cols-2">
        <div>
          <h3 className="font-semibold">Alcance de la ficha</h3>
          <p className="mt-2 text-sm leading-7 text-[#60687a]">
            Información de consulta. No acredita vigencia tributaria, solvencia,
            cuentas bancarias ni una relación comercial con Ruka.
          </p>
        </div>
        <div>
          <h3 className="font-semibold">¿Hay un dato incorrecto?</h3>
          <p className="mt-2 text-sm leading-7 text-[#60687a]">
            Indícanos la corrección y su fuente pública. No envíes facturas ni
            datos bancarios.
          </p>
          <a
            className={supplierLink}
            href={`mailto:privacidad@ruka.ai?subject=${encodeURIComponent(`Corrección de ficha: ${profile.name}`)}&body=${encodeURIComponent(`Ficha: https://www.ruka.ai/proveedores/${profile.slug}\nRUT: ${profile.rut}\n\nDato a corregir:\nFuente pública que lo respalda:\n\nNo adjuntar facturas ni datos bancarios.`)}`}
          >
            Solicitar una corrección
            <ArrowUpRight size={15} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
