import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Download, RotateCcw, ShieldCheck } from "lucide-react";
import { ResourceLayout, resourceLinkClass } from "@/components/resources/ResourceLayout";
import { calculatePurchaseCost, comparePurchaseCosts, costUnits, examplePurchase, purchaseCostCsv, type CostField, type CostUnit, type PurchaseCostInput } from "@/utils/purchaseCost";

const control = "mt-2 min-h-12 w-full rounded-lg border border-[#cbd2df] bg-white px-3 py-2 text-base text-[#171827] outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 aria-[invalid=true]:border-red-600";
const number = (value: number, digits = 2) => new Intl.NumberFormat("es-CL", { maximumFractionDigits: digits }).format(value);
const money = (value: number, currency: string) => `${currency} $${number(value, value > 0 && value < 0.01 ? 6 : 2)}`;

function PurchaseFields({ id, title, value, onChange, touched, setTouched }: { id: string; title: string; value: PurchaseCostInput; onChange: (value: PurchaseCostInput) => void; touched: boolean; setTouched: () => void }) {
  const result = calculatePurchaseCost(value);
  function field(key: CostField, label: string, hint?: string) {
    const error = touched && result.ok === false ? result.errors[key] : undefined;
    return <div><label htmlFor={`${id}-${key}`} className="text-sm font-medium">{label}</label><input id={`${id}-${key}`} inputMode="decimal" type="text" autoComplete="off" value={value[key]} onChange={e => onChange({ ...value, [key]: e.target.value })} onBlur={setTouched} className={control} aria-invalid={!!error} aria-describedby={error || hint ? `${id}-${key}-hint` : undefined} />{(error || hint) && <p id={`${id}-${key}-hint`} className={`mt-2 text-xs leading-5 ${error ? "text-red-700" : "text-[#60687a]"}`}>{error || hint}</p>}</div>;
  }
  return <fieldset className="min-w-0">
    <legend className="mb-6 text-xl font-semibold">{title}</legend>
    <div className="grid gap-x-4 gap-y-5 sm:grid-cols-2">
      {field("price", "Precio total de la compra", "Antes del descuento. No es el precio de un envase.")}
      <div><label htmlFor={`${id}-currency`} className="text-sm font-medium">Moneda</label><select id={`${id}-currency`} className={control} value={value.currency} onChange={e => onChange({ ...value, currency: e.target.value as PurchaseCostInput["currency"] })}><option value="CLP">Peso chileno (CLP)</option><option value="USD">Dólar estadounidense (USD)</option></select></div>
      {field("packs", "Cantidad de envases", "Cajas, bolsas, bidones o unidades compradas.")}
      {field("content", "Contenido por envase", "Ejemplo: una bolsa de 500 g → escribe 500.")}
      <div><label htmlFor={`${id}-unit`} className="text-sm font-medium">Unidad del contenido</label><select id={`${id}-unit`} className={control} value={value.unit} onChange={e => onChange({ ...value, unit: e.target.value as CostUnit })}>{Object.entries(costUnits).map(([key, unit]) => <option key={key} value={key}>{unit.label}</option>)}</select></div>
      {field("discount", "Descuento (%)", "Déjalo en 0 si el precio ya tiene el descuento.")}
      <div className="sm:col-span-2"><label htmlFor={`${id}-tax`} className="flex min-h-11 cursor-pointer items-center gap-3 text-sm"><input id={`${id}-tax`} type="checkbox" className="h-5 w-5 accent-[#515fee]" checked={value.taxIncluded} onChange={e => onChange({ ...value, taxIncluded: e.target.checked })} /> El precio ingresado incluye IVA</label></div>
      {value.taxIncluded && field("taxRate", "IVA incluido (%)", "Usamos esta tasa solo para separar el impuesto del precio.")}
    </div>
  </fieldset>;
}

