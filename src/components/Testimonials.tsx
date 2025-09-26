
import React, { useRef } from "react";
import { Star } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const testimonials = [
  {
    name: "Hernan Sugg",
    role: "Socio",
    company: "Barbazul",
    content: "Información inmediata de volúmenes de compra, evolución de precios y control de pagos. Ahorro de HH en planillas.",
    rating: 5,
  },
  {
    name: "Esteban Hojas",
    role: "Socio",
    company: "Ottoburguer",
    content: "Me ayuda a saber la cantidad de facturas y compras mensuales por proveedor. Ahora puedo saber de una si me están cobrando de más.",
    rating: 5,
  },
  {
    name: "Alphonse Reynes",
    role: "Gerencia",
    company: "Grupo Melting cook",
    content: "Ruka es fundamental en nuestra operación. Además, tienen un servicio al cliente de otro nivel.",
    rating: 5,
  },
];

export default function Testimonials() {
  const plugin = useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  );

  return (
    <section id="testimonials" className="py-32 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <h2 className="text-4xl lg:text-6xl font-thin text-gray-900 tracking-tight text-center mb-20">
          Lo que dicen nuestros{" "}
          <span className="font-light bg-gradient-to-r from-primary via-primary to-primary/80 bg-clip-text text-transparent">
            clientes
          </span>
        </h2>
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-gray-50/50 to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-gray-50/50 to-transparent z-10" />
          <Carousel 
            className="w-full max-w-6xl mx-auto"
            plugins={[plugin.current]}
            opts={{
              align: "start",
              loop: true,
            }}
          >
            <CarouselContent>
              {[...testimonials, ...testimonials].map((testimonial, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 pl-4">
                  <div className="p-8 bg-white/60 backdrop-blur-xl rounded-3xl border border-gray-200/50 space-y-6 h-full hover:bg-white/80 transition-all duration-500 hover:scale-[1.02]">
                    <div className="flex gap-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                      ))}
                    </div>
                    <p className="text-lg font-light text-gray-700 leading-relaxed">{testimonial.content}</p>
                    <div>
                      <p className="font-medium text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-gray-600 font-light">
                        {testimonial.role}, {testimonial.company}
                      </p>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </section>
  );
}
