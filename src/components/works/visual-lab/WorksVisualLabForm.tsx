import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { WorksVisualLabState } from "@/components/works/visual-lab/visualLabTypes";

type LabLead = {
  name: string;
  company: string;
  email: string;
};

type FieldErrors = Partial<Record<keyof LabLead, string>>;

const inputClass = "mt-2 h-12 rounded-lg border-[#cfd4df] bg-white px-4 text-base text-[#242634] shadow-none placeholder:text-[#747b8b] focus-visible:ring-[#5369eb]";

function isValidLead(value: LabLead) {
  return value.name.trim().length >= 2
    && value.company.trim().length >= 2
    && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email.trim());
}

export function WorksVisualLabForm({
  onVisualStateChange,
  onUserInteraction,
  onSimulatedSubmit,
}: {
  onVisualStateChange: (state: WorksVisualLabState) => void;
  onUserInteraction: () => void;
  onSimulatedSubmit: () => void;
}) {
  const [value, setValue] = useState<LabLead>({ name: "", company: "", email: "" });
  const [focusedField, setFocusedField] = useState<keyof LabLead | null>(null);
  const [errors, setErrors] = useState<FieldErrors>({});

  useEffect(() => {
    if (isValidLead(value)) onVisualStateChange("valid");
    else if (focusedField) onVisualStateChange("focus");
    else onVisualStateChange("idle");
  }, [focusedField, onVisualStateChange, value]);

  const update = (field: keyof LabLead, fieldValue: string) => {
    onUserInteraction();
    setValue((current) => ({ ...current, [field]: fieldValue }));
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: FieldErrors = {};
    if (value.name.trim().length < 2) nextErrors.name = "Ingresa tu nombre.";
    if (value.company.trim().length < 2) nextErrors.company = "Ingresa el nombre de tu empresa.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email.trim())) nextErrors.email = "Ingresa un email de trabajo válido.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) onSimulatedSubmit();
  };

  return (
    <form id="works-visual-lab-form" onSubmit={handleSubmit} noValidate className="rounded-2xl border border-[#d8dde6] bg-white p-5 sm:p-7 lg:p-8">
      <div className="grid gap-5">
        <LabField label="Nombre" id="works-lab-name" error={errors.name}>
          <Input
            id="works-lab-name"
            autoComplete="off"
            value={value.name}
            onFocus={() => { onUserInteraction(); setFocusedField("name"); }}
            onBlur={() => setFocusedField((current) => current === "name" ? null : current)}
            onChange={(event) => update("name", event.target.value)}
            maxLength={120}
            placeholder="Tu nombre"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "works-lab-name-error" : undefined}
            className={inputClass}
          />
        </LabField>

        <LabField label="Empresa" id="works-lab-company" error={errors.company}>
          <Input
            id="works-lab-company"
            autoComplete="off"
            value={value.company}
            onFocus={() => { onUserInteraction(); setFocusedField("company"); }}
            onBlur={() => setFocusedField((current) => current === "company" ? null : current)}
            onChange={(event) => update("company", event.target.value)}
            maxLength={160}
            placeholder="Nombre de la empresa"
            aria-invalid={Boolean(errors.company)}
            aria-describedby={errors.company ? "works-lab-company-error" : undefined}
            className={inputClass}
          />
        </LabField>

        <LabField label="Email de trabajo" id="works-lab-email" error={errors.email}>
          <Input
            id="works-lab-email"
            type="email"
            autoComplete="off"
            value={value.email}
            onFocus={() => { onUserInteraction(); setFocusedField("email"); }}
            onBlur={() => setFocusedField((current) => current === "email" ? null : current)}
            onChange={(event) => update("email", event.target.value)}
            maxLength={254}
            placeholder="tu@empresa.com"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "works-lab-email-error" : undefined}
            className={inputClass}
          />
        </LabField>
      </div>

      <button
        type="submit"
        className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 whitespace-nowrap rounded-full bg-[#5369eb] px-6 text-sm font-semibold text-white transition-[background-color,transform] duration-150 hover:bg-[#465bda] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5369eb] focus-visible:ring-offset-4 sm:w-auto"
      >
        Ver horarios <ArrowRight className="h-4 w-4" />
      </button>
    </form>
  );
}

function LabField({
  label,
  id,
  error,
  children,
}: {
  label: string;
  id: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-semibold text-[#303241]">
        {label} <span className="text-[#5369eb]">*</span>
      </label>
      {children}
      {error ? <p id={`${id}-error`} role="alert" className="mt-2 text-sm font-medium text-[#a53d50]">{error}</p> : null}
    </div>
  );
}
