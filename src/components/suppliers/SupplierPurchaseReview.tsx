import { useState } from "react";
import { ArrowUpRight, RotateCcw } from "lucide-react";
import { Link } from "react-router-dom";
import type { SupplierProfile } from "@/types/supplier";
import {
  SupplierCopy,
  SupplierDownload,
  supplierButton,
} from "./SupplierActions";
import { supplierUrl } from "@/utils/supplierWorkspace";

/** A personal checklist, not a verification, assessment or payment authorization. */
export function SupplierPurchaseReview({
  profile,
}: {
  profile: SupplierProfile;
}) {
  const [checked, setChecked] = useState<string[]>([]);
  const [pendingOnly, setPendingOnly] = useState(false);
  const [previous, setPrevious] = useState<string[] | null>(null);
  const completed = checked.length === profile.checks.length;
  const review = `${profile.legalName}\nRUT: ${profile.rut}\nRevisión personal de compra\n${profile.checks.map((check) => `${checked.includes(check.title) ? "Revisado" : "Pendiente"}: ${check.title}\n${check.text}`).join("\n\n")}\n\nNo certifica al proveedor ni autoriza un pago.\n${supplierUrl(profile)}`;
  return (
    <section
      id="compra"
      data-supplier-section
      className="scroll-mt-32 border-t border-[#dce2ed] py-10 sm:py-12"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            De la ficha a tu compra
          </h2>
          <p className="mt-3 max-w-xl leading-7 text-[#505b70]">
            Antes de registrar el documento, revisa estos puntos con tu equipo.
          </p>
        </div>
        <span
          role="status"
          className="rounded-md bg-[#f0f2fc] px-3 py-2 text-sm font-medium tabular-nums text-[#424ec0]"
        >
          {checked.length} de {profile.checks.length} revisados
        </span>
      </div>
      <p className="mt-3 text-sm leading-6 text-[#60687a]">
        Consejos de Ruka, no condiciones comerciales del proveedor.
      </p>
      <div className="mt-5 flex items-center justify-between gap-4">
        <progress
          className="h-2 w-32 accent-[#424ec0]"
          value={checked.length}
          max={profile.checks.length}
          aria-label="Progreso de revisión personal"
        />
        <button
          type="button"
          aria-pressed={pendingOnly}
          className={supplierButton}
          onClick={() => setPendingOnly((value) => !value)}
        >
          {pendingOnly ? "Ver todos los puntos" : "Solo pendientes"}
        </button>
      </div>
      {completed && (
        <p
          role="status"
          className="mt-4 rounded-lg bg-[#eef5f1] p-4 text-sm leading-6 text-[#245641]"
        >
          Marcaste todos los puntos. Puedes guardar tu revisión; esto no valida
          al proveedor ni autoriza el pago.
        </p>
      )}
      <div className="mt-4 divide-y divide-[#dce2ed] border-y border-[#dce2ed]">
        {profile.checks.map((check, index) => (
          <label
            key={check.title}
            hidden={pendingOnly && checked.includes(check.title)}
            className={`${pendingOnly && checked.includes(check.title) ? "hidden" : "flex"} cursor-pointer items-start gap-4 py-6`}
          >
            <input
              type="checkbox"
              checked={checked.includes(check.title)}
              onChange={(event) => {
                setPrevious(null);
                setChecked((values) =>
                  event.target.checked
                    ? [...values, check.title]
                    : values.filter((value) => value !== check.title),
                );
              }}
              className="mt-1 h-5 w-5 shrink-0 accent-[#4f5ee9] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#424ec0]"
              aria-label={`Revisado: ${check.title}`}
            />
            <span className="min-w-0">
              <span className="block font-semibold">
                <span className="mr-2 text-sm font-normal tabular-nums text-[#60687a]">
                  0{index + 1}
                </span>
                {check.title}
              </span>
              <span className="mt-2 block max-w-2xl text-sm leading-7 text-[#505b70]">
                {check.text}
              </span>
            </span>
          </label>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-lg text-xs leading-6 text-[#60687a]">
          Tu revisión es orientativa y se reinicia al salir de la ficha. No
          certifica al proveedor ni autoriza un pago.
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              setPrevious(checked);
              setChecked([]);
            }}
            disabled={!checked.length}
            className={supplierButton}
          >
            <RotateCcw size={14} aria-hidden="true" />
            Reiniciar
          </button>
          {previous && (
            <button
              type="button"
              className={supplierButton}
              onClick={() => {
                setChecked(previous);
                setPrevious(null);
              }}
            >
              Deshacer reinicio
            </button>
          )}
        </div>
      </div>
      <div className="mt-5 flex flex-wrap items-start gap-2">
        <SupplierCopy
          text={review}
          label="Copiar mi revisión"
          success="Revisión copiada"
        />
        <SupplierDownload
          rows={[
            [
              "Empresa",
              "RUT",
              "Punto",
              "Estado personal",
              "Detalle",
              "Ficha",
              "Alcance",
            ],
            ...profile.checks.map((check) => [
              profile.legalName,
              profile.rut,
              check.title,
              checked.includes(check.title) ? "Revisado" : "Pendiente",
              check.text,
              supplierUrl(profile),
              "Revisión personal. No certifica al proveedor ni autoriza un pago.",
            ]),
          ]}
          filename={`ruka-${profile.rut}-mi-revision.csv`}
          label="Descargar mi revisión CSV"
        />
      </div>
      <div className="mt-7 grid gap-3 sm:grid-cols-2">
        <Link
          to="/herramientas/costo-unitario"
          className="rounded-xl border border-[#dce2ed] p-5 transition-colors hover:border-[#4f5ee9] focus-visible:outline-primary motion-reduce:transition-none"
        >
          <span className="flex items-center justify-between gap-3 font-semibold">
            Comparar costo por unidad
            <ArrowUpRight size={18} aria-hidden="true" />
          </span>
          <span className="mt-2 block text-sm leading-6 text-[#505b70]">
            Cuando cambian el envase, la cantidad o el precio.
          </span>
        </Link>
        <Link
          to="/herramientas/conciliar-factura-orden-recepcion"
          className="rounded-xl border border-[#dce2ed] p-5 transition-colors hover:border-[#4f5ee9] focus-visible:outline-primary motion-reduce:transition-none"
        >
          <span className="flex items-center justify-between gap-3 font-semibold">
            Revisar una diferencia
            <ArrowUpRight size={18} aria-hidden="true" />
          </span>
          <span className="mt-2 block text-sm leading-6 text-[#505b70]">
            Cruza pedido, factura y recepción con un ejemplo editable.
          </span>
        </Link>
      </div>
    </section>
  );
}
