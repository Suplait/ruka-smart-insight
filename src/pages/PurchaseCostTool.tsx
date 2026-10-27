import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronDown, Download, RotateCcw, ShieldCheck } from "lucide-react";
import { ResourceNextStep } from "@/components/resources/ResourceNextStep";
import { ResourceLayout, resourceLinkClass } from "@/components/resources/ResourceLayout";
import { ToolQuestions } from "@/components/resources/ToolQuestions";
import { costFaqs, variationFaqs } from "@/content/toolGuides";
import { calculatePurchaseCost, comparePurchaseCosts, costUnits, examplePurchase, purchaseCostCsv, type CostField, type CostUnit, type PurchaseCostInput } from "@/utils/purchaseCost";

const control = "mt-2 min-h-12 min-w-0 w-full rounded-lg border border-[#808ca2] bg-white px-3 py-2 text-base tabular-nums text-[#171827] outline-none transition-[border-color,box-shadow] duration-150 focus:border-primary focus:ring-2 focus:ring-primary/20 aria-[invalid=true]:border-red-600";
const number = (value: number, digits = 2) => new Intl.NumberFormat("es-CL", { maximumFractionDigits: digits }).format(value);
const money = (value: number, currency: string) => `${currency} ${value < 0 ? "−" : ""}$${number(Math.abs(value), Math.abs(value) > 0 && Math.abs(value) < 0.01 ? 6 : 2)}`;
const scenarios = [
  { label: "Bolsas y sacos", before: { ...examplePurchase }, after: { ...examplePurchase, price: "80000", packs: "1", content: "25" }, explanation: "Seis bolsas de 1 kg frente a un saco de 25 kg. Un envase mayor no siempre cuesta menos por kilo." },
  { label: "Botellas y bidones", before: { ...examplePurchase, price: "12000", packs: "6", content: "500", unit: "ml" as const }, after: { ...examplePurchase, price: "18000", packs: "1", content: "5", unit: "l" as const }, explanation: "Seis botellas de 500 ml son 3 litros. Compara ese costo por litro con un bidón de 5 litros." },
  { label: "Precio con IVA", before: { ...examplePurchase, price: "21420", taxIncluded: true }, after: { ...examplePurchase, price: "19000" }, explanation: "$21.420 con IVA de 19% equivalen a $18.000 netos. Separa el impuesto antes de comparar." },
];

