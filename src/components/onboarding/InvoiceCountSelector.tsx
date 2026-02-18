
import React from 'react';
import { Info, Sparkles } from 'lucide-react';
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

interface InvoiceCountSelectorProps {
  selectedCount: number;
  onChange: (count: number) => void;
}

const InvoiceCountSelector = ({
  selectedCount,
  onChange
}: InvoiceCountSelectorProps) => {
  // Define los 4 rangos con sus valores promedio para la base de datos
  const ranges = [
    { label: "Menos de 150 facturas", value: 75 },
    { label: "150 a 300 facturas", value: 225 },
    { label: "300 a 600 facturas", value: 450 },
    { label: "Más de 600 facturas", value: 750 }
  ];

  // Encontrar el rango actual basado en el valor seleccionado
  const getCurrentRangeIndex = (value: number) => {
    return ranges.findIndex(range => range.value === value);
  };

  const handleSliderChange = (value: number[]) => {
    const rangeIndex = value[0];
    onChange(ranges[rangeIndex].value);
  };

  const currentRangeIndex = getCurrentRangeIndex(selectedCount);
  const displayIndex = currentRangeIndex >= 0 ? currentRangeIndex : 0;
  const compactRangeLabels = ["<150", "150-300", "300-600", ">600"];

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-primary/20 bg-primary/[0.06] p-3.5">
        <div className="flex gap-3">
          <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-white text-primary shadow-sm">
            <Info className="h-4 w-4" />
          </div>
          <div>
            <h4 className="mb-1 text-sm font-semibold text-slate-900">¿Por qué te pedimos este dato?</h4>
            <p className="text-[13px] leading-relaxed text-slate-600">
              El volumen de facturas determina la configuración ideal de tu plataforma.
              Si no estás seguro del número exacto, puedes poner un aproximado.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_18px_35px_-28px_rgba(77,104,235,0.55)]">
        <div className="text-center">
          <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            Selección actual
          </div>
          <h3 className="mb-1 text-xl font-semibold tracking-tight text-slate-900">{ranges[displayIndex].label}</h3>
          <p className="text-xs text-slate-500">Mueve el selector para ajustar tu rango mensual.</p>
        </div>

        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3.5">
          <Slider
            value={[displayIndex]}
            onValueChange={handleSliderChange}
            max={3}
            min={0}
            step={1}
            className="w-full"
          />
          <div className="mt-3.5 grid grid-cols-4 gap-1.5 text-center">
            {compactRangeLabels.map((label, index) => (
              <button
                key={label}
                type="button"
                onClick={() => onChange(ranges[index].value)}
                className={cn(
                  "rounded-lg border px-2 py-1.5 text-[11px] font-medium transition-colors",
                  displayIndex === index
                    ? "border-primary/30 bg-primary/10 text-primary"
                    : "border-slate-200 bg-white text-slate-500 hover:border-primary/25 hover:text-primary"
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceCountSelector;
