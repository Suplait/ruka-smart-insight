import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, Copy, Download } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MarketingSeo } from "@/components/seo/MarketingSeo";

export const purchaseDossierPath = "/procesos/registrar-compras-toteat";
export const purchaseDossierTitle = "Registrar compras en Toteat: alcance y prueba del proceso | Ruka";
export const purchaseDossierDescription = "Qué necesitas para llevar una compra a Toteat: productos, unidades, locales y una hoja para comprobar el resultado con tu equipo.";
const shareUrl = `https://www.ruka.ai${purchaseDossierPath}`;

const preparation = [
  ["Detalle de la compra", "Un documento seguro con sus líneas y lo que efectivamente se recibió.", "Compras"],
  ["Productos y unidades", "La equivalencia aprobada entre el producto de origen y el del destino. Una caja no equivale por sí sola a kilos.", "Catálogo y operación"],
  ["Local y fechas", "Dónde debe registrarse cada línea y qué fechas corresponden.", "Administración"],
  ["Acceso para probar", "Una cuenta de prueba habilitada y autorización para revisar el resultado.", "Administrador del sistema"],
];
const acceptance = [
  ["Compra válida", "Comparar cada línea, producto, cantidad, unidad, local y fecha con lo acordado antes del envío."],
  ["Unidad o local sin resolver", "Comprobar qué detiene el proceso y quién resuelve la diferencia. No completar datos por intuición."],
  ["Línea excluida", "Revisar advertencias y cobertura: un estado de envío exitoso no demuestra que llegaron todas las líneas."],
  ["Envío parcial o sin respuesta", "Revisar el destino y el historial antes de repetir. Sin certeza de lo ocurrido, detener el reintento."],
];
const decisionFields = [
  "Trabajo manual que queremos retirar",
  "Documento de prueba y detalle disponible",
  "Destino, local y responsable del proceso",
  "Equivalencias que falta aprobar",
  "Resultado esperado, línea por línea",
  "Qué debe detener el envío y quién lo resuelve",
  "Cómo revisaremos un envío sin respuesta",
  "Evidencia pendiente para autorizar el siguiente paso",
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
                <p className="text-sm font-semibold text-[#424ec0]">Expediente de proceso · Compras → Toteat</p>
                <h1 className="mt-5 max-w-4xl text-balance text-[clamp(2.4rem,4.6vw,4rem)] font-semibold leading-[1.08] tracking-[-0.04em]">Llevar una compra a Toteat sin volver a ingresarla a mano.</h1>
                <p className="mt-6 max-w-2xl text-lg leading-8 text-[#505b70]">Tu POS sigue siendo el mismo. La decisión es qué trabajo puede hacer Ruka entre la compra y su registro, y cómo comprobar que quedó bien.</p>
              </div>
              <aside className="border-t border-[#dce2ed] pt-5 lg:self-end" aria-label="Estado del expediente">
                <p className="text-sm font-semibold">Para evaluar con tu equipo</p>
                <p className="mt-3 text-sm leading-6 text-[#505b70]">Controles internos revisados. La prueba completa en una cuenta de Toteat sigue pendiente.</p>
                <p className="mt-4 text-xs text-[#505b70]">Revisado el 15 de octubre de 2026</p>
              </aside>
            </div>
            <div className="dossier-screen mt-8 flex flex-wrap items-center gap-3">
              <a href="#hoja-decision" className="inline-flex min-h-12 items-center gap-3 rounded-full bg-[#171827] px-6 text-sm font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">Ir a la hoja de decisión <ArrowRight size={17} /></a>
              <button type="button" onClick={copyLink} className="inline-flex min-h-12 items-center gap-2 rounded-full border border-[#cbd2e2] px-5 text-sm font-semibold hover:bg-white focus-visible:ring-2 focus-visible:ring-primary">{copyState === "copied" ? <Check size={16} /> : <Copy size={16} />} {copyState === "copied" ? "Enlace copiado" : "Copiar enlace"}</button>
              <a href="/expedientes/registrar-compras-toteat.pdf" download className="inline-flex min-h-12 items-center gap-2 rounded-full px-5 text-sm font-semibold hover:bg-white focus-visible:ring-2 focus-visible:ring-primary"><Download size={16} /> Descargar PDF</a>
            </div>
            <p role="status" aria-live="polite" className="dossier-screen mt-3 text-sm text-[#505b70]">{copyState === "copied" ? "Puedes compartir el expediente con tu equipo." : copyState === "fallback" ? "No pudimos copiarlo. Selecciona el enlace de abajo para compartirlo." : "Sin registro. Puedes compartirlo o imprimirlo."}</p>
            {copyState === "fallback" && <input aria-label="Enlace para compartir" readOnly value={shareUrl} onFocus={(event) => event.currentTarget.select()} className="dossier-screen mt-3 min-h-11 w-full rounded border border-[#cbd2e2] bg-white p-3 text-sm" />}
            <p className="dossier-print-url hidden">{shareUrl}</p>
          </div>
        </header>

        <section className="px-5 py-14 sm:px-8 sm:py-20" aria-labelledby="scope-title">
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[16rem_1fr] lg:gap-16">
            <div><p className="text-sm font-semibold text-[#424ec0]">01 / El alcance</p><h2 id="scope-title" className="mt-3 text-3xl font-semibold tracking-[-0.03em]">Una compra. Un resultado que revisar.</h2></div>
            <div className="max-w-3xl space-y-5 text-base leading-8 text-[#505b70]">
              <p>Ya tienes la factura. Todavía hay que relacionar sus productos con los que usas, comprobar las unidades y definir a qué local corresponde cada línea. Este expediente se concentra en preparar y enviar esa compra a Toteat.</p>
              <p className="font-medium text-[#171827]">El resultado no es «se envió una solicitud». Es que la compra correcta quedó en el local correcto, con cantidades, fechas y referencias que puedas revisar.</p>
              <div className="grid gap-6 border-y border-[#dce2ed] py-6 sm:grid-cols-2">
                <div><h3 className="font-semibold text-[#171827]">Tiene sentido evaluarlo si…</h3><p className="mt-2">El registro se repite y alguien puede aprobar productos, unidades y locales. Sigue una compra completa y cuenta también el tiempo de resolver diferencias y corregirla.</p></div>
                <div><h3 className="font-semibold text-[#171827]">Primero hay que resolver…</h3><p className="mt-2">El detalle que falta, qué llegó realmente o quién define las equivalencias. Automatizar una ambigüedad no la corrige.</p></div>
              </div>
              <p>No supone cambiar tu POS, decidir equivalencias por ti ni automatizar toda la empresa. La disponibilidad y el alcance se confirman para tu cuenta.</p>
            </div>
          </div>
        </section>

        <section className="border-y border-[#dce2ed] bg-[#f7f8fc] px-5 py-14 sm:px-8 sm:py-20" aria-labelledby="detail-title">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-8 lg:grid-cols-[16rem_1fr] lg:gap-16">
              <div><p className="text-sm font-semibold text-[#424ec0]">02 / Antes del envío</p><h2 id="detail-title" className="mt-3 text-3xl font-semibold tracking-[-0.03em]">La factura no cuenta toda la historia.</h2><p className="mt-5 text-base leading-7 text-[#505b70]">Lo facturado y lo recibido pueden ser distintos. El ejemplo muestra dónde revisar cantidades; no prueba un envío a Toteat.</p></div>
              <figure>
                <a href="/assets/process-evidence/recepcion-demo.jpg" className="block rounded-xl focus-visible:ring-2 focus-visible:ring-primary" aria-label="Abrir captura de recepción en tamaño completo"><img src="/assets/process-evidence/recepcion-demo.jpg" width="840" height="315" loading="lazy" alt="Demo de recepción: tomate cherry, esperado 16 kilos, y queso mantecoso, esperado 22 kilos, con campos de cantidad recibida e incidencia." className="h-auto w-full rounded-xl border border-[#dce2ed] bg-white" /></a>
                <figcaption className="mt-4 text-sm leading-6 text-[#505b70]">Captura de <a href="https://prueba.ruka.ai" className="underline underline-offset-4">la demo pública de Ruka</a>, con datos de ejemplo. Abre la imagen para ver el detalle. No es una compra de cliente ni evidencia de escritura en el destino.</figcaption>
              </figure>
            </div>
            <dl className="mt-10 divide-y divide-[#dce2ed]">
              {preparation.map(([title, detail, owner]) => <div key={title} className="grid gap-2 py-5 sm:grid-cols-[12rem_1fr] sm:gap-8 lg:grid-cols-[16rem_1fr_12rem] lg:gap-16"><dt className="font-semibold">{title}</dt><dd className="max-w-2xl text-base leading-7 text-[#505b70]">{detail}</dd><dd className="text-sm leading-7 text-[#505b70]">Confirma: {owner}</dd></div>)}
            </dl>
            <p className="mt-5 text-sm leading-6 text-[#505b70]">No envíes contraseñas ni facturas de clientes por un formulario público. La primera conversación puede hacerse sin ellas.</p>
          </div>
        </section>

        <section className="px-5 py-14 sm:px-8 sm:py-20" aria-labelledby="evidence-title">
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[16rem_1fr] lg:gap-16">
            <div><p className="text-sm font-semibold text-[#424ec0]">03 / La evidencia</p><h2 id="evidence-title" className="mt-3 text-3xl font-semibold tracking-[-0.03em]">Qué sabemos. Qué falta probar.</h2></div>
            <div className="space-y-6 text-base leading-8 text-[#505b70]">
              <p>Revisamos el servicio de envío con datos ficticios y respuestas controladas, sin conectarnos a Toteat. Fueron 10 pruebas internas con 57 verificaciones. Eso permite revisar controles del servicio, no afirmar que el proceso completo ya funcionó en una cuenta real.</p>
              <a href="/evidencia/compra-toteat-2026-10-15.txt" className="inline-flex min-h-11 items-center font-semibold text-[#424ec0] underline underline-offset-4 focus-visible:ring-2 focus-visible:ring-primary">Leer la ficha de prueba: versión, método y límites</a>
              <ul className="space-y-5">
                <li><strong className="text-[#171827]">Datos bloqueantes:</strong> una unidad marcada como incompatible o un local marcado como no resuelto detuvieron el envío. Falta comprobar la detección desde el documento original.</li>
                <li><strong className="text-[#171827]">Envío parcial:</strong> se conservó el fallo sin marcar toda la compra como terminada. Una línea no bloqueante, en cambio, se excluyó con una advertencia mientras otra sí se envió.</li>
                <li><strong className="text-[#171827]">Reintento:</strong> con historial disponible se solicitaron solo los grupos pendientes. Sin ese historial, se volvieron a solicitar ambos. No es una garantía universal contra duplicados.</li>
              </ul>
              <div className="rounded-xl bg-[#eef0ff] p-6 text-[#171827]"><h3 className="text-lg font-semibold">Pendiente: comprobarlo de punta a punta.</h3><p className="mt-3">Hay que probar la obtención de datos, sus equivalencias, la conservación del historial y el registro final en una cuenta autorizada. No se ha medido ahorro de tiempo de un cliente con este expediente.</p></div>
              <p>Si un envío queda sin respuesta, no asumas que no llegó. Revisa el destino y el historial antes de repetir. Si sigue siendo indeterminado, detén el reintento. Aquí no se demuestra reversión automática de un registro externo.</p>
            </div>
          </div>
        </section>

        <section className="border-t border-[#dce2ed] px-5 py-14 sm:px-8 sm:py-20" aria-labelledby="acceptance-title">
          <div className="mx-auto max-w-6xl">
            <p className="text-sm font-semibold text-[#424ec0]">04 / La prueba que proponemos</p>
            <h2 id="acceptance-title" className="mt-3 max-w-3xl text-balance text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">Acordar qué significa «quedó bien». Antes de enviar.</h2>
            <p className="mt-5 max-w-3xl text-base leading-8 text-[#505b70]">Elige una compra segura. Guarda el estado anterior y el resultado esperado, línea por línea. Después prueba estos casos en un entorno autorizado, sin provocar fallos en una operación compartida.</p>
            <ol className="mt-8 divide-y divide-[#dce2ed] border-y border-[#dce2ed]">{acceptance.map(([title, text], index) => <li key={title} className="grid gap-3 py-6 sm:grid-cols-[2rem_14rem_1fr] sm:gap-6"><span className="text-sm font-semibold text-[#424ec0]">0{index + 1}</span><h3 className="text-lg font-semibold">{title}</h3><p className="max-w-2xl text-base leading-7 text-[#505b70]">{text}</p></li>)}</ol>
            <p className="mt-5 max-w-3xl text-sm leading-7 text-[#505b70]">Registra cada caso como aprobado, fallido, indeterminado o no ejecutado. Una prueba que falta no cuenta como aprobada. Si cambian las reglas o las equivalencias, vuelve a definir el resultado esperado.</p>
          </div>
        </section>

        <section id="hoja-decision" className="decision-sheet scroll-mt-28 bg-[#f7f8fc] px-5 py-14 sm:px-8 sm:py-20" aria-labelledby="decision-title">
          <div className="mx-auto max-w-6xl">
            <p className="text-sm font-semibold text-[#424ec0]">05 / Para conversar con tu equipo</p>
            <h2 id="decision-title" className="mt-3 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">La hoja de decisión.</h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[#505b70]">Imprímela o guárdala como PDF. Completen estos puntos antes de autorizar una prueba con información real. No tienes que entregar documentos para leerla.</p>
            <dl className="mt-8 grid gap-x-10 sm:grid-cols-2">{decisionFields.map((field) => <div key={field} className="decision-field min-h-28 border-b border-[#bcc5d7] py-5"><dt className="text-sm font-semibold">{field}</dt><dd className="sr-only">Por definir con el responsable del proceso.</dd></div>)}</dl>
            <p className="mt-8 max-w-3xl text-lg font-medium leading-8">La decisión no es comprar porque la demo se ve bien. Es acordar un proceso y saber cómo reconocer que funciona.</p>
            <div className="dossier-screen mt-8 flex flex-col gap-5 border-t border-[#dce2ed] pt-8 sm:flex-row sm:items-center sm:justify-between"><p className="max-w-xl text-base leading-7 text-[#505b70]">¿Ya identificaste ese trabajo? Revisemos el alcance. Esta hoja no autoriza accesos, gastos ni cambios productivos.</p><Link to="/register" className="inline-flex min-h-12 shrink-0 items-center justify-center gap-3 rounded-full bg-primary px-6 font-semibold text-white focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4">Agendar 30 min <ArrowRight size={18} /></Link></div>
          </div>
        </section>
      </main>
      <div className="dossier-screen"><Footer /></div>
    </div>
  );
}
