import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function AboutUs() {
  return (
    <main className="min-h-screen pt-16">
      <Navbar />
      
      <section className="py-24">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="text-4xl font-bold mb-6">Nuestra Historia</h1>
            <p className="text-xl text-muted-foreground">
              Somos un equipo que lleva trabajando junto por casi 8 años, construyendo soluciones tecnológicas innovadoras.
            </p>
          </div>

          <div className="grid gap-16">
            <div className="bg-secondary/30 rounded-2xl p-8 md:p-12">
              <h2 className="text-2xl font-semibold mb-6">Nuestros Valores</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="bg-white p-6 rounded-xl">
                    <h3 className="font-semibold mb-2">Extreme Ownership</h3>
                    <p className="text-muted-foreground">Tomamos total responsabilidad de nuestras acciones y resultados.</p>
                  </div>
                  <div className="bg-white p-6 rounded-xl">
                    <h3 className="font-semibold mb-2">Retención es Nuestro Core</h3>
                    <p className="text-muted-foreground">Creamos productos que nuestros usuarios aman ❤️ y les ayudan a crecer.</p>
                  </div>
                  <div className="bg-white p-6 rounded-xl">
                    <h3 className="font-semibold mb-2">Mejora Continua</h3>
                    <p className="text-muted-foreground">Buscamos la excelencia en nuestro desarrollo personal y evolución del producto.</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-white p-6 rounded-xl">
                    <h3 className="font-semibold mb-2">Automatización</h3>
                    <p className="text-muted-foreground">Automatizamos todo lo que se pueda automatizar.</p>
                  </div>
                  <div className="bg-white p-6 rounded-xl">
                    <h3 className="font-semibold mb-2">Data-Driven</h3>
                    <p className="text-muted-foreground">Tomamos decisiones basadas en datos e información real.</p>
                  </div>
                  <div className="bg-white p-6 rounded-xl">
                    <h3 className="font-semibold mb-2">Validación Rápida</h3>
                    <p className="text-muted-foreground">Validamos rápido e iteramos en vez de esperar tener algo perfecto.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-2xl font-semibold mb-6">Nuestra Pasión</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Transformar el trabajo manual y repetitivo en procesos automatizados e inteligentes con tecnología de vanguardia para potenciar el crecimiento de las empresas.
              </p>
              <Button size="lg" className="gap-2" onClick={() => window.open('https://calendly.com/suplait_lorenzo/30min', '_blank')}>
                Conversemos <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}