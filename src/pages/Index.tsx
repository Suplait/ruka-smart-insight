import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import BeforeAfter from "@/components/BeforeAfter";
import Features from "@/components/Features";
import Stats from "@/components/Stats";
import ProductShowcase from "@/components/ProductShowcase";
import ValueShowcase from "@/components/ValueShowcase";
import MoneyBackGuarantee from "@/components/MoneyBackGuarantee";
import Testimonials from "@/components/Testimonials";
import Partners from "@/components/Partners";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen pt-16">
      <Navbar />
      <Hero />
      <Partners />
      <BeforeAfter />
      <Features />
      <ProductShowcase />
      <ValueShowcase />
      <Stats />
      <MoneyBackGuarantee />
      <Testimonials />
      <CTA />
      <Footer />
    </main>
  );
};

export default Index;