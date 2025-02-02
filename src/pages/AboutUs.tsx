import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, Heart, Target, Zap, Brain, ChartBar, Rocket, Users, Code, Award } from "lucide-react";

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
              Somos un equipo que lleva casi 8 años construyendo soluciones tecnológicas innovadoras juntos. Esta es nuestra historia de perseverancia, aprendizaje y evolución.
            </p>
          </div>

          <div className="space-y-24">
            {/* Timeline Section */}
            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-primary/20 to-purple-500/20" />
              
              <div className="space-y-24">
                {/* 2015-2016: Los Inicios */}
                <div className="relative">
                  <div className="flex items-center justify-center mb-8">
                    <div className="bg-white p-2 rounded-full border-2 border-primary z-10">
                      <Rocket className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                    <h3 className="text-2xl font-bold mb-4 text-primary">2015-2016: Los Inicios</h3>
                    <p className="text-lg text-gray-700 mb-4">
                      Todo comenzó cuando Camilo y Lorenzo, compañeros de colegio, fundaron su primera startup llamada PortSalud durante sus últimos años de universidad. Aunque el proyecto no prosperó, nos dejó una valiosa lección: construir una startup es como subir una escalera mecánica en sentido contrario—si te detienes, retrocedes.
                    </p>
                    <div className="mt-4 p-4 bg-primary/5 rounded-xl">
                      <p className="text-sm italic text-gray-600">
                        "Nuestra primera experiencia nos enseñó que la pasión sin estrategia no es suficiente. Necesitábamos aprender sobre emprendimiento y modelos de negocio."
                      </p>
                    </div>
                  </div>
                </div>

                {/* 2017-2018: Etiner */}
                <div className="relative">
                  <div className="flex items-center justify-center mb-8">
                    <div className="bg-white p-2 rounded-full border-2 border-primary z-10">
                      <Users className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                    <h3 className="text-2xl font-bold mb-4 text-primary">2017-2018: El Nacimiento de Etiner</h3>
                    <p className="text-lg text-gray-700 mb-4">
                      Con la incorporación de Benja y Enzo, creamos Etiner, una plataforma que revolucionó la forma de planificar viajes. Alcanzamos nuestros primeros US$100k en ventas y expandimos operaciones a Perú, validando rápido y adaptándonos constantemente.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                      <div className="bg-white p-6 rounded-xl shadow-sm">
                        <h4 className="font-semibold mb-2">Primer Gran Logro</h4>
                        <p className="text-gray-600">US$100k en ventas totales durante el verano 2017-2018</p>
                      </div>
                      <div className="bg-white p-6 rounded-xl shadow-sm">
                        <h4 className="font-semibold mb-2">Expansión Internacional</h4>
                        <p className="text-gray-600">Operaciones en Chile y Perú, enfocados en destinos icónicos</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2019-2020: Crecimiento y Pandemia */}
                <div className="relative">
                  <div className="flex items-center justify-center mb-8">
                    <div className="bg-white p-2 rounded-full border-2 border-primary z-10">
                      <Award className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                    <h3 className="text-2xl font-bold mb-4 text-primary">2019-2020: De 500 Startups a la Pandemia</h3>
                    <p className="text-lg text-gray-700 mb-4">
                      Fuimos aceptados por 500 Startups, expandimos a 5 países y servimos a más de 10,000 clientes. Pero entonces llegó la pandemia, y tuvimos que reinventarnos completamente, pivoteando a Etiner Labs.
                    </p>
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-primary/5 p-4 rounded-xl text-center">
                        <h4 className="font-semibold">5 Países</h4>
                        <p className="text-sm text-gray-600">Presencia Internacional</p>
                      </div>
                      <div className="bg-primary/5 p-4 rounded-xl text-center">
                        <h4 className="font-semibold">10,000+</h4>
                        <p className="text-sm text-gray-600">Clientes Satisfechos</p>
                      </div>
                      <div className="bg-primary/5 p-4 rounded-xl text-center">
                        <h4 className="font-semibold">500 Startups</h4>
                        <p className="text-sm text-gray-600">Aceleradora Elite</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2021-2023: Evolución */}
                <div className="relative">
                  <div className="flex items-center justify-center mb-8">
                    <div className="bg-white p-2 rounded-full border-2 border-primary z-10">
                      <Code className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                    <h3 className="text-2xl font-bold mb-4 text-primary">2021-2023: La Evolución</h3>
                    <p className="text-lg text-gray-700 mb-4">
                      Transformamos Etiner Labs en una agencia exitosa, trabajando con marcas como P&G y Rappi. Luego nació Suplait, que eventualmente evolucionaría en lo que hoy es Ruka.ai.
                    </p>
                    <div className="mt-6 bg-gradient-to-r from-primary/10 to-purple-500/10 p-6 rounded-xl">
                      <p className="text-lg font-medium">
                        Redujimos el costo de adquisición de restaurantes en Rappi en un 87% en 9 países, agregando más de 10,000 restaurantes mensualmente.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 2024: Ruka.ai */}
                <div className="relative">
                  <div className="flex items-center justify-center mb-8">
                    <div className="bg-white p-2 rounded-full border-2 border-primary z-10">
                      <Brain className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                    <h3 className="text-2xl font-bold mb-4 text-primary">2024: El Nacimiento de Ruka.ai</h3>
                    <p className="text-lg text-gray-700 mb-4">
                      Hoy, Ruka.ai nace con la misión de democratizar la eficiencia operacional, llevando a empresas medianas al nivel de corporaciones grandes a través de la IA.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Valores Section */}
            <div className="py-16">
              <h2 className="text-4xl font-bold text-center mb-12">Nuestros Valores</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-white/50 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                  <Target className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-3">Extreme Ownership</h3>
                  <p className="text-gray-600">
                    Tomamos total responsabilidad de nuestras acciones y resultados, sin excusas.
                  </p>
                </div>

                <div className="bg-white/50 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                  <Heart className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-3">La Retención es Nuestro Core</h3>
                  <p className="text-gray-600">
                    Creamos productos que nuestros usuarios aman y que impulsan su crecimiento.
                  </p>
                </div>

                <div className="bg-white/50 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                  <Zap className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-3">Mejora Continua</h3>
                  <p className="text-gray-600">
                    Buscamos la excelencia en nuestro desarrollo personal y evolución del producto.
                  </p>
                </div>

                <div className="bg-white/50 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                  <Brain className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-3">Automatización</h3>
                  <p className="text-gray-600">
                    Automatizamos todo lo que se pueda automatizar para maximizar la eficiencia.
                  </p>
                </div>

                <div className="bg-white/50 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                  <ChartBar className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-3">Data-Driven</h3>
                  <p className="text-gray-600">
                    Tomamos decisiones basadas en datos e información real.
                  </p>
                </div>

                <div className="bg-white/50 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                  <Rocket className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-3">Validación Rápida</h3>
                  <p className="text-gray-600">
                    Validamos rápido e iteramos en vez de esperar tener algo perfecto.
                  </p>
                </div>
              </div>
            </div>

            {/* Nuestra Pasión Section */}
            <div className="bg-gradient-to-r from-primary/5 to-purple-500/5 rounded-3xl p-12 text-center">
              <h2 className="text-4xl font-bold mb-8">Nuestra Pasión</h2>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-12">
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