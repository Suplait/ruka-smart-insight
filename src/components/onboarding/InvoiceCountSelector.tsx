
import React from 'react';
import { Info } from 'lucide-react';
import { Slider } from "@/components/ui/slider";

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

  return (
    <div className="space-y-6">
      <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
        <div className="flex gap-3">
          <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-1" />
          <div>
            <h4 className="font-medium text-blue-700 mb-1">¿Por qué necesitamos esto?</h4>
            <p className="text-sm text-blue-600">
              El volumen de facturas determina la configuración óptima de tu plataforma. 
              Si no estás seguro del número exacto, puedes poner un aproximado.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-2">{ranges[displayIndex].label}</h3>
        </div>

        <div className="px-4">
          <Slider 
            value={[displayIndex]} 
            onValueChange={handleSliderChange} 
            max={3} 
            min={0} 
            step={1} 
            className="w-full" 
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>&lt;150</span>
            <span>150-300</span>
            <span>300-600</span>
            <span>&gt;600</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceCountSelector;
