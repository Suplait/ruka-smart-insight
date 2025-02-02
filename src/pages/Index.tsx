import Hero from "@/components/Hero";
import Partners from "@/components/Partners";
import Features from "@/components/Features";
import ProductShowcase from "@/components/ProductShowcase";
import BeforeAfter from "@/components/BeforeAfter";
import Testimonials from "@/components/Testimonials";
import Stats from "@/components/Stats";
import CTA from "@/components/CTA";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Hero />
      <Partners />
      <Features />
      <ProductShowcase />
      <BeforeAfter />
      <Stats />
      <Testimonials />
      <CTA />
    </main>
  );
};

export default Index;