
import React from 'react';
import { Info } from 'lucide-react';

interface MonthsSelectorProps {
  selectedMonths: number;
  onChange: (months: number) => void;
}

const MonthsSelector = ({
  selectedMonths,
  onChange
}: MonthsSelectorProps) => {
  return (
    <div className="space-y-6">
      <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
        <div className="flex gap-3">
          <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-1" />
          <div>
            <h4 className="font-medium text-blue-700 mb-1">¿Por qué necesitamos esto?</h4>
            <p className="text-sm text-blue-600">
              Selecciona el período de datos históricos que importaremos para análisis.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3].map(month => (
          <button 
            key={month} 
            type="button" 
            id={`months-selector-${month}`} 
            onClick={() => onChange(month)} 
            className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center ${
              selectedMonths === month 
                ? "border-primary bg-primary/5" 
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <span className="text-2xl font-semibold">{month}</span>
            <span className="text-sm text-muted-foreground">
              {month === 1 ? "mes" : "meses"}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MonthsSelector;
