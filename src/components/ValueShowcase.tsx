
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ValueHighlights from "./ValueHighlights";
import { useTranslation } from "react-i18next";

export default function ValueShowcase() {
  const { t } = useTranslation();
  
  return (
    <section className="py-24">
      <div className="container px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 lg:gap-24 items-center mb-24">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <h2 className="text-4xl font-bold">
                {t('home.value_proposition.title')}
              </h2>
              <p className="text-xl text-muted-foreground">
                {t('home.value_proposition.subtitle')}
              </p>
              <div>
                <Button 
                  variant="outline" 
                  className="gap-2"
                  onClick={() => window.open('https://calendly.com/suplait_lorenzo/30min', '_blank')}
                >
                  {t('navbar.schedule_demo')}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
            <ValueHighlights />
          </div>
        </div>
      </div>
    </section>
  );
}
