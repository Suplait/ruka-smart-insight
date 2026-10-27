import { useState } from "react";
import { Check, Download, RotateCcw } from "lucide-react";
import { Link } from "react-router-dom";
import {
  billingPreparation,
  billingPreparationText,
} from "@/content/billingExperience";

export function BillingPreparation() {
  const [checked, setChecked] = useState<string[]>([]);
  const [downloaded, setDownloaded] = useState(false);
  const [downloadError, setDownloadError] = useState(false);
  function download() {
    setDownloadError(false);
    let url: string | undefined;
    let link: HTMLAnchorElement | undefined;
    try {
      url = URL.createObjectURL(
        new Blob([billingPreparationText(checked)], {
          type: "text/plain;charset=utf-8",
        }),
      );
      link = document.createElement("a");
      link.href = url;
      link.download = "ruka-preparar-facturacion.txt";
      document.body.appendChild(link);
      link.click();
      setDownloaded(true);
    } catch {
      setDownloadError(true);
      setDownloaded(false);
    } finally {
      link?.remove();
      if (url) {
        const downloadUrl = url;
        window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
      }
    }
  }
  return (
    <section
      id="preparar"
      aria-labelledby="billing-prepare-title"
      className="scroll-mt-28 bg-[#f7f8fc] px-5 py-16 sm:px-8 sm:py-24"
    >
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.9fr_1.1fr] lg:gap-20">
        <div>
          <h2
            id="billing-prepare-title"
            className="text-3xl font-semibold leading-[1.12] tracking-[-.035em] sm:text-5xl"
          >
            Empieza con lo necesario. Te ayudamos con el resto.
          </h2>
          <p className="mt-5 text-lg leading-8 text-[#586176]">
            Marca lo que ya tienes identificado. Puedes llevarte la pauta para
            revisarla con tu equipo.
          </p>
          <Link
            to="/ayuda/comenzar-rukafactura"
            className="mt-5 inline-flex min-h-11 items-center font-semibold text-[#424ec0] underline underline-offset-4 focus-visible:outline-primary"
          >
            Leer la guía de primera emisión
          </Link>
          <p className="mt-5 max-w-md text-sm leading-6 text-[#586176]">
            No necesitas tener todo resuelto para conversar. No nos envíes
            contraseñas ni certificados por correo.
          </p>
        </div>
        <div className="rounded-2xl bg-white p-5 sm:p-8">
          <fieldset>
            <legend className="mb-4 text-lg font-semibold">
              Mi preparación
            </legend>
            <div className="space-y-2">
              {billingPreparation.map((item) => (
                <label
                  key={item.id}
                  className="flex cursor-pointer items-start gap-3 rounded-lg p-3 transition-colors duration-150 hover:bg-[#f7f8fc] focus-within:ring-2 focus-within:ring-primary motion-reduce:transition-none"
                >
                  <input
                    type="checkbox"
                    className="mt-1 h-5 w-5 shrink-0 accent-[#424ec0]"
                    checked={checked.includes(item.id)}
                    onChange={(event) => {
                      setChecked((previous) =>
                        event.target.checked
                          ? [...previous, item.id]
                          : previous.filter((id) => id !== item.id),
                      );
                      setDownloaded(false);
                    }}
                  />
                  <span>
                    <span className="block font-semibold">{item.title}</span>
                    <span className="mt-1 block text-sm leading-6 text-[#586176]">
                      {item.detail}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
          <p
            className="mt-5 text-sm font-semibold text-[#424ec0]"
            role="status"
          >
            {checked.length} de {billingPreparation.length} puntos identificados
            {checked.length === billingPreparation.length
              ? ". Ya tienes una pauta para conversar."
              : ". Puedes completar el resto con tu equipo."}
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={download}
              className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#424ec0] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#343fad] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 motion-reduce:transition-none"
            >
              {downloaded ? (
                <Check size={17} aria-hidden="true" />
              ) : (
                <Download size={17} aria-hidden="true" />
              )}
              {downloaded ? "Pauta descargada" : "Descargar mi pauta"}
            </button>
            <button
              type="button"
              disabled={!checked.length && !downloaded && !downloadError}
              onClick={() => {
                setChecked([]);
                setDownloaded(false);
                setDownloadError(false);
              }}
              className="inline-flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-[#586176] hover:bg-[#f1f3fa] focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RotateCcw size={16} aria-hidden="true" />
              Reiniciar
            </button>
          </div>
          {downloadError && (
            <div className="mt-4">
              <p role="alert" className="text-sm leading-6 text-[#586176]">
                No pudimos descargar la pauta. Puedes seleccionarla y copiarla
                aquí.
              </p>
              <textarea
                readOnly
                aria-label="Pauta para copiar"
                value={billingPreparationText(checked)}
                className="mt-3 min-h-48 w-full rounded-lg border border-[#dce2ed] p-3 text-base leading-6 focus-visible:outline-primary"
              />
            </div>
          )}
          <p className="mt-5 text-xs leading-5 text-[#586176]">
            Descarga en texto (.txt), editable con tu equipo. Tu selección no se
            guarda ni se envía. Esta pauta no verifica ni certifica la
            habilitación ante el SII.
          </p>
        </div>
      </div>
    </section>
  );
}
