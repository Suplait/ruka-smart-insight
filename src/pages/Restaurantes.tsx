import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Calculator, DatabaseZap, ReceiptText, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RegistrationForm from "@/components/restaurant/RegistrationForm";
import { useIsMobile } from "@/hooks/use-mobile";
import { AcquisitionFAQ } from "@/components/acquisition/AcquisitionFAQ";
import { AcquisitionSeo } from "@/components/acquisition/AcquisitionSeo";
import { AcquisitionSocialProof } from "@/components/acquisition/AcquisitionSocialProof";
import acquisitionSeo from "@/content/acquisitionSeo.json";
import {
  AcquisitionHero,
  AcquisitionIntegrations,
  AcquisitionSystemNote,
  AcquisitionWorkSection,
} from "@/components/acquisition/AcquisitionSections";

export default function Restaurantes() {
  const [highlightForm, setHighlightForm] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");
  const [showScrollToForm, setShowScrollToForm] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (isMobile) {
        // En móvil, mostrar el botón solo cuando no está en la sección del formulario
        const formSection = document.getElementById('mobile-form-section');
        if (formSection) {
          const rect = formSection.getBoundingClientRect();
          const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
          setShowScrollToForm(!isVisible);
        } else {
          setShowScrollToForm(window.scrollY > 300);
        }
      } else {
        // Comportamiento original para desktop
        setShowScrollToForm(window.scrollY > 300);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile]);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      let target = new Date();
      target.setHours(12, 0, 0, 0);
      if (now.getHours() >= 12) {
        target.setDate(target.getDate() + 1);
      }
      const diff = target.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor(diff % (1000 * 60 * 60) / (1000 * 60));
      setTimeLeft(`${hours}h ${minutes}m`);
    };
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 60000);
    return () => clearInterval(timer);
  }, []);

  const scrollToForm = () => {
    const form = isMobile ? document.getElementById('mobile-form-section') : document.querySelector('form');
    if (form) {
      form.scrollIntoView({
        behavior: 'smooth'
      });
      setHighlightForm(true);
      setTimeout(() => setHighlightForm(false), 2000);
    }
  };

  return <>
      <AcquisitionSeo {...acquisitionSeo.restaurantes} />

      <main className="min-h-screen bg-[#f7f8fc] text-[#171827]">
        <Navbar primaryAction={{ label: "Agendar 30 min", path: "/register", onClick: scrollToForm }} />

        <div className="w-full pb-16 pt-24 sm:pt-28">
          <div className="container px-4 sm:px-6">
            <div className="lg:hidden w-full sm:px-4 mb-8 hidden">
              <RegistrationForm highlightForm={highlightForm} timeLeft={timeLeft} pagePath="/restaurantes" />
            </div>

            <div className="lg:grid lg:grid-cols-[minmax(0,1fr),460px] lg:gap-14 xl:gap-20">
              <div className="space-y-20 py-10 sm:py-14 lg:space-y-28 lg:py-20">
                <AcquisitionHero
                  eyebrow="Ruka para restaurantes"
                  title="El trabajo administrativo entre tu SII, POS y planillas, hecho por Ruka."
                  description="Ruka registra compras, cruza costos, mantiene información al día y actualiza los sistemas que tu equipo ya usa."
                  outcomes={[
                    { label: "Compras registradas" },
                    { label: "Costos al día" },
                    { label: "Conciliaciones ejecutadas" },
                    { label: "POS / ERP actualizado" },
                  ]}
                  onCtaClick={scrollToForm}
                />

                <AcquisitionSocialProof />

                <AcquisitionWorkSection
                  title="Recupera horas que hoy se van en trabajo manual."
                  items={[
                    {
                      title: "Registro de compras",
                      description: "SII, XML, PDF y otras fuentes terminan registradas donde corresponde.",
                      icon: ReceiptText,
                    },
                    {
                      title: "Costos y margen",
                      description: "Productos homologados, precios actualizados y costos listos para calcular margen.",
                      icon: Calculator,
                    },
                    {
                      title: "Conciliaciones",
                      description: "Cruza facturas, recepciones, órdenes y pagos cuando el proceso lo requiere.",
                      icon: RefreshCcw,
                    },
                    {
                      title: "Actualización entre sistemas",
                      description: "Mantén POS, ERP, planillas y otras herramientas al día sin repetir la misma pega.",
                      icon: DatabaseZap,
                    },
                  ]}
                />

                <AcquisitionIntegrations
                  integrations={[
                    { name: "SII", logo: "/integrations/sii.jpg" },
                    { name: "Toteat", logo: "/integrations/toteat.svg" },
                    { name: "Fudo", logo: "/integrations/fudo.svg" },
                    { name: "Justo", logo: "/integrations/justo.svg" },
                    { name: "Bsale", logo: "/integrations/bsale.png" },
                    { name: "ERP", icon: "erp" },
                    { name: "Bancos", icon: "bank" },
                    { name: "Excel", icon: "excel" },
                  ]}
                />

                <AcquisitionSystemNote
                  title="Tu POS y tu ERP no cambian."
                  description="Ruka mueve, cruza y actualiza la información entre las herramientas que ya sostienen tu operación."
                />

                <div id="mobile-form-section" className="lg:hidden w-full mb-8">
                  <RegistrationForm highlightForm={highlightForm} timeLeft={timeLeft} pagePath="/restaurantes" />
                </div>

                <AcquisitionFAQ />
              </div>

              <div className="hidden lg:block">
                <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto">
                  <RegistrationForm highlightForm={highlightForm} timeLeft={timeLeft} pagePath="/restaurantes" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <Footer />

        {showScrollToForm && <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} exit={{
          opacity: 0,
          y: 20
        }} className="lg:hidden fixed bottom-6 right-6 z-50">
              <Button onClick={scrollToForm} size="lg" className="shadow-lg bg-primary hover:bg-primary/90 text-white font-semibold transition-all duration-300 px-6 py-6 h-auto rounded-full">
                Hablar con Ruka <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>}
      </main>
    </>;
}
