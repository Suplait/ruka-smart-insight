
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    quote: "Ruka.ai ha transformado nuestra operación financiera reduciendo el tiempo de procesamiento en un 70%.",
    author: "María González",
    company: "Directora Financiera, Global Services",
    rating: 5
  },
  {
    quote: "La inteligencia artificial de Ruka me permite tomar decisiones estratégicas basadas en datos reales y actualizados.",
    author: "Carlos Mendoza",
    company: "CEO, Importadora Nacional",
    rating: 5
  },
  {
    quote: "El valor que obtenemos al automatizar nuestros registros contables con Ruka.ai supera con creces nuestra inversión.",
    author: "Ana Martínez",
    company: "CFO, TechSolutions",
    rating: 5
  }
];

export default function OnboardingTestimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-[180px] w-full bg-white/40 backdrop-blur-sm rounded-xl p-6 shadow-sm">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="h-full flex flex-col justify-between"
        >
          <div className="flex gap-1 mb-2">
            {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          
          <p className="text-sm italic text-slate-700 flex-1">
            "{testimonials[currentIndex].quote}"
          </p>
          
          <div className="mt-4">
            <p className="font-medium text-sm text-slate-900">{testimonials[currentIndex].author}</p>
            <p className="text-xs text-slate-500">{testimonials[currentIndex].company}</p>
          </div>
        </motion.div>
      </AnimatePresence>
      
      <div className="absolute bottom-3 right-4 flex gap-1">
        {testimonials.map((_, index) => (
          <div 
            key={index}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
              index === currentIndex ? "bg-primary w-3" : "bg-slate-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
