
import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Zap } from 'lucide-react';

const InvoiceVolumeInfo = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5 }} 
      className="max-w-md mx-auto text-center"
    >
      <div className="mb-8">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-6">
          <BarChart3 className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-4">
          Optimización basada en tu volumen
        </h2>
        <p className="text-lg text-slate-600">
          Configuramos tu plataforma según el volumen de facturas que manejas para darte la mejor experiencia posible.
        </p>
      </div>

      <div className="space-y-4">
        <motion.div 
          initial={{ opacity: 0, x: -20 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm border"
        >
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
            <Zap className="w-6 h-6 text-green-600" />
          </div>
          <div className="text-left">
            <h4 className="font-semibold text-slate-900">Procesamiento automático</h4>
            <p className="text-sm text-slate-600">Análisis inteligente de todas tus facturas</p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: -20 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm border"
        >
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-blue-600" />
          </div>
          <div className="text-left">
            <h4 className="font-semibold text-slate-900">Insights en tiempo real</h4>
            <p className="text-sm text-slate-600">Métricas y alertas personalizadas</p>
          </div>
        </motion.div>
      </div>

      <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
        <p className="text-sm text-slate-600">
          <strong>¿No estás seguro del número exacto?</strong><br />
          No te preocupes, puedes poner un aproximado. Siempre podremos ajustar la configuración más adelante.
        </p>
      </div>
    </motion.div>
  );
};

export default InvoiceVolumeInfo;
