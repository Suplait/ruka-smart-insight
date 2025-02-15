
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { ArrowRight, UtensilsCrossed, Clock } from "lucide-react";

export default function Restaurantes() {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    nombreRestaurante: "",
    ciudad: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "¡Gracias por tu interés!",
      description: "Te contactaremos pronto para comenzar tu proceso de onboarding.",
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <main className="min-h-screen pt-16">
      <Navbar />
      
      <div className="relative">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contenido que scrollea */}
            <div className="py-24 space-y-32">
              {/* Hero Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
              >
                <h1 className="text-5xl sm:text-6xl font-bold leading-tight">
                  ¿Cansado de digitar
                  <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"> factura por factura?</span>
                </h1>
                <p className="text-2xl text-muted-foreground leading-relaxed">
                  Sabemos que tus empleados pasan horas registrando cada documento en Excel o en tu sistema.
                </p>
              </motion.div>

              {/* Problema */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="space-y-8"
              >
                <h2 className="text-4xl font-bold">
                  Y cuando por fin tienes los datos...
                </h2>
                <p className="text-2xl text-muted-foreground leading-relaxed">
                  Ya es muy tarde. El análisis llega con un mes de retraso, y recién ahí te enteras que un insumo subió de precio y has estado perdiendo margen todo este tiempo.
                </p>
              </motion.div>

              {/* Solución */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="space-y-8"
              >
                <h2 className="text-4xl font-bold">
                  Ruka lo hace todo automático
                </h2>
                <div className="space-y-6 text-2xl text-muted-foreground leading-relaxed">
                  <p>
                    ✓ Registra tus documentos automáticamente
                  </p>
                  <p>
                    ✓ Agrupa tus insumos maestros
                  </p>
                  <p>
                    ✓ Monitorea precios en tiempo real
                  </p>
                  <p>
                    ✓ Te alerta ante cualquier subida
                  </p>
                  <p>
                    ✓ Se integra con tu POS o ERP
                  </p>
                </div>
              </motion.div>

              {/* Beneficio Final */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="space-y-8"
              >
                <h2 className="text-4xl font-bold">
                  Sin contratar más personal
                </h2>
                <p className="text-2xl text-muted-foreground leading-relaxed">
                  Olvídate de gastar en más personal para tener mejores datos. Ruka hace el trabajo por ti, 24/7, sin errores y en tiempo real.
                </p>
              </motion.div>
            </div>

            {/* Form Sticky */}
            <div className="hidden lg:block">
              <div className="sticky top-24">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white rounded-xl shadow-xl border p-8 space-y-8"
                >
                  <div className="space-y-4">
                    <h2 className="text-2xl font-semibold">Comienza tu Prueba Gratuita</h2>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>Setup en menos de 10 minutos</span>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                      name="nombreRestaurante"
                      placeholder="Nombre del Restaurante"
                      value={formData.nombreRestaurante}
                      onChange={handleChange}
                      required
                    />
                    <Input
                      name="nombre"
                      placeholder="Tu Nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      required
                    />
                    <Input
                      name="email"
                      type="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                    <Input
                      name="ciudad"
                      placeholder="Ciudad"
                      value={formData.ciudad}
                      onChange={handleChange}
                      required
                    />
                    <Button type="submit" className="w-full gap-2 h-12 text-lg">
                      Comenzar Ahora <ArrowRight className="w-5 h-5" />
                    </Button>
                  </form>

                  <div className="flex items-center gap-3">
                    <UtensilsCrossed className="w-8 h-8 text-primary" />
                    <p className="text-sm text-muted-foreground">
                      Únete a los restaurantes que ya automatizaron su control de costos
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Form para móvil */}
            <div className="lg:hidden">
              {/* ... mismo contenido del form pero sin sticky ... */}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
