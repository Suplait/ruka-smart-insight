
import { Input } from "@/components/ui/input";

interface SubdomainInputProps {
  value: string;
  onChange: (value: string) => void;
  suggestedSubdomain: string;
}

const SubdomainInput = ({ value, onChange, suggestedSubdomain }: SubdomainInputProps) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2">
        <div className="flex items-center">
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={suggestedSubdomain}
            className="rounded-r-none"
          />
          <div className="bg-muted px-3 py-2 rounded-r-md border border-l-0 border-input">
            .ruka.ai
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Este será tu subdominio personalizado para acceder a la plataforma
        </p>
      </div>
    </div>
  );
};

export default SubdomainInput;
