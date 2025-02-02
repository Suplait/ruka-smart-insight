import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Partners from "@/components/Partners";
import BeforeAfter from "@/components/BeforeAfter";
import ValueShowcase from "@/components/ValueShowcase";
import Features from "@/components/Features";
import ProductShowcase from "@/components/ProductShowcase";
import Testimonials from "@/components/Testimonials";
import Stats from "@/components/Stats";
import FAQ from "@/components/FAQ";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import MoneyBackGuarantee from "@/components/MoneyBackGuarantee";

const Index = () => {
  return (
    <main className="min-h-screen pt-16">
      <Navbar />
      <Hero />
      <Partners />
      <BeforeAfter />
      <Stats />
      <ValueShowcase />
      <ProductShowcase />
      <Features />
      <MoneyBackGuarantee />
      <Testimonials />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  );
};

export default Index;