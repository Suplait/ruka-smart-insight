import { Star } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useRef } from "react";

const testimonials = [
  {
    name: "Juan Pérez",
    role: "Gerente de Operaciones",
    company: "Restaurantes ABC",
    content: "Ruka nos ha permitido reducir nuestros costos operativos en un 30%. La automatización es increíble.",
    rating: 5,
  },
  {
    name: "María González",
    role: "Directora Financiera",
    company: "Hotel Santiago",
    content: "Antes tardábamos un mes en procesar todos los datos. Con Ruka lo hacemos en tiempo real.",
    rating: 5,
  },
  {
    name: "Carlos Rodríguez",
    role: "Dueño",
    company: "Distribuidora Central",
    content: "La mejor inversión que hemos hecho. El ROI fue evidente desde el primer mes.",
    rating: 5,
  },
  // Duplicated for infinite scroll effect
  {
    name: "Ana Silva",
    role: "Gerente General",
    company: "Importadora Sur",
    content: "La facilidad de uso y la precisión de los datos nos han ayudado a crecer de manera sostenible.",
    rating: 5,
  },
  {
    name: "Roberto Muñoz",
    role: "Director Comercial",
    company: "Comercial Express",
    content: "El soporte es excelente y los agentes nos han ahorrado cientos de horas de trabajo manual.",
    rating: 5,
  },
];

export default function Testimonials() {
  const plugin = useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  );

  return (
    <section id="testimonials" className="py-24 bg-secondary/30">
      <div className="container">
        <h2 className="text-4xl font-bold text-center mb-16 animate-fade-in">
          Lo que dicen nuestros clientes
        </h2>
        <Carousel 
          className="w-full max-w-4xl mx-auto"
          plugins={[plugin.current]}
          opts={{
            align: "start",
            loop: true,
          }}
        >
          <CarouselContent>
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-8 bg-white rounded-xl shadow-lg space-y-6 mx-4 h-full hover:scale-105 transition-transform duration-300">
                  <div className="flex gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-lg italic">{testimonial.content}</p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role}, {testimonial.company}
                    </p>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}