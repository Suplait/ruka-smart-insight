import React from 'react';
import { Info, Receipt } from 'lucide-react';
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
    if (count <= 100) return "Volumen moderado";
    if (count <= 150) return "Volumen alto";
    return "Volumen muy alto";
  };
  const getRecommendationText = (count: number) => {
    if (count > 150) {
      return "Con este volumen, te recomendamos agendar una llamada personalizada para configurar tu plataforma de manera óptima.";
    }
    return "Perfecto, podemos configurar tu plataforma automáticamente en los siguientes pasos.";
  };
  return <div className="space-y-6">
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
          <div className="inline-flex items-center gap-2 mb-4">
            <Receipt className="w-6 h-6 text-primary" />
            <h3 className="text-2xl font-bold">{selectedCount}</h3>
            <span className="text-lg text-muted-foreground">facturas/mes</span>
          </div>
          <p className="text-sm text-muted-foreground mb-2">{getInvoiceRangeText(selectedCount)}</p>
        </div>

        <div className="px-4">
          <Slider value={[selectedCount]} onValueChange={value => onChange(value[0])} max={500} min={1} step={5} className="w-full" />
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>1</span>
            <span>150</span>
            <span>500+</span>
          </div>
        </div>

        
      </div>
    </div>;
};
export default InvoiceCountSelector;