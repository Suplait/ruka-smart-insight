
import { Star } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useRef } from "react";
import { useTranslation } from "react-i18next";

const Testimonials = () => {
  const { t } = useTranslation();
  const plugin = useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  );

  const testimonials = [
    {
      name: "Hernan Sugg",
      role: "Socio",
      company: "Barbazul",
      content: t('restaurants.testimonials.hernan'),
      rating: 5,
    },
    {
      name: "Esteban Hojas",
      role: "Socio",
      company: "Ottoburguer",
      content: t('restaurants.testimonials.esteban'),
      rating: 5,
    },
    {
      name: "Alphonse Reynes",
      role: "Gerencia",
      company: "Grupo Melting cook",
      content: t('restaurants.testimonials.alphonse'),
      rating: 5,
    },
  ];

  return (
    <section id="testimonials" className="py-24 bg-secondary/30">
      <div className="container">
        <h2 className="text-4xl font-bold text-center mb-16">
          {t('restaurants.testimonials_title')}
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
};

export default Testimonials;
