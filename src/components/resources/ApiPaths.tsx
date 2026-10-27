import { useState } from "react";
import { ArrowRight, ArrowUpRight, Braces, Database, KeyRound, Layers3, Radio } from "lucide-react";
import { Link } from "react-router-dom";
import { apiCatalog, requestExample } from "@/content/developerExperience";
import { CodeExample } from "./CodeExample";
import { resourceLinkClass } from "./ResourceLayout";

const focus = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4";
const paths = [
  { label: "Construir un dashboard", icon: Layers3, title: "Del total de la factura al costo de cada insumo.", text: "Cruza el detalle de compras con tu modelo de negocio. Ruka entrega cantidades, importes, clasificaciones y centros de costo; tú eliges cómo analizarlos.", nodes: ["Compras en Ruka", "Líneas y repartos", "Tu modelo de costos"], operation: "v1-purchase-lines", guide: "dashboard-costos", takeaway: "Recibes las líneas que coinciden con tus filtros, sin multiplicarlas por centro de costo.", boundary: "Conserva la precisión decimal y las unidades. Una caja y un kilo no se suman como si fueran lo mismo.", ownership: "Tu integración normaliza unidades, guarda los datos y construye las métricas." },
  { label: "Conectar un ERP", icon: Database, title: "Las compras revisadas, listas para tu integración.", text: "Consulta el libro de compras con revisión interna y recupera el documento en JSON, XML o PDF. Evita volver a transcribir lo que ya está en Ruka.", nodes: ["Revisión en Ruka", "Libro y documentos", "Registro en tu ERP"], operation: "v1-purchase-book", guide: "compras-revisadas-erp", takeaway: "Usa el cursor para recorrer documentos y date_basis=updated para consultar modificaciones.", boundary: "Revisión interna, recepción de mercadería y acuse SII son estados distintos. El libro no sustituye una declaración tributaria.", ownership: "Tu integración mapea las identidades, escribe en el ERP y comprueba el resultado." },
  { label: "Recibir cambios", icon: Radio, title: "Que un cambio en Ruka ponga tu flujo en marcha.", text: "Recibe avisos de facturas y pagos registrados. Suscribe los eventos que necesita tu sistema y procesa cada entrega con su contexto.", nodes: ["Cambio en Ruka", "Webhook firmado", "Tu receptor y cola"], operation: "v1-webhooks-create", guide: "recibir-webhooks", takeaway: "Verifica la firma, guarda el evento y responde. Después procesa el trabajo fuera de la petición.", boundary: "Las entregas pueden repetirse o llegar fuera de orden. Un pago registrado no confirma una transferencia bancaria.", ownership: "Tu receptor mantiene persistencia, deduplicación, reintentos y reconciliación histórica." },
];

