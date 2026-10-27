import { useEffect, useState } from "react";
import { Check, Copy, LockKeyhole } from "lucide-react";

export const toolButton =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-[#d8deea] bg-white px-3 text-sm font-semibold text-[#343fad] transition-[background-color,border-color] duration-150 hover:border-[#a3ade9] hover:bg-[#f3f5ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none";

/** Give screen readers the finished result, not every intermediate keystroke. */
export function ResultAnnouncement({ text }: { text: string }) {
  const [announcement, setAnnouncement] = useState("");
  useEffect(() => {
    const timer = window.setTimeout(() => setAnnouncement(text), 700);
    return () => window.clearTimeout(timer);
  }, [text]);
  return (
    <p
      className="sr-only"
      role="status"
      aria-label="Actualización del resultado"
      aria-atomic="true"
    >
      {announcement}
    </p>
  );
}

/** Copy only on an explicit click. Never stores or sends calculation inputs. */
export function CopyResult({
  text,
  disabled = false,
}: {
  text: string;
  disabled?: boolean;
}) {
  const [copied, setCopied] = useState("");
  const [error, setError] = useState("");
  const done = copied === text && !!text;
  async function copy() {
    setError("");
    try {
      await navigator.clipboard.writeText(text);
      setCopied(text);
    } catch {
      setError(
        "Tu navegador no permitió copiar. Puedes seleccionar el resultado o descargar el CSV.",
      );
    }
  }
  return (
    <div>
      <button
        type="button"
        disabled={disabled}
        onClick={() => void copy()}
        className={`${toolButton} w-full`}
      >
        {done ? (
          <Check size={16} aria-hidden="true" />
        ) : (
          <Copy size={16} aria-hidden="true" />
        )}
        {done ? "Resultado copiado" : "Copiar resumen"}
      </button>
      <p
        role="status"
        className={error ? "mt-2 text-xs leading-5 text-red-700" : "sr-only"}
      >
        {error || (done ? "Resumen copiado al portapapeles." : "")}
      </p>
    </div>
  );
}

export function ToolPrivacy() {
  return (
    <p className="flex items-center gap-2 text-xs leading-5 text-[#60687a]">
      <LockKeyhole size={14} className="shrink-0" aria-hidden="true" />
      Sin registro. Los datos del cálculo no se envían a Ruka.
    </p>
  );
}

export function WorkingState({ example }: { example: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium ${example ? "bg-[#eef0ff] text-[#424ec0]" : "bg-[#eaf5ef] text-[#24573c]"}`}
    >
      <span
        aria-hidden="true"
        className="h-1.5 w-1.5 rounded-full bg-current"
      />
      {example ? "Ejemplo editable" : "Tus datos · cálculo en vivo"}
    </span>
  );
}
