
import React from 'react';
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import CalendlySuccessContent from "@/components/calendly/CalendlySuccessContent";

const CalendlySuccess = () => {
  return (
    <>
      <Helmet>
        <title>¡Cita agendada! | Ruka.ai</title>
      </Helmet>
      
      <main className="min-h-screen flex flex-col md:flex-row relative">
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-slate-50 to-blue-50 p-8 flex-col overflow-hidden">
          <div className="max-w-md mx-auto flex-1">
            <div className="h-full flex flex-col justify-center">
              <div className="w-auto h-10 relative">
                <img 
                  src="/logo.png" 
                  alt="Ruka.ai" 
                  className="h-10 w-auto object-contain object-left"
                />
              </div>
              <h2 className="text-3xl font-bold mb-4 mt-6">¡Cita agendada con éxito!</h2>
              <p className="text-slate-600 mb-6">
                Has reservado tu cita para conocer más sobre cómo Ruka.ai puede automatizar 
                y optimizar los procesos de tu negocio.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 8v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8"></path>
                      <path d="m9 11 3 3 3-3"></path>
                      <path d="M12 16V4"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">Automatizamos tus flujos de trabajo</h3>
                    <p className="text-slate-600">Con IA, automatizamos la clasificación de tus transacciones para que te enfoques en lo importante.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6"></path>
                      <path d="M16 2H8v4h8V2Z"></path>
                      <path d="M12 14v-4"></path>
                      <path d="M9 11h6"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">Todo personalizado a tu negocio</h3>
                    <p className="text-slate-600">Adaptamos nuestra tecnología a las necesidades específicas de tu negocio.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex-1 flex items-center justify-center p-6 md:p-12 bg-white">
          <div className="w-full max-w-md">
            <div className="md:hidden mb-8 flex flex-col items-center text-center">
              <div className="w-auto h-10 relative">
                <img 
                  src="/logo.png" 
                  alt="Ruka.ai" 
                  className="h-10 w-auto object-contain" 
                />
              </div>
              <h1 className="text-2xl font-bold mb-2 mt-4">¡Cita agendada!</h1>
              <p className="text-slate-600 text-sm mb-6">
                Es obligatorio que nos hables por WhatsApp para poder realizar la reunión.
              </p>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.5 }}
            >
              <Card className="border shadow-md">
                <CardContent className="pt-10 pb-10">
                  <CalendlySuccessContent />
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
    </>
  );
};

export default CalendlySuccess;
