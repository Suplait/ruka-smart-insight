import { useState } from "react";
import { ArrowRight, Check, ClipboardCheck, DatabaseZap, ScanSearch, ShieldCheck, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { ONE_CONTACT_PATH } from "@/content/oneContent";

const examples = [
  {
    id: "margen",
    name: "Control de costos y margen",
    eyebrow: "CONTROL OPERACIONAL",
    problem: "Cada semana alguien descarga compras, junta horas hombre, actualiza una planilla y recién ahí sabe si una operación está perdiendo margen.",
    ownership: "Ruka One reúne las fuentes, mantiene la posición de costos al día, investiga diferencias y alerta cuando una desviación necesita una decisión.",
    deliverable: "Costos y margen actualizados. Desviaciones investigadas. Decisiones pendientes identificadas.",
    inputs: ["Presupuestos", "Compras", "HH y personal", "Otros gastos"],
    output: ["Posición al día", "Desviación explicada", "Responsable y siguiente acción"],
  },
  {
    id: "conciliacion",
    name: "Validación de compras",
    eyebrow: "PURCHASE TO PAY",
    problem: "La factura llega, pero todavía hay que revisar la OC, confirmar la recepción, resolver diferencias y dejar todo listo para el siguiente paso.",
    ownership: "Ruka One cruza documentos, aplica reglas, investiga discrepancias y mantiene el caso avanzando. Solo pide aprobación cuando es necesaria.",
    deliverable: "Compras verificadas, diferencias tratadas y casos listos para continuar.",
    inputs: ["Factura", "Orden de compra", "Recepción", "Políticas internas"],
    output: ["Validación terminada", "Excepciones investigadas", "Evidencia y trazabilidad"],
  },
  {
    id: "cierre",
    name: "Reportes y cierres",
    eyebrow: "FINANCE OPS",
    problem: "Finanzas depende de que alguien consolide información de varios sistemas, revise lo que no calza y prepare el cierre a mano.",
    ownership: "Ruka One recopila, concilia y actualiza las fuentes acordadas, detecta información faltante y entrega el cierre con diferencias identificadas.",
    deliverable: "Información lista cuando se necesita, sin reconstruir el reporte cada vez.",
    inputs: ["ERP", "Contabilidad", "Planillas", "Fuentes externas"],
    output: ["Cierre consolidado", "Diferencias investigadas", "Fuentes trazables"],
  },
] as const;

const responsibilities = [
  { icon: DatabaseZap, title: "Ejecutamos el trabajo", copy: "Leemos, cruzamos, clasificamos, actualizamos y movemos la información donde corresponde. No te dejamos una herramienta para que lo hagas tú." },
  { icon: ScanSearch, title: "Investigamos los problemas", copy: "Cuando algo no cuadra, buscamos la causa, revisamos evidencia y resolvemos lo que está dentro de las reglas acordadas." },
  { icon: ShieldCheck, title: "Respondemos por la operación", copy: "Acordamos alcance, responsables, controles y niveles de servicio. Medimos si la pega efectivamente está quedando hecha." },
] as const;

export function OneOwnershipSections() {
  const [activeId, setActiveId] = useState<(typeof examples)[number]["id"]>("margen");
  const active = examples.find((item) => item.id === activeId) ?? examples[0];

  return (
    <>
      <section id="que-asumimos" className="scroll-mt-20 px-5 py-20 sm:px-8 sm:py-28" aria-labelledby="one-ownership-heading">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-7 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
            <div>
              <p className="text-xs font-bold tracking-[0.16em] text-[#5369eb]">EL CAMBIO ES QUIÉN SE HACE CARGO</p>
              <h2 id="one-ownership-heading" className="mt-5 max-w-xl text-balance text-[clamp(2.5rem,4.5vw,4rem)] font-semibold leading-[1.04] tracking-[-0.045em] text-[#171827]">
                Tu equipo toma decisiones. Nosotros hacemos la pega entre medio.
              </h2>
            </div>
            <div className="flex flex-col justify-center gap-5">
              <p className="max-w-xl text-lg leading-8 text-[#495163]">
                Tener ERP, correos y planillas no significa que el proceso esté resuelto. Normalmente alguien sigue juntando datos, corrigiendo diferencias y empujando cada caso.
              </p>
              <p className="max-w-xl text-lg font-semibold leading-8 text-[#202335]">
                Esa es la operación que toma Ruka One. No vendemos horas de implementación. Nos hacemos responsables de que el trabajo acordado ocurra.
              </p>
            </div>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {responsibilities.map((item, i) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="rounded-[1.4rem] border border-[#e1e5ee] bg-white p-7 shadow-[0_15px_45px_-36px_rgba(24,39,91,0.35)] sm:p-8">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#edf0ff] text-[#5369eb]"><Icon className="h-5 w-5" aria-hidden="true" /></span>
                  <p className="mt-7 text-xs font-semibold tracking-[0.16em] text-[#8a90a0]">0{i + 1}</p>
                  <h3 className="mt-3 text-2xl font-semibold tracking-[-0.025em] text-[#202335]">{item.title}</h3>
                  <p className="mt-4 text-base leading-7 text-[#626b7b]">{item.copy}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="casos-reales" className="scroll-mt-20 border-y border-[#e0e5ee] bg-[#f1f4fa] px-5 py-20 sm:px-8 sm:py-28" aria-labelledby="one-examples-heading">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-bold tracking-[0.16em] text-[#5369eb]">EL TIPO DE OPERACIONES QUE PODEMOS TOMAR</p>
          <div className="mt-4 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <h2 id="one-examples-heading" className="max-w-3xl text-balance text-[clamp(2.5rem,4.5vw,4rem)] font-semibold leading-[1.04] tracking-[-0.045em] text-[#171827]">
              No automatizamos una tarea aislada. Nos hacemos cargo del resultado.
            </h2>
            <p className="max-w-sm text-base leading-7 text-[#626b7b]">Tres ejemplos ilustrativos de cómo se define una responsabilidad Ruka One. El alcance se acuerda para cada operación.</p>
          </div>

          <div role="tablist" aria-label="Ejemplos de operaciones" className="mt-10 flex flex-wrap gap-2">
            {examples.map((item) => (
              <button
                type="button" role="tab" key={item.id} id={`one-tab-${item.id}`}
                aria-selected={activeId === item.id} aria-controls="one-example-panel"
                onClick={() => setActiveId(item.id)}
                className={`rounded-full border px-5 py-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5369eb] focus-visible:ring-offset-2 ${activeId === item.id ? "border-[#242a50] bg-[#20253e] text-white" : "border-[#d8ddea] bg-white text-[#40475b] hover:border-[#9ba5bc]"}`}
              >{item.name}</button>
            ))}
          </div>

          <div id="one-example-panel" role="tabpanel" aria-labelledby={`one-tab-${active.id}`} className="mt-5 overflow-hidden rounded-[1.6rem] border border-[#dce1ec] bg-white shadow-[0_18px_80px_-55px_rgba(20,34,78,0.25)]">
            <div className="grid lg:grid-cols-2">
              <div className="border-b border-[#e2e6ef] p-7 sm:p-10 lg:border-b-0 lg:border-r">
                <p className="text-xs font-bold tracking-[0.16em] text-[#9096a5]">HOY</p>
                <h3 className="mt-4 text-[27px] font-semibold leading-tight tracking-[-0.03em] text-[#262b39] sm:text-[32px]">El proceso sigue dependiendo de una persona.</h3>
                <p className="mt-5 text-base leading-8 text-[#616a7a]">{active.problem}</p>
                <div className="mt-9 flex flex-wrap gap-2">{active.inputs.map((input) => <span key={input} className="rounded-lg border border-[#dfe4ed] bg-[#f7f8fb] px-3 py-2 text-xs font-semibold text-[#5a6373]">{input}</span>)}</div>
                <p className="mt-4 text-xs text-[#9298a5]">Fuentes que alguien debe juntar y revisar</p>
              </div>
              <div className="bg-[#f9faff] p-7 sm:p-10">
                <p className="text-xs font-bold tracking-[0.16em] text-[#5369eb]">CON RUKA ONE · {active.eyebrow}</p>
                <h3 className="mt-4 text-[27px] font-semibold leading-tight tracking-[-0.03em] text-[#212743] sm:text-[32px]">Esa operación pasa a ser nuestra.</h3>
                <p className="mt-5 text-base leading-8 text-[#4b5571]">{active.ownership}</p>
                <div className="mt-7 space-y-3">
                  {active.output.map((item) => <div key={item} className="flex items-center gap-3 rounded-xl border border-[#dfe4f7] bg-white px-4 py-3 text-sm font-semibold text-[#344063]"><Check className="h-4 w-4 shrink-0 text-[#5369eb]" aria-hidden="true" />{item}</div>)}
                </div>
                <p className="mt-6 text-sm font-semibold leading-6 text-[#303a62]">{active.deliverable}</p>
              </div>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-between gap-5">
            <p className="max-w-2xl text-sm leading-6 text-[#737b8d]">Los ejemplos describen tipos de servicio, no resultados atribuidos a clientes específicos.</p>
            <Link to={ONE_CONTACT_PATH} className="inline-flex items-center gap-2 text-sm font-semibold text-[#4259cf] hover:text-[#273cad] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5369eb]">
              Hablemos de tu proceso <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section id="compromiso" className="scroll-mt-20 px-5 py-20 sm:px-8 sm:py-28" aria-labelledby="one-accountability-heading">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:gap-20">
            <div>
              <p className="text-xs font-bold tracking-[0.16em] text-[#5369eb]">OWNERSHIP, NO SOLO SOFTWARE</p>
              <h2 id="one-accountability-heading" className="mt-5 text-balance text-[clamp(2.5rem,4.4vw,4rem)] font-semibold leading-[1.04] tracking-[-0.045em] text-[#171827]">
                Si algo falla, no te entregamos simplemente una alerta y nos vamos.
              </h2>
              <p className="mt-6 max-w-lg text-lg leading-8 text-[#626b7b]">
                Nos hacemos cargo de monitorear el proceso, investigar las diferencias y mantener el trabajo avanzando. Si hace falta tu decisión, llegamos con el caso, el contexto y las opciones claras.
              </p>
            </div>
            <div className="overflow-hidden rounded-[1.5rem] border border-[#dce1ec] bg-white shadow-[0_20px_75px_-53px_rgba(24,39,91,0.25)]">
              <div className="border-b border-[#e8ebf1] bg-[#f8faff] px-6 py-5">
                <p className="text-xs font-bold tracking-[0.13em] text-[#5369eb]">CÓMO SE DEFINE EL SERVICIO</p>
                <p className="mt-2 text-xl font-semibold text-[#242a3c]">Responsabilidades por escrito. Resultados medibles.</p>
              </div>
              <div className="divide-y divide-[#e8ebf1] px-6">
                {[
                  ["01", "Trabajo asumido", "Qué proceso ejecutamos de principio a fin y qué queda fuera."],
                  ["02", "Calidad y tiempos", "Qué debe estar listo, con qué controles y dentro de qué plazo."],
                  ["03", "Excepciones", "Qué investigamos nosotros y qué decisiones necesita tu equipo."],
                  ["04", "Seguimiento", "Cómo verificamos el resultado y cómo mejoramos la operación."],
                ].map(([n, title, copy]) => (
                  <div key={n} className="flex gap-5 py-5">
                    <span className="text-xs font-bold tabular-nums text-[#9aa1af]">{n}</span>
                    <div><p className="font-semibold text-[#252c40]">{title}</p><p className="mt-1 text-sm leading-6 text-[#667080]">{copy}</p></div>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-3 border-t border-[#e8ebf1] bg-[#f8faff] px-6 py-5 text-sm font-semibold text-[#344064]"><ClipboardCheck className="h-5 w-5 text-[#5369eb]" aria-hidden="true" /> La responsabilidad no termina en el deploy.</div>
            </div>
          </div>
          <div className="mt-12 grid gap-4 border-t border-[#dfe3eb] pt-10 sm:grid-cols-3">
            <div className="flex gap-3"><TrendingUp className="mt-1 h-5 w-5 shrink-0 text-[#5369eb]" /><p className="text-sm leading-6 text-[#586274]"><strong className="block text-base text-[#272d3d]">Impacto de negocio</strong> Menos horas manuales, menos errores y decisiones con información más fresca.</p></div>
            <div className="flex gap-3"><ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-[#5369eb]" /><p className="text-sm leading-6 text-[#586274]"><strong className="block text-base text-[#272d3d]">Control y trazabilidad</strong> Cada acción deja evidencia y cada excepción tiene estado y responsable.</p></div>
            <div className="flex gap-3"><DatabaseZap className="mt-1 h-5 w-5 shrink-0 text-[#5369eb]" /><p className="text-sm leading-6 text-[#586274]"><strong className="block text-base text-[#272d3d]">Tus sistemas siguen</strong> Nos integramos a lo que ya usas y levantamos herramientas propias solo cuando hacen falta.</p></div>
          </div>
        </div>
      </section>
    </>
  );
}
