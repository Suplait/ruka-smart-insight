
import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import AutomationFeatures from '@/components/restaurant/AutomationFeatures';
import SimpleConnection from '@/components/restaurant/SimpleConnection';
import CompactImpactStats from '@/components/restaurant/CompactImpactStats';
import Partners from '@/components/Partners';

interface LeftSideContentProps {
  currentStep: number;
  isComplete: boolean;
}

const LeftSideContent = ({ currentStep, isComplete }: LeftSideContentProps) => {
  const getLeftSideContent = () => {
    switch (currentStep) {
      case 1: // Billing system (was case 0)
        return (
          <motion.div 
            key="simple-connection" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            transition={{ duration: 0.5 }} 
            className="flex flex-col h-full items-center justify-center"
          >
            <SimpleConnection />
          </motion.div>
        );
      case 2: // Subdomain (was case 1)
        return (
          <motion.div 
            key="impact-stats" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            transition={{ duration: 0.5 }} 
            className="flex flex-col h-full items-center justify-center"
          >
            <CompactImpactStats />
          </motion.div>
        );
      case 3: // SII credentials (was case 2)
      default:
        return (
          <motion.div 
            key="social-proof" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            transition={{ duration: 0.5 }} 
            className="flex flex-col h-full justify-center"
          >
            <div className="max-w-md mx-auto flex flex-col items-center justify-center text-center">
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.5 }} 
                className="mb-10"
              >
                <div className="mb-6">
                  <h1 className="text-3xl font-bold text-slate-900">
                    Controla tu margen al día sin esfuerzo
                  </h1>
                </div>
                <p className="text-lg text-slate-600 max-w-md mx-auto">
                  Agentes con IA que procesan, agrupan y monitorean tus transacciones para que tengas control absoluto de tu negocio.
                </p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.5, delay: 0.3 }} 
                className="relative w-full max-w-md aspect-video rounded-xl overflow-hidden shadow-xl border border-white/80 mb-2"
              >
                <iframe 
                  width="100%" 
                  height="100%" 
                  src="https://www.youtube.com/embed/1wV-corpO74" 
                  title="CEO de Ruka.ai hablando sobre la plataforma" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen 
                  className="w-full h-full"
                ></iframe>
              </motion.div>
              
              <div className="mt-2 mb-6 flex justify-center">
                <a 
                  href="https://www.youtube.com/watch?v=1wV-corpO74" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-sm text-primary flex items-center gap-1 hover:underline"
                >
                  <ExternalLink className="w-3 h-3" />
                  Seguir escuchando en otra pestaña
                </a>
              </div>
              
              <Partners />
            </div>
          </motion.div>
        );
    }
  };

  return getLeftSideContent();
};

export default LeftSideContent;
