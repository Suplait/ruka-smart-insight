const mismatches = [
  {
    n: "01",
    title: "El precio no es el que se acordó",
    body: "La orden decía $428.950 y la factura llega con otro total. Casi nunca es un error: es un alza que el proveedor no avisó.",
    rule: "Monto contra orden de compra",
  },
  {
    n: "02",
    title: "Llegó menos de lo que dice la factura",
    body: "Se facturan 16 kg y en bodega se recibieron 14. Si nadie compara la recepción, la diferencia se paga igual.",
    rule: "Recepción contra factura",
  },
  {
    n: "03",
    title: "Factura sin orden de compra",
    body: "Alguien pidió por teléfono y el documento llega sin respaldo. No es fraude, es apuro — pero entra al gasto igual.",
    rule: "Existencia y estado de la orden",
  },
  {
    n: "04",
    title: "Un pago que no calza con ningún documento",
    body: "Salió plata del banco y no hay factura que la explique, o el mismo documento se pagó dos veces.",
    rule: "Movimiento bancario contra documento",
  },
] as const;

export function ReconciliationMismatches() {
  return (
    <section className="border-b border-[#dce1eb] py-16 sm:py-20" aria-labelledby="mismatches-title">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold text-primary">Los cuatro desencuentros</p>
        <h2
          id="mismatches-title"
          className="mt-3 text-balance text-3xl font-semibold leading-[1.1] tracking-[-0.035em] text-[#171827] sm:text-4xl"
        >
          Una diferencia siempre tiene una causa.
        </h2>
        <p className="mt-5 text-lg leading-8 text-[#555b6e]">
          Estas cuatro aparecen en cualquier conciliación de compras. Cada una la detecta una regla distinta, y por eso
          la excepción llega con el contexto para resolverla.
        </p>
      </div>

      <div className="mt-10 border-t border-[#d5dbe8]">
        {mismatches.map((item) => (
          <article
            key={item.n}
            className="grid items-baseline gap-x-8 gap-y-3 border-b border-[#dce1eb] py-7 sm:grid-cols-[3.5rem_minmax(0,1.05fr)_minmax(0,0.85fr)]"
          >
            <span className="font-mono text-sm font-semibold tabular-nums text-primary">{item.n}</span>
            <div>
              <h3 className="text-xl font-semibold tracking-[-0.025em] text-[#202231]">{item.title}</h3>
              <p className="mt-2.5 text-[15px] leading-7 text-[#62697a]">{item.body}</p>
            </div>
            <div className="rounded-xl border border-[#dce3f2] bg-[#f7f8fc] px-4 py-3.5">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#7b8598]">La regla que la detecta</p>
              <p className="mt-1.5 text-sm font-semibold leading-6 text-[#41495c]">{item.rule}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
