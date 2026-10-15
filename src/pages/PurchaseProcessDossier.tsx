import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, Copy, Download } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MarketingSeo } from "@/components/seo/MarketingSeo";

export const purchaseDossierPath = "/procesos/registrar-compras-toteat";
export const purchaseDossierTitle = "Registrar compras en Toteat: guía para tu equipo | Ruka";
export const purchaseDossierDescription = "Qué necesitas para llevar una compra a Toteat: productos, unidades, locales y una hoja para comprobar el resultado con tu equipo.";
const shareUrl = `https://www.ruka.ai${purchaseDossierPath}`;

const preparation = [
  ["Detalle de la compra", "La factura con sus productos, cantidades y precios, junto al registro de lo que recibiste.", "Compras"],
  ["Productos y unidades", "La equivalencia aprobada entre el producto de origen y el del destino. Una caja no equivale por sí sola a kilos.", "Catálogo y operación"],
  ["Local y fechas", "Dónde debe registrarse cada línea y qué fechas corresponden.", "Administración"],
  ["Responsables", "Quién resuelve una diferencia y quién confirma que la compra quedó bien registrada.", "Tu equipo"],
];
const acceptance = [
  ["Productos y cantidades", "Compara lo recibido con lo registrado. Revisa las unidades: dos cajas no son necesariamente dos kilos."],
  ["Local y fecha", "Confirma que la compra corresponde al local y al período correctos, especialmente si operas con varias sucursales."],
  ["Diferencias pendientes", "Deja claro qué falta resolver, quién se hará cargo y qué información necesita para hacerlo."],
  ["Registro final", "Revisa la compra en Toteat antes de darla por cerrada. Si no sabes si una carga llegó, confírmalo antes de repetirla."],
];
const decisionFields = [
  "Trabajo manual que queremos retirar",
  "Dónde llega hoy la factura y su detalle",
  "Destino, local y responsable del proceso",
  "Equivalencias que falta aprobar",
  "Cómo confirmamos lo recibido",
  "Diferencias habituales y quién las resuelve",
  "Cómo comprobamos el registro en Toteat",
  "Primer paso y responsable",
];

