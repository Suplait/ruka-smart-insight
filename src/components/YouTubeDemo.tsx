
import { Play, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function YouTubeDemo() {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayVideo = () => {
    setIsPlaying(true);
  };

  return (
    <section className="py-24 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05)_0%,transparent_50%)]" />
      
      <div className="container relative">
        <div className="text-center mb-16 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-indigo-600/10 text-blue-700 border border-blue-200/50">
            <Youtube className="w-4 h-4" />
            Demo de la Plataforma
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold">
            Ve Ruka.ai en
            <span className="bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent"> Funcionamiento</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Descubre cómo nuestra plataforma inteligente transforma la gestión de tu negocio
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="relative aspect-video rounded-3xl overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 shadow-2xl border border-gray-200/50 group">
            {!isPlaying ? (
              <div className="absolute inset-0 flex items-center justify-center cursor-pointer" onClick={handlePlayVideo}>
                {/* Thumbnail Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-slate-900/20 to-indigo-900/20" />
                
                {/* Play Button */}
                <div className="relative z-10 group-hover:scale-110 transition-transform duration-300">
                  <div className="w-24 h-24 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center shadow-2xl">
                    <Play className="w-10 h-10 text-white ml-1" fill="white" />
                  </div>
                </div>
                
                {/* Overlay Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center space-y-4 bg-black/40">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40" />
                  <div className="relative z-10 space-y-4">
                    <h3 className="text-2xl font-bold">Demo Completo de Ruka.ai</h3>
                    <p className="text-lg opacity-90 max-w-lg">
                      Mira cómo automatizamos completamente la gestión de tu negocio
                    </p>
                    <div className="flex items-center justify-center gap-2 text-blue-400">
                      <Youtube className="w-5 h-5" />
                      <span className="text-sm font-medium">Ver Demo Completo</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <iframe
                src="https://www.youtube.com/embed/5Mgdczprvlc?autoplay=1&t=1s"
                title="Ruka.ai Demo"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}
            
            {/* Premium Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-slate-500/20 rounded-3xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
          </div>
          
          <div className="text-center mt-12">
            <Button 
              size="lg" 
              variant="outline" 
              className="gap-2 border-blue-200 hover:border-blue-300 hover:bg-blue-50 text-blue-700"
              onClick={handlePlayVideo}
            >
              <Youtube className="w-5 h-5" />
              Ver Demo Completo
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
