import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import type { OneLeadData } from "@/content/oneContent";
import { OneCta } from "@/components/one/landing/OneCta";

type FieldErrors = Partial<Record<keyof OneLeadData | "form", string>>;

function FieldError({ id, error }: { id: string; error?: string }) {
  return error ? <p id={id} role="alert" className="mt-2 text-sm font-medium text-[#a3283c]">{error}</p> : null;
}

const phoneDigits = (value: string) => value.replace(/^\+?56/, "").replace(/\D/g, "").slice(0, 9);
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const fieldChecks: Record<keyof OneLeadData, (value: string) => boolean> = {
  name: (value) => value.trim().length >= 2,
  company: (value) => value.trim().length >= 2,
  email: (value) => emailPattern.test(value.trim()),
  whatsapp: (value) => phoneDigits(value).length === 9,
};

const labelClass = "one-eyebrow text-[var(--one-ink-2)]";

export function OneContactForm({
  value,
  onChange,
  onContinue,
}: {
  value: OneLeadData;
  onChange: React.Dispatch<React.SetStateAction<OneLeadData>>;
  onContinue: (value: OneLeadData) => Promise<void>;
}) {
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const completed = (Object.keys(fieldChecks) as (keyof OneLeadData)[]).filter((field) => fieldChecks[field](value[field])).length;

  const update = <K extends keyof OneLeadData>(field: K, fieldValue: OneLeadData[K]) => {
    const nextValue = field === "whatsapp" ? phoneDigits(fieldValue) : fieldValue;
    onChange((current) => ({ ...current, [field]: nextValue }));
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined, form: undefined }));
  };

  const validate = () => {
    const next: FieldErrors = {};
    if (!fieldChecks.name(value.name)) next.name = "Ingresa tu nombre.";
    if (!fieldChecks.company(value.company)) next.company = "Ingresa el nombre de tu empresa.";
    if (!fieldChecks.email(value.email)) next.email = "Ingresa un email de trabajo válido.";
    if (!fieldChecks.whatsapp(value.whatsapp)) next.whatsapp = "Ingresa un WhatsApp válido de 9 dígitos.";
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
    <form id="one-contact-form" onSubmit={handleSubmit} noValidate className="relative border-t border-[var(--one-ink)] pt-8">
      <span
        aria-hidden="true"
        className="absolute left-0 top-[-2px] h-[3px] bg-[var(--one-primary)] transition-[width] duration-700 ease-out"
        style={{ width: `${(completed / 4) * 100}%` }}
      />
      <div className="grid gap-8">
        <div>
          <label htmlFor="one-name" className={labelClass}>Nombre</label>
          <input id="one-name" autoComplete="name" required value={value.name} onChange={(event) => update("name", event.target.value)} maxLength={120} placeholder="Tu nombre" aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "one-name-error" : undefined} className="one-field" />
          <FieldError id="one-name-error" error={errors.name} />
        </div>
        <div>
          <label htmlFor="one-company" className={labelClass}>Empresa</label>
          <input id="one-company" autoComplete="organization" required value={value.company} onChange={(event) => update("company", event.target.value)} maxLength={160} placeholder="Nombre de la empresa" aria-invalid={Boolean(errors.company)} aria-describedby={errors.company ? "one-company-error" : undefined} className="one-field" />
          <FieldError id="one-company-error" error={errors.company} />
        </div>
        <div>
          <label htmlFor="one-email" className={labelClass}>Email de trabajo</label>
          <input id="one-email" type="email" autoComplete="email" required value={value.email} onChange={(event) => update("email", event.target.value)} maxLength={254} placeholder="tu@empresa.com" aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "one-email-error" : undefined} className="one-field" />
          <FieldError id="one-email-error" error={errors.email} />
        </div>
        <div>
          <label htmlFor="one-whatsapp" className={labelClass}>WhatsApp</label>
          <div className="relative">
            <span className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 text-[1.125rem] text-[var(--one-ink-3)]" aria-hidden="true">+56</span>
            <input id="one-whatsapp" type="tel" inputMode="numeric" autoComplete="tel-national" required value={value.whatsapp} onChange={(event) => update("whatsapp", event.target.value)} maxLength={9} placeholder="9 1234 5678" aria-invalid={Boolean(errors.whatsapp)} aria-describedby={errors.whatsapp ? "one-whatsapp-error" : "one-whatsapp-hint"} className="one-field pl-12" />
          </div>
          <p id="one-whatsapp-hint" className="sr-only">Número chileno de 9 dígitos, sin +56.</p>
          <FieldError id="one-whatsapp-error" error={errors.whatsapp} />
        </div>
      </div>

      {errors.form ? <div role="alert" className="mt-6 border-l-2 border-[#a3283c] bg-[#a3283c]/5 p-4 text-sm font-medium text-[#8a2235]">{errors.form}</div> : null}

      <div className="mt-10">
        <OneCta type="submit" disabled={submitting} block>
          {submitting ? <span className="inline-flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Abriendo horarios...</span> : "Ver horarios"}
        </OneCta>
        <p className="mt-4 text-sm text-[var(--one-ink-3)]">Todos los campos son obligatorios. Revisa cómo tratamos tus datos en nuestra <Link to="/privacy" className="underline underline-offset-4 hover:text-[var(--one-ink)]">política de privacidad</Link>.</p>
      </div>
    </form>
  );
}
