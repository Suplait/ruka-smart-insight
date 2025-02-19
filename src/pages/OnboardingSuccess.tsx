
import { Helmet } from "react-helmet";
import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function OnboardingSuccess() {
  return (
    <>
      <Helmet>
        <title>¡Registro Exitoso! | Ruka.ai</title>
      </Helmet>
      
      <main className="min-h-screen">
        <Navbar />
        
        <div className="container px-4 py-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto text-center space-y-8"
          >
            <div className="flex justify-center">
              <CheckCircle2 className="w-24 h-24 text-green-500" />
            </div>
            
            <h1 className="text-4xl font-bold">¡Gracias por Registrarte!</h1>
            
            <p className="text-xl text-muted-foreground">
              Hemos recibido tu información correctamente. Nuestro equipo te contactará a la brevedad 
              para comenzar con tu proceso de onboarding y ayudarte a optimizar los costos de tu restaurante.
            </p>

            <div className="bg-muted/50 p-6 rounded-lg">
              <p className="text-muted-foreground">
                Si tienes alguna pregunta mientras tanto, puedes escribirnos a{' '}
                <a href="mailto:contacto@ruka.ai" className="text-primary hover:underline">
                  contacto@ruka.ai
                </a>
              </p>
            </div>
          </motion.div>
        </div>

        <Footer />
      </main>
    </>
  );
}
