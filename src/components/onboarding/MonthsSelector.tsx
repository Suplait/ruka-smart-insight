
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface MonthsSelectorProps {
  selectedMonths: number;
  onChange: (months: number) => void;
}

const MonthsSelector = ({ selectedMonths, onChange }: MonthsSelectorProps) => {
  const options = [
    { value: 3, label: "3 meses" },
    { value: 6, label: "6 meses" },
    { value: 12, label: "12 meses" }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {options.map((option) => (
        <Card
          key={option.value}
          className={`p-4 cursor-pointer transition-all ${
            selectedMonths === option.value
              ? "border-primary border-2"
              : "hover:border-primary/50"
          }`}
          onClick={() => onChange(option.value)}
        >
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{option.value}</div>
            <div className="text-sm text-muted-foreground">meses</div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default MonthsSelector;