export default function PurchaseCostTool({ comparison = false }: { comparison?: boolean }) {
  const [previous, setPrevious] = useState<PurchaseCostInput>({ ...examplePurchase });
  const [current, setCurrent] = useState<PurchaseCostInput>({ ...examplePurchase, price: "80000", packs: "1", content: "25" });
  const [touched, setTouched] = useState(false);
  const a = calculatePurchaseCost(previous);
  const b = calculatePurchaseCost(current);
  const delta = a.ok && b.ok ? comparePurchaseCosts(a.value, b.value) : null;
  const heading = comparison ? "¿Subió el precio o cambió el formato?" : "Cajas distintas. Un costo comparable.";
  const description = comparison ? "Compara dos compras por kilo, litro o unidad. Separa el efecto del formato, el descuento y el IVA antes de sacar conclusiones." : "Calcula cuánto pagas por kilo, litro o unidad, aunque compres por caja o bolsa. Ajusta el ejemplo con los datos de tu compra.";
  const path = comparison ? "/herramientas/variacion-costos" : "/herramientas/costo-unitario";
  function reset() { setPrevious({ ...examplePurchase }); setCurrent({ ...examplePurchase, price: "80000", packs: "1", content: "25" }); setTouched(false); }
  function download() {
    if (!a.ok || (comparison && (!b.ok || !delta?.ok))) return;
    const content = purchaseCostCsv(comparison && b.ok ? [a.value, b.value] : [a.value]);
    const url = URL.createObjectURL(new Blob([content], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url; link.download = comparison ? "ruka-comparacion-costos.csv" : "ruka-costo-unitario.csv";
    document.body.appendChild(link); link.click(); link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return <ResourceLayout compact path={path} title={comparison ? "Calculadora de variación de costos de compra | Ruka" : "Calculadora de costo unitario por kilo, litro o unidad | Ruka"} heading={heading} description={description} eyebrow={comparison ? "Comparador de costos" : "Calculadora de costo unitario"}>
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3 text-sm">
      <p className="flex items-center gap-2 text-[#505b70]"><ShieldCheck size={18} aria-hidden="true" /> Cálculo en tu navegador · Sin registro</p>
      <div className="flex flex-wrap gap-x-5"><a href="#resultado" className={`${resourceLinkClass} lg:hidden`}>Ver resultado ↓</a><button type="button" onClick={reset} className={resourceLinkClass}><RotateCcw size={16} aria-hidden="true" /> Restablecer ejemplo</button></div>
    </div>
    <div className={`grid items-start gap-6 ${comparison ? "xl:grid-cols-[1fr_1fr_0.85fr]" : "lg:grid-cols-[1.25fr_0.85fr]"}`}>
      <div className="rounded-2xl border border-[#dce2ed] p-5 sm:p-8"><PurchaseFields id="previous" title={comparison ? "01 / Compra anterior" : "Los datos de tu compra"} value={previous} onChange={setPrevious} touched={touched} setTouched={() => setTouched(true)} /></div>
      {comparison && <div className="rounded-2xl border border-[#dce2ed] p-5 sm:p-8"><PurchaseFields id="current" title="02 / Compra actual" value={current} onChange={setCurrent} touched={touched} setTouched={() => setTouched(true)} /></div>}
      <section id="resultado" tabIndex={-1} aria-label="Resultado del cálculo" className="scroll-mt-28 rounded-2xl bg-[#eef0ff] p-6 focus-visible:outline-primary sm:p-8">
        <p className="text-sm font-semibold text-[#424ec0]">{comparison ? "La diferencia real por unidad" : "Costo neto por unidad"}</p>
        <div role="status" aria-live="polite" aria-atomic="true" className="mt-6">
          {!a.ok || (comparison && !b.ok) ? <p className="leading-7">Completa los datos con valores válidos para ver el resultado.</p> : comparison ? delta?.ok ? <>
            <p className="break-words text-5xl font-semibold tracking-tight tabular-nums">{delta.percent > 0 ? "+" : ""}{number(delta.percent)}<span className="text-3xl">%</span></p>
            <p className="mt-3 leading-7">{Math.abs(delta.percent) < 0.005 ? "El costo se mantiene." : delta.percent > 0 ? "La compra actual cuesta más por unidad." : "La compra actual cuesta menos por unidad."}</p>
            <dl className="mt-6 space-y-4 border-t border-[#cbd0ef] pt-5 text-sm">{b.ok && <><div><dt className="text-[#505b70]">Anterior</dt><dd className="mt-1 font-semibold tabular-nums">{money(a.value.unitCost, a.value.currency)} / {a.value.unit}</dd></div><div><dt className="text-[#505b70]">Actual</dt><dd className="mt-1 font-semibold tabular-nums">{money(b.value.unitCost, b.value.currency)} / {b.value.unit}</dd></div><div><dt className="text-[#505b70]">Diferencia por {a.value.unit}</dt><dd className="mt-1 font-semibold tabular-nums">{money(delta.difference, a.value.currency)}</dd></div></>}</dl>
          </> : <p className="leading-7">{delta?.error}</p> : <>
            <p className="break-words text-[clamp(2rem,4vw,3rem)] font-semibold tracking-tight tabular-nums">{money(a.value.unitCost, a.value.currency)}</p><p className="mt-1 text-lg">por {a.value.unit}</p>
            <dl className="mt-8 space-y-4 border-t border-[#cbd0ef] pt-6 text-sm"><div><dt className="text-[#505b70]">Cantidad total</dt><dd className="mt-1 font-semibold tabular-nums">{number(a.value.quantity, 6)} {a.value.unit}</dd></div><div><dt className="text-[#505b70]">Total sin IVA, con descuento aplicado</dt><dd className="mt-1 font-semibold tabular-nums">{money(a.value.netTotal, a.value.currency)}</dd></div></dl>
          </>}
        </div>
        <button type="button" onClick={download} disabled={!a.ok || (comparison && (!b.ok || !delta?.ok))} className={`${resourceLinkClass} mt-5 text-sm disabled:cursor-not-allowed disabled:opacity-50 disabled:no-underline`}><Download size={16} aria-hidden="true" /> Descargar resultado CSV</button>
        <p className="mt-7 border-t border-[#cbd0ef] pt-5 text-xs leading-5 text-[#505b70]">Ejemplo editable. No incluye flete, merma ni otros gastos. No calcula crédito fiscal ni reemplaza una revisión contable.</p>
      </section>
    </div>
    <section className="mt-16 grid gap-8 border-t border-[#dce2ed] pt-10 md:grid-cols-[0.8fr_1.2fr]">
      <h2 className="text-2xl font-semibold tracking-tight">La cuenta, sin letra chica.</h2>
      <div className="space-y-5 leading-7 text-[#505b70]"><p><strong className="text-[#171827]">Costo unitario = total neto con descuento ÷ cantidad total.</strong> Multiplicamos envases por contenido y convertimos gramos a kilos o mililitros a litros. No mezclamos peso y volumen.</p>{comparison && <p>Variación = (costo actual − costo anterior) ÷ costo anterior × 100. Compara el mismo insumo, calidad y moneda: un resultado menor no significa por sí solo una mejor compra.</p>}<p>Si marcas IVA incluido, dividimos el precio descontado por (1 + tasa / 100). Si ya ingresaste un precio neto, deja esa opción desmarcada. El descuento se aplica una sola vez sobre el total.</p><p>Los datos de esta calculadora no se guardan ni se envían a un servidor. Al recargar vuelves al ejemplo. Ingresa números sin separadores de miles; puedes usar coma o punto decimal.</p>
        <Link className={resourceLinkClass} to={comparison ? "/herramientas/costo-unitario" : "/herramientas/variacion-costos"}>{comparison ? "Calcular una sola compra" : "Comparar dos compras"}<ArrowRight size={18} aria-hidden="true" /></Link>
      </div>
    </section>
  </ResourceLayout>;
}
