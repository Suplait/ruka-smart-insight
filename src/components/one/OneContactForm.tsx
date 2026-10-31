import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { OneLeadData } from "@/content/oneContent";
import type { OneContactVisualState } from "@/components/one/field/fieldTypes";

type FieldErrors = Partial<Record<keyof OneLeadData | "form", string>>;

function FieldError({ id, error }: { id: string; error?: string }) {
  return error ? <p id={id} role="alert" className="mt-2 text-sm font-medium text-[#ff9fb0]">{error}</p> : null;
}

const inputClass = "one-input mt-2";
const labelClass = "text-sm font-medium text-[var(--one-soft)]";
const phoneDigits = (value: string) => value.replace(/^\+?56/, "").replace(/\D/g, "").slice(0, 9);

export function OneContactForm({
  value,
  onChange,
  onContinue,
  onVisualStateChange,
}: {
  value: OneLeadData;
  onChange: React.Dispatch<React.SetStateAction<OneLeadData>>;
  onContinue: (value: OneLeadData) => Promise<void>;
  onVisualStateChange?: (state: OneContactVisualState) => void;
}) {
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState<keyof OneLeadData | null>(null);

  useEffect(() => {
    const valid = value.name.trim().length >= 2
      && value.company.trim().length >= 2
      && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email.trim())
      && phoneDigits(value.whatsapp).length === 9;

    if (valid) onVisualStateChange?.("valid");
    else if (focusedField) onVisualStateChange?.(focusedField);
    else onVisualStateChange?.("idle");
  }, [focusedField, onVisualStateChange, value]);

  const fieldDone = [
    value.name.trim().length >= 2,
    value.company.trim().length >= 2,
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email.trim()),
    phoneDigits(value.whatsapp).length === 9,
  ];
  const doneCount = fieldDone.filter(Boolean).length;

  const update = <K extends keyof OneLeadData>(field: K, fieldValue: OneLeadData[K]) => {
    const nextValue = field === "whatsapp" ? phoneDigits(fieldValue) : fieldValue;
    onChange((current) => ({ ...current, [field]: nextValue }));
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined, form: undefined }));
  };

  const validate = () => {
    const next: FieldErrors = {};
    if (value.name.trim().length < 2) next.name = "Ingresa tu nombre.";
    if (value.company.trim().length < 2) next.company = "Ingresa el nombre de tu empresa.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email.trim())) next.email = "Ingresa un email de trabajo válido.";
    if (phoneDigits(value.whatsapp).length !== 9) next.whatsapp = "Ingresa un WhatsApp válido de 9 dígitos.";
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
        form: error instanceof Error ? error.message : "No pudimos enviar tus datos. Inténtalo nuevamente.",
      }));
      setSubmitting(false);
    }
  };

  return (
    <form id="one-contact-form" onSubmit={handleSubmit} noValidate aria-describedby="one-form-progress" className="relative rounded-[22px] border border-[var(--one-hair-strong)] bg-[rgba(6,8,18,0.92)] p-5 shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)] sm:p-7 lg:p-9">
      <div className="mb-7 flex items-center justify-between gap-4">
        <p className="text-base font-semibold tracking-[-0.01em] text-white">Tus datos</p>
        <div id="one-form-progress" className="flex items-center gap-3 text-xs text-[var(--one-muted)]">
          <span className="flex items-end gap-1.5" aria-hidden="true">
            {fieldDone.map((done, index) => <span key={index} className={cn("one-progress-tile", done && "is-done")} />)}
          </span>
          <span>{doneCount} de 4</span>
        </div>
      </div>
      <div className="grid gap-5">
        <div>
          <label htmlFor="one-name" className={labelClass}>Nombre <span aria-hidden="true" className="text-[var(--one-accent)]">*</span></label>
          <input id="one-name" autoComplete="name" value={value.name} onFocus={() => setFocusedField("name")} onBlur={() => setFocusedField((current) => current === "name" ? null : current)} onChange={(event) => update("name", event.target.value)} maxLength={120} placeholder="Tu nombre" aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "one-name-error" : undefined} className={inputClass} />
          <FieldError id="one-name-error" error={errors.name} />
        </div>
        <div>
          <label htmlFor="one-company" className={labelClass}>Empresa <span aria-hidden="true" className="text-[var(--one-accent)]">*</span></label>
          <input id="one-company" autoComplete="organization" value={value.company} onFocus={() => setFocusedField("company")} onBlur={() => setFocusedField((current) => current === "company" ? null : current)} onChange={(event) => update("company", event.target.value)} maxLength={160} placeholder="Nombre de la empresa" aria-invalid={Boolean(errors.company)} aria-describedby={errors.company ? "one-company-error" : undefined} className={inputClass} />
          <FieldError id="one-company-error" error={errors.company} />
        </div>
        <div>
          <label htmlFor="one-email" className={labelClass}>Email de trabajo <span aria-hidden="true" className="text-[var(--one-accent)]">*</span></label>
          <input id="one-email" type="email" autoComplete="email" value={value.email} onFocus={() => setFocusedField("email")} onBlur={() => setFocusedField((current) => current === "email" ? null : current)} onChange={(event) => update("email", event.target.value)} maxLength={254} placeholder="tu@empresa.com" aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "one-email-error" : undefined} className={inputClass} />
          <FieldError id="one-email-error" error={errors.email} />
        </div>
        <div>
          <label htmlFor="one-whatsapp" className={labelClass}>WhatsApp <span aria-hidden="true" className="text-[var(--one-accent)]">*</span></label>
          <div className="relative">
            <input id="one-whatsapp" type="tel" inputMode="numeric" autoComplete="tel-national" value={value.whatsapp} onFocus={() => setFocusedField("whatsapp")} onBlur={() => setFocusedField((current) => current === "whatsapp" ? null : current)} onChange={(event) => update("whatsapp", event.target.value)} maxLength={9} placeholder="9 1234 5678" aria-invalid={Boolean(errors.whatsapp)} aria-describedby={errors.whatsapp ? "one-whatsapp-error" : undefined} className={`${inputClass} !pl-[5.15rem]`} />
            <div className="pointer-events-none absolute left-4 top-1/2 mt-1 -translate-y-1/2 border-r border-[var(--one-hair-strong)] pr-3 text-sm font-medium text-[var(--one-soft)]" aria-hidden="true">
              🇨🇱 +56
            </div>
          </div>
          <FieldError id="one-whatsapp-error" error={errors.whatsapp} />
        </div>
      </div>

      {errors.form ? <div role="alert" className="mt-5 rounded-xl border border-[#ff9fb0]/40 bg-[#ff9fb0]/10 p-4 text-sm font-medium text-[#ffc2cd]">{errors.form}</div> : null}

      <button
        type="submit"
        disabled={submitting}
        className="one-cta mt-8 w-full justify-center"
      >
        {submitting ? <><Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Abriendo horarios...</> : <><span className="one-cta__tile" aria-hidden="true" />Ver horarios</>}
      </button>
      <p className="mt-4 text-center text-xs leading-5 text-[var(--one-muted)]">Siguiente paso: eliges una hora para conversar 30 minutos.</p>
    </form>
  );
}
