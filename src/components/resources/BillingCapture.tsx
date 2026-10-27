import { Expand, X } from "lucide-react";
import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";

const captures = {
  preview: {
    src: "/assets/facturacion/revision-importes-demo.jpg",
    width: 880,
    height: 212,
    title: "Revisión de importes",
    alt: "Vista previa de una factura ficticia: neto de 150.000 pesos, IVA de 28.500 y total de 178.500.",
    caption: "Vista previa con datos ficticios. Este documento no fue emitido.",
  },
  book: {
    src: "/assets/facturacion/libro-compras-demo.jpg",
    width: 917,
    height: 363,
    title: "Libro de compras",
    alt: "Libro de compras de una empresa ficticia con proveedor, RUT, fecha e importes netos, exentos e IVA separados.",
    caption:
      "Libro de compras en la demo, con datos ficticios. No son operaciones de clientes.",
  },
};

export function BillingCapture({
  kind,
  priority = false,
}: {
  kind: keyof typeof captures;
  priority?: boolean;
}) {
  const capture = captures[kind];
  const [detail, setDetail] = useState(false);
  return (
    <figure>
      <Dialog.Root onOpenChange={() => setDetail(false)}>
        <Dialog.Trigger
          className="group block w-full overflow-hidden rounded-lg border border-[#dce2ed] bg-white text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4"
          aria-label={`Ampliar ${capture.title.toLowerCase()}`}
        >
          <img
            src={capture.src}
            alt={capture.alt}
            width={capture.width}
            height={capture.height}
            loading={priority ? "eager" : "lazy"}
            {...{ fetchpriority: priority ? "high" : "auto" }}
            decoding="async"
            className="h-auto w-full"
          />
          <span className="flex min-h-11 items-center justify-between gap-3 border-t border-[#dce2ed] px-4 py-2 text-xs font-semibold text-[#424ec0] transition-colors duration-150 group-hover:bg-[#f1f3fa] motion-reduce:transition-none">
            {capture.title}
            <span className="flex items-center gap-2">
              Ampliar
              <Expand size={15} aria-hidden="true" />
            </span>
          </span>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-[#171827]/70" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 max-h-[90dvh] w-[calc(100%-2rem)] max-w-6xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-xl bg-white p-5 shadow-xl sm:p-8">
            <div className="flex items-start justify-between gap-5">
              <Dialog.Title className="text-xl font-semibold">
                {capture.title}
              </Dialog.Title>
              <Dialog.Close
                className="-mr-2 -mt-2 inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg hover:bg-[#f1f3fa] focus-visible:outline-primary"
                aria-label="Cerrar captura"
              >
                <X size={22} aria-hidden="true" />
              </Dialog.Close>
            </div>
            <Dialog.Description className="mt-2 text-sm leading-6 text-[#586176]">
              {capture.caption} La interfaz puede variar según versión y módulos
              habilitados.
            </Dialog.Description>
            <div
              role="group"
              aria-label="Tamaño de la captura"
              className="mt-4 flex flex-wrap gap-2"
            >
              {[false, true].map((value) => (
                <button
                  key={String(value)}
                  type="button"
                  aria-pressed={detail === value}
                  onClick={() => setDetail(value)}
                  className={`min-h-11 rounded-lg px-4 text-sm font-semibold focus-visible:outline-primary ${detail === value ? "bg-[#424ec0] text-white" : "bg-[#f1f3fa] text-[#424ec0]"}`}
                >
                  {value ? "Leer detalle" : "Ver completa"}
                </button>
              ))}
            </div>
            <div
              className="mt-5 max-h-[45dvh] overflow-auto rounded-lg border border-[#dce2ed]"
              tabIndex={0}
              role="region"
              aria-label="Captura ampliada; desplázate para ver el detalle"
            >
              <img
                src={capture.src}
                alt={capture.alt}
                width={capture.width}
                height={capture.height}
                className={`h-auto w-full ${detail ? "min-w-[880px]" : ""}`}
              />
            </div>
            {detail && (
              <p className="mt-3 text-xs leading-5 text-[#586176]">
                Desliza la captura horizontalmente para leer el detalle. Con
                teclado, usa las flechas al enfocar la imagen.
              </p>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
      <figcaption className="mt-3 text-xs leading-5 text-[#586176]">
        {capture.caption}
      </figcaption>
    </figure>
  );
}
