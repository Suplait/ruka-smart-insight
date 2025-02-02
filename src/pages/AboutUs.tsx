import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, Target, Zap, Brain, ChartBar, Users, Shield, Rocket, Heart } from "lucide-react";

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
              Un viaje de innovación y perseverancia que comenzó hace casi una década. 
              Descubre cómo hemos evolucionado hasta convertirnos en líderes en automatización inteligente.
            </p>
          </div>

          <div className="space-y-24">
            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-primary/20 to-purple-500/20" />
              
              <div className="space-y-24">
                <div className="relative">
                  <div className="flex items-center justify-center mb-8">
                    <div className="bg-white p-2 rounded-full border-2 border-primary z-10">
                      <span className="text-primary font-bold">2015</span>
                    </div>
                  </div>
                  <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                    <h3 className="text-2xl font-bold mb-4 text-primary">Los Primeros Pasos con PortSalud</h3>
                    <p className="text-lg text-gray-700 mb-4">
                      Comenzamos desarrollando soluciones tecnológicas para el sector salud, 
                      aprendiendo valiosas lecciones sobre la importancia de crear tecnología 
                      que realmente impacte en la eficiencia operativa de las empresas.
                    </p>
                  </div>
                </div>

                <div className="relative">
                  <div className="flex items-center justify-center mb-8">
                    <div className="bg-white p-2 rounded-full border-2 border-primary z-10">
                      <span className="text-primary font-bold">2019</span>
                    </div>
                  </div>
                  <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                    <h3 className="text-2xl font-bold mb-4 text-primary">Reconocimiento Global: 500 Global</h3>
                    <p className="text-lg text-gray-700 mb-4">
                      Fuimos seleccionados por 500 Global, una de las aceleradoras más prestigiosas 
                      de Silicon Valley que ha impulsado empresas como Canva y Grab. Este respaldo 
                      nos dio acceso a mentores de clase mundial y una red global de emprendedores.
                    </p>
                  </div>
                </div>

                <div className="relative">
                  <div className="flex items-center justify-center mb-8">
                    <div className="bg-white p-2 rounded-full border-2 border-primary z-10">
                      <span className="text-primary font-bold">2020-2022</span>
                    </div>
                  </div>
                  <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                    <h3 className="text-2xl font-bold mb-4 text-primary">Resiliencia en la Pandemia</h3>
                    <p className="text-lg text-gray-700 mb-4">
                      Durante la pandemia, mientras muchas empresas cerraban, nosotros vimos una 
                      oportunidad para innovar. Desarrollamos soluciones remotas que ayudaron a 
                      nuestros clientes a mantener sus operaciones en momentos críticos, 
                      demostrando que la adversidad puede ser un catalizador para la innovación.
                    </p>
                  </div>
                </div>

                <div className="relative">
                  <div className="flex items-center justify-center mb-8">
                    <div className="bg-white p-2 rounded-full border-2 border-primary z-10">
                      <span className="text-primary font-bold">2024</span>
                    </div>
                  </div>
                  <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                    <h3 className="text-2xl font-bold mb-4 text-primary">Nace Ruka.ai</h3>
                    <p className="text-lg text-gray-700 mb-4">
                      Lanzamos Ruka.ai, consolidando años de experiencia en una plataforma 
                      de automatización inteligente diseñada específicamente para empresas medianas. 
                      Nuestra misión es democratizar el acceso a tecnologías avanzadas de 
                      automatización, permitiendo que más empresas compitan efectivamente en la era digital.
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
                  <h3 className="text-xl font-semibold mb-3">Compromiso con Resultados</h3>
                  <p className="text-gray-600">
                    No solo prometemos, entregamos. Nos comprometemos a generar impacto 
                    medible en la eficiencia de tu negocio desde el primer día.
                  </p>
                </div>

                <div className="bg-white/50 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                  <Zap className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-3">Innovación Práctica</h3>
                  <p className="text-gray-600">
                    Desarrollamos soluciones innovadoras pero prácticas, enfocadas en 
                    resolver problemas reales de tu negocio de manera eficiente.
                  </p>
                </div>

                <div className="bg-white/50 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                  <Brain className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-3">Tecnología que Empodera</h3>
                  <p className="text-gray-600">
                    Creamos herramientas que potencian a tus equipos, permitiéndoles 
                    enfocarse en tareas de alto valor mientras automatizamos lo rutinario.
                  </p>
                </div>

                <div className="bg-white/50 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                  <ChartBar className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-3">Mejora Continua</h3>
                  <p className="text-gray-600">
                    Evolucionamos constantemente nuestras soluciones basándonos en datos 
                    y feedback real de usuarios para maximizar su impacto.
                  </p>
                </div>

                <div className="bg-white/50 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                  <Users className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-3">Colaboración Estratégica</h3>
                  <p className="text-gray-600">
                    Trabajamos como una extensión de tu equipo, alineando nuestras 
                    soluciones con tus objetivos de negocio.
                  </p>
                </div>

                <div className="bg-white/50 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                  <Shield className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-3">Confiabilidad y Seguridad</h3>
                  <p className="text-gray-600">
                    Protegemos tus datos y procesos con los más altos estándares de 
                    seguridad, garantizando la continuidad de tu operación.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-primary/5 to-purple-500/5 rounded-3xl p-12 text-center">
              <h2 className="text-4xl font-bold mb-8">Nuestra Misión</h2>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-12">
                Transformamos procesos complejos en soluciones simples y efectivas que permiten 
                a las empresas medianas competir al nivel de las grandes corporaciones. 
                Creemos en un futuro donde la tecnología libera el potencial de cada organización.
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
