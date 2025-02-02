import { Star } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

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
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-secondary/30">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-16 animate-fade-in">
          Lo que dicen nuestros clientes
        </h2>
        <Carousel className="w-full max-w-4xl mx-auto">
          <CarouselContent>
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index}>
                <div className="p-8 bg-white rounded-xl shadow-lg space-y-6 mx-4">
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
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
}