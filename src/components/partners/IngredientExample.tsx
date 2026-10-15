import { useState } from "react";
import { ArrowDown, ArrowRight, Check } from "lucide-react";
import { ingredientExamples, unitCost } from "@/content/partnersContent";

const money = (value: number) => `$${new Intl.NumberFormat("es-CL", { maximumFractionDigits: 0 }).format(value)}`;
const focus = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#424ec0]";

/** Educational calculation, not a replica of the product or an API response. */
export function IngredientExample() {
  const [index, setIndex] = useState(0);
  const [normalized, setNormalized] = useState(true);
  const example = ingredientExamples[index];
  return (
    <figure className="min-w-0 rounded-2xl bg-[#eef0ff] p-5 sm:p-7" aria-label="Ejemplo de homologación y costo unitario">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-medium text-[#505b70]">Un mismo insumo. Dos formatos.</p>
        <button className={`inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#424ec0] motion-safe:active:scale-[0.98] ${focus}`} onClick={() => setIndex((index + 1) % ingredientExamples.length)} type="button">Otro ejemplo <ArrowRight size={15} aria-hidden="true" /></button>
      </div>
      <div className="mt-5 flex flex-wrap gap-1 rounded-lg bg-white p-1" role="group" aria-label="Cómo comparar los precios">
        {[false, true].map((value) => <button key={String(value)} type="button" aria-pressed={normalized === value} onClick={() => setNormalized(value)} className={`min-h-11 flex-1 whitespace-nowrap rounded-md px-3 text-sm font-semibold motion-safe:transition-colors motion-safe:duration-150 ${normalized === value ? "bg-[#4b59df] text-white" : "text-[#505b70] hover:bg-[#f7f8fc]"} ${focus}`}>{value ? "Costo unitario" : "Precio del envase"}</button>)}
      </div>
      <div aria-live="polite" aria-atomic="true">
        <dl className="mt-5 divide-y divide-[#cbd2eb]">
          {example.purchases.map((purchase) => <div key={purchase.name} className="flex items-center justify-between gap-3 py-4">
            <dt className="min-w-0 text-sm leading-6"><span className="block font-semibold">{purchase.name}</span><span className="text-[#505b70]">{purchase.pack}</span></dt>
            <dd className="shrink-0 text-right"><span className="text-xl font-semibold tabular-nums sm:text-2xl">{money(normalized ? unitCost(purchase) : purchase.price)}</span><span className="block text-xs leading-6 text-[#505b70]">por {normalized ? example.unit : "envase"}</span></dd>
          </div>)}
        </dl>
        <div className="flex justify-center py-2"><ArrowDown size={20} className="text-[#424ec0]" aria-hidden="true" /></div>
        <div className="py-4 text-center">
          <p className="text-xs font-semibold text-[#424ec0]">Insumo maestro</p>
          <p className="mt-1 text-2xl font-semibold tracking-[-0.02em]">{example.name}</p>
          <p className="mt-3 flex items-center justify-center gap-2 text-sm leading-6 text-[#505b70]"><Check size={16} className="shrink-0 text-[#424ec0]" aria-hidden="true" />{normalized ? `Costos comparables por ${example.unit}.` : "El precio del envase no cuenta toda la historia."}</p>
        </div>
      </div>
      <figcaption className="mt-3 border-t border-[#cbd2eb] pt-4 text-xs leading-5 text-[#505b70]">Ejemplo ilustrativo en CLP, con valores netos. Las equivalencias se definen según cada producto; no se compara solo por el nombre.</figcaption>
    </figure>
  );
}
