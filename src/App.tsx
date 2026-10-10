
import React, { useEffect, useLayoutEffect } from 'react';
import { BrowserRouter, Navigate, Routes, Route, useLocation } from 'react-router-dom';
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
import ConciliacionAutomatica from './pages/ConciliacionAutomatica';
import Integraciones from './pages/Integraciones';
import Stock from './pages/Stock';
import PanelControl from './pages/PanelControl';
import RegistroDeCompras from './pages/RegistroDeCompras';
import Register from './pages/Register';
import AboutUs from './pages/AboutUs';
import TermsAndConditions from './pages/TermsAndConditions';
import OnboardingSuccess from './pages/OnboardingSuccess';
import NotFound from './pages/NotFound';
import PrivacyPolicy from './pages/PrivacyPolicy';
import WhatsappRedirect from './pages/WhatsappRedirect';
import CalendlySuccess from './pages/CalendlySuccess';
import Webinar from './pages/Webinar';
import One from './pages/One';
import OneContact from './pages/OneContact';
import BlogIndex from './pages/BlogIndex';
import BlogArticle from './pages/BlogArticle';

const queryClient = new QueryClient();

const resetPageScroll = () => {
  const previousScrollBehavior = document.documentElement.style.scrollBehavior;
  document.documentElement.style.scrollBehavior = "auto";
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
  window.scrollTo(0, 0);
  document.documentElement.style.scrollBehavior = previousScrollBehavior;
};

function ScrollToTopOnRouteChange() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const previousScrollRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";

    return () => {
      window.history.scrollRestoration = previousScrollRestoration;
    };
  }, []);

  useLayoutEffect(() => {
    if (hash) return;
    resetPageScroll();
  }, [pathname, hash]);

  useEffect(() => {
    if (hash) return;

    const frame = window.requestAnimationFrame(resetPageScroll);
    const timeout = window.setTimeout(resetPageScroll, 100);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timeout);
    };
  }, [pathname, hash]);

  return null;
}

function LegacyOneRedirect() {
  const location = useLocation();
  const rawSuffix = location.pathname.slice('/works'.length);
  const suffix = rawSuffix === '/' ? '' : rawSuffix.replace(/\/$/, '');

  return (
    <Navigate
      replace
      to={{
        pathname: `/one${suffix}`,
        search: location.search,
        hash: location.hash,
      }}
    />
  );
}

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
          <ScrollToTopOnRouteChange />
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
            <Route path="/productos/registro-de-compras" element={<RegistroDeCompras />} />
            <Route path="/productos/conciliacion-automatica" element={<ConciliacionAutomatica />} />
            <Route path="/productos/stock" element={<Stock />} />
            <Route path="/precios" element={<Navigate to="/#precios" replace />} />
            <Route path="/integraciones" element={<Integraciones />} />
            <Route path="/register" element={<Register />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/terms" element={<TermsAndConditions />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/onboarding-success" element={<OnboardingSuccess />} />
            <Route path="/calendly-success" element={<CalendlySuccess />} />
            <Route path="/whatsapp" element={<WhatsappRedirect />} />
            <Route path="/webinar" element={<Webinar />} />
            <Route path="/one" element={<One />} />
            <Route path="/one/contacto" element={<OneContact />} />
            <Route path="/blog" element={<BlogIndex />} />
            <Route path="/blog/:slug" element={<BlogArticle />} />
            <Route path="/works/*" element={<LegacyOneRedirect />} />
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
