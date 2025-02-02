import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Partners from "@/components/Partners";
import DataFlowSection from "@/components/DataFlowSection";
import BeforeAfter from "@/components/BeforeAfter";
import Features from "@/components/Features";
import ProductShowcase from "@/components/ProductShowcase";
import ValueShowcase from "@/components/ValueShowcase";
import ValueProposition from "@/components/ValueProposition";
import Stats from "@/components/Stats";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import MoneyBackGuarantee from "@/components/MoneyBackGuarantee";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default function Index() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);

  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Partners />
      <DataFlowSection />
      <BeforeAfter />
      <Features />
      <ProductShowcase />
      <ValueShowcase />
      <ValueProposition />
      <Stats />
      <Testimonials />
      <FAQ />
      <MoneyBackGuarantee />
      <CTA />
      <Footer />
    </main>
  );
}