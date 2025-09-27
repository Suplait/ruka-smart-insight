
import { Play, Youtube } from "lucide-react";
import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function YouTubeDemo() {
  const [isPlaying, setIsPlaying] = useState(false);
  const handlePlayVideo = () => {
    setIsPlaying(true);
  };
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  const orbOneY = useTransform(scrollYProgress, [0, 1], [30, -20]);
  const orbTwoY = useTransform(scrollYProgress, [0, 1], [-15, 25]);
  const orbThreeY = useTransform(scrollYProgress, [0, 1], [20, -35]);

  return <motion.section ref={containerRef} className="py-32 bg-gray-50/50 relative overflow-hidden">
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-white via-primary/5 to-transparent"
        style={{ opacity: useTransform(scrollYProgress, [0, 1], [0.3, 0.6]) }}
      />
      <motion.div
        className="absolute top-12 left-6 w-28 h-28 md:w-36 md:h-36 bg-gradient-to-br from-blue-400/15 via-indigo-400/10 to-purple-400/15 rounded-full blur-3xl"
        animate={{
          x: [0, 25, -15, 0],
          y: [0, -30, -5, 0],
          scale: [1, 1.08, 1.02, 1]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        style={{ y: orbOneY }}
      />
      <motion.div
        className="absolute bottom-16 right-10 w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-rose-400/15 via-pink-400/15 to-orange-400/15 rounded-full blur-3xl"
        animate={{
          x: [0, -20, 10, 0],
          y: [0, 25, -10, 0],
          scale: [1, 0.94, 1.06, 1]
        }}
        transition={{ duration: 13, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
        style={{ y: orbTwoY }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 w-20 h-20 md:w-28 md:h-28 bg-gradient-to-br from-emerald-400/15 via-teal-400/15 to-sky-400/15 rounded-full blur-2xl"
        animate={{
          x: [0, 18, -12, 0],
          y: [0, -18, 15, 0],
          scale: [1, 1.1, 0.96, 1]
        }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
        style={{ y: orbThreeY }}
      />
      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
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
          <motion.div className="relative aspect-video rounded-3xl overflow-hidden bg-black border border-white/10 shadow-2xl group hover:shadow-3xl transition-all duration-500" style={{ y: useTransform(scrollYProgress, [0, 1], [0, -20]) }}>
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
          </motion.div>
          
          <div className="text-center mt-12">
            
          </div>
        </div>
      </div>
    </motion.section>;
}
