import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function CodeExample({ code, label }: { code: string; label: string }) {
  return <CodeExampleContent key={code} code={code} label={label} />;
}

function CodeExampleContent({ code, label }: { code: string; label: string }) {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");
  async function copy() {
    try { await navigator.clipboard.writeText(code); setStatus("copied"); }
    catch { setStatus("failed"); }
  }
  return <div className="min-w-0 overflow-hidden rounded-xl bg-[#171827] text-[#f7f8fc]">
    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-b border-white/15 px-5 py-2">
      <span className="min-w-0 text-xs leading-5 text-[#c4c9de] [overflow-wrap:anywhere]">{label}</span>
      <button type="button" onClick={copy} className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded px-2 text-xs font-semibold hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a7afff]">{status === "copied" ? <Check size={15} aria-hidden="true" /> : <Copy size={15} aria-hidden="true" />} {status === "copied" ? "Copiado" : "Copiar código"}</button>
    </div>
    <pre tabIndex={0} aria-label={`Código: ${label}`} className="overflow-x-auto p-5 text-[13px] leading-7 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#a7afff] sm:p-6"><code>{code}</code></pre>
    <span role="status" className={status === "failed" ? "block px-5 pb-4 text-xs leading-6 text-[#c4c9de]" : "sr-only"}>{status === "failed" ? "No pudimos copiar. Selecciona el código y cópialo manualmente." : status === "copied" ? "Código copiado al portapapeles." : ""}</span>
  </div>;
}
