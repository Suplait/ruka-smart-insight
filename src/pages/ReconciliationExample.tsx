import { useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, RotateCcw, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ResourceNextStep } from "@/components/resources/ResourceNextStep";
import { MarketingSeo } from "@/components/seo/MarketingSeo";
import { ReconciliationFiles } from "@/components/seo/ReconciliationFiles";
import { ToolNavigation } from "@/components/resources/ToolNavigation";
import { ToolQuestions } from "@/components/resources/ToolQuestions";
import { compareLine, createExample, formatClp, reconciliationExamplePath, type ExampleLine, type ExamplePreset } from "@/utils/reconciliationExample";

const reconciliationExampleFaqs = [
  { question: "¿Puedo usar mis archivos?", answer: "Sí. En Tus archivos puedes cargar CSV de una orden, factura y recepción, revisar las columnas y descargar las diferencias. Todo se procesa en tu navegador: los archivos no se envían a Ruka. El ejemplo guiado usa datos ficticios. Ningún modo se conecta a tus sistemas ni autoriza pagos." },
  { question: "¿Qué compara?", answer: "Cantidad facturada versus pedida y recibida, y precio unitario facturado versus el acordado. Usa la misma unidad por producto y permite una tolerancia de precio de 0%, 1% o 2%. No incluye impuestos, descuentos, notas de crédito ni múltiples recepciones." },
  { question: "¿Que todo coincida significa que puedo pagar?", answer: "No. Significa que estos campos coinciden bajo las reglas del ejemplo. En una operación real también hay que revisar identidad y relación de documentos, impuestos, aprobaciones, duplicados y datos bancarios." },
  { question: "¿Qué hago con una diferencia de cantidad o precio?", answer: "Si la cantidad facturada supera la recibida, confirma con operaciones si falta una entrega o un registro. Si cambió el precio, contrasta la factura con el acuerdo de compra. Conserva los documentos originales y resuelve la diferencia con quien corresponda; no cambies los archivos solo para hacerlos coincidir." },
  { question: "¿Cómo preparo la referencia compartida?", answer: "Crea una columna que identifique la misma compra en los tres archivos, por ejemplo OC-102. El folio de una factura no tiene por qué coincidir con el de una recepción. También deben coincidir el código del producto y la unidad. Usa un solo proveedor y moneda por lote; la herramienta no identifica equivalencias entre nombres distintos." },
];

