
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

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
  onCustomChange,
}: BillingSystemSelectorProps) => {
  const systems = [
    { id: "sii", name: "SII", icon: "/logosii.png" },
    { id: "custom", name: "Otro sistema", icon: null },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {systems.map((system) => (
          <Card
            key={system.id}
            className={`p-4 cursor-pointer transition-all ${
              selectedSystem === system.id
                ? "border-primary border-2"
                : "hover:border-primary/50"
            }`}
            onClick={() => onChange(system.id)}
          >
            <div className="flex items-center gap-3">
              {system.icon && (
                <img src={system.icon} alt={system.name} className="h-8" />
              )}
              <div className="text-lg font-medium">{system.name}</div>
            </div>
          </Card>
        ))}
      </div>

      {selectedSystem === "custom" && (
        <div className="pt-4">
          <Input
            value={customSystem}
            onChange={(e) => onCustomChange(e.target.value)}
            placeholder="¿Qué sistema usas?"
            className="max-w-md"
          />
        </div>
      )}
    </div>
  );
};

export default BillingSystemSelector;
