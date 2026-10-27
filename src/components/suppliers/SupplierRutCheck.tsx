import { useState } from "react";
import { Check, Search, X } from "lucide-react";
import { Link } from "react-router-dom";
import { compareSupplierRut } from "@/utils/supplierWorkspace";
import type { SupplierProfile } from "@/types/supplier";
import { supplierButton, supplierInput } from "./SupplierActions";

export function SupplierRutCheck({ profile }: { profile: SupplierProfile }) {
  const [value, setValue] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const result = submitted ? compareSupplierRut(value, profile.rut) : "empty";
  return (
    <section
      id="contrastar-rut"
      aria-labelledby="rut-check-title"
      className="mt-6 scroll-mt-32 rounded-xl border border-[#dce2ed] p-5 sm:p-7"
    >
      <h3 id="rut-check-title" className="text-lg font-semibold">
        ¿Es el mismo emisor de tu factura?
      </h3>
      <p className="mt-2 max-w-xl text-sm leading-6 text-[#505b70]">
        Pega solo el RUT del documento. Lo comparamos con esta ficha, sin subir
        la factura.
      </p>
      <form
        className="mt-5"
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitted(true);
        }}
      >
        <label
          htmlFor="document-rut"
          className="mb-2 block text-sm font-medium"
        >
          RUT que aparece en tu documento
        </label>
        <div className="flex flex-wrap gap-2">
          <input
            id="document-rut"
            className={`${supplierInput} flex-1 basis-48`}
            autoComplete="off"
            spellCheck={false}
            maxLength={24}
            value={value}
            placeholder="Pega o escribe el RUT"
            onChange={(e) => {
              setValue(e.target.value);
              setSubmitted(false);
            }}
            aria-invalid={result === "invalid"}
            aria-describedby="rut-check-help rut-check-result"
          />
          <button className={supplierButton} type="submit">
            <Search size={16} aria-hidden="true" />
            Comparar RUT
          </button>
          {value && (
            <button
              type="button"
              className={supplierButton}
              onClick={() => {
                setValue("");
                setSubmitted(false);
                document.getElementById("document-rut")?.focus();
              }}
              aria-label="Limpiar RUT"
            >
              <X size={16} aria-hidden="true" />
            </button>
          )}
        </div>
        <p
          id="rut-check-help"
          className="mt-2 text-xs leading-5 text-[#60687a]"
        >
          Con o sin puntos y guion. Comparación local, sin consultar al SII.
          Solo se usa en la búsqueda del directorio si eliges buscarlo.
        </p>
      </form>
      <div
        id="rut-check-result"
        role="status"
        aria-atomic="true"
        className={
          submitted
            ? "mt-4 border-t border-[#d3d9e8] pt-4 text-sm leading-6"
            : "sr-only"
        }
      >
        {submitted && result === "empty" && (
          <p>Escribe el RUT del documento para compararlo.</p>
        )}
        {result === "invalid" && (
          <p className="text-[#923b25]">
            Revisa el RUT y su dígito verificador. No pudimos reconocer un RUT
            válido.
          </p>
        )}
        {result === "match" && (
          <>
            <p className="flex items-center gap-2 font-semibold text-[#24573c]">
              <Check size={18} aria-hidden="true" />
              El RUT coincide con esta ficha.
            </p>
            <p className="mt-1 text-[#505b70]">
              Comprueba también la razón social. Esta coincidencia no valida la
              factura ni los datos de pago.
            </p>
          </>
        )}
        {result === "different" && (
          <>
            <p className="font-semibold text-[#923b25]">
              Es un RUT distinto al de esta ficha.
            </p>
            <p className="mt-1 text-[#505b70]">
              Puede corresponder a otra razón social. No unas los registros solo
              porque los nombres se parecen.
            </p>
            <Link
              className="mt-2 inline-flex min-h-11 items-center font-semibold text-[#424ec0] underline underline-offset-4 focus-visible:outline-primary"
              to={`/proveedores?q=${encodeURIComponent(value.trim())}`}
            >
              Buscar ese RUT en el directorio
            </Link>
          </>
        )}
      </div>
    </section>
  );
}
