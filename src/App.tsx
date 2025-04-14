
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from "@/components/theme-provider"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/toaster"

import Index from './pages/Index';
import Restaurantes from './pages/Restaurantes';
import Hoteles from './pages/Hoteles';
import AboutUs from './pages/AboutUs';
import TermsAndConditions from './pages/TermsAndConditions';
import OnboardingSuccess from './pages/OnboardingSuccess';
import NotFound from './pages/NotFound';
import PrivacyPolicy from './pages/PrivacyPolicy';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="ruka-theme">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/restaurantes" element={<Restaurantes />} />
            <Route path="/hoteles" element={<Hoteles />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/terms" element={<TermsAndConditions />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/onboarding-success" element={<OnboardingSuccess />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
