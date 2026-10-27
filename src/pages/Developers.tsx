import { ArrowLeft, ArrowRight, ArrowUpRight, ChevronDown, Download } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MarketingSeo } from "@/components/seo/MarketingSeo";
import { ApiExplorer } from "@/components/resources/ApiExplorer";
import { CodeExample } from "@/components/resources/CodeExample";
import { ResourceNextStep } from "@/components/resources/ResourceNextStep";
import { resourceLinkClass } from "@/components/resources/ResourceLayout";
import { apiCatalog, apiErrorHelp, developerFaqs, requestExample } from "@/content/developerExperience";
import apiGuides from "@/content/apiGuides.json";

const reference = apiCatalog.reference;
const focus = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4";
const heading = "Tus datos operativos. En lo que quieras construir.";
const description = "API de Ruka para consultar facturas y líneas de compra, integrar tu ERP y recibir webhooks. Explora endpoints, ejemplos cURL y Node.js, permisos y paginación.";
const sectionTitle = "text-balance text-3xl font-semibold leading-tight tracking-[-0.035em] sm:text-4xl";
const summaryClass = `flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 rounded py-2 font-semibold [&::-webkit-details-marker]:hidden ${focus}`;
const tasks = [
  { title: "Un dashboard que llegue al detalle.", output: "Facturas → líneas → tu modelo de costos", text: "Trabaja con cantidades, unidades, clasificaciones y centros de costo. Analiza por proveedor o insumo sin volver a transcribir una planilla.", note: "Conserva los repartos y la precisión decimal; sumar cajas con kilos no produce un costo comparable.", endpoint: "purchase_lines", guide: apiGuides[0] },
  { title: "Las compras revisadas, en tu ERP.", output: "Revisión en Ruka → libro de compras → tu ERP", text: "Consulta los documentos con revisión interna y recupera el XML, su representación JSON o un PDF. Tu integración decide cómo registrarlos en destino.", note: "Revisión interna, recepción física y acuse del SII son estados distintos. El libro no sustituye una declaración tributaria.", endpoint: "purchase_book", guide: apiGuides[1] },
  { title: "Tu sistema al tanto de los cambios.", output: "Cambio en Ruka → webhook → tu receptor", text: "Recibe avisos de facturas y pagos registrados en Ruka. Suscribe los eventos que necesitas y procesa cada cambio en tu propio flujo.", note: "Un aviso de pago registrado no confirma una transferencia bancaria. Diseña para duplicados y entregas fuera de orden.", endpoint: "webhooks", guide: apiGuides[2] },
];

