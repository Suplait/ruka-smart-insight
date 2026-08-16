import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, DatabaseZap, ReceiptText, RefreshCcw, ScanSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RegistrationForm from "@/components/restaurant/RegistrationForm";
import { useIsMobile } from "@/hooks/use-mobile";
import { AcquisitionFAQ } from "@/components/acquisition/AcquisitionFAQ";
import { AcquisitionSeo } from "@/components/acquisition/AcquisitionSeo";
import acquisitionSeo from "@/content/acquisitionSeo.json";
import {
  AcquisitionHero,
  AcquisitionIntegrations,
  AcquisitionSystemNote,
  AcquisitionWorkSection,
} from "@/components/acquisition/AcquisitionSections";

export default function Retail() {
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
        const formSection = document.getElementById('mobile-form-section');
        if (formSection) {
          const rect = formSection.getBoundingClientRect();
          const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
          setShowScrollToForm(!isVisible);
        } else {
          setShowScrollToForm(window.scrollY > 300);
        }
      } else {
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

  return (
    <>
      <AcquisitionSeo {...acquisitionSeo.retail} />

      <main className="min-h-screen bg-[#f7f8fc] text-[#171827]">
        <Navbar />

        <div className="w-full pb-16 pt-24 sm:pt-28">
          <div className="container px-4 sm:px-6">
            <div className="lg:grid lg:grid-cols-[minmax(0,1fr),460px] lg:gap-14 xl:gap-20">
              <div className="space-y-20 py-10 sm:py-14 lg:space-y-28 lg:py-20">
                <AcquisitionHero
                  eyebrow="Ruka para retail"
                  title="Tus compras no deberían terminar en otra planilla."
                  description="Ruka toma información desde SII, ERP, bancos, archivos y otros sistemas, la cruza y deja tu operación actualizada."
                  outcomes={[
                    { label: "Compras registradas" },
                    { label: "Precios y proveedores al día" },
                    { label: "Conciliaciones ejecutadas" },
                    { label: "Stock y sistemas actualizados" },
                  ]}
                  onCtaClick={scrollToForm}
                />

                <AcquisitionWorkSection
                  title="Trabajo que puedes sacar de tu equipo"
                  items={[
                    {
                      title: "Registro de compras",
                      description: "Lee facturas y otras fuentes para dejar cada compra registrada donde corresponde.",
                      icon: ReceiptText,
                    },
                    {
                      title: "Seguimiento de precios",
                      description: "Homologa productos y mantiene cambios de precios y proveedores visibles para tu operación.",
                      icon: ScanSearch,
                    },
                    {
                      title: "Conciliaciones",
                      description: "Cruza facturas, órdenes, recepciones y pagos según el flujo que ya usa tu equipo.",
                      icon: RefreshCcw,
                    },
                    {
                      title: "Actualización entre sistemas",
                      description: "Actualiza stock, ERP, POS, planillas y otras herramientas sin volver a ingresar lo mismo.",
                      icon: DatabaseZap,
                    },
                  ]}
                />

                <AcquisitionIntegrations
                  integrations={[
                    { name: "SII", logo: "/integrations/sii.jpg" },
                    { name: "Bsale", logo: "/integrations/bsale.png" },
                    { name: "Defontana", logo: "/integrations/defontana.svg" },
                    { name: "Nubox", logo: "/integrations/nubox.svg" },
                    { name: "ERP", icon: "erp" },
                    { name: "Bancos", icon: "bank" },
                    { name: "Excel", icon: "excel" },
                    { name: "Sistema propio", icon: "system" },
                  ]}
                />

                <AcquisitionSystemNote
                  title="La información termina en los mismos sistemas."
                  description="Lo que cambia es quién hace el trabajo de leerla, cruzarla y mantenerla al día."
                />

                <div id="mobile-form-section" className="lg:hidden w-full">
                  <RegistrationForm highlightForm={highlightForm} timeLeft={timeLeft} pagePath="/retail" />
                </div>

                <AcquisitionFAQ />
              </div>

              <div className="hidden lg:block">
                <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto">
                  <RegistrationForm highlightForm={highlightForm} timeLeft={timeLeft} pagePath="/retail" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <Footer />

        {showScrollToForm && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: 20 }} 
            className="lg:hidden fixed bottom-6 right-6 z-50"
          >
            <Button 
              onClick={scrollToForm} 
              size="lg" 
              className="shadow-lg bg-primary hover:bg-primary/90 text-white font-semibold transition-all duration-300 px-6 py-6 h-auto rounded-full"
            >
              Hablar con Ruka <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </motion.div>
        )}
      </main>
    </>
  );
}
