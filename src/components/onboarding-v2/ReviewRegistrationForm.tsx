import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ReviewBanner } from "@/components/onboarding-v2/ReviewBanner";

const defaultReviewData = {
  firstName: "Camila",
  lastName: "Operaciones",
  email: "demo@ruka.ai",
  nombreRestaurante: "Empresa Demo",
  ciudad: "Santiago",
  whatsapp: "",
};

export function ReviewRegistrationForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(defaultReviewData);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    navigate("/onboarding-success?onboardingDebug=1", {
      state: {
        leadId: "debug-ux",
        restaurantName: formData.nombreRestaurante || "Empresa Demo",
        firstName: formData.firstName || "Camila",
        lastName: formData.lastName || "Operaciones",
        email: formData.email || "demo@ruka.ai",
        ciudad: formData.ciudad || "Santiago",
        whatsapp: formData.whatsapp,
      },
    });
  };

  const updateField = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  return (
    <main className="min-h-[100dvh] bg-[#fbfcff] text-[#171827]">
      <ReviewBanner detail="Formulario seguro de prueba" />
      <div className="mx-auto grid min-h-[calc(100dvh-42px)] max-w-6xl items-center gap-10 px-5 py-10 sm:px-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(420px,1.1fr)] lg:px-10">
        <section>
          <img src="/logo.png" alt="Ruka.ai" className="h-9 w-auto" />
          <p className="mt-10 text-xs font-semibold uppercase tracking-[0.16em] text-primary">Revisión del journey</p>
          <h1 className="mt-4 max-w-xl text-balance text-4xl font-semibold leading-[1.03] tracking-[-0.035em] sm:text-5xl">
            Entra al onboarding sin crear un lead.
          </h1>
          <p className="mt-5 max-w-xl text-pretty text-base leading-7 text-[#555d72] sm:text-lg">
            Puedes editar estos datos o avanzar con los valores de prueba. Estos datos no se guardan ni se envían.
          </p>
        </section>

        <form onSubmit={handleSubmit} className="rounded-2xl border border-[#dce3f2] bg-white p-5 sm:p-7">
          <h2 className="text-xl font-semibold tracking-[-0.02em]">Datos de prueba</h2>
          <p className="mt-1 text-sm text-[#687086]">Todos los campos son opcionales en modo review.</p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-medium text-[#30364c]">
              Nombre
              <Input name="firstName" value={formData.firstName} onChange={updateField} className="h-11" />
            </label>
            <label className="grid gap-2 text-sm font-medium text-[#30364c]">
              Apellido
              <Input name="lastName" value={formData.lastName} onChange={updateField} className="h-11" />
            </label>
            <label className="grid gap-2 text-sm font-medium text-[#30364c] sm:col-span-2">
              Email
              <Input name="email" type="email" value={formData.email} onChange={updateField} className="h-11" />
            </label>
            <label className="grid gap-2 text-sm font-medium text-[#30364c] sm:col-span-2">
              Empresa
              <Input name="nombreRestaurante" value={formData.nombreRestaurante} onChange={updateField} className="h-11" />
            </label>
            <label className="grid gap-2 text-sm font-medium text-[#30364c]">
              Ciudad
              <Input name="ciudad" value={formData.ciudad} onChange={updateField} className="h-11" />
            </label>
            <label className="grid gap-2 text-sm font-medium text-[#30364c]">
              WhatsApp opcional
              <Input name="whatsapp" value={formData.whatsapp} onChange={updateField} className="h-11" />
            </label>
          </div>

          <Button type="submit" className="mt-6 h-12 w-full rounded-full text-base font-semibold">
            Abrir onboarding
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </form>
      </div>
    </main>
  );
}
