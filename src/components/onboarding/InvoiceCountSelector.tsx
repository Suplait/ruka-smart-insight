
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
  const getInvoiceRangeText = (count: number) => {
    if (count <= 50) return "Pocas facturas";
    if (count <= 150) return "Volumen moderado";
    if (count <= 300) return "Volumen alto";
    if (count <= 500) return "Volumen muy alto";
    return "Volumen empresarial";
  };

  const formatInvoiceCount = (count: number) => {
    if (count >= 1000) return "+1.000";
    if (count >= 500) return "+500";
    return count.toString();
  };

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
          <h3 className="text-xl font-semibold mb-2">{formatInvoiceCount(selectedCount)} facturas/mes</h3>
          <p className="text-sm text-muted-foreground mb-4">{getInvoiceRangeText(selectedCount)}</p>
        </div>

        <div className="px-4">
          <Slider 
            value={[selectedCount]} 
            onValueChange={value => onChange(value[0])} 
            max={1000} 
            min={1} 
            step={5} 
            className="w-full" 
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>1</span>
            <span>500</span>
            <span>+1.000</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceCountSelector;
