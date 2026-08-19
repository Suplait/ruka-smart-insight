import { useEffect, useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { WorksLeadData } from "@/content/worksContent";
import type { WorksVisualState } from "@/components/works/WorksVolumetricEnvironment";

type FieldErrors = Partial<Record<keyof WorksLeadData | "form", string>>;

function FieldError({ id, error }: { id: string; error?: string }) {
  return error ? <p id={id} role="alert" className="mt-2 text-sm font-medium text-[#a53d50]">{error}</p> : null;
}

const inputClass = "mt-2 h-12 rounded-lg border-[#cfd4df] bg-white px-4 text-base text-[#242634] shadow-none placeholder:text-[#747b8b] focus-visible:ring-[#5369eb]";

export function WorksContactForm({
  value,
  onChange,
  onContinue,
  onVisualStateChange,
}: {
  value: WorksLeadData;
  onChange: React.Dispatch<React.SetStateAction<WorksLeadData>>;
  onContinue: (value: WorksLeadData) => Promise<void>;
  onVisualStateChange?: (state: WorksVisualState) => void;
}) {
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState<keyof WorksLeadData | null>(null);

  useEffect(() => {
    const valid = value.name.trim().length >= 2
      && value.company.trim().length >= 2
      && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email.trim());

    if (valid) onVisualStateChange?.("valid");
    else if (focusedField) onVisualStateChange?.(focusedField);
    else onVisualStateChange?.("idle");
  }, [focusedField, onVisualStateChange, value]);

  const update = <K extends keyof WorksLeadData>(field: K, fieldValue: WorksLeadData[K]) => {
    onChange((current) => ({ ...current, [field]: fieldValue }));
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined, form: undefined }));
  };

  const validate = () => {
    const next: FieldErrors = {};
    if (value.name.trim().length < 2) next.name = "Ingresa tu nombre.";
    if (value.company.trim().length < 2) next.company = "Ingresa el nombre de tu empresa.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email.trim())) next.email = "Ingresa un email de trabajo válido.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting || !validate()) return;
    setSubmitting(true);
    try {
      await onContinue(value);
    } catch (error) {
      setErrors((current) => ({
        ...current,
        form: error instanceof Error ? error.message : "No pudimos guardar tus datos. Inténtalo nuevamente.",
      }));
      setSubmitting(false);
    }
  };

  return (
    <form id="works-contact-form" onSubmit={handleSubmit} noValidate className="rounded-2xl border border-[#d8dde6] bg-white p-5 sm:p-7 lg:p-8">
      <div className="grid gap-5">
        <div>
          <label htmlFor="works-name" className="text-sm font-semibold text-[#303241]">Nombre <span className="text-[#5369eb]">*</span></label>
          <Input id="works-name" autoComplete="name" value={value.name} onFocus={() => setFocusedField("name")} onBlur={() => setFocusedField((current) => current === "name" ? null : current)} onChange={(event) => update("name", event.target.value)} maxLength={120} placeholder="Tu nombre" aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "works-name-error" : undefined} className={inputClass} />
          <FieldError id="works-name-error" error={errors.name} />
        </div>
        <div>
          <label htmlFor="works-company" className="text-sm font-semibold text-[#303241]">Empresa <span className="text-[#5369eb]">*</span></label>
          <Input id="works-company" autoComplete="organization" value={value.company} onFocus={() => setFocusedField("company")} onBlur={() => setFocusedField((current) => current === "company" ? null : current)} onChange={(event) => update("company", event.target.value)} maxLength={160} placeholder="Nombre de la empresa" aria-invalid={Boolean(errors.company)} aria-describedby={errors.company ? "works-company-error" : undefined} className={inputClass} />
          <FieldError id="works-company-error" error={errors.company} />
        </div>
        <div>
          <label htmlFor="works-email" className="text-sm font-semibold text-[#303241]">Email de trabajo <span className="text-[#5369eb]">*</span></label>
          <Input id="works-email" type="email" autoComplete="email" value={value.email} onFocus={() => setFocusedField("email")} onBlur={() => setFocusedField((current) => current === "email" ? null : current)} onChange={(event) => update("email", event.target.value)} maxLength={254} placeholder="tu@empresa.com" aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "works-email-error" : undefined} className={inputClass} />
          <FieldError id="works-email-error" error={errors.email} />
        </div>
      </div>

      {errors.form ? <div role="alert" className="mt-5 rounded-lg border border-[#e7c9cf] bg-[#fff7f8] p-4 text-sm font-medium text-[#913548]">{errors.form}</div> : null}

      <button
        type="submit"
        disabled={submitting}
        className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 whitespace-nowrap rounded-full bg-[#5369eb] px-6 text-sm font-semibold text-white transition-[background-color,transform] duration-150 hover:bg-[#465bda] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5369eb] focus-visible:ring-offset-4 disabled:cursor-not-allowed disabled:opacity-65 sm:w-auto"
      >
        {submitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Guardando...</> : <>Ver horarios <ArrowRight className="h-4 w-4" /></>}
      </button>
    </form>
  );
}
