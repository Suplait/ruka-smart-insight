import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, DatabaseZap, ReceiptText, RefreshCcw, Tags } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RegistrationForm from "@/components/restaurant/RegistrationForm";
import { AcquisitionFAQ } from "@/components/acquisition/AcquisitionFAQ";
import { AcquisitionSeo } from "@/components/acquisition/AcquisitionSeo";
import acquisitionSeo from "@/content/acquisitionSeo.json";
import {
  AcquisitionHero,
  AcquisitionIntegrations,
  AcquisitionSystemNote,
  AcquisitionWorkSection,
} from "@/components/acquisition/AcquisitionSections";

const hotelOutcomes = [
  { label: "Compras registradas" },
  { label: "Conciliaciones ejecutadas" },
  { label: "Costos y proveedores al día" },
  { label: "Sistemas actualizados" },
];

export default function Hoteles() {
  const [highlightForm, setHighlightForm] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");
  const [showScrollToForm, setShowScrollToForm] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollToForm(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    const form = document.querySelector('form');
    if (form) {
      form.scrollIntoView({
        behavior: 'smooth'
      });
      setHighlightForm(true);
      setTimeout(() => setHighlightForm(false), 2000);
    }
  };

  return <>
      <AcquisitionSeo {...acquisitionSeo.hoteles} />

      <main className="min-h-screen bg-[#f7f8fc] text-[#171827]">
        <Navbar />

        <div className="w-full pb-16 pt-24 sm:pt-28">
          <div className="container px-4 sm:px-6">
            <div className="lg:grid lg:grid-cols-[minmax(0,1fr),460px] lg:gap-14 xl:gap-20">
              <div className="space-y-20 py-10 sm:py-14 lg:space-y-28 lg:py-20">
                <div className="space-y-8">
                  <AcquisitionHero
                    eyebrow="Ruka para hoteles"
                    title="Menos trabajo manual entre compras, contabilidad y operación."
                    description="Ruka conecta facturas, ERP, bancos, planillas y otros sistemas para registrar, cruzar y actualizar información sin que tu equipo tenga que moverla a mano."
                    outcomes={hotelOutcomes}
                    onCtaClick={scrollToForm}
                  />

                  <div className="lg:hidden w-full sm:px-4 mb-8">
                    <RegistrationForm highlightForm={highlightForm} timeLeft={timeLeft} pagePath="/hoteles" />
                  </div>
                </div>

                <AcquisitionWorkSection
                  title="Trabajo que puedes sacar de tu equipo"
                  items={[
                    {
                      title: "Registro de compras",
                      description: "Facturas y documentos quedan registrados en el sistema donde tu operación los necesita.",
                      icon: ReceiptText,
                    },
                    {
                      title: "Conciliaciones",
                      description: "Cruza facturas, órdenes, recepciones y pagos según las reglas de tu proceso.",
                      icon: RefreshCcw,
                    },
                    {
                      title: "Costos y proveedores",
                      description: "Mantén precios, productos y datos de proveedores actualizados sin repetir el trabajo.",
                      icon: Tags,
                    },
                    {
                      title: "Actualización entre sistemas",
                      description: "Lleva la misma información a ERP, contabilidad, planillas u otras plataformas.",
                      icon: DatabaseZap,
                    },
                  ]}
                />

                <AcquisitionSystemNote
                  title="Tu PMS, ERP y sistema contable siguen siendo los mismos."
                  description="Ruka hace el trabajo entre ellos para que la información llegue actualizada donde corresponde."
                />

                <AcquisitionIntegrations
                  integrations={[
                    { name: "SII", logo: "/integrations/sii.jpg" },
                    { name: "Defontana", logo: "/integrations/defontana.svg" },
                    { name: "Nubox", logo: "/integrations/nubox.svg" },
                    { name: "ERP", icon: "erp" },
                    { name: "Bancos", icon: "bank" },
                    { name: "Excel", icon: "excel" },
                    { name: "PMS", icon: "system" },
                    { name: "Sistema contable", icon: "system" },
                  ]}
                />

                <AcquisitionFAQ />
              </div>

              <div className="hidden lg:block">
                <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto">
                  <RegistrationForm highlightForm={highlightForm} timeLeft={timeLeft} pagePath="/hoteles" />
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