function PurchaseFields({ id, title, value, onChange, touched, setTouched }: { id: string; title: string; value: PurchaseCostInput; onChange: (value: PurchaseCostInput) => void; touched: boolean; setTouched: () => void }) {
  const result = calculatePurchaseCost(value);
  function field(key: CostField, label: string, hint?: string) {
    const error = touched && result.ok === false ? result.errors[key] : undefined;
    return <div className="min-w-0"><label htmlFor={`${id}-${key}`} className="block text-sm font-medium">{label}</label><input id={`${id}-${key}`} inputMode="decimal" type="text" autoComplete="off" value={value[key]} onChange={e => onChange({ ...value, [key]: e.target.value })} onBlur={setTouched} className={control} aria-invalid={!!error} aria-describedby={error || hint ? `${id}-${key}-hint` : undefined} />{(error || hint) && <p id={`${id}-${key}-hint`} className={`mt-2 text-xs leading-5 ${error ? "text-red-700" : "text-[#60687a]"}`}>{error || hint}</p>}</div>;
  }
  return <fieldset className="min-w-0">
    <legend className="mb-5 flex items-center gap-3 text-lg font-semibold"><span aria-hidden="true" className={`h-2 w-2 rounded-full ${id === "current" ? "bg-primary" : "bg-[#7c8495]"}`} />{title}</legend>
    <div className="space-y-5">
      <div><div className="grid grid-cols-[minmax(0,1fr)_88px] items-start gap-2">{field("price", "Total de la compra")}<div><label htmlFor={`${id}-currency`} className="block text-sm font-medium">Moneda</label><select id={`${id}-currency`} className={control} value={value.currency} onChange={e => onChange({ ...value, currency: e.target.value as PurchaseCostInput["currency"] })}><option value="CLP">CLP</option><option value="USD">USD</option></select></div></div><p className="mt-2 text-xs leading-5 text-[#60687a]">El total de todos los envases, antes del descuento.</p></div>
      {field("packs", "¿Cuántos envases compraste?", "Cuenta cajas, bolsas o bidones; no su contenido.")}
      <div className="grid grid-cols-[minmax(0,1fr)_88px] items-start gap-2">{field("content", "Contenido de cada envase")}<div><label htmlFor={`${id}-unit`} className="block text-sm font-medium">Unidad</label><select id={`${id}-unit`} className={control} value={value.unit} onChange={e => onChange({ ...value, unit: e.target.value as CostUnit })}>{Object.keys(costUnits).map(key => <option key={key} value={key}>{key}</option>)}</select></div></div>
      <p className="flex items-center justify-between gap-3 border-t border-[#e1e5ec] pt-4 text-sm"><span className="text-[#60687a]">Cantidad total</span><span className="font-semibold tabular-nums">{result.ok ? `${number(result.value.quantity, 6)} ${result.value.unit}` : "Sin calcular"}</span></p>
      <details className="group border-t border-[#e1e5ec] pt-1"><summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-2 rounded text-sm font-medium focus-visible:outline-primary [&::-webkit-details-marker]:hidden">Descuento e IVA<span className="flex items-center gap-2 text-xs text-[#60687a]">{value.discount !== "0" ? `${value.discount}% dto.` : "Sin descuento"}{value.taxIncluded ? " · IVA incluido" : " · Neto"}<ChevronDown size={15} className="shrink-0 transition-transform group-open:rotate-180 motion-reduce:transition-none" aria-hidden="true" /></span></summary><div className="space-y-4 pb-2 pt-3">{field("discount", "Descuento (%)", "Usa 0 si ya descontaste el total.")}<label htmlFor={`${id}-tax`} className="flex min-h-11 cursor-pointer items-center gap-3 text-sm"><input id={`${id}-tax`} type="checkbox" className="h-5 w-5 shrink-0 accent-[#515fee]" checked={value.taxIncluded} onChange={e => onChange({ ...value, taxIncluded: e.target.checked })} />El precio ingresado incluye IVA</label>{value.taxIncluded && field("taxRate", "IVA incluido (%)", "Separamos el impuesto con esta tasa.")}</div></details>
    </div>
  </fieldset>;
}

export default function PurchaseCostTool({ comparison = false }: { comparison?: boolean }) {
  const [previous, setPrevious] = useState<PurchaseCostInput>({ ...examplePurchase });
  const [current, setCurrent] = useState<PurchaseCostInput>({ ...examplePurchase, price: "80000", packs: "1", content: "25" });
  const [touched, setTouched] = useState(false);
  const [scenario, setScenario] = useState<number | null>(0);
  const [downloadError, setDownloadError] = useState("");
  const [mobilePurchase, setMobilePurchase] = useState<"previous" | "current">("previous");
  const a = calculatePurchaseCost(previous);
  const b = calculatePurchaseCost(current);
  const delta = a.ok && b.ok ? comparePurchaseCosts(a.value, b.value) : null;
  const heading = comparison ? "¿Subió el precio o cambió el formato?" : "Cajas distintas. Un costo comparable.";
  const description = comparison ? "Compara dos compras por kilo, litro o unidad. Separa el efecto del formato, el descuento y el IVA antes de sacar conclusiones." : "Calcula cuánto pagas por kilo, litro o unidad, aunque compres por caja o bolsa. Ajusta el ejemplo con los datos de tu compra.";
  const path = comparison ? "/herramientas/variacion-costos" : "/herramientas/costo-unitario";
  const faqs = comparison ? variationFaqs : costFaqs;
  function chooseScenario(index: number) { setPrevious({ ...scenarios[index].before }); setCurrent({ ...scenarios[index].after }); setTouched(false); setScenario(index); setDownloadError(""); setMobilePurchase("previous"); }
  function reset() { chooseScenario(0); }
  function download() {
    if (!a.ok || (comparison && (!b.ok || !delta?.ok))) return;
    setDownloadError("");
    try {
    const content = purchaseCostCsv(comparison && b.ok ? [a.value, b.value] : [a.value]);
    const url = URL.createObjectURL(new Blob([content], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url; link.download = comparison ? "ruka-comparacion-costos.csv" : "ruka-costo-unitario.csv";
    document.body.appendChild(link); link.click(); link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch { setDownloadError("No pudimos preparar la descarga. Tus datos siguen aquí; vuelve a intentarlo en este navegador."); }
  }
  return <ResourceLayout compact showContact={false} path={path} faqs={faqs} title={comparison ? "Calculadora de variación de costos de compra | Ruka" : "Calculadora de costo unitario por kilo, litro o unidad | Ruka"} heading={heading} description={description} eyebrow={comparison ? "Comparador de costos" : "Calculadora de costo unitario"}>
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3 text-sm">
      <p className="flex items-center gap-2 text-[#505b70]"><ShieldCheck size={18} aria-hidden="true" /> Cálculo en tu navegador · Sin registro</p>
      <div className="flex flex-wrap gap-x-5"><a href="#resultado" className={`${resourceLinkClass} lg:hidden`}>Ver resultado ↓</a><button type="button" onClick={reset} className={resourceLinkClass}><RotateCcw size={16} aria-hidden="true" /> Restablecer ejemplo</button></div>
    </div>
    <section aria-label="Ejemplos de compra" className="mb-6 flex flex-col gap-3 rounded-lg bg-[#f6f7fc] px-5 py-4 xl:flex-row xl:items-center xl:gap-6"><p className="shrink-0 text-sm font-semibold">Prueba con un caso</p><select aria-label="Cargar un ejemplo" value={scenario ?? ""} onChange={event => chooseScenario(Number(event.target.value))} className="min-h-11 w-full rounded-lg border border-[#808ca2] bg-white px-3 text-base focus-visible:outline-primary md:hidden"><option value="" disabled>Tus propios datos</option>{scenarios.map((item, index) => <option key={item.label} value={index}>{item.label}</option>)}</select><div className="hidden flex-wrap gap-2 md:flex">{scenarios.map((item, index) => <button type="button" key={item.label} aria-pressed={scenario === index} onClick={() => chooseScenario(index)} className={`min-h-11 rounded-md border px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${scenario === index ? "border-[#424ec0] bg-white text-[#343fad]" : "border-transparent text-[#505b70] hover:bg-white"}`}>{item.label}</button>)}</div><p className="hidden max-w-lg text-sm leading-6 text-[#505b70] md:block">{scenario === null ? "Estás usando tus propios datos. El resultado se actualiza al editar." : scenarios[scenario].explanation}</p></section>
    {comparison && <div className="mb-4 md:hidden"><a href="#resultado" className="flex min-h-14 items-center justify-between gap-4 rounded-lg bg-[#eef0ff] px-4 py-3 text-sm font-medium text-[#343fad] focus-visible:ring-2 focus-visible:ring-primary"><span>{delta?.ok ? `${delta.percent > 0 ? "+" : ""}${number(delta.percent)}% por unidad` : "Completa ambas compras"}</span><span className="inline-flex items-center gap-2">Ver detalle<ArrowRight size={16} aria-hidden="true" /></span></a><div className="mt-4 grid grid-cols-2 gap-2" aria-label="Compra a editar">{([{ id: "previous", label: "Editar anterior" }, { id: "current", label: "Editar actual" }] as const).map(item => <button key={item.id} type="button" aria-pressed={mobilePurchase === item.id} onClick={() => setMobilePurchase(item.id)} className="min-h-12 rounded-lg border border-[#dce2ed] px-3 text-sm font-semibold text-[#505b70] focus-visible:ring-2 focus-visible:ring-primary aria-pressed:border-[#424ec0] aria-pressed:text-[#343fad]">{item.label}</button>)}</div></div>}
    <div className={`grid items-start gap-6 ${comparison ? "lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_360px]" : "lg:grid-cols-[1fr_1fr]"}`}>
      <div className="overflow-hidden rounded-xl border border-[#dce2ed] bg-white"><div className={`grid divide-[#dce2ed] ${comparison ? "md:grid-cols-2 md:divide-x" : ""}`}><div className={`min-w-0 p-5 sm:p-6 ${comparison && mobilePurchase !== "previous" ? "hidden md:block" : ""}`}><PurchaseFields id="previous" title={comparison ? "Compra anterior" : "Los datos de tu compra"} value={previous} onChange={value => { setPrevious(value); setScenario(null); }} touched={touched} setTouched={() => setTouched(true)} /></div>
      {comparison && <div className={`min-w-0 bg-[#fafbff] p-5 sm:p-6 ${mobilePurchase !== "current" ? "hidden md:block" : ""}`}><PurchaseFields id="current" title="Compra actual" value={current} onChange={value => { setCurrent(value); setScenario(null); }} touched={touched} setTouched={() => setTouched(true)} /></div>}</div><details className="border-t border-[#dce2ed] bg-white px-5 sm:px-6"><summary className="cursor-pointer py-4 text-sm text-[#505b70] focus-visible:outline-primary">¿Qué datos tengo que ingresar?</summary><p className="pb-5 text-sm leading-6 text-[#505b70]">Envases son las cajas, bolsas o bidones comprados. Para seis bolsas de un kilo, ingresa 6 envases y contenido 1 kg. Para una bolsa de 500 gramos, ingresa contenido 500 g. Usa números sin separador de miles; se admite coma o punto decimal. Si ingresas un total neto, no marques IVA incluido.</p></details></div>
      <section id="resultado" tabIndex={-1} aria-label="Resultado del cálculo" className="scroll-mt-28 rounded-xl border border-[#cdd3f4] bg-[#f0f2ff] p-6 focus-visible:outline-primary lg:sticky lg:top-28">
        <p className="text-sm font-semibold text-[#424ec0]">{comparison ? "La diferencia real por unidad" : "Costo neto por unidad"}</p>
        <div role="status" aria-live="polite" aria-atomic="true" className="mt-6">
          {!a.ok || (comparison && !b.ok) ? <p className="leading-7">Completa los datos con valores válidos para ver el resultado.</p> : comparison ? delta?.ok ? <>
            <p className="break-words text-5xl font-semibold tracking-tight tabular-nums">{delta.percent > 0 ? "+" : ""}{number(delta.percent)}<span className="text-3xl">%</span></p>
            <p className="mt-3 leading-7">{Math.abs(delta.percent) < 0.005 ? "El costo se mantiene." : delta.percent > 0 ? "La compra actual cuesta más por unidad." : "La compra actual cuesta menos por unidad."}</p>
            <dl className="mt-6 space-y-5 text-sm">{b.ok && <>{[{ label: "Anterior", cost: a.value.unitCost, color: "bg-[#8790a3]" }, { label: "Actual", cost: b.value.unitCost, color: "bg-primary" }].map(item => <div key={item.label}><div className="flex flex-wrap items-baseline justify-between gap-x-2"><dt className="text-[#505b70]">{item.label}</dt><dd className="font-semibold tabular-nums">{money(item.cost, a.value.currency)} / {a.value.unit}</dd></div><div aria-hidden="true" className="mt-2 h-2 overflow-hidden rounded-full bg-[#f0f2f7]"><div className={`h-full origin-left rounded-full ${item.color} transition-transform duration-200 motion-reduce:transition-none`} style={{ transform: `scaleX(${item.cost / Math.max(a.value.unitCost, b.value.unitCost)})` }} /></div></div>)}<div className="flex flex-wrap justify-between gap-2 border-t border-[#e1e5ec] pt-4"><dt className="text-[#505b70]">Diferencia por {a.value.unit}</dt><dd className="font-semibold tabular-nums">{money(delta.difference, a.value.currency)}</dd></div></>}</dl>
          </> : <p className="leading-7">{delta?.error}</p> : <>
            <p className="break-words text-[clamp(2rem,4vw,3rem)] font-semibold tracking-tight tabular-nums">{money(a.value.unitCost, a.value.currency)}</p><p className="mt-1 text-lg">por {a.value.unit}</p>
            <dl className="mt-8 space-y-4 border-t border-[#cbd0ef] pt-6 text-sm"><div><dt className="text-[#505b70]">Cantidad total</dt><dd className="mt-1 font-semibold tabular-nums">{number(a.value.quantity, 6)} {a.value.unit}</dd></div><div><dt className="text-[#505b70]">Total sin IVA, con descuento aplicado</dt><dd className="mt-1 font-semibold tabular-nums">{money(a.value.netTotal, a.value.currency)}</dd></div></dl>
          </>}
        </div>
        {comparison && delta?.ok && b.ok && <div className="mt-5 border-t border-[#cdd3f4] pt-5"><p className="text-sm font-medium">Impacto en esta compra</p><p className="mt-2 break-words text-2xl font-semibold tabular-nums">{money(Math.abs(delta.difference * b.value.quantity), b.value.currency)} {delta.difference > 0 ? "más" : delta.difference < 0 ? "menos" : "de diferencia"}</p><p className="mt-2 text-xs leading-5 text-[#505b70]">Para los {number(b.value.quantity, 6)} {b.value.unit} actuales, frente al costo por unidad de la compra anterior.</p></div>}
        <button type="button" onClick={download} disabled={!a.ok || (comparison && (!b.ok || !delta?.ok))} className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#424ec0] px-3 text-sm font-semibold text-white transition-colors hover:bg-[#343fa7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"><Download size={16} aria-hidden="true" /> Descargar resultado CSV</button>
        {downloadError && <p role="alert" className="mt-3 text-sm leading-6 text-red-700">{downloadError}</p>}
        <p className="mt-4 text-xs leading-5 text-[#60687a]">Ejemplo editable. No incluye flete, merma ni otros gastos. No calcula crédito fiscal ni reemplaza una revisión contable.</p>
      </section>
    </div>
    {a.ok && <section aria-label="Desglose del cálculo" className="mt-7 grid gap-5 border-y border-[#dce2ed] py-6 md:grid-cols-[.7fr_1.3fr]"><div><h2 className="text-lg font-semibold">Sigue la cuenta.</h2><p className="mt-2 text-sm leading-6 text-[#505b70]">{comparison ? "La misma fórmula en ambas compras." : "Del envase al costo que puedes comparar."} Sin redondear los cálculos intermedios.</p></div><div className="space-y-4">{[{ label: comparison ? "Anterior" : "Tu compra", result: a }, ...(comparison ? [{ label: "Actual", result: b }] : [])].map(({ label, result }) => result.ok && <div key={label} className="flex flex-wrap items-baseline gap-x-3 gap-y-2 text-lg tabular-nums"><span className="w-20 text-sm font-medium text-[#505b70]">{label}</span><span>{money(result.value.netTotal, result.value.currency)} <span className="text-sm text-[#505b70]">netos</span></span><span aria-label="dividido por">÷</span><span>{number(result.value.quantity, 6)} {result.value.unit}</span><span>=</span><strong className="text-[#343fad]">{money(result.value.unitCost, result.value.currency)} / {result.value.unit}</strong></div>)}</div></section>}
    <ResourceNextStep path={path} />
    <section className="mt-16 grid gap-8 border-t border-[#dce2ed] pt-10 md:grid-cols-[0.8fr_1.2fr]">
      <h2 className="text-2xl font-semibold tracking-tight">La cuenta, sin letra chica.</h2>
      <div className="space-y-5 leading-7 text-[#505b70]"><p><strong className="text-[#171827]">Costo unitario = total neto con descuento ÷ cantidad total.</strong> Multiplicamos envases por contenido y convertimos gramos a kilos o mililitros a litros. No mezclamos peso y volumen.</p>{comparison && <p>Variación = (costo actual − costo anterior) ÷ costo anterior × 100. Compara el mismo insumo, calidad y moneda: un resultado menor no significa por sí solo una mejor compra.</p>}<p>Si marcas IVA incluido, dividimos el precio descontado por (1 + tasa / 100). Si ya ingresaste un precio neto, deja esa opción desmarcada. El descuento se aplica una sola vez sobre el total.</p><p>Los datos de esta calculadora no se guardan ni se envían a un servidor. Al recargar vuelves al ejemplo. Ingresa números sin separadores de miles; puedes usar coma o punto decimal.</p>
        <Link className={resourceLinkClass} to={comparison ? "/herramientas/costo-unitario" : "/herramientas/variacion-costos"}>{comparison ? "Calcular una sola compra" : "Comparar dos compras"}<ArrowRight size={18} aria-hidden="true" /></Link>
      </div>
    </section>
    <ToolQuestions faqs={faqs} />
  </ResourceLayout>;
}
