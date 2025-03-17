
import React from 'react';
import { Info } from 'lucide-react';
import { Input } from "@/components/ui/input";

interface BillingSystemSelectorProps {
  selectedSystem: string;
  onChange: (system: string) => void;
  customSystem: string;
  onCustomChange: (value: string) => void;
}

const BillingSystemSelector = ({
  selectedSystem,
  onChange,
  customSystem,
  onCustomChange
}: BillingSystemSelectorProps) => {
  return (
    <div className="space-y-6">
      <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
        <div className="flex gap-3">
          <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-1" />
          <div>
            <h4 className="font-medium text-blue-700 mb-1">¿Por qué es importante?</h4>
            <p className="text-sm text-blue-600">
              Conectaremos tu sistema de facturación para automatizar tu gestión.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button 
          type="button" 
          id="system-selector-sii" 
          onClick={() => onChange("sii")} 
          className={`p-4 rounded-lg border-2 transition-all text-left ${
            selectedSystem === "sii" 
              ? "border-primary bg-primary/5" 
              : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <div className="font-medium">SII Gratuito</div>
          <div className="text-sm text-muted-foreground">Sistema oficial del SII</div>
        </button>
        
        <button 
          type="button" 
          id="system-selector-mercado" 
          onClick={() => onChange("mercado")} 
          className={`p-4 rounded-lg border-2 transition-all text-left ${
            selectedSystem === "mercado" 
              ? "border-primary bg-primary/5" 
              : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <div className="font-medium">Facturador de Mercado</div>
          <div className="text-sm text-muted-foreground">Sistema de terceros</div>
        </button>
      </div>
      
      {selectedSystem === "mercado" && (
        <div className="mt-4 p-4 rounded-lg border border-gray-200 bg-gray-50">
          <label className="text-sm font-medium mb-2 block">¿Cuál sistema utilizas?</label>
          <Input 
            id="custom-system-input" 
            value={customSystem} 
            onChange={e => onCustomChange(e.target.value)} 
            placeholder="Nubox, Bsale, Toteat, etc." 
            className="bg-white" 
          />
          <div className="mt-2 flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground">
              Si no estás seguro o no sabes el nombre exacto, puedes escribir una descripción o dejarlo en blanco. 
              Nuestro equipo se pondrá en contacto contigo para ayudarte a identificarlo correctamente.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillingSystemSelector;
