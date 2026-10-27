import { useState } from "react";
import { Check, Copy, Download } from "lucide-react";
import { supplierCsv } from "@/utils/supplierWorkspace";

export const supplierButton =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-[#cbd2df] bg-white px-3 py-2 text-sm font-medium text-[#343fad] transition-colors duration-150 hover:border-[#424ec0] hover:bg-[#f1f3ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#424ec0] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none";
export const supplierInput =
  "min-h-12 w-full min-w-0 rounded-lg border border-[#b8c2d5] bg-white px-3 text-base text-[#171827] placeholder:text-[#60687a] focus:border-[#424ec0] focus:outline-none focus:ring-2 focus:ring-[#424ec0]/20";

export function SupplierCopy({
  text,
  label,
  success = "Copiado",
  className = "",
}: {
  text: string;
  label: string;
  success?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState("");
  const [failed, setFailed] = useState(false);
  const done = copied === text;
  async function copy() {
    setFailed(false);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(text);
    } catch {
      setCopied("");
      setFailed(true);
    }
  }
  return (
    <div className={className}>
      <button
        type="button"
        onClick={() => void copy()}
        className={`${supplierButton} w-full`}
        aria-label={label}
      >
        {done ? (
          <Check size={16} aria-hidden="true" />
        ) : (
          <Copy size={16} aria-hidden="true" />
        )}
        {done ? success : label}
      </button>
      <span role="status" className="sr-only">
        {done ? "Texto copiado al portapapeles." : ""}
      </span>
      {failed && (
        <div className="mt-3">
          <p role="alert" className="text-xs leading-5 text-[#923b25]">
            No pudimos copiar. Selecciona el texto de abajo y cópialo
            manualmente.
          </p>
          <textarea
            readOnly
            aria-label={`Texto para ${label.toLowerCase()}`}
            value={text}
            rows={Math.min(5, text.split("\n").length + 1)}
            className={`${supplierInput} mt-2 py-2 text-sm`}
          />
        </div>
      )}
    </div>
  );
}

export function SupplierDownload({
  rows,
  filename,
  label = "Descargar ficha CSV",
}: {
  rows: (string | number)[][];
  filename: string;
  label?: string;
}) {
  const [notice, setNotice] = useState("");
  const [failed, setFailed] = useState(false);
  function download() {
    let url: string | undefined;
    let a: HTMLAnchorElement | undefined;
    try {
      url = URL.createObjectURL(
        new Blob([supplierCsv(rows)], { type: "text/csv;charset=utf-8" }),
      );
      a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.append(a);
      a.click();
      setFailed(false);
      setNotice(`${filename} preparado para descargar.`);
    } catch {
      setFailed(true);
      setNotice(
        "No pudimos preparar el archivo. Puedes copiar los datos de la ficha o reintentar.",
      );
    } finally {
      a?.remove();
      if (url) URL.revokeObjectURL(url);
    }
  }
  return (
    <div>
      <button type="button" className={supplierButton} onClick={download}>
        <Download size={16} aria-hidden="true" />
        {label}
      </button>
      <p
        role={failed ? "alert" : "status"}
        className={
          notice
            ? `mt-2 text-xs leading-5 ${failed ? "text-[#923b25]" : "text-[#505b70]"}`
            : "sr-only"
        }
      >
        {notice}
      </p>
    </div>
  );
}
