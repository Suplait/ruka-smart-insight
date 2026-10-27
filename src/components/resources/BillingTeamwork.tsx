import { ArrowRight, Check, Layers3, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

export function BillingTeamwork() {
  return (
    <section
      id="equipo"
      aria-labelledby="billing-team-title"
      className="scroll-mt-28 px-5 py-16 sm:px-8 sm:py-24"
    >
      <div className="mx-auto max-w-7xl">
        <header className="max-w-3xl">
          <p className="font-semibold text-[#424ec0]">
            Menos volver a escribir. Más trabajo resuelto.
          </p>
          <h2
            id="billing-team-title"
            className="mt-4 text-3xl font-semibold leading-[1.12] tracking-[-.035em] sm:text-5xl"
          >
            Una venta completa.
            <br />
            Un equipo coordinado.
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[#586176]">
            Una factura puede tener muchas líneas y pasar por varias manos. Ruka
            te ayuda a conservar el detalle y a separar quién prepara de quién
            emite.
          </p>
        </header>
        <div className="mt-10 grid gap-10 border-y border-[#dce2ed] py-10 md:grid-cols-2 md:gap-16">
          <article>
            <p className="flex items-baseline gap-3">
              <strong className="text-6xl font-semibold tracking-[-.06em] text-[#424ec0]">
                60
              </strong>
              <span className="font-semibold">ítems por factura</span>
            </p>
            <h3 className="mt-5 text-2xl font-semibold tracking-tight">
              Toda la venta, línea por línea.
            </h3>
            <p className="mt-3 leading-7 text-[#586176]">
              Incluye hasta 60 productos o servicios en una factura. Revisa
              cantidades, precios e importes antes de emitir, sin resumir todo
              en una sola descripción.
            </p>
            <p className="mt-5 text-sm text-[#586176]">
              Es el límite de líneas por documento, no de facturas por mes.
            </p>
          </article>
          <article>
            <ShieldCheck
              size={28}
              strokeWidth={1.5}
              className="text-[#424ec0]"
              aria-hidden="true"
            />
            <h3 className="mt-5 text-2xl font-semibold tracking-tight">
              Compartir el trabajo, no todos los permisos.
            </h3>
            <p className="mt-3 leading-7 text-[#586176]">
              Asigna accesos por empresa. Quien carga una venta no tiene por qué
              poder emitirla ni cambiar la configuración de una integración.
            </p>
            <ul className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
              {[
                "Preparar documentos",
                "Aprobar y emitir",
                "Mantener catálogo y clientes",
                "Administrar integraciones",
              ].map((label) => (
                <li key={label} className="flex items-start gap-2">
                  <Check
                    size={16}
                    className="mt-0.5 shrink-0 text-[#424ec0]"
                    aria-hidden="true"
                  />
                  {label}
                </li>
              ))}
            </ul>
          </article>
        </div>
        <div className="mt-9 flex max-w-3xl items-start gap-4">
          <Layers3
            size={24}
            className="mt-1 shrink-0 text-[#424ec0]"
            aria-hidden="true"
          />
          <div>
            <h3 className="text-xl font-semibold">
              ¿Vuelves a vender lo mismo? No partas de cero.
            </h3>
            <p className="mt-3 leading-7 text-[#586176]">
              Reutiliza una venta como punto de partida, ajusta lo que cambió y
              revisa el nuevo documento. Tu catálogo y tus clientes también te
              ahorran volver a cargar los mismos datos.
            </p>
          </div>
        </div>
        <section
          id="mcp"
          aria-labelledby="billing-mcp-title"
          className="mt-14 scroll-mt-28 rounded-2xl bg-[#eef0ff] p-6 sm:p-10 lg:p-12"
        >
          <div className="grid gap-10 lg:grid-cols-[1fr_.85fr] lg:gap-16">
            <div>
              <p className="text-sm font-semibold text-[#424ec0]">
                Facturación con IA · Integración a coordinar
              </p>
              <h2
                id="billing-mcp-title"
                className="mt-4 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl"
              >
                ¿Y si pudieras pedirle la factura a Claude o ChatGPT?
              </h2>
              <p className="mt-5 text-lg leading-8 text-[#505b70]">
                Ese es el valor de conectar tu asistente al facturador mediante
                MCP: darle acceso a herramientas para trabajar con tus
                documentos, en lugar de recibir instrucciones que después tienes
                que ejecutar a mano.
              </p>
              <p className="mt-4 leading-7 text-[#505b70]">
                Revisamos contigo la conexión, las acciones permitidas y cómo
                autorizar la emisión. La disponibilidad depende del conector y
                de la cuenta del asistente; no se activa solo por tener acceso
                al facturador.
              </p>
              <Link
                to="/register"
                className="mt-6 inline-flex min-h-12 items-center gap-3 rounded-full bg-[#424ec0] px-6 font-semibold text-white transition-colors hover:bg-[#343fad] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#424ec0] focus-visible:ring-offset-4 motion-reduce:transition-none"
              >
                Conversemos sobre MCP{" "}
                <ArrowRight size={17} aria-hidden="true" />
              </Link>
            </div>
            <div className="self-center border-l-2 border-[#bbc2f4] pl-5 sm:pl-8">
              <p className="text-sm font-semibold text-[#424ec0]">
                Ejemplo de una solicitud · No es una demo conectada
              </p>
              <blockquote className="mt-5 text-2xl font-medium leading-relaxed tracking-tight">
                “Prepara la factura de esta venta con los productos del
                catálogo. Muéstrame el detalle antes de emitir.”
              </blockquote>
              <dl className="mt-7 space-y-5">
                <div>
                  <dt className="font-semibold">
                    Tu asistente recibe el encargo.
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-[#505b70]">
                    Describe el trabajo en el chat que ya usas.
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold">
                    La conexión define qué puede hacer.
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-[#505b70]">
                    Empresa, permisos y acciones se acuerdan antes de
                    habilitarla.
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold">
                    Emitir sigue siendo una acción fiscal.
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-[#505b70]">
                    No basta con que el chat diga “listo”: el documento y su
                    estado deben comprobarse en el facturador.
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}
