import { SeoLandingPage } from "@/components/seo/SeoLandingPage";
import { PurchaseRegistrationTour } from "@/components/seo/PurchaseRegistrationTour";
import { seoLandingPages } from "@/content/seoLandingPages";

export default function RegistroDeCompras() {
  return (
    <SeoLandingPage content={seoLandingPages.registroDeCompras}>
      <PurchaseRegistrationTour />
    </SeoLandingPage>
  );
}