export function ApiPaths({ onSelect }: { onSelect: (id: string) => void }) {
  const [selected, setSelected] = useState(0);
  return <section id="guias-api" className="mt-16 scroll-mt-28" aria-labelledby="tasks-title">
    <h2 id="tasks-title" className="max-w-2xl text-balance text-3xl font-semibold leading-tight tracking-[-0.035em] sm:text-4xl">Empieza por lo que quieres construir.</h2>
    <p className="mt-4 max-w-2xl leading-7 text-[#505b70]">Elige tu caso. Te mostramos qué entrega Ruka, qué construyes tú y por dónde partir.</p>
    <div className="mt-8 overflow-hidden rounded-2xl border border-[#dce2ed] lg:grid lg:grid-cols-[285px_minmax(0,1fr)]">
      <div className="flex flex-col gap-1 border-b border-[#dce2ed] bg-[#f7f8fc] p-3 lg:border-b-0 lg:border-r" aria-label="Qué quieres construir">{paths.map((path, index) => <button key={path.operation} type="button" aria-pressed={selected === index} aria-controls={`api-path-${index}`} onClick={() => setSelected(index)} className={`flex min-h-16 items-center gap-3 rounded-lg px-4 text-left text-sm font-semibold transition-colors duration-150 motion-reduce:transition-none ${focus} ${selected === index ? "bg-[#171827] text-white" : "text-[#505b70] hover:bg-[#e9ecf6]"}`}><path.icon size={19} aria-hidden="true" /><span className="flex-1">{path.label}</span><ArrowRight size={16} aria-hidden="true" /></button>)}</div>
      <div className="min-w-0 p-5 sm:p-8">{paths.map((path, index) => <article key={path.operation} id={`api-path-${index}`} hidden={selected !== index}>
        <h3 className="max-w-xl text-balance text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">{path.title}</h3>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-[#505b70]">{path.text}</p>
        <ol aria-label={`Flujo: ${path.label}`} className="my-6 grid gap-3 sm:grid-cols-3">{path.nodes.map((node, step) => <li key={node} className="flex items-center gap-3 border-l-2 border-[#c5ccfa] pl-3 sm:block"><span className="font-mono text-xs text-[#424ec0]">0{step + 1}</span><span className="text-sm font-semibold sm:mt-2 sm:block">{node}</span></li>)}</ol>
        <p className="rounded-lg bg-[#eef0ff] p-4 text-sm leading-6 text-[#343e8b]">{path.takeaway}</p>
        <p className="mt-4 text-sm leading-6 text-[#505b70]"><strong className="text-[#171827]">De tu lado. </strong>{path.ownership}</p>
        <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2"><a href="#explorar-api" onClick={() => onSelect(path.operation)} className={`${resourceLinkClass} text-sm`}>Ver esta operación <ArrowRight size={16} aria-hidden="true" /></a><Link to={`/desarrolladores/guias/${path.guide}`} className={`${resourceLinkClass} text-sm`}>Guía paso a paso <ArrowUpRight size={16} aria-hidden="true" /></Link></div>
        <p className="mt-4 max-w-2xl border-t border-[#dce2ed] pt-4 text-xs leading-6 text-[#60687a]">{path.boundary}</p>
      </article>)}</div>
    </div>
  </section>;
}

const startSteps = [
  { title: "Habilita el acceso", text: "Revisa con tu cuenta qué credenciales, empresas y permisos tienes disponibles. No necesitas pegar una clave aquí.", icon: KeyRound },
  { title: "Comprueba la clave", text: "Ejecuta esta petición desde tu servidor. HTTP 200 valida la clave; no concede permisos de reportes.", icon: Braces },
  { title: "Consulta tus datos", text: "Elige una operación, confirma sus permisos y adapta el ejemplo a una cuenta autorizada. Guarda la clave solo en tu servidor.", icon: Database },
];

export function ApiStart() {
  const [step, setStep] = useState(1);
  return <section id="primer-request" aria-labelledby="first-request-title" className="min-w-0 scroll-mt-28 rounded-2xl border border-[#dce2ed] bg-white">
    <div className="border-b border-[#dce2ed] px-5 py-4 sm:px-6"><div className="flex items-center justify-between gap-3"><h2 id="first-request-title" className="text-base font-semibold">Tu primera conexión</h2><span className="font-mono text-xs text-[#60687a]">HTTP / v1</span></div>
      <div className="mt-4 flex gap-1" aria-label="Pasos de la primera conexión">{startSteps.map((item, i) => <button key={item.title} type="button" aria-pressed={step === i} aria-label={`${i + 1}. ${item.title}`} onClick={() => setStep(i)} className={`min-h-11 flex-1 rounded-lg px-2 text-xs font-semibold ${focus} ${step === i ? "bg-[#eef0ff] text-[#343fad]" : "text-[#60687a] hover:bg-[#f5f6fb]"}`}>{i + 1}. {i === 0 ? "Acceso" : i === 1 ? "Petición" : "Datos"}</button>)}</div>
    </div>
    <div className="p-5 sm:p-6"><div className="mb-4 min-h-24"><h3 className="text-lg font-semibold">{startSteps[step].title}</h3><p className="mt-2 text-sm leading-6 text-[#505b70]">{startSteps[step].text}</p></div>
      {step === 1 ? <CodeExample label="Comprobar la clave · cURL" code={requestExample(apiCatalog.entries[0], "curl")} /> : step === 0 ? <a href={`${apiCatalog.reference}/login`} className={`${resourceLinkClass} min-h-20`}>Revisar acceso con mi cuenta <ArrowUpRight size={17} aria-hidden="true" /></a> : <a href="#explorar-api" className={`${resourceLinkClass} min-h-20`}>Elegir una operación <ArrowRight size={17} aria-hidden="true" /></a>}
      <p className="mt-4 flex items-start gap-2 text-xs leading-5 text-[#60687a]"><KeyRound size={14} className="mt-0.5 shrink-0" aria-hidden="true" />Ejemplos locales. Sin peticiones, credenciales ni datos de clientes.</p>
    </div>
  </section>;
}
