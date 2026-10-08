import panelDashboard from "@/assets/panel-control-dashboard.png";
import panelTicket from "@/assets/panel-control-ticket-promedio.png";
import { ArrowRight, CircleDollarSign, ReceiptText, ShoppingBag } from "lucide-react";
import { ProductImage, ProductLandingPage } from "@/components/seo/ProductLandingPage";
import { productPages } from "@/content/productPages";

function MarginView() {
  return (
    <section className="border-y border-[#dfe4ef] bg-white px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-16">
        <ProductImage src={panelTicket} alt="Detalle de ticket promedio y margen en Ruka" position="center" aspect="banner" label="Control / Ticket promedio" />
        <div>
          <p className="text-sm font-semibold text-primary">Del dato a la causa</p>
          <h2 className="mt-4 text-balance text-4xl font-semibold leading-[1.04] tracking-[-0.04em] sm:text-5xl">No solo ves que cambió. Puedes seguir por qué.</h2>
          <p className="mt-5 text-lg leading-8 text-[#5d6577]">Cada lectura conecta con ventas, compras y costos que permiten explicar la variación.</p>
          <div className="mt-8 flex items-center border-y border-[#dfe4ef] py-4" aria-label="Datos conectados para calcular margen">
            {[
              { Icon: ShoppingBag, label: "Ventas" },
              { Icon: ReceiptText, label: "Costos" },
              { Icon: CircleDollarSign, label: "Margen" },
            ].map(({ Icon, label }, index) => (
              <div key={label} className="flex min-w-0 flex-1 items-center gap-1.5 sm:gap-2">
                <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg sm:h-8 sm:w-8 ${index === 2 ? "bg-[#171a29] text-white" : "bg-[#eef1ff] text-primary"}`}><Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" /></span>
                <span className="text-xs font-semibold text-[#414b61] sm:text-sm">{label}</span>
                {index < 2 && <ArrowRight className="ml-auto mr-1 h-3 w-3 shrink-0 text-[#a2a9b7] sm:mr-2 sm:h-3.5 sm:w-3.5" aria-hidden="true" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function PanelControl() {
  const content = productPages.panel;
  return <ProductLandingPage content={content} visual={<ProductImage src={panelDashboard} alt={content.imageAlt ?? ""} position="top" aspect="cinema" label="Control / Rentabilidad" />} demo={<MarginView />} />;
}
