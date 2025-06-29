
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import YouTubeDemo from "@/components/YouTubeDemo";
import DataFlowSection from "@/components/DataFlowSection";
import AgentShowcase from "@/components/AgentShowcase";
import Partners from "@/components/Partners";
import Features from "@/components/Features";
import MoneyBackGuarantee from "@/components/MoneyBackGuarantee";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
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
    } else if (!location.state?.scrollTo) {
      window.scrollTo(0, 0);
    }
  }, [location]);

  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Stats />
      <YouTubeDemo />
      <DataFlowSection />
      <AgentShowcase />
      <Partners />
      <Features />
      <MoneyBackGuarantee />
      <Testimonials />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  );
}
