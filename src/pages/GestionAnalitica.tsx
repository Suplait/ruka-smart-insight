import { ArrowRight, Check, Bot, TrendingUp, MessageCircle, Sparkles, Clock, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductRegistrationForm from "@/components/product/ProductRegistrationForm";
import AgentShowcase from "@/components/AgentShowcase";
import DataFlowSection from "@/components/DataFlowSection";
import { useState, useEffect } from "react";

export default function GestionAnalitica() {
  const [highlightForm, setHighlightForm] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      let target = new Date();
      target.setHours(12, 0, 0, 0);
      if (now.getHours() >= 12) {
        target.setDate(target.getDate() + 1);
      }
      const diff = target.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor(diff % (1000 * 60 * 60) / (1000 * 60));
      setTimeLeft(`${hours}h ${minutes}m`);
    };
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 60000);
    return () => clearInterval(timer);
  }, []);

  const features = [
    {
      icon: Bot,
      title: "Agentes de IA Especializados",
      description: "3 agentes trabajando 24/7: Recepción inteligente de facturas, análisis automático de compras y alertas predictivas de stock."
    },
    {
      icon: TrendingUp,
      title: "Analítica en Tiempo Real",
      description: "Visualiza tendencias, detecta anomalías y toma decisiones basadas en datos actualizados al instante."
    },
    {
      icon: Shield,
      title: "Integración Segura con SII",
      description: "Conexión directa y segura con el Servicio de Impuestos Internos para automatizar la recepción de facturas."
    }
  ];

  const benefits = [
    "Implementación en menos de 24 horas",
    "Ahorro de hasta 40% en costos operativos",
    "3 agentes de IA especializados incluidos",
    "Integración directa con SII",
    "Alertas inteligentes y predictivas",
    "Soporte 24/7 en español",
    "ROI positivo en el primer mes",
    "Actualizaciones automáticas incluidas"
  ];

  const agents = [
    {
      name: "Agente de Recepción",
      description: "Recibe y procesa facturas automáticamente desde el SII",
      icon: "📬"
    },
    {
      name: "Agente de Análisis",
      description: "Analiza tus compras, detecta tendencias y optimiza costos",
      icon: "📊"
    },
    {
      name: "Agente de Alertas",
      description: "Monitorea stock y te alerta antes de quedarte sin inventario",
      icon: "⚠️"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-block mb-4">
              <span className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
                🤖 Producto Principal de Ruka
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
              Gestión y Analítica Inteligente
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              3 agentes de IA trabajando 24/7 para automatizar tu gestión de compras, 
              analizar tus datos en tiempo real y alertarte antes de problemas de stock.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="text-lg px-8 py-6 rounded-full"
                onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Comenzar Ahora <ArrowRight className="ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 rounded-full gap-2">
                <MessageCircle className="w-5 h-5" />
                Conversemos
              </Button>
            </div>
          </div>

          {/* Hero Stats */}
          <div className="mt-16 grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-2xl bg-white border border-gray-200 shadow-sm">
              <div className="text-4xl font-bold text-primary mb-2">40%</div>
              <div className="text-gray-600">Ahorro en costos operativos</div>
            </div>
            <div className="text-center p-6 rounded-2xl bg-white border border-gray-200 shadow-sm">
              <div className="text-4xl font-bold text-primary mb-2">24/7</div>
              <div className="text-gray-600">Agentes trabajando</div>
            </div>
            <div className="text-center p-6 rounded-2xl bg-white border border-gray-200 shadow-sm">
              <div className="text-4xl font-bold text-primary mb-2">&lt;24h</div>
              <div className="text-gray-600">Tiempo de implementación</div>
            </div>
          </div>
        </div>
      </section>

      {/* Data Flow Section */}
      <DataFlowSection />

      {/* Features Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Características Principales
            </h2>
            <p className="text-xl text-gray-600">
              Todo lo que necesitas para transformar tu gestión de compras
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Agent Showcase */}
      <AgentShowcase />

      {/* Agents Detail Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Tus 3 Agentes de IA
            </h2>
            <p className="text-xl text-gray-600">
              Cada agente especializado en una tarea crítica de tu negocio
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {agents.map((agent, index) => (
              <Card key={index} className="border-2 hover:border-primary/50 transition-all hover:shadow-lg text-center">
                <CardHeader>
                  <div className="text-6xl mb-4">{agent.icon}</div>
                  <CardTitle className="text-2xl">{agent.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {agent.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Beneficios Comprobados
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Más de 100 empresas ya confían en Ruka para automatizar su gestión de compras 
                y obtener insights valiosos en tiempo real.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-1">
                      <Check className="w-4 h-4 text-primary" />
                    </div>
                    <p className="text-gray-700 text-lg">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-200">
              <div className="aspect-square bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <div className="text-center p-8">
                  <TrendingUp className="w-24 h-24 mx-auto mb-4 text-primary" />
                  <p className="text-gray-600 font-medium text-lg">Dashboard de Analítica en Tiempo Real</p>
                  <p className="text-sm text-gray-500 mt-2">Visualiza tus métricas clave al instante</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Inversión Simple y Transparente
            </h2>
            <p className="text-xl text-gray-600">
              Un solo plan, todo incluido
            </p>
          </div>

          <Card className="border-2 border-primary shadow-2xl">
            <CardHeader className="text-center pb-8 pt-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-3xl mb-2">Plan Profesional</CardTitle>
              <CardDescription className="text-lg">Todo lo que necesitas para transformar tu negocio</CardDescription>
              <div className="mt-6">
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-6xl font-bold text-primary">$599</span>
                  <div className="text-left">
                    <div className="text-gray-600 text-lg">/mes</div>
                    <div className="text-sm text-muted-foreground">+ IVA</div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pb-12">
              <div className="grid md:grid-cols-2 gap-x-8 gap-y-4 mb-8">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    <p className="text-gray-700">{benefit}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="flex-1 text-lg py-6"
                  onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Comenzar Ahora <ArrowRight className="ml-2" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="flex-1 text-lg py-6 gap-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  Conversemos
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact-form" className="py-20 px-6 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Left side - Value Proposition */}
            <div>
              <div className="inline-block mb-4">
                <span className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
                  ⚡ Respuesta en 24 horas
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Comienza Hoy Mismo
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Completa el formulario y nuestro equipo se pondrá en contacto contigo para comenzar tu transformación digital.
              </p>
              <div className="space-y-4">
                {[
                  "Setup inicial gratuito",
                  "Onboarding personalizado con tu equipo",
                  "Implementación en menos de 24 horas",
                  "3 agentes de IA listos para trabajar",
                  "Soporte técnico en español 24/7"
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                      <Check className="w-4 h-4 text-primary" />
                    </div>
                    <p className="text-gray-700 text-lg">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right side - Registration Form */}
            <div>
              <ProductRegistrationForm 
                highlightForm={highlightForm} 
                timeLeft={timeLeft} 
                pagePath="/productos/gestion-analitica"
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