export default function ReconciliationExample() {
  const [mode, setMode] = useState<"files" | "example">("files");
  const [lines, setLines] = useState(() => createExample());
  const [preset, setPreset] = useState<ExamplePreset | "custom">("differences");
  const [tolerance, setTolerance] = useState(0);
  const [hasOrder, setHasOrder] = useState(true);
  const [hasReceipt, setHasReceipt] = useState(true);
  const results = lines.map((line) => compareLine(line, tolerance, hasOrder, hasReceipt));
  const invalid = results.some((result) => result.status === "invalid");
  const reviews = results.filter((result) => result.status === "review").length;
  const total = results.reduce((sum, result) => sum + (result.invoiceNet ?? 0), 0);
  function loadPreset(next: ExamplePreset) {
    setLines(createExample(next)); setPreset(next); setTolerance(0); setHasOrder(true); setHasReceipt(true);
  }
  function update(id: string, field: keyof Pick<ExampleLine, "invoiceQuantity" | "invoicePrice" | "receivedQuantity">, value: string) {
    setPreset("custom"); setLines((current) => current.map((line) => line.id === id ? { ...line, [field]: value } : line));
  }
  return (
    <div className="min-h-screen bg-white text-[#171827]">
      <MarketingSeo path={reconciliationExamplePath} name="Conciliador de archivos CSV" title="Conciliar factura, orden y recepción en CSV gratis | Ruka" description="Compara tus CSV de facturas, órdenes de compra y recepciones. Encuentra diferencias y descarga el resultado, sin registro y sin subir archivos al servidor." faqs={reconciliationExampleFaqs} primaryEntity={{
        "@type": "WebApplication",
        "@id": `https://www.ruka.ai${reconciliationExamplePath}#application`,
        name: "Conciliador de factura, orden y recepción en CSV",
        url: `https://www.ruka.ai${reconciliationExamplePath}`,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Any",
        browserRequirements: "Requiere JavaScript y un navegador moderno.",
        inLanguage: "es-CL",
        isAccessibleForFree: true,
        offers: { "@type": "Offer", price: "0", priceCurrency: "CLP" },
        description: "Compara cantidades y precios de archivos CSV en el navegador y permite descargar diferencias. No se conecta a sistemas, no envía archivos al servidor ni autoriza pagos.",
        publisher: { "@id": "https://www.ruka.ai/#organization" },
      }} />
      <Navbar />
      <a href="#contenido-conciliador" className="sr-only z-50 rounded bg-white p-4 focus:not-sr-only focus:fixed focus:left-4 focus:top-4">Saltar al contenido</a>
      <main id="contenido-conciliador" className="px-5 pb-24 pt-24 sm:px-8 sm:pt-28">
        <header className="mx-auto max-w-6xl">
          <Link to="/recursos" className="mb-3 inline-flex min-h-11 items-center gap-2 rounded text-sm font-semibold text-[#424ec0] hover:underline focus-visible:ring-2 focus-visible:ring-primary"><ArrowLeft size={16} aria-hidden="true" /> Todos los recursos</Link>
          <p className="mb-2 text-sm font-semibold text-[#424ec0]">Conciliador de factura, orden y recepción</p>
          <h1 className="max-w-4xl text-balance text-[clamp(1.75rem,3vw,2.5rem)] font-semibold leading-[1.1] tracking-[-0.04em]">¿Lo que te cobran es lo que pediste y recibiste?</h1>
          <p className="mb-5 mt-3 max-w-3xl text-base leading-7 text-[#505b70]">Cruza cantidades y precios de tus planillas y descarga lo que necesita revisión. También puedes partir con un ejemplo, sin tener archivos a mano.</p>
          <ToolNavigation path={reconciliationExamplePath} />
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg bg-[#f6f7fc] p-3"><div className="flex flex-wrap gap-2" aria-label="Modo de la herramienta">{([{ id: "files", label: "Tus archivos" }, { id: "example", label: "Ejemplo guiado" }] as const).map(item => <button key={item.id} aria-pressed={mode === item.id} onClick={() => setMode(item.id)} className={`min-h-12 rounded-lg px-5 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary ${mode === item.id ? "bg-[#171827] text-white" : "text-[#424ec0] hover:bg-white"}`}>{item.label}</button>)}</div><p className="px-2 text-sm text-[#505b70]">{mode === "files" ? "Tus CSV → diferencias → archivo descargable" : "Edita una compra ficticia y observa qué cambia."}</p></div>
        </header>

        <div hidden={mode !== "files"}><ReconciliationFiles /></div>
        <section hidden={mode !== "example"} className="mx-auto mt-10 max-w-6xl overflow-hidden rounded-xl border border-[#d6ddec] bg-white" aria-labelledby="comparison-title">
          <div className="flex flex-wrap items-center justify-between gap-5 border-b border-[#d6ddec] px-5 py-5 sm:px-7">
            <div><h2 id="comparison-title" className="text-lg font-semibold">Una compra. Tres documentos.</h2><p className="mt-1 text-sm text-[#505b70]">OC 102 · Factura 840 · Recepción 51 · Montos netos en CLP</p></div>
            <button onClick={() => loadPreset("differences")} className="inline-flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-[#424ec0] hover:bg-[#eef0ff] focus-visible:ring-2 focus-visible:ring-primary"><RotateCcw size={16} /> Reiniciar</button>
          </div>
          <fieldset className="border-b border-[#d6ddec] px-5 py-5 sm:px-7">
            <legend className="sr-only">Elegir un caso de ejemplo</legend>
            <div className="flex flex-wrap gap-2">{([{ id: "differences", label: "Dos diferencias" }, { id: "match", label: "Todo coincide" }, { id: "partial", label: "Entrega parcial" }] as const).map((item) => <button key={item.id} aria-pressed={preset === item.id} onClick={() => loadPreset(item.id)} className={`min-h-11 rounded-full px-4 text-sm font-semibold transition-colors motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${preset === item.id ? "bg-[#171827] text-white" : "bg-[#f0f2f8] text-[#505b70] hover:bg-[#e5e8f2]"}`}>{item.label}</button>)}</div>
          </fieldset>
          <div className="hidden grid-cols-[1.05fr_0.8fr_1.3fr_0.8fr] gap-5 border-b border-[#d6ddec] bg-[#f7f8fc] px-7 py-4 text-sm font-semibold md:grid"><span>Producto</span><span>Orden de compra</span><span>Factura <span className="font-normal text-[#505b70]">· editable</span></span><span>Recepción <span className="font-normal text-[#505b70]">· editable</span></span></div>
          <div className="divide-y divide-[#d6ddec]">
            {lines.map((line, index) => {
              const result = results[index];
              return <div key={line.id} className="px-5 py-6 sm:px-7">
                <div className="grid gap-5 md:grid-cols-[1.05fr_0.8fr_1.3fr_0.8fr] md:items-center">
                  <div><h3 className="text-base font-semibold">{line.name}</h3><p className="mt-1 text-sm text-[#505b70]">Unidad: {line.unit}</p></div>
                  <div className={!hasOrder ? "text-[#697386]" : ""}><span className="text-xs font-semibold text-[#505b70] md:hidden">Orden de compra · </span>{hasOrder ? <><p className="text-base tabular-nums">{line.orderedQuantity} {line.unit}</p><p className="mt-1 text-sm text-[#505b70]">{formatClp(Number(line.agreedPrice))} c/u</p></> : <p className="text-sm">Sin documento</p>}</div>
                  <div className="grid grid-cols-2 gap-3">
                    {([{ field: "invoiceQuantity", label: "Cant. facturada", max: 10000 }, { field: "invoicePrice", label: "Precio neto c/u", max: 1000000 }] as const).map((input) => <label key={input.field} className="block text-xs font-medium text-[#505b70]">{input.label}<input aria-label={`${input.label}: ${line.name}`} aria-invalid={result.status === "invalid"} aria-describedby={`result-${line.id}`} type="text" inputMode="decimal" maxLength={10} value={line[input.field]} onChange={(event) => update(line.id, input.field, event.target.value)} className="mt-2 min-h-12 w-full min-w-0 rounded-lg border border-[#808ca2] bg-white px-3 text-base tabular-nums text-[#171827] outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" /></label>)}
                  </div>
                  <label className="block text-xs font-medium text-[#505b70]">Cant. recibida<input aria-label={`Cant. recibida: ${line.name}`} aria-invalid={result.status === "invalid"} aria-describedby={`result-${line.id}`} disabled={!hasReceipt} type="text" inputMode="decimal" maxLength={10} value={hasReceipt ? line.receivedQuantity : ""} onChange={(event) => update(line.id, "receivedQuantity", event.target.value)} className="mt-2 min-h-12 w-full min-w-0 rounded-lg border border-[#808ca2] bg-white px-3 text-base tabular-nums text-[#171827] outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:bg-[#f0f2f8]" /></label>
                </div>
                <div id={`result-${line.id}`} className={`mt-5 flex items-start gap-2 rounded-lg px-4 py-3 text-sm leading-6 ${result.status === "match" ? "bg-[#eaf5ef] text-[#1c6346]" : "bg-[#fff4e3] text-[#805117]"}`}>
                  {result.status === "match" ? <CheckCircle2 className="mt-1 shrink-0" size={16} /> : <AlertCircle className="mt-1 shrink-0" size={16} />}
                  <div><p className="font-semibold">{result.status === "match" ? "Coincide bajo estas reglas" : result.status === "invalid" ? "Revisa el valor ingresado" : "Requiere revisión"}</p>{result.reasons.map((reason) => <p key={reason}>{reason}</p>)}{result.missingQuantity !== null && result.missingQuantity > 0 && <p className="font-medium">Sin respaldo de recepción: {new Intl.NumberFormat("es-CL", { maximumFractionDigits: 2 }).format(result.missingQuantity)} {line.unit}.</p>}</div>
                </div>
              </div>;
            })}
          </div>
          <div className="grid gap-6 border-t border-[#d6ddec] bg-[#f7f8fc] px-5 py-6 sm:px-7 md:grid-cols-2">
            <fieldset><legend className="text-sm font-semibold">Prueba también con un documento faltante</legend><div className="mt-3 flex flex-wrap gap-x-6 gap-y-3">{[{ label: "Tengo la orden", value: hasOrder, change: setHasOrder }, { label: "Tengo la recepción", value: hasReceipt, change: setHasReceipt }].map((option) => <label key={option.label} className="flex min-h-11 cursor-pointer items-center gap-2 text-sm text-[#505b70]"><input type="checkbox" checked={option.value} onChange={(event) => option.change(event.target.checked)} className="h-4 w-4 accent-[#505ee8]" />{option.label}</label>)}</div></fieldset>
            <label className="text-sm font-semibold">Tolerancia de precio<select value={tolerance} onChange={(event) => setTolerance(Number(event.target.value))} className="mt-3 block min-h-11 w-full rounded-lg border border-[#808ca2] bg-white px-3 text-sm font-normal"><option value={0}>0% · El precio debe coincidir</option><option value={1}>1% respecto del precio acordado</option><option value={2}>2% respecto del precio acordado</option></select><span className="mt-2 block text-xs font-normal leading-5 text-[#505b70]">Solo afecta al precio unitario. No admite diferencias de cantidad.</span></label>
          </div>
          <div className="grid gap-6 bg-[#171827] px-5 py-7 text-white sm:px-7 md:grid-cols-[1.3fr_0.7fr]">
            <div role="status" aria-live="polite" aria-atomic="true"><p className="text-xs font-semibold text-[#c4cbff]">Resultado del ejemplo</p><p className="mt-2 text-2xl font-semibold">{invalid ? "Falta un valor válido." : reviews ? `${reviews} de 3 productos requieren revisión.` : "Los 3 productos coinciden."}</p><p className="mt-3 text-sm leading-6 text-[#c4cadb]">{invalid ? "Cantidades entre 0 y 10.000; precios entre 0 y 1.000.000. Hasta dos decimales, sin separadores de miles." : "Coincidir no autoriza un pago. Este ejemplo no evalúa impuestos, duplicados ni aprobaciones."}</p></div>
            <div className="md:text-right"><p className="text-sm text-[#c4cadb]">Total neto de la factura</p><p className="mt-2 text-3xl font-semibold tabular-nums">{invalid ? "Por completar" : formatClp(total)}</p><p className="mt-2 text-xs leading-5 text-[#c4cadb]">Sin IVA. Cada línea se redondea al peso.</p></div>
          </div>
        </section>

        <div className="mx-auto max-w-6xl"><ResourceNextStep path={reconciliationExamplePath} /></div>
        <section className="mx-auto mt-12 max-w-6xl"><div className="grid gap-8 md:grid-cols-2"><div><h2 className="text-2xl font-semibold tracking-tight">No busques que todo salga verde.</h2><p className="mt-4 text-base leading-7 text-[#505b70]">Busca saber qué resolver. Una entrega incompleta y un precio distinto necesitan conversaciones distintas: operaciones confirma lo recibido; compras revisa lo acordado.</p></div><div><h3 className="text-lg font-semibold">Conserva el respaldo de la decisión.</h3><p className="mt-3 text-base leading-7 text-[#505b70]">Descarga las diferencias y contrástalas con los documentos originales. Un cruce coincidente no revisa datos bancarios ni autoriza pagos.</p><Link to="/blog/conciliar-facturas-ordenes-compra-recepciones" className="mt-3 inline-flex min-h-11 items-center gap-2 rounded font-semibold text-[#424ec0] hover:underline focus-visible:ring-2 focus-visible:ring-primary">Leer la guía de conciliación<ArrowRight size={16} aria-hidden="true" /></Link></div></div><ToolQuestions faqs={reconciliationExampleFaqs} /></section>
      </main>
      <Footer />
    </div>
  );
}