export default function Developers() {
  return <div className="min-h-screen bg-white text-[#171827]">
    <MarketingSeo path="/desarrolladores" title="API de Ruka: compras, documentos y webhooks | Ruka" name={heading} description={description} faqs={developerFaqs} />
    <a href="#contenido" className="sr-only z-50 rounded bg-white p-4 focus:not-sr-only focus:fixed focus:left-4 focus:top-4">Saltar al contenido</a>
    <Navbar />
    <main id="contenido" className="mx-auto max-w-7xl px-5 pb-24 pt-24 sm:px-8">
      <Link to="/recursos" className={`${resourceLinkClass} mb-5 text-sm`}><ArrowLeft size={15} aria-hidden="true" /> Recursos / Desarrolladores</Link>
      <header className="grid items-start gap-9 pb-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
        <div>
          <p className="text-sm font-semibold text-[#424ec0]">API de Ruka</p>
          <h1 className="mt-4 max-w-xl text-balance text-[clamp(2.3rem,4.4vw,3.75rem)] font-semibold leading-[1.06] tracking-[-0.045em]">{heading}</h1>
          <p className="mt-6 max-w-lg text-lg leading-8 text-[#505b70]">Lleva tus compras a un dashboard, conecta tu ERP o recibe cambios en tus propios sistemas.</p>
          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
            <a href="#explorar-api" className={`inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-[#4f5beb] px-6 py-3 text-sm font-semibold text-white hover:bg-[#3e48bc] ${focus}`}>Explorar la API <ArrowRight size={18} aria-hidden="true" /></a>
            <a href={reference} className={`${resourceLinkClass} text-sm`}>Referencia completa <ArrowUpRight size={17} aria-hidden="true" /></a>
          </div>
          <p className="mt-4 text-sm leading-6 text-[#60687a]">HTTP · JSON · Bearer auth · OpenAPI 3.1</p>
        </div>
        <section id="primer-request" aria-labelledby="first-request-title" className="min-w-0 scroll-mt-28 rounded-xl bg-[#f5f6fb] p-5 sm:p-6 lg:mt-1">
          <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2"><h2 id="first-request-title" className="text-lg font-semibold">Empieza por el acceso.</h2><span className="text-xs text-[#60687a]">01 / Primera petición</span></div>
          <CodeExample label="Comprobar la clave · cURL" code={requestExample(apiCatalog.entries[0], "curl")} />
          <p className="mt-4 text-sm leading-6 text-[#505b70]">Guarda la clave en tu servidor. Un <code>200</code> en <code>/ping</code> comprueba la clave, no los permisos para consultar reportes.</p>
          <a href={`${reference}/login`} className={`${resourceLinkClass} mt-2 text-sm`}>Revisar acceso con mi cuenta <ArrowUpRight size={16} aria-hidden="true" /></a>
          <p className="mt-2 text-xs leading-5 text-[#60687a]">Ejemplo para ejecutar en tu entorno. Aquí no enviamos peticiones ni solicitamos credenciales.</p>
        </section>
      </header>
      <nav aria-label="En esta página" className="flex flex-wrap gap-x-7 gap-y-1 border-y border-[#dce2ed] py-3 text-sm">
        {[["#guias-api", "Qué construir"], ["#explorar-api", "Operaciones"], ["#contrato", "Datos y paginación"], ["#webhooks", "Webhooks"], ["#errores", "Errores"], ["#preguntas", "Preguntas frecuentes"]].map(([href, label]) => <a key={href} href={href} className={resourceLinkClass}>{label}</a>)}
      </nav>

      <section id="guias-api" className="mt-16 scroll-mt-28" aria-labelledby="tasks-title">
        <div className="grid gap-5 lg:grid-cols-2 lg:gap-12"><h2 id="tasks-title" className={sectionTitle}>Menos exportaciones.<br />Más cosas construidas.</h2><p className="max-w-lg leading-8 text-[#505b70]">Ruka organiza la información de tus compras. La API te permite aprovecharla fuera de Ruka, sin cambiar las herramientas donde trabaja tu equipo.</p></div>
        <div className="mt-8 divide-y divide-[#dce2ed] border-y border-[#dce2ed]">{tasks.map((task, index) => <article key={task.endpoint} className="grid gap-5 py-7 md:grid-cols-[0.8fr_1.2fr] md:gap-12">
          <div><p className="text-xs font-semibold text-[#60687a]">0{index + 1} / {task.output}</p><h3 className="mt-3 max-w-sm text-2xl font-semibold leading-tight tracking-tight">{task.title}</h3><code className="mt-4 inline-block rounded bg-[#f0f2fc] px-2 py-1 text-xs text-[#424ec0]">{task.endpoint}</code></div>
          <div><p className="max-w-2xl leading-7 text-[#505b70]">{task.text}</p><Link to={`/desarrolladores/guias/${task.guide.slug}`} className={`${resourceLinkClass} mt-3 text-sm`}>Guía de implementación <ArrowRight size={17} aria-hidden="true" /><span className="sr-only">: {task.guide.title}</span></Link><p className="mt-3 max-w-2xl text-xs leading-6 text-[#60687a]">{task.note}</p></div>
        </article>)}</div>
      </section>

      <ApiExplorer />

      <section id="contrato" className="mt-20 scroll-mt-28" aria-labelledby="contract-title">
        <h2 id="contract-title" className={sectionTitle}>Una integración confiable empieza por leer bien los datos.</h2>
        <p className="mt-4 max-w-2xl leading-7 text-[#505b70]">No todos los reportes se recorren igual. Elige la ruta según la tarea y conserva sus filtros durante toda la extracción.</p>
        <div className="mt-8 grid gap-8 border-y border-[#dce2ed] py-8 md:grid-cols-2 md:gap-12">
          <article><p className="text-sm font-semibold text-[#424ec0]">Facturas y líneas</p><h3 className="mt-2 text-2xl font-semibold tracking-tight">Por número de página.</h3><div className="my-5 flex flex-wrap items-center gap-3 font-mono text-sm"><code className="rounded bg-[#f0f2fc] p-3">page=1</code><ArrowRight size={16} aria-hidden="true" /><code className="rounded bg-[#f0f2fc] p-3">page=2</code><span className="font-sans text-xs text-[#60687a]">hasta meta.total_pages</span></div><p className="text-sm leading-7 text-[#505b70]">Usa <code>issued_from</code> y <code>issued_to</code>. Ambos extremos se incluyen y su diferencia no puede superar 31 días. Continúa hasta <code>meta.total_pages</code>, con un máximo de 100 registros por página.</p><p className="mt-3 text-sm leading-7 text-[#505b70]">En facturas, los filtros de líneas seleccionan documentos, pero mantienen el total completo de la factura. En líneas, recibes solo las que coinciden.</p><Link to="/desarrolladores/guias/dashboard-costos" className={`${resourceLinkClass} mt-3 text-sm`}>Implementar una carga paginada <ArrowRight size={16} aria-hidden="true" /></Link></article>
          <article><p className="text-sm font-semibold text-[#424ec0]">Libro de compras</p><h3 className="mt-2 text-2xl font-semibold tracking-tight">Por cursor de continuación.</h3><div className="my-5 flex flex-wrap items-center gap-3 font-mono text-sm"><code className="rounded bg-[#f0f2fc] p-3">next_after_id</code><ArrowRight size={16} aria-hidden="true" /><code className="rounded bg-[#f0f2fc] p-3">after_id</code></div><p className="text-sm leading-7 text-[#505b70]">Usa <code>start_date</code> y <code>end_date</code>. El final debe ser anterior al mismo día del mes siguiente al inicio. Envía <code>meta.next_after_id</code> como <code>after_id</code> hasta que el cursor sea <code>null</code>.</p><p className="mt-3 text-sm leading-7 text-[#505b70]">Con <code>date_basis=updated</code> puedes buscar cambios. El libro expone estado actual, no un historial de eliminaciones: solapa ventanas y reconcilia lo que ya guardaste.</p><Link to="/desarrolladores/guias/compras-revisadas-erp" className={`${resourceLinkClass} mt-3 text-sm`}>Implementar cursor y reconciliación <ArrowRight size={16} aria-hidden="true" /></Link></article>
        </div>
        <div className="mt-4 divide-y divide-[#dce2ed]">{[
          ["Precisión, unidades y valores que faltan", "Los importes y cantidades pueden llegar como strings decimales. Conserva su precisión y trata null como información desconocida, no como cero. cost_center_allocations no multiplica la línea original: no sumes su importe y sus repartos dos veces."],
          ["Notas de crédito y débito", "include_credit_notes=true incorpora DTE 61 y 56 con sus montos originales, sin invertir el signo automáticamente. Define el tratamiento por tipo de documento antes de sumar; no restes una nota dos veces."],
          ["El documento correcto para cada uso", "purchase_documents usa folio, dte_type y vendor_tax_id. Conserva ceros iniciales del folio y agrega company_id si hay ambigüedad. JSON representa el XML almacenado; XML entrega ese archivo; PDF es una representación generada por Ruka, no el original del proveedor."],
          ["Claves, identidades y migraciones", "Una clave solo permite consultar el alcance de su cuenta. No asumas que los IDs de una integración anterior coinciden con V3. Comprueba equivalencias, permisos y empresas antes de migrar. No expongas la clave en un frontend."],
        ].map(([title, text]) => <details key={title} className="group py-2"><summary className={summaryClass}>{title}<ChevronDown size={18} className="shrink-0 group-open:rotate-180" aria-hidden="true" /></summary><p className="max-w-3xl pb-5 text-sm leading-7 text-[#505b70]">{text}</p></details>)}</div>
      </section>

      <section id="webhooks" className="mt-16 scroll-mt-28 rounded-xl bg-[#f5f6fb] p-5 sm:p-8 lg:p-10" aria-labelledby="webhooks-title">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
          <div><h2 id="webhooks-title" className={sectionTitle}>Recibe el cambio.<br />No pierdas el contexto.</h2><p className="mt-5 leading-7 text-[#505b70]">Los webhooks evitan consultar todo el día. Tu receptor debe estar preparado para una entrega repetida, un retraso o una caída.</p><Link to="/desarrolladores/guias/recibir-webhooks" className={`${resourceLinkClass} mt-4 text-sm`}>Construir el receptor <ArrowRight size={17} aria-hidden="true" /></Link><a href="/api/examples/verify-ruka-webhook.mjs" download className={`${resourceLinkClass} mt-2 text-sm`}><Download size={16} aria-hidden="true" /> Descargar verificador de firma</a><p className="mt-3 text-xs leading-6 text-[#60687a]">Ejemplo Node.js. No incluye almacenamiento ni un worker.</p></div>
          <ol className="divide-y divide-[#dce2ed]">{[
            ["Verifica antes de interpretar.", "Firma HMAC-SHA256 sobre timestamp + punto + cuerpo crudo. No vuelvas a serializar el JSON. Usa comparación de tiempo constante y rechaza timestamps fuera de cinco minutos."],
            ["Guarda antes de responder.", "Persiste el evento y el trabajo pendiente de forma durable. Deduplica por X-Ruka-Event-Id y cuenta o suscripción. Responde 2xx después de confirmar esa escritura."],
            ["Procesa y reconcilia.", "Aplica cambios sin repetir sus efectos. No asumas orden de entrega; consulta el estado actual y programa una reconciliación del histórico."],
          ].map(([title, text], index) => <li key={title} className="flex gap-4 py-5 first:pt-0"><span className="pt-1 font-mono text-sm text-[#424ec0]">0{index + 1}</span><div><h3 className="font-semibold">{title}</h3><p className="mt-2 text-sm leading-7 text-[#505b70]">{text}</p></div></li>)}</ol>
        </div>
        <details className="group mt-6 border-t border-[#dce2ed] pt-3"><summary className={summaryClass}>Antes de registrar una suscripción<ChevronDown size={17} aria-hidden="true" /></summary><p className="mt-3 max-w-4xl text-sm leading-7 text-[#505b70]">Necesitas una clave permanente de la persona dueña de la cuenta con administración y reportes, y un receptor HTTPS en el puerto 443 que responda al HEAD de comprobación con 2xx o 405. Guarda el signing_secret al crear: solo se muestra una vez. PATCH reemplaza la lista de eventos; agregar uno no recupera el pasado.</p><a href={`${reference}#webhooks-guide`} className={`${resourceLinkClass} mt-3 text-sm`}>Eventos, intentos y contrato de entrega <ArrowUpRight size={16} aria-hidden="true" /></a></details>
      </section>

      <section id="errores" className="mt-16 grid scroll-mt-28 gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:gap-14" aria-labelledby="errors-title">
        <div><h2 id="errors-title" className={sectionTitle}>Qué revisar<br />si algo falla.</h2><p className="mt-4 leading-7 text-[#505b70]">Un error de permisos no se arregla reintentando. Conserva el lote pendiente y decide según el código de cada operación.</p><a href={`${reference}#errores`} className={`${resourceLinkClass} mt-3 text-sm`}>Referencia de errores <ArrowUpRight size={16} aria-hidden="true" /></a></div>
        <div className="divide-y divide-[#dce2ed] border-y border-[#dce2ed]">{apiErrorHelp.map(([status, title, text]) => <details key={status} className="group"><summary className={summaryClass}><code className="text-sm text-[#424ec0]">{status}</code><span className="flex-1 text-sm">{title}</span><ChevronDown size={16} className="shrink-0 group-open:rotate-180" aria-hidden="true" /></summary><p className="pb-5 text-sm leading-7 text-[#505b70]">{text}</p></details>)}</div>
      </section>

      <section className="mt-16 flex flex-col justify-between gap-5 border-y border-[#dce2ed] py-8 md:flex-row md:items-center">
        <div className="max-w-2xl"><h2 className="text-2xl font-semibold tracking-tight">Llévate el contrato a tus herramientas.</h2><p className="mt-3 text-sm leading-7 text-[#505b70]">OpenAPI 3.1 con las diez operaciones, autenticación, parámetros y respuestas de referencia. Impórtalo en tu entorno: no es un SDK ni una sandbox.</p></div>
        <a href="/api/openapi.json" download className={`${resourceLinkClass} shrink-0 text-sm`}><Download size={17} aria-hidden="true" /> Descargar OpenAPI · JSON</a>
      </section>

      <section id="preguntas" className="mt-16 grid scroll-mt-28 gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:gap-14" aria-labelledby="faq-title">
        <h2 id="faq-title" className={sectionTitle}>Antes de conectar<br />una cuenta real.</h2>
        <div className="divide-y divide-[#dce2ed] border-y border-[#dce2ed]">{developerFaqs.map(faq => <details key={faq.question} className="group py-2"><summary className={summaryClass}>{faq.question}<ChevronDown size={18} className="shrink-0 group-open:rotate-180" aria-hidden="true" /></summary><p className="pb-5 text-sm leading-7 text-[#505b70]">{faq.answer}</p></details>)}</div>
      </section>
      <p className="mt-8 text-xs leading-6 text-[#60687a]">Referencia revisada el <time dateTime="2026-10-26">26 de octubre de 2026</time>. Consulta el contrato enlazado para los campos y permisos vigentes. Los ejemplos de esta página no consultan datos de clientes.</p>
      <ResourceNextStep path="/desarrolladores" />
    </main>
    <Footer />
  </div>;
}
