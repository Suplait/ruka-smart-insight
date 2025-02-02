import { useEffect, useLocation } from "react-router-dom";
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
  const location = useLocation();

  useEffect(() => {
    if (location.state?.scrollTo) {
      const element = document.getElementById(location.state.scrollTo);
      element?.scrollIntoView({ behavior: "smooth" });
    }
  }, [location]);

  return (
    <main className="min-h-screen pt-16">
      <Navbar />
      <Hero />
      <Partners />
      <BeforeAfter />
      <Features />
      <ProductShowcase />
      <MoneyBackGuarantee />
      <ValueShowcase />
      <Stats />
      <Testimonials />
      <CTA />
      <Footer />
    </main>
  );
};

export default Index;