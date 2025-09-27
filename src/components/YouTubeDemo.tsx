
import { Play, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
export default function YouTubeDemo() {
  const [isPlaying, setIsPlaying] = useState(false);
  const handlePlayVideo = () => {
    setIsPlaying(true);
  };
  return <section className="py-32 bg-gray-50/50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="text-center mb-20 space-y-6">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/60 backdrop-blur-xl border border-gray-200/50 text-gray-700 shadow-sm">
            <Youtube className="w-4 h-4" />
            <span className="font-light">Demo de la Plataforma</span>
          </div>
          <h2 className="text-4xl lg:text-6xl font-thin text-gray-900 tracking-tight">
            Ve{" "}
            <span className="font-light bg-gradient-to-r from-primary via-primary to-primary/80 bg-clip-text text-transparent">
              Ruka.ai
            </span>{" "}
            en Funcionamiento
          </h2>
          <p className="text-xl text-gray-600 font-light max-w-2xl mx-auto">
            Descubre cómo nuestra plataforma inteligente transforma la gestión de tu negocio
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="relative aspect-video rounded-3xl overflow-hidden bg-black border border-white/10 shadow-2xl group hover:shadow-3xl transition-all duration-500">
            {!isPlaying ? <div className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black" onClick={handlePlayVideo}>
                <img 
                  src="https://img.youtube.com/vi/g-xbad__wQQ/maxresdefault.jpg"
                  alt="Ruka.ai Demo Thumbnail"
                  className="absolute inset-0 w-full h-full object-cover opacity-40"
                />
                <div className="absolute inset-0 bg-black" />
                <div className="relative z-10 group-hover:scale-110 transition-transform duration-300">
                  <div className="w-24 h-24 bg-primary hover:bg-primary/90 rounded-full flex items-center justify-center shadow-2xl border border-white/10">
                    <Play className="w-10 h-10 text-white ml-1" fill="white" />
                  </div>
                </div>
              </div> : <iframe src="https://www.youtube.com/embed/g-xbad__wQQ?autoplay=1" title="Ruka.ai Demo" className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />}
            
            {/* Premium Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 rounded-3xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
          </div>
          
          <div className="text-center mt-12">
            
          </div>
        </div>
      </div>
    </section>;
}
