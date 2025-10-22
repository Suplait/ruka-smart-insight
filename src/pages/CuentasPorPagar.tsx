import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2, AlertCircle, FileText, Download, Clock, Shield, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsappButton from '@/components/WhatsappButton';

export default function CuentasPorPagar() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Download,
      title: "Planilla bancaria en 1 click",
      description: "Genera automáticamente la planilla de pagos para tu banco. Sin errores, sin trabajo manual."
    },
    {
      icon: AlertCircle,
      title: "Módulo de recepción inteligente",
      description: "Tu equipo puede reportar discrepancias al recibir productos. Sistema automático de alertas y bloqueos."
    },
    {
      icon: Shield,
      title: "Bloqueo automático de facturas",
      description: "Las facturas con problemas se bloquean automáticamente hasta resolver la incidencia."
    },
    {
      icon: FileText,
      title: "Registro completo de incidencias",
      description: "Cada problema queda documentado con fecha, responsable y resolución. Trazabilidad total."
    },
    {
      icon: Clock,
      title: "Ahorra 15+ horas semanales",
      description: "Automatiza todo el proceso de cuentas por pagar y libera tiempo de tu equipo."
    },
    {
      icon: Zap,
      title: "Integración con Ruka",
      description: "Se conecta automáticamente con tus facturas de compra y proveedores existentes."
    }
  ];

  const benefits = [
    "Elimina errores de pago manual",
    "Mejora relación con proveedores",
    "Control total de discrepancias",
    "Auditoría completa",
    "Reduce fraude interno",
    "Visibilidad en tiempo real"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Zap className="w-4 h-4" />
              Nuevo Producto
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Cuentas por Pagar
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Automatiza todo el proceso de pago a proveedores. Genera planillas bancarias en un click, 
              gestiona discrepancias en la recepción y mantén control total de tus cuentas por pagar.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="rounded-full text-lg px-8"
                onClick={() => navigate('/register')}
              >
                Comenzar ahora
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="rounded-full text-lg px-8"
                onClick={() => navigate('/register')}
              >
                Ver demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6 bg-card/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Todo lo que necesitas para gestionar pagos</h2>
            <p className="text-xl text-muted-foreground">
              Desde la recepción hasta el pago final
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-card p-6 rounded-2xl border shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">
                Control total de tu flujo de pagos
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Deja de perder tiempo en procesos manuales y elimina errores costosos. 
                Ruka automatiza todo el ciclo de cuentas por pagar.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-lg">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-3xl p-8 lg:p-12">
              <div className="bg-card rounded-2xl p-6 shadow-lg mb-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-muted-foreground">Facturas pendientes</span>
                  <span className="text-2xl font-bold">127</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-3/4"></div>
                </div>
              </div>
              
              <div className="bg-card rounded-2xl p-6 shadow-lg mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Monto a pagar</span>
                  <AlertCircle className="w-5 h-5 text-amber-500" />
                </div>
                <span className="text-3xl font-bold">$45.2M</span>
              </div>
              
              <Button className="w-full rounded-full" size="lg">
                <Download className="w-5 h-5 mr-2" />
                Generar planilla bancaria
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Comienza a automatizar tus cuentas por pagar hoy
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Únete a las empresas que ya ahorraron miles de horas en procesos manuales
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            className="rounded-full text-lg px-8"
            onClick={() => navigate('/register')}
          >
            Comenzar gratis
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>

      <Footer />
      <WhatsappButton source="cuentas-por-pagar" />
    </div>
  );
}
