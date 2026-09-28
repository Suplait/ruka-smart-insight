import {
  ArrowRight,
  CheckCircle2,
  CreditCard,
  Database,
  FileText,
  Landmark,
  Link2,
  ReceiptText,
  Send,
  ShieldCheck,
  Store,
} from "lucide-react";

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

export function ConciliationWorkspaceVisual() {
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
