import { useRef, useState } from "react";
import { ArrowRight, Download, FileSpreadsheet, LockKeyhole, RotateCcw } from "lucide-react";
import { CSV_LIMITS, documentLabels, fieldLabels, mapDocument, parseCsv, reconcileDocuments, resultsCsv, sampleCsv, suggestMapping, type ColumnMapping, type CsvResult, type CsvTable, type DocumentKind, type NumberStyle } from "@/utils/reconciliationCsv";

type LoadedDocument = { name: string; table: CsvTable; mapping: ColumnMapping; style: NumberStyle; sample: boolean };
const kinds: DocumentKind[] = ["order", "invoice", "receipt"];
const control = "min-h-11 w-full rounded-lg border border-[#b6bfd1] bg-white px-3 text-base text-[#171827] outline-none focus:border-primary focus:ring-2 focus:ring-primary/25 sm:text-sm";
const secondary = "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-3 text-sm font-semibold text-[#424ec0] hover:bg-[#eef0ff] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";
const displayNumber = (value: number | null | undefined) => value == null ? "No válido" : new Intl.NumberFormat("es-CL", { maximumFractionDigits: 2 }).format(value / 100);

function ComparisonEvidence({ line }: { line: CsvResult }) {
  return <dl className="mt-4 grid gap-4 rounded-lg bg-[#f7f8fc] p-4 sm:grid-cols-3">{kinds.map(kind => <div key={kind}><dt className="text-xs font-semibold text-[#505b70]">{documentLabels[kind]}</dt><dd className="mt-1 text-sm tabular-nums text-[#171827]">{!line.rows[kind].length ? "Sin coincidencia" : line.rows[kind].length > 1 ? `${line.rows[kind].length} filas: revisar duplicados` : <><span className="font-semibold">{displayNumber(line[kind]?.quantity)}</span> {line.unit}{kind !== "receipt" && <span className="mt-1 block text-xs text-[#505b70]">Precio neto c/u: {displayNumber(line[kind]?.price)}</span>}</>}</dd></div>)}</dl>;
}
function download(name: string, content: string) {
  const url = URL.createObjectURL(new Blob([content], { type: "text/csv;charset=utf-8;" }));
  const anchor = document.createElement("a"); anchor.href = url; anchor.download = name; anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function ReconciliationFiles() {
  const [documents, setDocuments] = useState<Partial<Record<DocumentKind, LoadedDocument>>>({});
  const [errors, setErrors] = useState<Partial<Record<DocumentKind, string>>>({});
  const [loading, setLoading] = useState<Partial<Record<DocumentKind, boolean>>>({});
  const [result, setResult] = useState<CsvResult[] | null>(null);
  const [error, setError] = useState("");
  const [tolerance, setTolerance] = useState(0);
  const [onlyReviews, setOnlyReviews] = useState(false);
  const [page, setPage] = useState(0);
  const versions = useRef<Record<DocumentKind, number>>({ order: 0, invoice: 0, receipt: 0 });
  const output = useRef<HTMLHeadingElement>(null);
  const loaded = kinds.map(kind => documents[kind]).filter(Boolean);
  const mixedExample = loaded.some(item => item?.sample) && loaded.some(item => !item?.sample);
  const ready = !mixedExample && kinds.every(kind => documents[kind] && !loading[kind] && !errors[kind]);
  const reviewCount = result?.filter(line => line.status === "review").length || 0;
  const filtered = result?.filter(line => !onlyReviews || line.status === "review") || [];
  const pages = Math.max(1, Math.ceil(filtered.length / 25));
  function invalidate() { setResult(null); setError(""); setPage(0); }
  function edit(kind: DocumentKind, next: Partial<LoadedDocument>) {
    invalidate(); setDocuments(current => ({ ...current, [kind]: { ...current[kind]!, ...next } }));
  }
  async function load(kind: DocumentKind, file: File) {
    const version = ++versions.current[kind];
    invalidate(); setLoading(current => ({ ...current, [kind]: true })); setErrors(current => ({ ...current, [kind]: "" }));
    setDocuments(current => ({ ...current, [kind]: undefined }));
    try {
      if (file.size > CSV_LIMITS.bytes) throw new Error("El archivo supera los 2 MB. Divide la exportación en lotes.");
      if (!/\.(csv|tsv)$/i.test(file.name)) throw new Error("Usa un archivo CSV o TSV. En Excel, elige Guardar como → CSV UTF-8.");
      let text: string;
      try { text = new TextDecoder("utf-8", { fatal: true }).decode(await file.arrayBuffer()); }
      catch { throw new Error("No podemos leer el archivo como UTF-8. Vuelve a exportarlo como CSV UTF-8."); }
      const table = parseCsv(text);
      if (versions.current[kind] === version) setDocuments(current => ({ ...current, [kind]: { name: file.name, table, mapping: suggestMapping(table.headers), style: "comma", sample: false } }));
    } catch (cause) {
      if (versions.current[kind] === version) setErrors(current => ({ ...current, [kind]: cause instanceof Error ? cause.message : "No pudimos leer este archivo." }));
    } finally { if (versions.current[kind] === version) setLoading(current => ({ ...current, [kind]: false })); }
  }
  function reset(useExample = false) {
    kinds.forEach(kind => versions.current[kind]++);
    invalidate(); setErrors({}); setLoading({}); setTolerance(0); setOnlyReviews(false);
    setDocuments(useExample ? Object.fromEntries(kinds.map(kind => {
      const table = parseCsv(sampleCsv[kind]);
      return [kind, { name: `${kind}-ejemplo.csv`, table, mapping: suggestMapping(table.headers), style: "comma", sample: true }];
    })) : {});
  }
  function compare() {
    try {
      if (!ready) throw new Error("Carga los tres archivos antes de comparar.");
      const mapped = Object.fromEntries(kinds.map(kind => {
        const item = documents[kind]!;
        return [kind, mapDocument(item.table, item.mapping, kind, item.style)];
      })) as Parameters<typeof reconcileDocuments>[0];
      setResult(reconcileDocuments(mapped, tolerance)); setError(""); setPage(0); setOnlyReviews(false);
      requestAnimationFrame(() => output.current?.focus({ preventScroll: false }));
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Revisa los archivos y las columnas elegidas."); }
  }
  return <section id="conciliar-archivos" className="mx-auto mt-10 max-w-6xl scroll-mt-24" aria-labelledby="file-comparison-title">
    <div className="rounded-xl border border-[#d6ddec] bg-white">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#d6ddec] p-5 sm:p-7">
        <div><h2 id="file-comparison-title" className="text-2xl font-semibold tracking-[-0.02em]">Compara tus archivos.</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-[#505b70]">Carga una exportación por documento. Revisa las columnas y descarga las diferencias.</p></div>
        <button onClick={() => reset()} className={secondary}><RotateCcw size={16} /> Borrar archivos</button>
      </div>
      <div className="flex items-start gap-3 bg-[#edf4ef] px-5 py-4 text-sm leading-6 text-[#24573c] sm:px-7"><LockKeyhole className="mt-1 shrink-0" size={17} /><p><strong>Tus archivos se quedan en este navegador.</strong> No se envían a Ruka ni se guardan. Se eliminan de esta herramienta al recargar o al pulsar «Borrar archivos».</p></div>
      <div className="px-5 pt-6 sm:px-7">
        <p className="max-w-3xl text-sm leading-6 text-[#505b70]">Los tres archivos deben compartir una <strong className="text-[#171827]">referencia de compra, código y unidad</strong>. Usa un lote de un solo proveedor y moneda. No cruces los folios distintos de factura y recepción como si fueran la misma referencia.</p>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2"><button onClick={() => reset(true)} className={secondary}>Cargar un caso de ejemplo <ArrowRight size={16} /></button><a href="#limites-csv" className="inline-flex min-h-11 items-center text-sm text-[#505b70] underline underline-offset-4">Ver alcance y límites</a></div>
      </div>
      <div className="grid gap-0 divide-y divide-[#d6ddec] px-5 pb-2 sm:px-7 lg:grid-cols-3 lg:divide-x lg:divide-y-0">
        {kinds.map((kind, index) => {
          const item = documents[kind];
          const fields = (Object.keys(fieldLabels) as (keyof ColumnMapping)[]).filter(field => kind !== "receipt" || field !== "price");
          return <div key={kind} className="min-w-0 py-6 lg:px-5 lg:first:pl-0 lg:last:pr-0">
            <h3 className="flex items-center gap-3 text-base font-semibold"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#eef0ff] text-sm text-[#424ec0]">{index + 1}</span>{documentLabels[kind]}</h3>
            <label className={`relative mt-5 flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-[#a9b4cb] bg-[#f7f8fc] px-3 text-center hover:bg-[#eff1fa] focus-within:ring-2 focus-within:ring-primary ${item ? "min-h-11 py-2" : "min-h-24 flex-col py-4"}`}>
              <FileSpreadsheet size={22} className="text-[#424ec0]" /><span className="max-w-full break-all text-sm font-semibold">{loading[kind] ? "Leyendo archivo…" : item ? "Reemplazar archivo" : "Elegir CSV"}</span>
              <input type="file" accept=".csv,.tsv,text/csv,text/tab-separated-values" aria-label={`Elegir CSV: ${documentLabels[kind]}`} aria-invalid={Boolean(errors[kind])} aria-describedby={`csv-help-${kind}${errors[kind] ? ` csv-error-${kind}` : ""}`} onChange={event => { const file = event.target.files?.[0]; if (file) void load(kind, file); event.target.value = ""; }} className="absolute inset-0 h-full w-full cursor-pointer opacity-0" />
            </label>
            <p id={`csv-help-${kind}`} className="mt-2 text-xs leading-5 text-[#505b70]">CSV UTF-8 · Hasta 2 MB y 5.000 filas</p>
            <button onClick={() => download(`ruka-${kind}-ejemplo.csv`, "\uFEFF" + sampleCsv[kind])} className={`${secondary} mt-1 px-0`}><Download size={14} /> Descargar ejemplo</button>
            {errors[kind] && <p id={`csv-error-${kind}`} role="alert" className="mt-3 rounded-lg bg-[#fff0ee] p-3 text-sm leading-6 text-[#97372c]">{errors[kind]}</p>}
            {item && <div className="mt-4">
              <p className="break-all text-sm font-semibold">{item.name}</p><p className="mt-1 text-xs text-[#505b70]">{item.table.rows.length} filas de datos{item.sample ? " · Datos ficticios" : ""}</p>
              <details open className="mt-4"><summary className="cursor-pointer text-sm font-semibold text-[#424ec0]">Revisar columnas</summary><div className="mt-4 space-y-4">
                {fields.map(field => <label key={field} className="block text-xs font-semibold text-[#505b70]">{fieldLabels[field]}<select aria-label={`${documentLabels[kind]}: ${fieldLabels[field]}`} className={`${control} mt-1.5`} value={item.mapping[field]} onChange={event => edit(kind, { mapping: { ...item.mapping, [field]: event.target.value } })}><option value="">Elegir columna</option>{item.table.headers.map(header => <option key={header} value={header}>{header}</option>)}</select><span className="mt-1 block truncate text-xs font-normal" title={item.table.rows[0]?.[item.table.headers.indexOf(item.mapping[field])]}>Primera fila: {item.table.rows[0]?.[item.table.headers.indexOf(item.mapping[field])] || "—"}</span></label>)}
                <label className="block text-xs font-semibold text-[#505b70]">Formato de los números<select aria-label={`${documentLabels[kind]}: formato numérico`} value={item.style} className={`${control} mt-1.5`} onChange={event => edit(kind, { style: event.target.value as NumberStyle })}><option value="comma">1.234,50 · Decimal con coma</option><option value="dot">1,234.50 · Decimal con punto</option></select></label>
              </div></details>
            </div>}
          </div>;
        })}
      </div>
      <div className="border-t border-[#d6ddec] bg-[#f7f8fc] p-5 sm:p-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"><label className="text-sm font-semibold">Diferencia de precio permitida<select className={`${control} mt-2 block sm:w-72`} value={tolerance} onChange={event => { invalidate(); setTolerance(Number(event.target.value)); }}><option value={0}>0% · El precio debe coincidir</option><option value={1}>Hasta 1% respecto de la orden</option><option value={2}>Hasta 2% respecto de la orden</option></select></label><button disabled={!ready} onClick={compare} className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-primary px-7 text-base font-semibold text-white hover:bg-[#414fcf] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary disabled:cursor-not-allowed disabled:bg-[#dce0eb] disabled:text-[#505b70]">Comparar archivos <ArrowRight size={17} /></button></div>
        {mixedExample ? <p role="alert" className="mt-3 text-sm leading-6 text-[#97372c]">Hay archivos tuyos mezclados con datos de ejemplo. Reemplaza los otros archivos o carga de nuevo el caso de ejemplo antes de comparar.</p> : !ready && <p className="mt-3 text-sm text-[#505b70]">Carga los tres archivos para continuar.</p>}
        {error && <p role="alert" className="mt-4 text-sm font-medium text-[#97372c]">{error}</p>}
      </div>
    </div>
    {result && <section className="mt-8 overflow-hidden rounded-xl border border-[#d6ddec] bg-white" aria-labelledby="csv-result-title">
      <div className="flex flex-wrap items-center justify-between gap-5 bg-[#171827] p-5 text-white sm:p-7"><div><h2 id="csv-result-title" ref={output} tabIndex={-1} className="scroll-mt-28 text-2xl font-semibold outline-none">{reviewCount ? `${reviewCount} de ${result.length} cruces requieren revisión.` : `${result.length} cruces coinciden bajo estas reglas.`}</h2><p className="mt-2 text-sm leading-6 text-[#d0d5e5]">Se compararon cantidades y precios. Este resultado no autoriza pagos.</p></div><button onClick={() => download("ruka-resultado-conciliacion.csv", resultsCsv(result, tolerance))} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-[#171827] hover:bg-[#e7eaff] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"><Download size={17} /> Descargar resultado completo</button></div>
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#d6ddec] px-5 py-4 sm:px-7"><label className="flex min-h-11 cursor-pointer items-center gap-2 text-sm"><input className="h-4 w-4 accent-[#505ee8]" type="checkbox" checked={onlyReviews} onChange={event => { setOnlyReviews(event.target.checked); setPage(0); }} /> Solo los que requieren revisión</label><p role="status" className="text-sm text-[#505b70]">{filtered.length} cruces · Página {page + 1} de {pages}</p></div>
      {!filtered.length && <p className="p-7 text-sm text-[#505b70]">No hay diferencias con estas reglas. El resultado completo sigue disponible para descargar.</p>}
      <div className="divide-y divide-[#d6ddec]">{filtered.slice(page * 25, (page + 1) * 25).map((line, index) => <article key={`${page}-${index}`} className="px-5 py-5 sm:px-7">
        <div className="flex flex-wrap items-center justify-between gap-3"><h3 className="min-w-0 break-all text-base font-semibold">{line.code || "Sin código"} <span className="font-normal text-[#505b70]">· {line.reference || "Sin referencia"} · {line.unit || "Sin unidad"}</span></h3><span className={`rounded-full px-3 py-1 text-xs font-semibold ${line.status === "match" ? "bg-[#eaf5ef] text-[#24573c]" : "bg-[#fff4e3] text-[#805117]"}`}>{line.status === "match" ? "Coincide" : "Revisar"}</span></div>
        <ComparisonEvidence line={line} />
        <p className="mt-3 text-xs leading-5 text-[#505b70]">Filas de datos · OC: {line.rows.order.join(", ") || "—"} · Factura: {line.rows.invoice.join(", ") || "—"} · Recepción: {line.rows.receipt.join(", ") || "—"}</p>
        {line.reasons.length > 0 && <ul className="mt-3 space-y-1 text-sm leading-6 text-[#505b70]">{line.reasons.map(reason => <li key={reason}>{reason}</li>)}</ul>}
      </article>)}</div>
      {pages > 1 && <nav aria-label="Páginas de resultados" className="flex justify-between border-t border-[#d6ddec] p-5"><button className={`${secondary} disabled:opacity-40`} disabled={!page} onClick={() => setPage(page - 1)}>Anterior</button><button className={`${secondary} disabled:opacity-40`} disabled={page + 1 >= pages} onClick={() => setPage(page + 1)}>Siguiente</button></nav>}
    </section>}
    <details id="limites-csv" className="mt-6 scroll-mt-28 rounded-xl border border-[#d6ddec] p-5 text-sm leading-7 text-[#505b70]"><summary className="cursor-pointer font-semibold text-[#171827]">Qué revisa este cruce y qué queda fuera</summary><p className="mt-4">Compara cantidad pedida, facturada y recibida; precio neto facturado frente al de la orden. La referencia debe identificar una misma compra de un solo proveedor. Código y unidad deben ser exactamente iguales, salvo espacios al comienzo o final. No convierte unidades ni homologa nombres.</p><p className="mt-3">No suma duplicados ni recepciones parciales repetidas: los marca para revisión. No valida impuestos, descuentos, notas de crédito, moneda, identidad del proveedor, legitimidad de documentos, aprobaciones ni datos bancarios. Hasta dos decimales. Una coincidencia no significa que el pago esté autorizado.</p><p className="mt-3">El resultado identifica filas de datos, sin contar el encabezado ni líneas vacías. Si varios documentos usan folios distintos, añade primero una columna con la referencia de compra compartida. No incluyas datos personales que no sean necesarios.</p></details>
  </section>;
}
