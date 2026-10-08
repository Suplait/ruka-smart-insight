import stockInventory from "@/assets/stock-inventario.png";
import stockTransfer from "@/assets/stock-traspaso-bodegas.png";
import { ArrowDown, CheckCircle2 } from "lucide-react";
import { ProductImage, ProductLandingPage } from "@/components/seo/ProductLandingPage";
import { productPages } from "@/content/productPages";

function StockMovement() {
  return (
    <section className="border-y border-[#dfe4ef] bg-white px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div>
          <p className="text-sm font-semibold text-primary">Movimiento trazable</p>
          <h2 className="mt-4 text-balance text-4xl font-semibold leading-[1.04] tracking-[-0.04em] sm:text-5xl">Cada traspaso conserva quién pidió, quién aprobó y qué cambió.</h2>
          <p className="mt-5 text-lg leading-8 text-[#5d6577]">Las bodegas se conectan sin perder el control operativo que necesita tu equipo.</p>
          <div className="mt-8 border-y border-[#dfe4ef]">
            {["Solicitud registrada", "Aprobación visible", "Inventario actualizado"].map((item, index) => (
              <div key={item} className="flex items-center gap-3 border-b border-[#dfe4ef] py-3.5 last:border-b-0">
                <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full ${index === 2 ? "bg-[#e7f7ef] text-[#17805e]" : "bg-[#eef1ff] text-primary"}`}>{index === 2 ? <CheckCircle2 className="h-3.5 w-3.5" /> : <span className="font-mono text-[10px] font-semibold">0{index + 1}</span>}</span>
                <span className="text-sm font-semibold text-[#414b61]">{item}</span>
                {index < 2 && <ArrowDown className="ml-auto h-3.5 w-3.5 text-[#a0a7b6]" aria-hidden="true" />}
              </div>
            ))}
          </div>
        </div>
        <div className="mx-auto w-full max-w-md"><ProductImage src={stockTransfer} alt="Traspaso entre bodegas registrado en Ruka" position="top" aspect="portrait" label="Stock / Nueva solicitud" /></div>
      </div>
    </section>
  );
}

export default function Stock() {
  const content = productPages.stock;
  return <ProductLandingPage content={content} visual={<ProductImage src={stockInventory} alt={content.imageAlt ?? ""} position="top" aspect="cinema" label="Inventario / Bodega" />} demo={<StockMovement />} />;
}
