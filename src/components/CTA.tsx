
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function CTA() {
  const { t } = useTranslation();
  
  return (
    <section className="py-24 bg-gradient-to-br from-primary/5 to-primary/20">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="container text-center space-y-8"
      >
        <h2 className="text-3xl md:text-4xl font-bold">
          {t('home.cta.title')}
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          {t('home.cta.subtitle')}
        </p>
        <div className="pt-4">
          <Button 
            size="lg" 
            className="gap-2"
            onClick={() => window.open('https://calendly.com/suplait_lorenzo/30min', '_blank')}
          >
            {t('home.cta.button')}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>
    </section>
  );
}
