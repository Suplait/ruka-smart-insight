import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, Heart, Target, Zap, Brain, ChartBar, Rocket } from "lucide-react";

export default function AboutUs() {
  return (
    <main className="min-h-screen pt-16">
      <Navbar />
      
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] gradient-blur opacity-50" />
          <div className="absolute inset-0 hero-gradient" />
        </div>

        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Nuestra Historia
            </h1>
            <p className="text-xl text-muted-foreground">
              Somos más que un equipo - somos una familia que ha crecido junta durante casi una década, 
              superando desafíos y celebrando victorias. Esta es nuestra historia de perseverancia, 
              innovación y el deseo constante de hacer la diferencia en la vida de nuestros clientes.
            </p>
          </div>

          <div className="space-y-24">
            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-primary/20 to-purple-500/20" />
              
              <div className="space-y-24">
                <div className="relative">
                  <div className="flex items-center justify-center mb-8">
                    <div className="bg-white p-2 rounded-full border-2 border-primary z-10">
                      <Rocket className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                    <h3 className="text-2xl font-bold mb-4 text-primary">Los Inicios: El Sueño de Hacer la Diferencia</h3>
                    <p className="text-lg text-gray-700 mb-4">
                      Todo comenzó con un sueño compartido y la convicción de que la tecnología podía 
                      mejorar la vida de las personas. Desde nuestros primeros pasos con PortSalud, 
                      aprendimos que el verdadero éxito no está solo en la tecnología, sino en el 
                      impacto positivo que podemos tener en la vida de nuestros usuarios.
                    </p>
                  </div>
                </div>

                <div className="relative">
                  <div className="flex items-center justify-center mb-8">
                    <div className="bg-white p-2 rounded-full border-2 border-primary z-10">
                      <Target className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                    <h3 className="text-2xl font-bold mb-4 text-primary">El Gran Salto: 500 Global</h3>
                    <p className="text-lg text-gray-700 mb-4">
                      Nuestro momento decisivo llegó cuando fuimos seleccionados por 500 Global, una de las 
                      aceleradoras más prestigiosas de Silicon Valley, conocida por impulsar empresas como 
                      Canva y Grab. Este hito no solo validó nuestra visión, sino que nos dio las herramientas 
                      y conexiones para llevar nuestras soluciones a un nivel global.
                    </p>
                  </div>
                </div>

                <div className="relative">
                  <div className="flex items-center justify-center mb-8">
                    <div className="bg-white p-2 rounded-full border-2 border-primary z-10">
                      <Heart className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                    <h3 className="text-2xl font-bold mb-4 text-primary">Superando la Adversidad: Unidos en la Pandemia</h3>
                    <p className="text-lg text-gray-700 mb-4">
                      Cuando la pandemia golpeó, no solo enfrentamos una crisis empresarial - enfrentamos un 
                      momento que definiría quiénes éramos como equipo. En lugar de separarnos, nos unimos más. 
                      Transformamos la adversidad en oportunidad, pivotando hacia nuevas soluciones que ayudarían 
                      a más empresas a prosperar en tiempos difíciles.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="py-16">
              <h2 className="text-4xl font-bold text-center mb-12">Nuestros Valores</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-white/50 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                  <Heart className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-3">Compromiso con tu Éxito</h3>
                  <p className="text-gray-600">
                    Tu crecimiento es nuestra prioridad. Nos comprometemos a entregar soluciones que 
                    realmente impulsen tu negocio y superen tus expectativas.
                  </p>
                </div>

                <div className="bg-white/50 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                  <Zap className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-3">Innovación Continua</h3>
                  <p className="text-gray-600">
                    Constantemente evolucionamos nuestras soluciones para mantenerte a la vanguardia 
                    de la tecnología y la eficiencia operativa.
                  </p>
                </div>

                <div className="bg-white/50 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                  <Brain className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-3">Tecnología que Empodera</h3>
                  <p className="text-gray-600">
                    Desarrollamos soluciones inteligentes que te permiten enfocarte en lo que realmente 
                    importa: hacer crecer tu negocio.
                  </p>
                </div>

                <div className="bg-white/50 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                  <ChartBar className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-3">Decisiones Basadas en Datos</h3>
                  <p className="text-gray-600">
                    Te proporcionamos insights claros y accionables para que puedas tomar las mejores 
                    decisiones para tu negocio.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-primary/5 to-purple-500/5 rounded-3xl p-12 text-center">
              <h2 className="text-4xl font-bold mb-8">Nuestra Pasión</h2>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-12">
                Creemos en un futuro donde la tecnología libera el potencial humano. Nuestra misión es 
                transformar procesos complejos en soluciones simples y efectivas que permitan a las 
                empresas medianas competir al nivel de las grandes corporaciones.
              </p>
              <Button size="lg" className="gap-2" onClick={() => window.open('https://calendly.com/suplait_lorenzo/30min', '_blank')}>
                Conversemos sobre tu Negocio <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}