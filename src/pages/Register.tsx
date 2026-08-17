import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RegistrationForm from "@/components/restaurant/RegistrationForm";
import { useIsMobile } from "@/hooks/use-mobile";
import { AcquisitionFAQ } from "@/components/acquisition/AcquisitionFAQ";
import { AcquisitionSeo } from "@/components/acquisition/AcquisitionSeo";
import acquisitionSeo from "@/content/acquisitionSeo.json";
import { ReviewRegistrationForm } from "@/components/onboarding-v2/ReviewRegistrationForm";
import { isOnboardingDebugEnabledFromSearch } from "@/utils/onboardingDebug";
import {
  AcquisitionHero,
  AcquisitionProcessSection,
  AcquisitionSystemNote,
} from "@/components/acquisition/AcquisitionSections";

function RegisterProduction() {
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
      <AcquisitionSeo {...acquisitionSeo.register} />

      <main className="min-h-screen bg-[#f7f8fc] text-[#171827]">
        <Navbar primaryAction={{ label: "Agendar 20 min", path: "/register", onClick: scrollToForm }} />

        <div className="w-full pb-16 pt-24 sm:pt-28">
          <div className="container px-4 sm:px-6">
            <div className="lg:grid lg:grid-cols-[minmax(0,1fr),460px] lg:gap-14 xl:gap-20">
              <div className="space-y-20 py-10 sm:py-14 lg:space-y-28 lg:py-20">
                <AcquisitionHero
                  eyebrow="Agentes IA para trabajo operativo"
                  title="Cuéntanos qué trabajo quieres sacar de tu equipo."
                  description="Revisamos el proceso, los sistemas que toca y dónde Ruka puede hacerse cargo del trabajo manual."
                  outcomes={[
                    { label: "Compras registradas" },
                    { label: "Conciliaciones ejecutadas" },
                    { label: "Sistemas actualizados" },
                  ]}
                  onCtaClick={scrollToForm}
                />

                <AcquisitionProcessSection
                  title="Qué revisamos contigo"
                  steps={[
                    { title: "El proceso", description: "Qué hace hoy tu equipo manualmente." },
                    { title: "Los sistemas", description: "Dónde vive la información y dónde tiene que quedar." },
                    {
                      title: "Qué puede hacer Ruka",
                      description: "Qué parte del flujo podemos ejecutar y cómo partir.",
                    },
                  ]}
                />

                <AcquisitionSystemNote
                  title="Tus sistemas siguen siendo los mismos."
                  description="Ruka se ocupa del trabajo repetitivo entre ellos, con las reglas que usa tu operación."
                />

                <div id="mobile-form-section" className="lg:hidden w-full mb-8">
                  <RegistrationForm highlightForm={highlightForm} timeLeft={timeLeft} pagePath="/register" />
                </div>

                <AcquisitionFAQ />
              </div>

              <div className="hidden lg:block">
                <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto">
                  <RegistrationForm highlightForm={highlightForm} timeLeft={timeLeft} pagePath="/register" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <Footer />

        {showScrollToForm && (
          <motion.div initial={{
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
          </motion.div>
        )}
      </main>
    </>
  );
}

export default function Register() {
  const location = useLocation();

  if (isOnboardingDebugEnabledFromSearch(location.search)) {
    return <ReviewRegistrationForm />;
  }

  return <RegisterProduction />;
}
