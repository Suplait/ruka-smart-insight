
import { motion } from "framer-motion";
import { ArrowRight, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function MoneyBackGuarantee() {
  const navigate = useNavigate();
  
  return (
    <section id="guarantee" className="py-16 bg-gradient-to-b from-white via-primary/5 to-white">
      <div className="container px-4 sm:px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto text-center space-y-8"
        >
          <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-primary/10 mb-6">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          
          <h2 className="text-3xl font-bold">
            Garantía de devolución de 30 días
          </h2>
          
          <p className="text-xl text-muted-foreground">
            Si no estás 100% satisfecho con Ruka.ai en los primeros 30 días, te devolvemos tu dinero sin hacer preguntas. Así de seguros estamos de que te encantará.
          </p>
          
          <Button 
            size="lg" 
            className="gap-2 group"
            onClick={() => navigate('/register')}
          >
            Regístrate
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
