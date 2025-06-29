
import { Bot, Brain, Clock, LineChart } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useState } from "react";

export default function Features() {
  const [videoStates, setVideoStates] = useState<{[key: string]: {loaded: boolean, error: boolean}}>({});

  const features = [
    {
      icon: Bot,
      title: "Agentes Autónomos 24/7",
      description: "Automatiza tareas repetitivas mientras reduces costos operativos y errores humanos"
    },
    {
      icon: Brain,
      title: "IA que Aprende de tu Negocio",
      description: "Nuestros agentes se adaptan a tus procesos para entregarte insights más precisos cada día"
    },
    {
      icon: Clock,
      title: "Información al Instante",
      description: "Accede a tus datos en tiempo real para tomar decisiones informadas cuando las necesites"
    },
    {
      icon: LineChart,
      title: "Control Total",
      description: "Visualiza y optimiza tu margen operativo con datos actualizados y reportes detallados"
    }
  ];

  const agentVideos = [
    { title: "Digita y Limpia", desc: "Reduce a 0 el tiempo de registrar tus compras", videoSrc: "/robot_facturas.mp4", id: "facturas" },
    { title: "Agrupa y Clasifica", desc: "Crea automáticamente un maestro de insumos", videoSrc: "/robot_cajas.mp4", id: "cajas" },
    { title: "Monitorea 24/7", desc: "Alerta en inmediato ante anomalías que afecten tu margen", videoSrc: "/robot_grafico2.mp4", id: "grafico" }
  ];

  const handleVideoLoad = (videoId: string) => {
    console.log(`Features video ${videoId} loaded successfully`);
    setVideoStates(prev => ({
      ...prev,
      [videoId]: { loaded: true, error: false }
    }));
  };

  const handleVideoError = (videoId: string, e: any) => {
    console.error(`Features video ${videoId} error:`, e);
    setVideoStates(prev => ({
      ...prev,
      [videoId]: { loaded: false, error: true }
    }));
  };

  return (
    <section id="features" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-white via-secondary/30 to-white" />
      <div className="container relative">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl font-bold">
            Agentes Inteligentes que Trabajan por Ti
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Imagina tener un equipo que trabaja 24/7 registrando compras, agrupando insumos maestros, monitoreando precios, alertando anomalías y detectando oportunidades.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {agentVideos.map((agent, i) => {
            const videoState = videoStates[agent.id] || { loaded: false, error: false };
            return (
              <div key={i} className="relative rounded-2xl overflow-hidden bg-white shadow-xl hover:shadow-2xl transition-all duration-300 group border border-gray-100">
                <div className="aspect-[4/3] relative bg-gradient-to-br from-gray-50 to-gray-100">
                  {videoState.error ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-12 h-12 mx-auto mb-3 bg-gray-300 rounded-full flex items-center justify-center">
                          <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <p className="text-gray-500 text-sm">Error al cargar</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <video 
                        autoPlay 
                        loop 
                        muted 
                        playsInline
                        preload="metadata"
                        onLoadedData={() => handleVideoLoad(agent.id)}
                        onError={(e) => handleVideoError(agent.id, e)}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                      >
                        <source src={agent.videoSrc} type="video/mp4" />
                      </video>
                      {!videoState.loaded && (
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse flex items-center justify-center">
                          <div className="text-center">
                            <div className="w-8 h-8 mx-auto mb-2 bg-gray-300 rounded-full animate-spin border-2 border-transparent border-t-gray-400"></div>
                            <p className="text-gray-500 text-xs">Cargando...</p>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end">
                  <div className="p-6 text-white">
                    <h4 className="text-lg font-semibold mb-2">{agent.title}</h4>
                    <p className="text-sm opacity-90">{agent.desc}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="my-16"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="p-6 bg-white/80 backdrop-blur hover:scale-105 transition-all duration-300 border-primary/10 group shadow-lg hover:shadow-xl"
            >
              <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-12 h-12 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
