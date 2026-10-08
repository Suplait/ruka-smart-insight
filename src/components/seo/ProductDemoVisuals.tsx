import {
  ArrowRight,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  CreditCard,
  Database,
  FileText,
  Landmark,
  Link2,
  ListChecks,
  ReceiptText,
  Send,
  ShieldCheck,
  SlidersHorizontal,
  Store,
  TriangleAlert,
} from "lucide-react";
import type { ReactNode } from "react";

type SourceCardProps = {
  icon: typeof FileText;
  label: string;
  detail: string;
  tone?: "default" | "success" | "warning";
};

function SourceCard({ icon: Icon, label, detail, tone = "default" }: SourceCardProps) {
  const tones = {
    default: "border-[#dce2ed] bg-white text-[#4b5a78]",
    success: "border-[#bde8d6] bg-[#f2fcf7] text-[#15805d]",
    warning: "border-[#f0d4a4] bg-[#fffaf0] text-[#a36810]",
  };

  return (
    <div className={`rounded-lg border px-2.5 py-2 sm:px-3 sm:py-2.5 ${tones[tone]}`}>
      <div className="flex items-center gap-1.5">
        <Icon className="h-3.5 w-3.5 flex-none" strokeWidth={1.9} />
        <span className="truncate text-[10px] font-semibold sm:text-xs">{label}</span>
      </div>
      <p className="mt-1 truncate text-[9px] opacity-75 sm:text-[10px]">{detail}</p>
    </div>
  );
}

type ConciliationStage = "overview" | "sources" | "rules" | "exceptions";

function RukaGlyph() {
  return (
    <span className="relative block h-5 w-5" aria-hidden="true">
      <span className="absolute left-0 top-0 h-3.5 w-3.5 rounded-[5px_5px_5px_9px] bg-primary" />
      <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-primary" />
    </span>
  );
}

