
import React from 'react';
import { motion } from 'framer-motion';

const InvoiceVolumeInfo = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="mx-auto flex h-full w-full max-w-md items-center justify-center"
    >
      <div className="w-full rounded-3xl border border-primary/15 bg-white/80 p-3 shadow-[0_20px_40px_-28px_rgba(77,104,235,0.5)]">
        <img
          src="/rukito-facturas-flat-pro.jpg"
          alt="Asistente de facturas"
          className="w-full rounded-2xl object-contain"
          loading="eager"
        />
      </div>
    </motion.div>
  );
};

export default InvoiceVolumeInfo;
