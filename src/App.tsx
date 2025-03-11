
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Index from "@/pages/Index";
import Restaurantes from "@/pages/Restaurantes";
import AboutUs from "@/pages/AboutUs";
import NotFound from "@/pages/NotFound";
import OnboardingSuccess from "@/pages/OnboardingSuccess";
import TermsAndConditions from "@/pages/TermsAndConditions";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/restaurantes" element={<Restaurantes />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/onboarding-success" element={<OnboardingSuccess />} />
        <Route path="/terms" element={<TermsAndConditions />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
