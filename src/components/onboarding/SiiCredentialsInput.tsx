
import React from 'react';
import { Info, ShieldCheck } from 'lucide-react';
import { Input } from "@/components/ui/input";

interface SiiCredentialsInputProps {
  rut: string;
  clave: string;
  onRutChange: (value: string) => void;
  onClaveChange: (value: string) => void;
}

const SiiCredentialsInput = ({
  rut,
  clave,
  onRutChange,
  onClaveChange
}: SiiCredentialsInputProps) => {
  return (
    <div className="space-y-6">
      <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
        <div className="flex gap-3">
          <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-1" />
          <div>
            <h4 className="font-medium text-blue-700 mb-1">Conexión Segura con el SII</h4>
            <p className="text-sm text-blue-600">
              Ingresa tus credenciales para importar automáticamente tus facturas de compra y venta.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">RUT Empresa</label>
          <Input 
            id="rut-input" 
            value={rut} 
            onChange={e => onRutChange(e.target.value)} 
            placeholder="12345678-9" 
          />
          <p className="text-xs text-muted-foreground">Ingresa el RUT con guión y dígito verificador</p>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Clave del SII</label>
          <Input 
            id="sii-password-input" 
            type="password" 
            value={clave} 
            onChange={e => onClaveChange(e.target.value)} 
            placeholder="••••••••" 
          />
          <div className="flex items-center text-xs text-muted-foreground mt-1">
            <ShieldCheck className="w-4 h-4 mr-1 text-green-600" />
            Tus datos están almacenados de forma segura
          </div>
        </div>
      </div>
    </div>
  );
};

export default SiiCredentialsInput;
