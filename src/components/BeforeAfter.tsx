import { Clock, CheckCircle } from "lucide-react";

export default function BeforeAfter() {
  return (
    <section className="py-24 bg-white">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-16 animate-fade-in">
          La diferencia con Ruka.ai
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Antes */}
          <div className="p-8 rounded-xl bg-red-50 space-y-6 animate-slide-in-right">
            <div className="flex items-center gap-4 mb-6">
              <Clock className="w-8 h-8 text-red-500" />
              <h3 className="text-2xl font-semibold">Antes</h3>
            </div>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="text-red-500">✕</span>
                <p>Proceso manual que toma 1 mes</p>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500">✕</span>
                <p>Alto costo en personal de back office</p>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500">✕</span>
                <p>Errores humanos frecuentes</p>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500">✕</span>
                <p>Sin tiempo para reaccionar a problemas</p>
              </li>
            </ul>
          </div>

          {/* Después */}
          <div className="p-8 rounded-xl bg-green-50 space-y-6 animate-slide-in-right" style={{ animationDelay: "150ms" }}>
            <div className="flex items-center gap-4 mb-6">
              <CheckCircle className="w-8 h-8 text-green-500" />
              <h3 className="text-2xl font-semibold">Con Ruka</h3>
            </div>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="text-green-500">✓</span>
                <p>Actualización en tiempo real</p>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-500">✓</span>
                <p>Reducción de costos operativos</p>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-500">✓</span>
                <p>Automatización inteligente sin errores</p>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-500">✓</span>
                <p>Alertas preventivas inmediatas</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}