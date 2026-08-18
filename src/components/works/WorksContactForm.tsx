import { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  worksFrequencyOptions,
  worksManualHoursOptions,
  type WorksLeadData,
  type WorksFrequency,
  type WorksManualHours,
} from "@/content/worksContent";

type FieldErrors = Partial<Record<keyof WorksLeadData | "form", string>>;

function FieldError({ id, error }: { id: string; error?: string }) {
  return error ? <p id={id} role="alert" className="mt-2 text-sm font-medium text-[#b44355]">{error}</p> : null;
}

const inputClass = "h-12 rounded-xl border-[#d9dde7] bg-white px-4 text-base shadow-none placeholder:text-[#a0a5b2] focus-visible:ring-[#5369eb]";

export function WorksContactForm({
  value,
  onChange,
  onContinue,
}: {
  value: WorksLeadData;
  onChange: React.Dispatch<React.SetStateAction<WorksLeadData>>;
  onContinue: (value: WorksLeadData) => Promise<void>;
}) {
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const update = <K extends keyof WorksLeadData>(field: K, fieldValue: WorksLeadData[K]) => {
    onChange((current) => ({ ...current, [field]: fieldValue }));
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined, form: undefined }));
  };

  const validate = () => {
    const next: FieldErrors = {};
    if (value.processDescription.trim().length < 20) next.processDescription = "Cuéntanos un poco más sobre el proceso.";
    if (!value.frequency) next.frequency = "Selecciona una frecuencia.";
    if (!value.manualHours) next.manualHours = "Selecciona una alternativa.";
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
        form: error instanceof Error ? error.message : "No pudimos guardar el proceso. Inténtalo nuevamente.",
      }));
      setSubmitting(false);
    }
  };

  return (
    <form id="works-contact-form" onSubmit={handleSubmit} noValidate className="rounded-[22px] border border-[#dfe3eb] bg-white p-5 shadow-[0_24px_70px_rgba(30,34,56,0.09)] sm:p-8 lg:p-10">
      <div>
        <label htmlFor="works-process" className="text-base font-semibold text-[#252736]">¿Cómo funciona hoy? <span className="text-[#5369eb]">*</span></label>
        <p className="mt-1 text-sm text-[#7a8090]">Descríbelo como se lo explicarías a una persona nueva del equipo.</p>
        <Textarea
          id="works-process"
          value={value.processDescription}
          onChange={(event) => update("processDescription", event.target.value)}
          placeholder="Por ejemplo: recibimos facturas por correo, buscamos la orden en SAP, revisamos si la recepción coincide y después actualizamos el ERP manualmente."
          maxLength={5000}
          aria-invalid={Boolean(errors.processDescription)}
          aria-describedby={errors.processDescription ? "works-process-error" : undefined}
          className="mt-3 min-h-[170px] resize-y rounded-xl border-[#d9dde7] bg-white p-4 text-base leading-7 placeholder:text-[#a0a5b2] focus-visible:ring-[#5369eb]"
        />
        <FieldError id="works-process-error" error={errors.processDescription} />
      </div>

      <div className="mt-7">
        <label htmlFor="works-systems" className="text-base font-semibold text-[#252736]">¿Qué sistemas intervienen?</label>
        <p className="mt-1 text-sm text-[#7a8090]">Opcional. Incluye archivos, correo o sistemas internos si corresponde.</p>
        <Input
          id="works-systems"
          value={value.systems}
          onChange={(event) => update("systems", event.target.value)}
          placeholder="SAP, SII, correo, Excel..."
          maxLength={1000}
          className={`mt-3 ${inputClass}`}
        />
      </div>

      <fieldset className="mt-8">
        <legend className="text-base font-semibold text-[#252736]">¿Con qué frecuencia ocurre? <span className="text-[#5369eb]">*</span></legend>
        <RadioGroup
          value={value.frequency}
          onValueChange={(next) => update("frequency", next as WorksFrequency)}
          className="mt-3 grid gap-2 sm:grid-cols-2"
          aria-describedby={errors.frequency ? "works-frequency-error" : undefined}
        >
          {worksFrequencyOptions.map((option) => (
            <label key={option} className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#dfe3eb] bg-[#fbfcff] px-4 py-3.5 text-sm font-medium text-[#4a4e5f] transition hover:border-[#c5cdf7] has-[[data-state=checked]]:border-[#8999ef] has-[[data-state=checked]]:bg-[#f3f5ff]">
              <RadioGroupItem value={option} /> {option}
            </label>
          ))}
        </RadioGroup>
        <FieldError id="works-frequency-error" error={errors.frequency} />
      </fieldset>

      <fieldset className="mt-8">
        <legend className="text-base font-semibold text-[#252736]">¿Cuánto trabajo manual requiere hoy? <span className="text-[#5369eb]">*</span></legend>
        <RadioGroup
          value={value.manualHours}
          onValueChange={(next) => update("manualHours", next as WorksManualHours)}
          className="mt-3 grid gap-2 sm:grid-cols-2"
          aria-describedby={errors.manualHours ? "works-hours-error" : undefined}
        >
          {worksManualHoursOptions.map((option) => (
            <label key={option} className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#dfe3eb] bg-[#fbfcff] px-4 py-3.5 text-sm font-medium text-[#4a4e5f] transition hover:border-[#c5cdf7] has-[[data-state=checked]]:border-[#8999ef] has-[[data-state=checked]]:bg-[#f3f5ff]">
              <RadioGroupItem value={option} /> {option}
            </label>
          ))}
        </RadioGroup>
        <FieldError id="works-hours-error" error={errors.manualHours} />
      </fieldset>

      <div className="mt-9 border-t border-[#e4e7ee] pt-8">
        <p className="text-[11px] font-semibold tracking-[0.16em] text-[#5369eb]">TUS DATOS</p>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="works-name" className="text-sm font-semibold text-[#303241]">Nombre <span className="text-[#5369eb]">*</span></label>
            <Input id="works-name" autoComplete="name" value={value.name} onChange={(event) => update("name", event.target.value)} maxLength={120} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "works-name-error" : undefined} className={`mt-2 ${inputClass}`} />
            <FieldError id="works-name-error" error={errors.name} />
          </div>
          <div>
            <label htmlFor="works-company" className="text-sm font-semibold text-[#303241]">Empresa <span className="text-[#5369eb]">*</span></label>
            <Input id="works-company" autoComplete="organization" value={value.company} onChange={(event) => update("company", event.target.value)} maxLength={160} aria-invalid={Boolean(errors.company)} aria-describedby={errors.company ? "works-company-error" : undefined} className={`mt-2 ${inputClass}`} />
            <FieldError id="works-company-error" error={errors.company} />
          </div>
          <div>
            <label htmlFor="works-email" className="text-sm font-semibold text-[#303241]">Email de trabajo <span className="text-[#5369eb]">*</span></label>
            <Input id="works-email" type="email" autoComplete="email" value={value.email} onChange={(event) => update("email", event.target.value)} maxLength={254} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "works-email-error" : undefined} className={`mt-2 ${inputClass}`} />
            <FieldError id="works-email-error" error={errors.email} />
          </div>
          <div>
            <label htmlFor="works-whatsapp" className="text-sm font-semibold text-[#303241]">WhatsApp <span className="font-normal text-[#8a90a0]">(opcional)</span></label>
            <Input id="works-whatsapp" type="tel" autoComplete="tel" value={value.whatsapp} onChange={(event) => update("whatsapp", event.target.value)} maxLength={40} className={`mt-2 ${inputClass}`} />
          </div>
        </div>
      </div>

      {errors.form ? <div role="alert" className="mt-6 rounded-xl border border-[#efcfd5] bg-[#fff7f8] p-4 text-sm font-medium text-[#9f3547]">{errors.form}</div> : null}

      <button
        type="submit"
        disabled={submitting}
        className="mt-8 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#5369eb] px-6 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(83,105,235,0.22)] transition hover:bg-[#455adb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5369eb] focus-visible:ring-offset-4 disabled:cursor-not-allowed disabled:opacity-65 sm:w-auto"
      >
        {submitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Guardando...</> : <>Ver horarios <ArrowRight className="h-4 w-4" /></>}
      </button>
    </form>
  );
}
