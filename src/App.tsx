
import React, { useEffect } from 'react';
import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from "@/components/theme-provider"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/toaster"
import { MarketingWhatsAppButton } from '@/components/MarketingWhatsAppButton';
import { extractUTMParams, saveUTMParams } from '@/utils/utmTracker';

import Index from './pages/Index';
import LandingV2 from './pages/LandingV2';
import Restaurantes from './pages/Restaurantes';
import Hoteles from './pages/Hoteles';
import Retail from './pages/Retail';
import ProductoEjemplo from './pages/ProductoEjemplo';
import CuentasPorPagar from './pages/CuentasPorPagar';
import Stock from './pages/Stock';
import PanelControl from './pages/PanelControl';
import Register from './pages/Register';
import AboutUs from './pages/AboutUs';
import TermsAndConditions from './pages/TermsAndConditions';
import OnboardingSuccess from './pages/OnboardingSuccess';
import NotFound from './pages/NotFound';
import PrivacyPolicy from './pages/PrivacyPolicy';
import WhatsappRedirect from './pages/WhatsappRedirect';
import CalendlySuccess from './pages/CalendlySuccess';
import Webinar from './pages/Webinar';
import Works from './pages/Works';
import WorksContact from './pages/WorksContact';

const queryClient = new QueryClient();

function App() {
  useEffect(() => {
    // Capture UTM parameters on app load
    const utmParams = extractUTMParams();
    saveUTMParams(utmParams);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="ruka-theme">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingV2 />} />
            <Route path="/v2" element={<Navigate to="/" replace />} />
            <Route path="/home-anterior" element={<Index />} />
            <Route path="/restaurantes" element={<Restaurantes />} />
            <Route path="/hoteles" element={<Hoteles />} />
            <Route path="/retail" element={<Retail />} />
            <Route path="/productos/ejemplo" element={<ProductoEjemplo />} />
            <Route path="/productos/panel-control" element={<PanelControl />} />
            <Route path="/productos/cuentas-por-pagar" element={<CuentasPorPagar />} />
            <Route path="/productos/stock" element={<Stock />} />
            <Route path="/register" element={<Register />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/terms" element={<TermsAndConditions />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/onboarding-success" element={<OnboardingSuccess />} />
            <Route path="/calendly-success" element={<CalendlySuccess />} />
            <Route path="/whatsapp" element={<WhatsappRedirect />} />
            <Route path="/webinar" element={<Webinar />} />
            <Route path="/works" element={<Works />} />
            <Route path="/works/contacto" element={<WorksContact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <MarketingWhatsAppButton />
        </BrowserRouter>
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
