
import { motion } from "framer-motion";
import { ArrowRight, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function MoneyBackGuarantee() {
  const navigate = useNavigate();
  
  return (
    <section id="guarantee" className="py-32 bg-gradient-to-b from-white via-[#f7f9fc] to-white relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-10 right-[15%] h-36 w-36 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.15),transparent_70%)] blur-2xl" />
        <div className="absolute bottom-0 left-1/2 h-40 w-[90%] -translate-x-1/2 bg-gradient-to-t from-white via-white/70 to-transparent" />
      </div>
      <div className="max-w-3xl mx-auto px-6 sm:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-8"
        >
          <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-primary/10 mb-6">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-thin text-gray-900 tracking-tight">
            Garantía de devolución de{" "}
            <span className="font-light bg-gradient-to-r from-primary via-primary to-primary/80 bg-clip-text text-transparent">
              30 días
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 font-light">
            Si no estás 100% satisfecho con Ruka.ai en los primeros 30 días, te devolvemos tu dinero sin hacer preguntas. Así de seguros estamos de que te encantará.
          </p>
          
          <Button 
            size="sm" 
            className="h-10 px-6 text-sm font-medium bg-primary hover:bg-primary/90 rounded-full gap-2 group"
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