export default function PurchaseProcessDossier() {
  const [copyState, setCopyState] = useState<"idle" | "copied" | "fallback">("idle");
  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopyState("copied");
    } catch {
      setCopyState("fallback");
    }
  }
  return (
    <div className="process-dossier bg-white text-[#171827]">
      <MarketingSeo path={purchaseDossierPath} title={purchaseDossierTitle} description={purchaseDossierDescription} name="Registrar compras en Toteat" />
      <style>{`@media print {
        body:has(.process-dossier) { background: white !important; }
        body:has(.process-dossier) #root > :not(:has(.process-dossier)) { display: none !important; }
        .process-dossier .dossier-screen, .process-dossier nav, .process-dossier footer { display: none !important; }
        .process-dossier header { padding: 0 0 18pt !important; background: white !important; }
        .process-dossier main { font-size: 10pt; }
        .process-dossier h1 { font-size: 28pt !important; }
        .process-dossier h2 { font-size: 19pt !important; break-after: avoid; }
        .process-dossier section { padding: 18pt 0 !important; }
        .process-dossier p { font-size: 10pt !important; line-height: 1.55 !important; }
        .process-dossier figure, .process-dossier li, .process-dossier tr { break-inside: avoid; }
        .process-dossier .decision-sheet { break-before: page; }
        .process-dossier .decision-field { min-height: 48pt; }
        .process-dossier .dossier-print-url { display: block !important; overflow-wrap: anywhere; }
      }`}</style>
      <div className="dossier-screen"><Navbar /></div>
      <main id="dossier-main">
        <header className="bg-[#f7f8fc] px-5 pb-12 pt-28 sm:px-8 sm:pb-16 sm:pt-36">
          <div className="mx-auto max-w-6xl">
            <Link to="/integraciones/toteat" className="dossier-screen inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#505b70] underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"><ArrowLeft size={16} /> Ruka y Toteat</Link>
            <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_16rem] lg:gap-16">
              <div>
                <p className="text-sm font-semibold text-[#424ec0]">Guía de compras · Ruka y Toteat</p>
                <h1 className="mt-5 max-w-4xl text-balance text-[clamp(2.4rem,4.6vw,4rem)] font-semibold leading-[1.08] tracking-[-0.04em]">Llevar una compra a Toteat sin volver a ingresarla a mano.</h1>
                <p className="mt-6 max-w-2xl text-lg leading-8 text-[#505b70]">Si tu equipo vuelve a digitar cada compra en el POS, empieza por ordenar ese recorrido. Esta guía te ayuda a identificar los datos, las equivalencias y las revisiones que necesitas.</p>
              </div>
              <aside className="border-t border-[#dce2ed] pt-5 lg:self-end" aria-label="Qué encontrarás en esta guía">
                <p className="text-sm font-semibold">Para trabajar con tu equipo</p>
                <p className="mt-3 text-sm leading-6 text-[#505b70]">Qué preparar, qué revisar y una hoja para organizar tu proceso. Descárgala o compártela con quien lleva las compras.</p>
              </aside>
            </div>
            <div className="dossier-screen mt-8 flex flex-wrap items-center gap-3">
              <a href="#hoja-decision" className="inline-flex min-h-12 items-center gap-3 rounded-full bg-[#171827] px-6 text-sm font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">Ir a la hoja de decisión <ArrowRight size={17} /></a>
              <button type="button" onClick={copyLink} className="inline-flex min-h-12 items-center gap-2 rounded-full border border-[#cbd2e2] px-5 text-sm font-semibold hover:bg-white focus-visible:ring-2 focus-visible:ring-primary">{copyState === "copied" ? <Check size={16} /> : <Copy size={16} />} {copyState === "copied" ? "Enlace copiado" : "Copiar enlace"}</button>
              <a href="/expedientes/registrar-compras-toteat.pdf" download className="inline-flex min-h-12 items-center gap-2 rounded-full px-5 text-sm font-semibold hover:bg-white focus-visible:ring-2 focus-visible:ring-primary"><Download size={16} /> Descargar PDF</a>
            </div>
            <p role="status" aria-live="polite" className="dossier-screen mt-3 text-sm text-[#505b70]">{copyState === "copied" ? "Puedes compartir la guía con tu equipo." : copyState === "fallback" ? "No pudimos copiarlo. Selecciona el enlace de abajo para compartirlo." : "Sin registro. Puedes compartirlo o imprimirlo."}</p>
            {copyState === "fallback" && <input aria-label="Enlace para compartir" readOnly value={shareUrl} onFocus={(event) => event.currentTarget.select()} className="dossier-screen mt-3 min-h-11 w-full rounded border border-[#cbd2e2] bg-white p-3 text-sm" />}
            <p className="dossier-print-url hidden">{shareUrl}</p>
          </div>
        </header>

        <section className="px-5 py-14 sm:px-8 sm:py-20" aria-labelledby="scope-title">
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[16rem_1fr] lg:gap-16">
            <div><h2 id="scope-title" className="text-3xl font-semibold tracking-[-0.03em]">Empieza por una compra.</h2></div>
            <div className="max-w-3xl space-y-5 text-base leading-8 text-[#505b70]">
              <p>Toma una compra habitual y sigue su recorrido: dónde llega la factura, quién revisa lo recibido y cómo termina registrada en Toteat. Ahí aparecen los pasos que tu equipo repite a mano.</p>
              <p className="font-medium text-[#171827]">La meta: que cada producto quede registrado con la cantidad, la unidad y el local que corresponden.</p>
              <div className="grid gap-6 border-y border-[#dce2ed] py-6 sm:grid-cols-2">
                <div><h3 className="font-semibold text-[#171827]">Lo que se repite</h3><p className="mt-2">Copiar productos, convertir unidades y volver a ingresar cantidades. Anota qué pasos podrías dejar de hacer una vez definidas las reglas.</p></div>
                <div><h3 className="font-semibold text-[#171827]">Lo que necesita una decisión</h3><p className="mt-2">Un producto nuevo, una entrega incompleta o una unidad desconocida. Define quién lo resuelve antes de continuar.</p></div>
              </div>
              <p>Ruka puede enviar compras a Toteat en operaciones habilitadas. Revisamos contigo el acceso y la relación entre productos, unidades y locales para definir el alcance de tu operación.</p>
            </div>
          </div>
        </section>

        <section className="border-y border-[#dce2ed] bg-[#f7f8fc] px-5 py-14 sm:px-8 sm:py-20" aria-labelledby="detail-title">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-8 lg:grid-cols-[16rem_1fr] lg:gap-16">
              <div><h2 id="detail-title" className="text-3xl font-semibold tracking-[-0.03em]">La factura y lo que recibes no siempre coinciden.</h2><p className="mt-5 text-base leading-7 text-[#505b70]">Una entrega puede llegar incompleta o con otra cantidad. Conviene resolver esa diferencia antes de preparar el registro.</p></div>
              <figure>
                <a href="/assets/process-evidence/recepcion-demo.jpg" className="block rounded-xl focus-visible:ring-2 focus-visible:ring-primary" aria-label="Abrir captura de recepción en tamaño completo"><img src="/assets/process-evidence/recepcion-demo.jpg" width="840" height="315" loading="lazy" alt="Demo de recepción: tomate cherry, esperado 16 kilos, y queso mantecoso, esperado 22 kilos, con campos de cantidad recibida e incidencia." className="h-auto w-full rounded-xl border border-[#dce2ed] bg-white" /></a>
                <figcaption className="mt-4 text-sm leading-6 text-[#505b70]">Recepción de productos en <a href="https://prueba.ruka.ai" className="underline underline-offset-4">la demo de Ruka</a>, con datos de ejemplo. Puedes abrir la imagen para ver el detalle.</figcaption>
              </figure>
            </div>
            <dl className="mt-10 divide-y divide-[#dce2ed]">
              {preparation.map(([title, detail, owner]) => <div key={title} className="grid gap-2 py-5 sm:grid-cols-[12rem_1fr] sm:gap-8 lg:grid-cols-[16rem_1fr_12rem] lg:gap-16"><dt className="font-semibold">{title}</dt><dd className="max-w-2xl text-base leading-7 text-[#505b70]">{detail}</dd><dd className="text-sm leading-7 text-[#505b70]">Confirma: {owner}</dd></div>)}
            </dl>
            <p className="mt-5 text-sm leading-6 text-[#505b70]">No envíes contraseñas ni facturas de clientes por un formulario público. La primera conversación puede hacerse sin ellas.</p>
          </div>
        </section>


        <section className="border-t border-[#dce2ed] px-5 py-14 sm:px-8 sm:py-20" aria-labelledby="acceptance-title">
          <div className="mx-auto max-w-6xl">
            <h2 id="acceptance-title" className="max-w-3xl text-balance text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">Antes de dar la compra por cerrada.</h2>
            <p className="mt-5 max-w-3xl text-base leading-8 text-[#505b70]">Estas cuatro revisiones te ayudan a encontrar diferencias a tiempo y evitar que otra persona tenga que reconstruir la compra después.</p>
            <ol className="mt-8 divide-y divide-[#dce2ed] border-y border-[#dce2ed]">{acceptance.map(([title, text], index) => <li key={title} className="grid gap-3 py-6 sm:grid-cols-[2rem_14rem_1fr] sm:gap-6"><span className="text-sm font-semibold text-[#424ec0]">0{index + 1}</span><h3 className="text-lg font-semibold">{title}</h3><p className="max-w-2xl text-base leading-7 text-[#505b70]">{text}</p></li>)}</ol>
            <p className="mt-5 max-w-3xl text-sm leading-7 text-[#505b70]">Si queda una diferencia, conserva la referencia de la factura y deja una nota clara para quien la resolverá.</p>
          </div>
        </section>

        <section id="hoja-decision" className="decision-sheet scroll-mt-28 bg-[#f7f8fc] px-5 py-14 sm:px-8 sm:py-20" aria-labelledby="decision-title">
          <div className="mx-auto max-w-6xl">
            <h2 id="decision-title" className="mt-3 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">La hoja de decisión.</h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[#505b70]">Descarga la guía y completen esta hoja con una compra habitual. Les servirá para acordar qué trabajo quieren automatizar y qué necesitan resolver primero.</p>
            <dl className="mt-8 grid gap-x-10 sm:grid-cols-2">{decisionFields.map((field) => <div key={field} className="decision-field min-h-28 border-b border-[#bcc5d7] py-5"><dt className="text-sm font-semibold">{field}</dt><dd className="sr-only">Por definir con el responsable del proceso.</dd></div>)}</dl>
            <p className="mt-8 max-w-3xl text-lg font-medium leading-8">No necesitas tener todas las respuestas para conversar. Partimos por el trabajo que hoy hace tu equipo.</p>
            <div className="dossier-screen mt-8 flex flex-col gap-5 border-t border-[#dce2ed] pt-8 sm:flex-row sm:items-center sm:justify-between"><p className="max-w-xl text-base leading-7 text-[#505b70]">¿Quieres llevar este proceso a Ruka? Cuéntanos cómo registras tus compras y revisamos juntos el siguiente paso.</p><Link to="/register" className="inline-flex min-h-12 shrink-0 items-center justify-center gap-3 rounded-full bg-primary px-6 font-semibold text-white focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4">Agendar 30 min <ArrowRight size={18} /></Link></div>
          </div>
        </section>
      </main>
      <div className="dossier-screen"><Footer /></div>
    </div>
  );
}
