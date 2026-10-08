import { ProductImage, ProductLandingPage } from "@/components/seo/ProductLandingPage";
import { PurchaseRegistrationTour } from "@/components/seo/PurchaseRegistrationTour";
import { productPages } from "@/content/productPages";

export default function RegistroDeCompras() {
  const content = productPages.registro;
  return (
    <ProductLandingPage
      content={content}
      visual={<ProductImage src="/assets/registro-compras/facturas-en-bandeja.png" alt={content.imageAlt ?? ""} position="top" aspect="standard" label="Compras / Documentos" />}
      demo={<PurchaseRegistrationTour />}
    />
  );
}
