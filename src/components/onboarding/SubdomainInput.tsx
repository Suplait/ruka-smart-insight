
import React, { useState, useEffect } from 'react';
import { Info, Check, Loader } from 'lucide-react';
import { Input } from "@/components/ui/input";

interface SubdomainInputProps {
  value: string;
  onChange: (value: string) => void;
  suggestedSubdomain: string;
}

const SubdomainInput = ({
  value,
  onChange,
  suggestedSubdomain
}: SubdomainInputProps) => {
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  
  useEffect(() => {
    if (!value) return;
    setIsChecking(true);
    setIsAvailable(false);
    const timer = setTimeout(() => {
      setIsChecking(false);
      setIsAvailable(true);
    }, 800);
    return () => clearTimeout(timer);
  }, [value]);
  
  return (
    <div className="space-y-6">
      <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
        <div className="flex gap-3">
          <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-1" />
          <div>
            <h4 className="font-medium text-blue-700 mb-1">Tu portal personalizado</h4>
            <p className="text-sm text-blue-600">
              Este será el enlace de acceso exclusivo a tu plataforma.
            </p>
          </div>
        </div>
      </div>

      <div>
        <div className="relative">
          <Input 
            id="subdomain-input" 
            value={value} 
            onChange={e => onChange(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))} 
            placeholder="tu-empresa" 
            className="pr-[120px]" 
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
            .ruka.ai
          </div>
        </div>
        
        <div className="mt-2 text-sm text-muted-foreground">
          Sugerencia basada en el nombre de tu empresa.
        </div>
        
        <div className="mt-2 text-sm">
          {isChecking ? (
            <span className="text-amber-600 flex items-center gap-1">
              <Loader className="w-4 h-4 animate-spin" /> Comprobando disponibilidad...
            </span>
          ) : isAvailable ? (
            <span className="text-green-600 flex items-center gap-1">
              <Check className="w-4 h-4" /> Subdominio disponible
            </span>
          ) : (
            <span className="text-red-600 flex items-center gap-1">
              <span className="w-4 h-4">✖</span> Subdominio no disponible
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubdomainInput;