function ConciliationShell({
  section,
  title,
  status,
  tone = "success",
  children,
}: {
  section: string;
  title: string;
  status: string;
  tone?: "success" | "warning";
  children: ReactNode;
}) {
  return (
    <div className="absolute inset-0 flex overflow-hidden bg-[#f5f7fb] text-[#25314b]">
      <aside className="hidden w-11 shrink-0 flex-col items-center border-r border-[#e2e6ee] bg-[#171a29] py-3 sm:flex">
        <RukaGlyph />
        <div className="mt-6 flex flex-col gap-2">
          {[FileText, Link2, ListChecks].map((Icon, index) => (
            <span key={index} className={`grid h-7 w-7 place-items-center rounded-lg ${index === 1 ? "bg-white/[0.13] text-white" : "text-[#737b92]"}`}>
              <Icon className="h-3.5 w-3.5" strokeWidth={1.8} />
            </span>
          ))}
        </div>
        <span className="mt-auto h-6 w-6 rounded-full border border-white/10 bg-[#292d40]" />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-11 shrink-0 items-center justify-between gap-3 border-b border-[#e2e6ee] bg-white px-3 sm:px-4">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-[8px] font-medium text-[#8a93a6] sm:text-[9px]">
              <span>Conciliaciones</span><ChevronRight className="h-2.5 w-2.5" /><span className="truncate">{section}</span>
            </div>
            <p className="mt-0.5 truncate text-[10px] font-semibold text-[#303a52] sm:text-[11px]">{title}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden items-center gap-1 text-[8px] text-[#8992a4] sm:flex"><Clock3 className="h-3 w-3" /> Actualizado ahora</span>
            <span className={`rounded-full px-2 py-1 text-[8px] font-semibold sm:text-[9px] ${tone === "success" ? "bg-[#e9f8f1] text-[#167b5b]" : "bg-[#fff2df] text-[#9b6114]"}`}>{status}</span>
          </div>
        </header>
        <div className="min-h-0 flex-1 p-2.5 sm:p-3.5">{children}</div>
      </div>
    </div>
  );
}

const sourceDocuments = [
  { Icon: FileText, label: "Factura 84127", meta: "SII · 05 may", value: "$428.950" },
  { Icon: ReceiptText, label: "Orden 1089", meta: "Defontana · Aprobada", value: "$428.950" },
  { Icon: Store, label: "Recepción", meta: "Bodega · Completa", value: "4 ítems" },
  { Icon: Landmark, label: "Movimiento", meta: "Banco · Detectado", value: "$428.950" },
];

function ConciliationSourcesVisual() {
  return (
    <ConciliationShell section="Caso 84127" title="Reunir evidencia" status="4 de 4 fuentes">
      <div className="grid h-full grid-cols-[1.05fr_0.95fr] gap-2.5 sm:gap-3.5">
        <section className="min-w-0 rounded-xl border border-[#dfe4ed] bg-white p-2.5 sm:p-3.5">
          <div className="flex items-end justify-between border-b border-[#edf0f4] pb-2">
            <div>
              <p className="text-[9px] font-semibold text-[#34405a] sm:text-[10px]">Documentos encontrados</p>
              <p className="hidden text-[8px] text-[#8a93a6] sm:block">Ruka relaciona cada fuente con el mismo caso.</p>
            </div>
            <span className="font-mono text-[8px] font-semibold text-primary sm:text-[9px]">4/4</span>
          </div>
          <div className="relative mt-1.5 sm:mt-2">
            <span className="absolute bottom-3 left-[13px] top-3 w-px bg-[#dfe4f4]" aria-hidden="true" />
            {sourceDocuments.map(({ Icon, label, meta, value }, index) => (
              <div key={label} className="relative grid grid-cols-[1.35rem_minmax(0,1fr)_auto] items-center gap-2 py-1.5 sm:grid-cols-[1.55rem_minmax(0,1fr)_auto] sm:py-2">
                <span className="relative z-10 grid h-[1.35rem] w-[1.35rem] place-items-center rounded-md border border-[#dce2ee] bg-white text-[#64708b] sm:h-[1.55rem] sm:w-[1.55rem]">
                  <Icon className="h-3 w-3" strokeWidth={1.9} />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-[8px] font-semibold text-[#34405a] sm:text-[10px]">{label}</p>
                  <p className="truncate text-[7px] text-[#8a93a6] sm:text-[8px]">{meta}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="hidden font-mono text-[8px] font-medium text-[#5b6579] sm:block">{value}</span>
                  <CheckCircle2 className="h-3 w-3 text-[#1b8a65]" />
                </div>
                {index < sourceDocuments.length - 1 && <span className="absolute -bottom-0.5 left-[11px] h-1 w-1 rounded-full bg-primary/35 sm:left-[12px]" aria-hidden="true" />}
              </div>
            ))}
          </div>
        </section>

        <section className="relative min-w-0 overflow-hidden rounded-xl bg-[#171a29] p-3 text-white sm:p-4">
          <span className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-primary/25 blur-3xl" aria-hidden="true" />
          <div className="relative flex items-center justify-between">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-white/10 text-[#aeb8ff]"><Building2 className="h-3.5 w-3.5" /></span>
            <span className="flex items-center gap-1 text-[7px] font-medium text-[#8ee0bd] sm:text-[8px]"><span className="h-1.5 w-1.5 rounded-full bg-[#59c99a]" /> Caso completo</span>
          </div>
          <p className="relative mt-2.5 text-[8px] text-[#929aad] sm:text-[9px]">Proveedor</p>
          <p className="relative mt-0.5 truncate text-[12px] font-semibold sm:text-[15px]">Comercial La Huerta</p>
          <p className="relative mt-2 font-mono text-lg font-semibold tracking-[-0.04em] sm:mt-2.5 sm:text-2xl">$428.950</p>
          <div className="relative mt-2 grid grid-cols-2 gap-x-2 gap-y-1.5 border-t border-white/10 pt-2 text-[7px] sm:mt-3 sm:gap-y-2 sm:pt-3 sm:text-[8px]">
            <span className="text-[#8f97aa]">Factura</span><strong className="text-right font-medium">84127</strong>
            <span className="text-[#8f97aa]">Orden</span><strong className="text-right font-medium">1089</strong>
            <span className="text-[#8f97aa]">Recepción</span><strong className="text-right font-medium text-[#86dfbb]">Completa</strong>
          </div>
          <div className="relative mt-2 flex items-center gap-1.5 border-t border-white/10 pt-2 text-[7px] text-[#b3bac9] sm:mt-3 sm:pt-3 sm:text-[8px]">
            <CalendarDays className="h-3 w-3 text-[#9ca8ff]" /> 05 may 2026 · evidencia vinculada
          </div>
        </section>
      </div>
    </ConciliationShell>
  );
}

function ConciliationRulesVisual() {
  const rules = [
    ["Proveedor", "76.184.927-3", "76.184.927-3"],
    ["Monto total", "$428.950", "$428.950"],
    ["Orden de compra", "OC 1089", "OC 1089"],
    ["Recepción", "4 ítems", "4 ítems"],
  ];
  return (
    <ConciliationShell section="Caso 84127" title="Aplicar reglas" status="4 reglas aprobadas">
      <div className="grid h-full grid-cols-[1.2fr_0.8fr] gap-2.5 sm:gap-3.5">
        <section className="min-w-0 rounded-xl border border-[#dfe4ed] bg-white p-2.5 sm:p-3.5">
          <div className="flex items-center justify-between border-b border-[#edf0f4] pb-2">
            <div className="flex items-center gap-1.5"><SlidersHorizontal className="h-3 w-3 text-primary" /><p className="text-[9px] font-semibold text-[#34405a] sm:text-[10px]">Validación automática</p></div>
            <span className="text-[8px] font-medium text-[#7b8598]">Tolerancia $0</span>
          </div>
          <div className="mt-1.5">
            <div className="hidden grid-cols-[0.9fr_1fr_1fr_auto] gap-2 px-2 py-1 text-[7px] font-medium text-[#98a0b0] sm:grid">
              <span>Regla</span><span>Documento base</span><span>Valor encontrado</span><span>Estado</span>
            </div>
            {rules.map(([label, expected, found], index) => (
              <div key={label} className="grid grid-cols-[1fr_auto] items-center gap-2 border-t border-[#edf0f4] px-1 py-1.5 text-[8px] sm:grid-cols-[0.9fr_1fr_1fr_auto] sm:px-2 sm:py-2 sm:text-[9px]">
                <span className="font-semibold text-[#3c475f]">{label}</span>
                <span className="hidden font-mono text-[#707a90] sm:block">{expected}</span>
                <span className="hidden font-mono text-[#3f4b63] sm:block">{found}</span>
                <span className="flex items-center gap-1 font-semibold text-[#17815f]"><CheckCircle2 className="h-3 w-3" /> <span className="hidden sm:inline">Coincide</span></span>
                {index === 0 && <span className="col-span-full hidden h-0.5 overflow-hidden rounded-full bg-[#edf0f4] sm:block"><span className="block h-full w-full bg-primary" /></span>}
              </div>
            ))}
          </div>
        </section>

        <section className="relative flex min-w-0 flex-col justify-between overflow-hidden rounded-xl border border-[#cdd6ff] bg-[#eef1ff] p-3 sm:p-4">
          <span className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/10 blur-2xl" aria-hidden="true" />
          <div>
            <span className="grid h-8 w-8 place-items-center rounded-full bg-primary text-white shadow-[0_7px_18px_rgba(79,96,230,0.22)]"><CheckCircle2 className="h-4 w-4" /></span>
            <p className="mt-3 text-[8px] font-medium text-primary sm:text-[9px]">Decisión de Ruka</p>
            <p className="mt-1 text-base font-semibold tracking-[-0.03em] text-[#242e4b] sm:text-xl">Conciliado</p>
            <p className="mt-1 text-[8px] leading-3.5 text-[#687493] sm:text-[9px] sm:leading-4">Factura, orden y recepción coinciden con las reglas de tu operación.</p>
          </div>
          <div className="mt-2 border-t border-[#d7ddfb] pt-2 sm:mt-3 sm:pt-3">
            <div className="flex items-center justify-between text-[7px] sm:text-[8px]"><span className="text-[#77819d]">Reglas cumplidas</span><strong className="font-mono text-[#34425f]">4 / 4</strong></div>
            <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-white"><span className="block h-full w-full rounded-full bg-primary" /></div>
            <p className="mt-2 text-[7px] font-semibold text-[#17815f] sm:text-[8px]">Sin revisión manual</p>
          </div>
        </section>
      </div>
    </ConciliationShell>
  );
}

function ConciliationExceptionsVisual() {
  const cases = [
    ["84129", "La Huerta", "Recepción incompleta", "selected"],
    ["84134", "Distribuidora Sur", "Fecha distinta", ""],
    ["84141", "Central Foods", "Monto fuera de rango", ""],
  ];
  return (
    <ConciliationShell section="Bandeja" title="Resolver diferencias" status="4 requieren decisión" tone="warning">
      <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-[#dfe4ed] bg-white">
        <div className="grid shrink-0 grid-cols-3 divide-x divide-[#e8ebf1] border-b border-[#e8ebf1]">
          {[["128", "procesados"], ["124", "automáticos"], ["4", "por revisar"]].map(([value, label], index) => (
            <div key={label} className="flex items-baseline gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2">
              <strong className={`font-mono text-sm sm:text-base ${index === 2 ? "text-[#a56818]" : "text-[#303b55]"}`}>{value}</strong>
              <span className="truncate text-[7px] text-[#818a9c] sm:text-[8px]">{label}</span>
            </div>
          ))}
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-[0.82fr_1.18fr]">
          <section className="min-h-0 border-r border-[#e8ebf1] bg-[#fbfcfe] p-2 sm:p-2.5">
            <div className="flex items-center justify-between px-1 pb-1.5"><p className="text-[8px] font-semibold text-[#505b71] sm:text-[9px]">Casos pendientes</p><span className="font-mono text-[7px] text-[#929aab]">4</span></div>
            <div className="space-y-1">
              {cases.map(([id, provider, issue, selected]) => (
                <div key={id} className={`rounded-lg border px-2 py-1.5 transition-colors ${selected ? "border-[#cbd4ff] bg-[#eef1ff]" : "border-transparent bg-transparent"}`}>
                  <div className="flex items-center justify-between gap-1"><strong className="text-[8px] text-[#354159] sm:text-[9px]">Factura {id}</strong><ChevronRight className={`h-3 w-3 ${selected ? "text-primary" : "text-[#a0a7b6]"}`} /></div>
                  <p className="mt-0.5 truncate text-[7px] text-[#7e8799] sm:text-[8px]">{provider}</p>
                  <p className={`mt-0.5 truncate text-[7px] font-medium sm:text-[8px] ${selected ? "text-[#9b6114]" : "text-[#838b9b]"}`}>{issue}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="min-w-0 p-2.5 sm:p-3">
            <div className="flex items-start justify-between gap-2 border-b border-[#edf0f4] pb-2">
              <div><p className="text-[8px] font-semibold text-[#34405a] sm:text-[10px]">Recepción incompleta</p><p className="mt-0.5 text-[7px] text-[#8891a3] sm:text-[8px]">Factura 84129 · Comercial La Huerta</p></div>
              <span className="rounded-full bg-[#fff1df] px-1.5 py-0.5 text-[7px] font-semibold text-[#9b6114]">Revisar</span>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-[#fff3ee] text-[#b15b45]"><TriangleAlert className="h-3.5 w-3.5" /></span>
              <div className="min-w-0"><p className="truncate text-[8px] font-semibold text-[#3d485f] sm:text-[9px]">Tomate cherry premium</p><p className="truncate text-[7px] text-[#8991a2] sm:text-[8px]">La recepción tiene 2 kg menos que la orden.</p></div>
            </div>
            <div className="mt-2 grid grid-cols-[1fr_auto_1fr] items-center gap-1.5">
              <div className="rounded-lg bg-[#f5f7fa] p-1.5 sm:p-2"><span className="block text-[7px] text-[#8a92a2]">Ordenado</span><strong className="mt-0.5 block font-mono text-[10px] text-[#374158] sm:text-xs">16 kg</strong></div>
              <ArrowRight className="h-3 w-3 text-[#9ca4b3]" />
              <div className="rounded-lg bg-[#fff2ed] p-1.5 sm:p-2"><span className="block text-[7px] text-[#9c786f]">Recibido</span><strong className="mt-0.5 block font-mono text-[10px] text-[#a24d3c] sm:text-xs">14 kg</strong></div>
            </div>
            <div className="mt-2 flex items-center justify-between gap-1.5 border-t border-[#edf0f4] pt-2">
              <button type="button" className="truncate rounded-md border border-[#dce1e9] px-2 py-1 text-[7px] font-semibold text-[#606a7d] sm:text-[8px]">Ver evidencia</button>
              <button type="button" className="truncate rounded-md bg-[#171a29] px-2 py-1 text-[7px] font-semibold text-white sm:text-[8px]">Resolver caso</button>
            </div>
          </section>
        </div>
      </div>
    </ConciliationShell>
  );
}

export function ConciliationWorkspaceVisual({ stage = "overview" }: { stage?: ConciliationStage }) {
  if (stage === "sources") return <div className="absolute inset-0 bg-[#f8f9fc] p-3 text-[#33415d] sm:p-5"><ConciliationSourcesVisual /></div>;
  if (stage === "rules") return <div className="absolute inset-0 bg-[#f8f9fc] p-3 text-[#33415d] sm:p-5"><ConciliationRulesVisual /></div>;
  if (stage === "exceptions") return <div className="absolute inset-0 bg-[#f8f9fc] p-3 text-[#33415d] sm:p-5"><ConciliationExceptionsVisual /></div>;

  return (
    <div className="absolute inset-0 bg-[#f8f9fc] p-3 text-[#33415d] sm:p-5">
      <div className="flex items-center justify-between gap-3 border-b border-[#e1e6ef] pb-2.5 sm:pb-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className="flex h-6 w-6 flex-none items-center justify-center rounded-md bg-[#eef1ff] text-primary sm:h-7 sm:w-7">
            <Link2 className="h-3.5 w-3.5" strokeWidth={2} />
          </span>
          <div className="min-w-0">
            <p className="truncate text-[10px] font-semibold sm:text-xs">Conciliación · Factura Nº 84127</p>
            <p className="hidden text-[9px] text-[#73809a] sm:block">Validación de documentos y pagos</p>
          </div>
        </div>
        <span className="rounded-full bg-[#eaf9f3] px-2 py-1 text-[9px] font-semibold text-[#16815e] sm:text-[10px]">En revisión</span>
      </div>

      <div className="mt-3 grid grid-cols-[1.2fr_0.58fr_0.92fr] gap-2 sm:mt-4 sm:gap-3">
        <section className="rounded-xl border border-[#dce2ed] bg-white p-2 sm:p-3">
          <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#7b8598] sm:text-[10px]">Fuentes para cruzar</p>
          <div className="mt-2 space-y-1.5 sm:mt-2.5 sm:space-y-2">
            <SourceCard icon={FileText} label="Factura Nº 84127" detail="$428.950 · Comercial La Huerta" />
            <SourceCard icon={ReceiptText} label="Orden de compra 1089" detail="$428.950 · Aprobada" />
            <SourceCard icon={Store} label="Recepción de bodega" detail="4 productos · Recibido" tone="success" />
            <SourceCard icon={Landmark} label="Movimiento bancario" detail="$428.950 · Pendiente" tone="warning" />
          </div>
        </section>

        <section className="flex flex-col items-center justify-center rounded-xl border border-[#cfd7ff] bg-[#f2f4ff] p-2 text-center sm:p-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white shadow-[0_6px_14px_rgba(80,97,227,0.25)] sm:h-10 sm:w-10">
            <Link2 className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={2} />
          </span>
          <p className="mt-2 text-[10px] font-semibold text-primary sm:text-xs">Reglas Ruka</p>
          <p className="mt-1 text-[8px] leading-3 text-[#6d78a5] sm:text-[9px]">Monto, proveedor, fecha y recepción</p>
          <ArrowRight className="mt-2 h-4 w-4 text-primary sm:mt-3" />
        </section>

        <section className="rounded-xl border border-[#dce2ed] bg-white p-2 sm:p-3">
          <div className="flex items-center justify-between gap-1">
            <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#7b8598] sm:text-[10px]">Resultado</p>
            <CheckCircle2 className="h-3.5 w-3.5 text-[#16936a]" />
          </div>
          <div className="mt-2 rounded-lg border border-[#bde8d6] bg-[#f2fcf7] p-2 sm:mt-2.5 sm:p-3">
            <p className="text-[11px] font-semibold text-[#137657] sm:text-sm">Coincidencia encontrada</p>
            <p className="mt-1 text-[8px] leading-3 text-[#4c7d69] sm:text-[10px]">Factura, orden y recepción cumplen las reglas definidas.</p>
          </div>
          <div className="mt-2 flex items-center justify-between rounded-lg bg-[#f6f8fc] px-2 py-1.5 text-[8px] sm:mt-2.5 sm:text-[10px]">
            <span className="text-[#65708a]">Monto validado</span>
            <span className="font-semibold text-[#304565]">$428.950</span>
          </div>
        </section>
      </div>

      <section className="mt-3 rounded-xl border border-[#dce2ed] bg-white p-2 sm:mt-4 sm:p-3">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[9px] font-semibold text-[#526078] sm:text-[10px]">Excepciones que necesitan decisión</p>
          <span className="rounded-full bg-[#fff0f5] px-1.5 py-0.5 text-[8px] font-semibold text-[#c42d6e] sm:text-[9px]">1 diferencia</span>
        </div>
        <div className="mt-2 grid grid-cols-[1.2fr_0.7fr_0.7fr_0.65fr] gap-2 border-t border-[#edf0f5] pt-2 text-[8px] sm:text-[10px]">
          <span className="font-medium text-[#42516c]">Factura Nº 84129</span>
          <span className="text-[#728099]">Esperado: 16 kg</span>
          <span className="text-[#728099]">Recibido: 14 kg</span>
          <span className="font-semibold text-[#c42d6e]">Revisar</span>
        </div>
      </section>
    </div>
  );
}

export function IntegrationsWorkspaceVisual() {
  return (
    <div className="absolute inset-0 bg-[#f8f9fc] p-3 text-[#33415d] sm:p-5">
      <div className="flex items-center justify-between gap-3 border-b border-[#e1e6ef] pb-2.5 sm:pb-3">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#eef1ff] text-primary sm:h-7 sm:w-7">
            <Database className="h-3.5 w-3.5" strokeWidth={2} />
          </span>
          <div>
            <p className="text-[10px] font-semibold sm:text-xs">Centro de integraciones</p>
            <p className="hidden text-[9px] text-[#73809a] sm:block">Fuentes conectadas y flujos activos</p>
          </div>
        </div>
        <button type="button" className="rounded-md bg-primary px-2 py-1 text-[9px] font-semibold text-white sm:px-2.5 sm:text-[10px]">Nueva conexión</button>
      </div>

      <div className="mt-3 grid grid-cols-[0.95fr_0.62fr_0.95fr] items-center gap-2 sm:mt-4 sm:gap-3">
        <section className="rounded-xl border border-[#dce2ed] bg-white p-2 sm:p-3">
          <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#7b8598] sm:text-[10px]">Fuentes</p>
          <div className="mt-2 space-y-1.5 sm:mt-2.5 sm:space-y-2">
            <div className="flex items-center gap-2 rounded-lg border border-[#e4e8f0] px-2 py-1.5 sm:px-2.5 sm:py-2">
              <img src="/integrations/sii.jpg" alt="SII" className="h-4 w-4 rounded-full object-cover sm:h-5 sm:w-5" />
              <span className="text-[9px] font-semibold sm:text-[10px]">SII</span>
              <CheckCircle2 className="ml-auto h-3 w-3 text-[#1a9a6e]" />
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-[#e4e8f0] px-2 py-1.5 sm:px-2.5 sm:py-2">
              <img src="/integrations/toteat.svg" alt="Toteat" className="h-4 w-7 object-contain sm:h-5 sm:w-8" />
              <span className="text-[9px] font-semibold sm:text-[10px]">Toteat</span>
              <CheckCircle2 className="ml-auto h-3 w-3 text-[#1a9a6e]" />
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-[#e4e8f0] px-2 py-1.5 sm:px-2.5 sm:py-2">
              <img src="/integrations/defontana.svg" alt="Defontana" className="h-4 w-7 object-contain sm:h-5 sm:w-8" />
              <span className="text-[9px] font-semibold sm:text-[10px]">Defontana</span>
              <CheckCircle2 className="ml-auto h-3 w-3 text-[#1a9a6e]" />
            </div>
          </div>
        </section>

        <section className="flex flex-col items-center justify-center rounded-xl border border-[#cfd7ff] bg-[#f2f4ff] px-2 py-4 text-center sm:py-5">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white shadow-[0_6px_14px_rgba(80,97,227,0.25)] sm:h-11 sm:w-11">
            <Link2 className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={2} />
          </span>
          <p className="mt-2 text-[10px] font-semibold text-primary sm:text-xs">Ruka</p>
          <p className="mt-1 text-[8px] leading-3 text-[#6d78a5] sm:text-[9px]">Lee, ordena y valida</p>
          <div className="mt-2 flex items-center gap-1 text-primary sm:mt-3">
            <ArrowRight className="h-3.5 w-3.5" />
            <ArrowRight className="h-3.5 w-3.5" />
          </div>
        </section>

        <section className="rounded-xl border border-[#dce2ed] bg-white p-2 sm:p-3">
          <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#7b8598] sm:text-[10px]">Destinos</p>
          <div className="mt-2 space-y-1.5 sm:mt-2.5 sm:space-y-2">
            <SourceCard icon={ReceiptText} label="ERP contable" detail="Documentos actualizados" tone="success" />
            <SourceCard icon={CreditCard} label="Pagos y bancos" detail="Conciliación disponible" tone="success" />
            <SourceCard icon={Send} label="Reportes operativos" detail="Información al día" tone="success" />
          </div>
        </section>
      </div>

      <section className="mt-3 rounded-xl border border-[#dce2ed] bg-white p-2 sm:mt-4 sm:p-3">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[9px] font-semibold text-[#526078] sm:text-[10px]">Flujos activos</p>
          <span className="rounded-full bg-[#eaf9f3] px-1.5 py-0.5 text-[8px] font-semibold text-[#16815e] sm:text-[9px]">3 sincronizando</span>
        </div>
        <div className="mt-2 grid grid-cols-[1.2fr_0.9fr_0.7fr] gap-2 border-t border-[#edf0f5] pt-2 text-[8px] sm:text-[10px]">
          <span className="font-medium text-[#42516c]">SII → Ruka → Defontana</span>
          <span className="text-[#728099]">Última sync: hace 2 min</span>
          <span className="font-semibold text-[#16815e]">Activa</span>
        </div>
      </section>
    </div>
  );
}
