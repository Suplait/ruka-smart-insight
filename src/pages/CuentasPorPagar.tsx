import cuentasPorPagar from "@/assets/cuentas-por-pagar-interface.png";
import planillaBancaria from "@/assets/planilla-bancaria.png";
import { ArrowRight, CheckCircle2, FileText, PackageCheck } from "lucide-react";
import { ProductImage, ProductLandingPage } from "@/components/seo/ProductLandingPage";
import { productPages } from "@/content/productPages";

function ReceptionProof() {
  return (
    <section className="border-y border-[#dfe4ef] bg-white px-5 py-20 sm:px-8 sm:py-28" aria-labelledby="reception-proof-title">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.12fr_0.88fr] lg:gap-16">
        <div className="overflow-hidden rounded-2xl bg-white p-2 shadow-[0_26px_70px_rgba(29,38,72,0.14)]">
          <div className="flex h-9 items-center gap-1.5 border-b border-[#e6e9f0] px-3" aria-hidden="true">
            <span className="h-2 w-2 rounded-full bg-[#d7dce7]" />
            <span className="h-2 w-2 rounded-full bg-[#d7dce7]" />
            <span className="h-2 w-2 rounded-full bg-[#d7dce7]" />
            <span className="ml-auto text-[10px] font-medium text-[#778094]">Recepción / Mercadería</span>
          </div>
          <video
            className="aspect-video w-full rounded-b-xl bg-[#f2f4f8] object-contain"
            controls
            playsInline
            preload="metadata"
            poster={cuentasPorPagar}
            aria-label="Demostración del módulo de recepción de Ruka"
          >
            <source src="/recepcion-modulo.mp4" type="video/mp4" />
            Tu navegador no soporta videos HTML5.
          </video>
        </div>

        <div>
          <p className="text-sm font-semibold text-primary">Recepción antes del pago</p>
          <h2 id="reception-proof-title" className="mt-4 text-balance text-4xl font-semibold leading-[1.04] tracking-[-0.04em] sm:text-5xl">Lo recibido decide qué se puede pagar.</h2>
          <p className="mt-5 text-lg leading-8 text-[#5d6577]">Tu equipo confirma cantidades y registra faltantes o productos con problemas al momento de recibir. Ruka deja esa evidencia vinculada a la factura.</p>
          <ul className="mt-7 space-y-3 text-[15px] text-[#4f586b]">
            {["Cantidades recibidas por producto", "Faltantes, incidencias y evidencia", "Bloqueo de facturas con diferencias"].map((item) => (
              <li key={item} className="flex items-center gap-3">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#e7f7ef] text-[#17805e]"><CheckCircle2 className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden="true" /></span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function PaymentProof() {
  return (
    <section className="border-b border-[#dfe4ef] bg-[#f6f7fb] px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:gap-16">
        <div>
          <p className="text-sm font-semibold text-primary">Nómina bancaria</p>
          <h2 className="mt-4 text-balance text-4xl font-semibold leading-[1.04] tracking-[-0.04em] sm:text-5xl">Genera la nómina masiva en un clic.</h2>
          <p className="mt-5 text-lg leading-8 text-[#5d6577]">Ruka toma las facturas que ya pasaron tus controles y genera el archivo en el formato de tu banco, listo para subir y pagar.</p>
          <div className="mt-8 border-y border-[#d9deea]" aria-label="Flujo desde facturas aprobadas hasta nómina bancaria">
            {[
              { Icon: FileText, label: "Facturas listas", detail: "Recepción y reglas confirmadas" },
              { Icon: PackageCheck, label: "Nómina generada", detail: "Pagos agrupados en un clic" },
              { Icon: CheckCircle2, label: "Archivo para el banco", detail: "Listo para subir y pagar" },
            ].map(({ Icon, label, detail }, index) => (
              <div key={label} className="group flex items-center gap-3 border-b border-[#d9deea] py-3.5 last:border-b-0">
                <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${index === 2 ? "bg-[#e7f7ef] text-[#157657]" : "bg-white text-primary"}`}><Icon className="h-4 w-4" aria-hidden="true" /></span>
                <div><p className="text-sm font-semibold text-[#343d54]">{label}</p><p className="mt-0.5 text-xs text-[#747d90]">{detail}</p></div>
                {index < 2 && <ArrowRight className="ml-auto h-4 w-4 rotate-90 text-[#9aa2b2] transition-transform duration-200 group-hover:translate-y-0.5" aria-hidden="true" />}
              </div>
            ))}
          </div>
        </div>
        <ProductImage src={planillaBancaria} alt="Nómina masiva de pagos lista para subir al banco" position="top" aspect="banner" label="Pagos / Nómina bancaria" />
      </div>
    </section>
  );
}

export default function CuentasPorPagar() {
  const content = productPages.cuentas;
  return (
    <ProductLandingPage
      content={content}
      visual={<ProductImage src={cuentasPorPagar} alt={content.imageAlt ?? ""} position="top" aspect="cinema" label="Cuentas por pagar / Proveedores" />}
      demo={
        <>
          <ReceptionProof />
          <PaymentProof />
        </>
      }
    />
  );
}
