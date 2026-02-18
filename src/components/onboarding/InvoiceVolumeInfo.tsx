
import React from 'react';
import { motion } from 'framer-motion';
import { Layers3, Gauge, ShieldCheck, Workflow } from 'lucide-react';

const InvoiceVolumeInfo = () => {
  const onboardingPillars = [
    {
      title: "Diagnóstico inicial",
      description: "Identificamos el nivel de configuración que necesitas.",
      icon: Layers3,
    },
    {
      title: "Flujo optimizado",
      description: "Asignamos el camino más eficiente para tu volumen.",
      icon: Workflow,
    },
    {
      title: "Salida productiva",
      description: "Partes con una base estable y lista para operar.",
      icon: ShieldCheck,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="mx-auto flex h-full w-full max-w-md items-center"
    >
      <div className="w-full rounded-3xl border border-primary/20 bg-white/80 p-5 shadow-[0_22px_45px_-32px_rgba(77,104,235,0.55)] backdrop-blur">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-primary">
              Onboarding inteligente
            </span>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900">
              Un solo dato define tu ruta ideal
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Con la cantidad de facturas activamos el flujo correcto sin fricción ni pasos innecesarios.
            </p>
          </div>
          <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground sm:flex">
            <Gauge className="h-5 w-5" />
          </div>
        </div>

        <div className="space-y-2.5">
          {onboardingPillars.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, delay: 0.08 * (index + 1) }}
                className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2.5"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                  <p className="text-xs text-slate-500">{item.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        <p className="mt-4 rounded-xl border border-primary/15 bg-primary/[0.06] px-3 py-2 text-xs text-slate-600">
          Si no conoces el número exacto, elige un aproximado y luego lo ajustamos.
        </p>
      </div>
    </motion.div>
  );
};

export default InvoiceVolumeInfo;
