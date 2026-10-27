import { useState } from "react";
import { ArrowRight, Check, ShieldCheck } from "lucide-react";

const cases = [
  { label: "Entrega nueva", steps: ["Verificar firma", "Guardar evento", "Responder 2xx", "Procesar en cola"], title: "Primero guarda. Después confirma.", copy: "Si la firma es válida, persiste el evento y el trabajo pendiente antes del 2xx. Una respuesta rápida no sirve si el proceso se cae y el evento se pierde.", active: 3 },
  { label: "Evento repetido", steps: ["Verificar firma", "Consultar identidad", "Confirmar persistencia", "No repetir efectos"], title: "Mismo evento, un solo efecto.", copy: "Deduplica por X-Ruka-Event-Id y cuenta o suscripción. Si ya está guardado, confirma su estado durable; no vuelvas a registrar la misma compra ni a aplicar el mismo movimiento.", active: 3 },
  { label: "Firma inválida", steps: ["Verificar firma", "Rechazar entrega", "No guardar negocio", "No procesar"], title: "Sin autenticidad, no hay trabajo que ejecutar.", copy: "Rechaza firmas inválidas o timestamps fuera de cinco minutos. No interpretes la factura como confiable ni apliques cambios al negocio.", active: 1 },
];

export function ApiDeliveryGuide() {
  const [selected, setSelected] = useState(0);
  return <div className="min-w-0">
    <div className="flex flex-wrap gap-1" aria-label="Situación de entrega del webhook">{cases.map((item, i) => <button key={item.label} type="button" aria-pressed={selected === i} aria-controls={`delivery-case-${i}`} onClick={() => setSelected(i)} className={`min-h-11 rounded-lg px-3 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${selected === i ? "bg-[#171827] text-white" : "text-[#505b70] hover:bg-[#e5e9f4]"}`}>{item.label}</button>)}</div>
    {cases.map((item, i) => <article id={`delivery-case-${i}`} key={item.label} hidden={selected !== i}>
      <ol aria-label={`Tratamiento recomendado: ${item.label}`} className="my-6 grid grid-cols-2 gap-3 sm:grid-cols-4">{item.steps.map((step, index) => <li key={step} className={`border-t-2 pt-3 ${index <= item.active ? "border-[#4f5beb]" : "border-[#cbd3e4]"}`}><span className="font-mono text-[11px] text-[#60687a]">0{index + 1}</span><span className="mt-2 block text-xs font-semibold leading-5">{step}</span></li>)}</ol>
      <h3 className="text-xl font-semibold tracking-tight">{item.title}</h3><p className="mt-3 text-sm leading-7 text-[#505b70]">{item.copy}</p>
    </article>)}
    <details className="mt-5 border-t border-[#d2d9e8] pt-2"><summary className="flex min-h-11 cursor-pointer items-center gap-2 rounded text-sm font-semibold text-[#343fad] focus-visible:outline-primary"><ShieldCheck size={16} aria-hidden="true" />Cómo verificar la firma</summary><p className="mt-2 text-xs leading-7 text-[#505b70]">Usa HMAC-SHA256 sobre timestamp + punto + cuerpo crudo, sin volver a serializar el JSON. Compara en tiempo constante y controla la antigüedad del timestamp. El verificador descargable muestra este paso; no incluye la cola ni la base de datos.</p></details>
    <p className="mt-4 flex items-start gap-2 text-xs leading-6 text-[#60687a]"><Check size={15} className="mt-1 shrink-0" aria-hidden="true" />Guía de diseño del receptor, no una entrega en vivo. Considera eventos fuera de orden y reconcilia el histórico.</p>
    <a href="#antes-de-produccion" className="mt-3 inline-flex min-h-11 items-center gap-2 rounded text-xs font-semibold text-[#343fad] hover:underline focus-visible:outline-primary">Llevarlo a mi pauta de integración <ArrowRight size={14} aria-hidden="true" /></a>
  </div>;
}
