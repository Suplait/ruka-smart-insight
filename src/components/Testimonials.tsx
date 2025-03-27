
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
    name: "Hernan Sugg",
    role: "Partner",
    company: "Barbazul",
    content: "Immediate information on purchase volumes, price evolution, and payment control. Savings in hours on spreadsheets.",
    rating: 5,
  },
  {
    name: "Esteban Hojas",
    role: "Partner",
    company: "Ottoburguer",
    content: "It helps me know the number of invoices and monthly purchases per supplier. Now I can instantly tell if I'm being overcharged.",
    rating: 5,
  },
  {
    name: "Alphonse Reynes",
    role: "Management",
    company: "Melting Cook Group",
    content: "Ruka is fundamental to our operation. Plus, they have next-level customer service.",
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
        <h2 className="text-4xl font-bold text-center mb-16">
          What our clients say
        </h2>
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-secondary/30 to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-secondary/30 to-transparent z-10" />
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
                  <div className="p-8 bg-white rounded-xl shadow-lg space-y-6 h-full hover:scale-105 transition-transform duration-300">
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
      </div>
    </section>
  );
}
